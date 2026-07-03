'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Cv2Music = require('./cv2-music-core.js');

const DEFAULT_ROM_PATH = path.resolve(__dirname, '../../roms/cv2.nes');
const DEFAULT_OUT_PATH = path.resolve(__dirname, 'music-data.js');
const SONG_SCAN_FIRST = 0x01;
const SONG_SCAN_LAST = 0x5c;
const SONG_SCAN_FRAMES = 600;
const MAX_TRACK_FRAMES = 12000;
const PRG_BANK_SIZE = 0x4000;
const DEBORAH_TORNADO_EVENT_TRACK_ID = 0x128;
const DEBORAH_TORNADO_EVENT_FRAME_COUNT = 509;
const DEBORAH_TORNADO_CAPTURE_FRAME = 266;

const TRACK_NAME_HINTS = new Map([
  [0x28, 'Deborah Cliff Tornado'],
  [DEBORAH_TORNADO_EVENT_TRACK_ID, 'Deborah Cliff Tornado Event'],
  [0x2f, 'Track ID 2F'],
  [0x39, 'Track ID 39'],
  [0x3d, 'Track ID 3D'],
  [0x41, 'Track ID 41'],
  [0x45, 'Track ID 45'],
  [0x49, 'Track ID 49'],
  [0x4d, 'Track ID 4D'],
  [0x51, 'Track ID 51'],
  [0x55, 'Track ID 55'],
  [0x59, 'Track ID 59']
]);

const FORCED_SOUND_IDS = new Set([
  // Bank 1:$A991-$A996 triggers sound $28 when Deborah Cliff's tornado spawns.
  0x28,
  DEBORAH_TORNADO_EVENT_TRACK_ID
]);

const TRACK_PLAYBACK_OVERRIDES = new Map([
  [0x28, { canLoop: false }],
  [DEBORAH_TORNADO_EVENT_TRACK_ID, { canLoop: false }]
]);

function parseArgs(argv) {
  const args = {
    rom: DEFAULT_ROM_PATH,
    out: DEFAULT_OUT_PATH
  };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--rom') {
      args.rom = path.resolve(argv[++index]);
    } else if (arg === '--out') {
      args.out = path.resolve(argv[++index]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function sha256Hex(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function stateKey(driver) {
  return `${Buffer.from(driver.cpu.ram).toString('hex')}|${Buffer.from(driver.cpu.apu).toString('hex')}`;
}

function packFrames(frames) {
  const events = [];
  let previousFrame = 0;
  let writeCount = 0;
  for (let frameIndex = 0; frameIndex < frames.length; frameIndex += 1) {
    for (const write of frames[frameIndex]) {
      events.push(frameIndex - previousFrame, write.address - 0x4000, write.value);
      previousFrame = frameIndex;
      writeCount += 1;
    }
  }
  return { events, writeCount };
}

function readPrgCpu(prg, address) {
  const addr = address & 0xffff;
  if (addr >= 0x8000 && addr < 0xc000) {
    return prg[addr - 0x8000] ?? 0;
  }
  if (addr >= 0xc000) {
    const lastBank = prg.length - PRG_BANK_SIZE;
    return prg[lastBank + (addr - 0xc000)] ?? 0;
  }
  return 0;
}

function dmcSampleAddress(value) {
  return 0xc000 + ((value & 0xff) << 6);
}

function dmcSampleLength(value) {
  return ((value & 0xff) << 4) + 1;
}

function readDmcSample(prg, address, length) {
  const bytes = [];
  let currentAddress = address & 0xffff;
  for (let index = 0; index < length; index += 1) {
    bytes.push(readPrgCpu(prg, currentAddress));
    currentAddress = currentAddress === 0xffff ? 0x8000 : (currentAddress + 1);
  }
  return bytes;
}

function forEachTrackWrite(track, callback) {
  let frameIndex = 0;
  for (let index = 0; index < track.events.length; index += 3) {
    frameIndex += track.events[index];
    callback({
      frameIndex,
      register: track.events[index + 1],
      value: track.events[index + 2]
    });
  }
}

function collectDmcSamples(prg, tracks) {
  const samples = new Map();
  for (const track of tracks) {
    const regs = new Uint8Array(0x18);
    let hasAddressRegister = false;
    let hasLengthRegister = false;
    forEachTrackWrite(track, ({ register, value }) => {
      regs[register] = value & 0xff;
      if (register === 0x12) hasAddressRegister = true;
      if (register === 0x13) hasLengthRegister = true;
      if (!hasAddressRegister || !hasLengthRegister) return;
      if (register !== 0x12 && register !== 0x13 && register !== 0x15) return;
      const address = dmcSampleAddress(regs[0x12]);
      const length = dmcSampleLength(regs[0x13]);
      const key = `${address}:${length}`;
      if (samples.has(key)) return;
      samples.set(key, {
        address,
        length,
        addressRegister: regs[0x12],
        lengthRegister: regs[0x13],
        bytes: readDmcSample(prg, address, length)
      });
    });
  }
  return Array.from(samples.values()).sort((a, b) => a.address - b.address || a.length - b.length);
}

function renderTrack(romBytes, soundId) {
  if (soundId === DEBORAH_TORNADO_EVENT_TRACK_ID) {
    return renderDeborahTornadoEventTrack(romBytes);
  }

  const driver = new Cv2Music.Cv2SoundDriver(romBytes);
  const frames = [];
  const seenStates = new Map();
  frames.push(driver.start(soundId));
  seenStates.set(stateKey(driver), 0);

  let loop = null;
  for (let frameIndex = 1; frameIndex <= MAX_TRACK_FRAMES; frameIndex += 1) {
    frames.push(driver.tick());
    const key = stateKey(driver);
    if (seenStates.has(key)) {
      const repeatedFrame = seenStates.get(key);
      loop = {
        startFrame: repeatedFrame + 1,
        endFrame: frameIndex + 1,
        verified: true
      };
      break;
    }
    seenStates.set(key, frameIndex);
  }

  if (!loop) {
    loop = {
      startFrame: 1,
      endFrame: frames.length,
      verified: false
    };
  }

  const { events, writeCount } = packFrames(frames);
  const table = driver.readSoundTableEntry(soundId);
  const playbackOverride = TRACK_PLAYBACK_OVERRIDES.get(soundId) || {};
  const canLoop = playbackOverride.canLoop !== false;
  return {
    soundId,
    label: TRACK_NAME_HINTS.get(soundId) || `Track ID ${soundId.toString(16).toUpperCase().padStart(2, '0')}`,
    channels: table.totalChannels,
    frameCount: frames.length,
    writeCount,
    ...(canLoop ? {} : {
      canLoop: false,
      playbackEndFrame: loop.verified ? loop.startFrame : frames.length
    }),
    loop,
    table,
    events
  };
}

function renderDeborahTornadoEventTrack(romBytes) {
  const driver = new Cv2Music.Cv2SoundDriver(romBytes);
  driver.reset();
  const frames = Array.from({ length: DEBORAH_TORNADO_EVENT_FRAME_COUNT }, () => []);

  const resetWrites = driver.cpu.call(0xc0e7, { maxInstructions: 100000 });
  const tornadoWrites = driver.cpu.call(0xc118, { a: 0x28, maxInstructions: 100000 });
  frames[0].push(...resetWrites, ...tornadoWrites);

  for (let frameIndex = 1; frameIndex < DEBORAH_TORNADO_EVENT_FRAME_COUNT; frameIndex += 1) {
    if (frameIndex === DEBORAH_TORNADO_CAPTURE_FRAME) {
      frames[frameIndex].push(...driver.cpu.call(0xc118, { a: 0x2d, maxInstructions: 100000 }));
    }
    frames[frameIndex].push(...driver.tick());
  }

  const { events, writeCount } = packFrames(frames);
  return {
    soundId: DEBORAH_TORNADO_EVENT_TRACK_ID,
    label: TRACK_NAME_HINTS.get(DEBORAH_TORNADO_EVENT_TRACK_ID),
    channels: 3,
    frameCount: frames.length,
    writeCount,
    initialWrites: [0x15, 0x0b],
    canLoop: false,
    playbackStartFrame: 0,
    playbackEndFrame: frames.length,
    loop: {
      startFrame: 0,
      endFrame: frames.length,
      verified: false
    },
    table: {
      soundId: DEBORAH_TORNADO_EVENT_TRACK_ID,
      synthetic: true,
      sequence: [
        {
          frame: 0,
          routine: '$C0E7',
          evidence: 'Bank 1:$A991 calls fixed-bank helper $C0E7 before triggering the tornado sound.'
        },
        {
          frame: 0,
          soundId: 0x28,
          routine: '$C118',
          evidence: 'Bank 1:$A994-$A996 loads sound id $28 and jumps to fixed-bank sound trigger helper $C118.'
        },
        {
          frame: DEBORAH_TORNADO_CAPTURE_FRAME,
          soundId: 0x2d,
          routine: '$C118',
          evidence: 'Bank 1:$A999-$A9C8 detects tornado/Simon overlap and triggers sound id $2D. Existing trace maps that branch to 266 frames after the tornado actor appears.'
        }
      ],
      totalChannels: 3
    },
    events
  };
}

function buildMusicData({ rom, out }) {
  const romBytes = new Uint8Array(fs.readFileSync(rom));
  const { prg } = Cv2Music.parseInes(romBytes);
  const scout = new Cv2Music.Cv2SoundDriver(romBytes);
  const songRoots = scout.scanSongs({
    first: SONG_SCAN_FIRST,
    last: SONG_SCAN_LAST,
    frameCount: SONG_SCAN_FRAMES
  });
  const soundIds = Array.from(new Set([
    ...songRoots.map((song) => song.soundId),
    ...FORCED_SOUND_IDS
  ])).sort((a, b) => a - b);
  const tracks = soundIds.map((soundId) => renderTrack(romBytes, soundId));
  const dmcSamples = collectDmcSamples(prg, tracks);
  const data = {
    version: 1,
    frameRate: Cv2Music.FRAME_RATE,
    source: {
      romSha256: sha256Hex(romBytes),
      note: 'Generated from the local ROM by tools/rom-music-player/build-music-data.cjs.'
    },
    driver: {
      trigger: Cv2Music.DRIVER_TRIGGER,
      frameUpdate: Cv2Music.DRIVER_FRAME_UPDATE,
      evidence: 'Build script runs the ROM sound driver and stores per-frame writes to $4000-$4017.'
    },
    dmcSamples,
    tracks
  };

  const js = [
    '// Generated by tools/rom-music-player/build-music-data.cjs. Do not edit by hand.',
    'export const MUSIC_DATA = ',
    JSON.stringify(data),
    ';',
    ''
  ].join('\n');
  fs.writeFileSync(out, js);
  return data;
}

if (require.main === module) {
  const args = parseArgs(process.argv);
  const data = buildMusicData(args);
  console.log(`Wrote ${data.tracks.length} tracks to ${args.out}`);
  console.log(`Included ${data.dmcSamples.length} DMC sample${data.dmcSamples.length === 1 ? '' : 's'}.`);
  for (const track of data.tracks) {
    const loop = track.loop.verified
      ? `loop ${track.loop.startFrame}-${track.loop.endFrame - 1}`
      : `fallback loop ${track.loop.startFrame}-${track.loop.endFrame - 1}`;
    console.log(`${track.label}: ${track.frameCount} frames, ${track.writeCount} writes, ${loop}`);
  }
}

module.exports = { buildMusicData };
