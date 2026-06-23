#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { readRom, describeRom } = require('./ines');
const { deriveBackgroundContext } = require('./background-context');
const { renderChrBanks } = require('./chr');
const { loadBackgroundDescriptor } = require('./descriptors');
const { buildManifest, writeManifest } = require('./manifest');
const { runMesenCapture } = require('./mesen');
const { diffImages, renderPpuCapture } = require('./ppu');
const { readPng, writePng } = require('./png');
const { renderNativeBackgroundImage } = require('./native-image');
const { loadRegion, renderRegionPng } = require('./regions');
const {
  loadLayoutRoute,
  loadLayoutSegment,
  renderLayoutRoutePng,
  renderLayoutSegmentPng
} = require('./layout-segments');
const {
  buildExteriorAtlas,
  renderExteriorAtlas
} = require('./exterior-atlas');
const { renderExteriorTopology } = require('./exterior-topology');
const { renderExteriorComposition } = require('./exterior-composition');
const { renderExteriorWorldComposition } = require('./exterior-world-composition');
const { buildGuideSlice } = require('./guide-slice');
const { decodeActorSelectorStreams } = require('./actor-selector-streams');
const { decodeFishmanSpriteProof } = require('./fishman-sprite-proof');
const { decodeGuideActorSpriteCoverage } = require('./guide-actor-sprite-coverage');
const { analyzeActorTraces, runActorTraces } = require('./actor-traces');
const { decodeTransitionRoutine } = require('./transition-routine-decoder');
const {
  auditRenderRecipes,
  captureRenderRecipeFixtures
} = require('./render-recipe-audit');
const { renderRecipeAtlas } = require('./render-recipe-atlas');
const {
  analyzeInteriorMap,
  writeInteriorMapResearch
} = require('./interior-map-research');
const { runTransitionProbes } = require('./transition-probes');
const {
  createRuntimeContextResolver,
  inspectRuntimeContextFixtures,
  readCaptureRuntimeContext
} = require('./runtime-context');
const {
  applyPpuWritesToNametables,
  compareNametables,
  decodePpuTransferStream,
  renderJovaNativeNametables,
  renderJovaWoodsNativeNametables,
  renderNativeBackgroundNametables,
  replayPpuBufferTrace,
  toHex
} = require('./background');

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      args._.push(token);
      continue;
    }

    const eq = token.indexOf('=');
    if (eq !== -1) {
      args[token.slice(2, eq)] = token.slice(eq + 1);
      continue;
    }

    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function required(args, name) {
  if (!args[name]) {
    throw new Error(`missing required --${name}`);
  }
  return String(args[name]);
}

function usage() {
  return [
    'Usage:',
    '  node src/index.js verify-rom --rom roms/cv2.nes',
    '  node src/index.js extract-chr --rom roms/cv2.nes --out out/chr --scale 1',
    '  node src/index.js manifest --out out/manifest.json',
    '  node src/index.js render-all --rom roms/cv2.nes --out out --scale 1',
    '  node src/index.js mesen-capture --rom roms/cv2.nes --script tools/mesen/smoke-capture.lua --out out/mesen-smoke',
    '  node src/index.js mesen-capture-screen --rom roms/cv2.nes --name jova-day --location Jova --variant day --access outdoor --out out/captures/jova-day',
    '  node src/index.js mesen-capture-screen --rom roms/cv2.nes --name jova-right-day --inputs start:240:20,start:2000:20,start:3500:20,right:3900:1200 --capture-frame 5200',
    '  node src/index.js mesen-trace-actors --rom roms/cv2.nes --name jova-woods-day --state out/states/jova-woods.mss --trace-frames 600 --sample-every 4 --out out/actor-traces/jova-woods-day',
    '  node src/index.js mesen-capture-screen --rom roms/cv2.nes --name jova-woods-day --location "Jova Woods" --variant day --access outdoor --state out/states/jova-woods.mss --settle-frames 30 --out out/captures/jova-woods-day',
    '  node src/index.js render-ppu-capture --capture out/captures/jova-day --out out/captures/jova-day/background.png',
    '  node src/index.js decode-transfer --rom roms/cv2.nes --bank 4 --address 0x8000 --mirroring vertical --out out/transfer.bin',
    '  node src/index.js replay-ppu-buffer-trace --trace out/mesen-buffer-trace/ppu-buffer-writes.tsv --mirroring vertical --compare out/captures/jova-day/ppu-2000-2fff-nametables.bin --out out/mesen-buffer-trace/replayed-nametables.bin',
    '  node src/index.js inspect-background-context --rom roms/cv2.nes --objset 0x02 --area 0 --submap 0',
    '  node src/index.js inspect-runtime-context --capture out/captures/jova-woods-day',
    '  node src/index.js inspect-runtime-context --fixtures data/runtime-context-fixtures.json',
    '  node src/index.js inspect-runtime-context-map --rom roms/cv2.nes',
    '  node src/index.js render-background-native --rom roms/cv2.nes --descriptor jova-day --compare out/captures/jova-day/ppu-2000-2fff-nametables.bin --out out/decoder/jova-native-nametables.bin',
    '  node src/index.js render-background-native-png --rom roms/cv2.nes --descriptor jova-day --state out/captures/jova-day/state.json --compare-png out/captures/jova-day/background.png --out out/decoder/jova-native-background.png',
    '  node src/index.js render-region-png --rom roms/cv2.nes --region jova-to-veros-day --out out/regions/jova-to-veros-day.png',
    '  node src/index.js render-layout-segment-png --rom roms/cv2.nes --segment jova-woods-day --out out/layout-segments/jova-woods-day.png',
    '  node src/index.js render-layout-route-png --rom roms/cv2.nes --route jova-to-veros-outdoor-day --out out/layout-routes/jova-to-veros-outdoor-day.png',
    '  node src/index.js render-exterior-atlas --rom roms/cv2.nes --out out/exterior-atlas',
    '  node src/index.js render-exterior-topology --rom roms/cv2.nes --out out/exterior-topology',
    '  node src/index.js render-exterior-composition --rom roms/cv2.nes --topology out/exterior-topology/topology.json --atlas out/render-recipe-atlas/manifest.json --out out/exterior-composition',
    '  node src/index.js render-exterior-world-composition --rom roms/cv2.nes --topology out/exterior-topology/topology.json --atlas out/render-recipe-atlas/manifest.json --transition-rules out/transition-routine/decoder.json --out out/exterior-world-composition',
    '  node src/index.js build-guide-slice --rom roms/cv2.nes --slice data/guide-slices/dead-river-1-to-berkeley.json --atlas out/render-recipe-atlas/manifest.json --out web/guide-map/public/assets/slices/dead-river-1-to-berkeley',
    '  node src/index.js run-actor-traces --rom roms/cv2.nes --fixtures data/actor-trace-fixtures.json --out out/actor-traces',
    '  node src/index.js analyze-actor-traces --fixtures data/actor-trace-fixtures.json --out out/actor-traces',
    '  node src/index.js decode-actor-selector-streams --rom roms/cv2.nes --fixtures data/actor-trace-fixtures.json --traces out/actor-traces --out out/actor-selector-streams',
    '  node src/index.js decode-fishman-sprite-proof --rom roms/cv2.nes --out out/fishman-sprite-proof',
    '  node src/index.js decode-guide-actor-sprite-coverage --rom roms/cv2.nes --out out/guide-actor-sprite-coverage',
    '  node src/index.js run-transition-probes --rom roms/cv2.nes --fixtures data/transition-probes.json --topology out/exterior-topology/topology.json --out out/transition-probes',
    '  node src/index.js decode-transition-routine --rom roms/cv2.nes --probes out/transition-probes/analysis.json --topology out/exterior-topology/topology.json --out out/transition-routine',
    '  node src/index.js capture-render-recipe-fixtures --rom roms/cv2.nes --fixtures data/render-recipe-fixtures.json',
    '  node src/index.js audit-render-recipes --rom roms/cv2.nes --fixtures data/render-recipe-fixtures.json --out out/render-recipe-audit',
    '  node src/index.js render-recipe-atlas --rom roms/cv2.nes --audit out/render-recipe-audit/audit.json --out out/render-recipe-atlas',
    '  node src/index.js analyze-interior-map --rom roms/cv2.nes --id berkeley-mansion --objset 0x01 --area 0x07 --atlas out/render-recipe-atlas/manifest.json --out out/interior-map-research/berkeley-mansion.json',
    '  node src/index.js analyze-interior-map --rom roms/cv2.nes --id jova-interiors --objset 0x00 --areas 0x07,0x08,0x09 --atlas out/render-recipe-atlas/manifest.json --out out/interior-map-research/jova-interiors.json',
    '  node src/index.js analyze-interior-map --rom roms/cv2.nes --id veros-interiors --objset 0x00 --areas 0x07,0x0A,0x0B --atlas out/render-recipe-atlas/manifest.json --out out/interior-map-research/veros-interiors.json',
    '  node src/index.js render-background-native --rom roms/cv2.nes --descriptor jova-day --descriptor-file data/background-descriptors.json',
    '  node src/index.js render-background-native --rom roms/cv2.nes --descriptor jova-woods-day --compare out/captures/jova-woods-day/ppu-2000-2fff-nametables.bin --out out/decoder/jova-woods-native-nametables.bin',
    '',
    'Commands:',
    '  verify-rom   Parse and verify the iNES header.',
    '  extract-chr  Render each 8 KB CHR ROM bank as a PNG tile sheet.',
    '  manifest     Write cv2r-derived location, door, and actor metadata.',
    '  render-all   Run verify-rom, extract-chr, and manifest together.',
    '  mesen-capture  Run a Mesen --testRunner Lua script with project output wiring.',
    '  mesen-capture-screen  Capture screenshot, PPU/CPU memory, and OAM artifacts.',
    '  mesen-trace-actors  Trace runtime actor slots, actor RAM writes, and visible OAM from a save state.',
    '  render-ppu-capture  Render background PNG from captured PPU artifacts.',
    '  decode-transfer  Decode the fixed-bank PPU transfer stream used by routine $C6C0.',
    '  replay-ppu-buffer-trace  Replay traced $0700 NMI PPU buffer writes into nametable bytes.',
    '  inspect-background-context  Derive background table pointers from objset/area/submap.',
    '  inspect-runtime-context  Extract live map context bytes from capture CPU RAM or committed fixture evidence.',
    '  inspect-runtime-context-map  Derive ROM table aliases between atlas candidates and live palette selector contexts.',
    '  render-background-native  Render a descriptor-backed ROM-native nametable checkpoint.',
    '  render-background-native-png  Render a descriptor-backed ROM-native background PNG.',
    '  render-region-png  Render a route-ordered ROM-native viewport catalog PNG.',
    '  render-layout-segment-png  Render a continuous ROM-native layout-space segment PNG.',
    '  render-layout-route-png  Render connected ROM-native layout-space segments into one route PNG.',
    '  render-exterior-atlas  Render exterior candidate layout-space segments and a manifest.',
    '  render-exterior-topology  Decode exterior area transition topology and write graph data.',
    '  render-exterior-composition  Compose a topology route from ROM-derived transition constraints.',
    '  render-exterior-world-composition  Compose all exterior topology areas from ROM-derived constraints.',
    '  build-guide-slice  Build a static WebGL guide-map slice manifest and ROM-derived tile data binary.',
    '  run-actor-traces  Run Mesen save-state probes that trace actor slots and selector writes.',
    '  analyze-actor-traces  Summarize existing actor trace outputs into analysis.json.',
    '  decode-actor-selector-streams  Map traced actor selector writes back to fixed-bank ROM records and render metasprite strips.',
    '  decode-fishman-sprite-proof  Prove fishman selector/color data from ROM and render sprite evidence.',
    '  decode-guide-actor-sprite-coverage  Prove current guide-slice actor sprite coverage and render evidence sprites.',
    '  run-transition-probes  Trace scripted transition round trips from save states.',
    '  decode-transition-routine  Summarize transition routine bytes and placement/camera evidence.',
    '  capture-render-recipe-fixtures  Capture configured save-state probes for recipe auditing.',
    '  audit-render-recipes  Audit live capture evidence against ROM-derived render recipe tables.',
    '  render-recipe-atlas  Render validated/projected atlas variants from audited render recipes.',
    '  analyze-interior-map  Inventory and validate an interior map before guide scene generation.',
    '  render-jova-native  Alias for render-background-native --descriptor jova-day.',
    '  render-jova-woods-native  Alias for render-background-native --descriptor jova-woods-day.'
  ].join('\n');
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function numericOption(args, name, fallback) {
  if (args[name] == null || args[name] === true) {
    return fallback;
  }
  const parsed = Number.parseInt(String(args[name]), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`--${name} must be a positive integer`);
  }
  return parsed;
}

function integerOption(args, name, fallback) {
  if (args[name] == null || args[name] === true) {
    return fallback;
  }
  const value = String(args[name]);
  const parsed = value.startsWith('0x') || value.startsWith('0X')
    ? Number.parseInt(value.slice(2), 16)
    : Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`--${name} must be an integer`);
  }
  return parsed;
}

function requiredIntegerOption(args, name) {
  const parsed = integerOption(args, name, undefined);
  if (!Number.isInteger(parsed)) {
    throw new Error(`missing required --${name}`);
  }
  return parsed;
}

function integerListOption(args, name) {
  if (args[name] == null || args[name] === true) {
    return null;
  }
  const values = String(args[name])
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      const parsed = value.startsWith('0x') || value.startsWith('0X')
        ? Number.parseInt(value.slice(2), 16)
        : Number.parseInt(value, 10);
      if (!Number.isFinite(parsed)) {
        throw new Error(`--${name} must be a comma-separated list of integers`);
      }
      return parsed;
    });
  if (values.length === 0) {
    throw new Error(`--${name} must include at least one integer`);
  }
  return values;
}

function verifyRom(args) {
  const romPath = required(args, 'rom');
  const { info } = readRom(romPath);
  printJson(describeRom(info));
}

function extractChr(args) {
  const romPath = required(args, 'rom');
  const outDir = required(args, 'out');
  const scale = numericOption(args, 'scale', 1);
  const { buffer, info } = readRom(romPath);
  const sheets = renderChrBanks(buffer, info, { outDir, scale });
  printJson({
    rom: describeRom(info),
    output: sheets
  });
}

function manifest(args) {
  const outFile = args.out ? String(args.out) : path.join('out', 'manifest.json');
  const manifestData = buildManifest();
  writeManifest(outFile, manifestData);
  printJson({
    output: outFile,
    locations: manifestData.locations.length,
    actors: manifestData.summary.actors,
    doors: manifestData.summary.doors
  });
}

function renderAll(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : 'out';
  const scale = numericOption(args, 'scale', 1);
  const { buffer, info } = readRom(romPath);
  const chrDir = path.join(outDir, 'chr');
  const sheets = renderChrBanks(buffer, info, { outDir: chrDir, scale });
  const manifestData = buildManifest();
  const manifestPath = path.join(outDir, 'manifest.json');
  writeManifest(manifestPath, manifestData);
  printJson({
    rom: describeRom(info),
    chrSheets: sheets.length,
    manifest: manifestPath,
    locations: manifestData.locations.length,
    actors: manifestData.summary.actors,
    doors: manifestData.summary.doors
  });
}

function mesenCapture(args) {
  const romPath = required(args, 'rom');
  const scriptPath = required(args, 'script');
  const outDir = args.out ? String(args.out) : path.join('out', 'mesen-capture');
  const timeout = numericOption(args, 'timeout', 10);
  const env = {};
  if (args.inputs) {
    env.CV2MAP_INPUTS = String(args.inputs);
  }
  if (args['start-presses']) {
    env.CV2MAP_START_PRESSES = String(args['start-presses']);
  }
  if (args.state) {
    env.CV2MAP_STATE_PATH = path.resolve(String(args.state));
  }
  if (args['settle-frames']) {
    env.CV2MAP_SETTLE_FRAMES = String(numericOption(args, 'settle-frames', 30));
  }
  const result = runMesenCapture({ romPath, scriptPath, outDir, timeout, env });
  printJson(result);
}

function mesenCaptureScreen(args) {
  const romPath = required(args, 'rom');
  const name = args.name ? String(args.name) : 'screen';
  const location = args.location ? String(args.location) : '';
  const variant = args.variant ? String(args.variant) : 'unknown';
  const access = args.access ? String(args.access) : 'unknown';
  const outDir = args.out ? String(args.out) : path.join('out', 'captures', name);
  const scriptPath = args.script ? String(args.script) : path.join('tools', 'mesen', 'capture-screen.lua');
  const timeout = numericOption(args, 'timeout', 20);
  const captureFrame = numericOption(args, 'capture-frame', 360);
  const pressStartAt = numericOption(args, 'press-start-at', 45);
  const pressStartFrames = numericOption(args, 'press-start-frames', 12);
  const startPresses = args['start-presses'] ? String(args['start-presses']) : '';
  const inputs = args.inputs ? String(args.inputs) : '';
  const statePath = args.state ? path.resolve(String(args.state)) : '';
  const settleFrames = numericOption(args, 'settle-frames', 30);
  const result = runMesenCapture({
    romPath,
    scriptPath,
    outDir,
    timeout,
    env: {
      CV2MAP_CAPTURE_NAME: name,
      CV2MAP_CAPTURE_LOCATION: location,
      CV2MAP_CAPTURE_VARIANT: variant,
      CV2MAP_CAPTURE_ACCESS: access,
      CV2MAP_CAPTURE_FRAME: String(captureFrame),
      CV2MAP_PRESS_START_AT: String(pressStartAt),
      CV2MAP_PRESS_START_FRAMES: String(pressStartFrames),
      CV2MAP_START_PRESSES: startPresses,
      CV2MAP_INPUTS: inputs,
      CV2MAP_STATE_PATH: statePath,
      CV2MAP_SETTLE_FRAMES: String(settleFrames)
    }
  });
  printJson(result);
}

function mesenTraceActors(args) {
  const romPath = required(args, 'rom');
  const name = args.name ? String(args.name) : 'actor-trace';
  const label = args.label ? String(args.label) : name;
  const outDir = args.out ? String(args.out) : path.join('out', 'actor-traces', name);
  const scriptPath = args.script ? String(args.script) : path.join('tools', 'mesen', 'trace-actors.lua');
  const timeout = numericOption(args, 'timeout', 45);
  const inputs = args.inputs ? String(args.inputs) : '';
  const statePath = args.state ? path.resolve(String(args.state)) : '';
  const settleFrames = numericOption(args, 'settle-frames', 30);
  const traceFrames = numericOption(args, 'trace-frames', 600);
  const sampleEvery = numericOption(args, 'sample-every', 4);
  const result = runMesenCapture({
    romPath,
    scriptPath,
    outDir,
    timeout,
    env: {
      CV2MAP_ACTOR_TRACE_ID: name,
      CV2MAP_ACTOR_TRACE_LABEL: label,
      CV2MAP_INPUTS: inputs,
      CV2MAP_STATE_PATH: statePath,
      CV2MAP_SETTLE_FRAMES: String(settleFrames),
      CV2MAP_TRACE_FRAMES: String(traceFrames),
      CV2MAP_SAMPLE_EVERY: String(sampleEvery)
    }
  });
  printJson(result);
}

function renderPpuCaptureCommand(args) {
  const captureDir = required(args, 'capture');
  const outPath = args.out ? String(args.out) : undefined;
  printJson(renderPpuCapture(captureDir, outPath));
}

function decodeTransferCommand(args) {
  const romPath = required(args, 'rom');
  const bank = integerOption(args, 'bank', undefined);
  const fixedBank = integerOption(args, 'fixed-bank', undefined);
  const cpuAddress = integerOption(args, 'address', undefined);
  if (!Number.isInteger(cpuAddress)) {
    throw new Error('missing required --address');
  }

  const mirroring = args.mirroring ? String(args.mirroring) : 'none';
  const { buffer, info } = readRom(romPath);
  const decoded = decodePpuTransferStream(buffer, info, {
    bank,
    fixedBank,
    cpuAddress
  });
  const applied = applyPpuWritesToNametables(decoded.writes, { mirroring });
  const result = {
    rom: describeRom(info),
    stream: {
      bank,
      fixedBank: fixedBank ?? (info.prgRomBanks - 1),
      address: `0x${toHex(cpuAddress)}`,
      ended: decoded.ended,
      commands: decoded.commands.length,
      ppuWrites: decoded.writes.length,
      appliedWrites: applied.appliedWrites,
      mirroring
    }
  };

  if (args.out) {
    const output = path.resolve(String(args.out));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, applied.nametables);
    result.output = output;
  }

  printJson(result);
}

function replayPpuBufferTraceCommand(args) {
  const tracePath = required(args, 'trace');
  const mirroring = args.mirroring ? String(args.mirroring) : 'none';
  const replay = replayPpuBufferTrace(tracePath, {
    firstFrame: integerOption(args, 'first-frame', undefined),
    lastFrame: integerOption(args, 'last-frame', undefined),
    mirroring
  });

  const result = {
    trace: path.resolve(tracePath),
    firstFrame: replay.firstFrame,
    lastFrame: replay.lastFrame,
    mirroring: replay.mirroring,
    framesSeen: replay.framesSeen,
    framesApplied: replay.framesApplied,
    commands: replay.commands,
    ppuWrites: replay.ppuWrites,
    appliedWrites: replay.appliedWrites,
    unsupported: replay.unsupported
  };

  if (args.compare) {
    const expected = fs.readFileSync(String(args.compare));
    result.compare = compareNametables(replay.nametables, expected);
    result.compare.expected = path.resolve(String(args.compare));
  }

  if (args.out) {
    const output = path.resolve(String(args.out));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, replay.nametables);
    result.output = output;
  }

  printJson(result);
}

function inspectBackgroundContextCommand(args) {
  const romPath = required(args, 'rom');
  const objset = requiredIntegerOption(args, 'objset');
  const area = requiredIntegerOption(args, 'area');
  const submap = integerOption(args, 'submap', 0);
  const { buffer, info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    backgroundContext: deriveBackgroundContext(buffer, info, {
      objset,
      area,
      submap
    })
  });
}

function inspectRuntimeContextCommand(args) {
  if (args.capture) {
    const inspected = readCaptureRuntimeContext(String(args.capture));
    printJson({
      capture: inspected.capture,
      cpu: inspected.cpu,
      state: inspected.state && {
        name: inspected.state.name,
        location: inspected.state.location,
        variant: inspected.state.variant,
        access: inspected.state.access,
        statePath: inspected.state.statePath
      },
      runtimeContext: inspected.publicRuntimeContext,
      paletteBytes: inspected.paletteBytes
    });
    return;
  }

  if (args.fixtures) {
    printJson(inspectRuntimeContextFixtures(String(args.fixtures)));
    return;
  }

  printJson(inspectRuntimeContextFixtures());
}

function inspectRuntimeContextMapCommand(args) {
  const romPath = required(args, 'rom');
  const { buffer, info } = readRom(romPath);
  const atlas = buildExteriorAtlas(buffer, info);
  const resolver = createRuntimeContextResolver(buffer, info, atlas.candidates);
  printJson({
    rom: describeRom(info),
    runtimeContextMap: resolver.inspect()
  });
}

function renderNativeBackgroundCommand(args, renderFn, defaultVisiblePage) {
  const romPath = required(args, 'rom');
  const visiblePage = integerOption(args, 'visible-page', defaultVisiblePage);
  const { buffer, info } = readRom(romPath);
  const rendered = renderFn(buffer, info, {
    mirroring: args.mirroring ? String(args.mirroring) : undefined
  });

  const result = {
    rom: describeRom(info),
    renderer: rendered.descriptor,
    metadata: rendered.metadata
  };

  if (args.compare) {
    const expectedPath = String(args.compare);
    const expected = fs.readFileSync(expectedPath);
    result.compare = compareNametables(rendered.nametables, expected);
    result.compare.expected = path.resolve(expectedPath);
    result.compare.visiblePage = visiblePage;
    if (!result.compare.pages[visiblePage]) {
      throw new Error(`visible page ${visiblePage} is outside compared nametable pages`);
    }
    result.compare.visiblePageExact = result.compare.pages[visiblePage].differingBytes === 0;
    result.compare.visiblePage0Exact = result.compare.pages[0].differingBytes === 0;
  }

  if (args.out) {
    const output = path.resolve(String(args.out));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, rendered.nametables);
    result.output = output;
  }

  printJson(result);
}

function renderBackgroundDescriptorCommand(args) {
  const descriptorId = required(args, 'descriptor');
  const descriptor = loadBackgroundDescriptor(descriptorId, {
    filePath: args['descriptor-file'] ? String(args['descriptor-file']) : undefined
  });
  const defaultVisiblePage = descriptor.defaultVisiblePage ??
    descriptor.validation?.[0]?.visiblePage ??
    descriptor.pages[0]?.page ??
    0;

  renderNativeBackgroundCommand(args, (rom, info, opts) => renderNativeBackgroundNametables(rom, info, {
    ...opts,
    descriptor
  }), defaultVisiblePage);
}

function renderBackgroundDescriptorPngCommand(args) {
  const romPath = required(args, 'rom');
  const descriptorId = required(args, 'descriptor');
  const descriptor = loadBackgroundDescriptor(descriptorId, {
    filePath: args['descriptor-file'] ? String(args['descriptor-file']) : undefined
  });
  const visiblePage = integerOption(
    args,
    'visible-page',
    descriptor.defaultVisiblePage ?? descriptor.validation?.[0]?.visiblePage ?? descriptor.pages[0]?.page ?? 0
  );
  const output = args.out
    ? path.resolve(String(args.out))
    : path.resolve(path.join('out', 'decoder', `${descriptor.id}-native-background.png`));
  const { buffer, info } = readRom(romPath);
  const rendered = renderNativeBackgroundImage(buffer, info, {
    descriptor,
    visiblePage,
    statePath: args.state ? String(args.state) : undefined,
    mirroring: args.mirroring ? String(args.mirroring) : undefined,
    scrollX: integerOption(args, 'scroll-x', undefined),
    scrollY: integerOption(args, 'scroll-y', undefined),
    nametableIndex: integerOption(args, 'nametable-index', undefined),
    bgPatternBase: integerOption(args, 'bg-pattern-base', undefined)
  });
  writePng(output, rendered.width, rendered.height, rendered.rgba);

  const result = {
    rom: describeRom(info),
    renderer: descriptor.id,
    output,
    width: rendered.width,
    height: rendered.height,
    metadata: rendered.metadata
  };

  if (args['compare-png']) {
    const expectedPath = path.resolve(String(args['compare-png']));
    const expected = readPng(expectedPath);
    const diff = diffImages(expected, rendered);
    const diffPath = args['diff-out']
      ? path.resolve(String(args['diff-out']))
      : path.join(path.dirname(output), `${path.basename(output, path.extname(output))}.diff.png`);
    writePng(diffPath, diff.width, diff.height, diff.rgba);
    result.comparePng = {
      expected: expectedPath,
      output: diffPath,
      differingPixels: diff.differingPixels,
      totalPixels: diff.totalPixels,
      differenceRatio: diff.differenceRatio,
      exact: diff.differingPixels === 0
    };
  }

  printJson(result);
}

function renderRegionPngCommand(args) {
  const romPath = required(args, 'rom');
  const regionId = required(args, 'region');
  const output = args.out
    ? path.resolve(String(args.out))
    : path.resolve(path.join('out', 'regions', `${regionId}.png`));
  const region = loadRegion(regionId, {
    filePath: args['region-file'] ? String(args['region-file']) : undefined
  });
  const { buffer, info } = readRom(romPath);
  const result = {
    rom: describeRom(info),
    region: renderRegionPng(buffer, info, region, output, {
      columns: integerOption(args, 'columns', undefined)
    })
  };

  if (args['metadata-out']) {
    const metadataOutput = path.resolve(String(args['metadata-out']));
    fs.mkdirSync(path.dirname(metadataOutput), { recursive: true });
    fs.writeFileSync(metadataOutput, `${JSON.stringify(result.region.metadata, null, 2)}\n`);
    result.region.metadataOutput = metadataOutput;
  }

  printJson(result);
}

function renderLayoutSegmentPngCommand(args) {
  const romPath = required(args, 'rom');
  const segmentId = required(args, 'segment');
  const output = args.out
    ? path.resolve(String(args.out))
    : path.resolve(path.join('out', 'layout-segments', `${segmentId}.png`));
  const segment = loadLayoutSegment(segmentId, {
    filePath: args['segment-file'] ? String(args['segment-file']) : undefined
  });
  const { buffer, info } = readRom(romPath);
  const result = {
    rom: describeRom(info),
    segment: renderLayoutSegmentPng(buffer, info, segment, output, {
      descriptorFile: args['descriptor-file'] ? String(args['descriptor-file']) : undefined
    })
  };

  if (args['metadata-out']) {
    const metadataOutput = path.resolve(String(args['metadata-out']));
    fs.mkdirSync(path.dirname(metadataOutput), { recursive: true });
    fs.writeFileSync(metadataOutput, `${JSON.stringify(result.segment.metadata, null, 2)}\n`);
    result.segment.metadataOutput = metadataOutput;
  }

  printJson(result);
}

function renderLayoutRoutePngCommand(args) {
  const romPath = required(args, 'rom');
  const routeId = required(args, 'route');
  const output = args.out
    ? path.resolve(String(args.out))
    : path.resolve(path.join('out', 'layout-routes', `${routeId}.png`));
  const route = loadLayoutRoute(routeId, {
    filePath: args['segment-file'] ? String(args['segment-file']) : undefined
  });
  const { buffer, info } = readRom(romPath);
  const result = {
    rom: describeRom(info),
    route: renderLayoutRoutePng(buffer, info, route, output, {
      descriptorFile: args['descriptor-file'] ? String(args['descriptor-file']) : undefined
    })
  };

  if (args['metadata-out']) {
    const metadataOutput = path.resolve(String(args['metadata-out']));
    fs.mkdirSync(path.dirname(metadataOutput), { recursive: true });
    fs.writeFileSync(metadataOutput, `${JSON.stringify(result.route.metadata, null, 2)}\n`);
    result.route.metadataOutput = metadataOutput;
  }

  printJson(result);
}

function renderExteriorAtlasCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'exterior-atlas');
  const { buffer, info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    atlas: renderExteriorAtlas(buffer, info, { outDir })
  });
}

function renderExteriorTopologyCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'exterior-topology');
  const { buffer, info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    topology: renderExteriorTopology(buffer, info, { outDir })
  });
}

function renderExteriorCompositionCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'exterior-composition');
  const { info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    composition: renderExteriorComposition({
      topologyFile: args.topology ? String(args.topology) : undefined,
      recipeAtlasFile: args.atlas ? String(args.atlas) : undefined,
      routeId: args.route ? String(args.route) : undefined,
      variant: args.variant ? String(args.variant) : undefined,
      outDir
    })
  });
}

function renderExteriorWorldCompositionCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'exterior-world-composition');
  const { info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    worldComposition: renderExteriorWorldComposition({
      topologyFile: args.topology ? String(args.topology) : undefined,
      recipeAtlasFile: args.atlas ? String(args.atlas) : undefined,
      transitionRulesFile: args['transition-rules'] ? String(args['transition-rules']) : undefined,
      variant: args.variant ? String(args.variant) : undefined,
      outDir
    })
  });
}

function runTransitionProbesCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'transition-probes');
  const { info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    transitionProbes: runTransitionProbes({
      romPath,
      fixtureFile: args.fixtures ? String(args.fixtures) : undefined,
      topologyFile: args.topology ? String(args.topology) : undefined,
      outDir,
      only: args.only ? String(args.only) : undefined,
      timeout: numericOption(args, 'timeout', undefined)
    })
  });
}

function decodeTransitionRoutineCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'transition-routine');
  const { buffer, info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    transitionRoutine: decodeTransitionRoutine(buffer, info, {
      probesFile: args.probes ? String(args.probes) : undefined,
      topologyFile: args.topology ? String(args.topology) : undefined,
      outDir
    })
  });
}

function captureRenderRecipeFixturesCommand(args) {
  const romPath = required(args, 'rom');
  printJson(captureRenderRecipeFixtures({
    romPath,
    fixtureFile: args.fixtures ? String(args.fixtures) : undefined,
    only: args.only ? String(args.only) : undefined,
    skipExisting: Boolean(args['skip-existing']),
    timeout: numericOption(args, 'timeout', 30)
  }));
}

function auditRenderRecipesCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'render-recipe-audit');
  const { buffer, info } = readRom(romPath);
  const audit = auditRenderRecipes(buffer, info, {
    fixtureFile: args.fixtures ? String(args.fixtures) : undefined,
    outDir
  });
  printJson({
    rom: describeRom(info),
    audit: {
      output: path.resolve(outDir),
      summary: audit.summary
    }
  });
}

function renderRecipeAtlasCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'render-recipe-atlas');
  const { buffer, info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    atlas: renderRecipeAtlas(buffer, info, {
      auditFile: args.audit ? String(args.audit) : undefined,
      outDir
    })
  });
}

function analyzeInteriorMapCommand(args) {
  const romPath = required(args, 'rom');
  const outFile = args.out ? String(args.out) : path.join('out', 'interior-map-research', `${args.id || 'interior-map'}.json`);
  const objset = requiredIntegerOption(args, 'objset');
  const areas = integerListOption(args, 'areas');
  const area = areas ? undefined : requiredIntegerOption(args, 'area');
  const { buffer, info } = readRom(romPath);
  const analysis = analyzeInteriorMap(buffer, info, {
    id: args.id ? String(args.id) : undefined,
    objset,
    area,
    areas,
    atlasFile: args.atlas ? String(args.atlas) : undefined
  });
  writeInteriorMapResearch(outFile, analysis);
  printJson({
    rom: describeRom(info),
    interiorMapResearch: {
      output: path.resolve(outFile),
      summary: analysis.summary,
      composition: analysis.composition
    }
  });
}

function buildGuideSliceCommand(args) {
  const romPath = required(args, 'rom');
  const sliceFile = required(args, 'slice');
  const atlasFile = required(args, 'atlas');
  const outDir = required(args, 'out');
  const { buffer, info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    guideSlice: buildGuideSlice(buffer, info, {
      sliceFile,
      atlasFile,
      outDir,
      layout: args.layout ? String(args.layout) : undefined
    })
  });
}

function runActorTracesCommand(args) {
  const romPath = required(args, 'rom');
  printJson(runActorTraces({
    romPath,
    fixtureFile: args.fixtures ? String(args.fixtures) : undefined,
    outDir: args.out ? String(args.out) : undefined,
    only: args.only ? String(args.only) : undefined,
    skipExisting: Boolean(args['skip-existing']),
    timeout: numericOption(args, 'timeout', undefined)
  }));
}

function analyzeActorTracesCommand(args) {
  printJson(analyzeActorTraces({
    fixtureFile: args.fixtures ? String(args.fixtures) : undefined,
    outDir: args.out ? String(args.out) : undefined,
    only: args.only ? String(args.only) : undefined
  }));
}

function decodeActorSelectorStreamsCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'actor-selector-streams');
  const { buffer, info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    actorSelectorStreams: decodeActorSelectorStreams(buffer, info, {
      fixtureFile: args.fixtures ? String(args.fixtures) : undefined,
      tracesDir: args.traces ? String(args.traces) : undefined,
      outDir
    })
  });
}

function decodeFishmanSpriteProofCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'fishman-sprite-proof');
  const { buffer, info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    fishmanSpriteProof: decodeFishmanSpriteProof(buffer, info, {
      outDir
    })
  });
}

function decodeGuideActorSpriteCoverageCommand(args) {
  const romPath = required(args, 'rom');
  const outDir = args.out ? String(args.out) : path.join('out', 'guide-actor-sprite-coverage');
  const { buffer, info } = readRom(romPath);
  printJson({
    rom: describeRom(info),
    guideActorSpriteCoverage: decodeGuideActorSpriteCoverage(buffer, info, {
      outDir
    })
  });
}

function renderJovaNativeCommand(args) {
  renderNativeBackgroundCommand(args, renderJovaNativeNametables, 0);
}

function renderJovaWoodsNativeCommand(args) {
  renderNativeBackgroundCommand(args, renderJovaWoodsNativeNametables, 0);
}

function main() {
  const [command = 'help', ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (command === 'help' || command === '--help' || command === '-h') {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  if (command === 'verify-rom') {
    verifyRom(args);
    return;
  }

  if (command === 'extract-chr') {
    extractChr(args);
    return;
  }

  if (command === 'manifest') {
    manifest(args);
    return;
  }

  if (command === 'render-all') {
    renderAll(args);
    return;
  }

  if (command === 'mesen-capture') {
    mesenCapture(args);
    return;
  }

  if (command === 'mesen-capture-screen') {
    mesenCaptureScreen(args);
    return;
  }

  if (command === 'mesen-trace-actors') {
    mesenTraceActors(args);
    return;
  }

  if (command === 'render-ppu-capture') {
    renderPpuCaptureCommand(args);
    return;
  }

  if (command === 'decode-transfer') {
    decodeTransferCommand(args);
    return;
  }

  if (command === 'replay-ppu-buffer-trace') {
    replayPpuBufferTraceCommand(args);
    return;
  }

  if (command === 'inspect-background-context') {
    inspectBackgroundContextCommand(args);
    return;
  }

  if (command === 'inspect-runtime-context') {
    inspectRuntimeContextCommand(args);
    return;
  }

  if (command === 'inspect-runtime-context-map') {
    inspectRuntimeContextMapCommand(args);
    return;
  }

  if (command === 'render-background-native') {
    renderBackgroundDescriptorCommand(args);
    return;
  }

  if (command === 'render-background-native-png') {
    renderBackgroundDescriptorPngCommand(args);
    return;
  }

  if (command === 'render-region-png') {
    renderRegionPngCommand(args);
    return;
  }

  if (command === 'render-layout-segment-png') {
    renderLayoutSegmentPngCommand(args);
    return;
  }

  if (command === 'render-layout-route-png') {
    renderLayoutRoutePngCommand(args);
    return;
  }

  if (command === 'render-exterior-atlas') {
    renderExteriorAtlasCommand(args);
    return;
  }

  if (command === 'render-exterior-topology') {
    renderExteriorTopologyCommand(args);
    return;
  }

  if (command === 'render-exterior-composition') {
    renderExteriorCompositionCommand(args);
    return;
  }

  if (command === 'render-exterior-world-composition') {
    renderExteriorWorldCompositionCommand(args);
    return;
  }

  if (command === 'build-guide-slice') {
    buildGuideSliceCommand(args);
    return;
  }

  if (command === 'run-actor-traces') {
    runActorTracesCommand(args);
    return;
  }

  if (command === 'analyze-actor-traces') {
    analyzeActorTracesCommand(args);
    return;
  }

  if (command === 'decode-actor-selector-streams') {
    decodeActorSelectorStreamsCommand(args);
    return;
  }

  if (command === 'decode-fishman-sprite-proof') {
    decodeFishmanSpriteProofCommand(args);
    return;
  }

  if (command === 'decode-guide-actor-sprite-coverage') {
    decodeGuideActorSpriteCoverageCommand(args);
    return;
  }

  if (command === 'run-transition-probes') {
    runTransitionProbesCommand(args);
    return;
  }

  if (command === 'decode-transition-routine') {
    decodeTransitionRoutineCommand(args);
    return;
  }

  if (command === 'capture-render-recipe-fixtures') {
    captureRenderRecipeFixturesCommand(args);
    return;
  }

  if (command === 'audit-render-recipes') {
    auditRenderRecipesCommand(args);
    return;
  }

  if (command === 'render-recipe-atlas') {
    renderRecipeAtlasCommand(args);
    return;
  }

  if (command === 'analyze-interior-map') {
    analyzeInteriorMapCommand(args);
    return;
  }

  if (command === 'render-jova-native') {
    renderJovaNativeCommand(args);
    return;
  }

  if (command === 'render-jova-woods-native') {
    renderJovaWoodsNativeCommand(args);
    return;
  }

  throw new Error(`unknown command "${command}"\n\n${usage()}`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
