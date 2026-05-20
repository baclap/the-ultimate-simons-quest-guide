'use strict';

const fs = require('fs');
const path = require('path');
const { runMesenCapture } = require('./mesen');

const DEFAULT_FIXTURE_FILE = path.join('data', 'transition-probes.json');
const DEFAULT_OUT_DIR = path.join('out', 'transition-probes');
const TRACE_SCRIPT = path.join('tools', 'mesen', 'trace-transition.lua');

const CPU_LABELS = {
  0x0026: 'gameState',
  0x0030: 'runtimeObjset',
  0x0033: 'menuOrInventoryState',
  0x003d: 'runtimeActorPointerLow',
  0x003e: 'runtimeActorPointerHigh',
  0x004f: 'selectedItem',
  0x0050: 'runtimeArea',
  0x0051: 'runtimeSubmapRaw',
  0x0063: 'runtimeTileSetPointerLow',
  0x0064: 'runtimeTileSetPointerHigh',
  0x008e: 'transitionOrScrollState'
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function hex(value, width = 2) {
  if (value == null || Number.isNaN(value)) {
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

function normalizeContext(raw, label) {
  return {
    objset: parseInteger(raw.objset, `${label}.objset`),
    area: parseInteger(raw.area, `${label}.area`),
    submap: parseInteger(raw.submap, `${label}.submap`)
  };
}

function publicContext(context) {
  if (!context) {
    return undefined;
  }
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

function publicPpu(row) {
  if (!row) {
    return undefined;
  }
  return {
    xScroll: row.ppuXScroll,
    videoRamAddr: hex(row.ppuVideoRamAddr, 4),
    tmpVideoRamAddr: hex(row.ppuTmpVideoRamAddr, 4),
    bgPatternAddr: hex(row.ppuBgPatternAddr, 4),
    spritePatternAddr: hex(row.ppuSpritePatternAddr, 4)
  };
}

function loadTransitionProbeManifest(filePath = DEFAULT_FIXTURE_FILE) {
  const resolved = path.resolve(filePath);
  const manifest = readJson(resolved);
  return {
    ...manifest,
    file: resolved,
    probes: (manifest.probes || []).map((probe) => ({
      ...probe,
      state: path.resolve(probe.state),
      steps: (probe.steps || []).map((step) => ({
        ...step,
        targetContext: normalizeContext(step.targetContext, `${probe.id}.${step.id}.targetContext`)
      }))
    }))
  };
}

function encodeSteps(steps) {
  return steps.map((step) => [
    step.id,
    step.input,
    step.targetContext.objset,
    step.targetContext.area,
    step.targetContext.submap,
    step.maxFrames,
    step.settleFrames
  ].join(',')).join(';');
}

function parseTrace(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const text = fs.readFileSync(filePath, 'utf8').trim();
  if (!text) {
    return [];
  }
  const lines = text.split(/\r?\n/);
  const header = lines.shift().split('\t');
  return lines.filter(Boolean).map((line) => {
    const values = line.split('\t');
    const raw = {};
    header.forEach((key, index) => {
      raw[key] = values[index] ?? '';
    });
    return {
      frame: Number(raw.frame),
      stepId: raw.stepId,
      stepFrame: Number(raw.stepFrame),
      input: raw.input,
      status: raw.status,
      firstTargetFrame: raw.firstTargetFrame === '' ? undefined : Number(raw.firstTargetFrame),
      objset: Number(raw.objset),
      area: Number(raw.area),
      submapRaw: Number(raw.submapRaw),
      submap: Number(raw.submap),
      submapFlags: Number(raw.submapFlags),
      actorPointer: Number(raw.actorPointer),
      tileSetPointer: Number(raw.tileSetPointer),
      gameState: Number(raw.gameState),
      menuState: Number(raw.menuState),
      selectedItem: Number(raw.selectedItem),
      transitionState: Number(raw.transitionState),
      ppuXScroll: Number(raw.ppuXScroll),
      ppuVideoRamAddr: Number(raw.ppuVideoRamAddr),
      ppuTmpVideoRamAddr: Number(raw.ppuTmpVideoRamAddr),
      ppuBgPatternAddr: Number(raw.ppuBgPatternAddr),
      ppuSpritePatternAddr: Number(raw.ppuSpritePatternAddr)
    };
  });
}

function contextFromRow(row) {
  if (!row) {
    return undefined;
  }
  return {
    objset: row.objset,
    area: row.area,
    submap: row.submap,
    submapRaw: row.submapRaw,
    submapFlags: row.submapFlags,
    actorPointer: row.actorPointer,
    tileSetPointer: row.tileSetPointer
  };
}

function readCpuSnapshot(outDir, fileName) {
  if (!fileName) {
    return undefined;
  }
  const filePath = path.join(outDir, fileName);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  return fs.readFileSync(filePath);
}

function diffCpu(before, after) {
  if (!before || !after) {
    return [];
  }
  const count = Math.min(before.length, after.length);
  const changes = [];
  for (let address = 0; address < count; address += 1) {
    if (before[address] === after[address]) {
      continue;
    }
    changes.push({
      address,
      addressHex: hex(address, 4),
      before: before[address],
      beforeHex: hex(before[address], 2),
      after: after[address],
      afterHex: hex(after[address], 2),
      label: CPU_LABELS[address]
    });
  }
  return changes;
}

function summarizeChanges(changes) {
  return {
    count: changes.length,
    knownFields: changes.filter((change) => change.label),
    zeroPageCandidates: changes
      .filter((change) => change.address <= 0x00ff && !change.label)
      .slice(0, 64)
  };
}

function analyzeProbeOutput(probe, outDir) {
  const summaryPath = path.join(outDir, 'summary.json');
  const tracePath = path.join(outDir, 'trace.tsv');
  const summary = fs.existsSync(summaryPath)
    ? readJson(summaryPath)
    : { status: 'missing-summary', steps: [] };
  const trace = parseTrace(tracePath);

  const steps = probe.steps.map((step) => {
    const stepSummary = (summary.steps || []).find((candidate) => candidate.id === step.id) || {};
    const rows = trace.filter((row) => row.stepId === step.id);
    const firstRow = rows[0];
    const targetRow = rows.find((row) => row.frame === stepSummary.firstTargetFrame) ||
      rows.find((row) => row.objset === step.targetContext.objset &&
        row.area === step.targetContext.area &&
        row.submap === step.targetContext.submap);
    const finalRow = rows[rows.length - 1];
    const before = readCpuSnapshot(outDir, stepSummary.beforeCpu);
    const after = readCpuSnapshot(outDir, stepSummary.afterCpu);
    const changes = diffCpu(before, after);

    return {
      id: step.id,
      label: step.label,
      type: step.type,
      input: step.input,
      status: stepSummary.status || 'unknown',
      startFrame: stepSummary.startFrame,
      firstTargetFrame: stepSummary.firstTargetFrame,
      completeFrame: stepSummary.completeFrame,
      durationFrames: stepSummary.startFrame != null && stepSummary.completeFrame != null
        ? stepSummary.completeFrame - stepSummary.startFrame
        : undefined,
      framesToTarget: stepSummary.startFrame != null && stepSummary.firstTargetFrame != null
        ? stepSummary.firstTargetFrame - stepSummary.startFrame
        : undefined,
      settleFrames: step.settleFrames,
      targetContext: publicContext(step.targetContext),
      startContext: publicContext(contextFromRow(firstRow)),
      targetObservedContext: publicContext(contextFromRow(targetRow)),
      finalContext: publicContext(contextFromRow(finalRow)),
      startPpu: publicPpu(firstRow),
      targetPpu: publicPpu(targetRow),
      finalPpu: publicPpu(finalRow),
      changedBytes: summarizeChanges(changes),
      snapshots: {
        beforeCpu: stepSummary.beforeCpu,
        afterCpu: stepSummary.afterCpu
      }
    };
  });

  return {
    id: probe.id,
    label: probe.label,
    location: probe.location,
    variant: probe.variant,
    access: probe.access,
    state: probe.state,
    reason: probe.reason,
    output: outDir,
    trace: fs.existsSync(tracePath) ? tracePath : undefined,
    status: summary.status,
    totalFrames: summary.totalFrames,
    stateLoadedFrame: summary.stateLoadedFrame,
    steps
  };
}

function summarizeAnalysis(probes) {
  const steps = probes.flatMap((probe) => probe.steps);
  return {
    probes: probes.length,
    transitions: steps.length,
    completeTransitions: steps.filter((step) => step.status === 'complete').length,
    timeoutTransitions: steps.filter((step) => step.status === 'timeout').length,
    byType: steps.reduce((acc, step) => {
      acc[step.type] = (acc[step.type] || 0) + 1;
      return acc;
    }, {})
  };
}

function runTransitionProbes(opts) {
  const romPath = path.resolve(opts.romPath);
  const manifest = loadTransitionProbeManifest(opts.fixtureFile);
  const outDir = path.resolve(opts.outDir || manifest.capturesRoot || DEFAULT_OUT_DIR);
  const only = opts.only ? new Set(String(opts.only).split(',').map((value) => value.trim()).filter(Boolean)) : undefined;
  const selectedProbes = manifest.probes.filter((probe) => !only || only.has(probe.id));
  const results = [];

  fs.mkdirSync(outDir, { recursive: true });

  for (const probe of selectedProbes) {
    const probeOutDir = path.join(outDir, probe.id);
    const run = runMesenCapture({
      romPath,
      scriptPath: TRACE_SCRIPT,
      outDir: probeOutDir,
      timeout: probe.timeout || opts.timeout || 45,
      env: {
        CV2MAP_TRANSITION_PROBE_ID: probe.id,
        CV2MAP_TRANSITION_PROBE_LABEL: probe.label,
        CV2MAP_STATE_PATH: probe.state,
        CV2MAP_PRE_SETTLE_FRAMES: String(probe.preSettleFrames || 30),
        CV2MAP_TRANSITION_STEPS: encodeSteps(probe.steps)
      }
    });
    const analysis = analyzeProbeOutput(probe, probeOutDir);
    results.push({
      ...analysis,
      mesen: {
        status: run.status,
        durationMs: run.durationMs,
        outputs: run.outputs
      }
    });
  }

  const analysis = {
    schemaVersion: 1,
    source: {
      fixtureFile: path.relative(process.cwd(), manifest.file),
      script: TRACE_SCRIPT,
      notes: [
        'Transition probes use save states and scripted inputs to observe runtime state changes.',
        'The emulator trace is evidence for decoding ROM behavior; it is not source art for map rendering.'
      ]
    },
    summary: summarizeAnalysis(results),
    probes: results
  };

  const analysisPath = path.join(outDir, 'analysis.json');
  writeJson(analysisPath, analysis);
  fs.writeFileSync(
    path.join(outDir, 'analysis-data.js'),
    `window.TRANSITION_PROBES = ${JSON.stringify(analysis, null, 2)};\n`
  );

  return {
    output: outDir,
    analysis: analysisPath,
    summary: analysis.summary,
    probes: results.map((probe) => ({
      id: probe.id,
      status: probe.status,
      transitions: probe.steps.length,
      completeTransitions: probe.steps.filter((step) => step.status === 'complete').length
    }))
  };
}

module.exports = {
  analyzeProbeOutput,
  loadTransitionProbeManifest,
  runTransitionProbes
};
