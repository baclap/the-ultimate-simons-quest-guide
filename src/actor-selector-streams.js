'use strict';

const fs = require('fs');
const path = require('path');
const { colorFromNesIndex } = require('./palette');
const { writePng } = require('./png');

const DEFAULT_FIXTURE_FILE = path.join('data', 'actor-trace-fixtures.json');
const DEFAULT_TRACES_DIR = path.join('out', 'actor-traces');
const DEFAULT_OUT_DIR = path.join('out', 'actor-selector-streams');

const SELECTOR_STREAM_ROUTINE = {
  start: 0xdd35,
  end: 0xdd86,
  writePc: 0xdd7d,
  tablePointerLow: 0xdd9e,
  tablePointerHigh: 0xdda0,
  tableBase: 0xdda2
};

const METASPRITE_POINTERS = {
  lowTable: 0xac30,
  highTable: 0xad30
};

const ACTOR_LABELS = new Map([
  [0x03, 'Skeleton'],
  [0x05, 'Mansion actor $05'],
  [0x13, 'Werewolf'],
  [0x17, 'Zombie'],
  [0x1e, 'Cemetery actor $1E'],
  [0x22, 'Mansion actor $22'],
  [0x38, 'Cemetery actor $38'],
  [0x3a, 'Graveyard actor $3A'],
  [0x43, 'Transparent sprite mask']
]);

const ACTOR_NOTES = new Map([
  [0x03, 'Runtime-proven Jova Woods enemy. Day/night HP differs in the observed traces.'],
  [0x05, 'Observed in Berkeley Mansion trace; promoted only as a ROM-backed actor id, not yet guide-named.'],
  [0x13, 'Runtime-proven Jova Woods enemy. Day/night HP differs in the observed traces.'],
  [0x17, 'Runtime-proven Jova town night enemy.'],
  [0x1e, 'Observed trace class outside the Jova-to-first-mansion slice.'],
  [0x22, 'Observed trace class outside the Jova-to-first-mansion slice.'],
  [0x38, 'Observed cemetery trace class outside the Jova-to-first-mansion slice.'],
  [0x3a, 'Observed graveyard trace class outside the Jova-to-first-mansion slice.'],
  [0x43, 'Rendering-control row, not an enemy/NPC: the ROM routine parks eight blank tile $FF sprites at its X/Y position to consume scanline sprite slots.']
]);

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

function parseDecimal(value) {
  if (value == null || value === '') {
    return undefined;
  }
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseHex(value) {
  if (value == null || value === '') {
    return undefined;
  }
  const text = String(value).trim();
  const normalized = text.startsWith('0x') || text.startsWith('0X') ? text.slice(2) : text;
  const parsed = Number.parseInt(normalized, 16);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseTsv(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const body = fs.readFileSync(filePath, 'utf8').trim();
  if (!body) {
    return [];
  }

  const lines = body.split(/\r?\n/);
  const header = lines[0].split('\t');
  return lines.slice(1).map((line) => {
    const cells = line.split('\t');
    return header.reduce((row, name, index) => {
      row[name] = cells[index] ?? '';
      return row;
    }, {});
  });
}

function sortedNumbers(values) {
  return Array.from(values)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
}

function sortedHex(values, width = 2) {
  return sortedNumbers(values).map((value) => hex(value, width));
}

function addToMapSet(map, key, value) {
  if (value == null || Number.isNaN(value)) {
    return;
  }
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key).add(value);
}

function cpuToRomOffset(info, cpuAddress, bank = 0) {
  if (cpuAddress >= 0xc000 && cpuAddress <= 0xffff) {
    const fixedBank = info.prgRomBanks - 1;
    return info.prgStart + fixedBank * 0x4000 + (cpuAddress - 0xc000);
  }

  if (cpuAddress >= 0x8000 && cpuAddress <= 0xbfff) {
    return info.prgStart + bank * 0x4000 + (cpuAddress - 0x8000);
  }

  throw new Error(`CPU address ${hex(cpuAddress, 4)} is outside PRG ROM`);
}

function readCpuByte(rom, info, cpuAddress, bank = 0) {
  return rom[cpuToRomOffset(info, cpuAddress, bank)];
}

function readCpuWord(rom, info, cpuAddress, bank = 0) {
  const lo = readCpuByte(rom, info, cpuAddress, bank);
  const hi = readCpuByte(rom, info, cpuAddress + 1, bank);
  return lo | (hi << 8);
}

function signed8(value) {
  return value >= 0x80 ? value - 0x100 : value;
}

function publicBytes(bytes) {
  return Array.from(bytes).map((byte) => hex(byte, 2));
}

function decodeRoutineWindow(rom, info) {
  const bytes = [];
  for (let cpu = SELECTOR_STREAM_ROUTINE.start; cpu <= SELECTOR_STREAM_ROUTINE.end; cpu += 1) {
    bytes.push(readCpuByte(rom, info, cpu));
  }

  const lowPointer = readCpuWord(rom, info, SELECTOR_STREAM_ROUTINE.tablePointerLow);
  const highPointer = readCpuWord(rom, info, SELECTOR_STREAM_ROUTINE.tablePointerHigh);

  return {
    cpuRange: `${hex(SELECTOR_STREAM_ROUTINE.start, 4)}-${hex(SELECTOR_STREAM_ROUTINE.end, 4)}`,
    selectorWritePc: hex(SELECTOR_STREAM_ROUTINE.writePc, 4),
    tablePointers: {
      low: {
        pointerAddress: hex(SELECTOR_STREAM_ROUTINE.tablePointerLow, 4),
        value: hex(lowPointer, 4)
      },
      high: {
        pointerAddress: hex(SELECTOR_STREAM_ROUTINE.tablePointerHigh, 4),
        value: hex(highPointer, 4)
      }
    },
    tableBase: hex(SELECTOR_STREAM_ROUTINE.tableBase, 4),
    bytes: publicBytes(bytes),
    proof: [
      '$040E,x is multiplied by 3, so each actor animation entry is a 3-byte ROM record.',
      'The pointer pair at $DD9E/$DDA0 selects the same fixed-bank record table for low/high actor index ranges.',
      '$DD7D writes the selector byte after adding the actor frame counter, then $DD80 writes the sidecar byte to $03EA,x.'
    ]
  };
}

function decodeSelectorRecordAt(rom, info, cpuAddress) {
  const frameLimit = readCpuByte(rom, info, cpuAddress);
  const baseSelector = readCpuByte(rom, info, cpuAddress + 1);
  const sidecar = readCpuByte(rom, info, cpuAddress + 2);
  const selectors = [];
  for (let i = 0; i <= frameLimit; i += 1) {
    selectors.push((baseSelector + i) & 0xff);
  }

  return {
    cpuAddress,
    fileOffset: cpuToRomOffset(info, cpuAddress),
    recordIndex: Math.floor((cpuAddress - SELECTOR_STREAM_ROUTINE.tableBase) / 3),
    frameLimit,
    baseSelector,
    sidecar,
    selectors,
    bytes: [frameLimit, baseSelector, sidecar]
  };
}

function decodeSelectorRecordFromTraceY(rom, info, yRegister) {
  const cpuAddress = SELECTOR_STREAM_ROUTINE.tableBase + yRegister - 1;
  return decodeSelectorRecordAt(rom, info, cpuAddress);
}

function resolveMetaspritePointer(rom, info, selector) {
  const table = selector < 0x80 ? METASPRITE_POINTERS.lowTable : METASPRITE_POINTERS.highTable;
  const index = selector < 0x80 ? selector : (selector & 0x7f);
  const pointerAddress = table + index * 2;
  const target = readCpuWord(rom, info, pointerAddress, 0);
  return {
    selector,
    pointerTable: table,
    pointerIndex: index,
    pointerAddress,
    target,
    fileOffset: cpuToRomOffset(info, target, 0)
  };
}

function readShapeByte(rom, info, cpuAddress, offset) {
  return readCpuByte(rom, info, cpuAddress + offset, 0);
}

function decodeMetaspriteSelector(rom, info, selector, opts = {}) {
  const pointer = resolveMetaspritePointer(rom, info, selector);
  const status = readCpuByte(rom, info, pointer.target, 0);
  const count = status & 0x7f;
  const usesSharedShape = (status & 0x80) !== 0;
  const baseAttr = opts.baseAttr ?? 0;
  let shapeAddress = pointer.target;
  let shapeOffset = 1;
  let tileOffset = 1;
  let shapePointer;

  if (usesSharedShape) {
    shapePointer = readCpuWord(rom, info, pointer.target + 1, 0);
    shapeAddress = shapePointer;
    shapeOffset = 1;
    tileOffset = 3;
  }

  const sprites = [];
  let previousAttr = baseAttr & 0x03;

  for (let index = 0; index < count; index += 1) {
    const rawY = readShapeByte(rom, info, shapeAddress, shapeOffset);
    shapeOffset += 1;
    const yRotated = (((rawY & 0x80) ? 0x80 : 0x00) | (rawY >> 1)) & 0xff;
    const yOffset = signed8(yRotated);
    const reusePreviousAttr = (rawY & 0x01) !== 0;
    let tile;

    if (usesSharedShape) {
      tile = readCpuByte(rom, info, pointer.target + tileOffset, 0);
      tileOffset += 1;
      shapeOffset += 1;
    } else {
      tile = readShapeByte(rom, info, shapeAddress, shapeOffset);
      shapeOffset += 1;
    }

    let attr = previousAttr;
    if (!reusePreviousAttr) {
      const attrRaw = readShapeByte(rom, info, shapeAddress, shapeOffset);
      shapeOffset += 1;
      attr = (baseAttr & 0x03) !== 0 ? ((attrRaw & 0xdc) | (baseAttr & 0x03)) : attrRaw;
      previousAttr = attr;
    }

    const rawX = readShapeByte(rom, info, shapeAddress, shapeOffset);
    shapeOffset += 1;

    sprites.push({
      index,
      tile,
      attr,
      xOffset: signed8(rawX),
      yOffset,
      raw: {
        y: rawY,
        x: rawX
      },
      reusePreviousAttr
    });
  }

  return {
    selector,
    pointer,
    status,
    count,
    usesSharedShape,
    shapePointer,
    sprites
  };
}

function decodePatternPixel(patterns, tileIndex, tableBase, x, y) {
  const tileOffset = tableBase + tileIndex * 16;
  if (tileOffset + y + 8 >= patterns.length) {
    return 0;
  }
  const low = patterns[tileOffset + y];
  const high = patterns[tileOffset + y + 8];
  const bit = 7 - x;
  return ((low >> bit) & 1) | (((high >> bit) & 1) << 1);
}

function spritePaletteColor(palettes, paletteIndex, colorId) {
  const nesColor = palettes[0x10 + (paletteIndex * 4) + colorId];
  return colorFromNesIndex(nesColor || 0);
}

function frameBounds(frames, spriteHeight) {
  let minX = 0;
  let minY = 0;
  let maxX = 8;
  let maxY = spriteHeight;

  for (const frame of frames) {
    for (const sprite of frame.sprites) {
      minX = Math.min(minX, sprite.xOffset);
      minY = Math.min(minY, sprite.yOffset);
      maxX = Math.max(maxX, sprite.xOffset + 8);
      maxY = Math.max(maxY, sprite.yOffset + spriteHeight);
    }
  }

  return { minX, minY, maxX, maxY };
}

function drawSprite(rgba, width, height, frameX, frameY, sprite, patterns, palettes, opts) {
  const paletteIndex = sprite.attr & 0x03;
  const flipHorizontal = (sprite.attr & 0x40) !== 0;
  const flipVertical = (sprite.attr & 0x80) !== 0;
  const spriteHeight = opts.largeSprites ? 16 : 8;

  for (let row = 0; row < spriteHeight; row += 1) {
    const patternY = flipVertical ? spriteHeight - 1 - row : row;
    let tableBase = opts.spritePatternBase;
    let patternTile = sprite.tile;
    let tileY = patternY;
    const screenY = frameY + sprite.yOffset + row;
    if (screenY < 0 || screenY >= height) {
      continue;
    }

    if (opts.largeSprites) {
      tableBase = (sprite.tile & 0x01) ? 0x1000 : 0x0000;
      patternTile = (sprite.tile & 0xfe) + Math.floor(patternY / 8);
      tileY = patternY % 8;
    }

    for (let col = 0; col < 8; col += 1) {
      const tileX = flipHorizontal ? 7 - col : col;
      const screenX = frameX + sprite.xOffset + col;
      if (screenX < 0 || screenX >= width) {
        continue;
      }

      const colorId = decodePatternPixel(patterns, patternTile, tableBase, tileX, tileY);
      if (colorId === 0) {
        continue;
      }

      const rgb = spritePaletteColor(palettes, paletteIndex, colorId);
      const out = (screenY * width + screenX) * 4;
      rgba[out] = rgb[0];
      rgba[out + 1] = rgb[1];
      rgba[out + 2] = rgb[2];
      rgba[out + 3] = 0xff;
    }
  }
}

function renderSelectorStrip(rom, info, selectorRecord, opts) {
  const frames = selectorRecord.selectors.map((selector) => decodeMetaspriteSelector(rom, info, selector, {
    baseAttr: opts.baseAttr
  }));
  const largeSprites = Boolean(opts.largeSprites);
  const spriteHeight = largeSprites ? 16 : 8;
  const bounds = frameBounds(frames, spriteHeight);
  const padding = 3;
  const gap = 4;
  const frameWidth = Math.max(16, bounds.maxX - bounds.minX + padding * 2);
  const frameHeight = Math.max(16, bounds.maxY - bounds.minY + padding * 2);
  const width = Math.max(1, frameWidth * frames.length + gap * Math.max(0, frames.length - 1));
  const height = frameHeight;
  const rgba = Buffer.alloc(width * height * 4);
  const offsetX = padding - bounds.minX;
  const offsetY = padding - bounds.minY;

  for (let frameIndex = 0; frameIndex < frames.length; frameIndex += 1) {
    const frame = frames[frameIndex];
    const frameX = frameIndex * (frameWidth + gap) + offsetX;
    const frameY = offsetY;
    for (const sprite of frame.sprites) {
      drawSprite(rgba, width, height, frameX, frameY, sprite, opts.patterns, opts.palettes, {
        largeSprites,
        spritePatternBase: opts.spritePatternBase
      });
    }
  }

  return {
    width,
    height,
    rgba,
    metadata: {
      frameWidth,
      frameHeight,
      spriteHeight,
      largeSprites,
      bounds,
      selectors: selectorRecord.selectors,
      frames: frames.map((frame) => ({
        selector: hex(frame.selector, 2),
        pointer: hex(frame.pointer.target, 4),
        status: hex(frame.status, 2),
        count: frame.count,
        usesSharedShape: frame.usesSharedShape,
        shapePointer: frame.shapePointer ? hex(frame.shapePointer, 4) : undefined,
        sprites: frame.sprites.map((sprite) => ({
          tile: hex(sprite.tile, 2),
          attr: hex(sprite.attr, 2),
          xOffset: sprite.xOffset,
          yOffset: sprite.yOffset
        }))
      }))
    }
  };
}

function loadTraceManifest(filePath) {
  const resolved = path.resolve(filePath || DEFAULT_FIXTURE_FILE);
  const raw = readJson(resolved);
  return {
    file: resolved,
    capturesRoot: raw.capturesRoot || DEFAULT_TRACES_DIR,
    traces: (raw.traces || []).map((trace) => ({
      id: trace.id,
      label: trace.label || trace.id
    }))
  };
}

function makeContext(row) {
  return {
    objset: parseDecimal(row.objset),
    area: parseDecimal(row.area),
    submapRaw: parseDecimal(row.submapRaw),
    submap: parseDecimal(row.submap),
    night: parseDecimal(row.night),
    actorPointer: parseDecimal(row.actorPointer),
    tileSetPointer: parseDecimal(row.tileSetPointer)
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

function summarizeTraceSlots(slotRows) {
  const byActor = new Map();

  for (const row of slotRows) {
    const actorId = parseDecimal(row.activeId);
    if (!Number.isFinite(actorId) || actorId === 0) {
      continue;
    }

    if (!byActor.has(actorId)) {
      byActor.set(actorId, {
        hpValues: new Set(),
        hpByNight: new Map(),
        attrs: new Set(),
        selectors: new Set(),
        positions: new Set(),
        spritePatternBases: new Set(),
        largeSprites: new Set(),
        contexts: new Map()
      });
    }

    const group = byActor.get(actorId);
    const hp = parseDecimal(row.hp);
    const night = parseDecimal(row.night);
    const selector = parseDecimal(row.selector);
    const attr = parseDecimal(row.attr);
    const screenX = parseDecimal(row.screenX);
    const screenY = parseDecimal(row.screenY);
    const context = makeContext(row);

    group.hpValues.add(hp);
    addToMapSet(group.hpByNight, night, hp);
    group.selectors.add(selector);
    group.attrs.add(attr);
    group.spritePatternBases.add(parseDecimal(row.ppuSpritePatternAddr));
    group.largeSprites.add(parseDecimal(row.ppuLargeSprites));
    group.contexts.set(contextKey(context), context);

    if (Number.isFinite(screenX) && Number.isFinite(screenY)) {
      group.positions.add(`${screenX},${screenY}`);
    }
  }

  return byActor;
}

function ensureActorGroup(groups, actorId, selectorRecord) {
  const key = `${actorId}:${selectorRecord.cpuAddress}`;
  if (!groups.has(key)) {
    groups.set(key, {
      actorId,
      selectorRecord,
      traces: new Map(),
      observedSelectors: new Set(),
      writeValues: new Set(),
      hpValues: new Set(),
      hpByNight: new Map(),
      attrs: new Set(),
      positions: new Set(),
      spritePatternBases: new Set(),
      largeSprites: new Set(),
      contexts: new Map(),
      writes: 0
    });
  }
  return groups.get(key);
}

function addSlotSummaryToGroup(group, trace, slotSummary) {
  if (!slotSummary) {
    return;
  }

  for (const value of slotSummary.hpValues) group.hpValues.add(value);
  for (const [night, values] of slotSummary.hpByNight.entries()) {
    for (const value of values) addToMapSet(group.hpByNight, night, value);
  }
  for (const value of slotSummary.attrs) group.attrs.add(value);
  for (const value of slotSummary.selectors) group.observedSelectors.add(value);
  for (const value of slotSummary.positions) group.positions.add(`${trace.id}:${value}`);
  for (const value of slotSummary.spritePatternBases) group.spritePatternBases.add(value);
  for (const value of slotSummary.largeSprites) group.largeSprites.add(value);
  for (const context of slotSummary.contexts.values()) group.contexts.set(contextKey(context), context);
}

function collectActorGroups(rom, info, manifest, tracesRoot) {
  const groups = new Map();
  const diagnostics = [];

  for (const trace of manifest.traces) {
    const traceDir = path.join(tracesRoot, trace.id);
    const writeRows = parseTsv(path.join(traceDir, 'actor-writes.tsv'));
    const slotRows = parseTsv(path.join(traceDir, 'actor-slots.tsv'));
    const slotSummary = summarizeTraceSlots(slotRows);

    for (const row of writeRows) {
      if (row.field !== 'selector' || parseHex(row.pc) !== SELECTOR_STREAM_ROUTINE.writePc) {
        continue;
      }

      const actorId = parseDecimal(row.activeIdAtWrite);
      if (!Number.isFinite(actorId) || actorId === 0) {
        continue;
      }

      const yRegister = parseHex(row.y);
      const selector = parseDecimal(row.value);
      const night = parseDecimal(row.night);
      const hp = parseDecimal(row.hpAtWrite);
      const selectorRecord = decodeSelectorRecordFromTraceY(rom, info, yRegister);
      const matchesRecord = selectorRecord.selectors.includes(selector);
      const group = ensureActorGroup(groups, actorId, selectorRecord);
      const context = makeContext(row);

      group.writes += 1;
      group.observedSelectors.add(selector);
      group.writeValues.add(selector);
      group.hpValues.add(hp);
      addToMapSet(group.hpByNight, night, hp);
      group.contexts.set(contextKey(context), context);
      addSlotSummaryToGroup(group, trace, slotSummary.get(actorId));

      if (!group.traces.has(trace.id)) {
        group.traces.set(trace.id, {
          id: trace.id,
          label: trace.label,
          traceDir,
          yRegisters: new Set(),
          observedSelectors: new Set(),
          contexts: new Map(),
          firstTraceFrame: parseDecimal(row.traceFrame),
          firstCpuWriteFrame: parseDecimal(row.frame)
        });
      }

      const traceEvidence = group.traces.get(trace.id);
      traceEvidence.yRegisters.add(yRegister);
      traceEvidence.observedSelectors.add(selector);
      traceEvidence.contexts.set(contextKey(context), context);

      if (!matchesRecord) {
        diagnostics.push({
          trace: trace.id,
          actorId: hex(actorId, 2),
          selector: hex(selector, 2),
          recordAddress: hex(selectorRecord.cpuAddress, 4),
          recordSelectors: sortedHex(selectorRecord.selectors),
          reason: 'selector write was not inside the fixed-bank stream record implied by CPU Y'
        });
      }
    }
  }

  return {
    groups: Array.from(groups.values()),
    diagnostics
  };
}

function chooseRenderTrace(group) {
  const traces = Array.from(group.traces.values())
    .filter((trace) => fs.existsSync(path.join(trace.traceDir, 'ppu-final-0000-1fff-patterns.bin'))
      && fs.existsSync(path.join(trace.traceDir, 'ppu-final-3f00-3f1f-palettes.bin')))
    .sort((a, b) => a.id.localeCompare(b.id));
  return traces[0];
}

function selectBaseAttr(group) {
  const attrs = sortedNumbers(group.attrs).filter((value) => Number.isFinite(value));
  const nonZero = attrs.find((value) => value !== 0);
  return nonZero ?? attrs[0] ?? 0;
}

function selectSpritePatternBase(group) {
  const bases = sortedNumbers(group.spritePatternBases).filter((value) => value === 0x0000 || value === 0x1000);
  return bases.includes(0x1000) ? 0x1000 : (bases[0] ?? 0x1000);
}

function selectLargeSprites(group) {
  return sortedNumbers(group.largeSprites).includes(1);
}

function renderGroupSprite(rom, info, group, outDir) {
  const trace = chooseRenderTrace(group);
  if (!trace) {
    return {
      status: 'missing-runtime-pattern-or-palette-capture'
    };
  }

  const patterns = fs.readFileSync(path.join(trace.traceDir, 'ppu-final-0000-1fff-patterns.bin'));
  const palettes = fs.readFileSync(path.join(trace.traceDir, 'ppu-final-3f00-3f1f-palettes.bin'));
  const baseAttr = selectBaseAttr(group);
  const spritePatternBase = selectSpritePatternBase(group);
  const largeSprites = selectLargeSprites(group);
  const rendered = renderSelectorStrip(rom, info, group.selectorRecord, {
    patterns,
    palettes,
    baseAttr,
    spritePatternBase,
    largeSprites
  });
  const fileName = `actor-${hex(group.actorId, 2).slice(2).toLowerCase()}-record-${hex(group.selectorRecord.cpuAddress, 4).slice(2).toLowerCase()}.png`;
  const output = path.join(outDir, 'sprites', fileName);
  writePng(output, rendered.width, rendered.height, rendered.rgba);

  return {
    status: 'rendered',
    output,
    width: rendered.width,
    height: rendered.height,
    sourceTrace: trace.id,
    baseAttr: hex(baseAttr, 2),
    spritePatternBase: hex(spritePatternBase, 4),
    largeSprites,
    spriteHeight: rendered.metadata.spriteHeight,
    frames: rendered.metadata.frames
  };
}

function publicSelectorRecord(record) {
  return {
    cpuAddress: hex(record.cpuAddress, 4),
    fileOffset: hex(record.fileOffset, 5),
    recordIndex: record.recordIndex,
    frameLimit: hex(record.frameLimit, 2),
    baseSelector: hex(record.baseSelector, 2),
    sidecar: hex(record.sidecar, 2),
    selectors: sortedHex(record.selectors),
    bytes: publicBytes(record.bytes)
  };
}

function publicTrace(trace) {
  return {
    id: trace.id,
    label: trace.label,
    yRegisters: sortedHex(trace.yRegisters),
    observedSelectors: sortedHex(trace.observedSelectors),
    firstTraceFrame: trace.firstTraceFrame,
    firstCpuWriteFrame: trace.firstCpuWriteFrame,
    contexts: Array.from(trace.contexts.values()).map(publicContext)
  };
}

function publicActorGroup(group, sprite) {
  const isControl = group.actorId === 0x43;
  const promoted = !isControl && sprite.status === 'rendered';
  return {
    actorId: hex(group.actorId, 2),
    label: ACTOR_LABELS.get(group.actorId) || `Actor ${hex(group.actorId, 2)}`,
    status: promoted ? 'promoted' : 'diagnostic',
    note: ACTOR_NOTES.get(group.actorId) || 'Observed in actor traces; guide naming still pending.',
    writes: group.writes,
    selectorRecord: publicSelectorRecord(group.selectorRecord),
    observedSelectors: sortedHex(group.observedSelectors),
    observedSelectorWrites: sortedHex(group.writeValues),
    hpValues: sortedHex(group.hpValues),
    hpByNight: Array.from(group.hpByNight.entries())
      .sort(([a], [b]) => a - b)
      .map(([night, values]) => ({
        night: hex(night, 2),
        hpValues: sortedHex(values)
      })),
    attrs: sortedHex(group.attrs),
    spritePatternBases: sortedHex(group.spritePatternBases, 4),
    largeSprites: sortedHex(group.largeSprites),
    samplePositions: Array.from(group.positions).sort().slice(0, 12),
    contexts: Array.from(group.contexts.values()).map(publicContext),
    traces: Array.from(group.traces.values()).map(publicTrace).sort((a, b) => a.id.localeCompare(b.id)),
    sprite: sprite.status === 'rendered'
      ? {
        ...sprite,
        output: path.relative(process.cwd(), sprite.output)
      }
      : sprite
  };
}

function writeDemoEvidence(outDir, analysis) {
  const evidence = {
    schemaVersion: analysis.schemaVersion,
    generatedAt: analysis.generatedAt,
    summary: analysis.summary,
    source: analysis.source,
    routine: analysis.routine,
    promotedActors: analysis.actors.filter((actor) => actor.status === 'promoted'),
    diagnosticActors: analysis.actors.filter((actor) => actor.status !== 'promoted')
  };
  const output = path.join(outDir, 'evidence.js');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(
    output,
    `window.ACTOR_SELECTOR_STREAM_EVIDENCE = ${JSON.stringify(evidence, null, 2)};\n`
  );
  return output;
}

function decodeActorSelectorStreams(rom, info, opts = {}) {
  const manifest = loadTraceManifest(opts.fixtureFile || DEFAULT_FIXTURE_FILE);
  const tracesRoot = path.resolve(opts.tracesDir || opts.outTraces || manifest.capturesRoot || DEFAULT_TRACES_DIR);
  const outDir = path.resolve(opts.outDir || DEFAULT_OUT_DIR);
  const { groups, diagnostics } = collectActorGroups(rom, info, manifest, tracesRoot);
  const routine = decodeRoutineWindow(rom, info);
  const actors = [];

  fs.mkdirSync(path.join(outDir, 'sprites'), { recursive: true });

  for (const group of groups.sort((a, b) => {
    const actorDelta = a.actorId - b.actorId;
    if (actorDelta !== 0) {
      return actorDelta;
    }
    return a.selectorRecord.cpuAddress - b.selectorRecord.cpuAddress;
  })) {
    const sprite = renderGroupSprite(rom, info, group, outDir);
    actors.push(publicActorGroup(group, sprite));
  }

  const promotedActors = actors.filter((actor) => actor.status === 'promoted');
  const analysis = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      fixtureFile: path.relative(process.cwd(), manifest.file),
      tracesRoot: path.relative(process.cwd(), tracesRoot),
      rom: info.file,
      method: [
        'Existing save-state traces expose the runtime actor id and CPU Y register at selector write PC $DD7D.',
        'The fixed PRG routine around $DD35-$DD86 maps that Y register back to a 3-byte ROM selector-stream record.',
        'Each selector in the record resolves through the ROM metasprite pointer tables at $AC30/$AD30.',
        'Sprite strips are rendered from ROM metasprite bytes plus captured CHR/palette memory from the same trace family.'
      ]
    },
    routine,
    summary: {
      traceFixtures: manifest.traces.length,
      actorRecords: actors.length,
      promotedActors: promotedActors.length,
      diagnosticActors: actors.length - promotedActors.length,
      renderedSpriteStrips: actors.filter((actor) => actor.sprite.status === 'rendered').length,
      mismatchedSelectorWrites: diagnostics.length
    },
    actors,
    diagnostics
  };

  const analysisOutput = path.join(outDir, 'analysis.json');
  writeJson(analysisOutput, analysis);
  const evidenceOutput = writeDemoEvidence(outDir, analysis);

  return {
    output: analysisOutput,
    evidenceOutput,
    spriteDir: path.join(outDir, 'sprites'),
    summary: analysis.summary
  };
}

module.exports = {
  decodeActorSelectorStreams,
  decodeMetaspriteSelector,
  decodeSelectorRecordAt,
  decodeSelectorRecordFromTraceY,
  renderSelectorStrip
};
