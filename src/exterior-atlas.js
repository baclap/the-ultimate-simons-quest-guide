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
const {
  createRuntimeContextResolver,
  paletteContextAliasesFromFixtures
} = require('./runtime-context');

const PATTERN_TABLE_CPU_ADDRESS = 0xb720;
const OBJSET_PATTERN_OFFSET = 0x30;
const MAP_SIZE_BY_OBJSET = [2, 4, 4, 5, 2, 2];
const PALETTE_INDEX_POINTERS = 0xf7c5;
const BANK_7_TRANSFER_POINTER_TABLE = 0x8895;
const RAW_BACKGROUND_PALETTE_SENTINEL = 0x0f;

const PALETTE_CONTEXT_ALIASES = paletteContextAliasesFromFixtures();

const TEMPLATE_BY_OBJSET = {
  0: {
    id: 'town-exterior-day',
    label: 'Town exterior, day',
    confidence: 'validated-template',
    confidenceNote: 'Jova town validates at 0-pixel PNG diff; other towns reuse the same object-set tile format.',
    chrBanks: [0x00, 0x01],
    paletteBank: 4,
    paletteAddress: 0x9ea2,
    paletteStrategy: 'object-set-fallback',
    widthBlocks: 8,
    heightBlocks: 8,
    rowsPerLayoutSection: 7
  },
  1: {
    id: 'mansion-door-day',
    label: 'Mansion door exterior, day',
    confidence: 'inferred-template',
    confidenceNote: 'Berkeley Mansion door fixture resolves live CHR banks 8/9 and palette selector $0F -> 4:$9F5E; layout crop validation remains pending.',
    chrBanks: [0x08, 0x09],
    paletteBank: 4,
    paletteAddress: 0x9f5e,
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
    paletteBank: 4,
    paletteAddress: 0x9fc6,
    paletteStrategy: 'object-set-fallback',
    widthBlocks: 8,
    heightBlocks: 7
  },
  3: {
    id: 'cemetery-marsh-woods-day',
    label: 'Cemetery/marsh/woods exterior, day',
    confidence: 'validated-template',
    confidenceNote: 'Camilla Cemetery fixtures resolve live CHR banks 4/5 and exact ROM selector palettes.',
    chrBanks: [0x04, 0x05],
    paletteBank: 4,
    paletteAddress: 0x9fe8,
    paletteStrategy: 'object-set-fallback',
    widthBlocks: 8,
    heightBlocks: 7
  },
  4: {
    id: 'mountain-ditch-bridge-day',
    label: 'Mountain/ditch/bridge exterior, day',
    confidence: 'validated-template',
    confidenceNote: 'Vrad Graveyard, Castlevania Bridge, and Deborah Cliff probes resolve live CHR banks 6/7 and exact ROM selector palettes.',
    chrBanks: [0x06, 0x07],
    paletteBank: 4,
    paletteAddress: 0xa070,
    paletteStrategy: 'object-set-fallback',
    widthBlocks: 8,
    heightBlocks: 7
  },
  5: {
    id: 'castlevania-final-area-fixed',
    label: 'Castlevania final area, fixed palette',
    confidence: 'validated-template',
    confidenceNote: 'Castlevania final-area fixture resolves live CHR banks 11/12 and exact ROM selector palette $57 -> 4:$A150.',
    chrBanks: [0x0b, 0x0c],
    paletteBank: 4,
    paletteAddress: 0xa150,
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
  5: 'castlevania-final-area'
};

function hex(value, width = 2) {
  if (value == null) {
    return undefined;
  }
  const number = Number(value);
  if (!Number.isInteger(number)) {
    throw new Error(`cannot format invalid hex value: ${value}`);
  }
  return `0x${number.toString(16).toUpperCase().padStart(width, '0')}`;
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

function paletteContextKey(loc) {
  return `${loc.objset}:${loc.area}:${loc.submap || 0}`;
}

function paletteContextForLocation(loc, runtimeContextResolver) {
  const resolved = runtimeContextResolver?.resolvePaletteContext(loc);
  if (resolved && resolved.source !== 'cv2r-runtime-context') {
    return {
      objset: resolved.objset,
      area: resolved.area,
      submap: resolved.submap || 0,
      source: resolved.source,
      submapRaw: resolved.submapRaw,
      submapFlags: resolved.submapFlags,
      note: resolved.note,
      screenRecordAlias: resolved.screenRecordAlias,
      original: resolved.original || {
        objset: loc.objset,
        area: loc.area,
        submap: loc.submap || 0
      }
    };
  }

  const alias = PALETTE_CONTEXT_ALIASES[paletteContextKey(loc)];
  if (!alias) {
    return {
      objset: loc.objset,
      area: loc.area,
      submap: loc.submap || 0,
      source: 'cv2r-runtime-context'
    };
  }

  return {
    objset: alias.objset,
    area: alias.area,
    submap: alias.submap || 0,
    source: alias.source,
    fixture: alias.fixture,
    submapRaw: alias.submapRaw,
    submapFlags: alias.submapFlags,
    note: alias.note,
    original: {
      objset: loc.objset,
      area: loc.area,
      submap: loc.submap || 0
    }
  };
}

function paletteBankForAddress(address) {
  return address < 0xc000 ? 4 : undefined;
}

function palettePointerAddressForTransferId(transferId) {
  return BANK_7_TRANSFER_POINTER_TABLE + transferId * 2;
}

function paletteFromRuntimeSelector(rom, info, loc, variant = 'day', runtimeContextResolver) {
  const selectorVariant = variant === 'night' ? 'night' : 'day';
  const context = paletteContextForLocation(loc, runtimeContextResolver);
  const paletteTableAddress = readBackgroundTableWord(rom, info, PALETTE_INDEX_POINTERS + context.objset * 2);
  const variantOffset = selectorVariant === 'night' ? 2 : 0;
  const indexListPointerAddress = paletteTableAddress + context.area * 4 + variantOffset;
  const indexListAddress = readBackgroundTableWord(rom, info, indexListPointerAddress);
  const submap = context.submap & 0x7f;
  const indexOffset = submap * 2;
  const transferId = readBackgroundTableByte(rom, info, indexListAddress + indexOffset);
  const auxiliaryTransferId = readBackgroundTableByte(rom, info, indexListAddress + indexOffset + 1);
  const pointerAddress = palettePointerAddressForTransferId(transferId);
  const paletteAddress = readPalettePointer(rom, info, pointerAddress);
  const bank = paletteBankForAddress(paletteAddress);

  if (readPrgByte(rom, info, paletteAddress, bank == null ? {} : { bank }) !== RAW_BACKGROUND_PALETTE_SENTINEL) {
    return undefined;
  }

  return {
    address: paletteAddress,
    bank,
    pointerAddress,
    source: 'runtime-palette-selector-table',
    note: context.note,
    selector: {
      variant,
      selectorVariant,
      context: {
        objset: context.objset,
        area: context.area,
        submap: context.submap,
        source: context.source,
        fixture: context.fixture,
        submapRaw: context.submapRaw,
        submapFlags: context.submapFlags,
        screenRecordAlias: context.screenRecordAlias,
        original: context.original
      },
      paletteIndexPointersAddress: PALETTE_INDEX_POINTERS,
      paletteTableAddress,
      indexListPointerAddress,
      indexListAddress,
      indexOffset,
      transferId,
      auxiliaryTransferId,
      transferPointerTableAddress: BANK_7_TRANSFER_POINTER_TABLE,
      transferPointerAddress: pointerAddress
    }
  };
}

function templateForLocation(rom, info, loc, runtimeContextResolver) {
  const base = TEMPLATE_BY_OBJSET[loc.objset];
  if (!base) {
    return undefined;
  }

  const template = { ...base };
  const palette = paletteFromRuntimeSelector(
    rom,
    info,
    loc,
    loc.objset === 5 ? 'fixed' : 'day',
    runtimeContextResolver
  );
  if (palette) {
    template.paletteAddress = palette.address;
    template.paletteBank = palette.bank;
    template.palettePointerAddress = palette.pointerAddress;
    template.paletteStrategy = palette.source;
    template.paletteNote = palette.note;
    template.paletteSelector = palette.selector;
  }

  return template;
}

function variantForLocation(loc) {
  return loc.objset === 5 ? 'fixed' : 'day';
}

function accessForLocation(loc) {
  if (loc.objset === 1) {
    return 'mansion-door';
  }
  if (loc.objset === 5) {
    return 'final-area';
  }
  return 'outdoor';
}

function layoutGridForHeader(rom, info, derivation) {
  const headerAddress = Number.parseInt(derivation.layoutHeader.address.slice(2), 16);
  const readOpts = derivation.layoutHeader.bank == null ? {} : { bank: derivation.layoutHeader.bank };
  const columns = readPrgByte(rom, info, headerAddress, readOpts);
  const rows = readPrgByte(rom, info, headerAddress + 1, readOpts);
  if (!Number.isInteger(columns) || columns <= 0 || columns > 8) {
    throw new Error(`layout header ${derivation.layoutHeader.address} has unsupported column count ${columns}`);
  }
  if (!Number.isInteger(rows) || rows <= 0 || rows > 8) {
    throw new Error(`layout header ${derivation.layoutHeader.address} has unsupported row count ${rows}`);
  }
  return {
    columns,
    rows,
    totalPointers: columns * rows,
    columnGroups: Array.from({ length: columns }, (_, index) => index),
    layoutSections: Array.from({ length: rows }, (_, index) => index)
  };
}

function buildSegmentForCandidate(loc, screenRecord, template) {
  const variant = variantForLocation(loc);
  const access = accessForLocation(loc);
  return {
    id: `${locationId(loc)}-${variant}`,
    label: `${loc.name}, ${variant}`,
    location: loc.name,
    variant,
    access,
    paletteMode: variant,
    status: template.confidence,
    validation: template.confidenceNote,
    runtimeContext: {
      objset: loc.objset,
      area: loc.area,
      submap: loc.submap || 0
    },
    layoutIndexOverride: screenRecord.specialLayoutIndex,
    renderAllSections: true,
    columnGroups: [],
    bgPatternBase: 0,
    template: template.id,
    templates: {
      [template.id]: {
        id: template.id,
        label: template.label,
        variant,
        access,
        paletteMode: variant,
        renderer: 'native-background-v1',
        chrBanks: template.chrBanks,
        layoutBank: BACKGROUND_TABLE_BANK,
        tileBank: 4,
        paletteBank: template.paletteBank,
        paletteAddress: template.paletteAddress,
        widthBlocks: template.widthBlocks,
        heightBlocks: template.heightBlocks,
        rowsPerLayoutSection: template.rowsPerLayoutSection
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
    paletteBank: template.paletteBank,
    paletteAddress: hex(template.paletteAddress, 4),
    palettePointerAddress: hex(template.palettePointerAddress, 4),
    paletteStrategy: template.paletteStrategy,
    paletteNote: template.paletteNote,
    paletteSelector: template.paletteSelector && {
      ...template.paletteSelector,
      paletteIndexPointersAddress: hex(template.paletteSelector.paletteIndexPointersAddress, 4),
      paletteTableAddress: hex(template.paletteSelector.paletteTableAddress, 4),
      indexListPointerAddress: hex(template.paletteSelector.indexListPointerAddress, 4),
      indexListAddress: hex(template.paletteSelector.indexListAddress, 4),
      transferId: hex(template.paletteSelector.transferId, 2),
      auxiliaryTransferId: hex(template.paletteSelector.auxiliaryTransferId, 2),
      transferPointerTableAddress: hex(template.paletteSelector.transferPointerTableAddress, 4),
      transferPointerAddress: hex(template.paletteSelector.transferPointerAddress, 4)
    },
    widthBlocks: template.widthBlocks,
    heightBlocks: template.heightBlocks,
    rowsPerLayoutSection: template.rowsPerLayoutSection
  };
}

function renderCandidate(rom, info, loc, outDir, runtimeContextResolver) {
  const id = locationId(loc);
  const screenRecord = readScreenRecord(rom, info, loc);
  const patternByte = readPatternByte(rom, info, loc);
  const template = templateForLocation(rom, info, loc, runtimeContextResolver);

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
  const layoutGrid = layoutGridForHeader(rom, info, derivation);
  const columnGroups = layoutGrid.columnGroups;
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
      layoutSections: rendered.metadata.layoutSections,
      layoutGrid: {
        columns: layoutGrid.columns,
        rows: layoutGrid.rows,
        totalPointers: layoutGrid.totalPointers,
        renderedColumns: rendered.metadata.layoutGrid.renderedColumns,
        renderedRows: rendered.metadata.layoutGrid.renderedRows
      },
      columnGroups,
      columnGroupCount: columnGroups.length,
      sectionCount: layoutGrid.rows,
      layoutCellCount: rendered.metadata.columns.length,
      derivation: publicDerivation(rendered.metadata.derivation),
      columns: rendered.metadata.columns.map((column) => ({
        index: column.index,
        section: column.section,
        sectionIndex: column.sectionIndex,
        columnGroup: column.columnGroup,
        columnIndex: column.columnIndex,
        x: column.x,
        y: column.y,
        width: column.width,
        height: column.height,
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
    specialScreenRecords: 0,
    multiSectionLayouts: 0
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
    if ((candidate.sectionCount || 1) > 1) {
      summary.multiSectionLayouts += 1;
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
        'Layout headers are decoded as column-group by vertical-section grids; atlas rendering covers every section in the header.',
        'Validated template confidence means at least one representative screen in that object set has exact emulator fixture parity.',
        'Inferred template confidence means the table paths resolve and render, but CHR/palette selection still needs representative fixture validation.'
      ]
    },
    constants: {
      patternTableCpuAddress: hex(PATTERN_TABLE_CPU_ADDRESS, 4),
      objsetPatternOffset: hex(OBJSET_PATTERN_OFFSET, 2),
      mapSizeByObjset: MAP_SIZE_BY_OBJSET,
      paletteIndexPointers: hex(PALETTE_INDEX_POINTERS, 4),
      bank7TransferPointerTable: hex(BANK_7_TRANSFER_POINTER_TABLE, 4),
      runtimeContextFixtures: 'data/runtime-context-fixtures.json',
      runtimeContextResolver: 'direct-runtime-context'
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
  const runtimeContextResolver = createRuntimeContextResolver(rom, info, atlas.candidates);
  const renderedCandidates = atlas.candidates.map((loc) => (
    renderCandidate(rom, info, loc, outDir, runtimeContextResolver)
  ));
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
  locationId,
  renderExteriorAtlas
};
