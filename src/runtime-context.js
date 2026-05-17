'use strict';

const fs = require('fs');
const path = require('path');

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

function hex(value, width = 2) {
  if (value == null) {
    return undefined;
  }
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
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
  extractRuntimeContextFromCpuRam,
  inspectRuntimeContextFixtures,
  loadRuntimeContextFixtures,
  paletteContextAliasesFromFixtures,
  publicRuntimeContext,
  readCaptureRuntimeContext
};
