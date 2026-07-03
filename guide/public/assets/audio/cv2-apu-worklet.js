const CPU_CLOCK = 1789773;
const FRAME_RATE = 60.098813897;

const PULSE_DUTIES = [
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 1, 1]
];

const TRIANGLE_TABLE = [
  15, 14, 13, 12, 11, 10, 9, 8,
  7, 6, 5, 4, 3, 2, 1, 0,
  0, 1, 2, 3, 4, 5, 6, 7,
  8, 9, 10, 11, 12, 13, 14, 15
];

const LENGTH_TABLE = [
  10, 254, 20, 2, 40, 4, 80, 6,
  160, 8, 60, 10, 14, 12, 26, 14,
  12, 16, 24, 18, 48, 20, 96, 22,
  192, 24, 72, 26, 16, 28, 32, 30
];

const NOISE_PERIODS = [
  4, 8, 16, 32, 64, 96, 128, 160,
  202, 254, 380, 508, 762, 1016, 2034, 4068
];

const DMC_PERIODS = [
  428, 380, 340, 320, 286, 254, 226, 214,
  190, 160, 142, 128, 106, 85, 72, 54
];

const QUARTER_FRAME_CYCLES = CPU_CLOCK / 240;

class Cv2ApuProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.regs = new Uint8Array(0x18);
    this.trackFrames = [];
    this.samplesPerFrame = sampleRate / FRAME_RATE;
    this.cpuCyclesPerSample = CPU_CLOCK / sampleRate;
    this.reportCountdown = 0;
    this.dmcSamples = [];
    this.resetPlaybackState();
    this.resetApuState();
    this.port.onmessage = (event) => this.onMessage(event.data);
  }

  createEnvelope() {
    return {
      start: false,
      divider: 0,
      decay: 0
    };
  }

  resetPlaybackState() {
    this.cursor = 0;
    this.startFrame = 0;
    this.endFrame = 0;
    this.loopStartFrame = 0;
    this.loopEndFrame = 0;
    this.loopCount = 0;
    this.canLoop = true;
    this.finished = false;
    this.writeCount = 0;
    this.samplesUntilFrame = 0;
    this.playing = false;
    this.position = {
      sourceFrame: 0,
      loopCount: 0
    };
  }

  resetApuState() {
    this.pulsePhase = [0, 0];
    this.pulseTimers = [0, 0];
    this.sweepDividers = [0, 0];
    this.sweepReload = [false, false];
    this.trianglePhase = 0;
    this.lengthCounters = [0, 0, 0, 0];
    this.envelopes = [
      this.createEnvelope(),
      this.createEnvelope(),
      this.createEnvelope()
    ];
    this.triangleLinearCounter = 0;
    this.triangleLinearReload = false;
    this.frameCounterCycles = 0;
    this.quarterFrameIndex = 0;
    this.noiseLfsr = 1;
    this.noiseTimer = 0;
    this.noiseValue = 0;
    this.dmcOutputLevel = this.regs[0x11] & 0x7f;
    this.dmcTimer = 0;
    this.dmcCurrentAddress = this.dmcSampleAddress();
    this.dmcBytesRemaining = 0;
    this.dmcSampleBuffer = 0;
    this.dmcSampleBufferEmpty = true;
    this.dmcShiftRegister = 0;
    this.dmcBitsRemaining = 0;
    this.dmcSilence = true;
  }

  onMessage(message) {
    if (message.type === 'reset') {
      this.regs.fill(0);
      this.trackFrames = [];
      this.dmcSamples = [];
      this.resetPlaybackState();
      this.resetApuState();
      return;
    }
    if (message.type === 'play') {
      this.finished = false;
      this.playing = this.trackFrames.length > 0;
      return;
    }
    if (message.type === 'stop') {
      this.playing = false;
      this.regs.fill(0);
      this.resetApuState();
      this.finished = false;
      this.position = {
        sourceFrame: this.startFrame,
        loopCount: this.loopCount
      };
      return;
    }
    if (message.type === 'track') {
      this.playing = false;
      this.regs.fill(0);
      this.dmcSamples = (message.dmcSamples || []).map((sample) => ({
        address: sample.address & 0xffff,
        length: sample.length | 0,
        bytes: sample.bytes || []
      }));
      this.resetApuState();
      this.trackFrames = message.frames || [];
      this.startFrame = message.startFrame || 0;
      this.endFrame = message.endFrame || this.trackFrames.length;
      this.loopStartFrame = message.loopStartFrame || this.startFrame;
      this.loopEndFrame = message.loopEndFrame || this.endFrame;
      this.canLoop = message.canLoop !== false;
      this.cursor = this.startFrame;
      this.loopCount = 0;
      this.finished = false;
      this.writeCount = 0;
      this.samplesUntilFrame = 0;
      this.position = {
        sourceFrame: this.startFrame,
        loopCount: 0
      };
    }
  }

  lengthValue(registerValue) {
    return LENGTH_TABLE[(registerValue >> 3) & 0x1f] || 0;
  }

  writeRegister(registerIndex, value) {
    if (registerIndex < 0 || registerIndex >= this.regs.length) return;
    const registerValue = value & 0xff;
    this.regs[registerIndex] = registerValue;
    switch (registerIndex) {
      case 0x01:
        this.sweepReload[0] = true;
        break;
      case 0x03:
        this.pulseTimers[0] = ((registerValue & 0x07) << 8) | (this.pulseTimers[0] & 0xff);
        this.lengthCounters[0] = this.lengthValue(registerValue);
        this.envelopes[0].start = true;
        this.pulsePhase[0] = 0;
        break;
      case 0x02:
        this.pulseTimers[0] = (this.pulseTimers[0] & 0x700) | registerValue;
        break;
      case 0x05:
        this.sweepReload[1] = true;
        break;
      case 0x07:
        this.pulseTimers[1] = ((registerValue & 0x07) << 8) | (this.pulseTimers[1] & 0xff);
        this.lengthCounters[1] = this.lengthValue(registerValue);
        this.envelopes[1].start = true;
        this.pulsePhase[1] = 0;
        break;
      case 0x06:
        this.pulseTimers[1] = (this.pulseTimers[1] & 0x700) | registerValue;
        break;
      case 0x0b:
        this.lengthCounters[2] = this.lengthValue(registerValue);
        this.triangleLinearReload = true;
        break;
      case 0x0f:
        this.lengthCounters[3] = this.lengthValue(registerValue);
        this.envelopes[2].start = true;
        break;
      case 0x11:
        this.dmcOutputLevel = registerValue & 0x7f;
        break;
      case 0x15:
        for (let channel = 0; channel < 4; channel += 1) {
          if (!(registerValue & (1 << channel))) this.lengthCounters[channel] = 0;
        }
        if (registerValue & 0x10) {
          if (this.dmcBytesRemaining === 0) this.startDmcSample();
        } else {
          this.dmcBytesRemaining = 0;
        }
        break;
      default:
        break;
    }
  }

  applyNextFrame() {
    if (!this.trackFrames.length) return;
    if (this.cursor >= this.endFrame) {
      if (!this.canLoop) {
        this.playing = false;
        this.finished = true;
        return;
      }
      this.cursor = this.loopStartFrame;
      this.loopCount += 1;
    }
    const sourceFrame = this.cursor;
    const writes = this.trackFrames[sourceFrame] || [];
    this.position = {
      sourceFrame,
      loopCount: this.loopCount
    };
    for (let index = 0; index < writes.length; index += 2) {
      this.writeRegister(writes[index], writes[index + 1]);
    }
    this.writeCount += writes.length / 2;
    this.cursor = sourceFrame + 1;
  }

  clockEnvelope(envelope, controlRegister) {
    const period = controlRegister & 0x0f;
    if (envelope.start) {
      envelope.start = false;
      envelope.decay = 15;
      envelope.divider = period;
      return;
    }
    if (envelope.divider > 0) {
      envelope.divider -= 1;
      return;
    }
    envelope.divider = period;
    if (envelope.decay > 0) {
      envelope.decay -= 1;
    } else if (controlRegister & 0x20) {
      envelope.decay = 15;
    }
  }

  envelopeVolume(index, controlRegister) {
    if (controlRegister & 0x10) return controlRegister & 0x0f;
    return this.envelopes[index].decay;
  }

  clockQuarterFrame() {
    this.clockEnvelope(this.envelopes[0], this.regs[0x00]);
    this.clockEnvelope(this.envelopes[1], this.regs[0x04]);
    this.clockEnvelope(this.envelopes[2], this.regs[0x0c]);
    if (this.triangleLinearReload) {
      this.triangleLinearCounter = this.regs[0x08] & 0x7f;
    } else if (this.triangleLinearCounter > 0) {
      this.triangleLinearCounter -= 1;
    }
    if (!(this.regs[0x08] & 0x80)) {
      this.triangleLinearReload = false;
    }
  }

  clockHalfFrame() {
    const haltRegisters = [
      this.regs[0x00],
      this.regs[0x04],
      this.regs[0x08] & 0x80,
      this.regs[0x0c]
    ];
    for (let channel = 0; channel < 4; channel += 1) {
      if (this.lengthCounters[channel] > 0 && !(haltRegisters[channel] & 0x20) && !(channel === 2 && haltRegisters[channel])) {
        this.lengthCounters[channel] -= 1;
      }
    }
    this.clockSweep(0);
    this.clockSweep(1);
  }

  sweepTarget(channel) {
    const timer = this.pulseTimers[channel] || 0;
    const register = this.regs[channel * 4 + 1];
    const shift = register & 0x07;
    const change = timer >> shift;
    if (register & 0x08) {
      return timer - change - (channel === 0 ? 1 : 0);
    }
    return timer + change;
  }

  clockSweep(channel) {
    const register = this.regs[channel * 4 + 1];
    const enabled = Boolean(register & 0x80);
    const period = (register >> 4) & 0x07;
    const shift = register & 0x07;
    const target = this.sweepTarget(channel);
    if (this.sweepDividers[channel] === 0) {
      if (enabled && shift > 0 && this.pulseTimers[channel] >= 8 && target <= 0x07ff && target >= 0) {
        this.pulseTimers[channel] = target;
      }
    }
    if (this.sweepDividers[channel] === 0 || this.sweepReload[channel]) {
      this.sweepDividers[channel] = period;
      this.sweepReload[channel] = false;
    } else {
      this.sweepDividers[channel] -= 1;
    }
  }

  clockFrameSequencer(cycles) {
    this.frameCounterCycles += cycles;
    while (this.frameCounterCycles >= QUARTER_FRAME_CYCLES) {
      this.frameCounterCycles -= QUARTER_FRAME_CYCLES;
      this.clockQuarterFrame();
      this.quarterFrameIndex = (this.quarterFrameIndex + 1) & 3;
      if (this.quarterFrameIndex === 0 || this.quarterFrameIndex === 2) {
        this.clockHalfFrame();
      }
    }
  }

  pulse(channel) {
    const offset = channel * 4;
    const enabled = this.regs[0x15] & (1 << channel);
    if (!enabled || this.lengthCounters[channel] === 0) return 0;
    const timer = this.pulseTimers[channel];
    if (timer < 8 || this.sweepTarget(channel) > 0x07ff) return 0;
    const frequency = CPU_CLOCK / (16 * (timer + 1));
    this.pulsePhase[channel] = (this.pulsePhase[channel] + frequency / sampleRate) % 1;
    const duty = PULSE_DUTIES[(this.regs[offset] >> 6) & 0x03];
    const step = Math.floor(this.pulsePhase[channel] * 8) & 7;
    const volume = this.envelopeVolume(channel, this.regs[offset]);
    return duty[step] ? volume : 0;
  }

  triangle() {
    if (!(this.regs[0x15] & 0x04)) return 0;
    if (this.lengthCounters[2] === 0 || this.triangleLinearCounter === 0) return 0;
    const timer = this.regs[0x0a] | ((this.regs[0x0b] & 0x07) << 8);
    if (timer < 2) return 0;
    const frequency = CPU_CLOCK / (32 * (timer + 1));
    this.trianglePhase = (this.trianglePhase + frequency / sampleRate) % 1;
    return TRIANGLE_TABLE[Math.floor(this.trianglePhase * 32) & 31];
  }

  stepNoise() {
    const mode = this.regs[0x0e] & 0x80;
    const tap = mode ? 6 : 1;
    const feedback = (this.noiseLfsr ^ (this.noiseLfsr >> tap)) & 1;
    this.noiseLfsr = (this.noiseLfsr >> 1) | (feedback << 14);
    this.noiseValue = (~this.noiseLfsr) & 1;
  }

  noise(cycles) {
    if (!(this.regs[0x15] & 0x08) || this.lengthCounters[3] === 0) return 0;
    const volume = this.envelopeVolume(2, this.regs[0x0c]);
    if (!volume) return 0;
    let remainingCycles = cycles;
    let weightedOutput = 0;
    while (remainingCycles > 0) {
      if (this.noiseTimer <= 0) {
        this.stepNoise();
        this.noiseTimer += NOISE_PERIODS[this.regs[0x0e] & 0x0f];
      }
      const span = Math.min(remainingCycles, this.noiseTimer);
      weightedOutput += (this.noiseValue ? volume : 0) * span;
      this.noiseTimer -= span;
      remainingCycles -= span;
    }
    return weightedOutput / cycles;
  }

  dmcSampleAddress() {
    return 0xc000 + ((this.regs[0x12] & 0xff) << 6);
  }

  dmcSampleLength() {
    return ((this.regs[0x13] & 0xff) << 4) + 1;
  }

  readDmcByte(address) {
    const addr = address & 0xffff;
    for (const sample of this.dmcSamples) {
      const offset = addr - sample.address;
      if (offset >= 0 && offset < sample.bytes.length) {
        return sample.bytes[offset] & 0xff;
      }
    }
    return 0;
  }

  startDmcSample() {
    this.dmcCurrentAddress = this.dmcSampleAddress();
    this.dmcBytesRemaining = this.dmcSampleLength();
    this.dmcSampleBufferEmpty = true;
    this.fillDmcSampleBuffer();
  }

  fillDmcSampleBuffer() {
    if (!this.dmcSampleBufferEmpty) return;
    if (this.dmcBytesRemaining === 0) {
      if (this.regs[0x10] & 0x40) {
        this.dmcCurrentAddress = this.dmcSampleAddress();
        this.dmcBytesRemaining = this.dmcSampleLength();
      } else {
        return;
      }
    }
    this.dmcSampleBuffer = this.readDmcByte(this.dmcCurrentAddress);
    this.dmcSampleBufferEmpty = false;
    this.dmcCurrentAddress = this.dmcCurrentAddress === 0xffff ? 0x8000 : ((this.dmcCurrentAddress + 1) & 0xffff);
    this.dmcBytesRemaining -= 1;
  }

  clockDmcBit() {
    if (this.dmcBitsRemaining === 0) {
      this.fillDmcSampleBuffer();
      if (this.dmcSampleBufferEmpty) {
        this.dmcSilence = true;
        return;
      }
      this.dmcSilence = false;
      this.dmcShiftRegister = this.dmcSampleBuffer;
      this.dmcBitsRemaining = 8;
      this.dmcSampleBufferEmpty = true;
      this.fillDmcSampleBuffer();
    }
    if (!this.dmcSilence) {
      if (this.dmcShiftRegister & 1) {
        if (this.dmcOutputLevel <= 125) this.dmcOutputLevel += 2;
      } else if (this.dmcOutputLevel >= 2) {
        this.dmcOutputLevel -= 2;
      }
    }
    this.dmcShiftRegister >>= 1;
    this.dmcBitsRemaining -= 1;
  }

  dmc(cycles) {
    let remainingCycles = cycles;
    while (remainingCycles > 0) {
      if (this.dmcTimer <= 0) {
        this.dmcTimer += DMC_PERIODS[this.regs[0x10] & 0x0f];
      }
      const span = Math.min(remainingCycles, this.dmcTimer);
      this.dmcTimer -= span;
      remainingCycles -= span;
      if (this.dmcTimer <= 0) {
        this.clockDmcBit();
      }
    }
    return this.dmcOutputLevel;
  }

  mix(pulseOne, pulseTwo, triangle, noise, dmc) {
    const pulseSum = pulseOne + pulseTwo;
    const pulseOut = pulseSum > 0 ? 95.88 / ((8128 / pulseSum) + 100) : 0;
    const tndInput = triangle / 8227 + noise / 12241 + dmc / 22638;
    const tndOut = tndInput > 0 ? 159.79 / ((1 / tndInput) + 100) : 0;
    return (pulseOut + tndOut) * 0.9;
  }

  process(inputs, outputs) {
    const output = outputs[0];
    const left = output[0];
    const right = output[1] || left;
    for (let i = 0; i < left.length; i += 1) {
      if (this.playing) {
        this.samplesUntilFrame -= 1;
        if (this.samplesUntilFrame <= 0) {
          this.applyNextFrame();
          this.samplesUntilFrame += this.samplesPerFrame;
        }
        this.clockFrameSequencer(this.cpuCyclesPerSample);
      }
      const pulseOne = this.playing ? this.pulse(0) : 0;
      const pulseTwo = this.playing ? this.pulse(1) : 0;
      const triangle = this.playing ? this.triangle() : 0;
      const noise = this.playing ? this.noise(this.cpuCyclesPerSample) : 0;
      const dmc = this.playing ? this.dmc(this.cpuCyclesPerSample) : 0;
      const sample = this.mix(pulseOne, pulseTwo, triangle, noise, dmc);
      left[i] = sample;
      right[i] = sample;
    }
    this.reportCountdown -= left.length;
    if (this.reportCountdown <= 0) {
      this.reportCountdown += Math.round(sampleRate / 10);
      this.port.postMessage({
        type: 'status',
        queueDepth: 0,
        regs: Array.from(this.regs),
        position: this.position,
        playing: this.playing,
        finished: this.finished,
        writeCount: this.writeCount,
        dmcOutputLevel: this.dmcOutputLevel
      });
    }
    return true;
  }
}

registerProcessor('cv2-apu', Cv2ApuProcessor);
