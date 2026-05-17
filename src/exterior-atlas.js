'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte, readPrgWord, toHex } = require('./background');
const {
  AREA_TABLE_POINTERS,
  BACKGROUND_TABLE_BANK,
  SCREEN_RECORD_POINTERS_OFFSET
} = require('./background-context');
const { buildManifest } = require('./manifest');
const {
  deriveLayoutContext,
  renderLayoutSegment
} = require('./layout-segments');
const { writePng } = require('./png');

const PATTERN_TABLE_CPU_ADDRESS = 0xb720;
const OBJSET_PATTERN_OFFSET = 0x30;
const MAP_SIZE_BY_OBJSET = [2, 4, 4, 5, 2, 2];
const BANK_7_PALETTE_POINTER_TABLE = 0x88b0;

const TEMPLATE_BY_OBJSET = {
  0: {
    id: 'town-exterior-day',
    label: 'Town exterior, day',
    confidence: 'validated-template',
    confidenceNote: 'Jova town validates at 0-pixel PNG diff; other towns reuse the same object-set tile format.',
    chrBanks: [0x00, 0x01],
    paletteAddress: 0x9ea2,
    paletteStrategy: 'town-layout-palette-table',
    widthBlocks: 8,
    heightBlocks: 8
  },
  1: {
    id: 'mansion-door-day',
    label: 'Mansion door exterior, day',
    confidence: 'inferred-template',
    confidenceNote: 'Renderable exterior landmark; CHR/palette selection is an atlas v0 inference.',
    chrBanks: [0x04, 0x05],
    paletteAddress: 0x9fe8,
    paletteStrategy: 'object-set-fallback',
    widthBlocks: 8,
    heightBlocks: 7
  },
  2: {
    id: 'overworld-woods-day',
    label: 'Overworld woods/routes, day',
    confidence: 'validated-template',
    confidenceNote: 'Jova Woods validates at 0-pixel PNG diff; the rest of objset 2 uses the same tile-set path.',
    chrBanks: [0x02, 0x03],
    paletteAddress: 0x9fc6,
    paletteStrategy: 'object-set-fallback',
    widthBlocks: 8,
    heightBlocks: 7
  },
  3: {
    id: 'cemetery-marsh-woods-day',
    label: 'Cemetery/marsh/woods exterior, day',
    confidence: 'inferred-template',
    confidenceNote: 'Tile-set path is derived from the ROM; CHR/palette selection still needs emulator validation.',
    chrBanks: [0x04, 0x05],
    paletteAddress: 0x9fe8,
    paletteStrategy: 'object-set-fallback',
    widthBlocks: 8,
    heightBlocks: 7
  },
  4: {
    id: 'mountain-ditch-bridge-day',
    label: 'Mountain/ditch/bridge exterior, day',
    confidence: 'inferred-template',
    confidenceNote: 'Tile-set path is derived from the ROM; CHR/palette selection still needs emulator validation.',
    chrBanks: [0x08, 0x09],
    paletteAddress: 0xa070,
    paletteStrategy: 'object-set-fallback',
    widthBlocks: 8,
    heightBlocks: 7
  },
  5: {
    id: 'castlevania-exterior-day',
    label: 'Castlevania exterior, day',
    confidence: 'inferred-template',
    confidenceNote: 'Included as the exterior castle approach; Dracula fight remains excluded.',
    chrBanks: [0x06, 0x07],
    paletteAddress: 0xa0c5,
    paletteStrategy: 'object-set-fallback',
    widthBlocks: 8,
    heightBlocks: 7
  }
};

const CATEGORY_BY_OBJSET = {
  0: 'town-exteriors',
  1: 'mansion-door-exteriors',
  2: 'western-overworld',
  3: 'eastern-overworld',
  4: 'mountains-and-castle-approach',
  5: 'castlevania-exterior'
};

function hex(value, width = 2) {
  if (value == null) {
    return undefined;
  }
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function locationId(loc) {
  return [
    `obj${Number(loc.objset).toString(16).padStart(2, '0')}`,
    `area${Number(loc.area).toString(16).padStart(2, '0')}`,
    `sub${Number(loc.submap || 0).toString(16).padStart(2, '0')}`,
    slugify(loc.name)
  ].join('-');
}

function isExteriorCandidate(loc) {
  if (loc.boss) {
    return false;
  }
  if (loc.objset === 0) {
    return loc.area <= 0x06;
  }
  if (loc.objset === 1) {
    return / - Door$/.test(loc.name);
  }
  if ([2, 3, 4].includes(loc.objset)) {
    return true;
  }
  if (loc.objset === 5) {
    return loc.name === 'Castlevania';
  }
  return false;
}

function readBackgroundTableWord(rom, info, cpuAddress) {
  return readPrgWord(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readBackgroundTableByte(rom, info, cpuAddress) {
  return readPrgByte(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readByteList(rom, info, cpuAddress, count) {
  const bytes = [];
  for (let index = 0; index < count; index += 1) {
    bytes.push(readBackgroundTableByte(rom, info, cpuAddress + index));
  }
  return bytes;
}

function readScreenRecord(rom, info, loc) {
  const submap = loc.submap || 0;
  const areaTableAddress = readBackgroundTableWord(rom, info, AREA_TABLE_POINTERS + loc.objset * 2);
  const areaRecordAddress = readBackgroundTableWord(rom, info, areaTableAddress + loc.area * 2);
  const pointerAddress = areaRecordAddress + SCREEN_RECORD_POINTERS_OFFSET + submap * 2;
  const address = readBackgroundTableWord(rom, info, pointerAddress);
  const bytes = readByteList(rom, info, address, 8);
  const rawLayoutIndex = bytes[0];
  const specialLayoutIndex = (rawLayoutIndex === 0xfd || rawLayoutIndex === 0xfe) ? bytes[1] : undefined;

  return {
    areaTableAddress,
    areaRecordAddress,
    pointerAddress,
    address,
    bytes,
    rawLayoutIndex,
    specialLayoutIndex,
    layoutIndex: specialLayoutIndex ?? rawLayoutIndex,
    layoutIndexSource: specialLayoutIndex == null ? 'screen-record-byte-0' : `special-${hex(rawLayoutIndex)}-byte-1`
  };
}

function patternPointerForLocation(loc) {
  const mapSize = MAP_SIZE_BY_OBJSET[loc.objset];
  if (mapSize == null) {
    return undefined;
  }
  return PATTERN_TABLE_CPU_ADDRESS +
    loc.objset * OBJSET_PATTERN_OFFSET +
    loc.area * mapSize +
    (loc.submap || 0);
}

function readPatternByte(rom, info, loc) {
  const pointer = patternPointerForLocation(loc);
  if (pointer == null) {
    return undefined;
  }
  return readPrgByte(rom, info, pointer, { bank: BACKGROUND_TABLE_BANK });
}

function readPalettePointer(rom, info, address) {
  return readPrgWord(rom, info, address, { bank: 7 });
}

function townPaletteAddress(rom, info, layoutIndex) {
  const pointerAddress = 0x88bb + layoutIndex * 2;
  const paletteAddress = readPalettePointer(rom, info, pointerAddress);
  if (paletteAddress >= 0x8000 && paletteAddress < 0xc000) {
    return {
      address: paletteAddress,
      pointerAddress,
      source: 'bank-7-town-layout-palette-table'
    };
  }
  return undefined;
}

function templateForLocation(rom, info, loc, screenRecord) {
  const base = TEMPLATE_BY_OBJSET[loc.objset];
  if (!base) {
    return undefined;
  }

  const template = { ...base };
  if (loc.objset === 0) {
    const townPalette = townPaletteAddress(rom, info, screenRecord.layoutIndex);
    if (townPalette) {
      template.paletteAddress = townPalette.address;
      template.palettePointerAddress = townPalette.pointerAddress;
      template.paletteStrategy = townPalette.source;
    }
  }
  return template;
}

function columnGroupsForHeader(rom, info, derivation) {
  const headerAddress = Number.parseInt(derivation.layoutHeader.address.slice(2), 16);
  const readOpts = derivation.layoutHeader.bank == null ? {} : { bank: derivation.layoutHeader.bank };
  const pointersPerSection = readPrgByte(rom, info, headerAddress, readOpts);
  if (!Number.isInteger(pointersPerSection) || pointersPerSection <= 0 || pointersPerSection > 8) {
    throw new Error(`layout header ${derivation.layoutHeader.address} has unsupported pointer count ${pointersPerSection}`);
  }
  return Array.from({ length: pointersPerSection }, (_, index) => index);
}

function buildSegmentForCandidate(loc, screenRecord, template) {
  return {
    id: `${locationId(loc)}-day`,
    label: `${loc.name}, day`,
    location: loc.name,
    variant: 'day',
    access: 'outdoor',
    paletteMode: 'day',
    status: template.confidence,
    validation: template.confidenceNote,
    runtimeContext: {
      objset: loc.objset,
      area: loc.area,
      submap: loc.submap || 0
    },
    layoutIndexOverride: screenRecord.specialLayoutIndex,
    layoutSection: 0,
    columnGroups: [],
    bgPatternBase: 0,
    template: template.id,
    templates: {
      [template.id]: {
        id: template.id,
        label: template.label,
        variant: 'day',
        access: 'outdoor',
        paletteMode: 'day',
        renderer: 'native-background-v1',
        chrBanks: template.chrBanks,
        layoutBank: BACKGROUND_TABLE_BANK,
        tileBank: 4,
        paletteBank: 4,
        paletteAddress: template.paletteAddress,
        widthBlocks: template.widthBlocks,
        heightBlocks: template.heightBlocks
      }
    }
  };
}

function publicDerivation(derivation) {
  return {
    runtimeContext: derivation.runtimeContext,
    screenRecord: derivation.screenRecord,
    layoutTable: derivation.layoutTable,
    layoutHeader: derivation.layoutHeader,
    tileSet: derivation.tileSet
  };
}

function publicTemplate(template) {
  return {
    id: template.id,
    label: template.label,
    confidence: template.confidence,
    confidenceNote: template.confidenceNote,
    chrBanks: template.chrBanks.map((bank) => hex(bank, 2)),
    paletteBank: 4,
    paletteAddress: hex(template.paletteAddress, 4),
    palettePointerAddress: hex(template.palettePointerAddress, 4),
    paletteStrategy: template.paletteStrategy,
    widthBlocks: template.widthBlocks,
    heightBlocks: template.heightBlocks
  };
}

function renderCandidate(rom, info, loc, outDir) {
  const id = locationId(loc);
  const screenRecord = readScreenRecord(rom, info, loc);
  const patternByte = readPatternByte(rom, info, loc);
  const template = templateForLocation(rom, info, loc, screenRecord);

  const base = {
    id,
    name: loc.name,
    category: CATEGORY_BY_OBJSET[loc.objset] || 'other',
    objset: loc.objset,
    objsetHex: hex(loc.objset, 2),
    area: loc.area,
    areaHex: hex(loc.area, 2),
    submap: loc.submap || 0,
    submapHex: hex(loc.submap || 0, 2),
    ceiling: Boolean(loc.ceiling),
    entryRoom: Boolean(loc.entryRoom),
    boss: Boolean(loc.boss),
    pattern: {
      pointerAddress: hex(patternPointerForLocation(loc), 4),
      value: hex(patternByte, 2),
      lowNibble: patternByte == null ? undefined : hex(patternByte & 0x0f, 1),
      highNibble: patternByte == null ? undefined : hex(patternByte >> 4, 1),
      maskedId: patternByte == null ? undefined : hex(patternByte & 0x1f, 2)
    },
    screenRecord: {
      areaTableAddress: hex(screenRecord.areaTableAddress, 4),
      areaRecordAddress: hex(screenRecord.areaRecordAddress, 4),
      pointerAddress: hex(screenRecord.pointerAddress, 4),
      address: hex(screenRecord.address, 4),
      firstBytes: screenRecord.bytes.map((byte) => hex(byte, 2)),
      rawLayoutIndex: hex(screenRecord.rawLayoutIndex, 2),
      layoutIndex: hex(screenRecord.layoutIndex, 2),
      layoutIndexSource: screenRecord.layoutIndexSource
    }
  };

  if (!template) {
    return {
      ...base,
      renderStatus: 'needs-template',
      renderNote: `No atlas template is defined for objset ${loc.objset}.`
    };
  }

  const segment = buildSegmentForCandidate(loc, screenRecord, template);
  const derivation = deriveLayoutContext(rom, info, segment);
  const columnGroups = columnGroupsForHeader(rom, info, derivation);
  segment.columnGroups = columnGroups;

  try {
    const rendered = renderLayoutSegment(rom, info, segment);
    const relativeOutput = path.join('images', `${id}.png`);
    const output = path.join(outDir, relativeOutput);
    writePng(output, rendered.width, rendered.height, rendered.rgba);

    return {
      ...base,
      renderStatus: 'rendered',
      confidence: template.confidence,
      confidenceNote: template.confidenceNote,
      template: publicTemplate(template),
      output: relativeOutput,
      width: rendered.width,
      height: rendered.height,
      layoutSection: rendered.metadata.layoutSection,
      columnGroups,
      columnGroupCount: columnGroups.length,
      derivation: publicDerivation(rendered.metadata.derivation),
      columns: rendered.metadata.columns.map((column) => ({
        index: column.index,
        columnGroup: column.columnGroup,
        layoutPointerAddress: column.layoutPointerAddress,
        layoutAddress: column.layoutAddress
      }))
    };
  } catch (error) {
    return {
      ...base,
      renderStatus: 'render-error',
      confidence: template.confidence,
      confidenceNote: template.confidenceNote,
      template: publicTemplate(template),
      renderNote: error.message,
      derivation: publicDerivation(derivation)
    };
  }
}

function summarize(candidates) {
  const summary = {
    candidates: candidates.length,
    rendered: 0,
    renderErrors: 0,
    byCategory: {},
    byObjset: {},
    byConfidence: {},
    specialScreenRecords: 0
  };

  for (const candidate of candidates) {
    if (candidate.renderStatus === 'rendered') {
      summary.rendered += 1;
    }
    if (candidate.renderStatus === 'render-error') {
      summary.renderErrors += 1;
    }
    if (candidate.screenRecord.layoutIndexSource !== 'screen-record-byte-0') {
      summary.specialScreenRecords += 1;
    }
    summary.byCategory[candidate.category] = (summary.byCategory[candidate.category] || 0) + 1;
    summary.byObjset[candidate.objsetHex] = (summary.byObjset[candidate.objsetHex] || 0) + 1;
    const confidence = candidate.confidence || candidate.renderStatus;
    summary.byConfidence[confidence] = (summary.byConfidence[confidence] || 0) + 1;
  }

  return summary;
}

function buildExteriorAtlas(rom, info) {
  const manifest = buildManifest();
  const locations = manifest.locations.filter(isExteriorCandidate);

  return {
    schemaVersion: 1,
    source: {
      rom: 'local iNES ROM',
      metadata: manifest.source,
      renderer: 'rom-native-layout-segment',
      notes: [
        'Atlas v0 renders layout-space segments directly from ROM layout pointers, metatiles, CHR banks, and palette bytes.',
        'Validated template confidence means at least one representative screen in that object set has exact emulator fixture parity.',
        'Inferred template confidence means the table paths resolve and render, but CHR/palette selection still needs representative fixture validation.'
      ]
    },
    constants: {
      patternTableCpuAddress: hex(PATTERN_TABLE_CPU_ADDRESS, 4),
      objsetPatternOffset: hex(OBJSET_PATTERN_OFFSET, 2),
      mapSizeByObjset: MAP_SIZE_BY_OBJSET,
      bank7PalettePointerTable: hex(BANK_7_PALETTE_POINTER_TABLE, 4)
    },
    templates: Object.values(TEMPLATE_BY_OBJSET).map(publicTemplate),
    candidates: locations
  };
}

function renderExteriorAtlas(rom, info, opts = {}) {
  const outDir = path.resolve(opts.outDir || path.join('out', 'exterior-atlas'));
  fs.rmSync(path.join(outDir, 'images'), { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, 'images'), { recursive: true });

  const atlas = buildExteriorAtlas(rom, info);
  const renderedCandidates = atlas.candidates.map((loc) => renderCandidate(rom, info, loc, outDir));
  const result = {
    ...atlas,
    summary: summarize(renderedCandidates),
    candidates: renderedCandidates
  };

  const manifestPath = path.join(outDir, 'manifest.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(
    path.join(outDir, 'atlas-data.js'),
    `window.EXTERIOR_ATLAS = ${JSON.stringify(result, null, 2)};\n`
  );

  return {
    output: outDir,
    manifest: manifestPath,
    summary: result.summary,
    candidates: result.candidates.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      renderStatus: candidate.renderStatus,
      confidence: candidate.confidence,
      output: candidate.output,
      width: candidate.width,
      height: candidate.height
    }))
  };
}

module.exports = {
  buildExteriorAtlas,
  isExteriorCandidate,
  renderExteriorAtlas
};
