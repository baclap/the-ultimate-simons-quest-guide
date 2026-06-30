'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte, readPrgWord } = require('./background');
const {
  AREA_TABLE_POINTERS,
  BACKGROUND_TABLE_BANK,
  SCREEN_RECORD_POINTERS_OFFSET
} = require('./background-context');
const { isExteriorCandidate, locationId } = require('./exterior-atlas');
const {
  deriveLayoutContext,
  renderLayoutSegment
} = require('./layout-segments');
const { buildManifest } = require('./manifest');
const { writePng } = require('./png');
const { createRuntimeContextResolver } = require('./runtime-context');

const DEFAULT_AUDIT_FILE = path.join('out', 'render-recipe-audit', 'audit.json');
const PALETTE_INDEX_POINTERS = 0xf7c5;
const BANK_7_TRANSFER_POINTER_TABLE = 0x8895;
const RAW_BACKGROUND_PALETTE_SENTINEL = 0x0f;

const FALLBACK_FAMILY_RECIPES = {
  0: {
    chrBanks: [0x00, 0x01],
    widthBlocks: 8,
    heightBlocks: 8,
    rowsPerLayoutSection: 7,
    confidence: 'projected',
    note: 'Town family is validated by Jova day/night probes.'
  },
  1: {
    chrBanks: [0x08, 0x09],
    widthBlocks: 8,
    heightBlocks: 7,
    confidence: 'projected',
    note: 'Mansion family uses Berkeley door/interior CHR evidence; layout validation is still pending.'
  },
  2: {
    chrBanks: [0x02, 0x03],
    widthBlocks: 8,
    heightBlocks: 7,
    confidence: 'projected',
    note: 'Objset 2 route family is validated by Jova Woods, Dora, and Dabi probes.'
  },
  3: {
    chrBanks: [0x04, 0x05],
    widthBlocks: 8,
    heightBlocks: 7,
    confidence: 'projected',
    note: 'Objset 3 family is validated by Camilla Cemetery day/night probes.'
  },
  4: {
    chrBanks: [0x06, 0x07],
    widthBlocks: 8,
    heightBlocks: 7,
    confidence: 'projected',
    note: 'Objset 4 route family is validated by Vrad Graveyard, Castlevania Bridge, and Deborah Cliff probes.'
  },
  5: {
    chrBanks: [0x0b, 0x0c],
    widthBlocks: 8,
    heightBlocks: 7,
    confidence: 'projected',
    note: 'Castlevania final area is validated by the fixed-palette final-area probe.'
  }
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

function parseInteger(value) {
  if (value == null) {
    return undefined;
  }
  if (Number.isInteger(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = value.startsWith('0x') || value.startsWith('0X')
      ? Number.parseInt(value.slice(2), 16)
      : Number.parseInt(value, 10);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }
  throw new Error(`invalid integer value ${value}`);
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

function contextKey(context, variant = '') {
  return [
    context.objset,
    context.area,
    context.submap || 0,
    variant
  ].join(':');
}

function familyKey(access, objset, variant) {
  return [access || 'unknown', objset, variant || 'day'].join(':');
}

function publicContext(context) {
  if (!context) {
    return undefined;
  }
  return {
    objset: hex(context.objset, 2),
    area: hex(context.area, 2),
    submap: hex(context.submap || 0, 2),
    submapRaw: hex(context.submapRaw, 2),
    submapFlags: hex(context.submapFlags, 2)
  };
}

function publicSelector(selector) {
  if (!selector) {
    return undefined;
  }
  return {
    ...selector,
    paletteIndexPointersAddress: hex(selector.paletteIndexPointersAddress, 4),
    paletteTableAddress: hex(selector.paletteTableAddress, 4),
    indexListPointerAddress: hex(selector.indexListPointerAddress, 4),
    indexListAddress: hex(selector.indexListAddress, 4),
    transferId: hex(selector.transferId, 2),
    auxiliaryTransferId: hex(selector.auxiliaryTransferId, 2),
    transferPointerTableAddress: hex(selector.transferPointerTableAddress, 4),
    transferPointerAddress: hex(selector.transferPointerAddress, 4)
  };
}

function contextFromPublic(raw) {
  if (!raw) {
    return undefined;
  }
  return {
    objset: parseInteger(raw.objset),
    area: parseInteger(raw.area),
    submap: parseInteger(raw.submap) || 0,
    submapRaw: parseInteger(raw.submapRaw),
    submapFlags: parseInteger(raw.submapFlags)
  };
}

function chrBanksFromAuditFixture(fixture) {
  const banks = (fixture.chr?.banks || []).map((bank) => {
    const match = bank.matches?.[0];
    return match ? parseInteger(match.bankHex ?? match.bank) : undefined;
  });
  return banks.every(Number.isInteger) ? banks : undefined;
}

function loadAuditEvidence(filePath = DEFAULT_AUDIT_FILE) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    return {
      file: resolved,
      summary: {},
      fixtures: [],
      deferred: [],
      exactByContext: new Map(),
      familyByKey: new Map()
    };
  }

  const audit = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  const exactByContext = new Map();
  const familyByKey = new Map();

  for (const fixture of audit.fixtures || []) {
    const chrBanks = chrBanksFromAuditFixture(fixture);
    const liveContext = contextFromPublic(fixture.live?.runtimeContext);
    const atlasContext = contextFromPublic(fixture.atlasContext) || liveContext;
    const selector = fixture.palette?.selector;
    const evidence = {
      id: fixture.id,
      label: fixture.label,
      access: fixture.access,
      variant: fixture.variant,
      status: fixture.evidenceStatus?.renderRecipe,
      chrBanks,
      palette: selector && {
        transferId: parseInteger(selector.transferId),
        paletteAddress: parseInteger(selector.paletteAddress),
        paletteBank: selector.paletteBank,
        status: selector.status
      },
      atlasContext,
      liveContext
    };

    if (atlasContext && fixture.variant) {
      exactByContext.set(contextKey(atlasContext, evidence.variant), evidence);
    }

    if (atlasContext && chrBanks?.length) {
      const key = familyKey(fixture.access, atlasContext.objset, evidence.variant);
      if (!familyByKey.has(key)) {
        familyByKey.set(key, evidence);
      }
    }
  }

  return {
    file: resolved,
    summary: audit.summary || {},
    fixtures: audit.fixtures || [],
    deferred: audit.deferred || [],
    exactByContext,
    familyByKey
  };
}

function readPalettePointer(rom, info, address) {
  return readPrgWord(rom, info, address, { bank: 7 });
}

function paletteBankForAddress(address) {
  return address < 0xc000 ? 4 : undefined;
}

function palettePointerAddressForTransferId(transferId) {
  return BANK_7_TRANSFER_POINTER_TABLE + transferId * 2;
}

function paletteFromRuntimeSelector(rom, info, paletteContext, variant) {
  const selectorVariant = variant === 'night' ? 'night' : 'day';
  const paletteTableAddress = readBackgroundTableWord(
    rom,
    info,
    PALETTE_INDEX_POINTERS + paletteContext.objset * 2
  );
  const variantOffset = selectorVariant === 'night' ? 2 : 0;
  const indexListPointerAddress = paletteTableAddress + paletteContext.area * 4 + variantOffset;
  const indexListAddress = readBackgroundTableWord(rom, info, indexListPointerAddress);
  const submap = (paletteContext.submap || 0) & 0x7f;
  const indexOffset = submap * 2;
  const transferId = readBackgroundTableByte(rom, info, indexListAddress + indexOffset);
  const auxiliaryTransferId = readBackgroundTableByte(rom, info, indexListAddress + indexOffset + 1);
  const pointerAddress = palettePointerAddressForTransferId(transferId);
  const paletteAddress = readPalettePointer(rom, info, pointerAddress);
  const bank = paletteBankForAddress(paletteAddress);

  if (readPrgByte(rom, info, paletteAddress, bank == null ? {} : { bank }) !== RAW_BACKGROUND_PALETTE_SENTINEL) {
    return {
      status: 'non-raw-transfer',
      address: paletteAddress,
      bank,
      pointerAddress,
      selectorVariant,
      selector: {
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

  return {
    status: 'resolved',
    address: paletteAddress,
    bank,
    pointerAddress,
    selectorVariant,
    selector: {
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

function readScreenRecord(rom, info, context) {
  const submap = context.submap || 0;
  const areaTableAddress = readBackgroundTableWord(rom, info, AREA_TABLE_POINTERS + context.objset * 2);
  const areaRecordAddress = readBackgroundTableWord(rom, info, areaTableAddress + context.area * 2);
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

function layoutGridForHeader(rom, info, derivation) {
  const headerAddress = parseInteger(derivation.layoutHeader.address);
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

function exteriorVariantsForLocation(loc) {
  if (loc.objset === 5) {
    return ['fixed'];
  }
  if ([0, 1, 2, 3, 4].includes(loc.objset)) {
    return ['day', 'night'];
  }
  return ['day'];
}

function accessForLocation(loc) {
  if (loc.objset === 0 && loc.area >= 0x07) {
    return 'town-interior';
  }
  if (loc.objset === 1) {
    return / - Door$/.test(loc.name) ? 'mansion-door' : 'mansion-interior';
  }
  if (loc.objset === 5) {
    return 'final-area';
  }
  return 'outdoor';
}

function isInteriorCandidate(loc) {
  if (loc.objset === 0) {
    return loc.area >= 0x07;
  }
  if (loc.objset === 1) {
    return !/ - Door$/.test(loc.name);
  }
  return false;
}

function isFinalAreaAtlasCandidate(loc) {
  return loc.objset === 5;
}

function interiorVariantsForLocation(loc) {
  if (loc.objset === 0) {
    return ['day'];
  }
  return ['fixed'];
}

function findManifestLocation(manifest, context) {
  return manifest.locations.find((loc) => (
    loc.objset === context.objset &&
    loc.area === context.area &&
    (loc.submap || 0) === (context.submap || 0)
  ));
}

function buildRecipeInputs(manifest, auditEvidence) {
  const exteriorInputs = manifest.locations
    .filter(isExteriorCandidate)
    .flatMap((loc) => exteriorVariantsForLocation(loc).map((variant) => ({
      id: `${locationId(loc)}-${variant}`,
      locationId: locationId(loc),
      name: loc.name,
      loc,
      layoutContext: {
        objset: loc.objset,
        area: loc.area,
        submap: loc.submap || 0
      },
      access: accessForLocation(loc),
      variant,
      source: 'exterior-atlas-candidate'
    })));

  const seenExteriorContexts = new Set(exteriorInputs.map((input) => (
    contextKey(input.layoutContext, input.variant)
  )));
  const finalAreaManifestInputs = manifest.locations
    .filter(isFinalAreaAtlasCandidate)
    .flatMap((loc) => exteriorVariantsForLocation(loc).map((variant) => ({
      id: `${locationId(loc)}-${variant}`,
      locationId: locationId(loc),
      name: loc.name,
      loc,
      layoutContext: {
        objset: loc.objset,
        area: loc.area,
        submap: loc.submap || 0
      },
      access: accessForLocation(loc),
      variant,
      source: 'final-area-manifest-candidate'
    })))
    .filter((input) => !seenExteriorContexts.has(contextKey(input.layoutContext, input.variant)));

  const interiorManifestInputs = manifest.locations
    .filter(isInteriorCandidate)
    .flatMap((loc) => interiorVariantsForLocation(loc).map((variant) => ({
      id: `${locationId(loc)}-${variant}`,
      locationId: locationId(loc),
      name: loc.name,
      loc,
      layoutContext: {
        objset: loc.objset,
        area: loc.area,
        submap: loc.submap || 0
      },
      access: accessForLocation(loc),
      variant,
      source: 'interior-manifest-candidate'
    })));

  const interiorInputs = [];
  const seen = new Set([...exteriorInputs, ...finalAreaManifestInputs, ...interiorManifestInputs].map((input) => contextKey(input.layoutContext, input.variant)));
  for (const fixture of auditEvidence.fixtures) {
    if (!['town-interior', 'mansion-interior'].includes(fixture.access)) {
      continue;
    }
    const liveContext = contextFromPublic(fixture.live?.runtimeContext);
    if (!liveContext) {
      continue;
    }
    const variant = fixture.variant;
    const key = contextKey(liveContext, variant);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    const loc = findManifestLocation(manifest, liveContext) || {
      name: fixture.label,
      objset: liveContext.objset,
      area: liveContext.area,
      submap: liveContext.submap || 0
    };
    interiorInputs.push({
      id: `${[
        `obj${Number(liveContext.objset).toString(16).padStart(2, '0')}`,
        `area${Number(liveContext.area).toString(16).padStart(2, '0')}`,
        `sub${Number(liveContext.submap || 0).toString(16).padStart(2, '0')}`,
        slugify(loc.name),
        variant
      ].join('-')}`,
      locationId: [
        `obj${Number(liveContext.objset).toString(16).padStart(2, '0')}`,
        `area${Number(liveContext.area).toString(16).padStart(2, '0')}`,
        `sub${Number(liveContext.submap || 0).toString(16).padStart(2, '0')}`,
        slugify(loc.name)
      ].join('-'),
      name: loc.name,
      loc,
      layoutContext: liveContext,
      access: fixture.access,
      variant,
      source: 'recipe-audit-interior-probe'
    });
  }

  return [...exteriorInputs, ...finalAreaManifestInputs, ...interiorManifestInputs, ...interiorInputs];
}

function resolvedPaletteContextForInput(input, runtimeContextResolver) {
  if (input.source !== 'exterior-atlas-candidate') {
    return {
      ...input.layoutContext,
      source: input.source === 'recipe-audit-interior-probe'
        ? 'live-audit-runtime-context'
        : 'rom-interior-context'
    };
  }

  const resolved = runtimeContextResolver?.resolvePaletteContext(input.loc);
  if (!resolved || resolved.source === 'cv2r-runtime-context') {
    return {
      ...input.layoutContext,
      source: 'cv2r-runtime-context'
    };
  }

  return {
    objset: resolved.objset,
    area: resolved.area,
    submap: resolved.submap || 0,
    submapRaw: resolved.submapRaw,
    submapFlags: resolved.submapFlags,
    source: resolved.source,
    note: resolved.note,
    original: resolved.original
  };
}

function deriveRenderRecipe(rom, info, input, auditEvidence, runtimeContextResolver) {
  const exactEvidence = auditEvidence.exactByContext.get(contextKey(input.layoutContext, input.variant));
  const familyEvidence = auditEvidence.familyByKey.get(familyKey(input.access, input.layoutContext.objset, input.variant));
  const fallback = FALLBACK_FAMILY_RECIPES[input.layoutContext.objset];
  const chrBanks = exactEvidence?.chrBanks || familyEvidence?.chrBanks || fallback?.chrBanks;
  const paletteContext = resolvedPaletteContextForInput(input, runtimeContextResolver);
  const palette = paletteFromRuntimeSelector(rom, info, paletteContext, input.variant);
  const evidenceStatus = exactEvidence
    ? 'validated'
    : (familyEvidence ? 'projected' : (fallback?.confidence || 'diagnostic'));
  const status = palette.status !== 'resolved' || !chrBanks
    ? 'blocked'
    : evidenceStatus;

  return {
    id: `${input.id}-recipe`,
    label: `${input.name}, ${input.variant}`,
    status,
    statusDetail: exactEvidence
      ? `Validated by ${exactEvidence.label}.`
      : (familyEvidence
        ? `Projected from ${familyEvidence.label}.`
        : (fallback?.note || 'No matching recipe family evidence yet.')),
    evidence: {
      exactFixture: exactEvidence && {
        id: exactEvidence.id,
        label: exactEvidence.label
      },
      familyFixture: familyEvidence && {
        id: familyEvidence.id,
        label: familyEvidence.label
      }
    },
    layoutContext: input.layoutContext,
    paletteContext,
    chrBanks,
    palette,
    widthBlocks: fallback?.widthBlocks || 8,
    heightBlocks: fallback?.heightBlocks || 7,
    rowsPerLayoutSection: fallback?.rowsPerLayoutSection
  };
}

function buildSegmentForRecipe(input, recipe, screenRecord) {
  return {
    id: input.id,
    label: recipe.label,
    location: input.name,
    variant: input.variant,
    access: input.access,
    paletteMode: input.variant,
    status: recipe.status,
    validation: recipe.statusDetail,
    runtimeContext: {
      objset: input.layoutContext.objset,
      area: input.layoutContext.area,
      submap: input.layoutContext.submap || 0
    },
    layoutIndexOverride: screenRecord.specialLayoutIndex,
    renderAllSections: true,
    columnGroups: [],
    bgPatternBase: 0,
    template: recipe.id,
    templates: {
      [recipe.id]: {
        id: recipe.id,
        label: recipe.label,
        variant: input.variant,
        access: input.access,
        paletteMode: input.variant,
        renderer: 'native-background-v1',
        chrBanks: recipe.chrBanks,
        layoutBank: BACKGROUND_TABLE_BANK,
        tileBank: 4,
        paletteBank: recipe.palette.bank,
        paletteAddress: recipe.palette.address,
        widthBlocks: recipe.widthBlocks,
        heightBlocks: recipe.heightBlocks,
        rowsPerLayoutSection: recipe.rowsPerLayoutSection
      }
    }
  };
}

function publicRecipe(recipe) {
  return {
    id: recipe.id,
    label: recipe.label,
    status: recipe.status,
    statusDetail: recipe.statusDetail,
    evidence: recipe.evidence,
    layoutContext: publicContext(recipe.layoutContext),
    paletteContext: publicContext(recipe.paletteContext),
    chrBanks: recipe.chrBanks?.map((bank) => hex(bank, 2)),
    palette: {
      status: recipe.palette.status,
      variant: recipe.palette.selectorVariant,
      bank: recipe.palette.bank,
      address: hex(recipe.palette.address, 4),
      pointerAddress: hex(recipe.palette.pointerAddress, 4),
      selector: publicSelector(recipe.palette.selector)
    },
    widthBlocks: recipe.widthBlocks,
    heightBlocks: recipe.heightBlocks,
    rowsPerLayoutSection: recipe.rowsPerLayoutSection
  };
}

function publicScreenRecord(record) {
  return {
    areaTableAddress: hex(record.areaTableAddress, 4),
    areaRecordAddress: hex(record.areaRecordAddress, 4),
    pointerAddress: hex(record.pointerAddress, 4),
    address: hex(record.address, 4),
    firstBytes: record.bytes.map((byte) => hex(byte, 2)),
    rawLayoutIndex: hex(record.rawLayoutIndex, 2),
    layoutIndex: hex(record.layoutIndex, 2),
    layoutIndexSource: record.layoutIndexSource
  };
}

function renderRecipeInput(rom, info, input, outDir, auditEvidence, runtimeContextResolver) {
  const screenRecord = readScreenRecord(rom, info, input.layoutContext);
  const recipe = deriveRenderRecipe(rom, info, input, auditEvidence, runtimeContextResolver);
  const base = {
    id: input.id,
    locationId: input.locationId,
    name: input.name,
    sourceName: input.loc?.sourceName,
    aliases: input.loc?.aliases,
    namingSource: input.loc?.namingSource,
    namingNote: input.loc?.namingNote,
    source: input.source,
    access: input.access,
    variant: input.variant,
    objset: input.layoutContext.objset,
    objsetHex: hex(input.layoutContext.objset, 2),
    area: input.layoutContext.area,
    areaHex: hex(input.layoutContext.area, 2),
    submap: input.layoutContext.submap || 0,
    submapHex: hex(input.layoutContext.submap || 0, 2),
    screenRecord: publicScreenRecord(screenRecord),
    recipe: publicRecipe(recipe)
  };

  if (recipe.status === 'blocked') {
    return {
      ...base,
      renderStatus: 'blocked',
      renderNote: recipe.statusDetail
    };
  }

  try {
    const segment = buildSegmentForRecipe(input, recipe, screenRecord);
    const derivation = deriveLayoutContext(rom, info, segment);
    const layoutGrid = layoutGridForHeader(rom, info, derivation);
    segment.columnGroups = layoutGrid.columnGroups;
    const rendered = renderLayoutSegment(rom, info, segment);
    const relativeOutput = path.join('images', `${input.id}.png`);
    const output = path.join(outDir, relativeOutput);
    writePng(output, rendered.width, rendered.height, rendered.rgba);

    return {
      ...base,
      renderStatus: 'rendered',
      output: relativeOutput,
      width: rendered.width,
      height: rendered.height,
      layoutSections: rendered.metadata.layoutSections,
      layoutGrid: rendered.metadata.layoutGrid,
      columnGroups: rendered.metadata.columnGroups,
      derivation: rendered.metadata.derivation
    };
  } catch (error) {
    return {
      ...base,
      renderStatus: 'render-error',
      renderNote: error.message
    };
  }
}

function summarize(entries) {
  const summary = {
    entries: entries.length,
    rendered: 0,
    blocked: 0,
    renderErrors: 0,
    byRecipeStatus: {},
    byVariant: {},
    byAccess: {}
  };

  for (const entry of entries) {
    if (entry.renderStatus === 'rendered') {
      summary.rendered += 1;
    }
    if (entry.renderStatus === 'blocked') {
      summary.blocked += 1;
    }
    if (entry.renderStatus === 'render-error') {
      summary.renderErrors += 1;
    }
    const recipeStatus = entry.recipe?.status || entry.renderStatus;
    summary.byRecipeStatus[recipeStatus] = (summary.byRecipeStatus[recipeStatus] || 0) + 1;
    summary.byVariant[entry.variant] = (summary.byVariant[entry.variant] || 0) + 1;
    summary.byAccess[entry.access] = (summary.byAccess[entry.access] || 0) + 1;
  }

  return summary;
}

function buildRenderRecipeAtlas(rom, info, opts = {}) {
  const manifest = buildManifest();
  const exteriorCandidates = manifest.locations.filter(isExteriorCandidate);
  const auditEvidence = loadAuditEvidence(opts.auditFile || DEFAULT_AUDIT_FILE);
  const runtimeContextResolver = createRuntimeContextResolver(rom, info, exteriorCandidates);
  const inputs = buildRecipeInputs(manifest, auditEvidence);
  const entries = inputs.map((input) => renderRecipeInput(
    rom,
    info,
    input,
    opts.outDir || path.join('out', 'render-recipe-atlas'),
    auditEvidence,
    runtimeContextResolver
  ));

  return {
    schemaVersion: 1,
    source: {
      renderer: 'rom-render-recipe-atlas',
      auditFile: path.relative(process.cwd(), auditEvidence.file) || auditEvidence.file,
      notes: [
        'Validated entries have exact save-state recipe probes.',
        'Projected entries reuse a validated family recipe but still need representative pixel validation.',
        'Interior manifest entries are ROM-table-promoted candidates; exact per-submap fixture validation is still required before treating a new interior as final guide truth.',
        'Diagnostic entries render from remaining inferred families and should not be treated as pixel-perfect.'
      ]
    },
    summary: summarize(entries),
    auditSummary: auditEvidence.summary,
    deferred: auditEvidence.deferred,
    entries
  };
}

function renderRecipeAtlas(rom, info, opts = {}) {
  const outDir = path.resolve(opts.outDir || path.join('out', 'render-recipe-atlas'));
  fs.rmSync(path.join(outDir, 'images'), { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, 'images'), { recursive: true });

  const atlas = buildRenderRecipeAtlas(rom, info, {
    auditFile: opts.auditFile,
    outDir
  });
  const manifestPath = path.join(outDir, 'manifest.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify(atlas, null, 2)}\n`);
  fs.writeFileSync(
    path.join(outDir, 'recipe-atlas-data.js'),
    `window.RENDER_RECIPE_ATLAS = ${JSON.stringify(atlas, null, 2)};\n`
  );

  return {
    output: outDir,
    manifest: manifestPath,
    summary: atlas.summary
  };
}

module.exports = {
  DEFAULT_AUDIT_FILE,
  buildRenderRecipeAtlas,
  deriveRenderRecipe,
  loadAuditEvidence,
  renderRecipeAtlas
};
