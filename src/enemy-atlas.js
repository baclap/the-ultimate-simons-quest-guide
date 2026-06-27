'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte, readPrgWord } = require('./background');
const { decodeMetaspriteSelector, decodeSelectorRecordAt } = require('./actor-selector-streams');
const { buildManifest } = require('./manifest');

const CV2R_OBJECTS = require('../third_party/cv2r/lib/object');

const ACTOR_DISPATCH_TABLE = 0x81d3;
const ACTOR_ROUTINE_BANK = 1;
const SELECTOR_RECORD_BASE = 0xdda2;
const SPRITE_TRANSFER_POINTER_TABLE = 0x8895;
const SPRITE_TRANSFER_POINTER_TABLE_BANK = 7;
const SPRITE_COMMON_PALETTE_ADDRESS = 0xcaae;
const SPRITE_COMMON_PALETTE_LENGTH = 8;
const SPRITE_VARIANT_PALETTE_LENGTH = 8;
const ROUTINE_SCAN_BYTES = 160;

const ENEMY_HP_ROM_INIT_PROOF = {
  routine: 'PRG bank 1 CPU $8117-$8147',
  prgRomOffset: '0x04117-0x04147',
  nesFileOffset: '0x04127-0x04157',
  summary: 'The actor initializer loads the fourth actor-row byte into RAM $93, conditionally ASLs it for the night-strength path, then stores it to actor HP RAM $04C2,x.',
  nightStrengthExceptions: 'Actor ids $21/$22/$25-$27/$2D-$2F/$34 and object set $01 skip the ASL night-strength path.'
};

const NIGHT_HP_EXCEPTION_ACTOR_IDS = new Set([
  0x21, 0x22, 0x25, 0x26, 0x27, 0x2d, 0x2e, 0x2f, 0x34
]);

const MANUAL_SOURCE = {
  title: "Castlevania II: Simon's Quest English NES manual",
  localPdf: 'out/manuals/CLV-P-NABXE.pdf',
  localRenderedPages: [
    'out/manuals/check-pages/page-12.png',
    'out/manuals/check-pages/page-13.png'
  ],
  pages: [
    {
      page: 12,
      heading: "Count Dracula's Best Buddies",
      names: [
        'Vampire Bat',
        'Raven',
        'The Spider',
        'Man-Eating Plant',
        'The Zombie',
        'Vampira',
        'Slimey BarSinister',
        'The Fish Man',
        'The Flame Thrower',
        'The Two-Headed Creature',
        'Freddie',
        'Ghostly Eyeball'
      ]
    },
    {
      page: 13,
      heading: "Count Dracula's Best Buddies",
      names: [
        'The Mud Man',
        'The Wolf',
        'Dragon Bones',
        'The Ghastly Leech',
        'The Skull',
        'Medusa Head',
        'The Gargoyle',
        'The Grim Reaper',
        'The Mummy',
        'The Wolf Man',
        'The Zombie Hand',
        'The Pirate Skeleton'
      ]
    }
  ],
  policy: [
    'Use a manual name only when the manual illustration/name can be matched to the ROM actor class with sprite evidence.',
    'Preserve the leading "The" when it is part of the printed manual name.',
    'Keep unmatched manual names as candidates instead of guide-facing names.'
  ]
};

const MANUAL_NAME_EVIDENCE = new Map([
  [0x01, {
    manualName: 'Raven',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered bird class used by actor id $01 matches the manual enemy illustration labeled "Raven".'
  }],
  [0x02, {
    manualName: 'The Ghastly Leech',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered leech class used by actor id $02 matches the English manual enemy illustration labeled "The Ghastly Leech". Actor $02 initializes selector-stream record $1C, which emits upright curled leech selectors $61/$62.'
  }],
  [0x04, {
    manualName: 'The Fish Man',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered amphibious humanoid class used by actor id $04 matches the manual enemy illustration labeled "The Fish Man".'
  }],
  [0x06, {
    manualName: 'The Two-Headed Creature',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered hunched two-headed humanoid class used by actor id $06 matches the English manual enemy illustration labeled "The Two-Headed Creature".'
  }],
  [0x08, {
    manualName: 'Ghostly Eyeball',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered flying eyeball class used by actor id $08 matches the manual enemy illustration labeled "Ghostly Eyeball".'
  }],
  [0x09, {
    manualName: 'Vampire Bat',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered zigzag bat class used by actor id $09 matches the manual enemy illustration labeled "Vampire Bat".'
  }],
  [0x0e, {
    manualName: 'The Spider',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered spider class used by actor id $0E matches the manual enemy illustration labeled "The Spider".'
  }],
  [0x0f, {
    manualName: 'The Gargoyle',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered winged mansion class used by actor id $0F matches the manual enemy illustration labeled "The Gargoyle".'
  }],
  [0x11, {
    manualName: 'Vampire Bat',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered mansion bat class used by actor id $11 is a distinct actor routine from $09 but matches the same manual "Vampire Bat" illustration.'
  }],
  [0x13, {
    manualName: 'The Wolf Man',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered humanoid wolf class used by actor id $13 matches the manual enemy illustration labeled "The Wolf Man".'
  }],
  [0x0a, {
    manualName: 'Medusa Head',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered head class used by actor id $0A matches the English manual enemy illustration labeled "Medusa Head".'
  }],
  [0x12, {
    manualName: 'The Wolf',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered quadruped wolf class used by actor id $12 matches the English manual enemy illustration labeled "The Wolf".'
  }],
  [0x15, {
    manualName: 'The Mud Man',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered mud-rising class used by actor id $15 matches the English manual enemy illustration labeled "The Mud Man". The actor writes visible selectors $59/$5A/$5B from the local routine table at bank 1:$A3E4.'
  }],
  [0x17, {
    manualName: 'The Zombie',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered town night humanoid class used by actor id $17 matches the manual enemy illustration labeled "The Zombie".'
  }],
  [0x1f, {
    manualName: 'Slimey BarSinister',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered mansion blob class used by actor id $1F matches the English manual enemy illustration labeled "Slimey BarSinister".'
  }],
  [0x38, {
    manualName: 'The Zombie Hand',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered hand-from-ground class used by actor id $38 matches the English manual enemy illustration labeled "The Zombie Hand".'
  }],
  [0x39, {
    manualName: 'The Pirate Skeleton',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered guide-facing frames for actor id $39 use selector-stream record $3F, which emits skull-in-flame selectors $E6/$E7 matching the English manual enemy illustration labeled "The Pirate Skeleton".'
  }],
  [0x3a, {
    manualName: 'The Mummy',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered mummy class used by actor id $3A matches the English manual enemy illustration labeled "The Mummy".'
  }],
  [0x3f, {
    manualName: 'Man-Eating Plant',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered plant class used by actor id $3F matches the English manual enemy illustration labeled "Man-Eating Plant".'
  }],
  [0x41, {
    manualName: 'Slimey BarSinister',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered outdoor blob class used by actor id $41 matches the English manual enemy illustration labeled "Slimey BarSinister". The whole-ROM atlas finds this actor in Camilla Cemetery, Storigoi Graveyard, and Sadam Woods.'
  }],
  [0x4a, {
    manualName: 'Dragon Bones',
    status: 'manual-match-proven',
    evidence: 'The ROM-rendered bone-dragon head and neck composite used by actor id $4A matches the English manual enemy illustration labeled "Dragon Bones".'
  }]
]);

const MANUAL_NAME_CANDIDATES = new Map([
  [0x0a, ['Medusa Head']],
  [0x10, ['The Skull']],
  [0x12, ['The Wolf']],
  [0x15, ['The Mud Man']],
  [0x1d, ['The Flame Thrower']],
  [0x1f, ['Slimey BarSinister']],
  [0x38, ['The Zombie Hand']],
  [0x3a, ['The Mummy']],
  [0x3f, ['Man-Eating Plant']],
  [0x40, ['The Ghastly Leech']],
  [0x41, ['Slimey BarSinister']],
  [0x44, ['The Grim Reaper']],
  [0x4a, ['Dragon Bones']]
]);

const GENERIC_DISPLAY_NAMES = new Map([
  [0x01, 'Raven'],
  [0x02, 'The Ghastly Leech'],
  [0x03, 'Skeleton'],
  [0x04, 'The Fish Man'],
  [0x05, 'Spear knight'],
  [0x06, 'The Two-Headed Creature'],
  [0x08, 'Ghostly Eyeball'],
  [0x09, 'Vampire Bat'],
  [0x0a, 'Medusa Head'],
  [0x0d, 'Bone thrower'],
  [0x0e, 'The Spider'],
  [0x0f, 'The Gargoyle'],
  [0x10, 'Floating skull'],
  [0x11, 'Vampire Bat'],
  [0x12, 'The Wolf'],
  [0x13, 'The Wolf Man'],
  [0x15, 'The Mud Man'],
  [0x16, 'Grabber'],
  [0x17, 'The Zombie'],
  [0x18, 'Swamp ghoul'],
  [0x1b, 'Eagle'],
  [0x1d, 'Fire ghoul'],
  [0x1f, 'Slimey BarSinister'],
  [0x38, 'The Zombie Hand'],
  [0x39, 'The Pirate Skeleton'],
  [0x3a, 'The Mummy'],
  [0x3b, 'Harpy'],
  [0x3e, 'Rock'],
  [0x3f, 'Man-Eating Plant'],
  [0x40, 'High jump leech'],
  [0x41, 'Slimey BarSinister'],
  [0x42, 'Camilla'],
  [0x44, 'Death'],
  [0x4a, 'Dragon Bones']
]);

const SPRITE_MODEL_OVERRIDES = new Map([
  [0x04, {
    status: 'partial-static-dispatch-proof',
    note: 'Fishman dispatch routine eventually initializes selector-stream record $06 for body frames; projectile and water-emergence states are not fully unfolded in this atlas.',
    selectorRecordIndices: [0x06]
  }],
  [0x1f, {
    status: 'direct-selector-state-machine-partial',
    note: 'Mansion blob initializes through fixed-bank $DED0 with selector $3C, then its state machine advances the neutral animation to selector $3D.',
    directSelectors: [0x3c, 0x3d]
  }],
  [0x18, {
    status: 'dispatch-routine-local-selector-table-proof',
    note: 'Swamp ghoul writes animation selectors from the local ROM table at bank 1:$AF12 through STA $0300,x; the visible table bytes are $C0/$C1/$C2.',
    directSelectors: [0xc0, 0xc1, 0xc2]
  }],
  [0x15, {
    status: 'dispatch-routine-local-selector-table-proof',
    note: 'The Mud Man writes animation selectors from the local ROM table at bank 1:$A3E4 through STA $0300,x; the table bytes are $00/$59/$5A/$5B, with $00 as the hidden/no-sprite state and $59/$5A/$5B as the visible frames. The static scan also sees selector-record $1A in the adjacent lizardman initialization path, but that is not the visible Mud Man sprite model.',
    suppressScannedSelectorRecordIndices: [0x1a],
    directSelectors: [0x59, 0x5a, 0x5b]
  }],
  [0x41, {
    status: 'direct-selector-state-machine-partial',
    note: 'Slimey BarSinister initializes through fixed-bank $DED0 with selector $C3; the state routine toggles neutral animation selectors $C3/$C4 before later movement states.',
    directSelectors: [0xc3, 0xc4]
  }],
  [0x42, {
    status: 'direct-selector-partial',
    note: 'Camilla initializes through fixed-bank $DED0 with direct selector $CA; boss projectile/state behavior is outside this first whole-ROM enemy atlas pass.',
    directSelectors: [0xca]
  }],
  [0x44, {
    status: 'direct-selector-state-machine-partial',
    note: 'Death initializes direct selector $44 and writes follow-up selector $45 in the routine window; scythe/projectile behavior is not fully unfolded in this atlas.',
    directSelectors: [0x44, 0x45]
  }],
  [0x4a, {
    status: 'direct-selector-partial',
    note: 'Dragon Bones writes direct selector $56 in its initialization branch; projectile/spawn behavior is not fully unfolded in this atlas.',
    directSelectors: [0x56]
  }]
]);

const SPRITE_MODEL_BLOCKERS = new Map([
  [0x3b, 'Harpy dispatch is state-driven; decode any $DD8B selector-record setup calls before claiming the full metasprite sequence.']
]);

function hex(value, width = 2) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function parseHexNumber(value) {
  if (typeof value === 'number') {
    return value;
  }
  const text = String(value || '').trim();
  const normalized = text.startsWith('0x') || text.startsWith('0X') ? text.slice(2) : text;
  const parsed = Number.parseInt(normalized, 16);
  if (!Number.isFinite(parsed)) {
    throw new Error(`cannot parse hex value: ${value}`);
  }
  return parsed;
}

function titleCaseName(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function relativePath(filePath) {
  return filePath ? path.relative(process.cwd(), filePath) : filePath;
}

function publicManifestSource(source) {
  return {
    ...source,
    localPath: relativePath(source.localPath),
    coreFile: relativePath(source.coreFile),
    locationNamesFile: relativePath(source.locationNamesFile)
  };
}

function publicBytes(bytes) {
  return Array.from(bytes).map((byte) => hex(byte, 2));
}

function locationKey(source) {
  return [
    Number(source.objset),
    Number(source.area),
    Number(source.submap || 0)
  ].join(':');
}

function cpuAddressToFileOffset(romInfo, cpuAddress, bank = 0) {
  if (cpuAddress >= 0xc000 && cpuAddress <= 0xffff) {
    const fixedBank = romInfo.prgRomBanks - 1;
    return romInfo.prgStart + fixedBank * 0x4000 + (cpuAddress - 0xc000);
  }
  if (cpuAddress >= 0x8000 && cpuAddress <= 0xbfff) {
    return romInfo.prgStart + bank * 0x4000 + (cpuAddress - 0x8000);
  }
  throw new Error(`CPU address ${hex(cpuAddress, 4)} is outside PRG ROM`);
}

function readRoutineBytes(rom, info, cpuAddress, bank, length) {
  const bytes = [];
  for (let offset = 0; offset < length; offset += 1) {
    bytes.push(readPrgByte(rom, info, cpuAddress + offset, { bank }));
  }
  return bytes;
}

function readCpuBytes(rom, info, cpuAddress, length, opts = {}) {
  const bytes = [];
  for (let offset = 0; offset < length; offset += 1) {
    bytes.push(readPrgByte(rom, info, cpuAddress + offset, opts));
  }
  return bytes;
}

function buildAtlasIndex(atlasPath) {
  const raw = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
  const byContext = new Map();
  for (const entry of raw.entries || []) {
    const key = locationKey(entry);
    if (!byContext.has(key)) {
      byContext.set(key, []);
    }
    byContext.get(key).push(entry);
  }
  return {
    path: atlasPath,
    raw,
    byContext
  };
}

function spriteVariantBankForAddress(address) {
  return address < 0xc000 ? 4 : undefined;
}

function resolveSpritePalette(rom, info, atlasEntry) {
  const selector = atlasEntry.recipe?.palette?.selector;
  if (!selector?.auxiliaryTransferId) {
    return {
      status: 'missing-auxiliary-transfer-id',
      variant: atlasEntry.variant
    };
  }

  const auxiliaryTransferId = parseHexNumber(selector.auxiliaryTransferId);
  const transferPointerAddress = SPRITE_TRANSFER_POINTER_TABLE + auxiliaryTransferId * 2;
  const variantAddress = readPrgWord(rom, info, transferPointerAddress, {
    bank: SPRITE_TRANSFER_POINTER_TABLE_BANK
  });
  const variantBank = spriteVariantBankForAddress(variantAddress);
  const commonBytes = readCpuBytes(rom, info, SPRITE_COMMON_PALETTE_ADDRESS, SPRITE_COMMON_PALETTE_LENGTH);
  const variantBytes = readCpuBytes(rom, info, variantAddress, SPRITE_VARIANT_PALETTE_LENGTH, {
    bank: variantBank
  });
  const paletteBytes = commonBytes.concat(variantBytes);

  return {
    status: 'resolved',
    variant: atlasEntry.variant,
    chrBanks: (atlasEntry.recipe?.chrBanks || []).map(parseHexNumber).map((value) => hex(value, 2)),
    paletteBytes: publicBytes(paletteBytes),
    source: {
      auxiliaryTransferId: hex(auxiliaryTransferId, 2),
      transferPointerTableAddress: hex(SPRITE_TRANSFER_POINTER_TABLE, 4),
      transferPointerTableBank: SPRITE_TRANSFER_POINTER_TABLE_BANK,
      transferPointerAddress: hex(transferPointerAddress, 4),
      variantAddress: hex(variantAddress, 4),
      variantBank: variantBank == null ? 'fixed' : variantBank,
      commonPaletteAddress: hex(SPRITE_COMMON_PALETTE_ADDRESS, 4),
      commonPaletteBytes: publicBytes(commonBytes),
      variantPaletteBytes: publicBytes(variantBytes),
      atlasEntryId: atlasEntry.id,
      atlasRecipeStatus: atlasEntry.recipe?.status
    }
  };
}

function paletteByDisplayedState(rom, info, atlasEntries, actualVariants) {
  const byVariant = new Map(atlasEntries.map((entry) => [entry.variant, entry]));
  const result = {};

  function assign(state, variant) {
    const entry = byVariant.get(variant);
    if (!entry) {
      result[state] = {
        status: 'missing-render-recipe-variant',
        requestedVariant: variant
      };
      return;
    }
    result[state] = resolveSpritePalette(rom, info, entry);
  }

  if (actualVariants.includes('fixed')) {
    assign('day', 'fixed');
    assign('night', 'fixed');
    result.fixed = result.day;
    return result;
  }

  if (actualVariants.includes('day')) {
    assign('day', 'day');
  } else {
    result.day = {
      status: 'not-applicable',
      reason: 'This enemy row is not active in the day variant.'
    };
  }

  if (actualVariants.includes('night')) {
    assign('night', 'night');
  } else {
    result.night = {
      status: 'not-applicable',
      reason: 'This enemy row is not active in the night variant.'
    };
  }

  return result;
}

function variantsForEnemyLocation(location, atlasEntries) {
  if (location.objset === 1 || atlasEntries.some((entry) => entry.variant === 'fixed')) {
    return ['fixed'];
  }

  if (location.objset === 0 && location.area >= 0 && location.area <= 6) {
    return ['night'];
  }

  const variants = new Set(atlasEntries.map((entry) => entry.variant).filter((variant) => variant === 'day' || variant === 'night'));
  if (variants.size > 0) {
    return Array.from(variants).sort((a, b) => (a === 'day' ? -1 : 1) - (b === 'day' ? -1 : 1));
  }

  return ['unresolved'];
}

function hpForEnemy(location, actorId, rowData, actualVariants) {
  const baseHp = rowData;
  if (actualVariants.includes('fixed') || location.objset === 1) {
    return {
      day: baseHp,
      night: baseHp,
      evidence: {
        policy: 'fixed-interior-row-hp',
        baseHp,
        rowData: hex(rowData, 2),
        source: 'rom-actor-row-data-byte+rom-hp-init-routine',
        rule: 'Object set $01 skips the night-strength ASL path, so fixed mansion/interior enemies display the row HP byte for both day and night.',
        rom: ENEMY_HP_ROM_INIT_PROOF
      }
    };
  }

  const doublesAtNight = !NIGHT_HP_EXCEPTION_ACTOR_IDS.has(actorId);
  return {
    day: actualVariants.includes('day') ? baseHp : null,
    night: actualVariants.includes('night') ? (doublesAtNight ? baseHp * 2 : baseHp) : null,
    evidence: {
      policy: doublesAtNight ? 'standard-night-double' : 'night-strength-exception',
      baseHp,
      rowData: hex(rowData, 2),
      source: 'rom-actor-row-data-byte+rom-hp-init-routine',
      rule: doublesAtNight
        ? 'Exterior enemies use the actor row data byte for day HP and the ROM night-strength path doubles it for night HP.'
        : 'This actor id is in the ROM night-strength exception list, so night HP remains the row HP byte.',
      variants: actualVariants,
      rom: ENEMY_HP_ROM_INIT_PROOF
    }
  };
}

function findRoutineSelectorInitializers(bytes) {
  const matches = [];
  for (let offset = 0; offset < bytes.length - 6; offset += 1) {
    if (
      bytes[offset] === 0xa9 &&
      (bytes[offset + 2] === 0x20 || bytes[offset + 2] === 0x4c) &&
      bytes[offset + 3] === 0xd8 &&
      bytes[offset + 4] === 0xde
    ) {
      matches.push({
        type: 'selector-record',
        offset,
        recordIndex: bytes[offset + 1],
        call: bytes[offset + 2] === 0x20 ? 'JSR $DED8' : 'JMP $DED8',
        bytes: publicBytes(bytes.slice(offset, offset + 5))
      });
    }

    if (
      bytes[offset] === 0xa9 &&
      (bytes[offset + 2] === 0x20 || bytes[offset + 2] === 0x4c) &&
      bytes[offset + 3] === 0x8b &&
      bytes[offset + 4] === 0xdd
    ) {
      matches.push({
        type: 'selector-record',
        offset,
        recordIndex: bytes[offset + 1],
        call: bytes[offset + 2] === 0x20 ? 'JSR $DD8B' : 'JMP $DD8B',
        bytes: publicBytes(bytes.slice(offset, offset + 5))
      });
    }

    if (
      bytes[offset] === 0xa9 &&
      bytes[offset + 2] === 0xa0 &&
      (bytes[offset + 4] === 0x20 || bytes[offset + 4] === 0x4c) &&
      bytes[offset + 5] === 0xd0 &&
      bytes[offset + 6] === 0xde
    ) {
      matches.push({
        type: 'direct-selector',
        offset,
        selector: bytes[offset + 3],
        call: bytes[offset + 4] === 0x20 ? 'JSR $DED0' : 'JMP $DED0',
        bytes: publicBytes(bytes.slice(offset, offset + 7))
      });
    }

    if (
      bytes[offset] === 0xa9 &&
      bytes[offset + 2] === 0x9d &&
      bytes[offset + 3] === 0x00 &&
      bytes[offset + 4] === 0x03
    ) {
      matches.push({
        type: 'direct-selector-write',
        offset,
        selector: bytes[offset + 1],
        call: 'STA $0300,x',
        bytes: publicBytes(bytes.slice(offset, offset + 5))
      });
    }
  }
  return matches.sort((a, b) => a.offset - b.offset);
}

function publicMetasprite(frame) {
  return {
    selector: hex(frame.selector, 2),
    pointer: {
      pointerTable: hex(frame.pointer.pointerTable, 4),
      pointerIndex: frame.pointer.pointerIndex,
      pointerAddress: hex(frame.pointer.pointerAddress, 4),
      target: hex(frame.pointer.target, 4),
      fileOffset: hex(frame.pointer.fileOffset, 5)
    },
    status: hex(frame.status, 2),
    count: frame.count,
    usesSharedShape: frame.usesSharedShape,
    shapePointer: frame.shapePointer == null ? null : hex(frame.shapePointer, 4),
    sprites: frame.sprites.map((sprite) => ({
      index: sprite.index,
      tile: hex(sprite.tile, 2),
      attr: hex(sprite.attr, 2),
      xOffset: sprite.xOffset,
      yOffset: sprite.yOffset,
      reusePreviousAttr: sprite.reusePreviousAttr,
      raw: {
        x: hex(sprite.raw.x, 2),
        y: hex(sprite.raw.y, 2)
      }
    }))
  };
}

function decodeSelectorRecordModel(rom, info, recordIndex) {
  const cpuAddress = SELECTOR_RECORD_BASE + recordIndex * 3;
  const record = decodeSelectorRecordAt(rom, info, cpuAddress);
  return {
    recordIndex,
    recordIndexHex: hex(recordIndex, 2),
    cpuAddress: hex(cpuAddress, 4),
    fileOffset: hex(record.fileOffset, 5),
    bytes: publicBytes(record.bytes),
    frameLimit: record.frameLimit,
    baseSelector: hex(record.baseSelector, 2),
    sidecar: hex(record.sidecar, 2),
    selectors: record.selectors.map((selector) => hex(selector, 2)),
    metasprites: record.selectors.map((selector) => publicMetasprite(decodeMetaspriteSelector(rom, info, selector)))
  };
}

function decodeDirectSelectorModel(rom, info, selector) {
  return publicMetasprite(decodeMetaspriteSelector(rom, info, selector));
}

function decodeSpriteModel(rom, info, actorId) {
  const dispatchPointer = readPrgWord(rom, info, ACTOR_DISPATCH_TABLE + actorId * 2, {
    bank: ACTOR_ROUTINE_BANK
  });
  const routineBytes = readRoutineBytes(rom, info, dispatchPointer, ACTOR_ROUTINE_BANK, ROUTINE_SCAN_BYTES);
  const routineMatches = findRoutineSelectorInitializers(routineBytes);
  const override = SPRITE_MODEL_OVERRIDES.get(actorId);
  const blocker = SPRITE_MODEL_BLOCKERS.get(actorId);
  const selectorRecordIndices = new Set();
  const directSelectors = new Set();
  let status = 'dispatch-routine-selector-proof';
  let note = 'Selector evidence is decoded from the actor dispatch target in PRG bank 1 and then resolved through the fixed-bank metasprite pointer tables.';

  for (const match of routineMatches) {
    if (match.type === 'selector-record') {
      selectorRecordIndices.add(match.recordIndex);
    } else if (match.type === 'direct-selector' || match.type === 'direct-selector-write') {
      directSelectors.add(match.selector);
    }
  }

  if (override) {
    status = override.status;
    note = override.note;
    for (const recordIndex of override.suppressScannedSelectorRecordIndices || []) {
      selectorRecordIndices.delete(recordIndex);
    }
    for (const recordIndex of override.selectorRecordIndices || []) {
      selectorRecordIndices.add(recordIndex);
    }
    for (const selector of override.directSelectors || []) {
      directSelectors.add(selector);
    }
  }

  if (blocker && selectorRecordIndices.size === 0 && directSelectors.size === 0) {
    status = 'blocked-full-sprite-decode-needed';
    note = blocker;
  } else if (selectorRecordIndices.size === 0 && directSelectors.size === 0) {
    status = 'blocked-no-selector-in-scan-window';
    note = 'The dispatch routine did not expose a simple $DED8 selector-stream or $DED0 direct-selector initializer in the static scan window; decode this actor state machine before claiming its full sprite model.';
  }

  return {
    status,
    note,
    dispatch: {
      tableAddress: hex(ACTOR_DISPATCH_TABLE, 4),
      tableBank: ACTOR_ROUTINE_BANK,
      pointerAddress: hex(ACTOR_DISPATCH_TABLE + actorId * 2, 4),
      targetAddress: hex(dispatchPointer, 4),
      targetFileOffset: hex(cpuAddressToFileOffset(info, dispatchPointer, ACTOR_ROUTINE_BANK), 5),
      scannedBytes: ROUTINE_SCAN_BYTES,
      initializerMatches: routineMatches.map((match) => ({
        ...match,
        recordIndex: match.recordIndex == null ? undefined : hex(match.recordIndex, 2),
        selector: match.selector == null ? undefined : hex(match.selector, 2)
      }))
    },
    selectorRecords: Array.from(selectorRecordIndices)
      .sort((a, b) => a - b)
      .map((recordIndex) => decodeSelectorRecordModel(rom, info, recordIndex)),
    directSelectors: Array.from(directSelectors)
      .sort((a, b) => a - b)
      .map((selector) => ({
        selector: hex(selector, 2),
        metasprite: decodeDirectSelectorModel(rom, info, selector)
      }))
  };
}

function readEnemyRowBytes(rom, actor) {
  const bytes = Array.from(rom.slice(actor.pointer, actor.pointer + 4));
  const expected = [actor.x, actor.y, actor.id, actor.data].map((value) => Number(value) & 0xff);
  const identityMatches = bytes.length === expected.length &&
    bytes[2] === expected[2] &&
    bytes[3] === expected[3];
  const positionMatches = bytes.length === expected.length &&
    bytes[0] === expected[0] &&
    bytes[1] === expected[1];
  return {
    bytes,
    expected,
    identityMatches,
    positionMatches
  };
}

function manualNameForActor(actorId) {
  const proven = MANUAL_NAME_EVIDENCE.get(actorId);
  const fallbackName = GENERIC_DISPLAY_NAMES.get(actorId);
  if (proven) {
    return {
      displayName: proven.manualName,
      manualName: proven.manualName,
      status: proven.status,
      evidence: proven.evidence,
      candidates: []
    };
  }

  return {
    displayName: fallbackName || titleCaseName(CV2R_OBJECTS.enemy[actorId]?.name),
    manualName: null,
    status: 'manual-match-unproven',
    evidence: 'No manual name is applied until the manual illustration/name is matched to this ROM actor class with sprite evidence.',
    candidates: MANUAL_NAME_CANDIDATES.get(actorId) || []
  };
}

function cv2rEnemyInfo(actorId) {
  const info = CV2R_OBJECTS.enemies.find((enemy) => enemy.id === actorId);
  if (!info) {
    return null;
  }
  return {
    name: info.name,
    pos: info.pos,
    boss: Boolean(info.boss),
    projectile: Boolean(info.projectile),
    immobile: Boolean(info.immobile),
    holdsItem: Boolean(info.holdsItem),
    spritePattern: info.sprite
  };
}

function buildOccurrence(rom, info, atlasIndex, location, actor, occurrenceIndex) {
  const row = readEnemyRowBytes(rom, actor);
  const atlasEntries = atlasIndex.byContext.get(locationKey(location)) || [];
  const actualVariants = variantsForEnemyLocation(location, atlasEntries);
  const hp = hpForEnemy(location, actor.id, actor.data, actualVariants);

  return {
    occurrenceIndex,
    actorId: hex(actor.id, 2),
    sourceName: actor.name,
    location: {
      id: location.id,
      name: location.name,
      sourceName: location.sourceName,
      objset: location.objset,
      objsetHex: hex(location.objset, 2),
      area: location.area,
      areaHex: hex(location.area, 2),
      submap: location.submap || 0,
      submapHex: hex(location.submap || 0, 2)
    },
    row: {
      fileOffset: hex(actor.pointer, 5),
      bank: actor.bank == null ? null : actor.bank,
      x: actor.x,
      y: actor.y,
      rawX: row.bytes[0],
      rawY: row.bytes[1],
      id: actor.id,
      idHex: hex(actor.id, 2),
      data: actor.data,
      dataHex: hex(actor.data, 2),
      bytes: publicBytes(row.bytes),
      expectedBytes: publicBytes(row.expected),
      byteCheck: row.identityMatches ? (row.positionMatches ? 'ok' : 'ok-manifest-position-normalized') : 'mismatch',
      positionByteCheck: row.positionMatches ? 'ok' : 'manifest-position-normalized',
      positionNote: row.positionMatches
        ? undefined
        : 'The ROM row pointer/id/data are proven, but the manifest x/y differs from raw row bytes because the source metadata applies a placement normalization for this actor class.'
    },
    actualVariants,
    hp: {
      day: hp.day,
      night: hp.night
    },
    hpEvidence: hp.evidence,
    paletteByDisplayedState: paletteByDisplayedState(rom, info, atlasEntries, actualVariants)
  };
}

function validationForOccurrences(occurrences) {
  const failures = [];
  for (const occurrence of occurrences) {
    if (!occurrence.row.byteCheck.startsWith('ok')) {
      failures.push(`${occurrence.location.id} ${occurrence.actorId} row byte check failed at ${occurrence.row.fileOffset}`);
    }
    if (occurrence.actualVariants.includes('unresolved')) {
      failures.push(`${occurrence.location.id} ${occurrence.actorId} has unresolved render variants`);
    }
    for (const state of ['day', 'night']) {
      const palette = occurrence.paletteByDisplayedState[state];
      if (!palette || palette.status === 'missing-render-recipe-variant') {
        failures.push(`${occurrence.location.id} ${occurrence.actorId} missing ${state} palette evidence`);
      }
    }
  }

  return {
    type: 'enemy-occurrence-row-hp-palette-validation',
    status: failures.length === 0 ? 'ok' : 'failed',
    checkedOccurrences: occurrences.length,
    failures
  };
}

function summarizeHpPolicies(occurrences) {
  return occurrences.reduce((counts, occurrence) => {
    const policy = occurrence.hpEvidence.policy;
    counts[policy] = (counts[policy] || 0) + 1;
    return counts;
  }, {});
}

function buildEnemyClass(actorId, occurrences, spriteModel) {
  const manual = manualNameForActor(actorId);
  const cv2r = cv2rEnemyInfo(actorId);
  const locations = new Map();
  const rowHpBytes = new Set();
  const variants = new Set();

  for (const occurrence of occurrences) {
    locations.set(occurrence.location.id, occurrence.location);
    rowHpBytes.add(occurrence.row.data);
    for (const variant of occurrence.actualVariants) {
      variants.add(variant);
    }
  }

  return {
    actorId: hex(actorId, 2),
    displayName: manual.displayName,
    manualName: manual.manualName,
    manualNameStatus: manual.status,
    manualNameEvidence: manual.evidence,
    manualNameCandidates: manual.candidates,
    cv2r,
    rowCount: occurrences.length,
    locationCount: locations.size,
    mapSections: Array.from(locations.values()).sort((a, b) => a.id.localeCompare(b.id)),
    rowHpBytes: Array.from(rowHpBytes).sort((a, b) => a - b).map((value) => hex(value, 2)),
    actualVariants: Array.from(variants).sort(),
    spriteModel,
    occurrenceIndexes: occurrences.map((occurrence) => occurrence.occurrenceIndex)
  };
}

function buildEnemyAtlas(rom, info, opts = {}) {
  const atlasPath = path.resolve(opts.atlasPath || path.join('out', 'render-recipe-atlas', 'manifest.json'));
  const atlasIndex = buildAtlasIndex(atlasPath);
  const manifest = buildManifest();
  const occurrences = [];
  const byActorId = new Map();

  for (const location of manifest.locations) {
    for (const actor of location.actors) {
      if (actor.kind !== 'enemy') {
        continue;
      }
      const occurrence = buildOccurrence(rom, info, atlasIndex, location, actor, occurrences.length);
      occurrences.push(occurrence);
      if (!byActorId.has(actor.id)) {
        byActorId.set(actor.id, []);
      }
      byActorId.get(actor.id).push(occurrence);
    }
  }

  const classes = Array.from(byActorId.entries())
    .sort(([a], [b]) => a - b)
    .map(([actorId, classOccurrences]) => buildEnemyClass(
      actorId,
      classOccurrences,
      decodeSpriteModel(rom, info, actorId)
    ));

  const validation = validationForOccurrences(occurrences);
  const spriteDecodeStatuses = classes.reduce((counts, enemyClass) => {
    const status = enemyClass.spriteModel.status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  const manualNameStatuses = classes.reduce((counts, enemyClass) => {
    const status = enemyClass.manualNameStatus;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      rom: {
        file: relativePath(info.file),
        sha256: info.sha256
      },
      manifest: publicManifestSource(manifest.source),
      renderRecipeAtlas: {
        path: path.relative(process.cwd(), atlasPath),
        schemaVersion: atlasIndex.raw.schemaVersion,
        entries: atlasIndex.raw.entries?.length || 0
      },
      manual: MANUAL_SOURCE,
      method: [
        'Inventory every cv2r manifest actor row whose kind is enemy.',
        'Byte-check every manifest enemy row against the ROM file offset carried by the manifest.',
        'Derive day/night HP from the actor row data byte plus the ROM HP initializer rule.',
        'Resolve sprite palettes through the validated render-recipe atlas auxiliary transfer id and the PRG-bank-7 transfer pointer table.',
        'Decode actor dispatch targets from PRG bank 1 and resolve selector-stream/direct-selector evidence through fixed-bank metasprite tables.',
        'Use manual names only for actor classes with sprite/name match evidence; otherwise carry candidates separately.'
      ]
    },
    summary: {
      enemyRows: occurrences.length,
      enemyClasses: classes.length,
      enemyLocationCount: new Set(occurrences.map((occurrence) => occurrence.location.id)).size,
      hpPolicies: summarizeHpPolicies(occurrences),
      spriteDecodeStatuses,
      manualNameStatuses
    },
    validations: [
      validation
    ],
    classes,
    occurrences
  };
}

function writeEnemyAtlas(filePath, atlas) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(atlas, null, 2)}\n`);
}

module.exports = {
  buildEnemyAtlas,
  writeEnemyAtlas
};
