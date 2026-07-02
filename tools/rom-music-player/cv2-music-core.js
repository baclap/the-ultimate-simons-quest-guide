(function createCv2MusicCore(globalScope) {
  'use strict';

  const CPU_CLOCK = 1789773;
  const FRAME_RATE = 60.098813897;
  const PRG_BANK_SIZE = 0x4000;
  const HEADER_SIZE = 16;
  const DRIVER_TRIGGER = 0xa29b;
  const DRIVER_FRAME_UPDATE = 0x967d;

  const FLAG_C = 0x01;
  const FLAG_Z = 0x02;
  const FLAG_I = 0x04;
  const FLAG_D = 0x08;
  const FLAG_B = 0x10;
  const FLAG_U = 0x20;
  const FLAG_V = 0x40;
  const FLAG_N = 0x80;

  function hex(value, width = 2) {
    return `$${value.toString(16).toUpperCase().padStart(width, '0')}`;
  }

  async function sha256Hex(buffer) {
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function parseInes(bytes) {
    if (bytes.length < HEADER_SIZE) {
      throw new Error('ROM is too small to contain an iNES header.');
    }
    if (bytes[0] !== 0x4e || bytes[1] !== 0x45 || bytes[2] !== 0x53 || bytes[3] !== 0x1a) {
      throw new Error('ROM does not start with an iNES header.');
    }
    const prgBanks = bytes[4];
    const chrBanks = bytes[5];
    const flags6 = bytes[6];
    const flags7 = bytes[7];
    const trainerSize = (flags6 & 0x04) ? 512 : 0;
    const prgStart = HEADER_SIZE + trainerSize;
    const prgSize = prgBanks * PRG_BANK_SIZE;
    const chrStart = prgStart + prgSize;
    if (bytes.length < chrStart + chrBanks * 0x2000) {
      throw new Error('ROM is truncated.');
    }
    return {
      prg: bytes.subarray(prgStart, prgStart + prgSize),
      prgBanks,
      chrBanks,
      mapper: ((flags7 & 0xf0) | (flags6 >> 4)),
      mirroring: (flags6 & 1) ? 'vertical' : 'horizontal'
    };
  }

  class Cpu6502 {
    constructor(prg) {
      this.prg = prg;
      this.ram = new Uint8Array(0x800);
      this.apu = new Uint8Array(0x18);
      this.writes = [];
      this.reset();
    }

    reset() {
      this.ram.fill(0);
      this.apu.fill(0);
      this.a = 0;
      this.x = 0;
      this.y = 0;
      this.p = FLAG_U | FLAG_I;
      this.sp = 0xfd;
      this.pc = 0x8000;
      this.cycles = 0;
      this.writes = [];
    }

    read(addr) {
      addr &= 0xffff;
      if (addr < 0x2000) {
        return this.ram[addr & 0x7ff];
      }
      if (addr >= 0x4000 && addr <= 0x4017) {
        return this.apu[addr - 0x4000];
      }
      if (addr >= 0x8000 && addr < 0xc000) {
        return this.prg[addr - 0x8000] ?? 0;
      }
      if (addr >= 0xc000) {
        const lastBank = this.prg.length - PRG_BANK_SIZE;
        return this.prg[lastBank + (addr - 0xc000)] ?? 0;
      }
      return 0;
    }

    write(addr, value) {
      addr &= 0xffff;
      value &= 0xff;
      if (addr < 0x2000) {
        this.ram[addr & 0x7ff] = value;
        return;
      }
      if (addr >= 0x4000 && addr <= 0x4017) {
        this.apu[addr - 0x4000] = value;
        this.writes.push({ address: addr, value });
        return;
      }
    }

    fetch() {
      const value = this.read(this.pc);
      this.pc = (this.pc + 1) & 0xffff;
      return value;
    }

    fetch16() {
      const lo = this.fetch();
      const hi = this.fetch();
      return lo | (hi << 8);
    }

    read16(addr) {
      return this.read(addr) | (this.read((addr + 1) & 0xffff) << 8);
    }

    read16Bug(addr) {
      return this.read(addr) | (this.read((addr & 0xff00) | ((addr + 1) & 0xff)) << 8);
    }

    push(value) {
      this.write(0x100 | this.sp, value);
      this.sp = (this.sp - 1) & 0xff;
    }

    pull() {
      this.sp = (this.sp + 1) & 0xff;
      return this.read(0x100 | this.sp);
    }

    setZN(value) {
      value &= 0xff;
      this.p = value === 0 ? (this.p | FLAG_Z) : (this.p & ~FLAG_Z);
      this.p = value & 0x80 ? (this.p | FLAG_N) : (this.p & ~FLAG_N);
      return value;
    }

    setC(value) {
      this.p = value ? (this.p | FLAG_C) : (this.p & ~FLAG_C);
    }

    getC() {
      return this.p & FLAG_C ? 1 : 0;
    }

    branch(condition) {
      const offset = this.fetch();
      if (!condition) return;
      const signed = offset & 0x80 ? offset - 0x100 : offset;
      this.pc = (this.pc + signed) & 0xffff;
    }

    compare(register, value) {
      const result = (register - value) & 0x1ff;
      this.setC(register >= value);
      this.setZN(result & 0xff);
    }

    adc(value) {
      const sum = this.a + value + this.getC();
      const result = sum & 0xff;
      this.setC(sum > 0xff);
      this.p = (~(this.a ^ value) & (this.a ^ result) & 0x80)
        ? (this.p | FLAG_V)
        : (this.p & ~FLAG_V);
      this.a = this.setZN(result);
    }

    sbc(value) {
      this.adc((value ^ 0xff) & 0xff);
    }

    asl(value) {
      this.setC(value & 0x80);
      return this.setZN((value << 1) & 0xff);
    }

    lsr(value) {
      this.setC(value & 0x01);
      return this.setZN(value >> 1);
    }

    rol(value) {
      const carry = this.getC();
      this.setC(value & 0x80);
      return this.setZN(((value << 1) | carry) & 0xff);
    }

    ror(value) {
      const carry = this.getC();
      this.setC(value & 0x01);
      return this.setZN((value >> 1) | (carry << 7));
    }

    call(address, { a = this.a, x = this.x, y = this.y, maxInstructions = 200000 } = {}) {
      this.a = a & 0xff;
      this.x = x & 0xff;
      this.y = y & 0xff;
      this.setZN(this.a);
      this.pc = address & 0xffff;
      this.push(0xff);
      this.push(0xfe);
      this.writes = [];
      let instructions = 0;
      while (this.pc !== 0xffff && instructions < maxInstructions) {
        this.step();
        instructions += 1;
      }
      if (instructions >= maxInstructions) {
        throw new Error(`Sound driver did not return from ${hex(address, 4)}.`);
      }
      return this.writes.slice();
    }

    step() {
      const op = this.fetch();
      switch (op) {
        case 0x00: throw new Error(`BRK reached at ${hex((this.pc - 1) & 0xffff, 4)}.`);
        case 0x05: this.a = this.setZN(this.a | this.read(this.fetch())); break;
        case 0x06: { const addr = this.fetch(); this.write(addr, this.asl(this.read(addr))); break; }
        case 0x08: this.push(this.p | FLAG_B | FLAG_U); break;
        case 0x09: this.a = this.setZN(this.a | this.fetch()); break;
        case 0x0a: this.a = this.asl(this.a); break;
        case 0x0d: this.a = this.setZN(this.a | this.read(this.fetch16())); break;
        case 0x10: this.branch(!(this.p & FLAG_N)); break;
        case 0x15: this.a = this.setZN(this.a | this.read((this.fetch() + this.x) & 0xff)); break;
        case 0x18: this.p &= ~FLAG_C; break;
        case 0x1d: { const base = this.fetch16(); this.a = this.setZN(this.a | this.read((base + this.x) & 0xffff)); break; }
        case 0x20: {
          const addr = this.fetch16();
          const ret = (this.pc - 1) & 0xffff;
          this.push((ret >> 8) & 0xff);
          this.push(ret & 0xff);
          this.pc = addr;
          break;
        }
        case 0x24: { const value = this.read(this.fetch()); this.p = value & 0x40 ? this.p | FLAG_V : this.p & ~FLAG_V; this.p = value & 0x80 ? this.p | FLAG_N : this.p & ~FLAG_N; this.p = (value & this.a) === 0 ? this.p | FLAG_Z : this.p & ~FLAG_Z; break; }
        case 0x25: this.a = this.setZN(this.a & this.read(this.fetch())); break;
        case 0x26: { const addr = this.fetch(); this.write(addr, this.rol(this.read(addr))); break; }
        case 0x29: this.a = this.setZN(this.a & this.fetch()); break;
        case 0x2a: this.a = this.rol(this.a); break;
        case 0x2c: { const value = this.read(this.fetch16()); this.p = value & 0x40 ? this.p | FLAG_V : this.p & ~FLAG_V; this.p = value & 0x80 ? this.p | FLAG_N : this.p & ~FLAG_N; this.p = (value & this.a) === 0 ? this.p | FLAG_Z : this.p & ~FLAG_Z; break; }
        case 0x30: this.branch(this.p & FLAG_N); break;
        case 0x38: this.p |= FLAG_C; break;
        case 0x45: this.a = this.setZN(this.a ^ this.read(this.fetch())); break;
        case 0x46: { const addr = this.fetch(); this.write(addr, this.lsr(this.read(addr))); break; }
        case 0x48: this.push(this.a); break;
        case 0x4a: this.a = this.lsr(this.a); break;
        case 0x4c: this.pc = this.fetch16(); break;
        case 0x50: this.branch(!(this.p & FLAG_V)); break;
        case 0x56: { const addr = (this.fetch() + this.x) & 0xff; this.write(addr, this.lsr(this.read(addr))); break; }
        case 0x5e: { const addr = (this.fetch16() + this.x) & 0xffff; this.write(addr, this.lsr(this.read(addr))); break; }
        case 0x60: { const lo = this.pull(); const hi = this.pull(); this.pc = ((lo | (hi << 8)) + 1) & 0xffff; break; }
        case 0x65: this.adc(this.read(this.fetch())); break;
        case 0x66: { const addr = this.fetch(); this.write(addr, this.ror(this.read(addr))); break; }
        case 0x68: this.a = this.setZN(this.pull()); break;
        case 0x69: this.adc(this.fetch()); break;
        case 0x6a: this.a = this.ror(this.a); break;
        case 0x6c: this.pc = this.read16Bug(this.fetch16()); break;
        case 0x70: this.branch(this.p & FLAG_V); break;
        case 0x75: this.adc(this.read((this.fetch() + this.x) & 0xff)); break;
        case 0x7d: { const base = this.fetch16(); this.adc(this.read((base + this.x) & 0xffff)); break; }
        case 0x7e: { const addr = (this.fetch16() + this.x) & 0xffff; this.write(addr, this.ror(this.read(addr))); break; }
        case 0x84: this.write(this.fetch(), this.y); break;
        case 0x85: this.write(this.fetch(), this.a); break;
        case 0x86: this.write(this.fetch(), this.x); break;
        case 0x88: this.y = this.setZN((this.y - 1) & 0xff); break;
        case 0x8a: this.a = this.setZN(this.x); break;
        case 0x8c: this.write(this.fetch16(), this.y); break;
        case 0x8d: this.write(this.fetch16(), this.a); break;
        case 0x8e: this.write(this.fetch16(), this.x); break;
        case 0x90: this.branch(!(this.p & FLAG_C)); break;
        case 0x94: this.write((this.fetch() + this.x) & 0xff, this.y); break;
        case 0x95: this.write((this.fetch() + this.x) & 0xff, this.a); break;
        case 0x98: this.a = this.setZN(this.y); break;
        case 0x99: { const base = this.fetch16(); this.write((base + this.y) & 0xffff, this.a); break; }
        case 0x9d: { const base = this.fetch16(); this.write((base + this.x) & 0xffff, this.a); break; }
        case 0xa0: this.y = this.setZN(this.fetch()); break;
        case 0xa2: this.x = this.setZN(this.fetch()); break;
        case 0xa4: this.y = this.setZN(this.read(this.fetch())); break;
        case 0xa5: this.a = this.setZN(this.read(this.fetch())); break;
        case 0xa6: this.x = this.setZN(this.read(this.fetch())); break;
        case 0xa8: this.y = this.setZN(this.a); break;
        case 0xa9: this.a = this.setZN(this.fetch()); break;
        case 0xaa: this.x = this.setZN(this.a); break;
        case 0xac: this.y = this.setZN(this.read(this.fetch16())); break;
        case 0xad: this.a = this.setZN(this.read(this.fetch16())); break;
        case 0xae: this.x = this.setZN(this.read(this.fetch16())); break;
        case 0xb0: this.branch(this.p & FLAG_C); break;
        case 0xb1: { const zp = this.fetch(); const ptr = this.read(zp) | (this.read((zp + 1) & 0xff) << 8); this.a = this.setZN(this.read((ptr + this.y) & 0xffff)); break; }
        case 0xb5: this.a = this.setZN(this.read((this.fetch() + this.x) & 0xff)); break;
        case 0xb9: { const base = this.fetch16(); this.a = this.setZN(this.read((base + this.y) & 0xffff)); break; }
        case 0xbd: { const base = this.fetch16(); this.a = this.setZN(this.read((base + this.x) & 0xffff)); break; }
        case 0xbc: { const base = this.fetch16(); this.y = this.setZN(this.read((base + this.x) & 0xffff)); break; }
        case 0xc6: { const addr = this.fetch(); const value = this.setZN((this.read(addr) - 1) & 0xff); this.write(addr, value); break; }
        case 0xc8: this.y = this.setZN((this.y + 1) & 0xff); break;
        case 0xc9: this.compare(this.a, this.fetch()); break;
        case 0xca: this.x = this.setZN((this.x - 1) & 0xff); break;
        case 0xcd: this.compare(this.a, this.read(this.fetch16())); break;
        case 0xce: { const addr = this.fetch16(); const value = this.setZN((this.read(addr) - 1) & 0xff); this.write(addr, value); break; }
        case 0xd0: this.branch(!(this.p & FLAG_Z)); break;
        case 0xd1: { const zp = this.fetch(); const ptr = this.read(zp) | (this.read((zp + 1) & 0xff) << 8); this.compare(this.a, this.read((ptr + this.y) & 0xffff)); break; }
        case 0xd5: this.compare(this.a, this.read((this.fetch() + this.x) & 0xff)); break;
        case 0xd6: { const addr = (this.fetch() + this.x) & 0xff; const value = this.setZN((this.read(addr) - 1) & 0xff); this.write(addr, value); break; }
        case 0xd9: { const base = this.fetch16(); this.compare(this.a, this.read((base + this.y) & 0xffff)); break; }
        case 0xdd: { const base = this.fetch16(); this.compare(this.a, this.read((base + this.x) & 0xffff)); break; }
        case 0xde: { const addr = (this.fetch16() + this.x) & 0xffff; const value = this.setZN((this.read(addr) - 1) & 0xff); this.write(addr, value); break; }
        case 0xe0: this.compare(this.x, this.fetch()); break;
        case 0xe5: this.sbc(this.read(this.fetch())); break;
        case 0xe6: { const addr = this.fetch(); const value = this.setZN((this.read(addr) + 1) & 0xff); this.write(addr, value); break; }
        case 0xe8: this.x = this.setZN((this.x + 1) & 0xff); break;
        case 0xe9: this.sbc(this.fetch()); break;
        case 0xea: break;
        case 0xf0: this.branch(this.p & FLAG_Z); break;
        case 0xf6: { const addr = (this.fetch() + this.x) & 0xff; const value = this.setZN((this.read(addr) + 1) & 0xff); this.write(addr, value); break; }
        case 0xf9: { const base = this.fetch16(); this.sbc(this.read((base + this.y) & 0xffff)); break; }
        case 0xfd: { const base = this.fetch16(); this.sbc(this.read((base + this.x) & 0xffff)); break; }
        case 0xfe: { const addr = (this.fetch16() + this.x) & 0xffff; const value = this.setZN((this.read(addr) + 1) & 0xff); this.write(addr, value); break; }
        default:
          throw new Error(`Unsupported opcode ${hex(op)} at ${hex((this.pc - 1) & 0xffff, 4)}.`);
      }
      this.cycles += 1;
      this.p |= FLAG_U;
      this.p &= ~(FLAG_B | FLAG_D);
    }
  }

  class Cv2SoundDriver {
    constructor(romBytes) {
      const ines = parseInes(romBytes);
      this.ines = ines;
      this.cpu = new Cpu6502(ines.prg);
      this.frame = 0;
      this.lastMetrics = null;
    }

    readCpu(addr) {
      addr &= 0xffff;
      if (addr >= 0x8000 && addr < 0xc000) {
        return this.ines.prg[addr - 0x8000] ?? 0;
      }
      if (addr >= 0xc000) {
        return this.ines.prg[this.ines.prg.length - PRG_BANK_SIZE + (addr - 0xc000)] ?? 0;
      }
      return 0;
    }

    readSoundTableEntry(soundId) {
      const base = this.readCpu(0xa299) | (this.readCpu(0xa29a) << 8);
      const address = base + (soundId & 0xff) * 3;
      const descriptor = this.readCpu(address);
      const pointer = this.readCpu(address + 1) | (this.readCpu(address + 2) << 8);
      let shifted = descriptor;
      let carry = 0;
      for (let index = 0; index < 3; index += 1) {
        const nextCarry = shifted & 0x80 ? 1 : 0;
        shifted = ((shifted << 1) & 0xff) | carry;
        carry = nextCarry;
      }
      return {
        soundId,
        tableAddress: address & 0xffff,
        descriptor,
        pointer,
        channel: descriptor & 0x1f,
        extraChannels: shifted & 0x03,
        totalChannels: (shifted & 0x03) + 1
      };
    }

    reset() {
      this.cpu.reset();
      this.frame = 0;
      this.cpu.call(DRIVER_TRIGGER, { a: 0, maxInstructions: 50000 });
    }

    start(soundId) {
      this.reset();
      const writes = this.cpu.call(DRIVER_TRIGGER, { a: soundId & 0xff, maxInstructions: 100000 });
      return writes;
    }

    tick() {
      const writes = this.cpu.call(DRIVER_FRAME_UPDATE, { maxInstructions: 300000 });
      this.frame += 1;
      return writes;
    }

    renderFrames(soundId, frameCount) {
      const frames = [];
      const startWrites = this.start(soundId);
      if (startWrites.length) {
        frames.push(startWrites);
      }
      for (let frame = frames.length; frame < frameCount; frame += 1) {
        frames.push(this.tick());
      }
      return frames;
    }

    measureSound(soundId, frameCount = 360) {
      const frames = this.renderFrames(soundId, frameCount);
      const writeCount = frames.reduce((sum, frame) => sum + frame.length, 0);
      const activeFrames = frames.filter((frame) => frame.length > 0).length;
      const addresses = new Set();
      for (const frame of frames) {
        for (const write of frame) {
          addresses.add(write.address);
        }
      }
      const metrics = {
        soundId,
        frameCount,
        writeCount,
        activeFrames,
        addresses: Array.from(addresses).sort((a, b) => a - b),
        table: this.readSoundTableEntry(soundId)
      };
      this.lastMetrics = metrics;
      return metrics;
    }

    scanSounds({ first = 1, last = 0x5c, frameCount = 420 } = {}) {
      const results = [];
      for (let id = first; id <= last; id += 1) {
        try {
          const metrics = this.measureSound(id, frameCount);
          const channelAddresses = metrics.addresses.filter((address) => address >= 0x4000 && address <= 0x400f);
          if (metrics.writeCount >= 24 && metrics.activeFrames >= 8 && channelAddresses.length >= 3) {
            results.push(metrics);
          }
        } catch (error) {
          results.push({ soundId: id, error: error.message });
        }
      }
      return results;
    }

    scanSongs({ first = 1, last = 0x5c, frameCount = 600 } = {}) {
      return this.scanSounds({ first, last, frameCount })
        .filter((entry) => {
          if (entry.error || entry.activeFrames < 80) return false;
          const hasPulseOne = entry.addresses.some((address) => address >= 0x4000 && address <= 0x4003);
          const hasPulseTwo = entry.addresses.some((address) => address >= 0x4004 && address <= 0x4007);
          const hasTriangle = entry.addresses.some((address) => address >= 0x4008 && address <= 0x400b);
          const hasNoise = entry.addresses.some((address) => address >= 0x400c && address <= 0x400f);
          const channelGroups = [hasPulseOne, hasPulseTwo, hasTriangle, hasNoise].filter(Boolean).length;
          return entry.table.extraChannels >= 3
            || (entry.writeCount >= 800 && channelGroups >= 3);
        });
    }
  }

  globalScope.Cv2Music = {
    CPU_CLOCK,
    FRAME_RATE,
    DRIVER_TRIGGER,
    DRIVER_FRAME_UPDATE,
    Cv2SoundDriver,
    hex,
    parseInes,
    sha256Hex
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = globalScope.Cv2Music;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
