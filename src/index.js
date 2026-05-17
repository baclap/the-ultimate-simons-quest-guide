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
    '  node src/index.js mesen-capture-screen --rom roms/cv2.nes --name jova-woods-day --location "Jova Woods" --variant day --access outdoor --state out/states/jova-woods.mss --settle-frames 30 --out out/captures/jova-woods-day',
    '  node src/index.js render-ppu-capture --capture out/captures/jova-day --out out/captures/jova-day/background.png',
    '  node src/index.js decode-transfer --rom roms/cv2.nes --bank 4 --address 0x8000 --mirroring vertical --out out/transfer.bin',
    '  node src/index.js replay-ppu-buffer-trace --trace out/mesen-buffer-trace/ppu-buffer-writes.tsv --mirroring vertical --compare out/captures/jova-day/ppu-2000-2fff-nametables.bin --out out/mesen-buffer-trace/replayed-nametables.bin',
    '  node src/index.js inspect-background-context --rom roms/cv2.nes --objset 0x02 --area 0 --submap 0',
    '  node src/index.js render-background-native --rom roms/cv2.nes --descriptor jova-day --compare out/captures/jova-day/ppu-2000-2fff-nametables.bin --out out/decoder/jova-native-nametables.bin',
    '  node src/index.js render-background-native-png --rom roms/cv2.nes --descriptor jova-day --state out/captures/jova-day/state.json --compare-png out/captures/jova-day/background.png --out out/decoder/jova-native-background.png',
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
    '  render-ppu-capture  Render background PNG from captured PPU artifacts.',
    '  decode-transfer  Decode the fixed-bank PPU transfer stream used by routine $C6C0.',
    '  replay-ppu-buffer-trace  Replay traced $0700 NMI PPU buffer writes into nametable bytes.',
    '  inspect-background-context  Derive background table pointers from objset/area/submap.',
    '  render-background-native  Render a descriptor-backed ROM-native nametable checkpoint.',
    '  render-background-native-png  Render a descriptor-backed ROM-native background PNG.',
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

  if (command === 'render-background-native') {
    renderBackgroundDescriptorCommand(args);
    return;
  }

  if (command === 'render-background-native-png') {
    renderBackgroundDescriptorPngCommand(args);
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
