'use strict';

const fs = require('fs');
const path = require('path');
const { cpuAddressToPrgOffset, readPrgByte } = require('./background');

const DEFAULT_PROBES_FILE = path.join('out', 'transition-probes', 'analysis.json');
const DEFAULT_TOPOLOGY_FILE = path.join('out', 'exterior-topology', 'topology.json');
const DEFAULT_OUT_DIR = path.join('out', 'transition-routine');
const ROUTINE_WINDOW_RADIUS = 8;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function asRelative(root, filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function parseHex(value) {
  if (value == null) return undefined;
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  return Number.parseInt(text.replace(/^0x/i, ''), 16);
}

function hex(value, width = 2) {
  if (value == null) {
    return undefined;
  }
  if (!Number.isInteger(value)) {
    throw new Error(`cannot format invalid hex value: ${value}`);
  }
  return `0x${value.toString(16).toUpperCase().padStart(width, '0')}`;
}

function parseTsv(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return [];
  }
  const lines = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/);
  if (lines.length <= 1) {
    return [];
  }
  const headers = lines[0].split('\t');
  return lines.slice(1).filter(Boolean).map((line) => {
    const cells = line.split('\t');
    return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
  });
}

function rawWritesForStep(probe, step) {
  const rows = parseTsv(probe.ramWrites);
  return rows.filter((row) => row.stepId === step.id);
}

function normalizePc(pc) {
  const parsed = parseHex(pc);
  return Number.isInteger(parsed) ? hex(parsed, 4) : undefined;
}

function normalizeAddress(address) {
  const parsed = parseHex(address);
  return Number.isInteger(parsed) ? hex(parsed, 4) : undefined;
}

function writeMetadataForByte(rawWrites, byte) {
  const pc = normalizePc(byte.lastTransitionRoutineWrite?.pc);
  const address = normalizeAddress(byte.addressHex);
  return rawWrites
    .filter((row) => normalizePc(row.pc) === pc && normalizeAddress(row.addr) === address)
    .map((row) => ({
      frame: Number(row.frame),
      stepFrame: Number(row.stepFrame),
      pc,
      prgReg: row.prgReg == null ? undefined : hex(parseHex(row.prgReg), 2),
      a: row.a == null ? undefined : hex(parseHex(row.a), 2),
      x: row.x == null ? undefined : hex(parseHex(row.x), 2),
      y: row.y == null ? undefined : hex(parseHex(row.y), 2),
      address,
      value: row.value == null ? undefined : hex(parseHex(row.value), 2),
      context: {
        objset: hex(Number(row.objset), 2),
        area: hex(Number(row.area), 2),
        submapRaw: hex(Number(row.submapRaw), 2),
        submap: hex(Number(row.submap), 2),
        actorPointer: hex(Number(row.actorPointer), 4),
        tileSetPointer: hex(Number(row.tileSetPointer), 4),
        transitionState: Number(row.transitionState)
      }
    }));
}

function romWindowForPc(rom, info, pc, radius = ROUTINE_WINDOW_RADIUS) {
  const start = Math.max(0xc000, pc - radius);
  const end = Math.min(0xffff, pc + radius);
  const bytes = [];
  for (let address = start; address <= end; address += 1) {
    bytes.push({
      address: hex(address, 4),
      value: hex(readPrgByte(rom, info, address), 2),
      isTracePc: address === pc
    });
  }
  return {
    pc: hex(pc, 4),
    fixedBank: info.prgRomBanks - 1,
    fileOffset: hex(cpuAddressToPrgOffset(info, pc), 6),
    start: hex(start, 4),
    end: hex(end, 4),
    radius,
    bytes,
    note: 'Mesen write PC evidence is preserved as trace evidence; this window does not assume the PC is the exact write opcode boundary.'
  };
}

function uniqueWritePcs(steps) {
  const pcs = new Map();
  for (const step of steps) {
    for (const byte of step.routineBytes || []) {
      const pc = normalizePc(byte.lastTransitionRoutineWrite?.pc);
      if (pc) {
        pcs.set(pc, parseHex(pc));
      }
    }
  }
  return [...pcs.entries()]
    .sort((left, right) => left[1] - right[1])
    .map(([pc]) => pc);
}

function topologyEdgeForStep(step) {
  const evidence = step.topologyEdge || {};
  return evidence.edge || (evidence.candidateEdges || [])[0];
}

function transitionBytesForStep(step) {
  const edge = topologyEdgeForStep(step);
  return edge?.transition?.bytes;
}

function transitionSemanticsForStep(step) {
  const edge = topologyEdgeForStep(step);
  return edge?.semantics;
}

function routineByteSummary(byte, rawWrites) {
  return {
    address: byte.addressHex,
    before: byte.beforeHex,
    after: byte.afterHex,
    changed: byte.changed,
    writeCount: byte.writeCount,
    transitionRoutineWriteCount: byte.transitionRoutineWriteCount,
    writtenInTransitionRoutine: byte.writtenInTransitionRoutine,
    lastWrite: byte.lastWrite,
    lastTransitionRoutineWrite: byte.lastTransitionRoutineWrite,
    topTransitionRoutinePcs: byte.topTransitionRoutinePcs,
    writeMetadata: writeMetadataForByte(rawWrites, byte)
  };
}

function publicStep(probe, step, rawWrites) {
  const edge = topologyEdgeForStep(step);
  const beforeBounds = step.spriteEvidence?.beforeSimon?.bounds;
  const afterBounds = step.spriteEvidence?.afterSimon?.bounds;
  return {
    probeId: probe.id,
    stepId: step.id,
    label: step.label,
    type: step.type,
    input: step.input,
    status: step.status,
    framesToTarget: step.framesToTarget,
    startContext: step.startContext,
    finalContext: step.finalContext,
    topology: {
      matchStatus: step.topologyEdge?.matchStatus,
      startNode: step.topologyEdge?.startNode,
      finalNode: step.topologyEdge?.finalNode,
      edgeId: edge?.id,
      edgeType: edge?.type,
      direction: edge?.direction,
      transitionBytes: edge?.transition?.bytes,
      transitionKind: edge?.transition?.kind,
      transitionSemantics: edge?.semantics,
      note: edge?.note
    },
    simon: {
      beforeX: hex(beforeBounds?.xCenter, 2),
      afterX: hex(afterBounds?.xCenter, 2),
      beforeY: hex(beforeBounds?.yCenter, 2),
      afterY: hex(afterBounds?.yCenter, 2),
      beforeSpriteTop: hex(beforeBounds?.yMin, 2),
      afterSpriteTop: hex(afterBounds?.yMin, 2)
    },
    camera: {
      startScroll: step.startPpu?.scroll,
      finalScroll: step.finalPpu?.scroll,
      changedMetrics: (step.cameraEvidence?.changedMetrics || []).map((metric) => ({
        metric: metric.name,
        before: metric.beforeHex,
        after: metric.afterHex
      }))
    },
    routineBytes: (step.routineBytes || []).map((byte) => routineByteSummary(byte, rawWrites))
  };
}

function flattenSteps(analysis) {
  const rows = [];
  for (const probe of analysis.probes || []) {
    const rawWritesByStep = new Map();
    for (const step of probe.steps || []) {
      if (!rawWritesByStep.has(step.id)) {
        rawWritesByStep.set(step.id, rawWritesForStep(probe, step));
      }
      rows.push(publicStep(probe, step, rawWritesByStep.get(step.id)));
    }
  }
  return rows;
}

function edgeEvidence(transitions) {
  return transitions
    .filter((step) => step.topology.edgeId)
    .map((step) => ({
      edgeId: step.topology.edgeId,
      stepId: step.stepId,
      probeId: step.probeId,
      matchStatus: step.topology.matchStatus,
      status: step.status,
      type: step.type,
      transitionBytes: step.topology.transitionBytes,
      transitionSemantics: step.topology.transitionSemantics,
      simon: step.simon,
      cameraChangedMetrics: step.camera.changedMetrics.map((metric) => metric.metric),
      routineAfterBytes: Object.fromEntries(step.routineBytes.map((byte) => [byte.address, byte.after])),
      routineWriteCounts: Object.fromEntries(step.routineBytes.map((byte) => [byte.address, byte.transitionRoutineWriteCount]))
    }));
}

function directRoleMatches(transitions, address, metric) {
  return transitions.filter((step) => {
    const byte = step.routineBytes.find((candidate) => candidate.address === address);
    return byte && byte.after === step.simon[metric];
  }).map((step) => step.stepId);
}

function byteRoleHypotheses(analysis, transitions) {
  const xCandidate = (analysis.summary?.xCenterCandidates || [])[0];
  const routineAddresses = analysis.summary?.routineBytes?.addresses || [];
  const yDeltaSteps = transitions.filter((step) => step.simon.beforeY !== step.simon.afterY);
  const directYMatches = routineAddresses.map((address) => ({
    address,
    afterCenterMatches: directRoleMatches(yDeltaSteps, address, 'afterY'),
    afterSpriteTopMatches: directRoleMatches(yDeltaSteps, address, 'afterSpriteTop')
  }));
  const completeRoutineSteps = transitions.filter((step) => (
    step.routineBytes.length === routineAddresses.length &&
    step.routineBytes.every((byte) => byte.writtenInTransitionRoutine)
  )).length;
  const deborah = transitions.find((step) => step.stepId === 'deborah-cliff-to-bodley-door');

  return {
    promoted: [
      {
        id: 'simon-screen-center-x-0348',
        status: xCandidate?.confidence === 'high' ? 'promoted' : 'diagnostic',
        address: xCandidate?.addressHex,
        evidence: `${xCandidate?.matchedSteps || 0} matched transition steps`,
        note: 'Inherited from transition probe analysis; this is a sprite-staging placement evidence field, not a ROM table by itself.'
      },
      {
        id: 'routine-output-byte-matrix',
        status: completeRoutineSteps === transitions.length ? 'promoted' : 'diagnostic',
        addresses: routineAddresses,
        evidence: `${completeRoutineSteps}/${transitions.length} transitions have all routine bytes written in the transition routine window.`,
        note: '$70-$73 are promoted as observed transition routine output bytes, with role decoding still separate.'
      }
    ],
    diagnostic: [
      {
        id: 'visible-y-direct-byte-role',
        status: 'diagnostic',
        yDeltaSteps: yDeltaSteps.map((step) => step.stepId),
        directYMatches,
        note: 'No routine byte is promoted as a complete visible-Y formula yet; partial matches are retained for routine reading.'
      },
      {
        id: 'special-transport-double-write',
        status: deborah ? 'diagnostic' : 'unobserved',
        stepId: deborah?.stepId,
        writeCounts: deborah && Object.fromEntries(deborah.routineBytes.map((byte) => [byte.address, byte.transitionRoutineWriteCount])),
        note: 'Deborah Cliff writes each routine byte twice before reaching Bodley Mansion - Door, so transport remains a special diagnostic path.'
      },
      {
        id: 'camera-scroll-byte-role',
        status: 'diagnostic',
        note: 'Camera/scroll changes are preserved per transition, but no direct $70-$73 to PPU scroll rule is promoted.'
      }
    ],
    unresolved: [
      {
        id: 'trace-pc-alignment',
        status: 'unresolved',
        note: 'ROM byte windows are included so the write PCs can be aligned to actual instructions in a later routine read.'
      },
      {
        id: 'full-placement-camera-equation',
        status: 'unresolved',
        note: 'The current fixtures prove byte writes and selected outputs; they do not yet decode a complete formula for all transition classes.'
      }
    ]
  };
}

function decodeTransitionRoutine(rom, info, opts = {}) {
  const projectRoot = path.resolve(opts.projectRoot || process.cwd());
  const probesFile = path.resolve(opts.probesFile || DEFAULT_PROBES_FILE);
  const topologyFile = opts.topologyFile ? path.resolve(opts.topologyFile) : path.resolve(DEFAULT_TOPOLOGY_FILE);
  const outDir = path.resolve(opts.outDir || DEFAULT_OUT_DIR);
  const analysis = readJson(probesFile);
  const topology = fs.existsSync(topologyFile) ? readJson(topologyFile) : undefined;
  const transitions = flattenSteps(analysis);
  const writePcs = uniqueWritePcs(transitions.map((step) => ({
    routineBytes: step.routineBytes.map((byte) => ({
      lastTransitionRoutineWrite: byte.lastTransitionRoutineWrite
    }))
  })));
  const romWindows = writePcs.map((pc) => romWindowForPc(rom, info, parseHex(pc)));
  const evidence = edgeEvidence(transitions);

  const decoder = {
    schemaVersion: 1,
    source: {
      renderer: 'transition-routine-decoder',
      probesFile: asRelative(projectRoot, probesFile),
      topologyFile: topology ? asRelative(projectRoot, topologyFile) : undefined,
      notes: [
        'This decoder summarizes routine evidence; it does not treat emulator screenshots as source art.',
        'Mesen write PCs are preserved as trace evidence with nearby ROM byte windows.',
        'Placement/camera rules are promoted only when supported by the current fixtures.'
      ]
    },
    summary: {
      probes: analysis.summary?.probes || 0,
      transitions: analysis.summary?.transitions || transitions.length,
      completeTransitions: analysis.summary?.completeTransitions || transitions.filter((step) => step.status === 'complete').length,
      timeoutTransitions: analysis.summary?.timeoutTransitions || transitions.filter((step) => step.status === 'timeout').length,
      routineAddresses: analysis.summary?.routineBytes?.addresses || [],
      writePcs,
      topologyEdges: topology?.summary?.edges,
      directTopologyMatches: evidence.filter((item) => item.matchStatus === 'direct').length,
      sourceAreaCandidates: evidence.filter((item) => item.matchStatus === 'source-area-candidate').length,
      noHandPlacedCoordinates: true
    },
    romWindows,
    transitions,
    edgeEvidence: evidence,
    byteRoleHypotheses: byteRoleHypotheses(analysis, transitions),
    compositionHints: {
      status: 'evidence-model',
      handPlacedCoordinates: 0,
      edgeEvidence: evidence,
      defaultUse: 'Use direct routine evidence to increase placement confidence, but keep connector-only and unresolved edges labeled unless a true spatial rule is decoded.'
    }
  };

  fs.mkdirSync(outDir, { recursive: true });
  const decoderPath = path.join(outDir, 'decoder.json');
  writeJson(decoderPath, decoder);
  fs.writeFileSync(
    path.join(outDir, 'decoder-data.js'),
    `window.TRANSITION_ROUTINE_DECODER = ${JSON.stringify(decoder, null, 2)};\n`
  );

  return {
    output: outDir,
    decoder: decoderPath,
    summary: decoder.summary
  };
}

module.exports = {
  decodeTransitionRoutine
};
