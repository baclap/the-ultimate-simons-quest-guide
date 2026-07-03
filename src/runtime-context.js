'use strict';

const fs = require('fs');
const path = require('path');
const {
  readPrgByte,
  readPrgWord,
  toHex
} = require('./background');
const {
  AREA_TABLE_POINTERS,
  BACKGROUND_TABLE_BANK,
  SCREEN_RECORD_POINTERS_OFFSET
} = require('./background-context');

const RUNTIME_CONTEXT_ADDRESSES = {
  objset: 0x0030,
  area: 0x0050,
  submapRaw: 0x0051,
  actorPointerLow: 0x003d,
  actorPointerHigh: 0x003e,
  tileSetPointerLow: 0x0063,
  tileSetPointerHigh: 0x0064
};

const DEFAULT_FIXTURE_FILE = path.join(__dirname, '..', 'data', 'runtime-context-fixtures.json');
const SPECIAL_SCREEN_RECORD_MARKERS = new Set([0xfd, 0xfe]);
const MAX_SPECIAL_ALIAS_DISTANCE = 0x20;
const ENABLE_SPECIAL_SCREEN_RECORD_PALETTE_ALIASES = false;

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

function parseInteger(value, label) {
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
  throw new Error(`${label} must be an integer`);
}

function readWord(bytes, lowAddress, highAddress) {
  return bytes[lowAddress] | (bytes[highAddress] << 8);
}

function extractRuntimeContextFromCpuRam(bytes) {
  if (!Buffer.isBuffer(bytes) && !(bytes instanceof Uint8Array)) {
    throw new Error('CPU RAM bytes must be a Buffer or Uint8Array');
  }
  if (bytes.length < 0x0800) {
    throw new Error(`CPU RAM dump must include at least 0x0800 bytes; got ${bytes.length}`);
  }

  const submapRaw = bytes[RUNTIME_CONTEXT_ADDRESSES.submapRaw];

  return {
    objset: bytes[RUNTIME_CONTEXT_ADDRESSES.objset],
    area: bytes[RUNTIME_CONTEXT_ADDRESSES.area],
    submap: submapRaw & 0x7f,
    submapRaw,
    submapFlags: submapRaw & 0x80,
    actorPointer: readWord(
      bytes,
      RUNTIME_CONTEXT_ADDRESSES.actorPointerLow,
      RUNTIME_CONTEXT_ADDRESSES.actorPointerHigh
    ),
    tileSetPointer: readWord(
      bytes,
      RUNTIME_CONTEXT_ADDRESSES.tileSetPointerLow,
      RUNTIME_CONTEXT_ADDRESSES.tileSetPointerHigh
    )
  };
}

function publicRuntimeContext(context) {
  return {
    objset: hex(context.objset, 2),
    area: hex(context.area, 2),
    submap: hex(context.submap, 2),
    submapRaw: hex(context.submapRaw, 2),
    submapFlags: hex(context.submapFlags, 2),
    actorPointer: hex(context.actorPointer, 4),
    tileSetPointer: hex(context.tileSetPointer, 4)
  };
}

function normalizeSimpleContext(raw, label) {
  return {
    objset: parseInteger(raw.objset, `${label}.objset`),
    area: parseInteger(raw.area, `${label}.area`),
    submap: parseInteger(raw.submap, `${label}.submap`)
  };
}

function normalizeRuntimeContext(raw, label) {
  const submapRaw = raw.submapRaw == null
    ? parseInteger(raw.submap, `${label}.submap`)
    : parseInteger(raw.submapRaw, `${label}.submapRaw`);
  return {
    ...normalizeSimpleContext(raw, label),
    submapRaw,
    submapFlags: raw.submapFlags == null
      ? submapRaw & 0x80
      : parseInteger(raw.submapFlags, `${label}.submapFlags`),
    actorPointer: raw.actorPointer == null
      ? undefined
      : parseInteger(raw.actorPointer, `${label}.actorPointer`),
    tileSetPointer: raw.tileSetPointer == null
      ? undefined
      : parseInteger(raw.tileSetPointer, `${label}.tileSetPointer`)
  };
}

function contextKey(context) {
  return `${context.objset}:${context.area}:${context.submap}`;
}

function contextsEqual(left, right) {
  return left.objset === right.objset &&
    left.area === right.area &&
    left.submap === right.submap;
}

function readBackgroundTableByte(rom, info, cpuAddress) {
  return readPrgByte(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readBackgroundTableWord(rom, info, cpuAddress) {
  return readPrgWord(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function normalizeLocationContext(loc) {
  return {
    objset: loc.objset,
    area: loc.area,
    submap: loc.submap || 0
  };
}

function publicSimpleContext(context) {
  return {
    objset: hex(context.objset, 2),
    area: hex(context.area, 2),
    submap: hex(context.submap, 2)
  };
}

function readRuntimeMappingScreenRecord(rom, info, loc) {
  const context = normalizeLocationContext(loc);
  const areaTableAddress = readBackgroundTableWord(rom, info, AREA_TABLE_POINTERS + context.objset * 2);
  const areaRecordAddress = readBackgroundTableWord(rom, info, areaTableAddress + context.area * 2);
  const pointerAddress = areaRecordAddress + SCREEN_RECORD_POINTERS_OFFSET + context.submap * 2;
  const address = readBackgroundTableWord(rom, info, pointerAddress);
  const firstByte = readBackgroundTableByte(rom, info, address);
  const secondByte = readBackgroundTableByte(rom, info, address + 1);

  return {
    context,
    key: contextKey(context),
    name: loc.name,
    areaTableAddress,
    areaRecordAddress,
    pointerAddress,
    address,
    firstByte,
    secondByte,
    specialMarker: SPECIAL_SCREEN_RECORD_MARKERS.has(firstByte) ? firstByte : undefined
  };
}

function findSpecialScreenRecordAlias(entry, entries) {
  if (entry.specialMarker == null) {
    return undefined;
  }

  const containers = entries
    .filter((candidate) => (
      candidate !== entry &&
      candidate.context.objset === entry.context.objset &&
      candidate.specialMarker === entry.specialMarker &&
      candidate.address < entry.address &&
      entry.address - candidate.address <= MAX_SPECIAL_ALIAS_DISTANCE
    ))
    .sort((left, right) => right.address - left.address);

  const source = containers[0];
  if (!source) {
    return undefined;
  }

  const submapRaw = source.context.submap | 0x80;

  return {
    objset: source.context.objset,
    area: source.context.area,
    submap: source.context.submap,
    submapRaw,
    submapFlags: submapRaw & 0x80,
    source: 'rom-special-screen-record-alias',
    note: `${entry.name || entry.key} starts at screen record $${toHex(entry.address)} inside the same-marker special stream for ${source.name || source.key} at $${toHex(source.address)}.`,
    screenRecordAlias: {
      reason: 'same-marker-special-screen-record-containment',
      marker: hex(entry.specialMarker, 2),
      target: {
        context: publicSimpleContext(entry.context),
        name: entry.name,
        screenRecordAddress: hex(entry.address, 4),
        screenRecordPointerAddress: hex(entry.pointerAddress, 4)
      },
      source: {
        context: publicSimpleContext(source.context),
        name: source.name,
        screenRecordAddress: hex(source.address, 4),
        screenRecordPointerAddress: hex(source.pointerAddress, 4)
      },
      byteOffset: entry.address - source.address
    },
    original: entry.context
  };
}

function publicScreenRecordEntry(entry) {
  return {
    name: entry.name,
    context: publicSimpleContext(entry.context),
    areaRecordAddress: hex(entry.areaRecordAddress, 4),
    screenRecordPointerAddress: hex(entry.pointerAddress, 4),
    screenRecordAddress: hex(entry.address, 4),
    firstByte: hex(entry.firstByte, 2),
    secondByte: hex(entry.secondByte, 2),
    specialMarker: hex(entry.specialMarker, 2)
  };
}

function createRuntimeContextResolver(rom, info, locations) {
  const entries = locations.map((loc) => readRuntimeMappingScreenRecord(rom, info, loc));
  const byKey = new Map(entries.map((entry) => [entry.key, entry]));
  const aliasByKey = new Map();

  if (ENABLE_SPECIAL_SCREEN_RECORD_PALETTE_ALIASES) {
    for (const entry of entries) {
      const alias = findSpecialScreenRecordAlias(entry, entries);
      if (alias) {
        aliasByKey.set(entry.key, alias);
      }
    }
  }

  function resolvePaletteContext(loc) {
    const key = contextKey(normalizeLocationContext(loc));
    const entry = byKey.get(key);
    const alias = aliasByKey.get(key);
    if (!entry || !alias) {
      return {
        ...normalizeLocationContext(loc),
        source: 'cv2r-runtime-context'
      };
    }

    return alias;
  }

  function inspect() {
    const aliases = [];
    for (const [key, alias] of aliasByKey.entries()) {
      aliases.push({
        key,
        target: alias.screenRecordAlias.target,
        source: alias.screenRecordAlias.source,
        marker: alias.screenRecordAlias.marker,
        byteOffset: alias.screenRecordAlias.byteOffset,
        resolvedContext: {
          objset: hex(alias.objset, 2),
          area: hex(alias.area, 2),
          submap: hex(alias.submap, 2),
          submapRaw: hex(alias.submapRaw, 2),
          submapFlags: hex(alias.submapFlags, 2)
        },
        note: alias.note
      });
    }

    return {
      source: ENABLE_SPECIAL_SCREEN_RECORD_PALETTE_ALIASES
        ? 'rom-special-screen-record-alias'
        : 'direct-runtime-context',
      constants: {
        areaTablePointers: hex(AREA_TABLE_POINTERS, 4),
        screenRecordPointersOffset: hex(SCREEN_RECORD_POINTERS_OFFSET, 2),
        maxSpecialAliasDistance: hex(MAX_SPECIAL_ALIAS_DISTANCE, 2),
        specialScreenRecordPaletteAliasesEnabled: ENABLE_SPECIAL_SCREEN_RECORD_PALETTE_ALIASES
      },
      candidates: entries.length,
      specialScreenRecords: entries
        .filter((entry) => entry.specialMarker != null)
        .map(publicScreenRecordEntry),
      aliases
    };
  }

  return {
    inspect,
    resolvePaletteContext
  };
}

function loadRuntimeContextFixtures(filePath = DEFAULT_FIXTURE_FILE) {
  const resolved = path.resolve(filePath);
  const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  const projectRoot = path.dirname(path.dirname(resolved));
  return {
    schemaVersion: data.schemaVersion,
    source: resolved,
    memory: data.memory,
    fixtures: (data.fixtures || []).map((fixture) => ({
      ...fixture,
      capture: fixture.capture && (
        path.isAbsolute(fixture.capture) ? fixture.capture : path.join(projectRoot, fixture.capture)
      ),
      atlasContext: normalizeSimpleContext(fixture.atlasContext, `${fixture.id}.atlasContext`),
      runtimeContext: normalizeRuntimeContext(fixture.runtimeContext, `${fixture.id}.runtimeContext`)
    }))
  };
}

function readCaptureRuntimeContext(captureDir) {
  const resolved = path.resolve(captureDir);
  const cpuPath = path.join(resolved, 'cpu-0000-07ff.bin');
  const statePath = path.join(resolved, 'state.json');
  const palettePath = path.join(resolved, 'ppu-3f00-3f1f-palettes.bin');
  const cpu = fs.readFileSync(cpuPath);
  const context = extractRuntimeContextFromCpuRam(cpu);
  return {
    capture: resolved,
    cpu: cpuPath,
    state: fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : undefined,
    paletteBytes: fs.existsSync(palettePath)
      ? [...fs.readFileSync(palettePath).subarray(0, 16)].map((byte) => hex(byte, 2))
      : undefined,
    runtimeContext: context,
    publicRuntimeContext: publicRuntimeContext(context)
  };
}

function inspectRuntimeContextFixtures(filePath = DEFAULT_FIXTURE_FILE) {
  const fixtures = loadRuntimeContextFixtures(filePath);
  return {
    schemaVersion: fixtures.schemaVersion,
    source: fixtures.source,
    memory: fixtures.memory,
    fixtures: fixtures.fixtures.map((fixture) => {
      let observed;
      let observedMatchesFixture;
      if (fixture.capture && fs.existsSync(path.join(fixture.capture, 'cpu-0000-07ff.bin'))) {
        observed = readCaptureRuntimeContext(fixture.capture).runtimeContext;
        observedMatchesFixture = contextsEqual(observed, fixture.runtimeContext) &&
          observed.submapRaw === fixture.runtimeContext.submapRaw;
      }

      return {
        id: fixture.id,
        label: fixture.label,
        capture: fixture.capture,
        status: fixture.status,
        atlasContext: {
          objset: hex(fixture.atlasContext.objset, 2),
          area: hex(fixture.atlasContext.area, 2),
          submap: hex(fixture.atlasContext.submap, 2)
        },
        runtimeContext: publicRuntimeContext(fixture.runtimeContext),
        observedRuntimeContext: observed && publicRuntimeContext(observed),
        observedMatchesFixture,
        mapsAtlasContextDirectly: contextsEqual(fixture.atlasContext, fixture.runtimeContext),
        note: fixture.note
      };
    })
  };
}

function paletteContextAliasesFromFixtures(filePath = DEFAULT_FIXTURE_FILE) {
  const fixtures = loadRuntimeContextFixtures(filePath);
  const aliases = {};

  for (const fixture of fixtures.fixtures) {
    if (fixture.useForPaletteContext === false || contextsEqual(fixture.atlasContext, fixture.runtimeContext)) {
      continue;
    }

    aliases[contextKey(fixture.atlasContext)] = {
      objset: fixture.runtimeContext.objset,
      area: fixture.runtimeContext.area,
      submap: fixture.runtimeContext.submap,
      submapRaw: fixture.runtimeContext.submapRaw,
      submapFlags: fixture.runtimeContext.submapFlags,
      source: 'fixture-runtime-context-evidence',
      fixture: fixture.id,
      note: fixture.note ||
        `${fixture.label || fixture.id} maps atlas context ${contextKey(fixture.atlasContext)} to runtime context ${contextKey(fixture.runtimeContext)}.`
    };
  }

  return aliases;
}

module.exports = {
  DEFAULT_FIXTURE_FILE,
  RUNTIME_CONTEXT_ADDRESSES,
  contextKey,
  createRuntimeContextResolver,
  extractRuntimeContextFromCpuRam,
  inspectRuntimeContextFixtures,
  loadRuntimeContextFixtures,
  paletteContextAliasesFromFixtures,
  publicRuntimeContext,
  readCaptureRuntimeContext
};
