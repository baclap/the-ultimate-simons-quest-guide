'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte, readPrgWord } = require('./background');
const { BACKGROUND_TABLE_BANK } = require('./background-context');
const { decodeMetaspriteSelector, decodeSelectorRecordAt } = require('./actor-selector-streams');
const { renderLayoutSegment } = require('./layout-segments');
const { buildManifest } = require('./manifest');
const { readBackgroundPalette, CHR_4KB_BANK_SIZE } = require('./native-image');
const { readPng } = require('./png');
const DEBORAH_TORNADO_PATH = require('../data/deborah-tornado-path.json');

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
const FERRY_DEFAULT_TEXT_POINTER_INDEX = 0x0b;
const FERRY_SECRET_ROUTE_TEXT_POINTER_INDEX = 0x0c;
const SPRITE_PALETTE_BYTES = 16;
const COMMON_SPRITE_PALETTE_ADDRESS = 0xcaae;
const COMMON_SPRITE_PALETTE_LENGTH = 8;
const VARIANT_SPRITE_PALETTE_LENGTH = 8;
const SPRITE_TRANSFER_POINTER_TABLE = 0x8895;
const SPRITE_TRANSFER_POINTER_TABLE_BANK = 7;
const SPRITE_HEIGHT = 16;
const ACTOR_CELL_SIZE = 16;
// Actor rows store the runtime anchor on a 16px grid; the guide draws at the visual spawn-cell anchor.
const ACTOR_DRAW_ANCHOR_OFFSET_X = ACTOR_CELL_SIZE / 2;
const ACTOR_DRAW_ANCHOR_OFFSET_Y = -12;
const GROUND_SUPPORT_PALETTES = new Set([0, 1]);
const GROUND_SUPPORT_SNAP_CANDIDATE_OFFSETS_X = [-32, -24, -16, -8, 0, 8, 16, 24, 32];

const DEBORAH_TORNADO_FRAMES = [
  {
    id: 'normal',
    sprites: [
      { tile: 0xc5, attr: 0x00, xOffset: -14, yOffset: -16 },
      { tile: 0xc7, attr: 0x00, xOffset: -6, yOffset: -16 },
      { tile: 0xc9, attr: 0x00, xOffset: 2, yOffset: -16 },
      { tile: 0xcb, attr: 0x00, xOffset: 10, yOffset: -16 },
      { tile: 0xcd, attr: 0x00, xOffset: -6, yOffset: 0 },
      { tile: 0xcf, attr: 0x00, xOffset: 2, yOffset: 0 }
    ]
  },
  {
    id: 'mirrored',
    sprites: [
      { tile: 0xcb, attr: 0x40, xOffset: -15, yOffset: -16 },
      { tile: 0xc9, attr: 0x40, xOffset: -7, yOffset: -16 },
      { tile: 0xc7, attr: 0x40, xOffset: 1, yOffset: -16 },
      { tile: 0xc5, attr: 0x40, xOffset: 9, yOffset: -16 },
      { tile: 0xcf, attr: 0x40, xOffset: -7, yOffset: 0 },
      { tile: 0xcd, attr: 0x40, xOffset: 1, yOffset: 0 }
    ]
  }
];

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
  townDoor: {
    id: 'town-door-4x6',
    label: 'Town door',
    width: 4,
    height: 6,
    tiles: [
      [0xad, 0x00, 0x00, 0x9d],
      [0x94, 0x00, 0x00, 0x97],
      [0x94, 0x00, 0x00, 0x97],
      [0x94, 0x00, 0x00, 0x97],
      [0x94, 0xf0, 0xf0, 0x97],
      [0xaa, 0x8e, 0x8f, 0xab]
    ],
    palettes: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ],
    hitboxInsetTiles: { x: -1, y: -2, width: 2, height: 2 },
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

const FALSE_PLATFORM_METATILE_SIGNATURES = [
  {
    id: 'berkeley-mansion-false-platform-3b',
    label: 'False platform',
    tileSetAddress: 0x8891,
    metatile: 0x3b,
    visualReferenceMetatile: 0x01,
    visibleTileRect: { x: 0, y: 0, width: 4, height: 2 },
    action: 'This floor looks solid, but Simon falls through it.',
    dialogText: 'False platform\n----------\nThis floor looks solid, but Simon falls through it.',
    source: 'rom-layout-metatile-and-terrain-thresholds'
  },
  {
    id: 'mansion-false-wall-32',
    label: 'False wall',
    tileSetAddress: 0x8891,
    metatile: 0x32,
    visualReferenceMetatile: 0x40,
    visibleTileRect: { x: 0, y: 0, width: 2, height: 4 },
    action: 'These blocks look solid, but Simon can walk through them.',
    dialogText: 'False wall\n----------\nThese blocks look solid, but Simon can walk through them.',
    source: 'rom-layout-metatile-and-terrain-thresholds'
  },
  {
    id: 'mansion-false-wall-33',
    label: 'False wall',
    tileSetAddress: 0x8891,
    metatile: 0x33,
    visualReferenceMetatile: 0x40,
    visibleTileRect: { x: 2, y: 0, width: 2, height: 4 },
    action: 'These blocks look solid, but Simon can walk through them.',
    dialogText: 'False wall\n----------\nThese blocks look solid, but Simon can walk through them.',
    source: 'rom-layout-metatile-and-terrain-thresholds'
  }
];

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
  },
  {
    id: 'denis-aljiba-woods-day-sprites',
    label: 'Denis/Aljiba Woods sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x31
  },
  {
    id: 'denis-aljiba-woods-night-sprites',
    label: 'Denis/Aljiba Woods sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x31
  },
  {
    id: 'yuba-lake-path-day-sprites',
    label: 'Yuba Lake Path sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x32
  },
  {
    id: 'yuba-lake-path-night-sprites',
    label: 'Yuba Lake Path sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x32
  },
  {
    id: 'belasco-marsh-day-sprites',
    label: 'Belasco Marsh sprites, day',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb41
  },
  {
    id: 'belasco-marsh-night-sprites',
    label: 'Belasco Marsh sprites, night',
    type: 'rom-sprite-palette',
    variantAddress: 0xcb41
  },
  {
    id: 'mansion-fixed-sprites',
    label: 'Mansion interior sprites, fixed palette',
    type: 'rom-sprite-palette',
    variantAddress: 0x9f6f,
    variantBank: 4
  },
  {
    id: 'lauber-mansion-fixed-sprites',
    label: 'Lauber Mansion interior sprites, fixed palette',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x49
  },
  {
    id: 'brahm-mansion-fixed-sprites',
    label: 'Brahm Mansion interior sprites, fixed palette',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x4a
  },
  {
    id: 'bodley-mansion-fixed-sprites',
    label: 'Bodley Mansion interior sprites, fixed palette',
    type: 'rom-sprite-palette',
    variantAddress: 0x9fbd,
    variantBank: 4
  },
  {
    id: 'laruba-mansion-fixed-sprites',
    label: 'Laruba Mansion interior sprites, fixed palette',
    type: 'rom-sprite-palette',
    variantAddress: 0x9f55,
    variantBank: 4
  },
  {
    id: 'camilla-cemetery-day-sprites',
    label: 'Camilla Cemetery sprites, day',
    type: 'palette-capture',
    file: 'out/actor-traces/camilla-cemetery-day-idle/ppu-final-3f00-3f1f-palettes.bin'
  },
  {
    id: 'camilla-cemetery-night-sprites',
    label: 'Camilla Cemetery sprites, night',
    type: 'palette-capture',
    file: 'out/actor-traces/camilla-cemetery-night-idle/ppu-final-3f00-3f1f-palettes.bin'
  },
  {
    id: 'joma-marsh-part-1-day-sprites',
    label: 'Joma Marsh Part 1 sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x35
  },
  {
    id: 'joma-marsh-part-1-night-sprites',
    label: 'Joma Marsh Part 1 sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x35
  },
  {
    id: 'joma-marsh-part-2-day-sprites',
    label: 'Joma Marsh Part 2 sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x38
  },
  {
    id: 'joma-marsh-part-2-night-sprites',
    label: 'Joma Marsh Part 2 sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x38
  },
  {
    id: 'joma-marsh-part-3-day-sprites',
    label: 'Joma Marsh Part 3 sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'joma-marsh-part-3-night-sprites',
    label: 'Joma Marsh Part 3 sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'debious-woods-part-3-day-sprites',
    label: 'Debious Woods Part 3 sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'debious-woods-part-3-night-sprites',
    label: 'Debious Woods Part 3 sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'debious-woods-part-2-day-sprites',
    label: 'Debious Woods Part 2 sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'debious-woods-part-2-night-sprites',
    label: 'Debious Woods Part 2 sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'debious-woods-part-1-day-sprites',
    label: 'Debious Woods Part 1 sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'debious-woods-part-1-night-sprites',
    label: 'Debious Woods Part 1 sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'wicked-ditch-day-sprites',
    label: 'Wicked Ditch sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x45
  },
  {
    id: 'wicked-ditch-night-sprites',
    label: 'Wicked Ditch sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x45
  },
  {
    id: 'town-of-doina-day-sprites',
    label: 'Town of Doina sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x2e
  },
  {
    id: 'town-of-doina-night-sprites',
    label: 'Town of Doina sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'north-bridge-day-sprites',
    label: 'North Bridge sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x33
  },
  {
    id: 'north-bridge-night-sprites',
    label: 'North Bridge sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x33
  },
  {
    id: 'dora-woods-part-1-day-sprites',
    label: 'Dora Woods Part 1 sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x33
  },
  {
    id: 'dora-woods-part-1-night-sprites',
    label: 'Dora Woods Part 1 sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x33
  },
  {
    id: 'dora-woods-part-2-day-sprites',
    label: 'Dora Woods Part 2 sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x30
  },
  {
    id: 'dora-woods-part-2-night-sprites',
    label: 'Dora Woods Part 2 sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x30
  },
  {
    id: 'town-of-yomi-day-sprites',
    label: 'Town of Yomi sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x2e
  },
  {
    id: 'town-of-yomi-night-sprites',
    label: 'Town of Yomi sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x37
  },
  {
    id: 'vrad-graveyard-day-sprites',
    label: 'Vrad Graveyard sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x46
  },
  {
    id: 'vrad-graveyard-night-sprites',
    label: 'Vrad Graveyard sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x46
  },
  {
    id: 'castlevania-bridge-day-sprites',
    label: 'Castlevania Bridge sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x46
  },
  {
    id: 'castlevania-bridge-night-sprites',
    label: 'Castlevania Bridge sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x46
  },
  {
    id: 'castlevania-final-sprites',
    label: 'Castlevania final area sprites',
    type: 'palette-capture',
    file: 'out/captures/castlevania-final-area/ppu-3f00-3f1f-palettes.bin'
  },
  {
    id: 'dora-woods-part-3-day-sprites',
    label: 'Dora Woods Part 3 sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x33
  },
  {
    id: 'dora-woods-part-3-night-sprites',
    label: 'Dora Woods Part 3 sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x33
  },
  {
    id: 'long-bridge-to-borgia-mountains-day-sprites',
    label: 'Long Bridge to Bordia Mountains sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x2f
  },
  {
    id: 'long-bridge-to-borgia-mountains-night-sprites',
    label: 'Long Bridge to Bordia Mountains sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x2f
  },
  {
    id: 'borgia-mountains-dead-end-swamp-day-sprites',
    label: 'Bordia Mountains Dead End Swamp sprites, day',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x34
  },
  {
    id: 'borgia-mountains-dead-end-swamp-night-sprites',
    label: 'Bordia Mountains Dead End Swamp sprites, night',
    type: 'rom-sprite-palette',
    auxiliaryTransferId: 0x34
  },
  {
    id: 'sadam-woods-day-sprites',
    label: 'Sadam Woods sprites, day',
    type: 'rom-sprite-palette',
    variantAddress: 0xa0ce,
    variantBank: 4
  },
  {
    id: 'sadam-woods-night-sprites',
    label: 'Sadam Woods sprites, night',
    type: 'rom-sprite-palette',
    variantAddress: 0xa0ce,
    variantBank: 4
  },
  {
    id: 'deborah-cliff-day-sprites',
    label: 'Deborah Cliff sprites, day',
    type: 'rom-sprite-palette',
    variantAddress: 0xa135,
    variantBank: 4
  },
  {
    id: 'deborah-cliff-night-sprites',
    label: 'Deborah Cliff sprites, night',
    type: 'rom-sprite-palette',
    variantAddress: 0xa135,
    variantBank: 4
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
    id: 'simon-belmont',
    label: 'Simon Belmont',
    kind: 'player',
    selectors: [0x04, 0x01, 0x02, 0x03],
    chrBanks: [0x00, 0x01],
    frameDurationMs: 360,
    proof: 'Metasprite selector $04 decodes to Simon standing tiles $03/$05/$07/$09; selectors $01/$02/$03 decode to the ROM player walking frames observed in player-slot trace writes. OAM captures from Jova start and interior-entry transitions show selector $04 at the documented spawn positions.'
  },
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
    label: 'White Crystal Merchant',
    kind: 'npc',
    actorId: 0xae,
    selectorRecordIndex: 0x0b,
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $AE maps through live id $2E to merchant animation record $0B, which emits selectors $1E/$1F.'
  },
  {
    id: 'blue-crystal-merchant',
    label: 'Blue Crystal Merchant',
    kind: 'npc',
    actorId: 0xaf,
    selectorRecordIndex: 0x0f,
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $AF maps through live id $2F to the shared merchant routine at bank 1:$83CC. The merchant selector table at 1:$83F3 stores selector-record index $0F for live id $2F.'
  },
  {
    id: 'red-crystal-merchant',
    label: 'Red Crystal Merchant',
    kind: 'npc',
    actorId: 0xaf,
    selectorRecordIndex: 0x0f,
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $AF maps through live id $2F to the shared crystal-merchant routine at bank 1:$83CC. Alba row $5135 carries data $04/text pointer $D893, selecting the Red Crystal exchange.'
  },
  {
    id: 'flame-whip-upgrade-merchant',
    label: 'Flame Whip Merchant',
    kind: 'npc',
    actorId: 0xaf,
    selectorRecordIndex: 0x0b,
    chrBanks: [0x04, 0x05],
    proof: "Debious Woods row $072B1 uses actor id $AF/data $05 and text pointer $CE89, whose decoded ROM text says \"i'll give your morning star power to burn away evil.\" The shared $AF routine at bank 1:$83CC maps live id $2F through table 1:$83F3 to selector-record $0F, then checks object-set RAM $30; because Debious is object set $03, it overrides $0F to selector-record $0B. Debious supplies CHR banks $04/$05."
  },
  {
    id: 'old-gypsy',
    label: 'Old Gypsy',
    kind: 'npc',
    actorId: 0xaf,
    selectorRecordIndex: 0x0b,
    chrBanks: [0x06, 0x07],
    proof: "Vrad Mountain row $0684F uses actor id $AF/data $00 and text pointer $CF38, which decodes to \"i'll give you a diamond.\" The shared $AF routine at bank 1:$83CC maps live id $2F through table $83F3 to selector-record $0F, then checks object-set RAM $30; because Vrad is object set $04, it overrides $0F to selector-record $0B. Vrad supplies CHR banks $06/$07."
  },
  {
    id: 'town-old-lady',
    label: 'Old Lady',
    kind: 'npc',
    actorId: 0xac,
    selectors: [0x28],
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $AC maps through live id $2C. Dispatch target bank 1:$8F7D initializes through fixed-bank $DED0 with direct metasprite selector $28.'
  },
  {
    id: 'town-priest',
    label: 'Priest',
    kind: 'npc',
    actorId: 0xad,
    selectorRecordIndex: 0x0c,
    chrBanks: [0x00, 0x01],
    proof: 'ROM row id $AD maps through the town high-bit NPC path to the priest animation record $0C in the same town-interior CHR/palette family as Jova.'
  },
  {
    id: 'crow',
    label: 'Raven',
    kind: 'enemy',
    actorId: 0x01,
    selectorRecordIndex: 0x08,
    chrBanks: [0x00, 0x01],
    proof: 'ROM actor id $01 dispatches to 1:$8FAA, which writes selector-stream record $08 before normal actor rendering. The rendered bird sprite matches the English manual enemy "Raven".'
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x03,
    selectorRecordIndex: 0x05,
    chrBanks: [0x02, 0x03],
    hp: { day: 1, night: 2 },
    proof: 'ROM actor id $03 uses selector-stream record $05, proven by live actor traces and decoded fixed-bank selector bytes.'
  },
  {
    id: 'fishman',
    label: 'The Fish Man',
    kind: 'enemy',
    actorId: 0x04,
    selectorRecordIndex: 0x06,
    chrBanks: [0x02, 0x03],
    hp: { day: 1, night: 2 },
    proof: 'ROM actor id $04 uses selector-stream record $06 for the body frames; the fishman proof supplies the segment sprite palettes. The rendered amphibious humanoid sprite matches the English manual enemy "The Fish Man".'
  },
  {
    id: 'leech',
    label: 'The Ghastly Leech',
    kind: 'enemy',
    actorId: 0x02,
    selectorRecordIndex: 0x1c,
    chrBanks: [0x02, 0x03],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $02 dispatches to PRG bank 1:$A513 and initializes selector-stream record $1C, which emits upright curled leech selectors $61/$62. The rendered sprite matches the English manual enemy illustration labeled "The Ghastly Leech", preserving the manual\'s leading "The".'
  },
  {
    id: 'wolf',
    label: 'The Wolf',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x12,
    selectorRecordIndex: 0x1d,
    chrBanks: [0x02, 0x03],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $12 dispatches to PRG bank 1:$A185 and initializes selector-stream record $1D for the Belasco Marsh wolf rows. The rendered quadruped wolf sprite matches the English manual enemy illustration labeled "The Wolf".'
  },
  {
    id: 'mudman',
    label: 'The Mud Man',
    kind: 'enemy',
    actorId: 0x15,
    selectors: [0x59, 0x5a, 0x5b],
    chrBanks: [0x02, 0x03],
    proof: 'ROM actor id $15 dispatches to PRG bank 1:$A367. Its state handlers at $A37B and $A3BE read the local table at $A3E4 and write those bytes directly to selector RAM $0300,x. The table bytes are $00/$59/$5A/$5B; $00 is the hidden/no-sprite state, so the visible Mud Man frames are direct selectors $59/$5A/$5B. The rendered mud-rising sprite matches the English manual enemy illustration labeled "The Mud Man".'
  },
  {
    id: 'lizardman',
    label: 'The Two-Headed Creature',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x06,
    selectorRecordIndex: 0x1a,
    chrBanks: [0x02, 0x03],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $06 dispatches to PRG bank 1:$A3E8 and initializes selector-stream record $1A for the Dead River and Belasco rows. The rendered hunched two-headed humanoid sprite matches the English manual enemy illustration labeled "The Two-Headed Creature".'
  },
  {
    id: 'ferry-man-boat-right',
    label: 'Ferry Man',
    kind: 'npc',
    actorId: 0xbc,
    compositeSelectors: [
      { selector: 0x7f, offsetX: 0, offsetY: 0 },
      { selector: 0x80, offsetX: 20, offsetY: 16 }
    ],
    drawAnchor: {
      offsetX: 0,
      offsetY: ACTOR_DRAW_ANCHOR_OFFSET_Y - 6
    },
    chrBanks: [0x02, 0x03],
    proof: 'ROM manifest row id $BC maps to live actor id $3C. Dispatch target PRG bank 1:$A431 initializes selector $7F, stores row data to $0420,x, and subtracts 6 from Y RAM $0324,x. State 0 spawns companion live actor $3D with selector $80; row data $00 places that companion at X + $14 and Y + $10 relative to $3C. The guide composes those ROM-derived selectors as one static ferry-man marker at the raw row X anchor.'
  },
  {
    id: 'ferry-man-boat-left',
    label: 'Ferry Man',
    kind: 'npc',
    actorId: 0xbc,
    compositeSelectors: [
      { selector: 0x7f, offsetX: 0, offsetY: 0, flipHorizontal: true },
      { selector: 0x80, offsetX: -20, offsetY: 16, flipHorizontal: true }
    ],
    drawAnchor: {
      offsetX: 0,
      offsetY: ACTOR_DRAW_ANCHOR_OFFSET_Y - 6
    },
    chrBanks: [0x02, 0x03],
    proof: 'ROM manifest row id $BC maps to live actor id $3C. Dispatch target PRG bank 1:$A431 initializes selector $7F, stores row data to $0420,x, and subtracts 6 from Y RAM $0324,x. State 0 spawns companion live actor $3D with selector $80; nonzero row data places that companion at X - $14 and Y + $10 relative to $3C. The guide mirrors selector $7F and selector $80 for the left-side ferry variant so the ferryman faces correctly and the ROM boat middle joins the companion half, then composes the selectors as one static ferry-man marker at the raw row X anchor.'
  },
  {
    id: 'eyeball',
    label: 'Ghostly Eyeball',
    kind: 'enemy',
    actorId: 0x08,
    selectorRecordIndex: 0x39,
    chrBanks: [0x02, 0x03],
    proof: 'ROM actor id $08 dispatches to 1:$A7CA, which writes selector-stream record $39. The rendered flying eyeball sprite matches the English manual enemy "Ghostly Eyeball".'
  },
  {
    id: 'zigzag-bat',
    label: 'Vampire Bat',
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
    proof: 'ROM actor id $09 dispatches to 1:$A7F2, which writes selector-stream record $3A after its movement setup. The rendered bat sprite matches the English manual enemy "Vampire Bat".'
  },
  {
    id: 'spider',
    label: 'The Spider',
    kind: 'enemy',
    actorId: 0x0e,
    selectorRecordIndex: 0x23,
    chrBanks: [0x02, 0x03],
    proof: 'ROM actor id $0E dispatches to 1:$8425, which writes selector-stream record $23. The rendered spider sprite matches the English manual enemy "The Spider".'
  },
  {
    id: 'mansion-spider',
    label: 'The Spider',
    kind: 'enemy',
    actorId: 0x0e,
    selectorRecordIndex: 0x23,
    chrBanks: [0x08, 0x09],
    proof: 'ROM actor id $0E dispatches to 1:$8425, which writes selector-stream record $23. Laruba Mansion rows $05A95 and $05A9D use actor id $0E/data $1E in object set $01, so the guide renders the same spider record with mansion CHR banks $08/$09.'
  },
  {
    id: 'werewolf',
    label: 'The Wolf Man',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x13,
    selectorRecordIndex: 0x1e,
    chrBanks: [0x02, 0x03],
    hp: { day: 2, night: 4 },
    proof: 'ROM actor id $13 uses selector-stream record $1E, proven by live Jova Woods actor traces. The Jova Woods humanoid wolf sprite matches the English manual enemy "The Wolf Man".'
  },
  {
    id: 'zombie',
    label: 'The Zombie',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x17,
    selectorRecordIndex: 0x37,
    chrBanks: [0x00, 0x01],
    hp: { day: null, night: 2 },
    proof: 'ROM actor id $17 is loaded by the town night actor gate and uses selector-stream record $37. The rendered town night enemy sprite matches the English manual enemy "The Zombie".'
  },
  {
    id: 'sacred-flame-secret',
    label: 'Sacred Flame',
    kind: 'secret',
    actorId: 0x26,
    selectorRecordIndex: 0x20,
    chrBanks: [0x02, 0x03],
    proof: "ROM actor id $26 dispatches through 1:$8335; the routine selects selector-record $20 for non-$27 actors, then clears the $08 hidden flag from $03C6,x when selected item $4F is Dracula's Eyeball. Selector-record $20 emits metasprites $78/$79 for the sacred-flame reward fixture."
  },
  {
    id: 'hidden-book-secret',
    label: 'Hidden clue book',
    kind: 'secret',
    actorId: 0x27,
    selectorRecordIndex: 0x3b,
    chrBanks: [0x02, 0x03],
    proof: "ROM actor id $27 dispatches through 1:$8335; that routine initializes selector-record $3B and clears the reveal flag when selected item $4F is Dracula's Eyeball."
  },
  {
    id: 'town-book',
    label: 'Hidden clue book',
    kind: 'secret',
    actorId: 0x27,
    selectorRecordIndex: 0x3b,
    chrBanks: [0x00, 0x01],
    proof: "ROM actor id $27 dispatches through 1:$8335; that routine initializes selector-record $3B and clears the reveal flag when selected item $4F is Dracula's Eyeball. Town-interior rows use CHR banks $00/$01."
  },
  {
    id: 'mansion-skeleton',
    label: 'Skeleton',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x03,
    selectorRecordIndex: 0x05,
    chrBanks: [0x08, 0x09],
    hp: { day: 2, night: 2 },
    proof: 'Berkeley Mansion actor rows use actor id $03 with row HP $02. The shared selector-stream record $05 emits selectors $0E/$0F; the mansion scene supplies ROM CHR banks $08/$09 and fixed mansion sprite palette bytes.'
  },
  {
    id: 'mansion-spear-knight',
    label: 'Spear knight',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x05,
    selectorRecordIndex: 0x13,
    chrBanks: [0x08, 0x09],
    hp: { day: 2, night: 2 },
    proof: 'Berkeley Mansion runtime trace proves actor id $05 with selectors $35/$36 and HP $02; fixed-bank selector record $13 expands to those selectors.'
  },
  {
    id: 'mansion-bone-thrower',
    label: 'Bone thrower',
    kind: 'enemy',
    actorId: 0x0d,
    selectorRecordIndex: 0x05,
    chrBanks: [0x08, 0x09],
    hp: { day: 2, night: 2 },
    proof: 'Actor dispatch entry $0D initializes through selector-stream record $05, the same skeleton-body selectors used by the bone-thrower rows; Berkeley rows carry HP $02.'
  },
  {
    id: 'mansion-gargoyle',
    label: 'The Gargoyle',
    kind: 'enemy',
    actorId: 0x0f,
    selectorRecordIndex: 0x12,
    chrBanks: [0x08, 0x09],
    hp: { day: 2, night: 2 },
    proof: 'Actor dispatch entry $0F initializes selector-stream record $12, which expands to selectors $31/$32; Berkeley rows carry HP $02. The rendered winged mansion enemy sprite matches the English manual enemy "The Gargoyle".'
  },
  {
    id: 'mansion-bat',
    label: 'Vampire Bat',
    kind: 'enemy',
    actorId: 0x11,
    selectorRecordIndex: 0x07,
    chrBanks: [0x08, 0x09],
    hp: { day: 4, night: 4 },
    proof: 'Actor dispatch entry $11 at bank 1:$9934 initializes selector-stream record $07, which expands to selectors $12/$13 in the mansion CHR context; Lauber rows carry HP $04.'
  },
  {
    id: 'death',
    label: 'Death',
    kind: 'enemy',
    actorId: 0x44,
    selectors: [0x44, 0x45],
    chrBanks: [0x08, 0x09],
    hp: { day: 128, night: 128 },
    proof: 'Brahm Mansion actor row $05CDE is bytes $08 $08 $44 $80. The whole-ROM enemy atlas proves actor id $44 dispatches to bank 1:$9E1B, initializes direct body selector $44, writes follow-up body selector $45, and uses fixed interior HP 128 from row data $80. Death scythe/projectile behavior is not represented as a separate static guide marker.'
  },
  {
    id: 'camilla',
    label: 'Camilla',
    kind: 'enemy',
    actorId: 0x42,
    selectors: [0xca],
    chrBanks: [0x09, 0x0a],
    hp: { day: 240, night: 240 },
    paletteCycle: {
      values: [3, 1, 2, 3],
      frameDurationMs: 1000 / 60,
      source: 'Camilla attack-state path bank 1:$9DCA-$9DCF restores X, increments the attack timer, and jumps to fixed-bank $D9CF, which stores global frame counter $1D & $03 in actor attribute RAM $0312,x. The shared metasprite drawer at bank 0:$AB16-$AB28 uses nonzero $0312 low bits as the OAM palette override; phase 0 leaves selector $CA on its native palette slot $03.'
    },
    proof: 'Laruba Mansion actor row $05AC6 is bytes $08 $0A $42 $F0. The whole-ROM enemy atlas proves actor id $42 dispatches to bank 1:$9CD8 and initializes direct selector $CA; row data $F0 supplies fixed mansion HP 240. Camilla uses the boss sprite pattern context $0A, so the decoded $CA 8x16 metasprite must be rendered from sprite CHR banks $09/$0A rather than the generic mansion background CHR pair $08/$09. Selector $CA uses native OAM palette $03; Camilla\'s attack-state palette blink is produced by bank 1:$9DCA-$9DCF jumping to fixed-bank $D9CF, which stores $1D & $03 into $0312,x for the shared sprite drawer palette override. The guide reproduces that ROM palette-slot cadence; boss projectile/state behavior is not represented as a separate guide marker.'
  },
  {
    id: 'dracula',
    label: 'Dracula',
    kind: 'enemy',
    actorId: 0x47,
    selectors: [0x33],
    chrBanks: [0x0b, 0x0c],
    hp: { day: 240, night: 240 },
    frameDurationMs: 1000 / 60,
    blink: {
      visibleFrames: 2,
      hiddenFrames: 2,
      source: 'The final-room spawn routine blinks Dracula by alternating selector $33 with no visible selector while the boss is being summoned. The guide uses the same presentation cadence as the overworld final-entry preview.'
    },
    proof: 'The final-room Dracula spawn initializer at bank 1:$B4FA stores actor id $47 into actor-id RAM $03B4+$06. Bank 1:$B5A9-$B5B0 uses ROM metasprite selector $33 for the visible Dracula frame, and bank 1:$B5B9-$B5BE stores HP $F0 into actor HP RAM $04C2+$06 ($04C8). The shared hit/death routines at bank 1:$8926 and 1:$8A69 check actor id $47 alongside Camilla $42 and Death $44.'
  },
  {
    id: 'blob',
    label: 'Slimey BarSinister',
    kind: 'enemy',
    actorId: 0x1f,
    selectors: [0x3c, 0x3d],
    chrBanks: [0x08, 0x09],
    hp: { day: 1, night: 1 },
    proof: 'Actor dispatch entry $1F initializes through the direct fixed-bank $DED0 selector path with selector $3C, then the $97D3 state machine advances the neutral animation to selector $3D. Whole-ROM actor inventory finds the same actor id in Berkeley, Brahm, and Bodley mansions, so the guide uses a generic name rather than a location-specific label. The rendered blob sprite matches the English manual enemy illustration labeled "Slimey BarSinister".'
  },
  {
    id: 'rock',
    label: 'Rock',
    kind: 'enemy',
    actorId: 0x3e,
    selectorRecordIndex: 0x2f,
    chrBanks: [0x08, 0x09],
    hp: { day: 0, night: 0 },
    proof: 'Whole-ROM enemy atlas decoding proves actor id $3E dispatches to PRG bank 1:$96E1 and initializes selector-record $2F for the Bodley Mansion falling-rock rows. Bodley rows carry HP byte $00.'
  },
  {
    id: 'mansion-book',
    label: 'Hidden clue book',
    kind: 'secret',
    actorId: 0x27,
    selectorRecordIndex: 0x3b,
    chrBanks: [0x08, 0x09],
    proof: "ROM actor id $27 dispatches through 1:$8335; that routine initializes selector-record $3B and clears the reveal flag when selected item $4F is Dracula's Eyeball. Mansion rows use CHR banks $08/$09."
  },
  {
    id: 'oak-stake-merchant',
    label: 'Oak Stake Merchant',
    kind: 'npc',
    actorId: 0xae,
    selectorRecordIndex: 0x0b,
    chrBanks: [0x08, 0x09],
    proof: 'ROM row id $AE maps through live id $2E to the merchant selector table. The oak-stake merchant row data selects the $0B animation record in the mansion context.'
  },
  {
    id: 'laruba-laurels-giver',
    label: 'Laurels Giver',
    kind: 'npc',
    actorId: 0xaf,
    selectorRecordIndex: 0x0b,
    chrBanks: [0x08, 0x09],
    proof: 'Laruba Mansion row $05A65 uses actor id $AF/data $01 and text pointer $DCE2, whose decoded ROM text says "i beg of you to take these laurels." The shared $AF routine at bank 1:$83CC maps live id $2F through table 1:$83F3 to selector-record $0F, then checks object-set RAM $30; because Laruba Mansion is object set $01, it overrides $0F to selector-record $0B. Laruba Mansion supplies CHR banks $08/$09.'
  },
  {
    id: 'dracula-rib-orb',
    label: "Dracula's Rib",
    kind: 'secret',
    actorId: 0x25,
    selectors: [0x3b],
    chrBanks: [0x08, 0x09],
    paletteCycle: {
      values: [1, 2, 3, 0],
      frameDurationMs: 1000 / 60,
      source: 'out/actor-traces/berkeley-mansion-orb-cadence samples out/states/berkeley-mansion-orb.mss every frame and proves OAM palette bits 1/2/3/0 at one NES-frame cadence.'
    },
    drawAnchor: {
      offsetX: 0,
      offsetY: -12,
      source: 'out/states/berkeley-mansion-orb.mss OAM proof: pre-stake orb selector $3B renders tiles $EC/$EE at screen x $C8/$D0 from row x $3D.'
    },
    proof: 'Actor row $05B99 is the pre-stake Dracula\'s Rib orb. The Berkeley orb save-state trace proves live selector $3B with OAM tiles $EC/$EE at screen x $C8/$D0, blinking every NES frame through OAM palette bits $01/$02/$03/$00. Selector $A1 belongs to the post-stake reveal sequence and is not part of the pre-stake blink.'
  },
  {
    id: 'dracula-heart-orb',
    label: "Dracula's Heart",
    kind: 'secret',
    actorId: 0x25,
    selectors: [0x3b],
    chrBanks: [0x08, 0x09],
    paletteCycle: {
      values: [1, 2, 3, 0],
      frameDurationMs: 1000 / 60,
      source: 'Same actor id $25 direct-selector orb routine as the Berkeley Rib; the Lauber row data/text selects Dracula\'s Heart.'
    },
    drawAnchor: {
      offsetX: 0,
      offsetY: -12,
      source: 'Actor id $25 orb visible placement uses the same pre-stake selector $3B draw anchor proven for the Berkeley Rib orb.'
    },
    proof: 'Lauber Mansion actor row $05C4B uses actor id $25 with text/data $19. Actor id $25 uses the fixed-bank $DED0 direct selector path with selector $3B for the pre-stake orb sequence.'
  },
  {
    id: 'dracula-eyeball-orb',
    label: "Dracula's Eyeball",
    kind: 'secret',
    actorId: 0x25,
    selectors: [0x3b],
    chrBanks: [0x08, 0x09],
    paletteCycle: {
      values: [1, 2, 3, 0],
      frameDurationMs: 1000 / 60,
      source: 'Same actor id $25 direct-selector orb routine as the Berkeley Rib; the Brahm row data/text selects Dracula\'s Eyeball.'
    },
    drawAnchor: {
      offsetX: 0,
      offsetY: -12,
      source: 'Actor id $25 orb visible placement uses the same pre-stake selector $3B draw anchor proven for the Berkeley Rib orb.'
    },
    proof: 'Brahm Mansion actor row $05CE3 uses actor id $25 with text/data $1A. Text pointer index $1A decodes at ROM file $0CFDE to the Dracula\'s Eyeball pickup message, and actor id $25 uses the fixed-bank $DED0 direct selector path with selector $3B for the pre-stake orb sequence.'
  },
  {
    id: 'dracula-nail-orb',
    label: "Dracula's Nail",
    kind: 'secret',
    actorId: 0x25,
    selectors: [0x3b],
    chrBanks: [0x08, 0x09],
    paletteCycle: {
      values: [1, 2, 3, 0],
      frameDurationMs: 1000 / 60,
      source: 'Same actor id $25 direct-selector orb routine as the Berkeley Rib; the Bodley row data/text selects Dracula\'s Nail.'
    },
    drawAnchor: {
      offsetX: 0,
      offsetY: -12,
      source: 'Actor id $25 orb visible placement uses the same pre-stake selector $3B draw anchor proven for the Berkeley Rib orb.'
    },
    proof: 'Bodley Mansion actor row $05FAB uses actor id $25 with text/data $1B. Actor id $25 uses the fixed-bank $DED0 direct selector path with selector $3B for the pre-stake orb sequence.'
  },
  {
    id: 'dracula-ring-orb',
    label: "Dracula's Ring",
    kind: 'secret',
    actorId: 0x25,
    selectors: [0x3b],
    chrBanks: [0x08, 0x09],
    paletteCycle: {
      values: [1, 2, 3, 0],
      frameDurationMs: 1000 / 60,
      source: 'Same actor id $25 direct-selector orb routine as the Berkeley Rib; the Laruba row data/text selects Dracula\'s Ring.'
    },
    drawAnchor: {
      offsetX: 0,
      offsetY: -12,
      source: 'Actor id $25 orb visible placement uses the same pre-stake selector $3B draw anchor proven for the Berkeley Rib orb.'
    },
    proof: 'Laruba Mansion actor row $05ACB uses actor id $25 with text/data $1C. Actor id $25 uses the fixed-bank $DED0 direct selector path with selector $3B for the pre-stake orb sequence.'
  },
  {
    id: 'secret-merchant',
    label: 'Secret Merchant',
    kind: 'npc',
    actorId: 0x9e,
    selectorRecordIndex: 0x0b,
    chrBanks: [0x04, 0x05],
    proof: 'Camilla Cemetery row $06F32 and Storigoi Graveyard row $06F88 use row id $9E, which maps to live actor $1E. The reveal routine initializes selector-record index $0B, emitting merchant selectors $1E/$1F in the objset $03 CHR family.'
  },
  {
    id: 'dead-hand',
    label: 'The Zombie Hand',
    kind: 'enemy',
    actorId: 0x38,
    selectorRecordIndex: 0x17,
    chrBanks: [0x04, 0x05],
    hp: { day: 8, night: 16 },
    proof: 'Camilla Cemetery day/night traces and the whole-ROM enemy atlas prove actor id $38 with selector-stream record $17, selectors $8E/$8F, objset $03 CHR banks $04/$05, and standard exterior night-strength HP. The rendered hand-from-ground sprite matches the English manual enemy illustration labeled "The Zombie Hand". Storigoi Graveyard rows carry HP byte $08, yielding day HP 8 and night HP 16.'
  },
  {
    id: 'outdoor-blob',
    label: 'Slimey BarSinister',
    kind: 'enemy',
    actorId: 0x41,
    selectors: [0xc3, 0xc4],
    chrBanks: [0x04, 0x05],
    hp: { day: 8, night: 16 },
    proof: 'Actor dispatch entry $41 at bank 1:$B119 initializes through fixed-bank $DED0 with direct metasprite selector $C3; the follow-up state routine at bank 1:$B13F toggles actor selector RAM $0300,x between $C3 and $C4 for the neutral animation before later movement states. The whole-ROM enemy atlas finds this actor in Camilla Cemetery, Storigoi Graveyard, and Sadam Woods. The rendered outdoor blob sprite matches the English manual enemy illustration labeled "Slimey BarSinister". Actor id $41 is not in the ROM HP initializer exception list, so exterior night HP follows the standard double-strength path.'
  },
  {
    id: 'skeleton-objset3',
    label: 'Skeleton',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x03,
    selectorRecordIndex: 0x05,
    chrBanks: [0x04, 0x05],
    proof: 'Sadam Woods actor rows use actor id $03 in the object-set $03 CHR family. The full enemy atlas proves the shared skeleton dispatch path and row-backed HP, while Sadam palette evidence resolves CHR banks $04/$05.'
  },
  {
    id: 'floating-skull',
    label: 'Floating skull',
    kind: 'enemy',
    actorId: 0x10,
    selectorRecordIndex: 0x16,
    chrBanks: [0x04, 0x05],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $10 dispatches to PRG bank 1:$B2E2 and initializes selector-record $16 for the Joma/Debious floating-skull rows. The same routine later references selector-record $29 for another state; the guide uses the primary dispatch selector-record. Manual-name matching is not yet proven for this class.'
  },
  {
    id: 'grabber',
    label: 'Grabber',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x16,
    selectorRecordIndex: 0x25,
    chrBanks: [0x04, 0x05],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $16 dispatches to PRG bank 1:$B092 and initializes selector-record $25, with a later routine branch to selector-record $26. The guide uses the primary selector-record proven at routine entry.'
  },
  {
    id: 'swamp-ghoul',
    label: 'Swamp ghoul',
    kind: 'enemy',
    actorId: 0x18,
    selectors: [0xc0, 0xc1, 0xc2],
    chrBanks: [0x04, 0x05],
    drawAnchor: {
      offsetX: 0,
      offsetY: ACTOR_DRAW_ANCHOR_OFFSET_Y,
      source: 'Actor loader bank 1:$8055-$8188 writes row X/Y directly to runtime screen anchor RAM $0348/$0324 after scroll subtraction. Actor id $18 routine bank 1:$AE95-$AF11 does not adjust those coordinates; it only changes selector RAM $0300,x through the local $AF12 table. Selectors $C0/$C1/$C2 carry their own metasprite offsets, so Swamp Ghoul keeps the raw runtime X anchor while using the normal row-backed sprite Y presentation anchor.'
    },
    proof: 'Whole-ROM enemy atlas decoding proves actor id $18 dispatches to PRG bank 1:$AE95 and writes visible animation selectors from the local ROM table at bank 1:$AF12 through STA $0300,x. The visible selector sequence is $C0/$C1/$C2, and the guide keeps that ROM-backed animation sequence. Manual-name matching is not yet proven for this class. Static ROM decode of bank 1:$AE95-$AF11 proves this actor does not mutate its own X/Y anchor; its rise/idle/sink behavior is selector-driven, so the guide preserves the row-backed Y presentation anchor while avoiding the generic +8 X cell-centering offset.'
  },
  {
    id: 'fire-ghoul',
    label: 'Fire ghoul',
    kind: 'enemy',
    actorId: 0x1d,
    selectorRecordIndex: 0x29,
    chrBanks: [0x04, 0x05],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $1D dispatches to PRG bank 1:$B30A and initializes selector-record $29 for the Joma/Debious fire-ghoul rows. Manual-name matching is not yet proven for this class.'
  },
  {
    id: 'bone-dragon',
    label: 'Dragon Bones',
    kind: 'enemy',
    actorId: 0x4a,
    compositeSelectors: [
      { selector: 0x56, role: 'head-parent' },
      { selectorRecordIndex: 0x3e, offsetY: 16, role: 'neck-child' }
    ],
    chrBanks: [0x04, 0x05],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $4A dispatches to PRG bank 1:$AFF4. Initialization writes direct metasprite selector $56 for the parent skull, then calls the runtime spawn helper and creates child actor id $19 at the same X and Y+$10. The child actor initializes selector-record $3E, which expands to selectors $E2-$E5 for the animated neck/body, so the guide composes selector $56 with selector-record $3E at offset Y+$10. The rendered bone-dragon composite matches the English manual enemy illustration labeled "Dragon Bones".'
  },
  {
    id: 'high-jump-leech',
    label: 'High jump leech',
    kind: 'enemy',
    actorId: 0x40,
    selectorRecordIndex: 0x38,
    chrBanks: [0x04, 0x05],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $40 dispatches to PRG bank 1:$AE21 and initializes selector-record $38 for the high-jump leech rows. The same routine later branches to selector-record $17, so the guide uses the primary dispatch selector-record. Manual-name matching is not yet proven for this class.'
  },
  {
    id: 'woods-book',
    label: 'Hidden clue book',
    kind: 'secret',
    actorId: 0x27,
    selectorRecordIndex: 0x3b,
    chrBanks: [0x04, 0x05],
    proof: "ROM actor id $27 dispatches through 1:$8335; that routine initializes selector-record $3B and clears the reveal flag when selected item $4F is Dracula's Eyeball. Joma/Debious rows use object-set $03 CHR banks $04/$05."
  },
  {
    id: 'mummy',
    label: 'The Mummy',
    kind: 'enemy',
    placement: 'grounded',
    actorId: 0x3a,
    selectorRecordIndex: 0x35,
    chrBanks: [0x06, 0x07],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $3A dispatches to PRG bank 1:$AD11 and initializes selector-record $35 for the Jam Wasteland/Deborah Cliff mummy rows. The rendered wrapped humanoid sprite matches the English manual enemy illustration labeled "The Mummy".'
  },
  {
    id: 'medusa',
    label: 'Medusa Head',
    kind: 'enemy',
    actorId: 0x0a,
    selectorRecordIndex: 0x18,
    chrBanks: [0x06, 0x07],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $0A dispatches to PRG bank 1:$AA45 and initializes selector-record $18 before later state-driven selector-record/direct-selector writes. The rendered flying head sprite matches the English manual enemy illustration labeled "Medusa Head". Vrad Mountain rows carry HP byte $04, so the ROM night-strength path yields day HP 4 and night HP 8.'
  },
  {
    id: 'eagle',
    label: 'Eagle',
    kind: 'enemy',
    actorId: 0x1b,
    selectorRecordIndex: 0x24,
    chrBanks: [0x06, 0x07],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $1B dispatches to PRG bank 1:$AB0C and initializes selector-record $24 for the Vrad Mountain eagle rows. Vrad rows carry HP byte $04, so the ROM night-strength path yields day HP 4 and night HP 8. Manual-name matching is not yet proven for this class.'
  },
  {
    id: 'harpy',
    label: 'Harpy',
    kind: 'enemy',
    actorId: 0x3b,
    selectorRecordIndex: 0x27,
    chrBanks: [0x06, 0x07],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $3B dispatches to PRG bank 1:$AC1E and initializes selector-record $27 for the Wicked Ditch harpy rows. The same state-driven routine can later use selector-record $28; the guide uses the primary decoded selector-record. Manual-name matching is not yet proven for this class.'
  },
  {
    id: 'flower',
    label: 'Man-Eating Plant',
    kind: 'enemy',
    actorId: 0x3f,
    selectors: [0xbe, 0xbf],
    chrBanks: [0x06, 0x07],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $3F dispatches to PRG bank 1:$AAA0 and writes direct metasprite selectors $BE/$BF before later state-driven selector-record $24 use. The rendered plant sprite matches the English manual enemy illustration labeled "Man-Eating Plant". Vrad Mountain row $0685B carries HP byte $04, so the ROM night-strength path yields day HP 4 and night HP 8.'
  },
  {
    id: 'ghost',
    label: 'The Pirate Skeleton',
    kind: 'enemy',
    actorId: 0x39,
    selectorRecordIndex: 0x3f,
    chrBanks: [0x06, 0x07],
    proof: 'Whole-ROM enemy atlas decoding proves actor id $39 dispatches to PRG bank 1:$AA6F and initializes selector-record $3F before later direct selector writes. The guide-facing record emits skull-in-flame selectors $E6/$E7, matching the English manual enemy illustration labeled "The Pirate Skeleton".'
  },
  {
    id: 'mountain-book',
    label: 'Hidden clue book',
    kind: 'secret',
    actorId: 0x27,
    selectorRecordIndex: 0x3b,
    chrBanks: [0x06, 0x07],
    proof: "ROM actor id $27 dispatches through 1:$8335; that routine initializes selector-record $3B and clears the reveal flag when selected item $4F is Dracula's Eyeball. Deborah Cliff/Jam Wasteland rows use CHR banks $06/$07."
  }
];

const MANSION_ACTOR_CLASS_BY_ID = new Map([
  [0x03, 'mansion-skeleton'],
  [0x05, 'mansion-spear-knight'],
  [0x0d, 'mansion-bone-thrower'],
  [0x0e, 'mansion-spider'],
  [0x0f, 'mansion-gargoyle'],
  [0x11, 'mansion-bat'],
  [0x1f, 'blob'],
  [0x25, 'dracula-rib-orb'],
  [0x27, 'mansion-book'],
  [0x3e, 'rock'],
  [0x42, 'camilla'],
  [0x44, 'death'],
  [0xae, 'oak-stake-merchant'],
  [0xaf, 'laruba-laurels-giver']
]);

const BERKELEY_SECRET_ACTOR_IDS = new Set([0x25, 0x27]);

const TOWN_INTERIOR_ACTOR_CLASS_BY_ID = new Map([
  [0xac, 'town-old-lady'],
  [0xad, 'town-priest'],
  [0xae, 'jova-merchant'],
  [0x27, 'town-book']
]);

const TOWN_EXTERIOR_ACTOR_CLASS_BY_ID = new Map([
  [0xa4, null],
  [0x01, 'crow'],
  [0xa9, 'town-woman'],
  [0xaa, 'jova-man'],
  [0xaf, 'blue-crystal-merchant'],
  [0xb5, 'jova-shepherd'],
  [0x17, 'zombie']
]);

const OUTDOOR_OBJSET2_ACTOR_CLASS_BY_ID = new Map([
  [0x02, 'leech'],
  [0x03, 'skeleton'],
  [0x04, 'fishman'],
  [0x06, 'lizardman'],
  [0x08, 'eyeball'],
  [0x12, 'wolf'],
  [0x15, 'mudman']
]);

const CAMILLA_CEMETERY_ACTOR_CLASS_BY_ID = new Map([
  [0x9e, 'secret-merchant'],
  [0x38, 'dead-hand'],
  [0x41, 'outdoor-blob']
]);

function mansionOrbClassIdForData(data) {
  if (data === 0x19) {
    return 'dracula-heart-orb';
  }
  if (data === 0x1a) {
    return 'dracula-eyeball-orb';
  }
  if (data === 0x1b) {
    return 'dracula-nail-orb';
  }
  if (data === 0x1c) {
    return 'dracula-ring-orb';
  }
  return 'dracula-rib-orb';
}

function mansionOrbLabelForData(data) {
  if (data === 0x19) {
    return "Dracula's Heart";
  }
  if (data === 0x1a) {
    return "Dracula's Eyeball";
  }
  if (data === 0x1b) {
    return "Dracula's Nail";
  }
  if (data === 0x1c) {
    return "Dracula's Ring";
  }
  return null;
}

const OUTDOOR_OBJSET3_ACTOR_CLASS_BY_ID = new Map([
  [0x03, 'skeleton-objset3'],
  [0x10, 'floating-skull'],
  [0x16, 'grabber'],
  [0x18, 'swamp-ghoul'],
  [0x1d, 'fire-ghoul'],
  [0x27, 'woods-book'],
  [0x38, 'dead-hand'],
  [0x40, 'high-jump-leech'],
  [0x41, 'outdoor-blob'],
  [0x4a, 'bone-dragon'],
  [0xaf, 'flame-whip-upgrade-merchant'],
  [0x9e, 'secret-merchant']
]);

const OUTDOOR_OBJSET4_ACTOR_CLASS_BY_ID = new Map([
  [0x0a, 'medusa'],
  [0x1b, 'eagle'],
  [0x27, 'mountain-book'],
  [0x39, 'ghost'],
  [0x3a, 'mummy'],
  [0x3b, 'harpy'],
  [0x3f, 'flower'],
  [0xaf, 'old-gypsy']
]);

const TOWN_INTERIOR_ACTOR_LABEL_BY_ITEM_TYPE = new Map([
  ['oakRib', 'Oak Stake Merchant'],
  ['oakHeart', 'Oak Stake Merchant'],
  ['oakNail', 'Oak Stake Merchant'],
  ['oakRing', 'Oak Stake Merchant'],
  ['oakStake', 'Oak Stake Merchant'],
  ['thorn', 'Thorn Whip Merchant'],
  ['holyWater', 'Holy Water Merchant'],
  ['whiteCrystal', 'White Crystal Merchant'],
  ['dagger', 'Dagger Merchant'],
  ['chain', 'Chain Whip Merchant'],
  ['garlicAljiba', 'Garlic Merchant'],
  ['garlicAlba', 'Garlic Merchant'],
  ['laurelsAljiba', 'Laurels Merchant'],
  ['laurelsAlba', 'Laurels Merchant'],
  ['laurelsOndol', 'Laurels Merchant'],
  ['laurelsDoina', 'Laurels Merchant'],
  ['laurelsLaruba', 'Laurels Giver'],
  ['morningStar', 'Morning Star Merchant'],
  ['flameWhip', 'Flame Whip Merchant'],
  ['blueCrystal', 'Blue Crystal Merchant'],
  ['redCrystal', 'Red Crystal Merchant']
]);

const ENEMY_HP_ROM_INIT_PROOF = {
  routine: 'PRG bank 1 CPU $8117-$8147',
  prgRomOffset: '0x04117-0x04147',
  nesFileOffset: '0x04127-0x04157',
  summary: 'The actor initializer loads the fourth actor-row byte into RAM $93, conditionally ASLs it for the night-strength path, then stores it to actor HP RAM $04C2,x.',
  nightStrengthExceptions: 'Actor ids $21/$22/$25-$27/$2D-$2F/$34 and object set $01 skip the ASL night-strength path.'
};

function standardEnemyHpFromVariants(baseHp, variants) {
  return {
    day: variants.includes('day') ? baseHp : null,
    night: variants.includes('night') ? baseHp * 2 : null
  };
}

function fixedEnemyHp(baseHp) {
  return {
    day: baseHp,
    night: baseHp
  };
}

function enemyHpRecordForManifestRow(context, rowBytes, variants) {
  const baseHp = rowBytes[3];

  if (context.objset === 1) {
    return {
      hp: fixedEnemyHp(baseHp),
      evidence: {
        policy: 'fixed-interior-row-hp',
        baseHp,
        rowData: hex(baseHp, 2),
        source: 'rom-actor-row-data-byte',
        rule: 'Mansion/interior maps use a fixed guide palette and no day/night variant; both displayed values are the ROM row HP byte.',
        rom: ENEMY_HP_ROM_INIT_PROOF
      }
    };
  }

  return {
    hp: standardEnemyHpFromVariants(baseHp, variants),
    evidence: {
      policy: 'standard-night-double',
      baseHp,
      rowData: hex(baseHp, 2),
      source: 'rom-actor-row-data-byte+rom-hp-init-routine',
      rule: 'Standard exterior enemies use the actor row data byte for day HP and the ROM night-strength path doubles that byte for night HP.',
      rom: ENEMY_HP_ROM_INIT_PROOF
    }
  };
}

const SECRET_DETAILS = {
  'dabis-2-sacred-flame-66b0': {
    type: 'destructible-reward',
    reward: 'Sacred Flame',
    action: "Dracula's Eyeball lets Simon see this hidden item before uncovering it.",
    reveal: 'The Sacred Flame appears after the stacked blocks are opened. Dracula\'s Eyeball makes the hidden item visible before the blocks are broken.',
    targetTileRects: [
      { x: 2, y: 20, width: 2, height: 4, signature: 'destructibleBlock2x4' }
    ],
    rewardSelectorRecord: '0x20',
    rewardSelectors: ['0x78', '0x79'],
    evidence: [
      'Actor row 0x066B0: 01 0C 26 76',
      'Actor id 0x26 uses item/fixture dispatch 1:$8335.',
      'Routine 1:$8335 selects selector-record $20 for non-$27 actors, and only actor id $27 takes the selector-record $3B hidden-book branch.',
      'Selector-record $20 expands to metasprite selectors $78/$79.',
      "The shared 1:$8335 update path clears the $08 hidden flag from actor flags $03C6,x, checks selected item RAM $004F, and leaves the flag clear when $4F == $03. The fixed-bank inventory selector maps Dracula's Eyeball to selected item $03.",
      "Holy Water is weapon index 4: fixed-bank 7:$F237-$F2D2 selects $4A bit $08, and 7:$D8C0 spawns projectile actor $33 for that selected weapon.",
      "Dracula's Nail is inventory index 4: fixed-bank 7:$F275 maps $91 bit $08 to selected item $04, and 7:$D623 gates the block-hit routine on $4F == 04 before calling 7:$D3AC.",
      'Text pointer index 0x76 decodes to the Sacred Flame pickup message.'
    ]
  },
  'aljiba-1-book-66d5': {
    type: 'destructible-clue',
    reward: 'Hidden clue book',
    action: "Dracula's Eyeball lets Simon see this hidden item before uncovering it.",
    reveal: 'The clue book appears after the blocks are opened. Dracula\'s Eyeball makes the hidden item visible before the blocks are broken.',
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
  },
  'berkeley-mansion-part-2-dracula-rib-orb-5b99': {
    type: 'oak-stake-orb',
    reward: "Dracula's Rib",
    action: "Use an Oak Stake here to reveal Dracula's Rib.",
    evidence: [
      'Actor row 0x05B99: 3D 15 25 18',
      'The berkeley-mansion-orb save-state captures prove pre-stake selector $3B rendered as OAM tiles $EC/$EE at screen x $C8/$D0.',
      'Frame-by-frame trace out/actor-traces/berkeley-mansion-orb-cadence proves the orb blink cycles OAM palette bits 1/2/3/0 once per NES frame.',
      'Actor id 0x25 uses fixed-bank $DED0 direct selector writes for the orb room sequence.',
      'Text pointer index 0x18 decodes to the Dracula\'s Rib pickup message.'
    ]
  },
  'lauber-mansion-part-2-dracula-s-heart-5c4b': {
    type: 'oak-stake-orb',
    reward: "Dracula's Heart",
    action: "Use an Oak Stake here to reveal Dracula's Heart.",
    evidence: [
      'Actor row 0x05C4B: 3D 15 25 19',
      'Actor id 0x25 uses fixed-bank $DED0 direct selector writes for the orb room sequence.',
      'Text pointer index 0x19 decodes to the Dracula\'s Heart pickup message.'
    ]
  },
  'brahm-mansion-orb-room-dracula-s-eyeball-5ce3': {
    type: 'oak-stake-orb',
    reward: "Dracula's Eyeball",
    action: "Use an Oak Stake here to reveal Dracula's Eyeball.",
    evidence: [
      'Actor row 0x05CE3: 0D 07 25 1A',
      'Actor id 0x25 uses fixed-bank $DED0 direct selector writes for the orb room sequence.',
      'Text pointer index 0x1A decodes at ROM file $0CFDE to the Dracula\'s Eyeball pickup message.'
    ]
  },
  'bodley-mansion-part-2-dracula-s-nail-5fab': {
    type: 'oak-stake-orb',
    reward: "Dracula's Nail",
    action: "Use an Oak Stake here to reveal Dracula's Nail.",
    evidence: [
      'Actor row 0x05FAB: 08 0B 25 1B',
      'Actor id 0x25 uses fixed-bank $DED0 direct selector writes for the orb room sequence.',
      'Text pointer index 0x1B selects the Dracula\'s Nail pickup message.'
    ]
  },
  'laruba-mansion-orb-room-dracula-s-ring-5acb': {
    type: 'oak-stake-orb',
    reward: "Dracula's Ring",
    action: "Use an Oak Stake here to reveal Dracula's Ring.",
    evidence: [
      'Actor row 0x05ACB: 0D 07 25 1C',
      'Actor id 0x25 uses fixed-bank $DED0 direct selector writes for the orb room sequence.',
      'Text pointer index 0x1C selects the Dracula\'s Ring pickup message.'
    ]
  }
};

const DEFAULT_HIDDEN_CLUE_BOOK_ACTION = "Dracula's Eyeball lets Simon see this hidden item before uncovering it.";
const HIDDEN_CLUE_BOOK_DESTRUCTIBLE_ACTION = DEFAULT_HIDDEN_CLUE_BOOK_ACTION;

function defaultSecretDetailsForActor(actor, bytes) {
  if (!bytes) {
    return null;
  }
  if (bytes[2] === 0x9e && actor.classId === 'secret-merchant' && actor.segmentId === 'storigoi-graveyard') {
    return {
      type: 'garlic-revealed-merchant',
      reward: 'Silk Bag',
      action: 'Drop Garlic in Storigoi Graveyard to reveal this hidden merchant.',
      reveal: 'The hidden merchant appears after the Garlic reveal routine clears the actor hidden flag.',
      evidence: [
        `Actor row ${hex(actor.offset, 5)}: ${publicBytes(bytes).join(' ')}`,
        'Actor id $9E maps to live actor $1E, the same garlic-revealed secret-merchant family used in Camilla Cemetery.',
        'Storigoi Graveyard row $06F88 uses text pointer $CEBE, whose decoded ROM dialog gives Simon a Silk Bag.',
        'The reward routine at ROM file $06E17 runs A5 92 / 09 01 / 85 92, setting RAM $92 bit 0 for the Silk Bag.'
      ]
    };
  }
  if (bytes[2] !== 0x27) {
    return null;
  }
  return {
    type: 'hidden-clue-book',
    reward: 'Hidden clue book',
    action: DEFAULT_HIDDEN_CLUE_BOOK_ACTION,
    reveal: 'The clue book appears after the blocks are opened. Dracula\'s Eyeball makes the hidden item visible before the blocks are broken.',
    rewardSelectorRecord: '0x3B',
    rewardSelectors: ['0x30'],
    evidence: [
      `Actor row ${hex(actor.offset, 5)}: ${publicBytes(bytes).join(' ')}`,
      'Actor id 0x27 dispatches through bank 1:$8335.',
      'Routine 1:$8335 initializes selector-record index $3B and later toggles the reveal flag based on selected item $4F.',
      "Dracula's Eyeball is inventory index 3; the fixed-bank inventory selector maps it to selected item $03.",
      'When $4F == 03, routine 1:$8335 clears the $08 reveal flag from actor flags $03C6,x.'
    ]
  };
}

const MOUNTAIN_VERTICAL_PLATFORM_ROWS = [
  { id: 'vrad-mountain-part-1-moving-platform-6874', segmentId: 'vrad-mountain-part-1', offset: 0x6874, bytes: [0x13, 0x0d, 0x34, 0x20], phaseFrames: 0 },
  { id: 'vrad-mountain-part-1-moving-platform-6878', segmentId: 'vrad-mountain-part-1', offset: 0x6878, bytes: [0x17, 0x0d, 0x34, 0x20], phaseFrames: 2 },
  { id: 'vrad-mountain-part-1-moving-platform-687c', segmentId: 'vrad-mountain-part-1', offset: 0x687c, bytes: [0x1b, 0x0d, 0x34, 0x20], phaseFrames: 4 },
  { id: 'vrad-mountain-part-1-moving-platform-6880', segmentId: 'vrad-mountain-part-1', offset: 0x6880, bytes: [0x1f, 0x0d, 0x34, 0x20], phaseFrames: 6 },
  { id: 'vrad-mountain-part-1-moving-platform-6884', segmentId: 'vrad-mountain-part-1', offset: 0x6884, bytes: [0x21, 0x0d, 0x34, 0x20], phaseFrames: 40 },
  { id: 'vrad-mountain-part-1-moving-platform-6888', segmentId: 'vrad-mountain-part-1', offset: 0x6888, bytes: [0x25, 0x0d, 0x34, 0x20], phaseFrames: 42 },
  { id: 'vrad-mountain-part-1-moving-platform-688c', segmentId: 'vrad-mountain-part-1', offset: 0x688c, bytes: [0x29, 0x0d, 0x34, 0x20], phaseFrames: 44 },
  { id: 'vrad-mountain-part-1-moving-platform-6890', segmentId: 'vrad-mountain-part-1', offset: 0x6890, bytes: [0x2d, 0x0d, 0x34, 0x20], phaseFrames: 46 },
  { id: 'jam-wasteland-moving-platform-6899', segmentId: 'jam-wasteland', offset: 0x6899, bytes: [0x14, 0x0d, 0x34, 0x20], phaseFrames: 0 },
  { id: 'jam-wasteland-moving-platform-689d', segmentId: 'jam-wasteland', offset: 0x689d, bytes: [0x18, 0x0d, 0x34, 0x20], phaseFrames: 2 },
  { id: 'jam-wasteland-moving-platform-68a1', segmentId: 'jam-wasteland', offset: 0x68a1, bytes: [0x1c, 0x0d, 0x34, 0x20], phaseFrames: 4 },
  { id: 'debious-woods-moving-platform-726c', segmentId: 'debious-woods', offset: 0x726c, bytes: [0x24, 0x0c, 0x34, 0x20], phaseFrames: 0, chrBanks: [0x04, 0x05], paletteByVariant: { day: 'joma-marsh-part-3-day-sprites', night: 'joma-marsh-part-3-night-sprites' } },
  { id: 'debious-woods-moving-platform-7270', segmentId: 'debious-woods', offset: 0x7270, bytes: [0x27, 0x0c, 0x34, 0x20], phaseFrames: 18, chrBanks: [0x04, 0x05], paletteByVariant: { day: 'joma-marsh-part-3-day-sprites', night: 'joma-marsh-part-3-night-sprites' } },
  { id: 'debious-woods-moving-platform-7274', segmentId: 'debious-woods', offset: 0x7274, bytes: [0x2a, 0x0c, 0x34, 0x20], phaseFrames: 36, chrBanks: [0x04, 0x05], paletteByVariant: { day: 'joma-marsh-part-3-day-sprites', night: 'joma-marsh-part-3-night-sprites' } },
  { id: 'debious-woods-moving-platform-7278', segmentId: 'debious-woods', offset: 0x7278, bytes: [0x2d, 0x0c, 0x34, 0x20], phaseFrames: 54, chrBanks: [0x04, 0x05], paletteByVariant: { day: 'joma-marsh-part-3-day-sprites', night: 'joma-marsh-part-3-night-sprites' } },
  { id: 'uta-lower-road-2-moving-platform-72bd', segmentId: 'uta-lower-road-2', offset: 0x72bd, bytes: [0x21, 0x28, 0x22, 0x20], phaseFrames: 0, selector: 0x43, chrBanks: [0x04, 0x05], paletteByVariant: { day: 'debious-woods-part-3-day-sprites', night: 'debious-woods-part-3-night-sprites' } },
  { id: 'uta-lower-road-2-moving-platform-72c9', segmentId: 'uta-lower-road-2', offset: 0x72c9, bytes: [0x25, 0x28, 0x22, 0x20], phaseFrames: 2, selector: 0x43, chrBanks: [0x04, 0x05], paletteByVariant: { day: 'debious-woods-part-3-day-sprites', night: 'debious-woods-part-3-night-sprites' } },
  { id: 'uta-lower-road-2-moving-platform-72d5', segmentId: 'uta-lower-road-2', offset: 0x72d5, bytes: [0x29, 0x28, 0x22, 0x20], phaseFrames: 4, selector: 0x43, chrBanks: [0x04, 0x05], paletteByVariant: { day: 'debious-woods-part-3-day-sprites', night: 'debious-woods-part-3-night-sprites' } },
  { id: 'uta-lower-road-2-moving-platform-72d9', segmentId: 'uta-lower-road-2', offset: 0x72d9, bytes: [0x2d, 0x28, 0x22, 0x20], phaseFrames: 6, selector: 0x43, chrBanks: [0x04, 0x05], paletteByVariant: { day: 'debious-woods-part-3-day-sprites', night: 'debious-woods-part-3-night-sprites' } }
];

function mountainVerticalPlatformFeature(row) {
  const actorId = row.bytes[2];
  const actorIdText = dollarHex(actorId, 2);
  const selector = row.selector ?? (actorId === 0x34 ? 0x1b : 0x43);
  const selectorText = dollarHex(selector, 2);
  const chrBanks = row.chrBanks || [0x06, 0x07];
  const paletteByVariant = row.paletteByVariant || { day: 'deborah-cliff-day-sprites', night: 'deborah-cliff-night-sprites' };
  const selectorSource = actorId === 0x34
    ? 'The routine special-cases actor id $34 and writes direct metasprite selector $1B.'
    : `Actor id ${actorIdText} uses the platform-family metasprite selector ${selectorText}.`;
  const phaseFrames = Number.isInteger(row.phaseFrames) ? row.phaseFrames : 0;
  const phaseSource = Number.isInteger(row.phaseFrames)
    ? ` The guide applies a ${phaseFrames}-frame renderer phase offset for this row, derived from the ROM actor loader's screen-window materialization timing against the $85BB branch's 66-frame effective cycle.`
    : '';
  return {
    id: row.id,
    label: 'Moving platform',
    kind: 'platform',
    interactive: false,
    visibilityLayer: 'always',
    highlightLayer: 'none',
    effect: 'moving-platform',
    segmentId: row.segmentId,
    offset: row.offset,
    bytes: row.bytes,
    selector,
    chrBanks,
    variants: ['day', 'night'],
    paletteByVariant,
    placement: {
      type: 'rom-row-anchor-with-platform-visible-anchor',
      offsetX: 0,
      offsetY: -13,
      source: `ROM row ${hex(row.offset, 5)} is ${publicBytes(row.bytes).join(' ')}. Actor id ${actorIdText} dispatches to the shared moving-platform routine at bank 1:$854B. ${selectorSource} The guide uses the same visible Y anchor correction proven for the platform family: raw row X is the visible anchor X and visible Y is row Y minus 13 pixels.`
    },
    motion: {
      type: 'linear-ping-pong',
      axis: 'y',
      minOffsetX: 0,
      maxOffsetX: 0,
      minOffsetY: -16,
      maxOffsetY: 0,
      speedPixelsPerFrame: 0.5,
      frameDurationMs: 1000 / 60,
      reversalFrames: 32,
      endpointHoldFrames: 1,
      ...(Number.isInteger(row.phaseFrames) ? { phaseFrames } : {}),
      source: `Actor id ${actorIdText} dispatches to bank 1:$854B. Row data $20 selects the vertical setup branch at 1:$8589 and runtime timer branch 1:$85BB. Branch 1:$8589 stores a 0.5 px/frame vertical velocity through fixed-bank $E076; branch 1:$85BB reloads high nibble $20 into timer RAM $0456 and calls fixed-bank $E03B at reversal before the next movement frame, so these rows travel 16 pixels from the row anchor before reversing and hold one frame at each endpoint.${phaseSource}`
    },
    dialog: null,
    provenance: {
      row: 'rom-actor-control-row',
      routine: 'bank 1:$854B, setup branch 1:$8589, timer branch 1:$85BB',
      selector: `metasprite selector ${selectorText}`,
      motion: 'row data $20: vertical platform setup index $0 with $20-frame reversal timer'
    }
  };
}

const BODLEY_FALLING_ROCK_ROWS = [
  { offset: 0x5f16, bytes: [0x09, 0x0c, 0x3e, 0x00], phaseFrames: 0 },
  { offset: 0x5f1a, bytes: [0x0a, 0x0c, 0x3e, 0x00], phaseFrames: 18 },
  { offset: 0x5f1e, bytes: [0x0b, 0x0c, 0x3e, 0x00], phaseFrames: 36 },
  { offset: 0x5f22, bytes: [0x0c, 0x0c, 0x3e, 0x00], phaseFrames: 54 },
  { offset: 0x5f26, bytes: [0x0d, 0x0c, 0x3e, 0x00], phaseFrames: 72 },
  { offset: 0x5f2a, bytes: [0x0e, 0x0c, 0x3e, 0x00], phaseFrames: 90 },
  { offset: 0x5f2e, bytes: [0x0f, 0x0c, 0x3e, 0x00], phaseFrames: 108 }
];
const BODLEY_FALLING_ROCK_SELECTOR_FRAME_INTERVAL = 9;
const BODLEY_FALLING_ROCK_POST_CONTACT_FRAMES = 0x38;
const BODLEY_FALLING_ROCK_MAX_PHASE_FRAMES = Math.max(...BODLEY_FALLING_ROCK_ROWS.map((row) => row.phaseFrames || 0));
const BODLEY_FALLING_ROCK_VERTICAL_VELOCITY = -1;
const BODLEY_FALLING_ROCK_HORIZONTAL_VELOCITY = 0.5;
const BODLEY_FALLING_ROCK_GRAVITY = 0.125;

function bodleyFallingRockAnchor(row) {
  const floorContactY = row.bytes[1] * ACTOR_CELL_SIZE;
  return {
    x: row.bytes[0] * ACTOR_CELL_SIZE + ACTOR_CELL_SIZE / 2,
    startY: 0x10,
    floorContactY,
    floorY: floorContactY - 8
  };
}

function bodleyFallingRockPath(row) {
  const anchor = bodleyFallingRockAnchor(row);
  const points = [];
  let velocityY = BODLEY_FALLING_ROCK_VERTICAL_VELOCITY;
  let y = anchor.startY;
  points.push({ frame: 0, segmentId: 'bodley-mansion-part-1', x: anchor.x, y });

  for (let frame = 1; frame <= 72; frame += 1) {
    y += velocityY;
    velocityY += BODLEY_FALLING_ROCK_GRAVITY;
    if (y >= anchor.floorY) {
      const contactFrame = frame;
      const lastVisibleFrame = contactFrame + BODLEY_FALLING_ROCK_POST_CONTACT_FRAMES;
      const hiddenFrame = lastVisibleFrame + 1;
      let postContactY = anchor.floorY;
      let postContactX = anchor.x;
      let postContactVelocityY = BODLEY_FALLING_ROCK_VERTICAL_VELOCITY;
      points.push({ frame: contactFrame, segmentId: 'bodley-mansion-part-1', x: anchor.x, y: anchor.floorY });
      for (let postFrame = 1; postFrame <= BODLEY_FALLING_ROCK_POST_CONTACT_FRAMES; postFrame += 1) {
        postContactX += BODLEY_FALLING_ROCK_HORIZONTAL_VELOCITY;
        postContactY += postContactVelocityY;
        postContactVelocityY += BODLEY_FALLING_ROCK_GRAVITY;
        points.push({
          frame: contactFrame + postFrame,
          segmentId: 'bodley-mansion-part-1',
          x: Math.round(postContactX * 1000) / 1000,
          y: Math.round(postContactY * 1000) / 1000
        });
      }
      points.push({ frame: hiddenFrame, segmentId: 'bodley-mansion-part-1', x: postContactX, y: postContactY, hidden: true });
      points.push({ frame: hiddenFrame + BODLEY_FALLING_ROCK_MAX_PHASE_FRAMES, segmentId: 'bodley-mansion-part-1', x: anchor.x, y: anchor.startY, hidden: true });
      return points;
    }
    points.push({ frame, segmentId: 'bodley-mansion-part-1', x: anchor.x, y: Math.round(y * 1000) / 1000 });
  }

  points.push({ frame: 72, segmentId: 'bodley-mansion-part-1', x: anchor.x, y: anchor.floorY });
  points.push({ frame: 73, segmentId: 'bodley-mansion-part-1', x: anchor.x, y: anchor.floorY, hidden: true });
  points.push({ frame: 73 + BODLEY_FALLING_ROCK_MAX_PHASE_FRAMES, segmentId: 'bodley-mansion-part-1', x: anchor.x, y: anchor.startY, hidden: true });
  return points;
}

function bodleyFallingRockFeature(row) {
  const actorIdText = dollarHex(row.bytes[2], 2);
  const rowText = hex(row.offset, 5);
  const anchor = bodleyFallingRockAnchor(row);
  return {
    id: `bodley-mansion-falling-rock-${Number(row.offset).toString(16)}`,
    label: 'Falling rock',
    kind: 'trap',
    interactive: false,
    visibilityLayer: 'characters',
    highlightLayer: 'none',
    effect: 'presentation-metasprite',
    segmentId: 'bodley-mansion-part-1',
    selectorRecordIndex: 0x2f,
    chrBanks: [0x08, 0x09],
    variants: ['fixed'],
    paletteByVariant: { fixed: 'bodley-mansion-fixed-sprites' },
    frameDurationMs: BODLEY_FALLING_ROCK_SELECTOR_FRAME_INTERVAL * 1000 / 60,
    placement: {
      type: 'decoded-runtime-falling-rock-start-anchor',
      pixelX: anchor.x,
      pixelY: anchor.startY,
      source: `ROM row ${rowText} is ${publicBytes(row.bytes).join(' ')}. Actor id ${actorIdText} dispatches to bank 1:$96E1. Initialization writes selector-record $2F and forces actor Y RAM $0324,x to $10, so the guide renders the rock from that runtime start anchor instead of the raw row Y. During the first falling state, the terrain probe uses offset Y+$08; the guide therefore uses row floor Y minus 8 pixels as the state-transition contact anchor.`
    },
    animation: {
      type: 'trace-path',
      frameDurationMs: 1000 / 60,
      autoLoop: true,
      phaseFrames: row.phaseFrames,
      interpolate: true,
      frameIntervalFrames: BODLEY_FALLING_ROCK_SELECTOR_FRAME_INTERVAL,
      activeFrameStart: 1,
      points: bodleyFallingRockPath(row),
      source: `Actor id ${actorIdText} routine bank 1:$96E1-$975C waits until abs(rockX-SimonX)<$10, writes vertical velocity $FF:$00 through fixed-bank $E076, applies gravity by adding $20 to the 8.8 Y velocity each frame through fixed-bank $DFE4, and probes terrain below with offset Y+$08 through fixed-bank $E2AF. On contact, state 2 resets vertical velocity to $FF:$00, writes horizontal velocity $00:$80 through fixed-bank $DE6F/$E04F, stops probing terrain, and removes the actor when timer RAM $048C,x reaches $38. The guide therefore shows the rock make the small post-contact arc and continue down through the floor before disappearing, rather than landing or rolling on the platform. States 1 and 2 call fixed-bank $DD2A, so selector-record $2F alternates selectors $81/$82 with sidecar delay $08. The guide loops this decoded fall-through path with a hidden reset and presentation phase offset; early rocks remain hidden until the furthest-behind phased rock has completed instead of restarting immediately.`
    },
    provenance: {
      row: 'rom-actor-row-promoted-as-grouped-trap-render',
      rowOffset: rowText,
      rawBytes: publicBytes(row.bytes),
      routine: 'bank 1:$96E1-$975C',
      selector: 'selector-record $2F bytes $01 $81 $08, metasprite selectors $81/$82',
      runtimePlacement: 'initialization stores $10 into actor Y RAM $0324,x; raw row Y $0C is retained as the terrain contact provenance anchor, and the guide uses contact Y minus the routine probe offset $08 as the state-transition anchor',
      motion: 'trigger proximity abs(rockX-SimonX)<$10; state-1 vertical velocity $FF:$00; gravity +$20 fractional per frame; terrain probe at Y+$08; state-2 vertical velocity reset $FF:$00 plus horizontal velocity $00:$80 without further terrain probes until timer $048C,x reaches $38',
      presentationLoop: 'the guide hides the reset from the offscreen fall-through position back to the ceiling start anchor rather than interpolating a non-ROM upward lift; early phased rocks remain hidden until the full grouped trap sequence can restart',
      palette: 'Bodley runtime capture proves sprite palette bytes from bank 4:$9FBD; the trap uses bodley-mansion-fixed-sprites instead of the generic mansion sprite palette'
    }
  };
}

function bodleyFallingRockTrapHotspot() {
  return {
    id: 'bodley-mansion-falling-rock-trap',
    label: 'Falling rocks',
    kind: 'trap',
    effect: 'guide-hotspot',
    segmentId: 'bodley-mansion-part-1',
    variants: ['fixed'],
    bounds: { x: 144, y: 1, width: 128, height: 207 },
    visibilityLayer: 'characters',
    highlightLayer: 'characters',
    condition: {
      playerFacing: 'Walk beneath these ceiling rocks to trigger the falling-rock trap.'
    },
    dialog: {
      tone: 'guide-authored',
      text: 'Falling rocks\n----------\nWatch out!!'
    },
    provenance: {
      source: 'rom-actor-routine-and-row-grouping',
      rows: BODLEY_FALLING_ROCK_ROWS.map((row) => ({
        rowOffset: hex(row.offset, 5),
        rawBytes: publicBytes(row.bytes)
      })),
      evidence: [
        'Bodley Mansion Part 1 has seven adjacent actor id $3E rows at ROM file offsets $05F16-$05F2E.',
        'Actor id $3E dispatches to bank 1:$96E1, initializes selector-record $2F, and stores $10 to actor Y RAM $0324,x.',
        'Selector-record $2F is bytes $01 $81 $08, so the active rock animation alternates selectors $81/$82 with sidecar delay $08.',
        'State 0 compares rock X against Simon X and triggers when the absolute distance is less than $10.',
        'State 1 applies vertical gravity through fixed-bank $DFE4 and probes terrain below with offset Y+$08 through fixed-bank $E2AF.',
        'On contact, the routine enters state 2, resets vertical velocity to $FF:$00, and writes horizontal velocity $00:$80 through fixed-bank $DE6F/$E04F.',
        'State 2 does not call the terrain probe again; it removes the actor when timer RAM $048C,x reaches $38, so each rock falls through the floor and disappears independently.'
      ]
    }
  };
}

const SECRET_FEATURE_DEFINITIONS = [
  {
    id: 'castlevania-preview-dracula-presentation',
    label: 'Dracula',
    kind: 'presentation',
    interactive: false,
    visibilityLayer: 'always',
    highlightLayer: 'none',
    effect: 'presentation-metasprite',
    segmentId: 'castlevania',
    selectors: [0x33],
    chrBanks: [0x0b, 0x0c],
    variants: ['day', 'night', 'fixed'],
    paletteByVariant: { fixed: 'castlevania-final-sprites' },
    frameDurationMs: 1000 / 60,
    blink: {
      visibleFrames: 2,
      hiddenFrames: 2,
      source: 'Guide-authored final-entry presentation blink. Selector $33 and palette data are ROM-derived; exact Dracula fight spawn cadence should be verified from a fight-start runtime trace or save state before treating this timing as ROM-perfect.'
    },
    placement: {
      type: 'guide-authored-final-entry-preview-anchor',
      pixelX: 128,
      pixelY: 110,
      source: 'The overworld Castlevania entry uses a guide-authored black one-screen final-area preview. The Dracula metasprite is ROM selector $33 placed guide-authored at the screen center, using the ROM nonzero-pixel bounds to center it vertically in the one-screen highlight box.'
    },
    provenance: {
      source: 'guide-authored-presentation-over-rom-selector',
      selectors: ['selector $33'],
      chrBanks: ['CHR bank $0B', 'CHR bank $0C'],
      palette: 'out/captures/castlevania-final-area/ppu-3f00-3f1f-palettes.bin'
    }
  },
  ...BODLEY_FALLING_ROCK_ROWS.map(bodleyFallingRockFeature),
  bodleyFallingRockTrapHotspot(),
  {
    id: 'camilla-cemetery-secret-merchant-6f32',
    label: 'Secret Merchant',
    kind: 'secret',
    effect: 'conditional-npc',
    segmentId: 'camilla-cemetery',
    offset: 0x6f32,
    bytes: [0x04, 0x0c, 0x9e, 0x06],
    selectorRecordIndex: 0x0b,
    chrBanks: [0x04, 0x05],
    variants: ['day', 'night'],
    paletteByVariant: { day: 'camilla-cemetery-day-sprites', night: 'camilla-cemetery-night-sprites' },
    placement: {
      type: 'rom-row-16px-cell-visual-anchor',
      offsetX: ACTOR_DRAW_ANCHOR_OFFSET_X,
      offsetY: ACTOR_DRAW_ANCHOR_OFFSET_Y,
      source: 'The Camilla Cemetery $9E row uses the standard actor visual anchor: row cell x/y plus (+8,-12), matching the prior ROM-manifest actor placement.'
    },
    condition: {
      type: 'dropped-garlic-actor',
      triggerActorId: '0x09',
      triggerActorSlots: ['0x03', '0x04', '0x05'],
      actorStateRam: '0x0444',
      hiddenFlagRam: '0x03C6',
      revealTimerRam: '0x0456',
      guideVisibility: 'Shown when the guide Secrets layer is visible.',
      playerFacing: 'Drop Garlic in Camilla Cemetery.'
    },
    dialogs: [
      {
        title: 'Secret Merchant',
        dialogText: 'Secret Merchant\n----------\nDrop Garlic in Camilla Cemetery to reveal this hidden merchant. He gives Simon the Silver Knife.',
        dialogTone: 'guide-authored'
      },
      {
        title: 'Secret Merchant',
        dialogText: "i'll give you this silver knife to save your neck."
      }
    ],
    itemReward: {
      itemId: 'silver-knife',
      evidence: 'Camilla Cemetery secret merchant row $06F32 uses text pointer $0CED8, whose decoded ROM dialog gives Simon the Silver Knife.'
    },
    provenance: {
      row: 'rom-actor-row',
      routine: 'bank 1:$B1BD',
      selector: 'selector-record $0B, metasprite selectors $1E/$1F',
      reveal: [
        'Actor row $06F32 is $04 $0C $9E $06.',
        'The actor dispatch masks row id $9E to live id $1E; dispatch table entry $1E points to bank 1:$B1BD.',
        'Initialization branch 1:$B1C2-$B1CE loads selector-record index $0B through fixed-bank $DED8, which emits metasprite selectors $1E/$1F.',
        'Routine 1:$B1DD-$B1EB scans actor slots $03-$05 for live actor id $09.',
        'When actor $09 is present, 1:$B1EC increments state RAM $0444,x, 1:$B1EF-$B1F4 clears hidden flag bit $20 from $03C6,x, and 1:$B1F7-$B1F9 sets reveal timer $0456,x to $20.'
      ]
    }
  },
  {
    id: 'berkeley-mansion-part-1-hidden-platform-5ad8',
    label: 'Hidden platform',
    kind: 'secret',
    effect: 'moving-platform',
    segmentId: 'berkeley-mansion-part-1',
    offset: 0x5ad8,
    bytes: [0x05, 0x28, 0x22, 0xa4],
    selector: 0x43,
    chrBanks: [0x08, 0x09],
    variants: ['fixed'],
    paletteByVariant: { fixed: 'mansion-fixed-sprites' },
    placement: {
      type: 'runtime-viewport-match',
      screenX: 0x50,
      screenYMin: 0x70,
      screenYMax: 0xc0,
      viewportOffsetX: 0,
      viewportOffsetY: 435,
      worldX: 0x50,
      worldY: 627,
      source: 'Actor trace observes live actor $22 at screen X $50 and screen Y $70-$C0; matching out/captures/berkeley-mansion-interior-day/background.png against the ROM-rendered Part 1 atlas places that viewport at x=0,y=435, making the bottom anchor 435+$C0=627.'
    },
    condition: {
      type: 'selected-crystal',
      selectedItemRam: '0x004F',
      selectedItemValue: '0x06',
      inventoryRam: '0x0091',
      crystalTierMask: '0x60',
      qualifyingItems: ['white-crystal', 'blue-crystal', 'red-crystal'],
      guideVisibility: 'Shown when the guide Secrets layer is visible.',
      playerFacing: 'Visible with White Crystal or better.'
    },
    motion: {
      type: 'linear-ping-pong',
      axis: 'y',
      minOffsetX: 0,
      maxOffsetX: 0,
      minOffsetY: -80,
      maxOffsetY: 0,
      speedPixelsPerFrame: 0.5,
      frameDurationMs: 1000 / 60,
      reversalFrames: 160,
      source: 'ROM row data $A4 selects the vertical motion branch for actor id $22; runtime traces observe selector $43 moving between screen Y $70-$C0 at 0.5 px/frame.'
    },
    dialog: {
      tone: 'guide-authored',
      text: 'Hidden platform\n----------\nVisible with White Crystal or better.'
    },
    provenance: {
      row: 'rom-actor-control-row',
      routine: 'bank 1:$854B, motion branch 1:$85FE',
      selector: 'metasprite selector $43',
      validation: 'out/actor-traces/berkeley-mansion-interior-day-idle'
    }
  },
  {
    id: 'lauber-mansion-part-2-moving-platform-5c2b',
    label: 'Moving platform',
    kind: 'platform',
    interactive: false,
    visibilityLayer: 'always',
    highlightLayer: 'none',
    effect: 'moving-platform',
    segmentId: 'lauber-mansion-part-2',
    offset: 0x5c2b,
    bytes: [0x24, 0x25, 0x21, 0x85],
    selector: 0x51,
    chrBanks: [0x08, 0x09],
    variants: ['fixed'],
    paletteByVariant: { fixed: 'lauber-mansion-fixed-sprites' },
    placement: {
      type: 'rom-row-anchor-with-platform-visible-anchor',
      offsetX: 0,
      offsetY: -13,
      source: 'ROM row $05C2B uses tile anchor x=$24,y=$25 in Lauber Part 2. This moving-platform control row shares the mansion platform anchor convention proven by the Berkeley $22 trace: raw row anchor is retained as provenance, while visible guide placement is row anchor plus (0,-13) to match the runtime actor-slot/OAM screen anchor. Selector $51 draws a 2x2 platform around that visible anchor; setup branch $859A stores positive X velocity, so the row anchor is the left endpoint and the platform moves right before reversing.'
    },
    motion: {
      type: 'linear-ping-pong',
      axis: 'x',
      minOffsetX: 0,
      maxOffsetX: 128,
      minOffsetY: 0,
      maxOffsetY: 0,
      speedPixelsPerFrame: 1,
      frameDurationMs: 1000 / 60,
      reversalFrames: 128,
      source: 'ROM row data $85 selects motion index $5. Setup branch 1:$859A writes X velocity +1 and Y velocity 0 through fixed-bank $E04F, making the row anchor the left endpoint. Runtime branch 1:$8616 reloads the high nibble $80 into $0456, calls fixed-bank $E027 to negate horizontal velocity at reversal, then decrements/moves through $85CB -> $E0F4. The resulting path is a 128-pixel horizontal ping-pong from the row anchor rightward.'
    },
    dialog: null,
    provenance: {
      row: 'rom-actor-control-row',
      routine: 'bank 1:$854B, setup branch 1:$859A, motion branch 1:$8616',
      selector: 'metasprite selector $51',
      motion: 'fixed-bank $E04F stores velocity; fixed-bank $E027 reverses horizontal velocity; fixed-bank $E0F4 applies actor movement'
    }
  },
  {
    id: 'deborah-cliff-red-crystal-kneel-tornado',
    label: 'Deborah Cliff tornado',
    kind: 'secret',
    effect: 'guide-hotspot',
    segmentId: 'jam-wasteland',
    variants: ['day', 'night'],
    bounds: { x: 0, y: 0, width: 80, height: 224 },
    visibilityLayer: 'secrets',
    highlightLayer: 'secrets',
    triggerAnimationFeatureId: 'deborah-cliff-tornado-effect',
    condition: {
      playerFacing: 'Kneel at Deborah Cliff with the Red Crystal to summon the tornado to Bodley Mansion.'
    },
    dialog: {
      tone: 'guide-authored',
      text: 'Deborah Cliff tornado\n----------\nKneel at Deborah Cliff with the Red Crystal to summon the tornado to Bodley Mansion.'
    },
    provenance: {
      source: 'rom-routine-and-runtime-trace',
      routine: 'bank 1:$A91D-$A991',
      trace: 'data/deborah-tornado-path.json generated from out/actor-traces/deborah-tornado-sprite-probe',
      evidence: [
        'Bank 1:$A91D-$A929 checks area RAM $50 == $01 and submap RAM $51 & $7F == $01, identifying Jam Wasteland (Deborah Cliff).',
        'Bank 1:$A92B-$A936 requires scroll bytes $53/$54 == 0 and Simon center X RAM $0348 < $50.',
        'Bank 1:$A938-$A94B checks selected item RAM $004F == $06, inventory RAM $0091 & $60 == $60, and Simon state RAM $03D8 == $03.',
        'Bank 1:$A953-$A991 runs the countdown and initializes tornado actor id $1C in slot $11 with selector $9C.',
        'Transition probe data/transition-probes.json records Deborah Cliff tornado transport settling at objset $01, area $04, submap $00, the Bodley Mansion door segment.'
      ]
    }
  },
  {
    id: 'deborah-cliff-tornado-effect',
    label: 'Deborah Cliff tornado',
    kind: 'secret',
    interactive: false,
    effect: 'triggered-animation',
    segmentId: 'jam-wasteland',
    variants: ['day', 'night'],
    visibilityLayer: 'triggered',
    highlightLayer: 'none',
    chrBanks: [0x06, 0x07],
    paletteByVariant: { day: 'deborah-cliff-day-sprites', night: 'deborah-cliff-night-sprites' },
    frameDurationMs: 1000 / 30,
    renderFrames: DEBORAH_TORNADO_FRAMES,
    animation: {
      type: 'trace-path',
      frameDurationMs: DEBORAH_TORNADO_PATH.frameDurationMs,
      points: DEBORAH_TORNADO_PATH.points,
      source: DEBORAH_TORNADO_PATH.source,
      interpolate: Boolean(DEBORAH_TORNADO_PATH.presentation?.interpolate),
      presentation: DEBORAH_TORNADO_PATH.presentation || null
    },
    provenance: {
      source: 'rom-routine-and-runtime-oam-trace',
      routine: 'bank 1:$A960-$A991 initializes actor id $1C, selector $9C, screen X $F0, and screen Y $80.',
      trace: 'data/deborah-tornado-path.json',
      sprite: 'Mesen OAM trace emits 8x16 tiles $C5/$C7/$C9/$CB/$CD/$CF from CHR banks $06/$07; attr $40 alternates every two NES frames.'
    }
  },
  {
    id: 'yuba-lake-blue-crystal-kneel-route',
    label: 'Yuba Lake reveal',
    kind: 'secret',
    effect: 'guide-hotspot',
    segmentId: 'yuba-lake',
    variants: ['day', 'night'],
    bounds: { x: 0, y: 0, width: 256, height: 224 },
    visibilityLayer: 'secrets',
    highlightLayer: 'secrets',
    condition: {
      playerFacing: 'Kneel by Yuba Lake with the Blue Crystal or better to reveal the route to Lauber Mansion.'
    },
    dialog: {
      tone: 'guide-authored',
      text: 'Yuba Lake reveal\n----------\nKneel by Yuba Lake with the Blue Crystal or better to reveal the route to Lauber Mansion.'
    },
    provenance: {
      source: 'rom-routine',
      routine: 'bank 1:$A760-$A7B7',
      evidence: [
        'Bank 1:$A76B-$A779 checks area RAM $50 == $05 and submap RAM $51 & $7F == $01, identifying Yuba Lake.',
        'Bank 1:$A789-$A7A0 checks selected item RAM $004F == $06, inventory RAM $0091 & $60 >= $40, and Simon state RAM $03D8 == $03 before setting route state RAM $56 = $01.',
        'The routine does not check Simon X/Y within the submap, so the guide highlights the Yuba Lake screen rather than a guessed smaller kneeling spot.'
      ]
    }
  },
  {
    id: 'uta-lower-road-blue-crystal-kneel-route',
    label: 'Uta Lower Road reveal',
    kind: 'secret',
    effect: 'guide-hotspot',
    segmentId: 'uta-lower-road-1',
    variants: ['day', 'night'],
    bounds: { x: 0, y: 0, width: 256, height: 224 },
    visibilityLayer: 'secrets',
    highlightLayer: 'secrets',
    condition: {
      playerFacing: 'Kneel on Uta Lower Road with the Blue Crystal or better to reveal the lower path.'
    },
    dialog: {
      tone: 'guide-authored',
      text: 'Uta Lower Road reveal\n----------\nKneel on Uta Lower Road with the Blue Crystal or better to reveal the lower path.'
    },
    provenance: {
      source: 'rom-routine',
      routine: 'bank 1:$AD96-$ADE6',
      evidence: [
        'Bank 1:$AD9A-$ADA8 checks area RAM $50 == $03 and submap RAM $51 & $7F == $03, identifying Uta Lower Road 1.',
        'Bank 1:$ADBC-$ADD3 checks selected item RAM $004F == $06, inventory RAM $0091 & $60 >= $40, and Simon state RAM $03D8 == $03.',
        'Bank 1:$ADD6-$ADE4 sets route state RAM $56 = $01, clears route latch RAM $0195 and action state RAM $4B, then plays sound $2B.',
        'The routine does not check Simon X/Y within the submap, so the guide highlights the upper Uta Lower Road 1 screen rather than a guessed smaller kneeling spot.'
      ]
    }
  },
  {
    id: 'denis-marsh-hidden-staircase',
    label: 'Hidden staircase',
    kind: 'secret',
    effect: 'guide-hotspot',
    segmentId: 'denis-marsh',
    variants: ['day', 'night'],
    bounds: { x: 880, y: 96, width: 96, height: 96 },
    highlightShape: 'hidden-staircase',
    visibilityLayer: 'secrets',
    highlightLayer: 'secrets',
    condition: {
      playerFacing: 'Press Up at the far-right wall to climb the hidden staircase.'
    },
    dialog: {
      tone: 'guide-authored',
      text: 'Hidden staircase\n----------\nThere are steps where no steps can be seen.'
    },
    provenance: {
      source: 'runtime-trace-and-rom-layout-check',
      routine: 'bank 2:$D4E2, bank 3:$DECF/$8AB5',
      evidence: [
        'Save state out/states/bordia-stairs.mss captures objset $02, area $09, submap $02, camera high byte $54=$03, with Simon at screen X $C8 and Y $BD.',
        'Trace out/actor-traces/bordia-hidden-stairs-entry starts pressing Up after settle; slot 0 changes from state $00 to $07 at PRG bank 2:$D4E2, then to $08 and stair-stepping state $0A at PRG bank 3:$DECF. The same trace sets stair-kind RAM $04C2 to $01.',
        'Trace out/player-stair-trace/bordia-up walks Simon up-left along the hidden path from segment-local about (968,189) toward (912,133); out/player-stair-trace/bordia-down never enters stair states $09/$0A.',
        'The highlight footprint mirrors the visible left-side Bordia staircase: ROM layout metatiles $05,$05,$03 at block cells (2,5), (3,4), and (4,3), using the same 8-pixel stair cadence within the 96x96 pixel stair area. The 16-pixel left offset aligns the guide path with the traced top-of-stair position instead of the right edge of the landing.',
        'The ROM-derived Bordia layout block grid has normal stair metatiles $03/$05 only on the visible left-side staircase. The far-right wall area has no $02/$03/$04/$05 stair metatile, so this is represented as a hidden special staircase rather than visible terrain.'
      ]
    }
  },
  {
    id: 'dead-river-brahm-ferry-route',
    label: 'Brahm ferry route',
    kind: 'secret',
    effect: 'guide-hotspot',
    segmentId: 'dead-river-part-1',
    variants: ['day', 'night'],
    bounds: { x: 208, y: 144, width: 96, height: 80 },
    visibilityLayer: 'secrets',
    highlightLayer: 'secrets',
    condition: {
      playerFacing: "Board the Dead River ferry with Dracula's Heart selected."
    },
    dialog: {
      tone: 'guide-authored',
      text: "Brahm ferry route\n----------\nBoard this ferry with Dracula's Heart selected to reach Brahm's Mansion."
    },
    provenance: {
      source: 'rom-routine-and-rom-ferry-actor-row',
      ferryActorRow: '0x060A6: 0E 0C BC 00',
      routine: 'ferry interaction branch $C6EE-$C70C and fixed-bank ferry handler',
      evidence: [
        'The ferry interaction branch checks selected item RAM $004F == $02, area RAM $50 == $07, and submap RAM $51 & $01.',
        'When the checks pass, the branch stores text pointer $0C to RAM $7F and stores $01 to RAM $04EC.',
        'When the checks fail, the branch stores text pointer $0B to RAM $7F and stores $00 to RAM $04EC.',
        'The fixed-bank ferry handler consumes RAM $04EC, clears it, and writes area RAM $50 = $06, which the topology manifest identifies as Dead River to Brahm.',
        "The fixed-bank inventory selection path maps Dracula's Heart to selected item value $02; Red Crystal is the crystal selected-item slot and is not the condition for this ferry branch."
      ]
    }
  },
  {
    id: 'lower-road-left-moving-platform-6765',
    label: 'Moving platform',
    kind: 'platform',
    interactive: false,
    visibilityLayer: 'always',
    highlightLayer: 'none',
    effect: 'moving-platform',
    segmentId: 'lower-road',
    offset: 0x6765,
    bytes: [0x29, 0x0d, 0x22, 0x45],
    selector: 0x43,
    chrBanks: [0x02, 0x03],
    variants: ['day', 'night'],
    paletteByVariant: { day: 'yuba-lake-path-day-sprites', night: 'yuba-lake-path-night-sprites' },
    placement: {
      type: 'rom-row-anchor-with-platform-visible-anchor',
      offsetX: 0,
      offsetY: -13,
      source: 'Yuba Lake Path actor row $06765 uses actor id $22 with row anchor x=$29,y=$0D. The $22 platform family uses raw row X as visible anchor X and the same -13px visible Y anchor correction proven by the Berkeley $22 runtime trace.'
    },
    motion: {
      type: 'linear-ping-pong',
      axis: 'x',
      minOffsetX: 0,
      maxOffsetX: 64,
      minOffsetY: 0,
      maxOffsetY: 0,
      speedPixelsPerFrame: 1,
      frameDurationMs: 1000 / 60,
      reversalFrames: 64,
      source: 'Row data $45 selects setup branch 1:$859A, which stores X velocity +1 and Y velocity 0. Runtime branch 1:$8616 reloads the high nibble $40 into the reversal timer, so this platform travels 64 pixels rightward from the row anchor before reversing.'
    },
    dialog: null,
    provenance: {
      row: 'rom-actor-control-row',
      routine: 'bank 1:$854B, setup branch 1:$859A, motion branch 1:$8616',
      selector: 'metasprite selector $43',
      motion: 'fixed-bank $E04F stores velocity; fixed-bank $E027 reverses horizontal velocity; fixed-bank $E0F4 applies actor movement'
    }
  },
  {
    id: 'lower-road-right-moving-platform-676d',
    label: 'Moving platform',
    kind: 'platform',
    interactive: false,
    visibilityLayer: 'always',
    highlightLayer: 'none',
    effect: 'moving-platform',
    segmentId: 'lower-road',
    offset: 0x676d,
    bytes: [0x37, 0x0d, 0x22, 0x46],
    selector: 0x43,
    chrBanks: [0x02, 0x03],
    variants: ['day', 'night'],
    paletteByVariant: { day: 'yuba-lake-path-day-sprites', night: 'yuba-lake-path-night-sprites' },
    placement: {
      type: 'rom-row-anchor-with-platform-visible-anchor',
      offsetX: 0,
      offsetY: -13,
      source: 'Yuba Lake Path actor row $0676D uses actor id $22 with row anchor x=$37,y=$0D. The $22 platform family uses raw row X as visible anchor X and the same -13px visible Y anchor correction proven by the Berkeley $22 runtime trace.'
    },
    motion: {
      type: 'linear-ping-pong',
      axis: 'x',
      minOffsetX: 0,
      maxOffsetX: -64,
      minOffsetY: 0,
      maxOffsetY: 0,
      speedPixelsPerFrame: 1,
      frameDurationMs: 1000 / 60,
      reversalFrames: 64,
      source: 'Row data $46 selects setup branch 1:$859E, which stores X velocity -1 and Y velocity 0. Runtime branch 1:$8616 reloads the high nibble $40 into the reversal timer, so this platform travels 64 pixels leftward from the row anchor before reversing.'
    },
    dialog: null,
    provenance: {
      row: 'rom-actor-control-row',
      routine: 'bank 1:$854B, setup branch 1:$859E, motion branch 1:$8616',
      selector: 'metasprite selector $43',
      motion: 'fixed-bank $E04F stores velocity; fixed-bank $E027 reverses horizontal velocity; fixed-bank $E0F4 applies actor movement'
    }
  },
  ...MOUNTAIN_VERTICAL_PLATFORM_ROWS.map(mountainVerticalPlatformFeature)
];

const MENU_ITEM_ICON_CHR_BANKS = [0x00, 0x01];
const MENU_ITEM_ICON_PALETTE = ['0x0F', '0x11', '0x20', '0x15'];
const MENU_ITEM_ICON_TABLE_EVIDENCE = 'Fixed-bank start-menu drawing tables: body-part icons at 7:$F033 and weapon/crystal icons at 7:$F038; carry-item branches load Laurels tile $58, Silk Bag tile $5C, and Garlic tile $6D before drawing through 7:$EB9C.';
const MENU_ITEM_CAPTURE_EVIDENCE = 'Start-menu PPU capture out/captures/game-menu-jova-woods-start shows item/menu tiles rendered from CHR banks $00/$01 with background palette slot 3.';

const GUIDE_ITEMS = {
  'white-crystal': {
    id: 'white-crystal',
    label: 'White Crystal',
    aliases: ['White Crystal'],
    iconTile: 0x5e,
    manualText: 'The White Crystal offers a weakened source of magic power.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Items, page 11.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'ROM sale table triple at file offset $1ED3A is $5E $00 $50, linking tile $5E to the white crystal sale row.'
    ]
  },
  'blue-crystal': {
    id: 'blue-crystal',
    label: 'Blue Crystal',
    aliases: ['Blue Crystal'],
    iconTile: 0x6e,
    manualText: 'Offers stronger magical powers than the White Crystal.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Items, page 11.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'The Yuba Lake reveal routine checks selected item RAM $004F == $06 and inventory crystal-tier mask $0091 & $60 >= $40 before revealing the route.'
    ]
  },
  'red-crystal': {
    id: 'red-crystal',
    label: 'Red Crystal',
    aliases: ['Red Crystal'],
    iconTile: 0x5f,
    manualText: 'You must have the Red Crystal before you enter Dracula\'s Castle.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Items, page 11.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE
    ]
  },
  'oak-stake': {
    id: 'oak-stake',
    label: 'The Oak Stake',
    aliases: ['The Oak Stake', 'Oak Stake'],
    iconTile: 0x59,
    manualText: 'You\'ll need the Oak Stake to collect Dracula\'s corpse at the mansions.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Weapons, page 10.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'ROM sale table triple at file offset $1ED37 is $59 $00 $50, linking tile $59 to the oak stake sale row.'
    ]
  },
  dagger: {
    id: 'dagger',
    label: 'The Dagger',
    aliases: ['The Dagger', 'Dagger'],
    iconTile: 0x54,
    manualText: 'The dagger can be thrown to kill distant enemy creatures.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Weapons, page 10.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'ROM sale table triple at file offset $1ED31 is $54 $00 $50, linking tile $54 to the Dagger sale row.'
    ]
  },
  'thorn-whip': {
    id: 'thorn-whip',
    label: 'Thorn Whip',
    aliases: ['Thorn Whip'],
    iconTile: 0x5b,
    manualText: 'The Thorn Whip is stronger than the Leather Whip.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Weapons, page 10.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'ROM sale table triple at file offset $1ED3D is $5B $01 $00, linking tile $5B to the Thorn Whip sale row.'
    ]
  },
  'chain-whip': {
    id: 'chain-whip',
    label: 'The Chain Whip',
    aliases: ['The Chain Whip', 'Chain Whip'],
    iconTile: 0x5b,
    manualText: 'The Chain Whip is stronger than the Thorn Whip.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Weapons, page 10.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'ROM sale table triple at file offset $1ED40 is $5B $01 $50, linking tile $5B to the Chain Whip sale row.'
    ]
  },
  'morning-star': {
    id: 'morning-star',
    label: 'Morning Star',
    aliases: ['Morning Star'],
    iconTile: 0x5b,
    manualText: 'The Morning Star is longer than the Chain Whip.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Weapons, page 10.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'ROM sale table triple at file offset $1ED43 is $5B $02 $00, linking tile $5B to the Morning Star sale row.'
    ]
  },
  'flame-whip': {
    id: 'flame-whip',
    label: 'The Flame Whip',
    aliases: ['The Flame Whip', 'Flame Whip'],
    iconTile: 0x5b,
    manualText: 'The Flame Whip. Magic changes the Morning Star into the Flame Whip and gives it mysterious powers.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Weapons, page 10.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      "Debious Woods row $072B1 uses actor id $AF/data $05 and text pointer $CE89, whose decoded game text upgrades Simon's Morning Star.",
      'Reward routine at ROM file offset $04C86 checks RAM $0434 == $03 and increments it, promoting Morning Star to whip tier $04.',
      'If RAM $0434 is not $03, the same routine selects text pointer index $75, decoded as "to break my spell, come back with a powerful weapon."'
    ]
  },
  'holy-water': {
    id: 'holy-water',
    label: 'Holy Water',
    aliases: ['Holy Water', 'Magic Potion'],
    iconTile: 0x57,
    manualText: 'Holy Water disintegrates walls and floors which conceal weapons and items.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Items, page 11.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'ROM sale table triple at file offset $1ED2E is $57 $00 $50, linking tile $57 to the Holy Water sale row.',
      'The guide secret proof decodes Holy Water as weapon index 4 and the block-breaking projectile path; the Jova NPC text uses "magic potion" for that block-breaking item behavior.'
    ]
  },
  'sacred-flame': {
    id: 'sacred-flame',
    label: 'Sacred Flame',
    aliases: ['Sacred Flame'],
    iconTile: 0x69,
    manualText: 'The flame weakens the creatures\' evil powers.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Weapons, page 10.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE
    ]
  },
  diamond: {
    id: 'diamond',
    label: 'Diamond',
    aliases: ['Diamond'],
    iconTile: 0x70,
    manualText: 'Toss it and see what happens.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Items, page 11.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'Vrad Mountain row $0684F uses actor id $AF/data $00 and text pointer $CF38, whose decoded game text gives Simon a Diamond.',
      'The row reward routine at ROM file offset $06A4A runs A5 4A / 09 10 / 85 4A, setting RAM $4A bit 4.',
      'The fixed-bank weapon/item start-menu table at file offset $1F048 maps RAM $4A bit 4 to tile $70.'
    ]
  },
  'silk-bag': {
    id: 'silk-bag',
    label: 'Silk Bag',
    aliases: ['Silk Bag'],
    iconTile: 0x5c,
    manualText: 'If you have the Silk Bag you can carry a larger supply of medicinal herbs.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Items, page 11.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'Fixed-bank start-menu branch at 7:$F199 checks RAM $92 bit 0; when set, it loads tile $5C and draws it through 7:$EB9C.',
      'Storigoi Graveyard row $06F88 uses text pointer $CEBE, whose decoded ROM dialog gives Simon a Silk Bag.',
      'The reward routine at ROM file offset $06E17 runs A5 92 / 09 01 / 85 92, setting RAM $92 bit 0.'
    ]
  },
  'silver-knife': {
    id: 'silver-knife',
    label: 'Silver Knife',
    aliases: ['Silver Knife'],
    iconTile: 0x55,
    manualText: 'The Silver Knife can be thrown farther than the dagger.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Weapons, page 10.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'Fixed-bank weapon/crystal start-menu table at 7:$F038 maps the knife-family menu icon for Silver Knife to tile $55.',
      'Camilla Cemetery secret merchant row $06F32 decodes text pointer $0CED8 to the Silver Knife reward dialog.'
    ]
  },
  'golden-knife': {
    id: 'golden-knife',
    label: 'The Gold Knife',
    aliases: ['The Gold Knife', 'Gold Knife', 'Golden Knife'],
    iconTile: 0x6f,
    manualText: 'This is your strongest knife, and it has a mysterious power.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Weapons, page 10.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'Fixed-bank weapon/crystal start-menu table at file offset $1F048 maps the third weapon slot to tile $6F for the Gold Knife.',
      'Brahm Mansion Death row $05CDE has text pointer $0DCC0, whose decoded ROM dialog gives Simon the Golden Knife.'
    ]
  },
  'dracula-rib': {
    id: 'dracula-rib',
    label: "Dracula's Rib",
    aliases: ["Dracula's Rib"],
    iconTile: 0x4e,
    manualText: 'The rib bone will make the ordinary hero feel like a spineless coward.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Count Dracula\'s Missing Pieces, page 9.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'The fixed-bank start-menu body-part table orders Dracula part icons as Rib, Heart, Eyeball, Nail, Ring.',
      'The Jova NPC clue text decodes to "a rib can shield you from evil."'
    ]
  },
  'dracula-heart': {
    id: 'dracula-heart',
    label: "Dracula's Heart",
    aliases: ["Dracula's Heart"],
    iconTile: 0x4f,
    manualText: 'Watch out! The heart attacks.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Count Dracula\'s Missing Pieces, page 9.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'The fixed-bank start-menu body-part table orders Dracula part icons as Rib, Heart, Eyeball, Nail, Ring.',
      'Lauber Mansion actor row $05C4B uses actor id $25 and text/data $19 for the Dracula\'s Heart orb.'
    ]
  },
  'dracula-eyeball': {
    id: 'dracula-eyeball',
    label: "Dracula's Eyeball",
    aliases: ["Dracula's Eyeball"],
    iconTile: 0x50,
    manualText: 'When it comes to the most frightening piece, the eyes have it.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Count Dracula\'s Missing Pieces, page 9.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'The fixed-bank start-menu body-part table orders Dracula part icons as Rib, Heart, Eyeball, Nail, Ring.',
      'Brahm Mansion actor row $05CE3 uses actor id $25 and text/data $1A for the Dracula\'s Eyeball orb.'
    ]
  },
  'magic-cross': {
    id: 'magic-cross',
    label: 'The Cross',
    aliases: ['The Cross', 'Magic Cross', 'Cross'],
    iconTile: 0x5a,
    manualText: 'You must have the Cross to seal Dracula\'s fate.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Items, page 11.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'The fixed-bank carry-item start-menu table maps the Cross/Magic Cross carry item to tile $5A.',
      'Laruba Mansion Camilla row $05AC6 has holdsItem set in the ROM manifest and text pointer $D1D7, whose decoded ROM dialog gives Simon the Magic Cross.'
    ]
  },
  'dracula-nail': {
    id: 'dracula-nail',
    label: "Dracula's Nail",
    aliases: ["Dracula's Nail"],
    iconTile: 0x51,
    manualText: 'The nail is the symbol of evil power.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Count Dracula\'s Missing Pieces, page 9.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'The fixed-bank start-menu body-part table orders Dracula part icons as Rib, Heart, Eyeball, Nail, Ring.',
      'Bodley Mansion actor row $05FAB uses actor id $25 and text/data $1B for the Dracula\'s Nail orb.'
    ]
  },
  'dracula-ring': {
    id: 'dracula-ring',
    label: "Dracula's Ring",
    aliases: ["Dracula's Ring", 'The Ring'],
    iconTile: 0x52,
    manualText: "It's been in the Count's family for hundreds of years. Then again, the Count's also been in his family for hundreds of years.",
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Count Dracula\'s Missing Pieces, page 9.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'The fixed-bank start-menu body-part table orders Dracula part icons as Rib, Heart, Eyeball, Nail, Ring.',
      'Laruba Mansion actor row $05ACB uses actor id $25 and text/data $1C for the Dracula\'s Ring orb.'
    ]
  },
  garlic: {
    id: 'garlic',
    label: 'Garlic',
    aliases: ['Garlic'],
    iconTile: 0x6d,
    manualText: 'Place the Garlic in front of enemies, and it will weaken them significantly.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Items, page 11.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'ROM sale table triple at file offset $1ED2B is $6D $00 $50, linking tile $6D to a Garlic sale row.'
    ]
  },
  laurels: {
    id: 'laurels',
    label: 'Laurels',
    aliases: ['Laurels', 'Laurel'],
    iconTile: 0x58,
    manualText: 'Laurel helps make you invincible against enemy attacks. You can purchase Laurel from town merchants.',
    manualSource: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Magic Items, page 11.',
    evidence: [
      MENU_ITEM_CAPTURE_EVIDENCE,
      MENU_ITEM_ICON_TABLE_EVIDENCE,
      'ROM sale table triple at file offset $1ED25 is $58 $00 $50, linking tile $58 to a Laurels sale row.'
    ]
  }
};

const GUIDE_ITEM_OFFERS = {
  'blue-crystal': {
    itemId: 'blue-crystal',
    roleLabel: 'Blue Crystal Merchant',
    costLabel: 'Trade White Crystal',
    priceSource: 'Crystal exchange NPC row $517C has actor id $AF/data $03 and text pointer $D85E; dispatch uses the crystal merchant selector path.'
  },
  'red-crystal': {
    itemId: 'red-crystal',
    roleLabel: 'Red Crystal Merchant',
    costLabel: 'Trade Blue Crystal',
    priceSource: 'Crystal exchange NPC row $5135 has actor id $AF/data $04 and text pointer $D893; dispatch uses the crystal merchant selector path.'
  },
  'white-crystal': {
    itemId: 'white-crystal',
    roleLabel: 'White Crystal Merchant',
    costHearts: 50,
    priceSource: 'ROM sale table at file offset $1ED3A: $5E $00 $50.'
  },
  'oak-stake': {
    itemId: 'oak-stake',
    roleLabel: 'Oak Stake Merchant',
    costHearts: 50,
    priceSource: 'ROM sale table at file offset $1ED37: $59 $00 $50.'
  },
  'thorn-whip': {
    itemId: 'thorn-whip',
    roleLabel: 'Thorn Whip Merchant',
    costHearts: 100,
    priceSource: 'ROM sale table at file offset $1ED3D: $5B $01 $00.'
  },
  dagger: {
    itemId: 'dagger',
    roleLabel: 'Dagger Merchant',
    costHearts: 50,
    priceSource: 'ROM sale table at file offset $1ED31: $54 $00 $50.'
  },
  'chain-whip': {
    itemId: 'chain-whip',
    roleLabel: 'Chain Whip Merchant',
    costHearts: 150,
    priceSource: 'ROM sale table at file offset $1ED40: $5B $01 $50.'
  },
  'morning-star': {
    itemId: 'morning-star',
    roleLabel: 'Morning Star Merchant',
    costHearts: 200,
    priceSource: 'ROM sale table at file offset $1ED43: $5B $02 $00.'
  },
  'holy-water': {
    itemId: 'holy-water',
    roleLabel: 'Holy Water Merchant',
    costHearts: 50,
    priceSource: 'ROM sale table at file offset $1ED2E: $57 $00 $50.'
  },
  garlic: {
    itemId: 'garlic',
    roleLabel: 'Garlic Merchant',
    costHearts: 50,
    priceSource: 'ROM sale table at file offset $1ED2B: $6D $00 $50.'
  },
  laurels: {
    itemId: 'laurels',
    roleLabel: 'Laurels Merchant',
    costHearts: 50,
    priceSource: 'ROM sale table at file offset $1ED25: $58 $00 $50.'
  }
};

const GUIDE_ITEM_ICONS = {
  heart: {
    id: 'heart',
    label: 'Heart',
    iconTile: 0x61,
    evidence: [
      'Start-menu PPU capture out/captures/game-menu-jova-woods-start shows the heart currency glyph at tile $61 with background palette slot 3.'
    ]
  }
};

function publicGuideItem(item) {
  return {
    ...item,
    iconTile: hex(item.iconTile, 2)
  };
}

function publicItemOffer(offer) {
  if (!offer) {
    return null;
  }
  const item = GUIDE_ITEMS[offer.itemId];
  if (!item) {
    throw new Error(`Unknown guide item offer ${offer.itemId}`);
  }
  return {
    itemId: item.id,
    itemLabel: item.label,
    iconTile: hex(item.iconTile, 2),
    roleLabel: offer.roleLabel,
    costHearts: offer.costHearts,
    costLabel: offer.costLabel,
    priceSource: offer.priceSource,
    manualText: item.manualText,
    manualSource: item.manualSource,
    evidence: item.evidence
  };
}

function publicItemReward(reward) {
  if (!reward) {
    return null;
  }
  const itemId = typeof reward === 'string' ? reward : reward.itemId;
  const item = GUIDE_ITEMS[itemId];
  if (!item) {
    throw new Error(`Unknown guide item reward ${itemId}`);
  }
  return {
    itemId: item.id,
    itemLabel: item.label,
    iconTile: hex(item.iconTile, 2),
    manualText: item.manualText,
    manualSource: item.manualSource,
    evidence: [
      ...(item.evidence || []),
      ...(
        typeof reward === 'object' && reward.evidence
          ? [reward.evidence]
          : []
      )
    ]
  };
}

function publicItemRewards(rewards) {
  if (!Array.isArray(rewards)) {
    return [];
  }
  const seen = new Set();
  const out = [];
  for (const reward of rewards) {
    const publicReward = publicItemReward(reward);
    if (!publicReward || seen.has(publicReward.itemId)) {
      continue;
    }
    seen.add(publicReward.itemId);
    out.push(publicReward);
  }
  return out;
}

function crystalItemTypeForManifestRow(row) {
  if (row.id !== 0xaf) {
    return null;
  }
  if (row.data === 0x03) {
    return 'blueCrystal';
  }
  if (row.data === 0x04) {
    return 'redCrystal';
  }
  if (row.data === 0x05) {
    return 'flameWhip';
  }
  if (row.data === 0x01) {
    return 'laurelsLaruba';
  }
  return null;
}

function inferredItemOffer(actor) {
  if (actor.itemOffer) {
    return publicItemOffer(actor.itemOffer);
  }
  if (
    actor.classId === 'oak-stake-merchant'
    || actor.itemType === 'oakRib'
    || actor.itemType === 'oakHeart'
    || actor.itemType === 'oakNail'
    || actor.itemType === 'oakRing'
    || actor.itemType === 'oakStake'
  ) {
    return publicItemOffer(GUIDE_ITEM_OFFERS['oak-stake']);
  }
  if (actor.classId === 'blue-crystal-merchant' || actor.itemType === 'blueCrystal') {
    return publicItemOffer(GUIDE_ITEM_OFFERS['blue-crystal']);
  }
  if (actor.itemType === 'redCrystal') {
    return publicItemOffer(GUIDE_ITEM_OFFERS['red-crystal']);
  }
  if (actor.itemType === 'whiteCrystal') {
    return publicItemOffer(GUIDE_ITEM_OFFERS['white-crystal']);
  }
  if (actor.itemType === 'thorn') {
    return publicItemOffer(GUIDE_ITEM_OFFERS['thorn-whip']);
  }
  if (actor.itemType === 'dagger') {
    return publicItemOffer(GUIDE_ITEM_OFFERS.dagger);
  }
  if (actor.itemType === 'chain') {
    return publicItemOffer(GUIDE_ITEM_OFFERS['chain-whip']);
  }
  if (actor.itemType === 'morningStar') {
    return publicItemOffer(GUIDE_ITEM_OFFERS['morning-star']);
  }
  if (actor.itemType === 'holyWater') {
    return publicItemOffer(GUIDE_ITEM_OFFERS['holy-water']);
  }
  if (actor.itemType === 'garlicAljiba' || actor.itemType === 'garlicAlba') {
    return publicItemOffer(GUIDE_ITEM_OFFERS.garlic);
  }
  if (
    actor.itemType === 'laurelsAljiba'
    || actor.itemType === 'laurelsAlba'
    || actor.itemType === 'laurelsOndol'
    || actor.itemType === 'laurelsDoina'
  ) {
    return publicItemOffer(GUIDE_ITEM_OFFERS.laurels);
  }
  return null;
}

function buildItemIconManifest(addChrSet) {
  const chrSet = addChrSet(MENU_ITEM_ICON_CHR_BANKS);
  return {
    chrSet: chrSet.id,
    palette: MENU_ITEM_ICON_PALETTE,
    source: {
      capture: 'out/captures/game-menu-jova-woods-start',
      manual: 'https://www.nintendo.co.jp/clv/manuals/en/pdf/CLV-P-NABXE.pdf',
      saleTable: 'rom-file:0x1ED25'
    },
    items: Object.fromEntries(Object.entries(GUIDE_ITEMS).map(([id, item]) => [id, publicGuideItem(item)])),
    icons: Object.fromEntries(Object.entries(GUIDE_ITEM_ICONS).map(([id, icon]) => [id, publicGuideItem(icon)]))
  };
}

const SIMON_SPAWN_CLASS_ID = 'simon-belmont';
const SIMON_GUIDE_DIALOG = {
  tone: 'guide-authored',
  text: "Simon Belmont\n----------\nOn a quest to uncover Count Dracula's five missing body parts.",
  source: 'Nintendo Castlevania II: Simon\'s Quest instruction manual, Basic Play, page 3.'
};

function simonSpawn({
  id,
  segmentId,
  variants = ['day'],
  paletteByVariant,
  pixelX,
  pixelY,
  flipHorizontal = true,
  evidence
}) {
  return {
    id,
    classId: SIMON_SPAWN_CLASS_ID,
    label: 'Simon Belmont',
    kind: 'player',
    segmentId,
    variants,
    paletteByVariant,
    placement: { pixelX, pixelY },
    flipHorizontal,
    guideDialog: SIMON_GUIDE_DIALOG,
    provenance: {
      source: 'rom-runtime-spawn-evidence',
      evidence
    }
  };
}

const GUIDE_SIMON_SPAWNS = [
  simonSpawn({
    id: 'overworld-simon-start',
    segmentId: 'town-of-jova',
    variants: ['day', 'night'],
    paletteByVariant: { day: 'town-day-sprites', night: 'town-night-sprites' },
    pixelX: 128,
    pixelY: 177,
    flipHorizontal: false,
    evidence: [
      'Start-flow capture out/captures/jova-day is generated from the ROM and shows Simon using selector $04 at raw OAM x=120/128 and y=128/144.',
      'The PPU renderer draws OAM Y as raw+1; selector $04 offsets x=-8/0 and y=-15/1 place the rendered screen anchor at (128,144).',
      'The ROM-derived guide background matches the Jova capture at guideY=captureY+33, so the guide-space anchor is (128,177).'
    ]
  }),
  simonSpawn({
    id: 'berkeley-mansion-simon-spawn',
    segmentId: 'berkeley-mansion-part-1',
    variants: ['fixed'],
    paletteByVariant: { fixed: 'mansion-fixed-sprites' },
    pixelX: 16,
    pixelY: 625,
    evidence: [
      'The mansion entry routine indexes $F7A6 by area-$06; Berkeley area $07 reads byte $02, placing the initial camera on the third 224 px vertical screen.',
      'Berkeley entry OAM captures show selector $04 at raw OAM x=8/16 and y=174/190; rendered screen anchor is (16,190).',
      'The ROM-derived guide background matches the Berkeley capture at guideY=captureY+435, so the full-map guide-space anchor is (16,625).'
    ]
  }),
  simonSpawn({
    id: 'jova-church-simon-spawn',
    segmentId: 'jova-church',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry transition probes set Simon at raw OAM x=8/16 and y=174/190 after entering the room.',
      'The PPU renderer draws OAM Y as raw+1; selector $04 offsets place the standing-frame screen anchor at (16,190).',
      'The ROM-derived guide background matches the town-interior capture at guideY=captureY-13, so the guide-space anchor is (16,177).'
    ]
  }),
  simonSpawn({
    id: 'jova-thorn-whip-room-simon-spawn',
    segmentId: 'jova-thorn-whip-room',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry transition probes set Simon at raw OAM x=8/16 and y=174/190 after entering the room.',
      'The PPU renderer draws OAM Y as raw+1; selector $04 offsets place the standing-frame screen anchor at (16,190).',
      'The ROM-derived guide background matches the town-interior capture at guideY=captureY-13, so the guide-space anchor is (16,177).'
    ]
  }),
  simonSpawn({
    id: 'jova-holy-water-room-simon-spawn',
    segmentId: 'jova-holy-water-room',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry transition probes set Simon at raw OAM x=8/16 and y=174/190 after entering the room.',
      'The PPU renderer draws OAM Y as raw+1; selector $04 offsets place the standing-frame screen anchor at (16,190).',
      'The ROM-derived guide background matches the town-interior capture at guideY=captureY-13, so the guide-space anchor is (16,177).'
    ]
  }),
  simonSpawn({
    id: 'veros-dagger-room-simon-spawn',
    segmentId: 'veros-dagger-entry',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler; the Veros dagger map composes the entry submap first.',
      'Town interior entry transition probes and the rendered capture-to-guide background match place the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'veros-church-simon-spawn',
    segmentId: 'veros-church',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry transition probes set Simon at raw OAM x=8/16 and y=174/190 after entering the room.',
      'The PPU renderer draws OAM Y as raw+1; selector $04 offsets place the standing-frame screen anchor at (16,190).',
      'The ROM-derived guide background matches the town-interior capture at guideY=captureY-13, so the guide-space anchor is (16,177).'
    ]
  }),
  simonSpawn({
    id: 'veros-chain-whip-room-simon-spawn',
    segmentId: 'veros-chain-whip-room',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler, so the full guide map keeps the single Simon marker on the entry screen.',
      'Town interior entry transition probes and the rendered capture-to-guide background match place the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'aljiba-garlic-room-simon-spawn',
    segmentId: 'aljiba-garlic-room',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler.',
      'The shared town-interior transition evidence places the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'aljiba-book-old-lady-room-simon-spawn',
    segmentId: 'aljiba-book-entry',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler; the Aljiba book/old-lady map composes the entry submap first.',
      'The shared town-interior transition evidence places the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'aljiba-laurels-room-simon-spawn',
    segmentId: 'aljiba-laurels-entry',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler; the Aljiba laurels map composes the entry submap first.',
      'The shared town-interior transition evidence places the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'alba-garlic-room-simon-spawn',
    segmentId: 'alba-garlic-entry',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler; the Alba garlic map composes the entry submap first.',
      'The shared town-interior transition evidence places the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'alba-church-simon-spawn',
    segmentId: 'alba-church',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry transition probes set Simon at raw OAM x=8/16 and y=174/190 after entering the shared church room.',
      'The PPU renderer draws OAM Y as raw+1; selector $04 offsets place the standing-frame guide-space anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'alba-laurels-room-simon-spawn',
    segmentId: 'alba-laurels-entry',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler; the Alba laurels map composes the entry submap first.',
      'The shared town-interior transition evidence places the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'ondol-morning-star-room-simon-spawn',
    segmentId: 'ondol-morning-star-entry',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler; the Ondol Morning Star map composes the entry submap first.',
      'The shared town-interior transition evidence places the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'ondol-death-star-lady-room-simon-spawn',
    segmentId: 'ondol-death-star-lady-room',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry transition evidence places the standing-frame guide-space selector anchor at (16,177) for shared town-interior room entries.'
    ]
  }),
  simonSpawn({
    id: 'ondol-laurels-room-simon-spawn',
    segmentId: 'ondol-laurels-entry-1',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler; the Ondol Laurels map composes the first empty room as the entry submap.',
      'The shared town-interior transition evidence places the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'doina-get-back-lady-room-simon-spawn',
    segmentId: 'doina-get-back-lady-room',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry transition evidence places the standing-frame guide-space selector anchor at (16,177) for shared town-interior room entries.'
    ]
  }),
  simonSpawn({
    id: 'doina-laurels-room-simon-spawn',
    segmentId: 'doina-laurels-room',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry code zeroes the interior camera state before jumping to the entry handler.',
      'The shared town-interior transition evidence places the standing-frame guide-space selector anchor at (16,177).'
    ]
  }),
  simonSpawn({
    id: 'yomi-empty-room-simon-spawn',
    segmentId: 'yomi-empty-room',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry transition evidence places the standing-frame guide-space selector anchor at (16,177) for shared town-interior room entries.'
    ]
  }),
  simonSpawn({
    id: 'yomi-girlfriend-room-simon-spawn',
    segmentId: 'yomi-girlfriend-room',
    paletteByVariant: { day: 'town-day-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'Town interior entry transition evidence places the standing-frame guide-space selector anchor at (16,177) for shared town-interior room entries.'
    ]
  }),
  simonSpawn({
    id: 'lauber-mansion-simon-spawn',
    segmentId: 'lauber-mansion-part-1',
    variants: ['fixed'],
    paletteByVariant: { fixed: 'lauber-mansion-fixed-sprites' },
    pixelX: 16,
    pixelY: 625,
    evidence: [
      'Mansion entry transition code uses the same left-edge standing-frame entry anchor family as Berkeley Mansion.',
      'Lauber Part 1 is rendered in the same full-height mansion guide-space convention as Berkeley, so the entry marker is placed at the left edge of the lower entry floor.'
    ]
  }),
  simonSpawn({
    id: 'laruba-mansion-simon-spawn',
    segmentId: 'laruba-mansion-part-1',
    variants: ['fixed'],
    paletteByVariant: { fixed: 'laruba-mansion-fixed-sprites' },
    pixelX: 16,
    pixelY: 401,
    evidence: [
      'The mansion entry routine indexes fixed-bank table 7:$F7A6 by area-$06; Laruba area $06 reads byte $01, placing the initial camera on the second 224 px vertical screen.',
      'The shared mansion entry standing-frame screen anchor is (16,190), so the segment-local guide-space anchor is (16,401).'
    ]
  }),
  simonSpawn({
    id: 'brahm-mansion-simon-spawn',
    segmentId: 'brahm-mansion-part-1',
    variants: ['fixed'],
    paletteByVariant: { fixed: 'brahm-mansion-fixed-sprites' },
    pixelX: 16,
    pixelY: 849,
    evidence: [
      'The mansion entry routine indexes fixed-bank table 7:$F7A6 by area-$06; Brahm area $09 reads byte $03, placing the initial camera on the fourth 224 px vertical screen.',
      'The shared mansion entry standing-frame screen anchor is (16,190), so the full-map guide-space anchor is (16,849).'
    ]
  }),
  simonSpawn({
    id: 'bodley-mansion-simon-spawn',
    segmentId: 'bodley-mansion-part-1',
    variants: ['fixed'],
    paletteByVariant: { fixed: 'bodley-mansion-fixed-sprites' },
    pixelX: 16,
    pixelY: 625,
    evidence: [
      'The mansion entry routine indexes fixed-bank table 7:$F7A6 by area-$06; Bodley area $0A reads byte $02, placing the initial camera on the third 224 px vertical screen.',
      'The shared mansion entry standing-frame screen anchor is (16,190), so the full-map guide-space anchor is (16,625).'
    ]
  }),
  simonSpawn({
    id: 'castlevania-main-simon-spawn',
    segmentId: 'castlevania-main',
    variants: ['fixed'],
    paletteByVariant: { fixed: 'castlevania-final-sprites' },
    pixelX: 16,
    pixelY: 177,
    evidence: [
      'The bridge-to-Castlevania transition probe reaches runtime context 05/00/00 and OAM shows the left-edge standing frame at raw x=8/16 and y=174/190.',
      'The Castlevania final-area entry is the top screen of obj05 area00 sub00, so the shared guide-space standing-frame anchor is (16,177).'
    ]
  })
];

const DENIS_ALJIBA_WOODS_PALETTE_BY_VARIANT = {
  day: 'denis-aljiba-woods-day-sprites',
  night: 'denis-aljiba-woods-night-sprites'
};

const GUIDE_ACTOR_PALETTE_BY_SEGMENT = {
  'aljiba-woods-part-1': DENIS_ALJIBA_WOODS_PALETTE_BY_VARIANT,
  'aljiba-woods-part-2': DENIS_ALJIBA_WOODS_PALETTE_BY_VARIANT,
  'aljiba-woods-part-3': DENIS_ALJIBA_WOODS_PALETTE_BY_VARIANT,
  'denis-woods-part-2': DENIS_ALJIBA_WOODS_PALETTE_BY_VARIANT,
  'denis-woods-part-3': DENIS_ALJIBA_WOODS_PALETTE_BY_VARIANT
};

function paletteByVariantForGuideActor(actor) {
  return GUIDE_ACTOR_PALETTE_BY_SEGMENT[actor.segmentId] || actor.paletteByVariant || {};
}

const GUIDE_ACTORS = [
  {
    id: 'castlevania-dracula-fight-dracula',
    classId: 'dracula',
    segmentId: 'castlevania-dracula-fight',
    actorId: 0x47,
    data: 0xf0,
    variants: ['fixed'],
    paletteByVariant: { fixed: 'castlevania-final-sprites' },
    placement: {
      pixelX: 128,
      pixelY: 110,
      source: 'Guide-authored final-room preview anchor, matching the centered overworld Castlevania Dracula preview while using ROM selector $33.'
    },
    hp: { day: 240, night: 240 },
    hpEvidence: {
      policy: 'fixed-special-boss-hp',
      baseHp: 0xf0,
      rowData: '0xF0',
      source: 'rom-final-room-special-boss-initializer',
      rule: 'Dracula is not emitted from a normal room actor row. The final-room spawn routine initializes actor slot X=$06 directly: bank 1:$B4FA stores actor id $47 at $03B4+$06, and bank 1:$B5B9-$B5BE stores #$F0 into HP RAM $04C2+$06 ($04C8).',
      slot: '0x06',
      rom: 'Dracula final-room initializer at bank 1:$B4FA-$B5BE; shared damage/death checks for actor id $47 at bank 1:$8926 and 1:$8A69.'
    }
  },
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
  { id: 'jova-merchant-50f8', classId: 'jova-merchant', segmentId: 'town-of-jova', offset: 0x50f8, bytes: [0x34, 0x12, 0xae, 0x07], variants: ['day'], text: 'buy a white crystal?', paletteByVariant: { day: 'town-day-sprites' }, itemOffer: GUIDE_ITEM_OFFERS['white-crystal'] },
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
  { id: 'veros-crow-522e', classId: 'crow', segmentId: 'town-of-veros', offset: 0x522e, bytes: [0x04, 0x08, 0x01, 0x02], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },
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
  { id: 'veros-crow-525a', classId: 'crow', segmentId: 'town-of-veros', offset: 0x525a, bytes: [0x34, 0x0c, 0x01, 0x02], variants: ['night'], paletteByVariant: { night: 'town-night-sprites' } },

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
  { id: 'dabis-2-zigzag-bat-66b8', classId: 'zigzag-bat', segmentId: 'dabis-path-part-2', offset: 0x66b8, bytes: [0x04, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-eyeball-66bc', classId: 'eyeball', segmentId: 'dabis-path-part-2', offset: 0x66bc, bytes: [0x0c, 0x06, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-zigzag-bat-66c0', classId: 'zigzag-bat', segmentId: 'dabis-path-part-2', offset: 0x66c0, bytes: [0x0c, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-eyeball-66c4', classId: 'eyeball', segmentId: 'dabis-path-part-2', offset: 0x66c4, bytes: [0x14, 0x06, 0x08, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-zigzag-bat-66c8', classId: 'zigzag-bat', segmentId: 'dabis-path-part-2', offset: 0x66c8, bytes: [0x14, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },
  { id: 'dabis-2-zigzag-bat-66cc', classId: 'zigzag-bat', segmentId: 'dabis-path-part-2', offset: 0x66cc, bytes: [0x1c, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'dabis-path-day-sprites', night: 'dabis-path-night-sprites' } },

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
  { id: 'denis-2-zigzag-bat-6713', classId: 'zigzag-bat', segmentId: 'denis-woods-part-2', offset: 0x6713, bytes: [0x16, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-6717', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x6717, bytes: [0x18, 0x06, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-671f', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x671f, bytes: [0x24, 0x06, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-6727', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x6727, bytes: [0x28, 0x08, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-skeleton-672b', classId: 'skeleton', segmentId: 'denis-woods-part-2', offset: 0x672b, bytes: [0x2c, 0x08, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-2-zigzag-bat-672f', classId: 'zigzag-bat', segmentId: 'denis-woods-part-2', offset: 0x672f, bytes: [0x2d, 0x0c, 0x09, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },

  { id: 'denis-3-spider-6734', classId: 'spider', segmentId: 'denis-woods-part-3', offset: 0x6734, bytes: [0x04, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-3-skeleton-6738', classId: 'skeleton', segmentId: 'denis-woods-part-3', offset: 0x6738, bytes: [0x08, 0x0c, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-3-spider-673c', classId: 'spider', segmentId: 'denis-woods-part-3', offset: 0x673c, bytes: [0x0c, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-3-spider-6740', classId: 'spider', segmentId: 'denis-woods-part-3', offset: 0x6740, bytes: [0x14, 0x06, 0x0e, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } },
  { id: 'denis-3-skeleton-6744', classId: 'skeleton', segmentId: 'denis-woods-part-3', offset: 0x6744, bytes: [0x18, 0x0a, 0x03, 0x02], variants: ['day', 'night'], paletteByVariant: { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' } }
];

function contextFromLocationId(locationId) {
  const match = String(locationId || '').match(/^obj([0-9a-f]{2})-area([0-9a-f]{2})-sub([0-9a-f]{2})/i);
  if (!match) {
    return null;
  }
  return {
    objset: Number.parseInt(match[1], 16),
    area: Number.parseInt(match[2], 16),
    submap: Number.parseInt(match[3], 16)
  };
}

function slugForId(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function materializeManifestActors(sliceConfig, rom) {
  const config = sliceConfig.actorMaterialization;
  if (!config || config.source !== 'manifest-location-actors') {
    return [];
  }

  const manifest = buildManifest();
  const locationsByContext = new Map(manifest.locations.map((location) => [
    [location.objset, location.area, location.submap || 0].join(':'),
    location
  ]));
  const actors = [];

  function classIdForManifestRow(context, row) {
    if (context.objset === 0 && context.area >= 0x07) {
      return TOWN_INTERIOR_ACTOR_CLASS_BY_ID.get(row.id);
    }
    if (context.objset === 0) {
      if (row.id === 0xaf && row.data === 0x04) {
        return 'red-crystal-merchant';
      }
      return TOWN_EXTERIOR_ACTOR_CLASS_BY_ID.get(row.id);
    }
    if (context.objset === 1) {
      if (row.id === 0x25) {
        return mansionOrbClassIdForData(row.data);
      }
      return MANSION_ACTOR_CLASS_BY_ID.get(row.id);
    }
    if (context.objset === 2) {
      if (row.id === 0xbc) {
        return row.data === 0x00 ? 'ferry-man-boat-right' : 'ferry-man-boat-left';
      }
      return OUTDOOR_OBJSET2_ACTOR_CLASS_BY_ID.get(row.id);
    }
    if (context.objset === 3 && context.area === 0x00 && context.submap === 0x00) {
      return CAMILLA_CEMETERY_ACTOR_CLASS_BY_ID.get(row.id);
    }
    if (context.objset === 3) {
      return OUTDOOR_OBJSET3_ACTOR_CLASS_BY_ID.get(row.id);
    }
    if (context.objset === 4) {
      return OUTDOOR_OBJSET4_ACTOR_CLASS_BY_ID.get(row.id);
    }
    return null;
  }

  function kindForManifestRow(context, row) {
    if (row.id === 0x27) {
      return 'secret';
    }
    if (context.objset === 3 && context.area === 0x00 && context.submap === 0x00 && row.id === 0x9e) {
      return 'secret';
    }
    if (context.objset === 3 && context.area === 0x01 && context.submap === 0x00 && row.id === 0x9e) {
      return 'secret';
    }
    if (context.objset === 1 && BERKELEY_SECRET_ACTOR_IDS.has(row.id)) {
      return 'secret';
    }
    return row.kind === 'enemy'
      ? 'enemy'
      : (row.kind === 'npc' ? 'npc' : 'fixture');
  }

  function variantsForManifestRow(context, row, segment) {
    if (context.objset === 0 && context.area < 0x07) {
      if (row.id === 0xa4) {
        return ['day', 'night'];
      }
      if (row.kind === 'enemy') {
        return ['night'];
      }
      return ['day'];
    }
    if (context.objset === 2 || context.objset === 3 || context.objset === 4) {
      return ['day', 'night'];
    }
    if (context.objset === 1) {
      return ['fixed'];
    }
    return segment.variants || ['fixed'];
  }

  function paletteByVariantForManifestRow(context, row, segment) {
    if (config.paletteByVariant) {
      return config.paletteByVariant;
    }
    if (segment.paletteByVariant) {
      return segment.paletteByVariant;
    }
    if (context.objset === 0) {
      return { day: 'town-day-sprites', night: 'town-night-sprites' };
    }
    if (context.objset === 1) {
      return { fixed: 'mansion-fixed-sprites' };
    }
    if (context.objset === 2) {
      return { day: 'denis-woods-day-sprites', night: 'denis-woods-night-sprites' };
    }
    if (context.objset === 3 && context.area === 0x00 && context.submap === 0x00) {
      return { day: 'camilla-cemetery-day-sprites', night: 'camilla-cemetery-night-sprites' };
    }
    if (context.objset === 3) {
      return { day: 'sadam-woods-day-sprites', night: 'sadam-woods-night-sprites' };
    }
    if (context.objset === 4) {
      return { day: 'deborah-cliff-day-sprites', night: 'deborah-cliff-night-sprites' };
    }
    return segment.paletteByVariant || {};
  }

  function labelForManifestRow(row, kind) {
    if (kind === 'enemy') {
      return null;
    }
    if (row.id === 0xa4) {
      return row.name ? `${row.name[0].toUpperCase()}${row.name.slice(1)}` : 'Sign';
    }
    if (row.id === 0xaf) {
      if (row.data === 0x00) {
        return 'Old Gypsy';
      }
      return TOWN_INTERIOR_ACTOR_LABEL_BY_ITEM_TYPE.get(crystalItemTypeForManifestRow(row)) || 'Crystal Merchant';
    }
    if (row.id === 0xac) {
      return 'Old Lady';
    }
    if (row.id === 0xad) {
      return 'Priest';
    }
    if (row.id === 0xae && row.itemType) {
      return TOWN_INTERIOR_ACTOR_LABEL_BY_ITEM_TYPE.get(row.itemType) || 'Merchant';
    }
    if (row.id === 0x27) {
      return 'Hidden clue book';
    }
    if (row.id === 0x9e) {
      return 'Secret Merchant';
    }
    if (row.id === 0x1f) {
      return 'Slimey BarSinister';
    }
    if (row.id === 0x25) {
      return mansionOrbLabelForData(row.data);
    }
    if (row.id === 0xbc) {
      return 'Ferry Man';
    }
    return row.name || null;
  }

  function guideDialogForManifestRow(row) {
    if (row.id === 0xaf && row.data === 0x00) {
      return {
        text: 'Old Gypsy\n----------\nGives Simon the Diamond.',
        tone: 'guide-authored',
        source: 'guide-authored-vrad-diamond-reward-summary'
      };
    }
    if (row.id === 0xaf && row.data === 0x01) {
      return {
        text: 'Laurels Giver\n----------\nGives Simon the Laurels.',
        tone: 'guide-authored',
        source: 'guide-authored-laruba-laurels-reward-summary; ROM row $05A65 uses text pointer $DCE2, and reward code at ROM file $0535B sets RAM $92 bit $04.'
      };
    }
    if (row.id === 0xaf && row.data === 0x05) {
      return {
        text: "Flame Whip Merchant\n----------\nUpgrades Simon's Morning Star into The Flame Whip. Simon must have the Morning Star first.",
        tone: 'guide-authored',
        source: 'guide-authored-flame-whip-upgrade-summary; ROM file $04C86 checks RAM $0434 == $03 before promoting whip tier $04, otherwise text pointer index $75 is shown.'
      };
    }
    if (row.id === 0xad) {
      return {
        text: "Priest\n----------\nRefills Simon's health meter to full health.",
        tone: 'guide-authored',
        source: 'guide-authored-priest-service-summary'
      };
    }
    return null;
  }

  function isBodleyFallingRockRow(context, row) {
    return context.objset === 0x01
      && context.area === 0x0a
      && context.submap === 0x00
      && row.id === 0x3e
      && row.data === 0x00;
  }

  function isDeadRiverSecretRouteFerry(context, row) {
    return row.id === 0xbc
      && context.objset === 0x02
      && context.area === 0x07
      && (context.submap & 0x01) !== 0;
  }

  function romDialogVariantsForManifestRow(context, row) {
    if (!isDeadRiverSecretRouteFerry(context, row)) {
      return null;
    }
    return [
      {
        label: 'Default ferry dialog',
        guideLine: 'Default ferry dialog is shown normally.',
        condition: 'Selected item RAM $4F is not Dracula\'s Heart, or the ferry is not on Dead River Part 1.',
        textPointerIndex: FERRY_DEFAULT_TEXT_POINTER_INDEX,
        source: 'fixed-bank-ferry-interaction-branch:$C6EE-$C70C'
      },
      {
        label: "Dracula's Heart selected",
        guideLine: "With Dracula's Heart selected.",
        condition: "Selected item RAM $4F == $02, area RAM $50 == $07, and submap RAM $51 & $01 is nonzero.",
        effect: 'Stores $01 to RAM $04EC; the ferry handler consumes it and changes area RAM $50 to $06 for the Brahm route.',
        textPointerIndex: FERRY_SECRET_ROUTE_TEXT_POINTER_INDEX,
        source: 'fixed-bank-ferry-interaction-branch:$C6EE-$C70C'
      }
    ];
  }

  function fixtureSignatureForManifestRow(row) {
    if (row.id === 0xa4) {
      return 'townSign';
    }
    return null;
  }

  function actorShouldFaceRightInWestRoute(segment, kind, classId) {
    if (!Number.isFinite(segment.x) || segment.x >= 0) {
      return false;
    }
    if (typeof classId === 'string' && classId.startsWith('ferry-man-')) {
      return false;
    }
    return kind === 'enemy'
      || kind === 'npc'
      || classId === 'secret-merchant';
  }

  for (const segment of sliceConfig.segments || []) {
    if (Array.isArray(config.includeSegmentIds) && !config.includeSegmentIds.includes(segment.id)) {
      continue;
    }
    const context = contextFromLocationId(segment.locationId);
    if (!context) {
      throw new Error(`Cannot materialize actors for ${segment.id}: unsupported locationId ${segment.locationId}`);
    }
    const location = locationsByContext.get([context.objset, context.area, context.submap].join(':'));
    if (!location) {
      throw new Error(`Cannot materialize actors for ${segment.id}: no manifest location for ${segment.locationId}`);
    }

    for (const row of location.actors || []) {
      if (context.objset === 3 && context.area === 0x00 && context.submap === 0x00 && row.id === 0x9e) {
        continue;
      }
      if (isBodleyFallingRockRow(context, row)) {
        continue;
      }
      const rowBytes = Number.isInteger(row.pointer)
        ? Array.from(rom.subarray(row.pointer, row.pointer + 4))
        : [row.x, row.y, row.id, row.data];
      if (rowBytes.length !== 4) {
        throw new Error(`Cannot read raw actor bytes for ${location.name} row ${row.pointerHex}`);
      }
      const classId = classIdForManifestRow(context, row);
      if (!classId && row.id !== 0xa4) {
        throw new Error(`No guide actor class for ${location.name} row ${row.pointerHex} actor ${row.idHex}`);
      }
      const kind = kindForManifestRow(context, row);
      const label = labelForManifestRow(row, kind);
      const slugName = label || classId || `actor-${row.idHex}`;
      const rowItemType = row.id === 0xaf
        ? (row.data === 0x00 ? 'diamond' : crystalItemTypeForManifestRow(row))
        : row.itemType;
      let rowItemReward;
      if (row.id === 0xaf && row.data === 0x00) {
        rowItemReward = {
          itemId: 'diamond',
          evidence: "Vrad Mountain row $0684F uses actor id $AF/data $00 and text pointer $CF38, whose decoded game text says \"i'll give you a diamond.\""
        };
      } else if (row.id === 0xaf && row.data === 0x01) {
        rowItemReward = {
          itemId: 'laurels',
          evidence: 'Laruba Mansion row $05A65 uses actor id $AF/data $01 and text pointer $DCE2, whose decoded ROM text says "i beg of you to take these laurels." The reward code is annotated at ROM file $0535B.'
        };
      } else if (row.id === 0xaf && row.data === 0x05) {
        rowItemReward = {
          itemId: 'flame-whip',
          evidence: "Debious Woods row $072B1 uses actor id $AF/data $05 and text pointer $CE89, whose decoded game text says \"i'll give your morning star power to burn away evil.\" The reward routine at ROM file offset $04C86 checks RAM $0434 == $03 and increments it to whip tier $04."
        };
      } else if (row.id === 0x9e && segment.id === 'storigoi-graveyard') {
        rowItemReward = {
          itemId: 'silk-bag',
          evidence: 'Storigoi Graveyard row $06F88 uses text pointer $CEBE, whose decoded ROM dialog gives Simon a Silk Bag; the reward routine at ROM file $06E17 sets RAM $92 bit 0.'
        };
      } else if (context.objset === 1 && context.area === 0x09 && row.id === 0x44 && row.holdsItem) {
        rowItemReward = {
          itemId: 'golden-knife',
          evidence: 'Brahm Mansion Death row $05CDE has holdsItem set in the ROM manifest and text pointer $0DCC0 decodes to "you now possess the golden knife."'
        };
      } else if (context.objset === 1 && context.area === 0x06 && row.id === 0x42 && row.holdsItem) {
        rowItemReward = {
          itemId: 'magic-cross',
          evidence: 'Laruba Mansion Camilla row $05AC6 has holdsItem set in the ROM manifest and text pointer $D1D7, whose decoded ROM dialog gives Simon the Magic Cross.'
        };
      } else if (context.objset === 1 && row.id === 0x25 && row.data === 0x1b && row.holdsItem) {
        rowItemReward = {
          itemId: 'dracula-nail',
          evidence: 'Bodley Mansion orb row $05FAB has holdsItem set in the ROM manifest and text/data $1B, selecting Dracula\'s Nail.'
        };
      } else if (context.objset === 1 && row.id === 0x25 && row.data === 0x1c && row.holdsItem) {
        rowItemReward = {
          itemId: 'dracula-ring',
          evidence: 'Laruba Mansion orb row $05ACB has holdsItem set in the ROM manifest and text/data $1C, selecting Dracula\'s Ring.'
        };
      }
      const variants = variantsForManifestRow(context, row, segment);
      const hpRecord = kind === 'enemy'
        ? enemyHpRecordForManifestRow(context, rowBytes, variants)
        : null;
      const textPointerIndex = row.id === 0xbc
        ? FERRY_DEFAULT_TEXT_POINTER_INDEX
        : (row.textPointer != null ? rowBytes[3] : undefined);
      actors.push({
        id: `${segment.id}-${slugForId(slugName)}-${Number(row.pointer).toString(16)}`,
        classId,
        label,
        kind,
        segmentId: segment.id,
        offset: row.pointer,
        bytes: rowBytes,
        variants,
        hp: hpRecord?.hp,
        hpEvidence: hpRecord?.evidence,
        paletteByVariant: paletteByVariantForManifestRow(context, row, segment),
        textFromRom: kind !== 'enemy',
        textPointerIndex,
        textFileOffset: row.id === 0xbc ? undefined : row.textPointer,
        romDialogVariants: romDialogVariantsForManifestRow(context, row),
        guideDialog: guideDialogForManifestRow(row),
        fixtureSignature: fixtureSignatureForManifestRow(row),
        itemType: rowItemType,
        inventoryItem: row.holdsItem ? rowItemType : undefined,
        itemReward: rowItemReward,
        flipHorizontal: actorShouldFaceRightInWestRoute(segment, kind, classId)
      });
    }
  }

  return actors;
}

function bareLocationIdFromContext(context) {
  return [
    `obj${Number(context.objset).toString(16).padStart(2, '0')}`,
    `area${Number(context.area).toString(16).padStart(2, '0')}`,
    `sub${Number(context.submap || 0).toString(16).padStart(2, '0')}`
  ].join('-');
}

function bareLocationIdFromLocation(location) {
  return bareLocationIdFromContext({
    objset: location.objset,
    area: location.area,
    submap: location.submap || 0
  });
}

function doorTargetViewRecord(targetViews, targetId) {
  const record = targetViews?.[targetId];
  if (!record) {
    return null;
  }
  return typeof record === 'string'
    ? { viewId: record }
    : record;
}

function tileRectFromSignatureRect(signature, rect) {
  const inset = signature.hitboxInsetTiles || { x: 0, y: 0, width: 0, height: 0 };
  return {
    x: rect.x + inset.x,
    y: rect.y + inset.y,
    width: rect.width + inset.width,
    height: rect.height + inset.height
  };
}

function sourceDoorsForLocation(location) {
  if (Array.isArray(location.doors)) {
    return location.doors;
  }
  return location.doors?.data || [];
}

function buildDoorHotspots(sliceConfig, segments, segmentTilemapsById) {
  const config = sliceConfig.doorHotspotMaterialization;
  if (!config || config.source !== 'manifest-location-doors') {
    return [];
  }

  const manifest = buildManifest();
  const locationsByContext = new Map(manifest.locations.map((location) => [
    [location.objset, location.area, location.submap || 0].join(':'),
    location
  ]));
  const policies = config.segmentPolicies || {};
  const targetViews = config.targetViews || {};
  const hotspots = [];
  const segmentById = new Map(segments.map((segment) => [segment.id, segment]));

  for (const segment of segments) {
    const policy = policies[segment.id];
    if (!policy) {
      continue;
    }
    const context = contextFromLocationId(segment.locationId);
    if (!context) {
      throw new Error(`Cannot materialize door hotspots for ${segment.id}: unsupported locationId ${segment.locationId}`);
    }
    const location = locationsByContext.get([context.objset, context.area, context.submap].join(':'));
    if (!location) {
      throw new Error(`Cannot materialize door hotspots for ${segment.id}: no manifest location for ${segment.locationId}`);
    }
    const segmentTargetViews = {
      ...targetViews,
      ...(policy.targetViews || {})
    };
    const doors = sourceDoorsForLocation(location)
      .map((door) => ({
        ...door,
        targetId: bareLocationIdFromContext(door.target || {})
      }))
      .filter((door) => doorTargetViewRecord(segmentTargetViews, door.targetId));
    if (doors.length === 0) {
      continue;
    }

    let tileRects = [];
    let signature = null;
    if (policy.signature) {
      signature = FIXTURE_TILE_SIGNATURES[policy.signature];
      if (!signature) {
        throw new Error(`${segment.id} door policy references unknown fixture signature ${policy.signature}`);
      }
      const expandedTilemap = segmentTilemapsById.get(segment.id);
      if (!expandedTilemap) {
        throw new Error(`${segment.id} door policy requires an expanded tilemap`);
      }
      const matches = findFixtureSignatureRects(expandedTilemap, signature)
        .sort((a, b) => a.x - b.x || a.y - b.y);
      if (policy.expectedMatches != null && matches.length !== policy.expectedMatches) {
        throw new Error(`${segment.id} expected ${policy.expectedMatches} ${signature.id} matches, found ${matches.length}`);
      }
      if (matches.length < doors.length) {
        throw new Error(`${segment.id} found ${matches.length} ${signature.id} matches for ${doors.length} manifest doors`);
      }
      tileRects = matches.map((rect) => ({
        tileRect: tileRectFromSignatureRect(signature, rect),
        signatureRect: rect
      }));
    } else {
      tileRects = policy.manualTileRects || [];
    }

    for (let index = 0; index < doors.length; index += 1) {
      const door = doors[index];
      const target = doorTargetViewRecord(segmentTargetViews, door.targetId);
      const manual = tileRects.find((rect) => (
        rect.target === door.targetId ||
        (rect.pointerIndex != null && rect.pointerIndex === door.pointerIndex)
      ));
      const rectRecord = manual || tileRects[index];
      if (!rectRecord?.tileRect) {
        throw new Error(`${segment.id} has no tileRect for door ${door.name}`);
      }
      const itemRewards = publicItemRewards(target.itemRewards);
      const itemReward = publicItemReward(target.itemReward);
      if (itemReward && !itemRewards.some((reward) => reward.itemId === itemReward.itemId)) {
        itemRewards.push(itemReward);
      }

      hotspots.push({
        id: `${segment.id}-door-${slugForId(door.name || door.targetId)}`,
        type: 'door',
        kind: 'door',
        segmentId: segment.id,
        label: target.label || `Enter ${door.name || door.targetId}`,
        tileRect: rectRecord.tileRect,
        opensView: target.viewId,
        itemReward: itemRewards[0] || null,
        itemRewards,
        variants: policy.variants || segment.variants || ['day', 'night'],
        note: target.note || null,
        provenance: {
          source: signature ? 'rom-door-table-and-expanded-background-signature' : 'rom-door-table-and-authored-hitbox',
          doorName: door.name || null,
          pointerIndex: door.pointerIndex ?? null,
          sourceLocation: bareLocationIdFromLocation(location),
          targetLocation: door.targetId,
          signatureId: signature?.id || null,
          signatureRect: rectRecord.signatureRect || null,
          evidence: rectRecord.evidence || policy.evidence || null
        }
      });
    }
  }

  for (const manual of config.guideAuthoredHotspots || []) {
    if (!manual?.id) {
      throw new Error('guide-authored door hotspot requires an id');
    }
    if (!segmentById.has(manual.segmentId)) {
      throw new Error(`guide-authored door hotspot ${manual.id} references unknown segment ${manual.segmentId}`);
    }
    if (!manual.tileRect) {
      throw new Error(`guide-authored door hotspot ${manual.id} requires a tileRect`);
    }
    const itemRewards = publicItemRewards(manual.itemRewards);
    const itemReward = publicItemReward(manual.itemReward);
    if (itemReward && !itemRewards.some((reward) => reward.itemId === itemReward.itemId)) {
      itemRewards.push(itemReward);
    }
    hotspots.push({
      id: manual.id,
      type: manual.type || 'door',
      kind: manual.kind || 'door',
      segmentId: manual.segmentId,
      label: manual.label || 'Enter',
      tileRect: manual.tileRect,
      opensView: manual.opensView || null,
      itemReward: itemRewards[0] || null,
      itemRewards,
      variants: manual.variants || segmentById.get(manual.segmentId).variants || ['day', 'night'],
      note: manual.note || null,
      provenance: {
        source: 'guide-authored-door-hotspot',
        sourceSegment: manual.segmentId,
        evidence: manual.evidence || manual.provenance?.evidence || null,
        ...(manual.provenance || {})
      }
    });
  }

  return hotspots;
}

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
  if (value == null || Number.isNaN(Number(value))) {
    return null;
  }
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function dollarHex(value, width = 2) {
  if (value == null || Number.isNaN(Number(value))) {
    return null;
  }
  return `$${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
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
  const auxiliaryAddress = metadata.derivation?.tileSet?.auxiliaryAddress
    ? parseHex(metadata.derivation.tileSet.auxiliaryAddress)
    : null;
  const auxiliaryReadOpts = auxiliaryAddress == null
    ? null
    : (auxiliaryAddress < 0xc000 ? { bank: BACKGROUND_TABLE_BANK } : {});
  return {
    tileBank,
    tileSetAddress,
    tileBaseAddress,
    collisionThresholdAddress: auxiliaryAddress,
    collisionThresholds: auxiliaryAddress == null
      ? null
      : readPrgBytes(rom, info, auxiliaryAddress, 3, auxiliaryReadOpts),
    metatileTiles: readPrgBytes(rom, info, tileBaseAddress, METATILE_TILE_BYTES, { bank: tileBank }),
    metatileAttributes: readPrgBytes(rom, info, tileSetAddress + 1, METATILE_ATTRIBUTE_BYTES, { bank: tileBank })
  };
}

function paletteBits(attribute, tileRow, tileCol) {
  const quadrant = (tileRow >= 2 ? 2 : 0) + (tileCol >= 2 ? 1 : 0);
  return (attribute >> (quadrant * 2)) & 0x03;
}

function expandSegmentTilemap(layoutBlocks, metatileTiles, metatileAttributes, blockWidth, blockHeight, opts = {}) {
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
    tileHeight,
    blockWidth,
    blockHeight,
    layoutBlocks: Buffer.from(layoutBlocks),
    metatileTiles,
    metatileAttributes,
    tileSetAddress: opts.tileSetAddress,
    tileBaseAddress: opts.tileBaseAddress,
    collisionThresholdAddress: opts.collisionThresholdAddress,
    collisionThresholds: opts.collisionThresholds,
    chrPatterns: opts.chrPatterns
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

function destructibleBlockGroupsForTilemap(expandedTilemap) {
  const signature = FIXTURE_TILE_SIGNATURES.destructibleBlock2x2;
  return groupFixtureRects(findFixtureSignatureRects(expandedTilemap, signature));
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

function rectKey(rect) {
  return `${rect.x},${rect.y},${rect.width},${rect.height}`;
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

function tilePointInsideRect(point, rect) {
  return point.x >= rect.x
    && point.x < rect.x + rect.width
    && point.y >= rect.y
    && point.y < rect.y + rect.height;
}

function hiddenClueBookAnchorTile(actor) {
  return {
    x: Math.floor(actor.pixelX / TILE_SIZE),
    y: Math.floor(actor.pixelY / TILE_SIZE)
  };
}

function applyHiddenClueBookDestructibleLinks(actors, segmentTilemapsById) {
  const validations = [];
  const groupCache = new Map();

  function groupsForSegment(segmentId) {
    if (!groupCache.has(segmentId)) {
      const expandedTilemap = segmentTilemapsById.get(segmentId);
      groupCache.set(
        segmentId,
        expandedTilemap ? destructibleBlockGroupsForTilemap(expandedTilemap) : []
      );
    }
    return groupCache.get(segmentId);
  }

  for (const actor of actors) {
    if (
      actor.kind !== 'secret'
      || actor.actorId !== '0x27'
      || !actor.secret
      || actor.secret.targetTileRects?.length
    ) {
      continue;
    }

    const anchorTile = hiddenClueBookAnchorTile(actor);
    const matches = groupsForSegment(actor.segmentId)
      .filter((group) => tilePointInsideRect(anchorTile, group.rect));

    if (matches.length > 1) {
      throw new Error(
        `${actor.id} hidden clue book anchor ${anchorTile.x},${anchorTile.y} matches multiple destructible groups: `
        + matches.map((match) => rectKey(match.rect)).join('; ')
      );
    }

    if (matches.length === 0) {
      validations.push({
        type: 'hidden-clue-book-destructible-link',
        actorId: actor.id,
        segmentId: actor.segmentId,
        status: 'no-destructible-group-at-anchor',
        anchorTile,
        source: 'rom-expanded-background-tilemap'
      });
      continue;
    }

    const group = matches[0];
    actor.secret = {
      ...actor.secret,
      type: 'destructible-clue',
      action: HIDDEN_CLUE_BOOK_DESTRUCTIBLE_ACTION,
      reveal: 'The clue book appears after the marked blocks are opened. Dracula\'s Eyeball makes the hidden item visible before the blocks are broken.',
      targetTileRects: [
        {
          ...group.rect,
          signature: 'destructibleBlock2x2'
        }
      ],
      evidence: [
        ...(actor.secret.evidence || []),
        `ROM-expanded background tilemap groups destructible block signature FB FD / FC FE at tile rect ${rectKey(group.rect)} containing reveal anchor ${anchorTile.x},${anchorTile.y}.`
      ]
    };

    validations.push({
      type: 'hidden-clue-book-destructible-link',
      actorId: actor.id,
      segmentId: actor.segmentId,
      status: 'linked',
      anchorTile,
      targetTileRect: group.rect,
      matchCount: group.matchCount,
      source: 'rom-expanded-background-tilemap'
    });
  }

  return validations;
}

function metatileTileRows(metatileTiles, blockIndex, startRow = 0, rowCount = BLOCK_TILES) {
  const rows = [];
  for (let row = startRow; row < startRow + rowCount; row += 1) {
    const tiles = [];
    for (let col = 0; col < BLOCK_TILES; col += 1) {
      tiles.push(metatileTiles[blockIndex * 16 + row * BLOCK_TILES + col] || 0);
    }
    rows.push(tiles);
  }
  return rows;
}

function tilePatternEquals(patterns, tileA, tileB) {
  if (!patterns) {
    return tileA === tileB;
  }
  const startA = tileA * 16;
  const startB = tileB * 16;
  for (let offset = 0; offset < 16; offset += 1) {
    if (patterns[startA + offset] !== patterns[startB + offset]) {
      return false;
    }
  }
  return true;
}

function metatileVisualRowsMatch(expandedTilemap, signature) {
  const rect = signature.visibleTileRect;
  const candidateAttribute = expandedTilemap.metatileAttributes[signature.metatile] || 0;
  const referenceAttribute = expandedTilemap.metatileAttributes[signature.visualReferenceMetatile] || 0;

  for (let row = rect.y; row < rect.y + rect.height; row += 1) {
    for (let col = rect.x; col < rect.x + rect.width; col += 1) {
      const candidateTile = expandedTilemap.metatileTiles[signature.metatile * 16 + row * BLOCK_TILES + col] || 0;
      const referenceTile = expandedTilemap.metatileTiles[signature.visualReferenceMetatile * 16 + row * BLOCK_TILES + col] || 0;
      if (!tilePatternEquals(expandedTilemap.chrPatterns, candidateTile, referenceTile)) {
        return false;
      }
      if (paletteBits(candidateAttribute, row, col) !== paletteBits(referenceAttribute, row, col)) {
        return false;
      }
    }
  }

  return true;
}

function terrainValueForTile(tileIndex, thresholds) {
  if (!thresholds || thresholds.length < 3) {
    return null;
  }
  if (tileIndex < thresholds[0]) {
    return 0;
  }
  if (tileIndex < thresholds[1]) {
    return 3;
  }
  if (tileIndex < thresholds[2]) {
    return 2;
  }
  return 1;
}

function metatileTerrainRows(expandedTilemap, signature, blockIndex) {
  const rect = signature.visibleTileRect;
  const rows = [];
  for (let row = rect.y; row < rect.y + rect.height; row += 1) {
    const values = [];
    for (let col = rect.x; col < rect.x + rect.width; col += 1) {
      const tile = expandedTilemap.metatileTiles[blockIndex * 16 + row * BLOCK_TILES + col] || 0;
      values.push(terrainValueForTile(tile, expandedTilemap.collisionThresholds));
    }
    rows.push(values);
  }
  return rows;
}

function allTerrainRowsEqual(rows, expected) {
  return rows.every((row) => row.every((value) => value === expected));
}

function verifyFalsePlatformMetatile(expandedTilemap, signature) {
  if (expandedTilemap.tileSetAddress !== signature.tileSetAddress) {
    return null;
  }
  if (!expandedTilemap.collisionThresholds) {
    throw new Error(`${signature.id} requires collision threshold bytes for tile set ${hex(signature.tileSetAddress, 4)}`);
  }
  if (!metatileVisualRowsMatch(expandedTilemap, signature)) {
    throw new Error(
      `${signature.id} metatile ${hex(signature.metatile, 2)} no longer visually matches reference metatile ${hex(signature.visualReferenceMetatile, 2)}`
    );
  }

  const candidateTerrain = metatileTerrainRows(expandedTilemap, signature, signature.metatile);
  if (!allTerrainRowsEqual(candidateTerrain, 0)) {
    throw new Error(`${signature.id} metatile ${hex(signature.metatile, 2)} is not collision-empty in the visible rows`);
  }

  const referenceTerrain = metatileTerrainRows(expandedTilemap, signature, signature.visualReferenceMetatile);
  if (allTerrainRowsEqual(referenceTerrain, 0)) {
    throw new Error(`${signature.id} reference metatile ${hex(signature.visualReferenceMetatile, 2)} is unexpectedly collision-empty`);
  }

  return {
    metatile: signature.metatile,
    visualReferenceMetatile: signature.visualReferenceMetatile,
    candidateTiles: metatileTileRows(
      expandedTilemap.metatileTiles,
      signature.metatile,
      signature.visibleTileRect.y,
      signature.visibleTileRect.height
    ),
    referenceTiles: metatileTileRows(
      expandedTilemap.metatileTiles,
      signature.visualReferenceMetatile,
      signature.visibleTileRect.y,
      signature.visibleTileRect.height
    ),
    candidateTerrain,
    referenceTerrain
  };
}

function findFalsePlatformMetatileCandidates(expandedTilemap) {
  const candidates = [];

  for (const signature of FALSE_PLATFORM_METATILE_SIGNATURES) {
    const proof = verifyFalsePlatformMetatile(expandedTilemap, signature);
    if (!proof) {
      continue;
    }

    for (let blockY = 0; blockY < expandedTilemap.blockHeight; blockY += 1) {
      for (let blockX = 0; blockX < expandedTilemap.blockWidth; blockX += 1) {
        const blockIndex = expandedTilemap.layoutBlocks[blockY * expandedTilemap.blockWidth + blockX] || 0;
        if (blockIndex !== signature.metatile) {
          continue;
        }
        candidates.push({
          rect: {
            x: blockX * BLOCK_TILES + signature.visibleTileRect.x,
            y: blockY * BLOCK_TILES + signature.visibleTileRect.y,
            width: signature.visibleTileRect.width,
            height: signature.visibleTileRect.height
          },
          block: {
            x: blockX,
            y: blockY,
            metatile: signature.metatile
          },
          signatures: [signature],
          proof
        });
      }
    }
  }

  return candidates;
}

function uniqueRecordsByJson(records) {
  return Array.from(new Map(records.map((record) => [JSON.stringify(record), record])).values());
}

function applyDestructibleFixtureMerges(sliceConfig, fixtures) {
  const merges = sliceConfig.destructibleFixtureMerges || [];
  if (merges.length === 0) {
    return fixtures;
  }

  const fixtureById = new Map(fixtures.map((fixture) => [fixture.id, fixture]));
  const consumedFixtureIds = new Set();
  const mergedFixtures = [];

  for (const merge of merges) {
    if (!merge.id) {
      throw new Error(`${sliceConfig.id} destructible fixture merge requires an id`);
    }
    if (!Array.isArray(merge.sourceFixtureIds) || merge.sourceFixtureIds.length === 0) {
      throw new Error(`${merge.id} destructible fixture merge requires sourceFixtureIds`);
    }
    if (!merge.segmentId || !merge.tileRect) {
      throw new Error(`${merge.id} destructible fixture merge requires segmentId and tileRect`);
    }

    const sourceFixtures = merge.sourceFixtureIds.map((fixtureId) => {
      const fixture = fixtureById.get(fixtureId);
      if (!fixture) {
        throw new Error(`${merge.id} references missing destructible fixture ${fixtureId}`);
      }
      return fixture;
    });
    const primaryFixture = sourceFixtures[0];
    const signatureIds = uniqueRecordsByJson(sourceFixtures.flatMap((fixture) => fixture.signatureIds || (fixture.signatureId ? [fixture.signatureId] : [])))
      .sort();
    const metatileProofs = uniqueRecordsByJson(sourceFixtures.flatMap((fixture) => fixture.provenance?.metatileProofs || []));

    sourceFixtures.forEach((fixture) => consumedFixtureIds.add(fixture.id));
    mergedFixtures.push({
      ...primaryFixture,
      id: merge.id,
      label: merge.label || primaryFixture.label,
      kind: merge.kind || primaryFixture.kind,
      role: merge.role || primaryFixture.role,
      segmentId: merge.segmentId,
      tileRect: merge.tileRect,
      matchCount: sourceFixtures.reduce((count, fixture) => count + (fixture.matchCount || 0), 0),
      matches: sourceFixtures.flatMap((fixture) => (fixture.matches || [])
        .map((match) => ({ ...match, segmentId: fixture.segmentId }))),
      blocks: sourceFixtures.flatMap((fixture) => (fixture.blocks || [])
        .map((block) => ({ ...block, segmentId: fixture.segmentId }))),
      signatureIds,
      action: merge.action || primaryFixture.action,
      dialogText: merge.dialogText || primaryFixture.dialogText || null,
      provenance: {
        ...primaryFixture.provenance,
        source: 'rom-layout-metatile-and-terrain-thresholds+guide-authored-cross-segment-merge',
        sourceFixtureIds: merge.sourceFixtureIds,
        mergeEvidence: merge.evidence || null,
        metatileProofs
      }
    });
  }

  return [
    ...fixtures.filter((fixture) => !consumedFixtureIds.has(fixture.id)),
    ...mergedFixtures
  ];
}

function buildDestructibleFixtures(sliceConfig, segments, segmentTilemapsById, actors) {
  const signature = FIXTURE_TILE_SIGNATURES.destructibleBlock2x2;
  const fixtures = [];

  for (const segment of segments) {
    const expandedTilemap = segmentTilemapsById.get(segment.id);
    if (!expandedTilemap) {
      continue;
    }

    const groups = destructibleBlockGroupsForTilemap(expandedTilemap);
    for (const group of groups) {
      const linkedSecret = findSecretForDestructibleRect(segment.id, group.rect, actors);
      const role = linkedSecret ? 'secret-reward' : 'breakable-terrain';
      fixtures.push({
        id: `${segment.id}-destructible-${group.rect.x}-${group.rect.y}-${group.rect.width}x${group.rect.height}`,
        label: 'Breakable blocks',
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

    const falsePlatformCandidates = findFalsePlatformMetatileCandidates(expandedTilemap);
    const falsePlatformCandidateByKey = new Map(
      falsePlatformCandidates.map((candidate) => [rectKey(candidate.rect), candidate])
    );
    const falsePlatformGroups = groupFixtureRects(
      falsePlatformCandidates.map((candidate) => candidate.rect)
    );

    for (const group of falsePlatformGroups) {
      const matchedSignatures = Array.from(new Map(group.matches
        .flatMap((rect) => falsePlatformCandidateByKey.get(rectKey(rect))?.signatures || [])
        .map((matchedSignature) => [matchedSignature.id, matchedSignature])).values())
        .sort((a, b) => a.id.localeCompare(b.id));
      const matchedProofs = group.matches
        .map((rect) => falsePlatformCandidateByKey.get(rectKey(rect))?.proof)
        .filter(Boolean);
      const matchedBlocks = group.matches
        .map((rect) => falsePlatformCandidateByKey.get(rectKey(rect))?.block)
        .filter(Boolean);
      const primarySignature = matchedSignatures[0];

      fixtures.push({
        id: `${segment.id}-false-platform-${group.rect.x}-${group.rect.y}-${group.rect.width}x${group.rect.height}`,
        label: primarySignature?.label || 'False platform',
        kind: 'false-platform',
        role: 'false-platform',
        segmentId: segment.id,
        tileRect: group.rect,
        matchCount: group.matchCount,
        matches: group.matches,
        blocks: matchedBlocks.map((block) => ({
          x: block.x,
          y: block.y,
          metatile: hex(block.metatile, 2)
        })),
        signatureIds: matchedSignatures.map((matchedSignature) => matchedSignature.id),
        action: primarySignature?.action || 'This floor looks solid, but Simon falls through it.',
        dialogText: primarySignature?.dialogText || null,
        provenance: {
          source: 'rom-layout-metatile-and-terrain-thresholds',
          collisionLookup: 'fixed-bank terrain builder 7:$EB6E-$EB95 classifies each rendered tile through the object-set auxiliary threshold table; lookup 7:$E979-$EA10 then reads those packed terrain values.',
          tileSetAddress: hex(expandedTilemap.tileSetAddress, 4),
          collisionThresholdAddress: hex(expandedTilemap.collisionThresholdAddress, 4),
          collisionThresholds: publicBytes(expandedTilemap.collisionThresholds),
          metatileProofs: matchedProofs.map((proof) => ({
            metatile: hex(proof.metatile, 2),
            visualReferenceMetatile: hex(proof.visualReferenceMetatile, 2),
            candidateTiles: proof.candidateTiles.map((row) => publicBytes(row)),
            referenceTiles: proof.referenceTiles.map((row) => publicBytes(row)),
            candidateTerrain: proof.candidateTerrain,
            referenceTerrain: proof.referenceTerrain
          }))
        }
      });
    }
  }

  return applyDestructibleFixtureMerges(sliceConfig, fixtures);
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

function applyFixtureSignatureSnaps(actors, segmentTilemapsById) {
  const validations = [];
  for (const actor of actors) {
    if (!actor.fixtureSignature || actor.visualTileRect) {
      continue;
    }
    const signature = FIXTURE_TILE_SIGNATURES[actor.fixtureSignature];
    if (!signature) {
      throw new Error(`${actor.id} references unknown fixture signature ${actor.fixtureSignature}`);
    }
    const expandedTilemap = segmentTilemapsById.get(actor.segmentId);
    if (!expandedTilemap) {
      throw new Error(`${actor.id} references missing expanded tilemap for ${actor.segmentId}`);
    }
    const best = findBestFixtureSignatureRect(actor, signature, expandedTilemap);
    if (!best || best.matches !== best.total) {
      const summary = best ? `${best.matches}/${best.total} at ${JSON.stringify(best.rect)}` : 'no candidate';
      throw new Error(`${actor.id} could not snap to ${signature.id}; best nearby match is ${summary}`);
    }
    actor.visualTileRect = best.rect;
    validations.push({
      type: 'fixture-visual-tile-rect-snap',
      actorId: actor.id,
      segmentId: actor.segmentId,
      signatureId: signature.id,
      signatureLabel: signature.label,
      visualTileRect: actor.visualTileRect,
      matches: best.matches,
      expectedMatches: best.total,
      status: 'snapped',
      source: signature.source
    });
  }
  return validations;
}

function groundSupportBounds(actor, actorClass, offsetX = 0) {
  const bounds = actorClass.previewOpaqueBounds || actorClass.opaqueBounds || actorClass.bounds;
  if (!bounds) {
    return null;
  }
  const pixelLeft = actor.pixelX + offsetX + bounds.minX;
  const pixelRight = actor.pixelX + offsetX + bounds.maxX;
  const pixelFoot = actor.pixelY + bounds.maxY;
  return {
    pixelLeft,
    pixelRight,
    pixelFoot,
    tileLeft: Math.floor(pixelLeft / TILE_SIZE),
    tileRight: Math.ceil(pixelRight / TILE_SIZE) - 1,
    tileY: Math.floor(pixelFoot / TILE_SIZE)
  };
}

function isGroundSupportTile(entry) {
  return entry != null
    && entry.tile !== 0
    && GROUND_SUPPORT_PALETTES.has(entry.palette);
}

function groundSupportScore(actor, actorClass, expandedTilemap, offsetX) {
  const bounds = groundSupportBounds(actor, actorClass, offsetX);
  if (!bounds || bounds.tileRight < bounds.tileLeft) {
    return null;
  }

  const tiles = [];
  let supportedTiles = 0;
  let totalTiles = 0;
  for (let x = bounds.tileLeft; x <= bounds.tileRight; x += 1) {
    const entry = tilemapEntry(expandedTilemap, x, bounds.tileY);
    const supports = isGroundSupportTile(entry);
    tiles.push({
      x,
      y: bounds.tileY,
      tile: entry ? hex(entry.tile, 2) : null,
      palette: entry?.palette ?? null,
      supports
    });
    totalTiles += 1;
    if (supports) {
      supportedTiles += 1;
    }
  }

  return {
    offsetX,
    pixelLeft: bounds.pixelLeft,
    pixelRight: bounds.pixelRight,
    pixelFoot: bounds.pixelFoot,
    tileLeft: bounds.tileLeft,
    tileRight: bounds.tileRight,
    tileY: bounds.tileY,
    supportedTiles,
    totalTiles,
    supportRatio: totalTiles === 0 ? 0 : supportedTiles / totalTiles,
    status: supportedTiles === totalTiles ? 'supported' : 'unsupported',
    tiles
  };
}

function publicGroundSupportScore(score) {
  return {
    offsetX: score.offsetX,
    pixelLeft: score.pixelLeft,
    pixelRight: score.pixelRight,
    pixelFoot: score.pixelFoot,
    tileLeft: score.tileLeft,
    tileRight: score.tileRight,
    tileY: score.tileY,
    supportedTiles: score.supportedTiles,
    totalTiles: score.totalTiles,
    supportRatio: score.supportRatio,
    status: score.status,
    tiles: score.tiles
  };
}

function chooseGroundSupportCandidate(actor, candidates) {
  const current = candidates.find((candidate) => candidate.offsetX === 0);
  if (!current) {
    throw new Error(`${actor.id} ground support validation did not evaluate offset 0`);
  }
  if (current.status === 'supported') {
    return {
      status: 'supported',
      current,
      selected: current
    };
  }

  const supportedCandidates = candidates
    .filter((candidate) => candidate.status === 'supported')
    .sort((a, b) => Math.abs(a.offsetX) - Math.abs(b.offsetX) || a.offsetX - b.offsetX);
  if (supportedCandidates.length === 0) {
    throw new Error(
      `${actor.id} has no supported ground placement near current x=${actor.pixelX}; current support ${current.supportedTiles}/${current.totalTiles}`
    );
  }

  const selected = supportedCandidates[0];
  const equivalent = supportedCandidates.filter((candidate) => Math.abs(candidate.offsetX) === Math.abs(selected.offsetX));
  if (equivalent.length > 1) {
    throw new Error(
      `${actor.id} has ambiguous ground support candidates: ${equivalent.map((candidate) => candidate.offsetX).join(', ')}`
    );
  }

  return {
    status: 'snapped',
    current,
    selected
  };
}

function applyGroundSupportSnaps(actors, actorClassById, segmentById, segmentTilemapsById) {
  const validations = [];

  for (const actor of actors) {
    const actorClass = actor.classId ? actorClassById.get(actor.classId) : null;
    if (actorClass?.placement !== 'grounded' || actor.visualTileRect) {
      continue;
    }

    const expandedTilemap = segmentTilemapsById.get(actor.segmentId);
    const segment = segmentById.get(actor.segmentId);
    if (!expandedTilemap || !segment) {
      throw new Error(`${actor.id} references missing segment/tilemap for ground support validation`);
    }

    const candidates = GROUND_SUPPORT_SNAP_CANDIDATE_OFFSETS_X
      .map((offsetX) => groundSupportScore(actor, actorClass, expandedTilemap, offsetX))
      .filter(Boolean);
    const result = chooseGroundSupportCandidate(actor, candidates);
    const offsetX = result.selected.offsetX;

    if (offsetX !== 0) {
      actor.pixelX += offsetX;
      actor.worldX += offsetX;
      actor.drawAnchor.baseOffsetX = actor.drawAnchor.offsetX;
      actor.drawAnchor.offsetX += offsetX;
      actor.drawAnchor.supportSnapOffsetX = offsetX;
      actor.drawAnchor.source = 'rom-row-16px-cell-visual-anchor+rom-expanded-ground-support-snap';
    }

    actor.staticPlacement = {
      type: 'ground-support',
      status: result.status,
      offsetX,
      source: 'rom-expanded-background-tilemap',
      supportPalettes: Array.from(GROUND_SUPPORT_PALETTES),
      current: publicGroundSupportScore(result.current),
      selected: publicGroundSupportScore(result.selected)
    };

    validations.push({
      type: 'actor-ground-support',
      actorId: actor.id,
      actorClassId: actor.classId,
      segmentId: actor.segmentId,
      status: result.status,
      selectedOffsetX: offsetX,
      source: 'rom-expanded-background-tilemap',
      supportPalettes: Array.from(GROUND_SUPPORT_PALETTES),
      current: publicGroundSupportScore(result.current),
      selected: publicGroundSupportScore(result.selected),
      candidates: result.status === 'snapped'
        ? candidates.map(publicGroundSupportScore)
        : undefined
    });
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

function textCpuToFileOffset(info, cpuAddress, bank) {
  if (cpuAddress >= 0xc000 && cpuAddress <= 0xffff) {
    const fixedBank = info.prgRomBanks - 1;
    return info.prgStart + fixedBank * 0x4000 + (cpuAddress - 0xc000);
  }
  if (cpuAddress >= 0x8000 && cpuAddress <= 0xbfff && bank != null) {
    return bankedCpuToFileOffset(info, cpuAddress, bank);
  }
  throw new Error(`Text CPU pointer ${hex(cpuAddress, 4)} requires an explicit PRG bank`);
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

function publicRomDialogVariant(rom, info, variant) {
  const textEvidence = decodeRomDialogText(rom, info, variant.textPointerIndex);
  return {
    label: variant.label,
    guideLine: variant.guideLine || null,
    condition: variant.condition,
    effect: variant.effect || null,
    text: textEvidence.text,
    textEvidence,
    source: variant.source || textEvidence.source
  };
}

function publicRomDialogVariants(rom, info, variants) {
  if (!Array.isArray(variants) || variants.length === 0) {
    return null;
  }
  return variants.map((variant) => publicRomDialogVariant(rom, info, variant));
}

function decodeRomDialogTextAtPointer(rom, info, cpuPointer, bank) {
  const fileOffset = textCpuToFileOffset(info, cpuPointer, bank);
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
        `Text pointer ${hex(cpuPointer, 4)} at ${hex(offset, 5)} contains undecoded byte ${hex(byte, 2)}`
      );
    }
    rawBytes.push(byte);
    decoded += character;
  }

  return {
    ramPointer: hex(cpuPointer, 4),
    bank: bank == null ? null : bank,
    fileOffset: hex(fileOffset, 5),
    rawBytes: publicBytes(rawBytes),
    decoded,
    text: normalizeDialogText(decoded),
    source: bank == null
      ? `rom-fixed:${hex(cpuPointer, 4)}`
      : `rom-bank${bank}:${hex(cpuPointer, 4)}`
  };
}

function decodeRomDialogTextAtFileOffset(rom, fileOffset) {
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
        `Text file offset ${hex(fileOffset, 5)} at ${hex(offset, 5)} contains undecoded byte ${hex(byte, 2)}`
      );
    }
    rawBytes.push(byte);
    decoded += character;
  }

  return {
    fileOffset: hex(fileOffset, 5),
    rawBytes: publicBytes(rawBytes),
    decoded,
    text: normalizeDialogText(decoded),
    source: `rom-file:${hex(fileOffset, 5)}`
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

function actorSpritePaletteVariantBank(address) {
  return address < 0xc000 ? 4 : undefined;
}

function readActorPaletteMemory(rom, info, source) {
  if (source.type === 'rom-sprite-palette') {
    let variantAddress = source.variantAddress;
    let variantBank = source.variantBank;
    let variantSource;
    if (source.auxiliaryTransferId != null) {
      const transferPointerAddress = SPRITE_TRANSFER_POINTER_TABLE + source.auxiliaryTransferId * 2;
      variantAddress = readPrgWord(rom, info, transferPointerAddress, {
        bank: SPRITE_TRANSFER_POINTER_TABLE_BANK
      });
      variantBank = actorSpritePaletteVariantBank(variantAddress);
      variantSource = [
        `rom-bank${SPRITE_TRANSFER_POINTER_TABLE_BANK}:${hex(transferPointerAddress, 4)}..${hex(transferPointerAddress + 1, 4)}`,
        `aux:${hex(source.auxiliaryTransferId, 2)}`,
        variantBank == null
          ? `rom:${hex(variantAddress, 4)}..${hex(variantAddress + VARIANT_SPRITE_PALETTE_LENGTH - 1, 4)}`
          : `rom-bank${variantBank}:${hex(variantAddress, 4)}..${hex(variantAddress + VARIANT_SPRITE_PALETTE_LENGTH - 1, 4)}`
      ].join('->');
    } else {
      variantSource = source.variantBank == null
        ? `rom:${hex(source.variantAddress, 4)}..${hex(source.variantAddress + VARIANT_SPRITE_PALETTE_LENGTH - 1, 4)}`
        : `rom-bank${source.variantBank}:${hex(source.variantAddress, 4)}..${hex(source.variantAddress + VARIANT_SPRITE_PALETTE_LENGTH - 1, 4)}`;
    }
    if (variantAddress == null) {
      throw new Error(`Actor sprite palette source ${source.id} must provide variantAddress or auxiliaryTransferId`);
    }
    const common = readActorPaletteFragment(
      rom,
      info,
      COMMON_SPRITE_PALETTE_ADDRESS,
      COMMON_SPRITE_PALETTE_LENGTH
    );
    const variant = readActorPaletteFragment(
      rom,
      info,
      variantAddress,
      VARIANT_SPRITE_PALETTE_LENGTH,
      variantBank
    );
    return {
      bytes: Buffer.concat([common, variant]),
      source: [
        `rom:${hex(COMMON_SPRITE_PALETTE_ADDRESS, 4)}..${hex(COMMON_SPRITE_PALETTE_ADDRESS + COMMON_SPRITE_PALETTE_LENGTH - 1, 4)}`,
        variantSource
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

  if (config.mode === 'single-selector') {
    const selector = hex(parseHex(config.selector), 2);
    const frameIndex = frames.findIndex((frame) => frame.selector === selector);
    if (frameIndex === -1) {
      throw new Error(`static preview selector ${selector} is not in actor class ${actorClass.id}`);
    }
    return {
      ...config,
      selector,
      frameIndex,
      anchor: 'selector-frame',
      axes: [],
      frameOffsets: frameOpaqueBounds.map(() => ({ x: 0, y: 0 })),
      previewFrameIndexes: [frameIndex],
      source: 'rom-selector-presentation-policy'
    };
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

function staticPreviewOpaqueBounds(staticPreview, frameOpaqueBounds, previewOffsets) {
  const frameIndexes = staticPreview.previewFrameIndexes || frameOpaqueBounds.map((_, index) => index);
  return actorOpaqueUnion(
    frameIndexes.map((index) => frameOpaqueBounds[index]),
    frameIndexes.map((index) => previewOffsets[index])
  );
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

function transformCompositeSprite(sprite, offsetX = 0, offsetY = 0, flipHorizontal = false) {
  const sourceX = flipHorizontal ? -sprite.xOffset - TILE_SIZE : sprite.xOffset;
  const attr = flipHorizontal ? (parseHex(sprite.attr) ^ 0x40) : parseHex(sprite.attr);
  return {
    ...sprite,
    attr: hex(attr, 2),
    flipHorizontal: Boolean(flipHorizontal) ? !sprite.flipHorizontal : sprite.flipHorizontal,
    xOffset: sourceX + offsetX,
    yOffset: sprite.yOffset + offsetY
  };
}

function shouldFlipCompositeSprite(entry, spriteIndex) {
  if (entry.flipHorizontal) {
    return true;
  }
  if (Number.isInteger(entry.flipSpriteCount)) {
    return spriteIndex < entry.flipSpriteCount;
  }
  if (Array.isArray(entry.flipSpriteIndexes)) {
    return entry.flipSpriteIndexes.includes(spriteIndex);
  }
  return false;
}

function actorClassSelectors(rom, info, actorClass) {
  if (actorClass.compositeSelectors) {
    const compositeSelectors = actorClass.compositeSelectors.map((entry) => {
      if (entry.selectorRecordIndex == null) {
        return {
          ...entry,
          selectors: [entry.selector]
        };
      }
      const selectorRecord = decodeSelectorRecordAt(
        rom,
        info,
        SELECTOR_RECORD_BASE + entry.selectorRecordIndex * 3
      );
      return {
        ...entry,
        selectorRecord,
        selectors: selectorRecord.selectors
      };
    });
    return {
      selectorRecord: null,
      selectors: compositeSelectors.flatMap((entry) => entry.selectors),
      source: 'composite-selector-list',
      compositeSelectors
    };
  }

  if (actorClass.selectors) {
    return {
      selectorRecord: null,
      selectors: actorClass.selectors,
      source: 'direct-selector-list'
    };
  }

  if (actorClass.selector != null) {
    return {
      selectorRecord: null,
      selectors: [actorClass.selector],
      source: 'direct-selector'
    };
  }

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

function publicSelectorRecord(record, recordIndex = record?.recordIndex) {
  if (!record) {
    return null;
  }
  return {
    index: hex(recordIndex ?? record.recordIndex, 2),
    cpuAddress: hex(record.cpuAddress, 4),
    fileOffset: hex(record.fileOffset, 5),
    bytes: publicBytes(record.bytes),
    selectors: record.selectors.map((selector) => hex(selector, 2))
  };
}

function compositeSelectorForFrame(entry, frameIndex) {
  const selectors = entry.selectors || [entry.selector];
  return selectors[frameIndex % selectors.length];
}

function buildCompositeSelectorFrame(rom, info, compositeSelectors, frameIndex = 0) {
  const parts = compositeSelectors.map((entry) => {
    const selector = compositeSelectorForFrame(entry, frameIndex);
    const decoded = decodeMetaspriteSelector(rom, info, selector);
    const offsetX = entry.offsetX || 0;
    const offsetY = entry.offsetY || 0;
    const flipHorizontal = Boolean(entry.flipHorizontal);
    return {
      selector: hex(selector, 2),
      pointer: hex(decoded.pointer.target, 4),
      status: hex(decoded.status, 2),
      offsetX,
      offsetY,
      role: entry.role,
      selectorRecord: publicSelectorRecord(entry.selectorRecord, entry.selectorRecordIndex),
      flipHorizontal,
      flipSpriteCount: Number.isInteger(entry.flipSpriteCount) ? entry.flipSpriteCount : undefined,
      flipSpriteIndexes: Array.isArray(entry.flipSpriteIndexes) ? entry.flipSpriteIndexes : undefined,
      sprites: decoded.sprites
        .map(publicSprite)
        .map((sprite, spriteIndex) => transformCompositeSprite(
          sprite,
          offsetX,
          offsetY,
          shouldFlipCompositeSprite(entry, spriteIndex)
        ))
    };
  });

  return {
    selector: parts.map((part) => part.selector).join('+'),
    pointer: null,
    status: null,
    compositeSelectors: parts.map((part) => ({
      selector: part.selector,
      pointer: part.pointer,
      status: part.status,
      offsetX: part.offsetX,
      offsetY: part.offsetY,
      ...(part.role ? { role: part.role } : {}),
      ...(part.selectorRecord ? { selectorRecord: part.selectorRecord } : {}),
      ...(part.flipHorizontal ? { flipHorizontal: true } : {}),
      ...(part.flipSpriteCount != null ? { flipSpriteCount: part.flipSpriteCount } : {}),
      ...(part.flipSpriteIndexes ? { flipSpriteIndexes: part.flipSpriteIndexes } : {})
    })),
    sprites: parts.flatMap((part) => part.sprites)
  };
}

function buildActorClassFrames(rom, info, actorClass, selectorSource) {
  if (selectorSource.compositeSelectors) {
    const frameCount = Math.max(
      1,
      ...selectorSource.compositeSelectors.map((entry) => (entry.selectors || []).length)
    );
    return Array.from(
      { length: frameCount },
      (_, frameIndex) => buildCompositeSelectorFrame(rom, info, selectorSource.compositeSelectors, frameIndex)
    );
  }

  return selectorSource.selectors.map((selector) => {
    const decoded = decodeMetaspriteSelector(rom, info, selector);
    return {
      selector: hex(selector, 2),
      pointer: hex(decoded.pointer.target, 4),
      status: hex(decoded.status, 2),
      sprites: decoded.sprites.map(publicSprite)
    };
  });
}

function spriteWithPalette(sprite, palette) {
  const attr = (parseHex(sprite.attr) & 0xfc) | (palette & 0x03);
  return {
    ...sprite,
    attr: hex(attr, 2),
    palette
  };
}

function applyPaletteCycle(frames, paletteCycle) {
  if (!paletteCycle) {
    return frames;
  }
  return frames.flatMap((frame) => paletteCycle.values.map((palette, index) => ({
    ...frame,
    sprites: frame.sprites.map((sprite) => spriteWithPalette(sprite, palette)),
    paletteCycle: {
      index,
      palette,
      source: paletteCycle.source
    }
  })));
}

function buildActorClass(rom, info, addChrSet, actorClass) {
  const selectorSource = actorClassSelectors(rom, info, actorClass);
  const decodedFrames = buildActorClassFrames(rom, info, actorClass, selectorSource);
  const frames = applyPaletteCycle(decodedFrames, actorClass.paletteCycle);
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
    placement: actorClass.placement || null,
    actorId: hex(actorClass.actorId, 2),
    chrSet: chrSet.id,
    largeSprites: true,
    spriteHeight: SPRITE_HEIGHT,
    hp: actorClass.hp || null,
    drawAnchor: actorClass.drawAnchor || null,
    frameDurationMs: actorClass.frameDurationMs || actorClass.paletteCycle?.frameDurationMs || null,
    blink: actorClass.blink || null,
    ...(actorClass.paletteCycle ? {
      paletteCycle: {
        values: actorClass.paletteCycle.values,
        frameDurationMs: actorClass.paletteCycle.frameDurationMs,
        source: actorClass.paletteCycle.source
      }
    } : {}),
    selectorRecord: selectorSource.selectorRecord ? {
      index: hex(actorClass.selectorRecordIndex, 2),
      cpuAddress: hex(selectorSource.selectorRecord.cpuAddress, 4),
      fileOffset: hex(selectorSource.selectorRecord.fileOffset, 5),
      bytes: publicBytes(selectorSource.selectorRecord.bytes),
      selectors: selectorSource.selectorRecord.selectors.map((selector) => hex(selector, 2))
    } : null,
    frames: publicFrames,
    bounds: actorFrameBounds(frames),
    opaqueBounds: actorOpaqueUnion(frameOpaqueBounds),
    ...(staticPreview ? {
      staticPreview: {
        mode: staticPreview.mode,
        anchor: staticPreview.anchor,
        axes: staticPreview.axes,
        ...(staticPreview.selector ? { selector: staticPreview.selector } : {}),
        ...(Number.isInteger(staticPreview.frameIndex) ? { frameIndex: staticPreview.frameIndex } : {}),
        target: staticPreview.target,
        reason: staticPreview.reason,
        source: staticPreview.source
      },
      previewOpaqueBounds: staticPreviewOpaqueBounds(staticPreview, frameOpaqueBounds, previewOffsets)
    } : {}),
    selectorSource: selectorSource.source,
    proof: actorClass.proof
  };
}

function buildTracePathAnimation(animation, segmentById) {
  if (!animation || animation.type !== 'trace-path' || !Array.isArray(animation.points)) {
    return animation || null;
  }
  const points = animation.points.map((point) => {
    const pointSegment = segmentById.get(point.segmentId);
    if (!pointSegment) {
      throw new Error(`trace path point references unknown segment ${point.segmentId}`);
    }
    return {
      frame: point.frame,
      segmentId: point.segmentId,
      x: point.x,
      y: point.y,
      worldX: pointSegment.position.x + point.x,
      worldY: pointSegment.position.y + point.y,
      facing: point.facing,
      ...(point.hidden === true ? { hidden: true } : {}),
      ...(Number.isInteger(point.frameIndex) ? { frameIndex: point.frameIndex } : {})
    };
  });
  const frameDurationMs = Number.isFinite(animation.frameDurationMs) && animation.frameDurationMs > 0
    ? animation.frameDurationMs
    : 1000 / 60;
  const lastFrame = points.length > 0 ? points[points.length - 1].frame : 0;
  return {
    type: animation.type,
    frameDurationMs,
    durationMs: (lastFrame + 1) * frameDurationMs,
    source: animation.source,
    interpolate: Boolean(animation.interpolate),
    autoLoop: Boolean(animation.autoLoop),
    phaseFrames: Number.isFinite(animation.phaseFrames) ? animation.phaseFrames : 0,
    ...(Number.isFinite(animation.frameIntervalFrames) && animation.frameIntervalFrames > 0
      ? { frameIntervalFrames: animation.frameIntervalFrames }
      : {}),
    ...(Number.isFinite(animation.activeFrameStart)
      ? { activeFrameStart: animation.activeFrameStart }
      : {}),
    presentation: animation.presentation || null,
    points
  };
}

function buildTriggeredSecretFeature(rom, info, addChrSet, segmentById, segment, definition) {
  const chrSet = addChrSet(definition.chrBanks);
  const patterns = readChrPair(rom, info, definition.chrBanks);
  const frames = definition.renderFrames.map((frame) => ({
    id: frame.id,
    selector: definition.selector != null ? hex(definition.selector, 2) : null,
    status: 'runtime-oam-trace',
    sprites: frame.sprites.map(publicSprite)
  }));
  const frameOpaqueBounds = frames.map((frame) => actorFrameOpaqueBounds(frame, patterns));
  const publicFrames = frames.map((frame, index) => ({
    ...frame,
    opaqueBounds: frameOpaqueBounds[index]
  }));
  const bounds = actorFrameBounds(frames);
  const opaqueBounds = actorOpaqueUnion(frameOpaqueBounds);
  const animation = buildTracePathAnimation(definition.animation, segmentById);
  const firstPoint = animation?.points?.[0];
  const worldX = firstPoint ? firstPoint.worldX : segment.position.x;
  const worldY = firstPoint ? firstPoint.worldY : segment.position.y;

  return {
    id: definition.id,
    label: definition.label,
    kind: definition.kind || 'secret',
    interactive: definition.interactive !== false,
    effect: definition.effect,
    segmentId: definition.segmentId,
    variants: definition.variants || ['day', 'night'],
    pixelX: worldX - segment.position.x,
    pixelY: worldY - segment.position.y,
    worldX,
    worldY,
    condition: definition.condition,
    motion: definition.motion || null,
    animation,
    dialog: definition.dialog,
    dialogs: definition.dialogs || null,
    itemReward: publicItemReward(definition.itemReward),
    visibilityLayer: definition.visibilityLayer || 'triggered',
    highlightLayer: definition.highlightLayer || 'none',
    render: {
      type: 'runtime-oam-trace',
      chrSet: chrSet.id,
      largeSprites: true,
      spriteHeight: SPRITE_HEIGHT,
      paletteByVariant: definition.paletteByVariant || {},
      frameDurationMs: definition.frameDurationMs || null,
      frames: publicFrames,
      bounds,
      opaqueBounds
    },
    provenance: definition.provenance || null
  };
}

function buildPresentationMetaspriteFeature(rom, info, addChrSet, segmentById, segment, definition) {
  const selectorSource = actorClassSelectors(rom, info, definition);
  const decodedFrames = buildActorClassFrames(rom, info, definition, selectorSource);
  const frames = applyPaletteCycle(decodedFrames, definition.paletteCycle);
  const chrSet = addChrSet(definition.chrBanks);
  const patterns = readChrPair(rom, info, definition.chrBanks);
  const frameOpaqueBounds = frames.map((frame) => actorFrameOpaqueBounds(frame, patterns));
  const publicFrames = frames.map((frame, index) => ({
    ...frame,
    opaqueBounds: frameOpaqueBounds[index]
  }));
  const bounds = actorFrameBounds(frames);
  const opaqueBounds = actorOpaqueUnion(frameOpaqueBounds);
  const animation = buildTracePathAnimation(definition.animation, segmentById);
  const firstPoint = animation?.points?.[0];
  const placement = definition.placement || {};
  const pixelX = Number.isFinite(placement.worldX)
    ? placement.worldX - segment.position.x
    : (Number.isFinite(placement.pixelX) ? placement.pixelX : firstPoint?.x);
  const pixelY = Number.isFinite(placement.worldY)
    ? placement.worldY - segment.position.y
    : (Number.isFinite(placement.pixelY) ? placement.pixelY : firstPoint?.y);
  if (!Number.isFinite(pixelX) || !Number.isFinite(pixelY)) {
    throw new Error(`presentation metasprite ${definition.id} requires placement.pixelX/pixelY or placement.worldX/worldY`);
  }

  return {
    id: definition.id,
    label: definition.label,
    kind: definition.kind || 'presentation',
    interactive: definition.interactive !== false,
    effect: definition.effect,
    segmentId: definition.segmentId,
    variants: definition.variants || ['day', 'night'],
    pixelX,
    pixelY,
    worldX: segment.position.x + pixelX,
    worldY: segment.position.y + pixelY,
    condition: definition.condition || null,
    motion: definition.motion || null,
    animation,
    dialog: definition.dialog || null,
    dialogs: definition.dialogs || null,
    itemReward: publicItemReward(definition.itemReward),
    visibilityLayer: definition.visibilityLayer || 'always',
    highlightLayer: definition.highlightLayer || 'none',
    render: {
      type: 'presentation-metasprite',
      selector: definition.selector != null ? hex(definition.selector, 2) : null,
      selectorRecord: selectorSource.selectorRecord ? {
        index: hex(definition.selectorRecordIndex, 2),
        cpuAddress: hex(selectorSource.selectorRecord.cpuAddress, 4),
        fileOffset: hex(selectorSource.selectorRecord.fileOffset, 5),
        bytes: publicBytes(selectorSource.selectorRecord.bytes),
        selectors: selectorSource.selectorRecord.selectors.map((selector) => hex(selector, 2))
      } : null,
      selectorSource: selectorSource.source,
      chrSet: chrSet.id,
      largeSprites: true,
      spriteHeight: SPRITE_HEIGHT,
      paletteByVariant: definition.paletteByVariant || {},
      frameDurationMs: definition.frameDurationMs || definition.paletteCycle?.frameDurationMs || null,
      blink: definition.blink || null,
      frames: publicFrames,
      bounds,
      opaqueBounds
    },
    provenance: {
      placement: definition.placement,
      selectors: selectorSource.selectors.map((selector) => hex(selector, 2)),
      selectorSource: selectorSource.source,
      ...definition.provenance
    }
  };
}

function buildSecretFeature(rom, info, addChrSet, segmentById, definition) {
  const segment = segmentById.get(definition.segmentId);
  if (!segment) {
    return null;
  }

  if (definition.effect === 'triggered-animation') {
    return buildTriggeredSecretFeature(rom, info, addChrSet, segmentById, segment, definition);
  }

  if (definition.effect === 'presentation-metasprite') {
    return buildPresentationMetaspriteFeature(rom, info, addChrSet, segmentById, segment, definition);
  }

  if (definition.effect === 'guide-hotspot') {
    const bounds = definition.bounds || { x: 0, y: 0, width: segment.position.width, height: segment.position.height };
    return {
      id: definition.id,
      label: definition.label,
      kind: definition.kind || 'secret',
      interactive: definition.interactive !== false,
      effect: definition.effect,
      segmentId: definition.segmentId,
      variants: definition.variants || ['day', 'night'],
      pixelX: bounds.x,
      pixelY: bounds.y,
      worldX: segment.position.x + bounds.x,
      worldY: segment.position.y + bounds.y,
      bounds,
      condition: definition.condition,
      dialog: definition.dialog,
      dialogs: definition.dialogs || null,
      itemReward: publicItemReward(definition.itemReward),
      triggerAnimationFeatureId: definition.triggerAnimationFeatureId || null,
      visibilityLayer: definition.visibilityLayer || (definition.kind === 'secret' ? 'secrets' : 'always'),
      highlightLayer: definition.highlightLayer || (definition.kind === 'secret' ? 'secrets' : 'none'),
      highlightShape: definition.highlightShape || null,
      render: null,
      provenance: definition.provenance || null
    };
  }

  const bytes = assertRomBytes(rom, definition.offset, definition.bytes);
  const selectorSource = actorClassSelectors(rom, info, definition);
  const frames = selectorSource.selectors.map((selector) => {
    const decoded = decodeMetaspriteSelector(rom, info, selector);
    return {
      selector: hex(selector, 2),
      pointer: hex(decoded.pointer.target, 4),
      status: hex(decoded.status, 2),
      sprites: decoded.sprites.map(publicSprite)
    };
  });
  const chrSet = addChrSet(definition.chrBanks);
  const patterns = readChrPair(rom, info, definition.chrBanks);
  const frameOpaqueBounds = frames.map((frame) => actorFrameOpaqueBounds(frame, patterns));
  const publicFrames = frames.map((frame, index) => ({
    ...frame,
    opaqueBounds: frameOpaqueBounds[index]
  }));
  const bounds = actorFrameBounds(frames);
  const opaqueBounds = actorOpaqueUnion(frameOpaqueBounds);
  const runtimePixelX = bytes[0] * ACTOR_CELL_SIZE;
  const runtimePixelY = bytes[1] * ACTOR_CELL_SIZE;
  const placement = definition.placement || {};
  const pixelX = Number.isFinite(placement.worldX)
    ? placement.worldX - segment.position.x
    : (Number.isFinite(placement.pixelX)
      ? placement.pixelX
      : runtimePixelX + (Number.isFinite(placement.offsetX) ? placement.offsetX : 0));
  const pixelY = Number.isFinite(placement.worldY)
    ? placement.worldY - segment.position.y
    : (Number.isFinite(placement.pixelY)
      ? placement.pixelY
      : runtimePixelY + (Number.isFinite(placement.offsetY) ? placement.offsetY : 0));

  return {
    id: definition.id,
    label: definition.label,
    kind: definition.kind || 'secret',
    interactive: definition.interactive !== false,
    effect: definition.effect,
    segmentId: definition.segmentId,
    variants: definition.variants || ['day', 'night'],
    tileX: bytes[0],
    tileY: bytes[1],
    pixelX,
    pixelY,
    worldX: segment.position.x + pixelX,
    worldY: segment.position.y + pixelY,
    actorId: hex(bytes[2], 2),
    data: hex(bytes[3], 2),
    condition: definition.condition,
    motion: definition.motion,
    dialog: definition.dialog,
    dialogs: definition.dialogs || null,
    itemReward: publicItemReward(definition.itemReward),
    visibilityLayer: definition.visibilityLayer || (definition.kind === 'secret' ? 'secrets' : 'always'),
    highlightLayer: definition.highlightLayer || (definition.kind === 'secret' ? 'secrets' : 'none'),
    render: {
      type: 'metasprite-selector',
      selector: definition.selector != null ? hex(definition.selector, 2) : null,
      selectorRecord: selectorSource.selectorRecord ? {
        index: hex(definition.selectorRecordIndex, 2),
        cpuAddress: hex(selectorSource.selectorRecord.cpuAddress, 4),
        fileOffset: hex(selectorSource.selectorRecord.fileOffset, 5),
        bytes: publicBytes(selectorSource.selectorRecord.bytes),
        selectors: selectorSource.selectorRecord.selectors.map((selector) => hex(selector, 2))
      } : null,
      selectorSource: selectorSource.source,
      chrSet: chrSet.id,
      largeSprites: true,
      spriteHeight: SPRITE_HEIGHT,
      paletteByVariant: definition.paletteByVariant || {},
      frameDurationMs: definition.frameDurationMs || null,
      frames: publicFrames,
      bounds,
      opaqueBounds
    },
    provenance: {
      rowOffset: hex(definition.offset, 5),
      rawBytes: publicBytes(bytes),
      runtimeAnchor: {
        pixelX: runtimePixelX,
        pixelY: runtimePixelY,
        worldX: segment.position.x + runtimePixelX,
        worldY: segment.position.y + runtimePixelY,
        note: 'Raw actor/control row anchor retained for provenance; visible placement may be supplied by decoded runtime placement evidence.'
      },
      placement: definition.placement,
      ...definition.provenance
    }
  };
}

function buildSecretFeatures(rom, info, addChrSet, segmentById) {
  return SECRET_FEATURE_DEFINITIONS
    .map((definition) => buildSecretFeature(rom, info, addChrSet, segmentById, definition))
    .filter(Boolean);
}

function validateCanonicalEnemyLabels(actors, actorClassById) {
  const checked = [];
  const mismatches = [];
  for (const actor of actors) {
    if (actor.kind !== 'enemy' || !actor.classId) {
      continue;
    }
    const actorClass = actorClassById.get(actor.classId);
    if (!actorClass) {
      continue;
    }
    checked.push(actor.id);
    if (actor.label !== actorClass.label) {
      mismatches.push({
        actorId: actor.id,
        classId: actor.classId,
        label: actor.label,
        expectedLabel: actorClass.label
      });
    }
  }

  if (mismatches.length > 0) {
    throw new Error(
      `Enemy display labels must use canonical actor-class labels: ${mismatches
        .map((item) => `${item.actorId} has ${JSON.stringify(item.label)}, expected ${JSON.stringify(item.expectedLabel)}`)
        .join('; ')}`
    );
  }

  return [{
    type: 'canonical-enemy-labels',
    status: 'ok',
    checked: checked.length,
    source: 'actor-class-labels',
    note: 'Enemy display names are canonical class labels, not source manifest row names or location-derived labels.'
  }];
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

function actorPlacementHpEvidence(actor, kind, bytes, hp) {
  if (kind !== 'enemy' || !hp) {
    return null;
  }
  if (actor.hpEvidence) {
    return actor.hpEvidence;
  }
  const variants = actor.variants || ['day', 'night'];
  const baseHp = bytes ? bytes[3] : null;
  return {
    policy: 'standard-night-double',
    baseHp,
    rowData: baseHp == null ? null : hex(baseHp, 2),
    source: 'rom-actor-row-data-byte+rom-hp-init-routine',
    rule: 'Standard exterior enemies use the actor row data byte for day HP and the ROM night-strength path doubles that byte for night HP.',
    variants,
    rom: ENEMY_HP_ROM_INIT_PROOF
  };
}

function expectedHpForEvidence(actor) {
  const evidence = actor.hpEvidence;
  if (!evidence || !Number.isInteger(evidence.baseHp)) {
    return null;
  }
  if (evidence.policy === 'standard-night-double') {
    return standardEnemyHpFromVariants(evidence.baseHp, actor.variants || ['day', 'night']);
  }
  if (evidence.policy === 'fixed-interior-row-hp') {
    return fixedEnemyHp(evidence.baseHp);
  }
  if (evidence.policy === 'fixed-special-boss-hp') {
    return fixedEnemyHp(evidence.baseHp);
  }
  return null;
}

function validateEnemyHpEvidence(actors) {
  const checked = [];
  const failures = [];

  for (const actor of actors) {
    if (actor.kind !== 'enemy') {
      continue;
    }
    checked.push(actor);
    const expected = expectedHpForEvidence(actor);
    if (!actor.hp || !actor.hpEvidence || !expected) {
      failures.push(`${actor.id} missing audited HP evidence`);
      continue;
    }
    if (actor.hp.day !== expected.day || actor.hp.night !== expected.night) {
      failures.push(
        `${actor.id} HP ${JSON.stringify(actor.hp)} does not match ${actor.hpEvidence.policy} expected ${JSON.stringify(expected)}`
      );
    }
  }

  if (failures.length > 0) {
    throw new Error(`Enemy HP audit failed: ${failures.join('; ')}`);
  }

  const byPolicy = checked.reduce((counts, actor) => {
    const policy = actor.hpEvidence.policy;
    counts[policy] = (counts[policy] || 0) + 1;
    return counts;
  }, {});

  return [{
    type: 'enemy-hp-evidence',
    status: 'ok',
    checked: checked.length,
    byPolicy,
    source: 'rom-actor-row-data-byte+rom-hp-init-routine+rom-special-boss-initializer+runtime-trace-confirmation'
  }];
}

function buildActorPlacement(rom, info, classById, segmentById, actor) {
  const hasRomRow = actor.offset != null && Array.isArray(actor.bytes);
  const bytes = hasRomRow ? assertRomBytes(rom, actor.offset, actor.bytes) : null;
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
  const hpEvidence = actorPlacementHpEvidence(actor, kind, bytes, hp);
  const shouldDecodeText = actor.textPointerIndex != null
    || actor.textFileOffset != null
    || actor.textPointerAddress != null
    || actor.textFromRom === true
    || (!actor.text && (kind === 'npc' || kind === 'fixture' || kind === 'secret'));
  const textEvidence = shouldDecodeText
    ? (actor.textFileOffset != null
      ? decodeRomDialogTextAtFileOffset(rom, actor.textFileOffset)
      : actor.textPointerAddress != null
      ? decodeRomDialogTextAtPointer(rom, info, actor.textPointerAddress, actor.textPointerBank)
      : decodeRomDialogText(rom, info, actor.textPointerIndex ?? bytes[3]))
    : null;
  const text = actor.text || textEvidence?.text || null;
  const romDialogVariants = publicRomDialogVariants(rom, info, actor.romDialogVariants);
  const drawAnchor = actor.drawAnchor || actorClass?.drawAnchor || {};
  const drawOffsetX = drawAnchor.offsetX ?? (hasRomRow ? ACTOR_DRAW_ANCHOR_OFFSET_X : 0);
  const drawOffsetY = drawAnchor.offsetY ?? (hasRomRow ? ACTOR_DRAW_ANCHOR_OFFSET_Y : 0);
  const placement = actor.placement || {};
  const placedPixelX = Number.isFinite(placement.worldX)
    ? placement.worldX - segment.position.x
    : placement.pixelX;
  const placedPixelY = Number.isFinite(placement.worldY)
    ? placement.worldY - segment.position.y
    : placement.pixelY;
  if (!hasRomRow && (!Number.isFinite(placedPixelX) || !Number.isFinite(placedPixelY))) {
    throw new Error(`Actor ${actor.id} must provide explicit placement when it is not backed by a ROM actor row`);
  }
  const runtimePixelX = bytes
    ? bytes[0] * ACTOR_CELL_SIZE
    : (Number.isFinite(actor.runtimeAnchor?.pixelX)
      ? actor.runtimeAnchor.pixelX
      : placedPixelX);
  const runtimePixelY = bytes
    ? bytes[1] * ACTOR_CELL_SIZE
    : (Number.isFinite(actor.runtimeAnchor?.pixelY)
      ? actor.runtimeAnchor.pixelY
      : placedPixelY);
  const drawPixelX = Number.isFinite(placedPixelX) ? placedPixelX : runtimePixelX + drawOffsetX;
  const drawPixelY = Number.isFinite(placedPixelY) ? placedPixelY : runtimePixelY + drawOffsetY;
  const itemOffer = inferredItemOffer(actor);
  return {
    id: actor.id,
    classId: actor.classId,
    label,
    kind,
    segmentId: actor.segmentId,
    variants: actor.variants || ['day', 'night'],
    paletteByVariant: paletteByVariantForGuideActor(actor),
    tileX: bytes ? bytes[0] : Math.floor(runtimePixelX / ACTOR_CELL_SIZE),
    tileY: bytes ? bytes[1] : Math.floor(runtimePixelY / ACTOR_CELL_SIZE),
    pixelX: drawPixelX,
    pixelY: drawPixelY,
    worldX: segment.position.x + drawPixelX,
    worldY: segment.position.y + drawPixelY,
    actorId: bytes ? hex(bytes[2], 2) : (actor.actorId != null ? hex(actor.actorId, 2) : null),
    data: bytes ? hex(bytes[3], 2) : (actor.data != null ? hex(actor.data, 2) : null),
    hp,
    hpEvidence,
    text,
    textEvidence,
    romDialogVariants,
    guideDialog: actor.guideDialog || null,
    itemOffer,
    itemReward: publicItemReward(actor.itemReward),
    secret: SECRET_DETAILS[actor.id] || defaultSecretDetailsForActor(actor, bytes),
    visualTileRect: actor.visualTileRect || null,
    fixtureSignature: actor.fixtureSignature || null,
    flipHorizontal: Boolean(actor.flipHorizontal),
    runtimeAnchor: {
      pixelX: runtimePixelX,
      pixelY: runtimePixelY,
      worldX: segment.position.x + runtimePixelX,
      worldY: segment.position.y + runtimePixelY
    },
    drawAnchor: {
      offsetX: drawOffsetX,
      offsetY: drawOffsetY,
      source: drawAnchor.source || (hasRomRow ? 'rom-row-16px-cell-visual-anchor' : 'rom-runtime-spawn-selector-anchor')
    },
    provenance: hasRomRow
      ? {
        rowOffset: hex(actor.offset, 5),
        rawBytes: publicBytes(bytes),
        source: 'rom-actor-row'
      }
      : {
        ...(actor.provenance || {}),
        placement: {
          pixelX: drawPixelX,
          pixelY: drawPixelY,
          worldX: segment.position.x + drawPixelX,
          worldY: segment.position.y + drawPixelY
        }
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
      blockMatrix.blockHeight,
      {
        tileSetAddress: rawTileSet.tileSetAddress,
        tileBaseAddress: rawTileSet.tileBaseAddress,
        collisionThresholdAddress: rawTileSet.collisionThresholdAddress,
        collisionThresholds: rawTileSet.collisionThresholds,
        chrPatterns: readChrPair(rom, info, segment.templates[segment.template].chrBanks)
      }
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
      visibilityLayer: segmentConfig.visibilityLayer || null,
      presentationBackground: segmentConfig.presentationBackground || null,
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
        presentationBackground: segmentConfig.presentationBackground || null,
        binary: 'rom-derived-tile-data'
      }
    });
  }

  const segmentById = new Map(segments.map((segment) => [segment.id, segment]));
  const materializedActors = materializeManifestActors(sliceConfig, rom);
  const actorsForSlice = [
    ...GUIDE_SIMON_SPAWNS,
    ...GUIDE_ACTORS,
    ...materializedActors
  ].filter((actor) => segmentById.has(actor.segmentId));
  const secretFeatures = buildSecretFeatures(rom, info, addChrSet, segmentById);
  const actorClasses = actorsForSlice.length > 0
    ? ACTOR_CLASSES.map((actorClass) => buildActorClass(rom, info, addChrSet, actorClass))
    : [];
  const actorClassById = new Map(actorClasses.map((actorClass) => [actorClass.id, actorClass]));
  if (actorsForSlice.length > 0 || secretFeatures.length > 0) {
    for (const source of ACTOR_PALETTE_SOURCES) {
      addSpritePalette(source);
    }
  }
  const actors = actorsForSlice.map((actor) => buildActorPlacement(rom, info, actorClassById, segmentById, actor));
  const itemIcons = buildItemIconManifest(addChrSet);
  validations.push(...validateCanonicalEnemyLabels(actors, actorClassById));
  validations.push(...validateEnemyHpEvidence(actors));
  const groundSupportValidations = applyGroundSupportSnaps(actors, actorClassById, segmentById, segmentTilemapsById);
  validations.push(...groundSupportValidations);
  validations.push(...applyFixtureSignatureSnaps(actors, segmentTilemapsById));
  validations.push(...validateFixtureVisualRects(actors, segmentTilemapsById));
  validations.push(...applyHiddenClueBookDestructibleLinks(actors, segmentTilemapsById));
  const destructibleFixtures = buildDestructibleFixtures(sliceConfig, segments, segmentTilemapsById, actors);
  const doorHotspots = buildDoorHotspots(sliceConfig, segments, segmentTilemapsById);

  const world = segments.reduce((bounds, segment) => {
    const minX = Math.min(bounds.minX, segment.position.x);
    const minY = Math.min(bounds.minY, segment.position.y);
    const maxX = Math.max(bounds.maxX, segment.position.x + segment.position.width);
    const maxY = Math.max(bounds.maxY, segment.position.y + segment.position.height);
    return { minX, minY, maxX, maxY };
  }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
  const worldBounds = Number.isFinite(world.minX)
    ? {
      x: world.minX,
      y: world.minY,
      width: world.maxX - world.minX,
      height: world.maxY - world.minY
    }
    : { x: 0, y: 0, width: 0, height: 0 };

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
        'Door hotspots are emitted from ROM manifest door targets and ROM-expanded background signatures unless a validated exterior door hitbox is explicitly documented.',
        'Breakable terrain overlays are scanned from ROM-expanded background tile signatures; false platforms are decoded from ROM layout metatiles and terrain threshold bytes.',
        'Conditional secret features are promoted from ROM actor/control rows and decoded game routines, then rendered from ROM-derived sprite data.',
        'Presentation coordinates are authored for player readability and are not ROM world coordinates.',
        'No PNG map textures are emitted for this app slice.'
      ]
    },
    provenance: sliceConfig.provenance,
    world: worldBounds,
    dataFile: 'slice-data.bin',
    byteLength: data.length,
    chrSets,
    tileSets,
    palettes,
    spritePalettes,
    segments,
    doorHotspots,
    destructibleFixtures,
    secretFeatures,
    itemIcons,
    actorClasses,
    actors,
    destructibleSummary: {
      fixtures: destructibleFixtures.length,
      rewardLinked: destructibleFixtures.filter((fixture) => fixture.role === 'secret-reward').length,
      breakableTerrain: destructibleFixtures.filter((fixture) => fixture.role === 'breakable-terrain').length,
      falsePlatforms: destructibleFixtures.filter((fixture) => fixture.role === 'false-platform').length
    },
    doorSummary: {
      hotspots: doorHotspots.length,
      viewLinks: doorHotspots.filter((hotspot) => hotspot.opensView).length,
      dayOnly: doorHotspots.filter((hotspot) => Array.isArray(hotspot.variants) && hotspot.variants.length === 1 && hotspot.variants[0] === 'day').length
    },
    secretFeatureSummary: {
      features: secretFeatures.length,
      movingPlatforms: secretFeatures.filter((feature) => feature.effect === 'moving-platform').length
    },
    actorSummary: {
      classes: actorClasses.length,
      placements: actors.length,
      npcs: actors.filter((actor) => actor.kind === 'npc').length,
      enemies: actors.filter((actor) => actor.kind === 'enemy').length,
      fixtures: actors.filter((actor) => actor.kind === 'fixture').length,
      secrets: actors.filter((actor) => actor.kind === 'secret').length,
      groundSupportChecked: groundSupportValidations.length,
      groundSupportSnapped: groundSupportValidations.filter((validation) => validation.status === 'snapped').length
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
      doorHotspots: doorHotspots.length,
      secretFeatures: secretFeatures.length,
      validations: validations.length,
      world
    }
  };
}

module.exports = {
  buildGuideSlice
};
