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
const TEXT_POINTER_TABLE_FILE_OFFSET = 0xcb92;
const TEXT_POINTER_TABLE_BANK = 3;
const TEXT_END_BYTE = 0xff;
const SPRITE_PALETTE_BYTES = 16;
const COMMON_SPRITE_PALETTE_ADDRESS = 0xcaae;
const COMMON_SPRITE_PALETTE_LENGTH = 8;
const VARIANT_SPRITE_PALETTE_LENGTH = 8;
const SPRITE_HEIGHT = 16;
const ACTOR_CELL_SIZE = 16;
// Actor rows store the runtime anchor on a 16px grid; the guide draws at the visual spawn-cell anchor.
const ACTOR_DRAW_ANCHOR_OFFSET_X = ACTOR_CELL_SIZE / 2;
const ACTOR_DRAW_ANCHOR_OFFSET_Y = -12;

const FIXTURE_TILE_SIGNATURES = {
  townSign: {
    id: 'town-sign-4x4',
    label: 'Town signpost',
    width: 4,
    height: 4,
    searchRadiusTiles: 8,
    tiles: [
      [0x65, 0x66, 0x66, 0x67],
      [0x65, 0x66, 0x66, 0x67],
      [0x00, 0x68, 0x00, 0x00],
      [0x00, 0x68, 0x00, 0x00]
    ],
    palettes: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    source: 'rom-expanded-background-tilemap'
  },
  destructibleBlock2x2: {
    id: 'destructible-block-2x2',
    label: 'Destructible block',
    width: 2,
    height: 2,
    searchRadiusTiles: 8,
    tiles: [
      [0xfb, 0xfd],
      [0xfc, 0xfe]
    ],
    source: 'rom-expanded-background-tilemap'
  },
  destructibleBlock2x4: {
    id: 'destructible-block-2x4',
    label: 'Stacked destructible blocks',
    width: 2,
    height: 4,
    searchRadiusTiles: 8,
    tiles: [
      [0xfb, 0xfd],
      [0xfc, 0xfe],
      [0xfb, 0xfd],
      [0xfc, 0xfe]
    ],
    source: 'rom-expanded-background-tilemap'
  }
};

const ACTOR_PALETTE_SOURCES = [
  {
    id: 'town-day-sprites',
    label: 'Town actor sprites, day',
    type: 'rom-sprite-palette',
    variantAddress: 0x9f2a,
    variantBank: 4
  },
  {
    id: 'town-night-sprites',
    label: 'Town actor sprites, night',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb5c
  },
  {
    id: 'jova-woods-day-sprites',
    label: 'Jova Woods sprites, day',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb26
  },
  {
    id: 'jova-woods-night-sprites',
    label: 'Jova Woods sprites, night',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb26
  },
  {
    id: 'south-bridge-day-sprites',
    label: 'South Bridge sprites, day',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb26
  },
  {
    id: 'south-bridge-night-sprites',
    label: 'South Bridge sprites, night',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb26
  },
  {
    id: 'veros-woods-day-sprites',
    label: 'Veros Woods sprites, day',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb2f
  },
  {
    id: 'veros-woods-night-sprites',
    label: 'Veros Woods sprites, night',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb2f
  },
  {
    id: 'denis-woods-day-sprites',
    label: 'Denis Woods sprites, day',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb2f
  },
  {
    id: 'denis-woods-night-sprites',
    label: 'Denis Woods sprites, night',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb26
  },
  {
    id: 'dabis-path-day-sprites',
    label: "Dabi's Path sprites, day",
    type: 'rom-sprite-palette',
    variantAddress: 0xcb38
  },
  {
    id: 'dabis-path-night-sprites',
    label: "Dabi's Path sprites, night (same ROM palette transfer as day)",
    type: 'rom-sprite-palette',
    variantAddress: 0xcb38
  }
];

const TEXT_CHAR_BY_BYTE = new Map([
  [0x00, ' '],
  [0x01, 'a'],
  [0x02, 'b'],
  [0x03, 'c'],
  [0x04, 'd'],
  [0x05, 'e'],
  [0x06, 'f'],
  [0x07, 'g'],
  [0x08, 'h'],
  [0x09, 'i'],
  [0x0a, 'j'],
  [0x0b, 'k'],
  [0x0c, 'l'],
  [0x0d, 'm'],
  [0x0e, 'n'],
  [0x0f, 'o'],
  [0x10, 'p'],
  [0x11, 'q'],
  [0x12, 'r'],
  [0x13, 's'],
  [0x14, 't'],
  [0x15, 'u'],
  [0x16, 'v'],
  [0x17, 'w'],
  [0x18, 'x'],
  [0x19, 'y'],
  [0x1a, 'z'],
  [0x1b, '.'],
  [0x1c, "'"],
  [0x1d, '^'],
  [0x1e, ','],
  [0x36, '0'],
  [0x37, '1'],
  [0x38, '2'],
  [0x39, '3'],
  [0x3a, '4'],
  [0x3b, '5'],
  [0x3c, '6'],
  [0x3d, '7'],
  [0x3e, '8'],
  [0x3f, '9'],
  [0x40, '!'],
  [0x46, '-'],
  [0x5d, '?'],
  [0xfe, '\n']
]);

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
    id: 'town-woman',
    label: 'Town woman',
    kind: 'npc',
    actorId: 0xa9,
    selectorRecordIndex: 0x0a,
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $A9 maps through live id $29; the shared town routine at 1:$8F50 selects animation record $0A, which emits selectors $1C/$1D.'
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
    id: 'bat',
    label: 'Bat',
    kind: 'enemy',
    actorId: 0x01,
    selectorRecordIndex: 0x08,
    chrBanks: [0x00, 0x01],
    proof: 'ROM actor id $01 dispatches to 1:$8FAA, which writes selector-stream record $08 before normal actor rendering.'
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
    id: 'eyeball',
    label: 'Eyeball',
    kind: 'enemy',
    actorId: 0x08,
    selectorRecordIndex: 0x39,
    chrBanks: [0x02, 0x03],
    proof: 'ROM actor id $08 dispatches to 1:$A7CA, which writes selector-stream record $39.'
  },
  {
    id: 'zigzag-bat',
    label: 'Bat',
    kind: 'enemy',
    actorId: 0x09,
    selectorRecordIndex: 0x3a,
    chrBanks: [0x02, 0x03],
    staticPreview: {
      mode: 'flight-body-frame-offsets',
      frameOffsetBySelector: {
        '0xC8': { x: 0, y: 0 },
        '0xC9': { x: 0, y: 6 }
      },
      reason: 'The ROM zigzag bat moves while flapping. Static guide placement offsets the second selector frame so the body does not appear to snap upward inside a fixed map marker.'
    },
    proof: 'ROM actor id $09 dispatches to 1:$A7F2, which writes selector-stream record $3A after its movement setup.'
  },
  {
    id: 'spider',
    label: 'Spider',
    kind: 'enemy',
    actorId: 0x0e,
    selectorRecordIndex: 0x23,
    chrBanks: [0x02, 0x03],
    proof: 'ROM actor id $0E dispatches to 1:$8425, which writes selector-stream record $23.'
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
  },
  {
    id: 'sacred-flame-secret',
    label: 'Sacred Flame',
    kind: 'secret',
    actorId: 0x26,
    selectorRecordIndex: 0x20,
    chrBanks: [0x02, 0x03],
    proof: 'ROM actor id $26 dispatches through 1:$8335; that routine passes selector-record index $20 to fixed-bank $DED8, which emits metasprites $78/$79 for the sacred-flame reward fixture.'
  },
  {
    id: 'hidden-book-secret',
    label: 'Hidden clue book',
    kind: 'secret',
    actorId: 0x27,
    selectorRecordIndex: 0x3b,
    chrBanks: [0x02, 0x03],
    proof: 'ROM actor id $27 dispatches through 1:$8335; that routine passes selector-record index $3B to fixed-bank $DED8, which emits metasprite $30 for the book fixture.'
  }
];

const SECRET_DETAILS = {
  'dabis-2-sacred-flame-66b0': {
    type: 'destructible-reward',
    reward: 'Sacred Flame',
    action: "Throw Holy Water at the marked stacked blocks, or equip Dracula's Nail and whip them, to reveal the Sacred Flame.",
    reveal: 'The Sacred Flame appears after the stacked blocks are opened.',
    targetTileRects: [
      { x: 2, y: 20, width: 2, height: 4, signature: 'destructibleBlock2x4' }
    ],
    rewardSelectorRecord: '0x20',
    rewardSelectors: ['0x78', '0x79'],
    evidence: [
      'Actor row 0x066B0: 01 0C 26 76',
      'Actor id 0x26 uses item/fixture dispatch 1:$8335 and selector-record index $20.',
      'Selector-record $20 expands to metasprite selectors $78/$79.',
      "Holy Water is weapon index 4: fixed-bank 7:$F237-$F2D2 selects $4A bit $08, and 7:$D8C0 spawns projectile actor $33 for that selected weapon.",
      "Dracula's Nail is inventory index 4: fixed-bank 7:$F275 maps $91 bit $08 to selected item $04, and 7:$D623 gates the block-hit routine on $4F == 04 before calling 7:$D3AC.",
      'Text pointer index 0x76 decodes to the Sacred Flame pickup message.'
    ]
  },
  'aljiba-1-book-66d5': {
    type: 'destructible-clue',
    reward: 'Hidden clue book',
    action: "Throw Holy Water at the marked block, or equip Dracula's Eyeball, to reveal the hidden clue book.",
    reveal: 'The clue book appears at the marked spot.',
    targetTileRects: [
      { x: 10, y: 24, width: 2, height: 2, signature: 'destructibleBlock2x2' }
    ],
    rewardSelectorRecord: '0x3B',
    rewardSelectors: ['0x30'],
    evidence: [
      'Actor row 0x066D5: 05 0D 27 0D',
      'Actor id 0x27 uses item/fixture dispatch 1:$8335 and selector-record index $3B.',
      'Selector-record $3B expands to metasprite selector $30.',
      "Holy Water is weapon index 4: fixed-bank 7:$F237-$F2D2 selects $4A bit $08, and 7:$D8C0 spawns projectile actor $33 for that selected weapon.",
      "Dracula's Eyeball is inventory index 3: fixed-bank 7:$F275 maps $91 bit $04 to selected item $03, and actor routine 1:$8335 clears the hidden flag when $4F == 03.",
      'Text pointer index 0x0D decodes to the blue-crystal lake clue.'
    ]
  }
};

const GUIDE_ACTORS = [
  { id: 'jova-shepherd-50bc', classId: 'jova-shepherd', segmentId: 'town-of-jova', offset: 0x50bc, bytes: [0x04, 0x0c, 0xb5, 0x38], variants: ['day'], text: 'first thing to do in this town is buy a white crystal.', paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-shepherd-50c0', classId: 'jova-shepherd', segmentId: 'town-of-jova', offset: 0x50c0, bytes: [0x04, 0x1a, 0xb5, 0x3d], variants: ['day'], text: 'you have a friend in the town of aldra. go and see him.', paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-shepherd-50c4', classId: 'jova-shepherd', segmentId: 'town-of-jova', offset: 0x50c4, bytes: [0x08, 0x12, 0xb5, 0x3e], variants: ['day'], text: "13 clues will solve dracula's riddle.", paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'jova-sign-50c8', classId: null, label: 'Jova sign', kind: 'fixture', segmentId: 'town-of-jova', offset: 0x50c8, bytes: [0x0c, 0x1a, 0xa4, 0x3a], variants: ['day', 'night'], text: 'turn right for the jova woods. left for belasco marsh.', visualTileRect: { x: 24, y: 48, width: 4, height: 4 }, fixtureSignature: 'townSign' },
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
  { id: 'denis-skeleton-6084', classId: 'skeleton', segmentId: 'denis-woods-part-1', offset: 0x6084, bytes: [0x18, 0x0a, 0x03, 0x01], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },

  { id: 'veros-man-522a', classId: 'jova-man', label: 'Veros man', segmentId: 'town-of-veros', offset: 0x522a, bytes: [0x04, 0x0c, 0xaa, 0x40], variants: ['day'], paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'veros-bat-522e', classId: 'bat', label: 'Veros bat', segmentId: 'town-of-veros', offset: 0x522e, bytes: [0x04, 0x08, 0x01, 0x02], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'veros-man-5232', classId: 'jova-man', label: 'Veros man', segmentId: 'town-of-veros', offset: 0x5232, bytes: [0x0c, 0x0c, 0xaa, 0x43], variants: ['day'], paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'veros-sign-5236', classId: null, label: 'Veros sign', kind: 'fixture', segmentId: 'town-of-veros', offset: 0x5236, bytes: [0x0d, 0x0c, 0xa4, 0x3b], variants: ['day', 'night'], visualTileRect: { x: 24, y: 20, width: 4, height: 4 }, fixtureSignature: 'townSign' },
  { id: 'veros-man-523a', classId: 'jova-man', label: 'Veros man', segmentId: 'town-of-veros', offset: 0x523a, bytes: [0x14, 0x0c, 0xaa, 0x48], variants: ['day'], paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'veros-woman-523e', classId: 'town-woman', label: 'Veros woman', segmentId: 'town-of-veros', offset: 0x523e, bytes: [0x1a, 0x0c, 0xa9, 0x4f], variants: ['day'], paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'veros-zombie-5242', classId: 'zombie', segmentId: 'town-of-veros', offset: 0x5242, bytes: [0x18, 0x0c, 0x17, 0x02], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'veros-shepherd-5246', classId: 'jova-shepherd', label: 'Veros shepherd', segmentId: 'town-of-veros', offset: 0x5246, bytes: [0x1c, 0x0c, 0xb5, 0x50], variants: ['day'], paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'veros-shepherd-524a', classId: 'jova-shepherd', label: 'Veros shepherd', segmentId: 'town-of-veros', offset: 0x524a, bytes: [0x24, 0x0c, 0xb5, 0x39], variants: ['day'], paletteByVariant: { day: 'town-day-sprites' } },
  { id: 'veros-zombie-524e', classId: 'zombie', segmentId: 'town-of-veros', offset: 0x524e, bytes: [0x28, 0x0c, 0x17, 0x02], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'veros-zombie-5252', classId: 'zombie', segmentId: 'town-of-veros', offset: 0x5252, bytes: [0x2c, 0x0c, 0x17, 0x02], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'veros-zombie-5256', classId: 'zombie', segmentId: 'town-of-veros', offset: 0x5256, bytes: [0x34, 0x08, 0x17, 0x02], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
  { id: 'veros-bat-525a', classId: 'bat', label: 'Veros bat', segmentId: 'town-of-veros', offset: 0x525a, bytes: [0x34, 0x0c, 0x01, 0x02], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },

  { id: 'aljiba-3-spider-666a', classId: 'spider', segmentId: 'aljiba-woods-part-3', offset: 0x666a, bytes: [0x08, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-3-skeleton-666e', classId: 'skeleton', segmentId: 'aljiba-woods-part-3', offset: 0x666e, bytes: [0x0c, 0x0c, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-3-skeleton-6672', classId: 'skeleton', segmentId: 'aljiba-woods-part-3', offset: 0x6672, bytes: [0x14, 0x0a, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-3-spider-6676', classId: 'spider', segmentId: 'aljiba-woods-part-3', offset: 0x6676, bytes: [0x18, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-3-skeleton-667a', classId: 'skeleton', segmentId: 'aljiba-woods-part-3', offset: 0x667a, bytes: [0x1c, 0x0b, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },

  { id: 'dabis-1-skeleton-6683', classId: 'skeleton', segmentId: 'dabis-path-part-1', offset: 0x6683, bytes: [0x08, 0x0c, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-1-eyeball-6687', classId: 'eyeball', segmentId: 'dabis-path-part-1', offset: 0x6687, bytes: [0x08, 0x12, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-1-skeleton-668b', classId: 'skeleton', segmentId: 'dabis-path-part-1', offset: 0x668b, bytes: [0x08, 0x18, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-1-eyeball-668f', classId: 'eyeball', segmentId: 'dabis-path-part-1', offset: 0x668f, bytes: [0x0c, 0x06, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-1-skeleton-6693', classId: 'skeleton', segmentId: 'dabis-path-part-1', offset: 0x6693, bytes: [0x0c, 0x18, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-1-eyeball-669b', classId: 'eyeball', segmentId: 'dabis-path-part-1', offset: 0x669b, bytes: [0x14, 0x0c, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-1-skeleton-669f', classId: 'skeleton', segmentId: 'dabis-path-part-1', offset: 0x669f, bytes: [0x14, 0x1a, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-1-eyeball-66a3', classId: 'eyeball', segmentId: 'dabis-path-part-1', offset: 0x66a3, bytes: [0x18, 0x06, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-1-skeleton-66a7', classId: 'skeleton', segmentId: 'dabis-path-part-1', offset: 0x66a7, bytes: [0x18, 0x16, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-1-eyeball-66ab', classId: 'eyeball', segmentId: 'dabis-path-part-1', offset: 0x66ab, bytes: [0x1c, 0x0c, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },

  {
    id: 'dabis-2-sacred-flame-66b0',
    classId: 'sacred-flame-secret',
    label: 'Sacred Flame',
    kind: 'secret',
    segmentId: 'dabis-path-part-2',
    offset: 0x66b0,
    bytes: [0x01, 0x0c, 0x26, 0x76],
    variants: ['day', 'night'],
    paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' },
    visualTileRect: { x: 2, y: 20, width: 2, height: 4 },
    fixtureSignature: 'destructibleBlock2x4'
  },
  { id: 'dabis-2-eyeball-66b4', classId: 'eyeball', segmentId: 'dabis-path-part-2', offset: 0x66b4, bytes: [0x04, 0x04, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-zigzag-bat-66b8', classId: 'zigzag-bat', label: 'Zigzag bat', segmentId: 'dabis-path-part-2', offset: 0x66b8, bytes: [0x04, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-eyeball-66bc', classId: 'eyeball', segmentId: 'dabis-path-part-2', offset: 0x66bc, bytes: [0x0c, 0x06, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-zigzag-bat-66c0', classId: 'zigzag-bat', label: 'Zigzag bat', segmentId: 'dabis-path-part-2', offset: 0x66c0, bytes: [0x0c, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-eyeball-66c4', classId: 'eyeball', segmentId: 'dabis-path-part-2', offset: 0x66c4, bytes: [0x14, 0x06, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-zigzag-bat-66c8', classId: 'zigzag-bat', label: 'Zigzag bat', segmentId: 'dabis-path-part-2', offset: 0x66c8, bytes: [0x14, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-zigzag-bat-66cc', classId: 'zigzag-bat', label: 'Zigzag bat', segmentId: 'dabis-path-part-2', offset: 0x66cc, bytes: [0x1c, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },

  { id: 'aljiba-1-spider-66d1', classId: 'spider', segmentId: 'aljiba-woods-part-1', offset: 0x66d1, bytes: [0x04, 0x04, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  {
    id: 'aljiba-1-book-66d5',
    classId: 'hidden-book-secret',
    label: 'Hidden clue book',
    kind: 'secret',
    segmentId: 'aljiba-woods-part-1',
    offset: 0x66d5,
    bytes: [0x05, 0x0d, 0x27, 0x0d],
    variants: ['day', 'night'],
    paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' },
    visualTileRect: { x: 10, y: 24, width: 2, height: 2 },
    fixtureSignature: 'destructibleBlock2x2'
  },
  { id: 'aljiba-1-skeleton-66d9', classId: 'skeleton', segmentId: 'aljiba-woods-part-1', offset: 0x66d9, bytes: [0x08, 0x08, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-1-spider-66dd', classId: 'spider', segmentId: 'aljiba-woods-part-1', offset: 0x66dd, bytes: [0x0c, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-1-spider-66e1', classId: 'spider', segmentId: 'aljiba-woods-part-1', offset: 0x66e1, bytes: [0x14, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-1-skeleton-66e5', classId: 'skeleton', segmentId: 'aljiba-woods-part-1', offset: 0x66e5, bytes: [0x18, 0x0a, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-1-skeleton-66e9', classId: 'skeleton', segmentId: 'aljiba-woods-part-1', offset: 0x66e9, bytes: [0x1c, 0x08, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },

  { id: 'aljiba-2-skeleton-66ee', classId: 'skeleton', segmentId: 'aljiba-woods-part-2', offset: 0x66ee, bytes: [0x04, 0x08, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-2-skeleton-66f2', classId: 'skeleton', segmentId: 'aljiba-woods-part-2', offset: 0x66f2, bytes: [0x08, 0x0a, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-2-skeleton-66f6', classId: 'skeleton', segmentId: 'aljiba-woods-part-2', offset: 0x66f6, bytes: [0x0c, 0x0c, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-2-skeleton-66fa', classId: 'skeleton', segmentId: 'aljiba-woods-part-2', offset: 0x66fa, bytes: [0x14, 0x0c, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'aljiba-2-skeleton-66fe', classId: 'skeleton', segmentId: 'aljiba-woods-part-2', offset: 0x66fe, bytes: [0x18, 0x0a, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },

  { id: 'denis-2-skeleton-6703', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x6703, bytes: [0x04, 0x0a, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-6707', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x6707, bytes: [0x08, 0x0a, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-670b', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x670b, bytes: [0x0c, 0x0b, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-670f', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x670f, bytes: [0x14, 0x08, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-zigzag-bat-6713', classId: 'zigzag-bat', label: 'Zigzag bat', segmentId: 'denis-woods-part-2', offset: 0x6713, bytes: [0x16, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-6717', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x6717, bytes: [0x18, 0x06, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-671f', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x671f, bytes: [0x24, 0x06, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-6727', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x6727, bytes: [0x28, 0x08, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-672b', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x672b, bytes: [0x2c, 0x08, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-zigzag-bat-672f', classId: 'zigzag-bat', label: 'Zigzag bat', segmentId: 'denis-woods-part-2', offset: 0x672f, bytes: [0x2d, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },

  { id: 'denis-3-spider-6734', classId: 'spider', segmentId: 'denis-woods-part-3', offset: 0x6734, bytes: [0x04, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-3-skeleton-6738', classId: 'skeleton', segmentId: 'denis-woods-part-3', offset: 0x6738, bytes: [0x08, 0x0c, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-3-spider-673c', classId: 'spider', segmentId: 'denis-woods-part-3', offset: 0x673c, bytes: [0x0c, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-3-spider-6740', classId: 'spider', segmentId: 'denis-woods-part-3', offset: 0x6740, bytes: [0x14, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-3-skeleton-6744', classId: 'skeleton', segmentId: 'denis-woods-part-3', offset: 0x6744, bytes: [0x18, 0x0a, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } }
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

function materializeLayoutSample(sliceConfig, requestedLayout) {
  const samples = sliceConfig.layoutSamples || [];
  if (samples.length === 0) {
    if (requestedLayout) {
      throw new Error(`${sliceConfig.id} does not define layout sample ${requestedLayout}`);
    }
    return {
      sliceConfig,
      activeLayout: null,
      availableLayouts: []
    };
  }

  const layoutId = requestedLayout || sliceConfig.defaultLayout || samples[0].id;
  const layout = samples.find((sample) => sample.id === layoutId);
  if (!layout) {
    throw new Error(`${sliceConfig.id} does not define layout sample ${layoutId}`);
  }

  const segmentById = new Map(sliceConfig.segments.map((segment) => [segment.id, segment]));
  const segments = layout.segments.map((placement) => {
    const sourceId = placement.sourceId || placement.id;
    const source = segmentById.get(sourceId);
    if (!source) {
      throw new Error(`${layout.id} references unknown guide segment ${sourceId}`);
    }
    return {
      ...source,
      ...placement,
      id: placement.id || source.id,
      label: placement.label || source.label,
      sourceId,
      x: placement.x,
      y: placement.y
    };
  });

  return {
    sliceConfig: {
      ...sliceConfig,
      id: `${sliceConfig.id}-${layout.id}`,
      summary: layout.summary || sliceConfig.summary,
      segments
    },
    activeLayout: {
      id: layout.id,
      label: layout.label || layout.id,
      summary: layout.summary || sliceConfig.summary,
      markers: layout.markers || []
    },
    availableLayouts: samples.map((sample) => ({
      id: sample.id,
      label: sample.label || sample.id,
      summary: sample.summary || sliceConfig.summary
    }))
  };
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

function paletteBits(attribute, tileRow, tileCol) {
  const quadrant = (tileRow >= 2 ? 2 : 0) + (tileCol >= 2 ? 1 : 0);
  return (attribute >> (quadrant * 2)) & 0x03;
}

function expandSegmentTilemap(layoutBlocks, metatileTiles, metatileAttributes, blockWidth, blockHeight) {
  const tileWidth = blockWidth * BLOCK_TILES;
  const tileHeight = blockHeight * BLOCK_TILES;
  const tilemap = Buffer.alloc(tileWidth * tileHeight * 4);

  for (let blockY = 0; blockY < blockHeight; blockY += 1) {
    for (let blockX = 0; blockX < blockWidth; blockX += 1) {
      const blockIndex = layoutBlocks[blockY * blockWidth + blockX] || 0;
      const attribute = metatileAttributes[blockIndex] || 0;
      for (let tileRow = 0; tileRow < BLOCK_TILES; tileRow += 1) {
        for (let tileCol = 0; tileCol < BLOCK_TILES; tileCol += 1) {
          const source = blockIndex * 16 + tileRow * BLOCK_TILES + tileCol;
          const tileIndex = metatileTiles[source] || 0;
          const palette = paletteBits(attribute, tileRow, tileCol);
          const outTileX = blockX * BLOCK_TILES + tileCol;
          const outTileY = blockY * BLOCK_TILES + tileRow;
          const out = (outTileY * tileWidth + outTileX) * 4;
          tilemap[out] = tileIndex;
          tilemap[out + 1] = palette;
          tilemap[out + 2] = 0;
          tilemap[out + 3] = 255;
        }
      }
    }
  }

  return {
    tilemap,
    tileWidth,
    tileHeight
  };
}

function tilemapEntry(expandedTilemap, x, y) {
  if (
    x < 0 ||
    y < 0 ||
    x >= expandedTilemap.tileWidth ||
    y >= expandedTilemap.tileHeight
  ) {
    return null;
  }
  const offset = (y * expandedTilemap.tileWidth + x) * 4;
  return {
    tile: expandedTilemap.tilemap[offset],
    palette: expandedTilemap.tilemap[offset + 1]
  };
}

function signatureExpectedAt(signature, x, y) {
  return {
    tile: signature.tiles?.[y]?.[x],
    palette: signature.palettes?.[y]?.[x]
  };
}

function fixtureSignatureScore(expandedTilemap, signature, rect) {
  let matches = 0;
  let total = 0;
  const mismatches = [];

  for (let y = 0; y < signature.height; y += 1) {
    for (let x = 0; x < signature.width; x += 1) {
      const expected = signatureExpectedAt(signature, x, y);
      if (expected.tile == null && expected.palette == null) {
        continue;
      }
      total += 1;
      const actual = tilemapEntry(expandedTilemap, rect.x + x, rect.y + y);
      const tileMatches = expected.tile == null || actual?.tile === expected.tile;
      const paletteMatches = expected.palette == null || actual?.palette === expected.palette;
      if (tileMatches && paletteMatches) {
        matches += 1;
        continue;
      }
      mismatches.push({
        x,
        y,
        expected: {
          ...(expected.tile == null ? {} : { tile: hex(expected.tile, 2) }),
          ...(expected.palette == null ? {} : { palette: expected.palette })
        },
        actual: actual
          ? { tile: hex(actual.tile, 2), palette: actual.palette }
          : null
      });
    }
  }

  return {
    matches,
    total,
    mismatches
  };
}

function candidateSearchBounds(actor, signature, expandedTilemap) {
  const radius = signature.searchRadiusTiles || 0;
  const center = actor.visualTileRect
    ? {
      x: actor.visualTileRect.x,
      y: actor.visualTileRect.y
    }
    : {
      x: Math.floor(actor.runtimeAnchor.pixelX / TILE_SIZE),
      y: Math.floor(actor.runtimeAnchor.pixelY / TILE_SIZE)
    };
  return {
    minX: Math.max(0, center.x - radius),
    maxX: Math.min(expandedTilemap.tileWidth - signature.width, center.x + radius),
    minY: Math.max(0, center.y - radius),
    maxY: Math.min(expandedTilemap.tileHeight - signature.height, center.y + radius)
  };
}

function findBestFixtureSignatureRect(actor, signature, expandedTilemap) {
  const bounds = candidateSearchBounds(actor, signature, expandedTilemap);
  let best = null;

  for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
    for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
      const rect = { x, y, width: signature.width, height: signature.height };
      const score = fixtureSignatureScore(expandedTilemap, signature, rect);
      const distance = actor.visualTileRect
        ? Math.abs(actor.visualTileRect.x - x) + Math.abs(actor.visualTileRect.y - y)
        : Math.abs(Math.floor(actor.runtimeAnchor.pixelX / TILE_SIZE) - x)
          + Math.abs(Math.floor(actor.runtimeAnchor.pixelY / TILE_SIZE) - y);
      if (
        !best ||
        score.matches > best.matches ||
        (score.matches === best.matches && distance < best.distance)
      ) {
        best = {
          rect,
          matches: score.matches,
          total: score.total,
          distance
        };
      }
    }
  }

  return best;
}

function findFixtureSignatureRects(expandedTilemap, signature) {
  const rects = [];
  for (let y = 0; y <= expandedTilemap.tileHeight - signature.height; y += 1) {
    for (let x = 0; x <= expandedTilemap.tileWidth - signature.width; x += 1) {
      const rect = { x, y, width: signature.width, height: signature.height };
      const score = fixtureSignatureScore(expandedTilemap, signature, rect);
      if (score.matches === score.total) {
        rects.push(rect);
      }
    }
  }
  return rects;
}

function rectsTouchOrOverlap(a, b) {
  const aRight = a.x + a.width;
  const bRight = b.x + b.width;
  const aBottom = a.y + a.height;
  const bBottom = b.y + b.height;
  const xOverlap = Math.max(a.x, b.x) < Math.min(aRight, bRight);
  const yOverlap = Math.max(a.y, b.y) < Math.min(aBottom, bBottom);
  const xTouch = aRight === b.x || bRight === a.x;
  const yTouch = aBottom === b.y || bBottom === a.y;
  return (xOverlap && (yOverlap || yTouch)) || (yOverlap && xTouch);
}

function groupFixtureRects(rects) {
  const remaining = rects.map((rect, index) => ({ rect, index }));
  const groups = [];

  while (remaining.length > 0) {
    const group = [remaining.pop()];
    for (let i = 0; i < group.length; i += 1) {
      const current = group[i].rect;
      for (let j = remaining.length - 1; j >= 0; j -= 1) {
        if (rectsTouchOrOverlap(current, remaining[j].rect)) {
          group.push(remaining.splice(j, 1)[0]);
        }
      }
    }
    const minX = Math.min(...group.map((item) => item.rect.x));
    const minY = Math.min(...group.map((item) => item.rect.y));
    const maxX = Math.max(...group.map((item) => item.rect.x + item.rect.width));
    const maxY = Math.max(...group.map((item) => item.rect.y + item.rect.height));
    groups.push({
      rect: {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      },
      matchCount: group.length,
      matches: group
        .map((item) => item.rect)
        .sort((a, b) => a.y - b.y || a.x - b.x)
    });
  }

  return groups.sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x);
}

function rectsEqual(a, b) {
  return a?.x === b?.x
    && a?.y === b?.y
    && a?.width === b?.width
    && a?.height === b?.height;
}

function findSecretForDestructibleRect(segmentId, rect, actors) {
  return actors.find((actor) => (
    actor.kind === 'secret'
    && actor.segmentId === segmentId
    && actor.secret?.targetTileRects?.some((target) => rectsEqual(target, rect))
  )) || null;
}

function buildDestructibleFixtures(segments, segmentTilemapsById, actors) {
  const signature = FIXTURE_TILE_SIGNATURES.destructibleBlock2x2;
  const fixtures = [];

  for (const segment of segments) {
    const expandedTilemap = segmentTilemapsById.get(segment.id);
    if (!expandedTilemap) {
      continue;
    }

    const groups = groupFixtureRects(findFixtureSignatureRects(expandedTilemap, signature));
    for (const group of groups) {
      const linkedSecret = findSecretForDestructibleRect(segment.id, group.rect, actors);
      const role = linkedSecret ? 'secret-reward' : 'breakable-terrain';
      fixtures.push({
        id: `${segment.id}-destructible-${group.rect.x}-${group.rect.y}-${group.rect.width}x${group.rect.height}`,
        label: role === 'secret-reward' ? linkedSecret.label : 'Breakable blocks',
        kind: 'destructible-terrain',
        role,
        segmentId: segment.id,
        tileRect: group.rect,
        matchCount: group.matchCount,
        matches: group.matches,
        linkedActorId: linkedSecret?.id || null,
        signatureId: signature.id,
        signatureLabel: signature.label,
        action: "Break these blocks with Holy Water, or equip Dracula's Nail and whip them.",
        provenance: {
          source: signature.source,
          signatureTiles: signature.tiles.map((row) => publicBytes(row))
        }
      });
    }
  }

  return fixtures;
}

function validateFixtureVisualRects(actors, segmentTilemapsById) {
  const validations = [];
  for (const actor of actors) {
    if (!actor.fixtureSignature) {
      continue;
    }
    const signature = FIXTURE_TILE_SIGNATURES[actor.fixtureSignature];
    if (!signature) {
      throw new Error(`${actor.id} references unknown fixture signature ${actor.fixtureSignature}`);
    }
    if (!actor.visualTileRect) {
      throw new Error(`${actor.id} must define visualTileRect for fixture signature ${signature.id}`);
    }
    if (
      actor.visualTileRect.width !== signature.width ||
      actor.visualTileRect.height !== signature.height
    ) {
      throw new Error(
        `${actor.id} visualTileRect ${JSON.stringify(actor.visualTileRect)} does not match ${signature.id} dimensions ${signature.width}x${signature.height}`
      );
    }

    const expandedTilemap = segmentTilemapsById.get(actor.segmentId);
    if (!expandedTilemap) {
      throw new Error(`${actor.id} references missing expanded tilemap for ${actor.segmentId}`);
    }

    const score = fixtureSignatureScore(expandedTilemap, signature, actor.visualTileRect);
    const best = findBestFixtureSignatureRect(actor, signature, expandedTilemap);
    const validation = {
      type: 'fixture-visual-tile-rect',
      actorId: actor.id,
      segmentId: actor.segmentId,
      signatureId: signature.id,
      signatureLabel: signature.label,
      visualTileRect: actor.visualTileRect,
      matches: score.matches,
      expectedMatches: score.total,
      status: score.matches === score.total ? 'ok' : 'mismatch',
      source: signature.source,
      bestMatch: best
        ? {
          rect: best.rect,
          matches: best.matches,
          expectedMatches: best.total
        }
        : null,
      mismatches: score.mismatches
    };
    validations.push(validation);

    if (validation.status !== 'ok') {
      const suggestion = best ? `; best nearby match is ${JSON.stringify(best.rect)} (${best.matches}/${best.total})` : '';
      throw new Error(
        `${actor.id} visualTileRect ${JSON.stringify(actor.visualTileRect)} does not match ${signature.id} (${score.matches}/${score.total})${suggestion}`
      );
    }
  }
  return validations;
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

function bankedCpuToFileOffset(info, cpuAddress, bank) {
  if (cpuAddress < 0x8000 || cpuAddress > 0xbfff) {
    throw new Error(`Expected banked text CPU pointer in 0x8000-0xBFFF, got ${hex(cpuAddress, 4)}`);
  }
  return info.prgStart + bank * 0x4000 + (cpuAddress - 0x8000);
}

function normalizeDialogText(text) {
  return text
    .replace(/-\n/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.?!])/g, '$1')
    .trim();
}

function decodeRomDialogText(rom, info, pointerIndex) {
  const tableFileOffset = TEXT_POINTER_TABLE_FILE_OFFSET + pointerIndex * 2;
  if (tableFileOffset + 1 >= rom.length) {
    throw new Error(`Text pointer index ${hex(pointerIndex, 2)} is outside the ROM text pointer table`);
  }

  const ramPointer = rom[tableFileOffset] | (rom[tableFileOffset + 1] << 8);
  const fileOffset = bankedCpuToFileOffset(info, ramPointer, TEXT_POINTER_TABLE_BANK);
  const rawBytes = [];
  let decoded = '';
  for (let offset = fileOffset; offset < rom.length; offset += 1) {
    const byte = rom[offset];
    if (byte === TEXT_END_BYTE) {
      break;
    }
    const character = TEXT_CHAR_BY_BYTE.get(byte);
    if (character == null) {
      throw new Error(
        `Text pointer index ${hex(pointerIndex, 2)} at ${hex(offset, 5)} contains undecoded byte ${hex(byte, 2)}`
      );
    }
    rawBytes.push(byte);
    decoded += character;
  }

  return {
    pointerIndex: hex(pointerIndex, 2),
    tableFileOffset: hex(tableFileOffset, 5),
    ramPointer: hex(ramPointer, 4),
    fileOffset: hex(fileOffset, 5),
    rawBytes: publicBytes(rawBytes),
    decoded,
    text: normalizeDialogText(decoded),
    source: `rom-text-pointer-table:${hex(TEXT_POINTER_TABLE_FILE_OFFSET, 5)}`
  };
}

function parseHexByteList(values) {
  return Buffer.from(values.map((value) => parseHex(value) & 0xff));
}

function readActorPaletteFragment(rom, info, cpuAddress, length, bank) {
  return readPrgBytes(
    rom,
    info,
    cpuAddress,
    length,
    bank == null ? {} : { bank }
  );
}

function readActorPaletteMemory(rom, info, source) {
  if (source.type === 'rom-sprite-palette') {
    const common = readActorPaletteFragment(
      rom,
      info,
      COMMON_SPRITE_PALETTE_ADDRESS,
      COMMON_SPRITE_PALETTE_LENGTH
    );
    const variant = readActorPaletteFragment(
      rom,
      info,
      source.variantAddress,
      VARIANT_SPRITE_PALETTE_LENGTH,
      source.variantBank
    );
    return {
      bytes: Buffer.concat([common, variant]),
      source: [
        `rom:${hex(COMMON_SPRITE_PALETTE_ADDRESS, 4)}..${hex(COMMON_SPRITE_PALETTE_ADDRESS + COMMON_SPRITE_PALETTE_LENGTH - 1, 4)}`,
        source.variantBank == null
          ? `rom:${hex(source.variantAddress, 4)}..${hex(source.variantAddress + VARIANT_SPRITE_PALETTE_LENGTH - 1, 4)}`
          : `rom-bank${source.variantBank}:${hex(source.variantAddress, 4)}..${hex(source.variantAddress + VARIANT_SPRITE_PALETTE_LENGTH - 1, 4)}`
      ].join('+')
    };
  }

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

function spritePaletteBytes(rom, info, source) {
  const memory = readActorPaletteMemory(rom, info, source);
  if (memory.bytes.length === SPRITE_PALETTE_BYTES) {
    return {
      bytes: memory.bytes,
      source: memory.source
    };
  }
  if (memory.bytes.length < 0x20) {
    throw new Error(`Actor sprite palette source ${memory.source} must contain 16 sprite bytes or 32 PPU palette bytes`);
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

function sizedBounds(bounds) {
  if (!bounds) {
    return null;
  }
  return {
    ...bounds,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY
  };
}

function mergeBounds(bounds, next) {
  if (!next) {
    return bounds;
  }
  if (!bounds) {
    return {
      minX: next.minX,
      minY: next.minY,
      maxX: next.maxX,
      maxY: next.maxY
    };
  }
  bounds.minX = Math.min(bounds.minX, next.minX);
  bounds.minY = Math.min(bounds.minY, next.minY);
  bounds.maxX = Math.max(bounds.maxX, next.maxX);
  bounds.maxY = Math.max(bounds.maxY, next.maxY);
  return bounds;
}

function translateBounds(bounds, offset) {
  if (!bounds) {
    return null;
  }
  const x = offset?.x || 0;
  const y = offset?.y || 0;
  return {
    minX: bounds.minX + x,
    minY: bounds.minY + y,
    maxX: bounds.maxX + x,
    maxY: bounds.maxY + y
  };
}

function actorFrameOpaqueBounds(frame, patterns) {
  let bounds = null;
  let sumX = 0;
  let sumY = 0;
  let opaquePixels = 0;

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
        const x = sprite.xOffset + col;
        const y = sprite.yOffset + row;
        bounds = includePixelBounds(bounds, x, y);
        sumX += x + 0.5;
        sumY += y + 0.5;
        opaquePixels += 1;
      }
    }
  }

  if (!bounds) {
    return null;
  }

  return {
    ...sizedBounds(bounds),
    centroid: {
      x: sumX / opaquePixels,
      y: sumY / opaquePixels
    },
    opaquePixels,
    source: 'chr-nonzero-pixels'
  };
}

function actorOpaqueUnion(frameBounds, offsets = []) {
  let bounds = null;
  frameBounds.forEach((frame, index) => {
    bounds = mergeBounds(bounds, translateBounds(frame, offsets[index]));
  });

  const sized = sizedBounds(bounds);
  return sized
    ? { ...sized, source: 'chr-nonzero-pixels' }
    : null;
}

function median(values) {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function roundPreviewOffset(value) {
  return value < 0 ? -Math.round(Math.abs(value)) : Math.round(value);
}

function staticPreviewAnchor(bounds, axis) {
  return bounds.centroid?.[axis] ?? (bounds[`min${axis.toUpperCase()}`] + bounds[`max${axis.toUpperCase()}`]) / 2;
}

function buildStaticPreview(actorClass, frameOpaqueBounds, frames) {
  const config = actorClass.staticPreview;
  if (!config) {
    return null;
  }

  if (config.mode === 'flight-body-frame-offsets') {
    const frameOffsets = frameOpaqueBounds.map((_, index) => {
      const selector = frames[index]?.selector;
      const offset = selector ? config.frameOffsetBySelector?.[selector] : null;
      return {
        x: offset?.x || 0,
        y: offset?.y || 0
      };
    });
    return {
      ...config,
      anchor: 'selector-frame-flight-body',
      axes: ['y'],
      frameOffsets,
      source: 'rom-selector-presentation-policy'
    };
  }

  const axes = new Set(config.axes || ['y']);
  const targets = {};
  for (const axis of axes) {
    targets[axis] = median(frameOpaqueBounds
      .filter(Boolean)
      .map((bounds) => staticPreviewAnchor(bounds, axis)));
  }

  const frameOffsets = frameOpaqueBounds.map((bounds) => {
    if (!bounds) {
      return { x: 0, y: 0 };
    }
    return {
      x: axes.has('x') ? roundPreviewOffset(targets.x - staticPreviewAnchor(bounds, 'x')) : 0,
      y: axes.has('y') ? roundPreviewOffset(targets.y - staticPreviewAnchor(bounds, 'y')) : 0
    };
  });

  return {
    ...config,
    anchor: 'opaque-centroid-median',
    frameOffsets,
    target: targets,
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

function actorClassSelectors(rom, info, actorClass) {
  const selectorRecord = decodeSelectorRecordAt(
    rom,
    info,
    SELECTOR_RECORD_BASE + actorClass.selectorRecordIndex * 3
  );
  return {
    selectorRecord,
    selectors: selectorRecord.selectors,
    source: 'selector-stream-record'
  };
}

function buildActorClass(rom, info, addChrSet, actorClass) {
  const selectorSource = actorClassSelectors(rom, info, actorClass);
  const frames = selectorSource.selectors.map((selector) => {
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
  const frameOpaqueBounds = frames.map((frame) => actorFrameOpaqueBounds(frame, patterns));
  const staticPreview = buildStaticPreview(actorClass, frameOpaqueBounds, frames);
  const previewOffsets = staticPreview?.frameOffsets || frameOpaqueBounds.map(() => ({ x: 0, y: 0 }));
  const publicFrames = frames.map((frame, index) => ({
    ...frame,
    opaqueBounds: frameOpaqueBounds[index],
    ...(staticPreview ? { staticPreviewOffset: previewOffsets[index] } : {})
  }));
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
      cpuAddress: hex(selectorSource.selectorRecord.cpuAddress, 4),
      fileOffset: hex(selectorSource.selectorRecord.fileOffset, 5),
      bytes: publicBytes(selectorSource.selectorRecord.bytes),
      selectors: selectorSource.selectorRecord.selectors.map((selector) => hex(selector, 2))
    },
    frames: publicFrames,
    bounds: actorFrameBounds(frames),
    opaqueBounds: actorOpaqueUnion(frameOpaqueBounds),
    ...(staticPreview ? {
      staticPreview: {
        mode: staticPreview.mode,
        anchor: staticPreview.anchor,
        axes: staticPreview.axes,
        target: staticPreview.target,
        reason: staticPreview.reason,
        source: staticPreview.source
      },
      previewOpaqueBounds: actorOpaqueUnion(frameOpaqueBounds, previewOffsets)
    } : {}),
    selectorSource: selectorSource.source,
    proof: actorClass.proof
  };
}

function actorPlacementHp(actor, actorClass, kind, bytes) {
  if (actor.hp) {
    return actor.hp;
  }
  if (kind !== 'enemy') {
    return actorClass?.hp || null;
  }
  const variants = actor.variants || ['day', 'night'];
  const baseHp = bytes[3];
  return {
    day: variants.includes('day') ? baseHp : null,
    night: variants.includes('night') ? baseHp * 2 : null
  };
}

function buildActorPlacement(rom, info, classById, segmentById, actor) {
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
  const hp = actorPlacementHp(actor, actorClass, kind, bytes);
  const shouldDecodeText = actor.textPointerIndex != null
    || actor.textFromRom === true
    || (!actor.text && (kind === 'npc' || kind === 'fixture' || kind === 'secret'));
  const textEvidence = shouldDecodeText
    ? decodeRomDialogText(rom, info, actor.textPointerIndex ?? bytes[3])
    : null;
  const text = actor.text || textEvidence?.text || null;
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
    text,
    textEvidence,
    secret: SECRET_DETAILS[actor.id] || null,
    visualTileRect: actor.visualTileRect || null,
    fixtureSignature: actor.fixtureSignature || null,
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
  const rawSliceConfig = JSON.parse(fs.readFileSync(slicePath, 'utf8'));
  const {
    sliceConfig,
    activeLayout,
    availableLayouts
  } = materializeLayoutSample(rawSliceConfig, opts.layout);
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
  const rawTileSetById = new Map();
  const segmentTilemapsById = new Map();
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
    rawTileSetById.set(id, raw);
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
    const palette = spritePaletteBytes(rom, info, source);
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
    const rawTileSet = rawTileSetById.get(tileSet.id);
    if (!rawTileSet) {
      throw new Error(`Missing raw tile set ${tileSet.id}`);
    }
    const layoutBlocks = appendChunk(chunks, blockMatrix.blocks);
    segmentTilemapsById.set(segmentConfig.id, expandSegmentTilemap(
      blockMatrix.blocks,
      rawTileSet.metatileTiles,
      rawTileSet.metatileAttributes,
      blockMatrix.blockWidth,
      blockMatrix.blockHeight
    ));
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
      sourceId: segmentConfig.sourceId || segmentConfig.id,
      sameLocationAs: segmentConfig.sameLocationAs,
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
  const actors = actorsForSlice.map((actor) => buildActorPlacement(rom, info, actorClassById, segmentById, actor));
  validations.push(...validateFixtureVisualRects(actors, segmentTilemapsById));
  const destructibleFixtures = buildDestructibleFixtures(segments, segmentTilemapsById, actors);

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
    layoutSample: activeLayout,
    availableLayouts,
    source: {
      sliceConfig: path.relative(process.cwd(), slicePath),
      atlas: path.relative(process.cwd(), atlasPath),
      renderer: 'rust-wasm-webgl-tilemap-v1',
      notes: [
        'Pixels are rendered in the browser from ROM-derived CHR, layout, metatile, and palette bytes.',
        'Actor sprites are rendered in the browser from ROM-derived CHR, decoded metasprite selector records, and ROM sprite palette fragments.',
        'Breakable terrain overlays are scanned from ROM-expanded background tile signatures.',
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
    destructibleFixtures,
    actorClasses,
    actors,
    destructibleSummary: {
      fixtures: destructibleFixtures.length,
      rewardLinked: destructibleFixtures.filter((fixture) => fixture.role === 'secret-reward').length,
      breakableTerrain: destructibleFixtures.filter((fixture) => fixture.role === 'breakable-terrain').length
    },
    actorSummary: {
      classes: actorClasses.length,
      placements: actors.length,
      npcs: actors.filter((actor) => actor.kind === 'npc').length,
      enemies: actors.filter((actor) => actor.kind === 'enemy').length,
      fixtures: actors.filter((actor) => actor.kind === 'fixture').length,
      secrets: actors.filter((actor) => actor.kind === 'secret').length
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
