'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { readPrgByte, readPrgWord } = require('./background');
const { deriveBackgroundContext } = require('./background-context');
const { buildExteriorAtlas, locationId } = require('./exterior-atlas');
const { runMesenCapture } = require('./mesen');
const { renderPpuCapture } = require('./ppu');
const {
  publicRuntimeContext,
  readCaptureRuntimeContext
} = require('./runtime-context');

const DEFAULT_FIXTURE_FILE = path.join(__dirname, '..', 'data', 'render-recipe-fixtures.json');
const DEFAULT_CAPTURE_SCRIPT = path.join(__dirname, '..', 'tools', 'mesen', 'capture-screen.lua');
const CHR_4KB_BANK_SIZE = 0x1000;
const PALETTE_INDEX_POINTERS = 0xf7c5;
const BACKGROUND_TABLE_BANK = 2;
const BANK_7_TRANSFER_POINTER_TABLE = 0x8895;
const RAW_BACKGROUND_PALETTE_SENTINEL = 0x0f;
const BACKGROUND_PALETTE_BYTES = 16;
const REQUIRED_CAPTURE_FILES = [
  'screenshot.png',
  'cpu-0000-07ff.bin',
  'ppu-0000-1fff-patterns.bin',
  'ppu-2000-2fff-nametables.bin',
  'ppu-3f00-3f1f-palettes.bin',
  'oam-0000-00ff-sprites.bin',
  'state.json'
];

function hex(value, width = 2) {
  if (value == null) {
    return undefined;
  }
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function parseInteger(value, label) {
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
  throw new Error(`${label} must be an integer`);
}

function normalizeContext(raw, label) {
  if (!raw) {
    return undefined;
  }
  return {
    objset: parseInteger(raw.objset, `${label}.objset`),
    area: parseInteger(raw.area, `${label}.area`),
    submap: parseInteger(raw.submap, `${label}.submap`) || 0
  };
}

function publicSimpleContext(context) {
  if (!context) {
    return undefined;
  }
  return {
    objset: hex(context.objset, 2),
    area: hex(context.area, 2),
    submap: hex(context.submap, 2)
  };
}

function contextsEqual(left, right) {
  return Boolean(left && right) &&
    left.objset === right.objset &&
    left.area === right.area &&
    left.submap === right.submap;
}

function loadRecipeFixtureManifest(filePath = DEFAULT_FIXTURE_FILE) {
  const resolved = path.resolve(filePath);
  const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  return {
    ...data,
    file: resolved,
    fixtures: (data.fixtures || []).map((fixture) => ({
      ...fixture,
      atlasContext: normalizeContext(fixture.atlasContext, `${fixture.id}.atlasContext`),
      expectedContexts: (fixture.expectedContexts || [])
        .map((context, index) => normalizeContext(context, `${fixture.id}.expectedContexts.${index}`))
    })),
    deferred: data.deferred || []
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function bytesToHex(bytes, count = bytes.length) {
  return [...bytes.subarray(0, count)].map((value) => hex(value, 2));
}

function sha1(bytes) {
  return crypto.createHash('sha1').update(bytes).digest('hex');
}

function readPaletteBytes(rom, info, cpuAddress, bank) {
  const bytes = Buffer.alloc(BACKGROUND_PALETTE_BYTES);
  for (let index = 0; index < BACKGROUND_PALETTE_BYTES; index += 1) {
    bytes[index] = readPrgByte(
      rom,
      info,
      cpuAddress + index,
      bank == null ? {} : { bank }
    );
  }
  return bytes;
}

function paletteBankForAddress(cpuAddress) {
  return cpuAddress < 0xc000 ? 4 : undefined;
}

function sameBytes(left, right) {
  return left.length === right.length && Buffer.compare(left, right) === 0;
}

function readBackgroundTableWord(rom, info, cpuAddress) {
  return readPrgWord(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readBackgroundTableByte(rom, info, cpuAddress) {
  return readPrgByte(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function resolvePaletteSelector(rom, info, runtimeContext, variant, livePaletteBytes) {
  const selectorVariant = variant === 'night' ? 'night' : 'day';
  const variantOffset = selectorVariant === 'night' ? 2 : 0;

  try {
    const paletteTableAddress = readBackgroundTableWord(
      rom,
      info,
      PALETTE_INDEX_POINTERS + runtimeContext.objset * 2
    );
    const indexListPointerAddress = paletteTableAddress + runtimeContext.area * 4 + variantOffset;
    const indexListAddress = readBackgroundTableWord(rom, info, indexListPointerAddress);
    const indexOffset = (runtimeContext.submap & 0x7f) * 2;
    const transferId = readBackgroundTableByte(rom, info, indexListAddress + indexOffset);
    const auxiliaryTransferId = readBackgroundTableByte(rom, info, indexListAddress + indexOffset + 1);
    const transferPointerAddress = BANK_7_TRANSFER_POINTER_TABLE + transferId * 2;
    const paletteAddress = readPrgWord(rom, info, transferPointerAddress, { bank: 7 });
    const paletteBank = paletteBankForAddress(paletteAddress);
    const romPaletteBytes = readPaletteBytes(rom, info, paletteAddress, paletteBank);
    const rawPalette = romPaletteBytes[0] === RAW_BACKGROUND_PALETTE_SENTINEL;

    return {
      status: rawPalette
        ? (sameBytes(romPaletteBytes, livePaletteBytes) ? 'exact-match' : 'palette-mismatch')
        : 'non-raw-transfer',
      variant: selectorVariant,
      runtimeContext: publicSimpleContext(runtimeContext),
      paletteTableAddress: hex(paletteTableAddress, 4),
      indexListPointerAddress: hex(indexListPointerAddress, 4),
      indexListAddress: hex(indexListAddress, 4),
      indexOffset,
      transferId: hex(transferId, 2),
      auxiliaryTransferId: hex(auxiliaryTransferId, 2),
      transferPointerAddress: hex(transferPointerAddress, 4),
      paletteAddress: hex(paletteAddress, 4),
      paletteBank,
      bytes: bytesToHex(romPaletteBytes),
      rawPalette
    };
  } catch (error) {
    return {
      status: 'unresolved',
      variant: selectorVariant,
      runtimeContext: publicSimpleContext(runtimeContext),
      error: error.message
    };
  }
}

function scanPaletteTransferMatches(rom, info, livePaletteBytes) {
  const matches = [];
  const seen = new Set();

  for (let transferId = 0; transferId <= 0xff; transferId += 1) {
    const transferPointerAddress = BANK_7_TRANSFER_POINTER_TABLE + transferId * 2;
    try {
      const paletteAddress = readPrgWord(rom, info, transferPointerAddress, { bank: 7 });
      const paletteBank = paletteBankForAddress(paletteAddress);
      const romPaletteBytes = readPaletteBytes(rom, info, paletteAddress, paletteBank);
      if (romPaletteBytes[0] !== RAW_BACKGROUND_PALETTE_SENTINEL) {
        continue;
      }
      if (!sameBytes(romPaletteBytes, livePaletteBytes)) {
        continue;
      }
      const key = `${paletteBank ?? 'fixed'}:${paletteAddress}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      matches.push({
        transferId: hex(transferId, 2),
        transferPointerAddress: hex(transferPointerAddress, 4),
        paletteAddress: hex(paletteAddress, 4),
        paletteBank,
        bytes: bytesToHex(romPaletteBytes)
      });
    } catch (_error) {
      // The pointer table is scanned broadly; invalid candidates are ignored.
    }
  }

  return matches;
}

function chrBankMatches(rom, info, capturedPatterns) {
  const banks = [];
  const totalBanks = info.chrRomSize / CHR_4KB_BANK_SIZE;

  for (let slot = 0; slot < 2; slot += 1) {
    const start = slot * CHR_4KB_BANK_SIZE;
    const captured = capturedPatterns.subarray(start, start + CHR_4KB_BANK_SIZE);
    const matches = [];
    for (let bank = 0; bank < totalBanks; bank += 1) {
      const sourceStart = info.chrStart + bank * CHR_4KB_BANK_SIZE;
      const source = rom.subarray(sourceStart, sourceStart + CHR_4KB_BANK_SIZE);
      if (sameBytes(captured, source)) {
        matches.push(bank);
      }
    }
    banks.push({
      slot,
      ppuAddress: hex(start, 4),
      sha1: sha1(captured),
      matches: matches.map((bank) => ({
        bank,
        bankHex: hex(bank, 2)
      })),
      status: matches.length ? 'exact-match' : 'unresolved'
    });
  }

  return {
    status: banks.every((bank) => bank.matches.length) ? 'exact-match' : 'unresolved',
    banks
  };
}

function atlasCandidateForFixture(rom, info, fixture) {
  if (!fixture.atlasContext) {
    return undefined;
  }
  const atlas = buildExteriorAtlas(rom, info);
  const candidate = atlas.candidates.find((loc) => contextsEqual({
    objset: loc.objset,
    area: loc.area,
    submap: loc.submap || 0
  }, fixture.atlasContext));
  if (!candidate) {
    return undefined;
  }

  return {
    id: locationId(candidate),
    name: candidate.name,
    image: `images/${locationId(candidate)}.png`
  };
}

function fixtureExpectedStatus(fixture, runtimeContext) {
  const expectedContexts = [
    fixture.atlasContext,
    ...(fixture.expectedContexts || [])
  ].filter(Boolean);

  if (!expectedContexts.length) {
    return {
      status: 'not-specified'
    };
  }

  return {
    status: expectedContexts.some((context) => contextsEqual(context, runtimeContext))
      ? 'matches'
      : 'differs',
    expected: expectedContexts.map(publicSimpleContext)
  };
}

function deriveContextEvidence(rom, info, runtimeContext) {
  try {
    return {
      status: 'resolved',
      backgroundContext: deriveBackgroundContext(rom, info, runtimeContext)
    };
  } catch (error) {
    return {
      status: 'unresolved',
      error: error.message
    };
  }
}

function auditFixture(rom, info, fixture) {
  const captureDir = path.resolve(fixture.capture);
  const requiredFiles = REQUIRED_CAPTURE_FILES.map((file) => ({
    file,
    exists: fs.existsSync(path.join(captureDir, file))
  }));
  const missing = requiredFiles.filter((file) => !file.exists).map((file) => file.file);

  if (missing.length) {
    return {
      id: fixture.id,
      label: fixture.label,
      location: fixture.location,
      variant: fixture.variant,
      access: fixture.access,
      capture: fixture.capture,
      status: 'missing-capture-files',
      missing,
      requiredFiles
    };
  }

  const state = readJson(path.join(captureDir, 'state.json'));
  const captureContext = readCaptureRuntimeContext(captureDir);
  const runtimeContext = captureContext.runtimeContext;
  const patterns = fs.readFileSync(path.join(captureDir, 'ppu-0000-1fff-patterns.bin'));
  const palettes = fs.readFileSync(path.join(captureDir, 'ppu-3f00-3f1f-palettes.bin'));
  const liveBackgroundPalette = palettes.subarray(0, BACKGROUND_PALETTE_BYTES);
  const chr = chrBankMatches(rom, info, patterns);
  const paletteSelector = resolvePaletteSelector(
    rom,
    info,
    runtimeContext,
    fixture.variant,
    liveBackgroundPalette
  );
  const transferMatches = scanPaletteTransferMatches(rom, info, liveBackgroundPalette);
  const contextEvidence = deriveContextEvidence(rom, info, {
    objset: runtimeContext.objset,
    area: runtimeContext.area,
    submap: runtimeContext.submap
  });
  const expectedStatus = fixtureExpectedStatus(fixture, runtimeContext);
  const atlasCandidate = atlasCandidateForFixture(rom, info, fixture);

  return {
    id: fixture.id,
    label: fixture.label,
    location: fixture.location,
    variant: fixture.variant,
    access: fixture.access,
    reason: fixture.reason,
    capture: fixture.capture,
    state: fixture.state,
    status: 'audited',
    requiredFiles,
    expectedContext: expectedStatus,
    atlasContext: publicSimpleContext(fixture.atlasContext),
    atlasCandidate,
    live: {
      runtimeContext: publicRuntimeContext(runtimeContext),
      ppu: {
        backgroundPaletteBytes: bytesToHex(liveBackgroundPalette),
        fullPaletteBytes: bytesToHex(palettes, 32),
        backgroundPatternAddress: hex(state.ppuBackgroundPatternAddr, 4),
        xScroll: state.ppuXScroll,
        videoRamAddress: hex(state.ppuVideoRamAddr, 4),
        tmpVideoRamAddress: hex(state.ppuTmpVideoRamAddr, 4)
      }
    },
    chr,
    palette: {
      selector: paletteSelector,
      transferMatches,
      status: paletteSelector.status === 'exact-match'
        ? 'selector-exact'
        : (transferMatches.length ? 'transfer-table-match' : 'unresolved')
    },
    romContext: contextEvidence,
    evidenceStatus: {
      runtimeContext: expectedStatus.status,
      chr: chr.status,
      palette: paletteSelector.status === 'exact-match'
        ? 'exact-match'
        : (transferMatches.length ? 'matched-by-transfer-scan' : paletteSelector.status),
      renderRecipe: chr.status === 'exact-match' && (paletteSelector.status === 'exact-match' || transferMatches.length)
        ? 'recipe-evidence-present'
        : 'diagnostic'
    }
  };
}

function summarizeAudit(fixtures, deferred) {
  return {
    fixtures: fixtures.length,
    audited: fixtures.filter((fixture) => fixture.status === 'audited').length,
    missingCaptureFiles: fixtures.filter((fixture) => fixture.status === 'missing-capture-files').length,
    chrExact: fixtures.filter((fixture) => fixture.chr?.status === 'exact-match').length,
    paletteSelectorExact: fixtures.filter((fixture) => fixture.palette?.selector?.status === 'exact-match').length,
    paletteTransferMatched: fixtures.filter((fixture) => fixture.palette?.transferMatches?.length).length,
    recipeEvidencePresent: fixtures.filter((fixture) => (
      fixture.evidenceStatus?.renderRecipe === 'recipe-evidence-present'
    )).length,
    deferred: deferred.length
  };
}

function auditRenderRecipes(rom, info, opts = {}) {
  const manifest = loadRecipeFixtureManifest(opts.fixtureFile || DEFAULT_FIXTURE_FILE);
  const fixtures = manifest.fixtures.map((fixture) => auditFixture(rom, info, fixture));
  const audit = {
    schemaVersion: 1,
    source: {
      fixtureFile: path.relative(process.cwd(), manifest.file) || manifest.file,
      note: 'Save states are validation probes. Captured PPU/CPU evidence is used to audit ROM-derived render recipes, not as final map source art.'
    },
    summary: summarizeAudit(fixtures, manifest.deferred),
    fixtures,
    deferred: manifest.deferred
  };

  if (opts.outDir) {
    const outDir = path.resolve(opts.outDir);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'audit.json'), `${JSON.stringify(audit, null, 2)}\n`);
    fs.writeFileSync(
      path.join(outDir, 'audit-data.js'),
      `window.RENDER_RECIPE_AUDIT = ${JSON.stringify(audit, null, 2)};\n`
    );
  }

  return audit;
}

function shouldRunFixture(fixture, only) {
  return !only || only.has(fixture.id);
}

function captureRenderRecipeFixtures(opts = {}) {
  const manifest = loadRecipeFixtureManifest(opts.fixtureFile || DEFAULT_FIXTURE_FILE);
  const only = opts.only ? new Set(String(opts.only).split(',').map((value) => value.trim()).filter(Boolean)) : undefined;
  const scriptPath = opts.scriptPath || DEFAULT_CAPTURE_SCRIPT;
  const results = [];

  for (const fixture of manifest.fixtures) {
    if (!shouldRunFixture(fixture, only)) {
      continue;
    }

    const outDir = path.resolve(fixture.capture);
    const statePath = fixture.state ? path.resolve(fixture.state) : '';
    const hasCapture = REQUIRED_CAPTURE_FILES.every((file) => fs.existsSync(path.join(outDir, file)));

    if (hasCapture && opts.skipExisting) {
      const backgroundPath = path.join(outDir, 'background.png');
      if (!fs.existsSync(backgroundPath)) {
        renderPpuCapture(outDir, backgroundPath);
      }
      results.push({
        id: fixture.id,
        status: 'skipped-existing',
        outDir
      });
      continue;
    }

    if (fixture.state && !fs.existsSync(statePath)) {
      results.push({
        id: fixture.id,
        status: 'missing-state',
        state: statePath
      });
      continue;
    }

    const result = runMesenCapture({
      romPath: opts.romPath,
      scriptPath,
      outDir,
      timeout: fixture.timeout || opts.timeout || 30,
      env: {
        CV2MAP_CAPTURE_NAME: fixture.id,
        CV2MAP_CAPTURE_LOCATION: fixture.location || fixture.label,
        CV2MAP_CAPTURE_VARIANT: fixture.variant || 'unknown',
        CV2MAP_CAPTURE_ACCESS: fixture.access || 'unknown',
        CV2MAP_CAPTURE_FRAME: String(fixture.captureFrame || 360),
        CV2MAP_START_PRESSES: fixture.startPresses || '',
        CV2MAP_INPUTS: fixture.inputs || '',
        CV2MAP_STATE_PATH: statePath,
        CV2MAP_SETTLE_FRAMES: String(fixture.settleFrames || 30)
      }
    });
    const rendered = renderPpuCapture(outDir, path.join(outDir, 'background.png'));
    results.push({
      id: fixture.id,
      status: 'captured',
      outDir,
      durationMs: result.durationMs,
      outputs: result.outputs,
      background: rendered.output,
      composite: rendered.composite?.output,
      compositeDiffPixels: rendered.composite?.diff?.differingPixels
    });
  }

  return {
    fixtureFile: manifest.file,
    captured: results.filter((result) => result.status === 'captured').length,
    skipped: results.filter((result) => result.status === 'skipped-existing').length,
    missingStates: results.filter((result) => result.status === 'missing-state').length,
    results
  };
}

module.exports = {
  DEFAULT_FIXTURE_FILE,
  REQUIRED_CAPTURE_FILES,
  auditRenderRecipes,
  captureRenderRecipeFixtures,
  loadRecipeFixtureManifest
};
