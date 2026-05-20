'use strict';

const fs = require('fs');
const path = require('path');
const { runMesenCapture } = require('./mesen');

const DEFAULT_FIXTURE_FILE = path.join('data', 'transition-probes.json');
const DEFAULT_OUT_DIR = path.join('out', 'transition-probes');
const TRACE_SCRIPT = path.join('tools', 'mesen', 'trace-transition.lua');
const TRANSITION_ROUTINE_START = 0xd0b0;
const TRANSITION_ROUTINE_END = 0xd260;
const SCROLL_STAGING_ROUTINE_START = 0xd2e0;
const SCROLL_STAGING_ROUTINE_END = 0xd305;
const SIMON_TILE_HINTS = new Set([0x03, 0x05, 0x07, 0x09, 0x0b, 0x0d]);
const POSITION_CANDIDATE_RAM_LIMIT = 0x07ff;
const CAMERA_CANDIDATE_RAM_LIMIT = 0x07ff;

const SCROLL_METRIC_DEFINITIONS = [
  { name: 'scrollXLow', label: 'scroll X low byte', value: (scroll) => scroll.scrollX & 0xff },
  { name: 'scrollYLow', label: 'scroll Y low byte', value: (scroll) => scroll.scrollY & 0xff },
  { name: 'coarseX', label: 'coarse X tile', value: (scroll) => scroll.coarseX },
  { name: 'coarseY', label: 'coarse Y tile', value: (scroll) => scroll.coarseY },
  { name: 'fineX', label: 'fine X pixel', value: (scroll) => scroll.fineX },
  { name: 'fineY', label: 'fine Y pixel', value: (scroll) => scroll.fineY },
  { name: 'nametableX', label: 'horizontal nametable bit', value: (scroll) => scroll.nametableX },
  { name: 'nametableY', label: 'vertical nametable bit', value: (scroll) => scroll.nametableY }
];

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

function memoryRegionName(address) {
  if (address <= 0x00ff) {
    return 'zero-page';
  }
  if (address >= 0x0200 && address <= 0x02ff) {
    return 'oam-shadow';
  }
  if (address >= 0x0300 && address <= 0x03ff) {
    return 'sprite-staging';
  }
  return 'low-ram';
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
  const scroll = decodePpuScroll(row);
  return {
    xScroll: row.ppuXScroll,
    videoRamAddr: hex(row.ppuVideoRamAddr, 4),
    tmpVideoRamAddr: hex(row.ppuTmpVideoRamAddr, 4),
    bgPatternAddr: hex(row.ppuBgPatternAddr, 4),
    spritePatternAddr: hex(row.ppuSpritePatternAddr, 4),
    scroll
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

function parseHexByte(value) {
  if (!value) {
    return undefined;
  }
  return Number.parseInt(value, 16);
}

function parseRamWrites(filePath) {
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
      event: raw.event,
      pc: parseHexByte(raw.pc),
      pcHex: raw.pc ? `0x${raw.pc}` : undefined,
      a: parseHexByte(raw.a),
      x: parseHexByte(raw.x),
      y: parseHexByte(raw.y),
      prgReg: parseHexByte(raw.prgReg),
      address: parseHexByte(raw.addr),
      addressHex: raw.addr ? `0x${raw.addr}` : undefined,
      value: parseHexByte(raw.value),
      valueHex: raw.value ? `0x${raw.value}` : undefined,
      objset: Number(raw.objset),
      area: Number(raw.area),
      submapRaw: Number(raw.submapRaw),
      submap: Number(raw.submap),
      actorPointer: Number(raw.actorPointer),
      tileSetPointer: Number(raw.tileSetPointer),
      transitionState: Number(raw.transitionState)
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

function readSnapshot(outDir, fileName) {
  if (!fileName) {
    return undefined;
  }
  const filePath = path.join(outDir, fileName);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  return fs.readFileSync(filePath);
}

function decodePpuScroll(row) {
  if (!row) {
    return undefined;
  }
  const scrollState = row.ppuTmpVideoRamAddr || row.ppuVideoRamAddr || 0;
  const fineX = row.ppuXScroll || 0;
  const coarseX = scrollState & 0x1f;
  const coarseY = (scrollState >> 5) & 0x1f;
  const nametableX = (scrollState >> 10) & 0x01;
  const nametableY = (scrollState >> 11) & 0x01;
  const fineY = (scrollState >> 12) & 0x07;
  return {
    coarseX,
    coarseY,
    fineX,
    fineY,
    nametableX,
    nametableY,
    scrollX: nametableX * 256 + coarseX * 8 + fineX,
    scrollY: nametableY * 240 + Math.min(coarseY, 29) * 8 + fineY
  };
}

function decodeOam(buffer) {
  if (!buffer) {
    return [];
  }
  const sprites = [];
  const count = Math.min(64, Math.floor(buffer.length / 4));
  for (let index = 0; index < count; index += 1) {
    const base = index * 4;
    const y = buffer[base];
    const tile = buffer[base + 1];
    const attr = buffer[base + 2];
    const x = buffer[base + 3];
    const visible = y < 0xef && x < 0xf8;
    sprites.push({
      index,
      x,
      y,
      tile,
      attr,
      palette: attr & 0x03,
      flipHorizontal: Boolean(attr & 0x40),
      flipVertical: Boolean(attr & 0x80),
      visible
    });
  }
  return sprites;
}

function clusterSprites(sprites) {
  const candidates = sprites.filter((sprite) => sprite.visible && sprite.y >= 80);
  const clusters = [];
  const seen = new Set();

  function touches(left, right) {
    return Math.abs(left.x - right.x) <= 18 && Math.abs(left.y - right.y) <= 20;
  }

  for (const sprite of candidates) {
    if (seen.has(sprite.index)) {
      continue;
    }
    const queue = [sprite];
    const cluster = [];
    seen.add(sprite.index);
    while (queue.length > 0) {
      const current = queue.shift();
      cluster.push(current);
      for (const other of candidates) {
        if (seen.has(other.index) || !touches(current, other)) {
          continue;
        }
        seen.add(other.index);
        queue.push(other);
      }
    }
    clusters.push(cluster);
  }

  return clusters.map((cluster) => {
    const xs = cluster.map((sprite) => sprite.x);
    const ys = cluster.map((sprite) => sprite.y);
    const xSpriteMin = Math.min(...xs);
    const xSpriteMax = Math.max(...xs);
    const ySpriteMin = Math.min(...ys);
    const ySpriteMax = Math.max(...ys);
    const xMin = xSpriteMin;
    const xMax = xSpriteMax + 8;
    const yMin = ySpriteMin;
    const yMax = ySpriteMax + 8;
    const hintTiles = cluster.filter((sprite) => SIMON_TILE_HINTS.has(sprite.tile)).length;
    const score = hintTiles * 5 +
      Math.min(cluster.length, 8) +
      (cluster.length >= 4 ? 4 : 0) +
      (xMax - xMin <= 32 ? 2 : 0) +
      (yMax - yMin <= 40 ? 2 : 0);
    return {
      sprites: cluster,
      spriteCount: cluster.length,
      hintTiles,
      score,
      bounds: {
        xSpriteMin,
        xSpriteMax,
        ySpriteMin,
        ySpriteMax,
        xMin,
        xMax,
        yMin,
        yMax,
        width: xMax - xMin,
        height: yMax - yMin,
        xCenter: Math.round((xMin + xMax) / 2),
        yCenter: Math.round((yMin + yMax) / 2)
      },
      tiles: cluster.map((sprite) => hex(sprite.tile, 2)),
      spriteIndexes: cluster.map((sprite) => sprite.index)
    };
  }).sort((left, right) => right.score - left.score);
}

function publicSpriteCluster(cluster) {
  if (!cluster) {
    return undefined;
  }
  return {
    confidence: cluster.hintTiles >= 4 ? 'high' : cluster.hintTiles > 0 ? 'medium' : 'low',
    score: cluster.score,
    spriteCount: cluster.spriteCount,
    hintTiles: cluster.hintTiles,
    bounds: cluster.bounds,
    tiles: cluster.tiles,
    spriteIndexes: cluster.spriteIndexes
  };
}

function pcKey(pc) {
  return hex(pc, 4);
}

function summarizePcs(writes) {
  const pcCounts = new Map();
  for (const write of writes) {
    const key = pcKey(write.pc);
    pcCounts.set(key, (pcCounts.get(key) || 0) + 1);
  }
  return [...pcCounts.entries()]
    .map(([pc, count]) => ({ pc, count }))
    .sort((left, right) => right.count - left.count || left.pc.localeCompare(right.pc));
}

function summarizeWrites(writes, changes) {
  const changedAddresses = new Set(changes.map((change) => change.address));
  const changedWrites = writes.filter((write) => changedAddresses.has(write.address));
  const transitionRoutineWrites = writes.filter((write) => (
    write.pc >= TRANSITION_ROUTINE_START && write.pc <= TRANSITION_ROUTINE_END
  ));
  return {
    totalWrites: writes.length,
    zeroPageWrites: writes.filter((write) => write.event === 'zero-page-write').length,
    spriteStagingWrites: writes.filter((write) => write.event === 'sprite-staging-write').length,
    changedAddressWrites: changedWrites.length,
    transitionRoutineWrites: transitionRoutineWrites.length,
    topPcs: summarizePcs(writes).slice(0, 10),
    transitionRoutinePcs: summarizePcs(transitionRoutineWrites).slice(0, 10),
    transitionRoutineDetails: transitionRoutineWrites.slice(0, 32).map((write) => ({
      frame: write.frame,
      stepFrame: write.stepFrame,
      pc: write.pcHex,
      address: write.addressHex,
      value: write.valueHex,
      context: {
        objset: hex(write.objset, 2),
        area: hex(write.area, 2),
        submapRaw: hex(write.submapRaw, 2)
      }
    }))
  };
}

function writesForAddress(writes, address) {
  return writes.filter((write) => write.address === address);
}

function candidateMetrics(cluster, ppu) {
  const metrics = [];
  if (cluster) {
    for (const [name, value] of Object.entries(cluster.bounds)) {
      metrics.push({ source: 'simonSpriteCluster', name, value });
    }
  }
  const scroll = ppu && decodePpuScroll(ppu);
  if (scroll) {
    metrics.push(
      { source: 'ppuScroll', name: 'scrollXLow', value: scroll.scrollX & 0xff },
      { source: 'ppuScroll', name: 'scrollYLow', value: scroll.scrollY & 0xff },
      { source: 'ppuScroll', name: 'coarseX', value: scroll.coarseX },
      { source: 'ppuScroll', name: 'coarseY', value: scroll.coarseY },
      { source: 'ppuScroll', name: 'fineX', value: scroll.fineX },
      { source: 'ppuScroll', name: 'fineY', value: scroll.fineY }
    );
  }
  return metrics;
}

function scrollMetricComparisons(beforePpu, afterPpu) {
  const beforeScroll = decodePpuScroll(beforePpu);
  const afterScroll = decodePpuScroll(afterPpu);
  if (!beforeScroll || !afterScroll) {
    return [];
  }
  return SCROLL_METRIC_DEFINITIONS.map((definition) => {
    const before = definition.value(beforeScroll);
    const after = definition.value(afterScroll);
    return {
      name: definition.name,
      label: definition.label,
      before,
      beforeHex: hex(before, 2),
      after,
      afterHex: hex(after, 2),
      changed: before !== after
    };
  });
}

function byteDelta(before, after) {
  return (after - before + 0x100) & 0xff;
}

function scoreCameraCandidates(beforeCpu, afterCpu, writes, beforePpu, afterPpu) {
  if (!beforeCpu || !afterCpu) {
    return [];
  }
  const metrics = scrollMetricComparisons(beforePpu, afterPpu);
  const candidates = [];
  const count = Math.min(beforeCpu.length, afterCpu.length, CAMERA_CANDIDATE_RAM_LIMIT + 1);

  for (let address = 0; address < count; address += 1) {
    const before = beforeCpu[address];
    const after = afterCpu[address];
    const addressChanged = before !== after;
    const addressWrites = writesForAddress(writes, address);
    const transitionRoutineWrites = addressWrites.filter((write) => (
      write.pc >= TRANSITION_ROUTINE_START && write.pc <= TRANSITION_ROUTINE_END
    ));
    const scrollStagingWrites = addressWrites.filter((write) => (
      write.pc >= SCROLL_STAGING_ROUTINE_START && write.pc <= SCROLL_STAGING_ROUTINE_END
    ));

    for (const metric of metrics) {
      const beforeMatches = before === metric.before;
      const afterMatches = after === metric.after;
      let strength;
      let score = 0;

      if (metric.changed && addressChanged && beforeMatches && afterMatches) {
        strength = 'strong';
        score += 12;
      } else if (metric.changed && addressChanged && afterMatches) {
        strength = 'after-match';
        score += metric.after === 0 ? 2 : 4;
      } else if (
        metric.changed &&
        addressChanged &&
        metric.name !== 'fineX' &&
        metric.name !== 'fineY' &&
        byteDelta(before, after) === byteDelta(metric.before, metric.after)
      ) {
        strength = 'delta-match';
        score += 2;
      } else if (!metric.changed && beforeMatches && afterMatches && addressWrites.length > 0) {
        strength = 'stable-written-match';
        score += 2;
      } else {
        continue;
      }

      if (addressWrites.length > 0) {
        score += 1;
      }
      if (transitionRoutineWrites.length > 0) {
        score += 2;
      }
      if (scrollStagingWrites.length > 0) {
        score += 3;
      }
      if (strength !== 'strong' && score < 5) {
        continue;
      }

      const lastWrite = addressWrites[addressWrites.length - 1];
      candidates.push({
        metric: metric.name,
        metricLabel: metric.label,
        strength,
        address,
        addressHex: hex(address, 4),
        memoryRegion: memoryRegionName(address),
        before,
        beforeHex: hex(before, 2),
        after,
        afterHex: hex(after, 2),
        metricBeforeHex: metric.beforeHex,
        metricAfterHex: metric.afterHex,
        metricChanged: metric.changed,
        score,
        writeCount: addressWrites.length,
        transitionRoutineWrites: transitionRoutineWrites.length,
        scrollStagingWrites: scrollStagingWrites.length,
        lastWrite: lastWrite ? {
          frame: lastWrite.frame,
          stepFrame: lastWrite.stepFrame,
          pc: lastWrite.pcHex,
          value: lastWrite.valueHex,
          event: lastWrite.event
        } : undefined,
        topWritePcs: summarizePcs(addressWrites).slice(0, 5)
      });
    }
  }

  return candidates.sort((left, right) => (
    right.score - left.score ||
    Number(right.strength === 'strong') - Number(left.strength === 'strong') ||
    left.metric.localeCompare(right.metric) ||
    left.address - right.address
  )).slice(0, 32);
}

function scorePositionCandidates(changes, writes, beforeCluster, afterCluster, beforePpu, afterPpu) {
  const beforeMetrics = candidateMetrics(beforeCluster, beforePpu);
  const afterMetrics = candidateMetrics(afterCluster, afterPpu);
  const candidates = [];

  for (const change of changes) {
    if (change.address > POSITION_CANDIDATE_RAM_LIMIT || change.label) {
      continue;
    }
    const matches = [];
    let score = 0;
    for (const afterMetric of afterMetrics) {
      const beforeMetric = beforeMetrics.find((item) => item.source === afterMetric.source && item.name === afterMetric.name);
      const beforeMatches = beforeMetric && change.before === beforeMetric.value;
      const afterMatches = change.after === afterMetric.value;
      const deltaMatches = beforeMetric && (change.after - change.before) === (afterMetric.value - beforeMetric.value);
      if (beforeMatches && afterMatches) {
        score += 8;
        matches.push({
          strength: 'strong',
          source: afterMetric.source,
          metric: afterMetric.name,
          before: hex(beforeMetric.value, 2),
          after: hex(afterMetric.value, 2)
        });
      } else if (afterMatches) {
        score += 4;
        matches.push({
          strength: 'after-match',
          source: afterMetric.source,
          metric: afterMetric.name,
          after: hex(afterMetric.value, 2)
        });
      } else if (deltaMatches && afterMetric.name !== 'fineX' && afterMetric.name !== 'fineY') {
        score += 2;
        matches.push({
          strength: 'delta-match',
          source: afterMetric.source,
          metric: afterMetric.name,
          before: hex(beforeMetric.value, 2),
          after: hex(afterMetric.value, 2)
        });
      }
    }

    const addressWrites = writesForAddress(writes, change.address);
    const routineWrites = addressWrites.filter((write) => write.pc >= TRANSITION_ROUTINE_START && write.pc <= TRANSITION_ROUTINE_END);
    if (addressWrites.length > 0) {
      score += 4;
    }
    if (routineWrites.length > 0) {
      score += 2;
    }
    if (memoryRegionName(change.address) === 'sprite-staging') {
      score += 3;
    }
    if (matches.length === 0 && score < 3) {
      continue;
    }

    const lastWrite = addressWrites[addressWrites.length - 1];
    candidates.push({
      address: change.address,
      addressHex: change.addressHex,
      memoryRegion: memoryRegionName(change.address),
      before: change.before,
      beforeHex: change.beforeHex,
      after: change.after,
      afterHex: change.afterHex,
      score,
      matches,
      writeCount: addressWrites.length,
      lastWrite: lastWrite ? {
        frame: lastWrite.frame,
        stepFrame: lastWrite.stepFrame,
        pc: lastWrite.pcHex,
        value: lastWrite.valueHex,
        event: lastWrite.event
      } : undefined,
      topWritePcs: summarizePcs(addressWrites).slice(0, 5)
    });
  }

  return candidates.sort((left, right) => right.score - left.score || left.address - right.address).slice(0, 96);
}

function yMetrics(cluster) {
  if (!cluster) {
    return [];
  }
  return [
    'ySpriteMin',
    'ySpriteMax',
    'yMin',
    'yMax',
    'yCenter'
  ].map((name) => ({
    source: 'simonSpriteCluster',
    name,
    value: cluster.bounds[name]
  }));
}

function destinationYCandidateKind(address, writes) {
  if (address >= 0x0200 && address <= 0x02ff) {
    return 'oam-shadow-copy';
  }
  const transitionRoutineWrites = writes.filter((write) => (
    write.pc >= TRANSITION_ROUTINE_START && write.pc <= TRANSITION_ROUTINE_END
  ));
  if (transitionRoutineWrites.length > 0) {
    return 'transition-routine-byte';
  }
  if (writes.length > 0) {
    return 'written-ram';
  }
  return 'unwritten-ram';
}

function scoreDestinationYCandidates(changes, writes, beforeCluster, afterCluster) {
  const beforeMetrics = yMetrics(beforeCluster);
  const afterMetrics = yMetrics(afterCluster);
  const candidates = [];

  for (const change of changes) {
    if (change.address > POSITION_CANDIDATE_RAM_LIMIT || change.label) {
      continue;
    }

    const matches = [];
    let score = 0;
    for (const afterMetric of afterMetrics) {
      const beforeMetric = beforeMetrics.find((item) => item.name === afterMetric.name);
      if (!beforeMetric) {
        continue;
      }
      const beforeMatches = change.before === beforeMetric.value;
      const afterMatches = change.after === afterMetric.value;
      const deltaMatches = byteDelta(change.before, change.after) === byteDelta(beforeMetric.value, afterMetric.value);
      if (beforeMatches && afterMatches) {
        score += 10;
        matches.push({
          strength: 'strong',
          metric: afterMetric.name,
          before: hex(beforeMetric.value, 2),
          after: hex(afterMetric.value, 2)
        });
      } else if (afterMatches) {
        score += 4;
        matches.push({
          strength: 'after-match',
          metric: afterMetric.name,
          after: hex(afterMetric.value, 2)
        });
      } else if (deltaMatches) {
        score += 2;
        matches.push({
          strength: 'delta-match',
          metric: afterMetric.name,
          before: hex(beforeMetric.value, 2),
          after: hex(afterMetric.value, 2)
        });
      }
    }

    if (matches.length === 0) {
      continue;
    }

    const addressWrites = writesForAddress(writes, change.address);
    const transitionRoutineWrites = addressWrites.filter((write) => (
      write.pc >= TRANSITION_ROUTINE_START && write.pc <= TRANSITION_ROUTINE_END
    ));
    if (addressWrites.length > 0) {
      score += 1;
    }
    if (transitionRoutineWrites.length > 0) {
      score += 3;
    }

    const lastWrite = addressWrites[addressWrites.length - 1];
    candidates.push({
      address: change.address,
      addressHex: change.addressHex,
      memoryRegion: memoryRegionName(change.address),
      candidateKind: destinationYCandidateKind(change.address, addressWrites),
      before: change.before,
      beforeHex: change.beforeHex,
      after: change.after,
      afterHex: change.afterHex,
      score,
      matches,
      writeCount: addressWrites.length,
      transitionRoutineWrites: transitionRoutineWrites.length,
      lastWrite: lastWrite ? {
        frame: lastWrite.frame,
        stepFrame: lastWrite.stepFrame,
        pc: lastWrite.pcHex,
        value: lastWrite.valueHex,
        event: lastWrite.event
      } : undefined,
      topWritePcs: summarizePcs(addressWrites).slice(0, 5)
    });
  }

  return candidates.sort((left, right) => (
    Number(right.candidateKind === 'transition-routine-byte') - Number(left.candidateKind === 'transition-routine-byte') ||
    Number(right.writeCount > 0) - Number(left.writeCount > 0) ||
    right.score - left.score ||
    left.address - right.address
  )).slice(0, 16);
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

function summarizeCameraCandidates(steps) {
  const changedStepIdsByMetric = new Map();
  const groups = new Map();

  for (const step of steps) {
    for (const metric of step.cameraEvidence?.changedMetrics || []) {
      if (!changedStepIdsByMetric.has(metric.name)) {
        changedStepIdsByMetric.set(metric.name, new Set());
      }
      changedStepIdsByMetric.get(metric.name).add(step.id);
    }

    for (const candidate of step.cameraCandidates || []) {
      if (candidate.strength !== 'strong') {
        continue;
      }
      const key = `${candidate.metric}:${candidate.addressHex}`;
      if (!groups.has(key)) {
        groups.set(key, {
          metric: candidate.metric,
          metricLabel: candidate.metricLabel,
          addressHex: candidate.addressHex,
          memoryRegion: candidate.memoryRegion,
          steps: [],
          scores: [],
          writeCounts: [],
          scrollStagingWriteCounts: []
        });
      }
      const group = groups.get(key);
      group.steps.push({
        stepId: step.id,
        before: candidate.beforeHex,
        after: candidate.afterHex,
        metricBefore: candidate.metricBeforeHex,
        metricAfter: candidate.metricAfterHex,
        score: candidate.score,
        lastWritePc: candidate.lastWrite && candidate.lastWrite.pc,
        scrollStagingWrites: candidate.scrollStagingWrites
      });
      group.scores.push(candidate.score);
      group.writeCounts.push(candidate.writeCount);
      group.scrollStagingWriteCounts.push(candidate.scrollStagingWrites);
    }
  }

  const changedMetrics = [...changedStepIdsByMetric.entries()]
    .map(([metric, stepIds]) => ({
      metric,
      changedSteps: stepIds.size,
      stepIds: [...stepIds]
    }))
    .sort((left, right) => left.metric.localeCompare(right.metric));

  const candidates = [...groups.values()]
    .map((candidate) => {
      const changedStepIds = changedStepIdsByMetric.get(candidate.metric) || new Set();
      const matchedChangedSteps = candidate.steps.filter((step) => changedStepIds.has(step.stepId)).length;
      return {
        ...candidate,
        matchedChangedSteps,
        changedSteps: changedStepIds.size,
        minScore: Math.min(...candidate.scores),
        totalWrites: candidate.writeCounts.reduce((sum, count) => sum + count, 0),
        totalScrollStagingWrites: candidate.scrollStagingWriteCounts.reduce((sum, count) => sum + count, 0),
        confidence: changedStepIds.size > 0 &&
          matchedChangedSteps === changedStepIds.size &&
          candidate.writeCounts.every((count) => count > 0)
          ? 'high'
          : 'diagnostic'
      };
    })
    .sort((left, right) => (
      Number(right.confidence === 'high') - Number(left.confidence === 'high') ||
      right.matchedChangedSteps - left.matchedChangedSteps ||
      right.totalScrollStagingWrites - left.totalScrollStagingWrites ||
      right.minScore - left.minScore ||
      left.addressHex.localeCompare(right.addressHex)
    ));

  return {
    changedMetrics,
    candidates: candidates.slice(0, 12)
  };
}

function summarizeDestinationY(steps) {
  const observations = steps.map((step) => {
    const before = step.spriteEvidence?.beforeSimon?.bounds;
    const after = step.spriteEvidence?.afterSimon?.bounds;
    return {
      stepId: step.id,
      beforeCenter: before?.yCenter,
      beforeCenterHex: hex(before?.yCenter, 2),
      afterCenter: after?.yCenter,
      afterCenterHex: hex(after?.yCenter, 2),
      beforeSpriteMinHex: hex(before?.ySpriteMin, 2),
      afterSpriteMinHex: hex(after?.ySpriteMin, 2),
      changed: before?.yCenter != null && after?.yCenter != null && before.yCenter !== after.yCenter
    };
  });
  const afterCenters = [...new Set(observations
    .map((observation) => observation.afterCenter)
    .filter((value) => value != null))];
  const transitionsWithYDelta = observations.filter((observation) => observation.changed).length;
  const groups = new Map();

  for (const step of steps) {
    for (const candidate of step.destinationYCandidates || []) {
      const key = candidate.addressHex;
      if (!groups.has(key)) {
        groups.set(key, {
          addressHex: candidate.addressHex,
          memoryRegion: candidate.memoryRegion,
          candidateKind: candidate.candidateKind,
          steps: [],
          writeCounts: [],
          transitionRoutineWriteCounts: [],
          scores: []
        });
      }
      const group = groups.get(key);
      group.steps.push({
        stepId: step.id,
        before: candidate.beforeHex,
        after: candidate.afterHex,
        candidateKind: candidate.candidateKind,
        matches: (candidate.matches || []).map((match) => ({
          strength: match.strength,
          metric: match.metric,
          before: match.before,
          after: match.after
        })),
        score: candidate.score,
        lastWritePc: candidate.lastWrite && candidate.lastWrite.pc
      });
      group.writeCounts.push(candidate.writeCount);
      group.transitionRoutineWriteCounts.push(candidate.transitionRoutineWrites);
      group.scores.push(candidate.score);
    }
  }

  const diagnosticCandidates = [...groups.values()].map((group) => {
    const matchedDeltaSteps = group.steps.filter((entry) => {
      const observation = observations.find((item) => item.stepId === entry.stepId);
      return observation?.changed;
    }).length;
    const totalWrites = group.writeCounts.reduce((sum, count) => sum + count, 0);
    const totalTransitionRoutineWrites = group.transitionRoutineWriteCounts.reduce((sum, count) => sum + count, 0);
    return {
      ...group,
      matchedSteps: group.steps.length,
      matchedDeltaSteps,
      minScore: Math.min(...group.scores),
      totalWrites,
      totalTransitionRoutineWrites,
      confidence: transitionsWithYDelta > 1 &&
        matchedDeltaSteps === transitionsWithYDelta &&
        totalWrites > 0 &&
        group.candidateKind !== 'oam-shadow-copy'
        ? 'high'
        : 'diagnostic'
    };
  });

  diagnosticCandidates.sort((left, right) => (
    Number(right.candidateKind === 'transition-routine-byte') - Number(left.candidateKind === 'transition-routine-byte') ||
    Number(right.candidateKind !== 'oam-shadow-copy') - Number(left.candidateKind !== 'oam-shadow-copy') ||
    right.totalTransitionRoutineWrites - left.totalTransitionRoutineWrites ||
    right.totalWrites - left.totalWrites ||
    right.minScore - left.minScore ||
    right.matchedSteps - left.matchedSteps ||
    left.addressHex.localeCompare(right.addressHex)
  ));

  let status = 'blocked-non-varying-fixture-set';
  if (afterCenters.length > 1 || transitionsWithYDelta > 0) {
    const hasHigh = diagnosticCandidates.some((candidate) => candidate.confidence === 'high');
    const hasTransitionRoutine = diagnosticCandidates.some((candidate) => candidate.candidateKind === 'transition-routine-byte');
    const hasWrittenNonOam = diagnosticCandidates.some((candidate) => (
      candidate.totalWrites > 0 && candidate.candidateKind !== 'oam-shadow-copy'
    ));
    if (hasHigh) {
      status = 'resolved-high-confidence';
    } else if (hasTransitionRoutine) {
      status = 'transition-routine-y-candidate';
    } else if (hasWrittenNonOam) {
      status = 'written-y-candidate';
    } else {
      status = 'oam-shadow-only-y-delta';
    }
  }

  return {
    status,
    observedAfterCenters: afterCenters.map((value) => hex(value, 2)),
    uniqueAfterCenters: afterCenters.length,
    transitionsWithYDelta,
    observations,
    diagnosticCandidates: diagnosticCandidates.slice(0, 8),
    nextFixtureNeeded: status !== 'blocked-non-varying-fixture-set'
      ? undefined
      : 'A transition fixture whose destination places Simon at a different visible Y position, such as a safe stair or vertical screen transition.'
  };
}

function analyzeProbeOutput(probe, outDir) {
  const summaryPath = path.join(outDir, 'summary.json');
  const tracePath = path.join(outDir, 'trace.tsv');
  const ramWritesPath = path.join(outDir, 'ram-writes.tsv');
  const summary = fs.existsSync(summaryPath)
    ? readJson(summaryPath)
    : { status: 'missing-summary', steps: [] };
  const trace = parseTrace(tracePath);
  const ramWrites = parseRamWrites(ramWritesPath);

  const steps = probe.steps.map((step) => {
    const stepSummary = (summary.steps || []).find((candidate) => candidate.id === step.id) || {};
    const rows = trace.filter((row) => row.stepId === step.id);
    const firstRow = rows[0];
    const targetRow = rows.find((row) => row.frame === stepSummary.firstTargetFrame) ||
      rows.find((row) => row.objset === step.targetContext.objset &&
        row.area === step.targetContext.area &&
        row.submap === step.targetContext.submap);
    const finalRow = rows[rows.length - 1];
    const before = readSnapshot(outDir, stepSummary.beforeCpu);
    const after = readSnapshot(outDir, stepSummary.afterCpu);
    const beforeOam = readSnapshot(outDir, stepSummary.beforeOam);
    const afterOam = readSnapshot(outDir, stepSummary.afterOam);
    const changes = diffCpu(before, after);
    const stepWrites = ramWrites.filter((write) => write.stepId === step.id);
    const beforeClusters = clusterSprites(decodeOam(beforeOam));
    const afterClusters = clusterSprites(decodeOam(afterOam));
    const beforeSimon = beforeClusters[0];
    const afterSimon = afterClusters[0];
    const destinationYCandidates = scoreDestinationYCandidates(
      changes,
      stepWrites,
      beforeSimon,
      afterSimon
    );
    const scrollMetrics = scrollMetricComparisons(firstRow, finalRow);
    const cameraCandidates = scoreCameraCandidates(
      before,
      after,
      stepWrites,
      firstRow,
      finalRow
    );
    const positionCandidates = scorePositionCandidates(
      changes,
      stepWrites,
      beforeSimon,
      afterSimon,
      firstRow,
      finalRow
    );

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
      spriteEvidence: {
        beforeSimon: publicSpriteCluster(beforeSimon),
        afterSimon: publicSpriteCluster(afterSimon),
        beforeClusters: beforeClusters.slice(0, 5).map(publicSpriteCluster),
        afterClusters: afterClusters.slice(0, 5).map(publicSpriteCluster)
      },
      cameraEvidence: {
        changedMetrics: scrollMetrics.filter((metric) => metric.changed),
        stableWrittenCandidates: cameraCandidates.filter((candidate) => candidate.strength === 'stable-written-match').slice(0, 8)
      },
      destinationYCandidates,
      ramWriteEvidence: summarizeWrites(stepWrites, changes),
      cameraCandidates,
      positionCandidates,
      snapshots: {
        beforeCpu: stepSummary.beforeCpu,
        afterCpu: stepSummary.afterCpu,
        beforeOam: stepSummary.beforeOam,
        afterOam: stepSummary.afterOam
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
    ramWrites: fs.existsSync(ramWritesPath) ? ramWritesPath : undefined,
    status: summary.status,
    totalFrames: summary.totalFrames,
    stateLoadedFrame: summary.stateLoadedFrame,
    steps
  };
}

function summarizeAnalysis(probes) {
  const steps = probes.flatMap((probe) => probe.steps);
  const positionGroups = new Map();
  for (const step of steps) {
    for (const candidate of step.positionCandidates || []) {
      const xCenterMatch = (candidate.matches || []).find((match) => (
        (match.strength === 'strong' || match.strength === 'after-match') &&
        match.source === 'simonSpriteCluster' &&
        match.metric === 'xCenter'
      ));
      if (!xCenterMatch) {
        continue;
      }
      if (!positionGroups.has(candidate.addressHex)) {
        positionGroups.set(candidate.addressHex, {
          addressHex: candidate.addressHex,
          memoryRegion: candidate.memoryRegion,
          steps: [],
          scores: [],
          writeCounts: []
        });
      }
      const group = positionGroups.get(candidate.addressHex);
      group.steps.push({
        stepId: step.id,
        value: candidate.afterHex,
        score: candidate.score,
        matchStrength: xCenterMatch.strength,
        lastWritePc: candidate.lastWrite && candidate.lastWrite.pc
      });
      group.scores.push(candidate.score);
      group.writeCounts.push(candidate.writeCount);
    }
  }
  const xCenterCandidates = [...positionGroups.values()]
    .map((candidate) => ({
      ...candidate,
      matchedSteps: candidate.steps.length,
      minScore: Math.min(...candidate.scores),
      totalWrites: candidate.writeCounts.reduce((sum, count) => sum + count, 0),
      confidence: candidate.steps.length === steps.length && candidate.writeCounts.every((count) => count > 0)
        ? 'high'
        : 'diagnostic'
    }))
    .sort((left, right) => (
      right.matchedSteps - left.matchedSteps ||
      right.minScore - left.minScore ||
      right.totalWrites - left.totalWrites
    ));

  return {
    probes: probes.length,
    transitions: steps.length,
    completeTransitions: steps.filter((step) => step.status === 'complete').length,
    timeoutTransitions: steps.filter((step) => step.status === 'timeout').length,
    byType: steps.reduce((acc, step) => {
      acc[step.type] = (acc[step.type] || 0) + 1;
      return acc;
    }, {}),
    xCenterCandidates: xCenterCandidates.slice(0, 8),
    camera: summarizeCameraCandidates(steps),
    destinationY: summarizeDestinationY(steps)
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
