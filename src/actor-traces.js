'use strict';

const fs = require('fs');
const path = require('path');
const { runMesenCapture } = require('./mesen');

const DEFAULT_FIXTURE_FILE = path.join('data', 'actor-trace-fixtures.json');
const DEFAULT_OUT_DIR = path.join('out', 'actor-traces');
const TRACE_SCRIPT = path.join('tools', 'mesen', 'trace-actors.lua');

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
  if (value == null || value === '') {
    return undefined;
  }
  if (Number.isInteger(value)) {
    return value;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be an integer`);
  }
  return parsed;
}

function parseTsv(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const lines = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    return [];
  }

  const header = lines[0].split('\t');
  return lines.slice(1).map((line) => {
    const cells = line.split('\t');
    return header.reduce((row, name, index) => {
      row[name] = cells[index] ?? '';
      return row;
    }, {});
  });
}

function numberSet(values) {
  return Array.from(values)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
}

function hexList(values, width = 2) {
  return numberSet(values).map((value) => hex(value, width));
}

function makeContext(row) {
  return {
    objset: parseInteger(row.objset, 'objset'),
    area: parseInteger(row.area, 'area'),
    submapRaw: parseInteger(row.submapRaw, 'submapRaw'),
    submap: parseInteger(row.submap, 'submap'),
    night: parseInteger(row.night, 'night'),
    actorPointer: parseInteger(row.actorPointer, 'actorPointer'),
    tileSetPointer: parseInteger(row.tileSetPointer, 'tileSetPointer')
  };
}

function contextKey(context) {
  return [
    context.objset,
    context.area,
    context.submapRaw,
    context.night,
    context.actorPointer
  ].join(':');
}

function publicContext(context) {
  return {
    objset: hex(context.objset, 2),
    area: hex(context.area, 2),
    submapRaw: hex(context.submapRaw, 2),
    submap: hex(context.submap, 2),
    night: hex(context.night, 2),
    actorPointer: hex(context.actorPointer, 4),
    tileSetPointer: hex(context.tileSetPointer, 4)
  };
}

function addSetValue(map, key, value) {
  if (value == null || Number.isNaN(value)) {
    return;
  }
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key).add(value);
}

function normalizeTraceFixture(fixture) {
  return {
    id: fixture.id,
    label: fixture.label || fixture.id,
    state: fixture.state,
    inputs: fixture.inputs || '',
    settleFrames: fixture.settleFrames || 30,
    traceFrames: fixture.traceFrames || 600,
    sampleEvery: fixture.sampleEvery || 8,
    timeout: fixture.timeout
  };
}

function loadTraceManifest(filePath = DEFAULT_FIXTURE_FILE) {
  const resolved = path.resolve(filePath);
  const raw = readJson(resolved);
  const traces = (raw.traces || []).map(normalizeTraceFixture);
  return {
    file: resolved,
    capturesRoot: raw.capturesRoot || DEFAULT_OUT_DIR,
    traces
  };
}

function analyzeTraceOutput(trace, traceDir) {
  const summaryPath = path.join(traceDir, 'summary.json');
  const summary = fs.existsSync(summaryPath) ? readJson(summaryPath) : undefined;
  const slotRows = parseTsv(path.join(traceDir, 'actor-slots.tsv'));
  const writeRows = parseTsv(path.join(traceDir, 'actor-writes.tsv'));
  const contexts = new Map();
  const actorGroups = new Map();
  const selectorWriteGroups = new Map();

  for (const row of slotRows) {
    const context = makeContext(row);
    contexts.set(contextKey(context), context);

    const activeId = parseInteger(row.activeId, 'activeId');
    const slot = parseInteger(row.slot, 'slot');
    const selector = parseInteger(row.selector, 'selector');
    const hp = parseInteger(row.hp, 'hp');
    const rowData = parseInteger(row.rowData, 'rowData');
    const aux = parseInteger(row.aux, 'aux');
    const source = parseInteger(row.source, 'source');
    const state = parseInteger(row.state, 'state');
    const screenX = parseInteger(row.screenX, 'screenX');
    const screenY = parseInteger(row.screenY, 'screenY');

    const groupKey = `${activeId}`;
    if (!actorGroups.has(groupKey)) {
      actorGroups.set(groupKey, {
        activeId,
        slots: new Set(),
        selectors: new Set(),
        hpValues: new Set(),
        hpByNight: new Map(),
        rowData: new Set(),
        aux: new Set(),
        source: new Set(),
        states: new Set(),
        traceFrames: new Set(),
        contexts: new Map(),
        positions: new Set(),
        sampleRows: 0
      });
    }

    const group = actorGroups.get(groupKey);
    group.sampleRows += 1;
    group.slots.add(slot);
    group.selectors.add(selector);
    group.hpValues.add(hp);
    addSetValue(group.hpByNight, context.night, hp);
    group.rowData.add(rowData);
    group.aux.add(aux);
    group.source.add(source);
    group.states.add(state);
    group.traceFrames.add(parseInteger(row.traceFrame, 'traceFrame'));
    group.contexts.set(contextKey(context), context);
    group.positions.add(`${screenX},${screenY}`);
  }

  for (const row of writeRows) {
    if (row.field !== 'selector') {
      continue;
    }

    const activeId = parseInteger(row.activeIdAtWrite, 'activeIdAtWrite');
    const value = parseInteger(row.value, 'value');
    const selectorAtWrite = parseInteger(row.selectorAtWrite, 'selectorAtWrite');
    const hp = parseInteger(row.hpAtWrite, 'hpAtWrite');
    const aux = parseInteger(row.auxAtWrite, 'auxAtWrite');
    const rowData = parseInteger(row.rowDataAtWrite, 'rowDataAtWrite');
    const context = makeContext(row);
    const key = [
      activeId,
      value,
      row.pc,
      row.prgReg,
      context.night,
      context.actorPointer
    ].join(':');

    if (!selectorWriteGroups.has(key)) {
      selectorWriteGroups.set(key, {
        activeId,
        value,
        selectorAtWrite,
        hpValues: new Set(),
        auxValues: new Set(),
        rowDataValues: new Set(),
        pcs: new Set(),
        prgRegs: new Set(),
        slots: new Set(),
        contexts: new Map(),
        frames: new Set(),
        writes: 0
      });
    }

    const group = selectorWriteGroups.get(key);
    group.writes += 1;
    group.hpValues.add(hp);
    group.auxValues.add(aux);
    group.rowDataValues.add(rowData);
    group.pcs.add(row.pc);
    group.prgRegs.add(row.prgReg);
    group.slots.add(parseInteger(row.slot, 'slot'));
    group.contexts.set(contextKey(context), context);
    group.frames.add(parseInteger(row.traceFrame, 'traceFrame'));
  }

  const actors = Array.from(actorGroups.values())
    .map((group) => ({
      activeId: hex(group.activeId, 2),
      role: group.activeId === 0 ? 'player-or-empty-runtime-slot' : 'runtime-actor',
      slots: hexList(group.slots),
      selectors: hexList(group.selectors),
      hpValues: hexList(group.hpValues),
      hpByNight: Array.from(group.hpByNight.entries())
        .sort(([a], [b]) => a - b)
        .map(([night, values]) => ({
          night: hex(night, 2),
          hpValues: hexList(values)
        })),
      rowData: hexList(group.rowData),
      aux: hexList(group.aux),
      source: hexList(group.source),
      states: hexList(group.states),
      sampleRows: group.sampleRows,
      positions: Array.from(group.positions).sort(),
      contexts: Array.from(group.contexts.values()).map(publicContext)
    }))
    .sort((a, b) => Number.parseInt(a.activeId.slice(2), 16) - Number.parseInt(b.activeId.slice(2), 16));

  const selectorWrites = Array.from(selectorWriteGroups.values())
    .map((group) => ({
      activeId: hex(group.activeId, 2),
      selectorWriteValue: hex(group.value, 2),
      selectorAtWrite: hex(group.selectorAtWrite, 2),
      hpValues: hexList(group.hpValues),
      auxValues: hexList(group.auxValues),
      rowDataValues: hexList(group.rowDataValues),
      pcs: Array.from(group.pcs).sort().map((value) => `0x${value}`),
      prgRegs: Array.from(group.prgRegs).sort().map((value) => `0x${value}`),
      slots: hexList(group.slots),
      writes: group.writes,
      firstTraceFrame: Math.min(...numberSet(group.frames)),
      lastTraceFrame: Math.max(...numberSet(group.frames)),
      contexts: Array.from(group.contexts.values()).map(publicContext)
    }))
    .sort((a, b) => {
      const idDelta = Number.parseInt(a.activeId.slice(2), 16) - Number.parseInt(b.activeId.slice(2), 16);
      if (idDelta !== 0) {
        return idDelta;
      }
      return Number.parseInt(a.selectorWriteValue.slice(2), 16) - Number.parseInt(b.selectorWriteValue.slice(2), 16);
    });

  return {
    id: trace.id,
    label: trace.label,
    state: trace.state,
    inputs: trace.inputs,
    output: path.relative(process.cwd(), traceDir),
    status: summary?.status || 'missing-summary',
    summary,
    contexts: Array.from(contexts.values()).map(publicContext),
    actors,
    selectorWrites
  };
}

function summarizeAnalysis(traceAnalyses) {
  const byActor = new Map();

  for (const trace of traceAnalyses) {
    for (const actor of trace.actors) {
      const id = actor.activeId;
      if (!byActor.has(id)) {
        byActor.set(id, {
          activeId: id,
          traces: new Set(),
          selectors: new Set(),
          hpValues: new Set(),
          rowData: new Set(),
          aux: new Set(),
          contexts: new Map(),
          selectorWritePcs: new Set()
        });
      }
      const group = byActor.get(id);
      group.traces.add(trace.id);
      for (const value of actor.selectors) group.selectors.add(value);
      for (const value of actor.hpValues) group.hpValues.add(value);
      for (const value of actor.rowData) group.rowData.add(value);
      for (const value of actor.aux) group.aux.add(value);
      for (const context of actor.contexts) group.contexts.set(JSON.stringify(context), context);
    }

    for (const write of trace.selectorWrites) {
      if (!byActor.has(write.activeId)) {
        byActor.set(write.activeId, {
          activeId: write.activeId,
          traces: new Set(),
          selectors: new Set(),
          hpValues: new Set(),
          rowData: new Set(),
          aux: new Set(),
          contexts: new Map(),
          selectorWritePcs: new Set()
        });
      }
      const group = byActor.get(write.activeId);
      group.traces.add(trace.id);
      group.selectors.add(write.selectorWriteValue);
      for (const value of write.hpValues) group.hpValues.add(value);
      for (const value of write.rowDataValues) group.rowData.add(value);
      for (const value of write.auxValues) group.aux.add(value);
      for (const pc of write.pcs) group.selectorWritePcs.add(pc);
      for (const context of write.contexts) group.contexts.set(JSON.stringify(context), context);
    }
  }

  return Array.from(byActor.values())
    .map((group) => ({
      activeId: group.activeId,
      traces: Array.from(group.traces).sort(),
      selectors: Array.from(group.selectors).sort(),
      hpValues: Array.from(group.hpValues).sort(),
      rowData: Array.from(group.rowData).sort(),
      aux: Array.from(group.aux).sort(),
      selectorWritePcs: Array.from(group.selectorWritePcs).sort(),
      contexts: Array.from(group.contexts.values())
    }))
    .sort((a, b) => Number.parseInt(a.activeId.slice(2), 16) - Number.parseInt(b.activeId.slice(2), 16));
}

function analyzeActorTraces(opts = {}) {
  const manifest = loadTraceManifest(opts.fixtureFile);
  const outDir = path.resolve(opts.outDir || manifest.capturesRoot || DEFAULT_OUT_DIR);
  const only = opts.only ? new Set(String(opts.only).split(',').map((value) => value.trim()).filter(Boolean)) : undefined;
  const selected = manifest.traces.filter((trace) => !only || only.has(trace.id));
  const traces = selected.map((trace) => analyzeTraceOutput(trace, path.join(outDir, trace.id)));
  const analysis = {
    schemaVersion: 1,
    source: {
      fixtureFile: path.relative(process.cwd(), manifest.file),
      outDir: path.relative(process.cwd(), outDir),
      script: TRACE_SCRIPT,
      notes: [
        'Actor traces load local Mesen save states and observe runtime RAM as evidence.',
        'The traces identify live actor ids, selectors, HP, palette/attr, and selector-write PCs; they do not replace ROM-table decoding.'
      ]
    },
    summary: {
      traces: traces.length,
      completeTraces: traces.filter((trace) => trace.status === 'complete').length,
      actorIds: summarizeAnalysis(traces).length
    },
    actors: summarizeAnalysis(traces),
    traces
  };

  const output = path.join(outDir, 'analysis.json');
  writeJson(output, analysis);
  return {
    output,
    summary: analysis.summary
  };
}

function runActorTraces(opts) {
  const romPath = path.resolve(opts.romPath);
  const manifest = loadTraceManifest(opts.fixtureFile);
  const outDir = path.resolve(opts.outDir || manifest.capturesRoot || DEFAULT_OUT_DIR);
  const only = opts.only ? new Set(String(opts.only).split(',').map((value) => value.trim()).filter(Boolean)) : undefined;
  const selected = manifest.traces.filter((trace) => !only || only.has(trace.id));
  const runs = [];

  fs.mkdirSync(outDir, { recursive: true });

  for (const trace of selected) {
    const traceOutDir = path.join(outDir, trace.id);
    const summaryPath = path.join(traceOutDir, 'summary.json');
    if (opts.skipExisting && fs.existsSync(summaryPath)) {
      const summary = readJson(summaryPath);
      if (summary.status === 'complete') {
        runs.push({
          id: trace.id,
          skipped: true,
          status: 'complete',
          output: path.relative(process.cwd(), traceOutDir)
        });
        continue;
      }
    }

    const run = runMesenCapture({
      romPath,
      scriptPath: TRACE_SCRIPT,
      outDir: traceOutDir,
      timeout: trace.timeout || opts.timeout || 45,
      env: {
        CV2MAP_ACTOR_TRACE_ID: trace.id,
        CV2MAP_ACTOR_TRACE_LABEL: trace.label,
        CV2MAP_STATE_PATH: path.resolve(trace.state),
        CV2MAP_INPUTS: trace.inputs,
        CV2MAP_SETTLE_FRAMES: String(trace.settleFrames),
        CV2MAP_TRACE_FRAMES: String(trace.traceFrames),
        CV2MAP_SAMPLE_EVERY: String(trace.sampleEvery)
      }
    });

    runs.push({
      id: trace.id,
      skipped: false,
      status: run.status,
      durationMs: run.durationMs,
      output: path.relative(process.cwd(), traceOutDir),
      outputs: run.outputs.map((file) => path.relative(process.cwd(), file))
    });
  }

  const analysis = analyzeActorTraces({
    fixtureFile: manifest.file,
    outDir,
    only: opts.only
  });

  return {
    fixtureFile: path.relative(process.cwd(), manifest.file),
    outDir: path.relative(process.cwd(), outDir),
    traces: runs,
    analysis
  };
}

module.exports = {
  analyzeActorTraces,
  runActorTraces
};
