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

const NOISE_PERIODS = [
  4, 8, 16, 32, 64, 96, 128, 160,
  202, 254, 380, 508, 762, 1016, 2034, 4068
];

class Cv2ApuProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.regs = new Uint8Array(0x18);
    this.trackFrames = [];
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
    this.samplesPerFrame = sampleRate / FRAME_RATE;
    this.pulsePhase = [0, 0];
    this.trianglePhase = 0;
    this.noiseLfsr = 1;
    this.noiseTimer = 0;
    this.noiseValue = 0;
    this.playing = false;
    this.reportCountdown = 0;
    this.position = {
      sourceFrame: 0,
      loopCount: 0
    };
    this.port.onmessage = (event) => this.onMessage(event.data);
  }

  onMessage(message) {
    if (message.type === 'reset') {
      this.regs.fill(0);
      this.trackFrames = [];
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
      this.pulsePhase = [0, 0];
      this.trianglePhase = 0;
      this.noiseLfsr = 1;
      this.noiseTimer = 0;
      this.noiseValue = 0;
      this.playing = false;
      this.position = {
        sourceFrame: 0,
        loopCount: 0
      };
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
      this.pulsePhase = [0, 0];
      this.trianglePhase = 0;
      this.noiseLfsr = 1;
      this.noiseTimer = 0;
      this.noiseValue = 0;
      this.position = {
        sourceFrame: this.startFrame,
        loopCount: 0
      };
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
      const registerIndex = writes[index];
      const value = writes[index + 1];
      if (registerIndex >= 0 && registerIndex < this.regs.length) {
        this.regs[registerIndex] = value & 0xff;
      }
    }
    this.writeCount += writes.length / 2;
    this.cursor = sourceFrame + 1;
  }

  pulse(channel) {
    const offset = channel * 4;
    const enabled = this.regs[0x15] & (1 << channel);
    if (!enabled) return 0;
    const timer = this.regs[offset + 2] | ((this.regs[offset + 3] & 0x07) << 8);
    if (timer < 8) return 0;
    const frequency = CPU_CLOCK / (16 * (timer + 1));
    this.pulsePhase[channel] = (this.pulsePhase[channel] + frequency / sampleRate) % 1;
    const duty = PULSE_DUTIES[(this.regs[offset] >> 6) & 0x03];
    const step = Math.floor(this.pulsePhase[channel] * 8) & 7;
    const volume = this.regs[offset] & 0x0f;
    return duty[step] ? volume : 0;
  }

  triangle() {
    if (!(this.regs[0x15] & 0x04)) return 0;
    if ((this.regs[0x08] & 0x7f) === 0) return 0;
    const timer = this.regs[0x0a] | ((this.regs[0x0b] & 0x07) << 8);
    if (timer < 2) return 0;
    const frequency = CPU_CLOCK / (32 * (timer + 1));
    this.trianglePhase = (this.trianglePhase + frequency / sampleRate) % 1;
    return TRIANGLE_TABLE[Math.floor(this.trianglePhase * 32) & 31];
  }

  noise() {
    if (!(this.regs[0x15] & 0x08)) return 0;
    const volume = this.regs[0x0c] & 0x0f;
    if (!volume) return 0;
    this.noiseTimer -= 1;
    if (this.noiseTimer <= 0) {
      const period = NOISE_PERIODS[this.regs[0x0e] & 0x0f];
      const mode = this.regs[0x0e] & 0x80;
      const tap = mode ? 6 : 1;
      const feedback = (this.noiseLfsr ^ (this.noiseLfsr >> tap)) & 1;
      this.noiseLfsr = (this.noiseLfsr >> 1) | (feedback << 14);
      this.noiseValue = (~this.noiseLfsr) & 1;
      this.noiseTimer += Math.max(1, Math.round(period * sampleRate / CPU_CLOCK));
    }
    return this.noiseValue ? volume : 0;
  }

  mix(pulseOne, pulseTwo, triangle, noise) {
    const pulseSum = pulseOne + pulseTwo;
    const pulseOut = pulseSum > 0 ? 95.88 / ((8128 / pulseSum) + 100) : 0;
    const tndInput = triangle / 8227 + noise / 12241;
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
      }
      const pulseOne = this.playing ? this.pulse(0) : 0;
      const pulseTwo = this.playing ? this.pulse(1) : 0;
      const triangle = this.playing ? this.triangle() : 0;
      const noise = this.playing ? this.noise() : 0;
      const sample = this.mix(pulseOne, pulseTwo, triangle, noise);
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
        writeCount: this.writeCount
      });
    }
    return true;
  }
}

registerProcessor('cv2-apu', Cv2ApuProcessor);
