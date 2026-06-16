'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte } = require('./background');
const { BACKGROUND_TABLE_BANK } = require('./background-context');
const { decodeMetaspriteSelector, decodeSelectorRecordAt } = require('./actor-selector-streams');
const { renderLayoutSegment } = require('./layout-segments');
const { readBackgroundPalette, CHR_4KB_BANK_SIZE } = require('./native-image');
const { readPng } = require('./png');

const BLOCK_SIZE = 32;
const BLOCK_TILES = 4;
const TILE_SIZE = 8;
const CHR_PAIR_BYTES = CHR_4KB_BANK_SIZE * 2;
const METATILE_COUNT = 256;
const METATILE_TILE_BYTES = METATILE_COUNT * 16;
const METATILE_ATTRIBUTE_BYTES = METATILE_COUNT;
const SELECTOR_RECORD_BASE = 0xdda2;
const SPRITE_PALETTE_BYTES = 16;
const SPRITE_HEIGHT = 16;
const ACTOR_CELL_SIZE = 16;
// Actor rows store the runtime anchor on a 16px grid; the guide draws at the visual spawn-cell anchor.
const ACTOR_DRAW_ANCHOR_OFFSET_X = ACTOR_CELL_SIZE / 2;
const ACTOR_DRAW_ANCHOR_OFFSET_Y = -12;

const ACTOR_PALETTE_SOURCES = [
  {
    id: 'town-day-sprites',
    label: 'Town actor sprites, day',
    type: 'palette-capture',
    file: path.join('out', 'captures', 'jova-day', 'ppu-3f00-3f1f-palettes.bin')
  },
  {
    id: 'town-night-sprites',
    label: 'Town actor sprites, night',
    type: 'palette-capture',
    file: path.join('out', 'captures', 'jova-town-night', 'ppu-3f00-3f1f-palettes.bin')
  },
  {
    id: 'jova-woods-day-sprites',
    label: 'Jova Woods sprites, day',
    type: 'palette-capture',
    file: path.join('out', 'captures', 'jova-woods-day', 'ppu-3f00-3f1f-palettes.bin')
  },
  {
    id: 'jova-woods-night-sprites',
    label: 'Jova Woods sprites, night',
    type: 'palette-capture',
    file: path.join('out', 'captures', 'jova-woods-night', 'ppu-3f00-3f1f-palettes.bin')
  },
  {
    id: 'south-bridge-day-sprites',
    label: 'South Bridge sprites, day',
    type: 'fishman-proof',
    fishmanVariant: 'south-bridge-day'
  },
  {
    id: 'south-bridge-night-sprites',
    label: 'South Bridge sprites, night',
    type: 'fishman-proof',
    fishmanVariant: 'south-bridge-night'
  },
  {
    id: 'veros-woods-day-sprites',
    label: 'Veros Woods sprites, day',
    type: 'palette-capture',
    file: path.join('out', 'actor-traces', 'veros-woods-part-1-day', 'ppu-final-3f00-3f1f-palettes.bin')
  },
  {
    id: 'veros-woods-night-sprites',
    label: 'Veros Woods sprites, night',
    type: 'palette-capture',
    file: path.join('out', 'actor-traces', 'veros-woods-part-1-day', 'ppu-final-3f00-3f1f-palettes.bin')
  },
  {
    id: 'denis-woods-day-sprites',
    label: 'Denis Woods sprites, day',
    type: 'fishman-proof',
    fishmanVariant: 'denis-woods-part-1-day'
  },
  {
    id: 'denis-woods-night-sprites',
    label: 'Denis Woods sprites, night',
    type: 'fishman-proof',
    fishmanVariant: 'denis-woods-part-1-night'
  }
];

const ACTOR_CLASSES = [
  {
    id: 'jova-shepherd',
    label: 'Jova shepherd',
    kind: 'npc',
    actorId: 0xb5,
    selectorRecordIndex: 0x0e,
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $B5 maps through live id $35 to animation record $0E, which emits selectors $24/$25.'
  },
  {
    id: 'jova-man',
    label: 'Jova man',
    kind: 'npc',
    actorId: 0xaa,
    selectorRecordIndex: 0x0d,
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $AA maps through live id $2A to animation record $0D, which emits selectors $22/$23.'
  },
  {
    id: 'jova-a8',
    label: 'Jova clue NPC',
    kind: 'npc',
    actorId: 0xa8,
    selectorRecordIndex: 0x0d,
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $A8 maps through the town high-bit path to the same town-man animation record $0D.'
  },
  {
    id: 'jova-merchant',
    label: 'White-crystal merchant',
    kind: 'npc',
    actorId: 0xae,
    selectorRecordIndex: 0x0b,
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $AE maps through live id $2E to merchant animation record $0B, which emits selectors $1E/$1F.'
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    kind: 'enemy',
    actorId: 0x03,
    selectorRecordIndex: 0x05,
    chrBanks: [0x02, 0x03],
    hp: { day: 1, night: 2 },
    proof: 'ROM actor id $03 uses selector-stream record $05, proven by live actor traces and decoded fixed-bank selector bytes.'
  },
  {
    id: 'fishman',
    label: 'Fishman',
    kind: 'enemy',
    actorId: 0x04,
    selectorRecordIndex: 0x06,
    chrBanks: [0x02, 0x03],
    hp: { day: 1, night: 2 },
    proof: 'ROM actor id $04 uses selector-stream record $06 for the body frames; the fishman proof supplies the segment sprite palettes.'
  },
  {
    id: 'werewolf',
    label: 'Werewolf',
    kind: 'enemy',
    actorId: 0x13,
    selectorRecordIndex: 0x1e,
    chrBanks: [0x02, 0x03],
    hp: { day: 2, night: 4 },
    proof: 'ROM actor id $13 uses selector-stream record $1E, proven by live Jova Woods actor traces.'
  },
  {
    id: 'zombie',
    label: 'Zombie',
    kind: 'enemy',
    actorId: 0x17,
    selectorRecordIndex: 0x37,
    chrBanks: [0x00, 0x01],
    hp: { day: null, night: 2 },
    proof: 'ROM actor id $17 is loaded by the town night actor gate and uses selector-stream record $37.'
  }
];

const GUIDE_ACTORS = [
  { id: 'jova-shepherd-50bc', classId: 'jova-shepherd', segmentId: 'town-of-jova', offset: 0x50bc, bytes: [0x04, 0x0c, 0xb5, 0x38], variants: ['day'], text: 'first thing to do in this town is buy a white crystal.', paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-shepherd-50c0', classId: 'jova-shepherd', segmentId: 'town-of-jova', offset: 0x50c0, bytes: [0x04, 0x1a, 0xb5, 0x3d], variants: ['day'], text: 'you have a friend in the town of aldra. go and see him.', paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-shepherd-50c4', classId: 'jova-shepherd', segmentId: 'town-of-jova', offset: 0x50c4, bytes: [0x08, 0x12, 0xb5, 0x3e], variants: ['day'], text: "13 clues will solve dracula's riddle.", paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-sign-50c8', classId: null, label: 'Jova sign', kind: 'fixture', segmentId: 'town-of-jova', offset: 0x50c8, bytes: [0x0c, 0x1a, 0xa4, 0x3a], variants: ['day', 'night'], text: 'turn right for the jova woods. left for belasco marsh.', visualTileRect: { x: 24, y: 48, width: 4, height: 4 } },
  { id: 'jova-zombie-50cc', classId: 'zombie', segmentId: 'town-of-jova', offset: 0x50cc, bytes: [0x0c, 0x0c, 0x17, 0x01], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'jova-shepherd-50d0', classId: 'jova-shepherd', segmentId: 'town-of-jova', offset: 0x50d0, bytes: [0x14, 0x1a, 0xb5, 0x41], variants: ['day'], text: 'a magic potion will destroy the wall of evil.', paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-zombie-50d4', classId: 'zombie', segmentId: 'town-of-jova', offset: 0x50d4, bytes: [0x14, 0x14, 0x17, 0x01], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'jova-man-50d8', classId: 'jova-man', segmentId: 'town-of-jova', offset: 0x50d8, bytes: [0x18, 0x14, 0xaa, 0x44], variants: ['day'], text: 'rumor has it, the ferryman at dead river loves garlic.', paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-zombie-50dc', classId: 'zombie', segmentId: 'town-of-jova', offset: 0x50dc, bytes: [0x18, 0x0c, 0x17, 0x01], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'jova-zombie-50e0', classId: 'zombie', segmentId: 'town-of-jova', offset: 0x50e0, bytes: [0x1c, 0x1a, 0x17, 0x01], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'jova-shepherd-50e4', classId: 'jova-shepherd', segmentId: 'town-of-jova', offset: 0x50e4, bytes: [0x24, 0x0c, 0xb5, 0x4c], variants: ['day'], text: 'a crooked trader is offering bum deals in this town.', paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-man-50e8', classId: 'jova-man', segmentId: 'town-of-jova', offset: 0x50e8, bytes: [0x28, 0x14, 0xaa, 0x4d], variants: ['day'], text: 'a flame is on top of the 6th tree in denis woods.', paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-a8-50ec', classId: 'jova-a8', segmentId: 'town-of-jova', offset: 0x50ec, bytes: [0x2c, 0x1a, 0xa8, 0x4e], variants: ['day'], text: "clues to dracula's riddle are in the town of veros.", paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-zombie-50f0', classId: 'zombie', segmentId: 'town-of-jova', offset: 0x50f0, bytes: [0x28, 0x14, 0x17, 0x01], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'jova-zombie-50f4', classId: 'zombie', segmentId: 'town-of-jova', offset: 0x50f4, bytes: [0x2c, 0x0c, 0x17, 0x01], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'jova-merchant-50f8', classId: 'jova-merchant', segmentId: 'town-of-jova', offset: 0x50f8, bytes: [0x34, 0x12, 0xae, 0x07], variants: ['day'], text: 'buy a white crystal?', paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-zombie-50fc', classId: 'zombie', segmentId: 'town-of-jova', offset: 0x50fc, bytes: [0x34, 0x12, 0x17, 0x01], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'jova-zombie-5100', classId: 'zombie', segmentId: 'town-of-jova', offset: 0x5100, bytes: [0x38, 0x0c, 0x17, 0x01], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },

  { id: 'jova-woods-werewolf-5ff4', classId: 'werewolf', segmentId: 'jova-woods', offset: 0x5ff4, bytes: [0x08, 0x0c, 0x13, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'jova-woods-day-sprites', night: 'jova-woods-night-sprites' } },
  { id: 'jova-woods-skeleton-5ff8', classId: 'skeleton', segmentId: 'jova-woods', offset: 0x5ff8, bytes: [0x0c, 0x0c, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'jova-woods-day-sprites', night: 'jova-woods-night-sprites' } },
  { id: 'jova-woods-werewolf-5ffc', classId: 'werewolf', segmentId: 'jova-woods', offset: 0x5ffc, bytes: [0x14, 0x0c, 0x13, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'jova-woods-day-sprites', night: 'jova-woods-night-sprites' } },
  { id: 'jova-woods-skeleton-6000', classId: 'skeleton', segmentId: 'jova-woods', offset: 0x6000, bytes: [0x18, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'jova-woods-day-sprites', night: 'jova-woods-night-sprites' } },
  { id: 'jova-woods-werewolf-6004', classId: 'werewolf', segmentId: 'jova-woods', offset: 0x6004, bytes: [0x1c, 0x08, 0x13, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'jova-woods-day-sprites', night: 'jova-woods-night-sprites' } },
  { id: 'jova-woods-skeleton-6008', classId: 'skeleton', segmentId: 'jova-woods', offset: 0x6008, bytes: [0x28, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'jova-woods-day-sprites', night: 'jova-woods-night-sprites' } },
  { id: 'jova-woods-skeleton-600c', classId: 'skeleton', segmentId: 'jova-woods', offset: 0x600c, bytes: [0x2c, 0x0c, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'jova-woods-day-sprites', night: 'jova-woods-night-sprites' } },
  { id: 'jova-woods-skeleton-6010', classId: 'skeleton', segmentId: 'jova-woods', offset: 0x6010, bytes: [0x34, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'jova-woods-day-sprites', night: 'jova-woods-night-sprites' } },
  { id: 'jova-woods-skeleton-6014', classId: 'skeleton', segmentId: 'jova-woods', offset: 0x6014, bytes: [0x3c, 0x0b, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'jova-woods-day-sprites', night: 'jova-woods-night-sprites' } },

  { id: 'south-bridge-skeleton-6019', classId: 'skeleton', segmentId: 'south-bridge', offset: 0x6019, bytes: [0x04, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },
  { id: 'south-bridge-skeleton-601d', classId: 'skeleton', segmentId: 'south-bridge', offset: 0x601d, bytes: [0x0c, 0x09, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },
  { id: 'south-bridge-fishman-6021', classId: 'fishman', segmentId: 'south-bridge', offset: 0x6021, bytes: [0x0e, 0x0c, 0x04, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },
  { id: 'south-bridge-fishman-6025', classId: 'fishman', segmentId: 'south-bridge', offset: 0x6025, bytes: [0x15, 0x0c, 0x04, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },
  { id: 'south-bridge-fishman-6029', classId: 'fishman', segmentId: 'south-bridge', offset: 0x6029, bytes: [0x1a, 0x0c, 0x04, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },
  { id: 'south-bridge-fishman-602d', classId: 'fishman', segmentId: 'south-bridge', offset: 0x602d, bytes: [0x25, 0x0c, 0x04, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },
  { id: 'south-bridge-fishman-6031', classId: 'fishman', segmentId: 'south-bridge', offset: 0x6031, bytes: [0x2a, 0x0c, 0x04, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },
  { id: 'south-bridge-skeleton-6035', classId: 'skeleton', segmentId: 'south-bridge', offset: 0x6035, bytes: [0x34, 0x09, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },
  { id: 'south-bridge-fishman-6039', classId: 'fishman', segmentId: 'south-bridge', offset: 0x6039, bytes: [0x35, 0x0c, 0x04, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },
  { id: 'south-bridge-skeleton-603d', classId: 'skeleton', segmentId: 'south-bridge', offset: 0x603d, bytes: [0x38, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'south-bridge-day-sprites', night: 'south-bridge-night-sprites' } },

  { id: 'veros-1-skeleton-6042', classId: 'skeleton', segmentId: 'veros-woods-part-1', offset: 0x6042, bytes: [0x08, 0x06, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-1-skeleton-6046', classId: 'skeleton', segmentId: 'veros-woods-part-1', offset: 0x6046, bytes: [0x08, 0x0c, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-1-skeleton-604e', classId: 'skeleton', segmentId: 'veros-woods-part-1', offset: 0x604e, bytes: [0x14, 0x06, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-1-skeleton-6052', classId: 'skeleton', segmentId: 'veros-woods-part-1', offset: 0x6052, bytes: [0x18, 0x0c, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-1-skeleton-6056', classId: 'skeleton', segmentId: 'veros-woods-part-1', offset: 0x6056, bytes: [0x19, 0x06, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-1-skeleton-605a', classId: 'skeleton', segmentId: 'veros-woods-part-1', offset: 0x605a, bytes: [0x1d, 0x08, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-2-skeleton-605f', classId: 'skeleton', segmentId: 'veros-woods-part-2', offset: 0x605f, bytes: [0x04, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-2-skeleton-6063', classId: 'skeleton', segmentId: 'veros-woods-part-2', offset: 0x6063, bytes: [0x08, 0x0b, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-2-skeleton-6067', classId: 'skeleton', segmentId: 'veros-woods-part-2', offset: 0x6067, bytes: [0x0c, 0x0c, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-2-skeleton-606f', classId: 'skeleton', segmentId: 'veros-woods-part-2', offset: 0x606f, bytes: [0x14, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },
  { id: 'veros-2-skeleton-6073', classId: 'skeleton', segmentId: 'veros-woods-part-2', offset: 0x6073, bytes: [0x18, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'veros-woods-day-sprites', night: 'veros-woods-night-sprites' } },

  { id: 'denis-skeleton-6078', classId: 'skeleton', segmentId: 'denis-woods-part-1', offset: 0x6078, bytes: [0x04, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-fishman-607c', classId: 'fishman', segmentId: 'denis-woods-part-1', offset: 0x607c, bytes: [0x0a, 0x0c, 0x04, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-skeleton-6080', classId: 'skeleton', segmentId: 'denis-woods-part-1', offset: 0x6080, bytes: [0x14, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-skeleton-6084', classId: 'skeleton', segmentId: 'denis-woods-part-1', offset: 0x6084, bytes: [0x18, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } }
];

function parseHex(value) {
  if (Number.isInteger(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    throw new Error(`expected hex string, got ${value}`);
  }
  return value.startsWith('0x') || value.startsWith('0X')
    ? Number.parseInt(value.slice(2), 16)
    : Number.parseInt(value, 10);
}

function hex(value, width = 2) {
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function publicBytes(bytes) {
  return Array.from(bytes).map((byte) => hex(byte, 2));
}

function appendChunk(chunks, buffer) {
  const offset = chunks.reduce((total, chunk) => total + chunk.length, 0);
  chunks.push(Buffer.from(buffer));
  return { offset, length: buffer.length };
}

function readPrgBytes(rom, info, cpuAddress, length, opts = {}) {
  const buffer = Buffer.alloc(length);
  for (let index = 0; index < length; index += 1) {
    buffer[index] = readPrgByte(rom, info, cpuAddress + index, opts);
  }
  return buffer;
}

function readChrPair(rom, info, chrBanks) {
  if (!Array.isArray(chrBanks) || chrBanks.length !== 2) {
    throw new Error(`expected exactly two CHR banks, got ${chrBanks}`);
  }
  const buffer = Buffer.alloc(CHR_PAIR_BYTES);
  chrBanks.forEach((bank, index) => {
    const sourceStart = info.chrStart + bank * CHR_4KB_BANK_SIZE;
    rom.copy(buffer, index * CHR_4KB_BANK_SIZE, sourceStart, sourceStart + CHR_4KB_BANK_SIZE);
  });
  return buffer;
}

function segmentFromEntry(entry) {
  const recipe = entry.recipe;
  if (!recipe || recipe.status === 'blocked') {
    throw new Error(`${entry.id} is missing a usable render recipe`);
  }
  const layoutContext = recipe.layoutContext;
  const palette = recipe.palette;
  return {
    id: entry.id,
    label: recipe.label,
    location: entry.name,
    variant: entry.variant,
    access: entry.access,
    paletteMode: entry.variant,
    status: recipe.status,
    validation: recipe.statusDetail,
    runtimeContext: {
      objset: parseHex(layoutContext.objset),
      area: parseHex(layoutContext.area),
      submap: parseHex(layoutContext.submap || '0x00')
    },
    layoutIndexOverride: entry.screenRecord.layoutIndexSource === 'screen-record-byte-0'
      ? undefined
      : parseHex(entry.screenRecord.layoutIndex),
    renderAllSections: true,
    columnGroups: entry.columnGroups,
    bgPatternBase: 0,
    template: recipe.id,
    templates: {
      [recipe.id]: {
        id: recipe.id,
        label: recipe.label,
        variant: entry.variant,
        access: entry.access,
        paletteMode: entry.variant,
        renderer: 'native-background-v1',
        chrBanks: recipe.chrBanks.map(parseHex),
        layoutBank: BACKGROUND_TABLE_BANK,
        tileBank: 4,
        paletteBank: palette.bank,
        paletteAddress: parseHex(palette.address),
        widthBlocks: recipe.widthBlocks,
        heightBlocks: recipe.heightBlocks,
        rowsPerLayoutSection: recipe.rowsPerLayoutSection
      }
    }
  };
}

function columnLayoutToBlocks(metadata) {
  const blockWidth = metadata.widthBlocks;
  const blockHeight = metadata.heightBlocks;
  const blocks = Buffer.alloc(blockWidth * blockHeight);
  for (const column of metadata.columns) {
    column.layoutBytes.forEach((row, rowIndex) => {
      row.forEach((block, blockIndex) => {
        const x = column.columnIndex * metadata.groupWidthBlocks + blockIndex;
        const y = column.sectionIndex * metadata.sectionHeightBlocks + rowIndex;
        blocks[y * blockWidth + x] = block;
      });
    });
  }
  return { blockWidth, blockHeight, blocks };
}

function cropBlocks(blockMatrix, crop) {
  if (!crop) {
    return {
      blockWidth: blockMatrix.blockWidth,
      blockHeight: blockMatrix.blockHeight,
      blocks: blockMatrix.blocks,
      crop: null
    };
  }
  for (const key of ['x', 'y', 'width', 'height']) {
    if (crop[key] % BLOCK_SIZE !== 0) {
      throw new Error(`crop.${key} must be a multiple of ${BLOCK_SIZE}`);
    }
  }
  const cropX = crop.x / BLOCK_SIZE;
  const cropY = crop.y / BLOCK_SIZE;
  const cropWidth = crop.width / BLOCK_SIZE;
  const cropHeight = crop.height / BLOCK_SIZE;
  const blocks = Buffer.alloc(cropWidth * cropHeight);
  for (let y = 0; y < cropHeight; y += 1) {
    for (let x = 0; x < cropWidth; x += 1) {
      blocks[y * cropWidth + x] = blockMatrix.blocks[(cropY + y) * blockMatrix.blockWidth + cropX + x];
    }
  }
  return {
    blockWidth: cropWidth,
    blockHeight: cropHeight,
    blocks,
    crop: { ...crop }
  };
}

function compareRgbaWithYOffset(rendered, validation) {
  const capture = readPng(validation.capture);
  const width = validation.width;
  const height = validation.height;
  const yOffset = validation.atlasYOffset || 0;
  let differingPixels = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const source = (y * rendered.width + x) * 4;
      const target = ((y + yOffset) * capture.width + x) * 4;
      if (
        rendered.rgba[source] !== capture.rgba[target] ||
        rendered.rgba[source + 1] !== capture.rgba[target + 1] ||
        rendered.rgba[source + 2] !== capture.rgba[target + 2]
      ) {
        differingPixels += 1;
      }
    }
  }
  return {
    capture: validation.capture,
    atlasYOffset: yOffset,
    width,
    height,
    differingPixels,
    requiredDifferingPixels: validation.requiredDifferingPixels
  };
}

function readMetatileSet(rom, info, metadata) {
  const tileBank = metadata.tileBank;
  const tileSetAddress = parseHex(metadata.tileSetAddress);
  const tileBaseAddress = parseHex(metadata.tileBaseAddress);
  return {
    tileBank,
    tileSetAddress,
    tileBaseAddress,
    metatileTiles: readPrgBytes(rom, info, tileBaseAddress, METATILE_TILE_BYTES, { bank: tileBank }),
    metatileAttributes: readPrgBytes(rom, info, tileSetAddress + 1, METATILE_ATTRIBUTE_BYTES, { bank: tileBank })
  };
}

function paletteBytesFromEntry(rom, info, entry) {
  const recipe = entry.recipe;
  return readBackgroundPalette(rom, info, {
    id: entry.id,
    paletteBank: recipe.palette.bank,
    paletteAddress: parseHex(recipe.palette.address)
  });
}

function assertRomBytes(rom, offset, expected) {
  const actual = Array.from(rom.subarray(offset, offset + expected.length));
  const matches = actual.length === expected.length && actual.every((byte, index) => byte === expected[index]);
  if (!matches) {
    throw new Error(
      `Actor row at ${hex(offset, 5)} expected ${publicBytes(expected).join(' ')} but found ${publicBytes(actual).join(' ')}`
    );
  }
  return actual;
}

function parseHexByteList(values) {
  return Buffer.from(values.map((value) => parseHex(value) & 0xff));
}

function readActorPaletteMemory(source) {
  if (source.type === 'palette-capture') {
    const resolved = path.resolve(source.file);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Actor sprite palette capture is missing: ${source.file}`);
    }
    return {
      bytes: fs.readFileSync(resolved),
      source: source.file
    };
  }

  if (source.type === 'fishman-proof') {
    const proofFile = path.resolve(path.join('out', 'fishman-sprite-proof', 'analysis.json'));
    if (!fs.existsSync(proofFile)) {
      throw new Error(`Fishman sprite proof is missing: ${path.relative(process.cwd(), proofFile)}`);
    }
    const proof = JSON.parse(fs.readFileSync(proofFile, 'utf8'));
    const variant = proof.proof?.paletteAndChr?.variants?.find((candidate) => candidate.id === source.fishmanVariant);
    if (!variant) {
      throw new Error(`Fishman proof does not contain palette variant ${source.fishmanVariant}`);
    }
    return {
      bytes: parseHexByteList(variant.palette.ppuPaletteMemory),
      source: `out/fishman-sprite-proof/analysis.json#${source.fishmanVariant}`
    };
  }

  throw new Error(`Unknown actor palette source type: ${source.type}`);
}

function spritePaletteBytes(source) {
  const memory = readActorPaletteMemory(source);
  if (memory.bytes.length < 0x20) {
    throw new Error(`Actor sprite palette source ${memory.source} must contain 32 PPU palette bytes`);
  }
  return {
    bytes: memory.bytes.subarray(0x10, 0x20),
    source: memory.source
  };
}

function actorFrameBounds(frames) {
  let minX = 0;
  let minY = 0;
  let maxX = 8;
  let maxY = SPRITE_HEIGHT;
  for (const frame of frames) {
    for (const sprite of frame.sprites) {
      minX = Math.min(minX, sprite.xOffset);
      minY = Math.min(minY, sprite.yOffset);
      maxX = Math.max(maxX, sprite.xOffset + 8);
      maxY = Math.max(maxY, sprite.yOffset + SPRITE_HEIGHT);
    }
  }
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function decodePatternPixel(patterns, tileIndex, tableBase, x, y) {
  const tileOffset = tableBase + tileIndex * 16;
  if (tileOffset + y + 8 >= patterns.length) {
    return 0;
  }
  const low = patterns[tileOffset + y];
  const high = patterns[tileOffset + y + 8];
  const bit = 7 - x;
  return ((low >> bit) & 1) | (((high >> bit) & 1) << 1);
}

function includePixelBounds(bounds, x, y) {
  if (!bounds) {
    return { minX: x, minY: y, maxX: x + 1, maxY: y + 1 };
  }
  bounds.minX = Math.min(bounds.minX, x);
  bounds.minY = Math.min(bounds.minY, y);
  bounds.maxX = Math.max(bounds.maxX, x + 1);
  bounds.maxY = Math.max(bounds.maxY, y + 1);
  return bounds;
}

function actorOpaqueBounds(frames, patterns) {
  let bounds = null;
  for (const frame of frames) {
    for (const sprite of frame.sprites) {
      const tile = parseHex(sprite.tile);
      const flipHorizontal = sprite.flipHorizontal;
      const flipVertical = sprite.flipVertical;
      for (let row = 0; row < SPRITE_HEIGHT; row += 1) {
        const patternY = flipVertical ? SPRITE_HEIGHT - 1 - row : row;
        const tableBase = (tile & 0x01) ? 0x1000 : 0x0000;
        const patternTile = (tile & 0xfe) + Math.floor(patternY / 8);
        const tileY = patternY % 8;
        for (let col = 0; col < TILE_SIZE; col += 1) {
          const tileX = flipHorizontal ? TILE_SIZE - 1 - col : col;
          if (decodePatternPixel(patterns, patternTile, tableBase, tileX, tileY) === 0) {
            continue;
          }
          bounds = includePixelBounds(bounds, sprite.xOffset + col, sprite.yOffset + row);
        }
      }
    }
  }

  if (!bounds) {
    return null;
  }

  return {
    ...bounds,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
    source: 'chr-nonzero-pixels'
  };
}

function publicSprite(sprite) {
  return {
    tile: hex(sprite.tile, 2),
    attr: hex(sprite.attr, 2),
    palette: sprite.attr & 0x03,
    flipHorizontal: (sprite.attr & 0x40) !== 0,
    flipVertical: (sprite.attr & 0x80) !== 0,
    xOffset: sprite.xOffset,
    yOffset: sprite.yOffset
  };
}

function buildActorClass(rom, info, addChrSet, actorClass) {
  const selectorRecord = decodeSelectorRecordAt(
    rom,
    info,
    SELECTOR_RECORD_BASE + actorClass.selectorRecordIndex * 3
  );
  const frames = selectorRecord.selectors.map((selector) => {
    const decoded = decodeMetaspriteSelector(rom, info, selector);
    return {
      selector: hex(selector, 2),
      pointer: hex(decoded.pointer.target, 4),
      status: hex(decoded.status, 2),
      sprites: decoded.sprites.map(publicSprite)
    };
  });
  const chrSet = addChrSet(actorClass.chrBanks);
  const patterns = readChrPair(rom, info, actorClass.chrBanks);
  return {
    id: actorClass.id,
    label: actorClass.label,
    kind: actorClass.kind,
    actorId: hex(actorClass.actorId, 2),
    chrSet: chrSet.id,
    largeSprites: true,
    spriteHeight: SPRITE_HEIGHT,
    hp: actorClass.hp || null,
    selectorRecord: {
      index: hex(actorClass.selectorRecordIndex, 2),
      cpuAddress: hex(selectorRecord.cpuAddress, 4),
      fileOffset: hex(selectorRecord.fileOffset, 5),
      bytes: publicBytes(selectorRecord.bytes),
      selectors: selectorRecord.selectors.map((selector) => hex(selector, 2))
    },
    frames,
    bounds: actorFrameBounds(frames),
    opaqueBounds: actorOpaqueBounds(frames, patterns),
    proof: actorClass.proof
  };
}

function buildActorPlacement(rom, classById, segmentById, actor) {
  const bytes = assertRomBytes(rom, actor.offset, actor.bytes);
  const actorClass = actor.classId ? classById.get(actor.classId) : null;
  const segment = segmentById.get(actor.segmentId);
  if (!segment) {
    throw new Error(`Actor ${actor.id} references missing segment ${actor.segmentId}`);
  }
  if (actor.classId && !actorClass) {
    throw new Error(`Actor ${actor.id} references missing actor class ${actor.classId}`);
  }
  const kind = actor.kind || actorClass.kind;
  const label = actor.label || actorClass.label;
  const hp = actorClass?.hp || null;
  const runtimePixelX = bytes[0] * ACTOR_CELL_SIZE;
  const runtimePixelY = bytes[1] * ACTOR_CELL_SIZE;
  const drawPixelX = runtimePixelX + ACTOR_DRAW_ANCHOR_OFFSET_X;
  const drawPixelY = runtimePixelY + ACTOR_DRAW_ANCHOR_OFFSET_Y;
  return {
    id: actor.id,
    classId: actor.classId,
    label,
    kind,
    segmentId: actor.segmentId,
    variants: actor.variants || ['day', 'night'],
    paletteByVariant: actor.paletteByVariant || {},
    tileX: bytes[0],
    tileY: bytes[1],
    pixelX: drawPixelX,
    pixelY: drawPixelY,
    worldX: segment.position.x + drawPixelX,
    worldY: segment.position.y + drawPixelY,
    actorId: hex(bytes[2], 2),
    data: hex(bytes[3], 2),
    hp,
    text: actor.text || null,
    visualTileRect: actor.visualTileRect || null,
    runtimeAnchor: {
      pixelX: runtimePixelX,
      pixelY: runtimePixelY,
      worldX: segment.position.x + runtimePixelX,
      worldY: segment.position.y + runtimePixelY
    },
    drawAnchor: {
      offsetX: ACTOR_DRAW_ANCHOR_OFFSET_X,
      offsetY: ACTOR_DRAW_ANCHOR_OFFSET_Y,
      source: 'rom-row-16px-cell-visual-anchor'
    },
    provenance: {
      rowOffset: hex(actor.offset, 5),
      rawBytes: publicBytes(bytes),
      source: 'rom-actor-row'
    }
  };
}

function buildGuideSlice(rom, info, opts) {
  const slicePath = path.resolve(opts.sliceFile);
  const atlasPath = path.resolve(opts.atlasFile);
  const outDir = path.resolve(opts.outDir);
  const sliceConfig = JSON.parse(fs.readFileSync(slicePath, 'utf8'));
  const atlas = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
  const entriesById = new Map(atlas.entries.map((entry) => [entry.id, entry]));
  const chunks = [];
  const chrSets = [];
  const chrSetByKey = new Map();
  const tileSets = [];
  const tileSetByKey = new Map();
  const palettes = [];
  const spritePalettes = [];
  const segments = [];
  const validations = [];

  function addChrSet(chrBanks) {
    const key = chrBanks.join('-');
    if (chrSetByKey.has(key)) {
      return chrSetByKey.get(key);
    }
    const id = `chr-${chrBanks.map((bank) => bank.toString(16).padStart(2, '0')).join('-')}`;
    const chunk = appendChunk(chunks, readChrPair(rom, info, chrBanks));
    const record = {
      id,
      banks: chrBanks.map((bank) => `0x${bank.toString(16).toUpperCase().padStart(2, '0')}`),
      data: chunk,
      decodedAtlas: {
        width: 128,
        height: 256,
        tilesPerRow: 16,
        tileCount: 512
      }
    };
    chrSets.push(record);
    chrSetByKey.set(key, record);
    return record;
  }

  function addTileSet(metadata) {
    const raw = readMetatileSet(rom, info, metadata);
    const key = [raw.tileBank, raw.tileSetAddress, raw.tileBaseAddress].join(':');
    if (tileSetByKey.has(key)) {
      return tileSetByKey.get(key);
    }
    const id = `tiles-${raw.tileBank}-${raw.tileSetAddress.toString(16)}-${raw.tileBaseAddress.toString(16)}`;
    const tiles = appendChunk(chunks, raw.metatileTiles);
    const attributes = appendChunk(chunks, raw.metatileAttributes);
    const record = {
      id,
      tileBank: raw.tileBank,
      tileSetAddress: `0x${raw.tileSetAddress.toString(16).toUpperCase().padStart(4, '0')}`,
      tileBaseAddress: `0x${raw.tileBaseAddress.toString(16).toUpperCase().padStart(4, '0')}`,
      metatileTiles: tiles,
      metatileAttributes: attributes
    };
    tileSets.push(record);
    tileSetByKey.set(key, record);
    return record;
  }

function addPalette(segmentId, variant, entry) {
    const bytes = paletteBytesFromEntry(rom, info, entry);
    const chunk = appendChunk(chunks, bytes);
    const record = {
      id: `${segmentId}-${variant}`,
      segmentId,
      variant,
      paletteAddress: entry.recipe.palette.address,
      paletteBank: entry.recipe.palette.bank,
      data: chunk
    };
    palettes.push(record);
    return record;
  }

  function addSpritePalette(source) {
    const palette = spritePaletteBytes(source);
    const chunk = appendChunk(chunks, palette.bytes);
    const record = {
      id: source.id,
      label: source.label,
      source: palette.source,
      data: chunk,
      bytes: publicBytes(palette.bytes)
    };
    spritePalettes.push(record);
    return record;
  }

  function variantsForSegment(segmentConfig) {
    return segmentConfig.variants || ['day', 'night'];
  }

  for (const segmentConfig of sliceConfig.segments) {
    const variants = variantsForSegment(segmentConfig);
    const entries = variants.map((variant) => {
      const entry = entriesById.get(`${segmentConfig.locationId}-${variant}`);
      if (!entry) {
        throw new Error(`${segmentConfig.locationId} is missing ${variant} atlas entry`);
      }
      if (entry.renderStatus !== 'rendered') {
        throw new Error(`${segmentConfig.locationId} ${variant} entry must be rendered`);
      }
      return [variant, entry];
    });
    const [, layoutEntry] = entries[0];
    const segment = segmentFromEntry(layoutEntry);
    const rendered = renderLayoutSegment(rom, info, segment);
    const blockMatrix = cropBlocks(columnLayoutToBlocks(rendered.metadata), segmentConfig.crop);
    const chrSet = addChrSet(segment.templates[segment.template].chrBanks);
    const tileSet = addTileSet(rendered.metadata);
    const layoutBlocks = appendChunk(chunks, blockMatrix.blocks);
    const palettesByVariant = {};
    const atlasEntriesByVariant = {};
    const recipeStatusByVariant = {};

    for (const [variant, entry] of entries) {
      const palette = addPalette(segmentConfig.id, variant, entry);
      palettesByVariant[variant] = palette.id;
      atlasEntriesByVariant[variant] = entry.id;
      recipeStatusByVariant[variant] = entry.recipe.status;
    }

    if (segmentConfig.validation) {
      const validation = compareRgbaWithYOffset(rendered, segmentConfig.validation);
      validations.push({
        segmentId: segmentConfig.id,
        ...validation
      });
      if (validation.differingPixels !== validation.requiredDifferingPixels) {
        throw new Error(
          `${segmentConfig.id} validation expected ${validation.requiredDifferingPixels} differing pixels, got ${validation.differingPixels}`
        );
      }
    }

    segments.push({
      id: segmentConfig.id,
      locationId: segmentConfig.locationId,
      label: segmentConfig.label || layoutEntry.name,
      sourceName: layoutEntry.name,
      position: {
        x: segmentConfig.x,
        y: segmentConfig.y,
        width: blockMatrix.blockWidth * BLOCK_SIZE,
        height: blockMatrix.blockHeight * BLOCK_SIZE
      },
      blockSize: BLOCK_SIZE,
      tileSize: TILE_SIZE,
      blockWidth: blockMatrix.blockWidth,
      blockHeight: blockMatrix.blockHeight,
      tileWidth: blockMatrix.blockWidth * BLOCK_TILES,
      tileHeight: blockMatrix.blockHeight * BLOCK_TILES,
      crop: blockMatrix.crop,
      chrSet: chrSet.id,
      tileSet: tileSet.id,
      layoutBlocks,
      variants,
      defaultVariant: segmentConfig.defaultVariant || variants[0],
      palettes: palettesByVariant,
      atlasEntries: atlasEntriesByVariant,
      recipeStatus: recipeStatusByVariant,
      provenance: {
        pixels: sliceConfig.provenance?.pixels || 'rom-derived',
        layout: sliceConfig.provenance?.layout || 'presentation-authored',
        binary: 'rom-derived-tile-data'
      }
    });
  }

  const segmentById = new Map(segments.map((segment) => [segment.id, segment]));
  const actorsForSlice = GUIDE_ACTORS.filter((actor) => segmentById.has(actor.segmentId));
  const actorClasses = actorsForSlice.length > 0
    ? ACTOR_CLASSES.map((actorClass) => buildActorClass(rom, info, addChrSet, actorClass))
    : [];
  const actorClassById = new Map(actorClasses.map((actorClass) => [actorClass.id, actorClass]));
  if (actorsForSlice.length > 0) {
    for (const source of ACTOR_PALETTE_SOURCES) {
      addSpritePalette(source);
    }
  }
  const actors = actorsForSlice.map((actor) => buildActorPlacement(rom, actorClassById, segmentById, actor));

  const world = segments.reduce((bounds, segment) => ({
    width: Math.max(bounds.width, segment.position.x + segment.position.width),
    height: Math.max(bounds.height, segment.position.y + segment.position.height)
  }), { width: 0, height: 0 });

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const data = Buffer.concat(chunks);
  const dataFile = path.join(outDir, 'slice-data.bin');
  fs.writeFileSync(dataFile, data);

  const manifest = {
    schemaVersion: 1,
    id: sliceConfig.id,
    label: sliceConfig.label,
    summary: sliceConfig.summary,
    source: {
      sliceConfig: path.relative(process.cwd(), slicePath),
      atlas: path.relative(process.cwd(), atlasPath),
      renderer: 'rust-wasm-webgl-tilemap-v1',
      notes: [
        'Pixels are rendered in the browser from ROM-derived CHR, layout, metatile, and palette bytes.',
        'Actor sprites are rendered in the browser from ROM-derived CHR, decoded metasprite selector records, and packed runtime sprite palette bytes.',
        'Presentation coordinates are authored for player readability and are not ROM world coordinates.',
        'No PNG map textures are emitted for this app slice.'
      ]
    },
    provenance: sliceConfig.provenance,
    world,
    dataFile: 'slice-data.bin',
    byteLength: data.length,
    chrSets,
    tileSets,
    palettes,
    spritePalettes,
    segments,
    actorClasses,
    actors,
    actorSummary: {
      classes: actorClasses.length,
      placements: actors.length,
      npcs: actors.filter((actor) => actor.kind === 'npc').length,
      enemies: actors.filter((actor) => actor.kind === 'enemy').length,
      fixtures: actors.filter((actor) => actor.kind === 'fixture').length
    },
    validations
  };
  const manifestPath = path.join(outDir, 'slice.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  return {
    output: outDir,
    manifest: manifestPath,
    dataFile,
    byteLength: data.length,
    summary: {
      segments: segments.length,
      chrSets: chrSets.length,
      tileSets: tileSets.length,
      palettes: palettes.length,
      validations: validations.length,
      world
    }
  };
}

module.exports = {
  buildGuideSlice
};
