'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte, readPrgWord, toHex } = require('./background');
const { loadBackgroundDescriptor } = require('./descriptors');
const { buildPatternTableFromChrBanks, readBackgroundPalette } = require('./native-image');
const { colorFromNesIndex } = require('./palette');
const { writePng } = require('./png');

const DEFAULT_LAYOUT_SEGMENTS_FILE = path.join(__dirname, '..', 'data', 'layout-segments.json');
const TILE_SIZE = 8;
const BLOCK_TILES = 4;
const BLOCK_SIZE = TILE_SIZE * BLOCK_TILES;

function parseInteger(value, label) {
  if (value == null) {
    return value;
  }
  if (Number.isInteger(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    throw new Error(`${label} must be an integer or numeric string`);
  }
  const trimmed = value.trim();
  const parsed = /^0x/i.test(trimmed)
    ? Number.parseInt(trimmed.slice(2), 16)
    : Number.parseInt(trimmed, 10);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${label} must be an integer or numeric string`);
  }
  return parsed;
}

function parseIntegerArray(values, label) {
  if (!Array.isArray(values)) {
    throw new Error(`${label} must be an array`);
  }
  return values.map((value, index) => {
    const parsed = parseInteger(value, `${label}[${index}]`);
    if (!Number.isInteger(parsed)) {
      throw new Error(`${label}[${index}] must be an integer`);
    }
    return parsed;
  });
}

function normalizeValidationWindow(raw, index) {
  return {
    ...raw,
    x: parseInteger(raw.x, `validationWindows[${index}].x`),
    y: parseInteger(raw.y, `validationWindows[${index}].y`),
    width: parseInteger(raw.width, `validationWindows[${index}].width`),
    height: parseInteger(raw.height, `validationWindows[${index}].height`)
  };
}

function normalizeLayoutSegment(raw) {
  return {
    ...raw,
    layoutSection: parseInteger(raw.layoutSection, `${raw.id}.layoutSection`) ?? 0,
    columnGroups: parseIntegerArray(raw.columnGroups || [], `${raw.id}.columnGroups`),
    widthBlocks: parseInteger(raw.widthBlocks, `${raw.id}.widthBlocks`),
    heightBlocks: parseInteger(raw.heightBlocks, `${raw.id}.heightBlocks`),
    bgPatternBase: parseInteger(raw.bgPatternBase, `${raw.id}.bgPatternBase`) ?? 0,
    validationWindows: (raw.validationWindows || []).map(normalizeValidationWindow)
  };
}

function loadLayoutSegmentFile(filePath = DEFAULT_LAYOUT_SEGMENTS_FILE) {
  const resolved = path.resolve(filePath);
  const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  return {
    ...data,
    filePath: resolved,
    segments: (data.segments || []).map(normalizeLayoutSegment)
  };
}

function loadLayoutSegment(id, opts = {}) {
  const file = loadLayoutSegmentFile(opts.filePath);
  const segment = file.segments.find((candidate) => candidate.id === id);
  if (!segment) {
    throw new Error(`unknown layout segment "${id}" in ${file.filePath}`);
  }
  return {
    ...segment,
    filePath: file.filePath
  };
}

function decodePatternPixel(patterns, tileIndex, tableBase, x, y) {
  const tileOffset = tableBase + tileIndex * 16;
  const low = patterns[tileOffset + y];
  const high = patterns[tileOffset + y + 8];
  const bit = 7 - x;
  return ((low >> bit) & 1) | (((high >> bit) & 1) << 1);
}

function backgroundPaletteColor(palettes, paletteIndex, colorId) {
  const nesColor = colorId === 0
    ? palettes[0]
    : palettes[(paletteIndex * 4) + colorId];
  return colorFromNesIndex(nesColor || 0);
}

function nativePaletteBits(attributeByte, tileRow, tileColumn) {
  const quadrant = (tileRow >= 2 ? 2 : 0) + (tileColumn >= 2 ? 1 : 0);
  return (attributeByte >> (quadrant * 2)) & 0x03;
}

function layoutPointerInfo(rom, info, descriptor, section, columnGroup) {
  if (!Number.isInteger(descriptor.layoutHeaderAddress)) {
    throw new Error(`descriptor "${descriptor.id}" is missing layoutHeaderAddress`);
  }

  const readOpts = descriptor.layoutHeaderBank == null ? {} : { bank: descriptor.layoutHeaderBank };
  const pointersPerSection = readPrgByte(rom, info, descriptor.layoutHeaderAddress, readOpts);
  const pointerIndex = section * pointersPerSection + columnGroup;
  if (columnGroup < 0 || columnGroup >= pointersPerSection) {
    throw new Error(
      `column group ${columnGroup} is outside 0-${pointersPerSection - 1} for descriptor "${descriptor.id}"`
    );
  }

  const pointerAddress = descriptor.layoutHeaderAddress + 2 + pointerIndex * 2;
  return {
    pointersPerSection,
    pointerIndex,
    pointerAddress,
    layoutAddress: readPrgWord(rom, info, pointerAddress, readOpts)
  };
}

function readBlockIndex(rom, info, descriptor, layoutAddress, blockRow, blockColumn) {
  return readPrgByte(
    rom,
    info,
    layoutAddress + blockRow * descriptor.widthBlocks + blockColumn,
    { bank: descriptor.layoutBank }
  );
}

function renderTile(rgba, renderState, tileIndex, paletteIndex, destX, destY) {
  const { width, patterns, palettes, bgPatternBase } = renderState;
  for (let pixelY = 0; pixelY < TILE_SIZE; pixelY += 1) {
    for (let pixelX = 0; pixelX < TILE_SIZE; pixelX += 1) {
      const colorId = decodePatternPixel(patterns, tileIndex, bgPatternBase, pixelX, pixelY);
      const rgb = backgroundPaletteColor(palettes, paletteIndex, colorId);
      const offset = ((destY + pixelY) * width + destX + pixelX) * 4;
      rgba[offset] = rgb[0];
      rgba[offset + 1] = rgb[1];
      rgba[offset + 2] = rgb[2];
      rgba[offset + 3] = 0xff;
    }
  }
}

function renderBlock(rgba, renderState, descriptor, blockIndex, destBlockColumn, blockRow) {
  const { rom, info, tileBaseAddress } = renderState;
  const attributeByte = readPrgByte(rom, info, descriptor.tileSetAddress + 1 + blockIndex, {
    bank: descriptor.tileBank
  });

  for (let tileRow = 0; tileRow < BLOCK_TILES; tileRow += 1) {
    for (let tileColumn = 0; tileColumn < BLOCK_TILES; tileColumn += 1) {
      const tileIndex = readPrgByte(
        rom,
        info,
        tileBaseAddress + blockIndex * 16 + tileRow * BLOCK_TILES + tileColumn,
        { bank: descriptor.tileBank }
      );
      renderTile(
        rgba,
        renderState,
        tileIndex,
        nativePaletteBits(attributeByte, tileRow, tileColumn),
        destBlockColumn * BLOCK_SIZE + tileColumn * TILE_SIZE,
        blockRow * BLOCK_SIZE + tileRow * TILE_SIZE
      );
    }
  }
}

function renderLayoutSegment(rom, info, segment, opts = {}) {
  const descriptor = loadBackgroundDescriptor(segment.descriptor, {
    filePath: opts.descriptorFile
  });
  const columnGroups = segment.columnGroups;
  if (!columnGroups.length) {
    throw new Error(`layout segment "${segment.id}" must define at least one column group`);
  }

  const groupWidthBlocks = segment.widthBlocks || descriptor.widthBlocks;
  const heightBlocks = segment.heightBlocks || descriptor.heightBlocks;
  if (groupWidthBlocks !== descriptor.widthBlocks) {
    throw new Error(
      `layout segment "${segment.id}" widthBlocks ${groupWidthBlocks} must currently match descriptor widthBlocks ${descriptor.widthBlocks}`
    );
  }

  const widthBlocks = groupWidthBlocks * columnGroups.length;
  const width = widthBlocks * BLOCK_SIZE;
  const height = heightBlocks * BLOCK_SIZE;
  const rgba = Buffer.alloc(width * height * 4);
  const patterns = buildPatternTableFromChrBanks(rom, info, descriptor.runtimeContext?.chrBanks);
  const palettes = readBackgroundPalette(rom, info, descriptor);
  const tileSetOffset = readPrgByte(rom, info, descriptor.tileSetAddress, { bank: descriptor.tileBank });
  const tileBaseAddress = descriptor.tileSetAddress + tileSetOffset;
  const renderState = {
    rom,
    info,
    width,
    patterns,
    palettes,
    bgPatternBase: segment.bgPatternBase,
    tileBaseAddress
  };
  const columns = [];

  columnGroups.forEach((columnGroup, index) => {
    const pointer = layoutPointerInfo(rom, info, descriptor, segment.layoutSection, columnGroup);
    const layoutBytes = [];
    for (let blockRow = 0; blockRow < heightBlocks; blockRow += 1) {
      const row = [];
      for (let blockColumn = 0; blockColumn < groupWidthBlocks; blockColumn += 1) {
        const blockIndex = readBlockIndex(rom, info, descriptor, pointer.layoutAddress, blockRow, blockColumn);
        row.push(blockIndex);
        renderBlock(rgba, renderState, descriptor, blockIndex, index * groupWidthBlocks + blockColumn, blockRow);
      }
      layoutBytes.push(row);
    }

    columns.push({
      index,
      columnGroup,
      x: index * groupWidthBlocks * BLOCK_SIZE,
      y: 0,
      width: groupWidthBlocks * BLOCK_SIZE,
      height,
      pointersPerSection: pointer.pointersPerSection,
      layoutPointerIndex: pointer.pointerIndex,
      layoutPointerAddress: `0x${toHex(pointer.pointerAddress)}`,
      layoutAddress: `0x${toHex(pointer.layoutAddress)}`,
      layoutBytes
    });
  });

  return {
    width,
    height,
    rgba,
    metadata: {
      id: segment.id,
      label: segment.label,
      summary: segment.summary,
      source: 'rom-native-layout-segment',
      descriptor: descriptor.id,
      descriptorLabel: descriptor.label,
      variant: descriptor.variant,
      access: descriptor.access,
      paletteMode: descriptor.paletteMode,
      runtimeContext: descriptor.runtimeContext,
      layoutSection: segment.layoutSection,
      columnGroups,
      blockSize: BLOCK_SIZE,
      widthBlocks,
      heightBlocks,
      groupWidthBlocks,
      width,
      height,
      bgPatternBase: `0x${toHex(segment.bgPatternBase, 4)}`,
      layoutHeaderAddress: `0x${toHex(descriptor.layoutHeaderAddress)}`,
      layoutHeaderBank: descriptor.layoutHeaderBank,
      layoutBank: descriptor.layoutBank,
      tileBank: descriptor.tileBank,
      tileSetAddress: `0x${toHex(descriptor.tileSetAddress)}`,
      tileSetOffset: `0x${toHex(tileSetOffset, 2)}`,
      tileBaseAddress: `0x${toHex(tileBaseAddress)}`,
      paletteAddress: `0x${toHex(descriptor.paletteAddress)}`,
      paletteBank: descriptor.paletteBank,
      paletteBytes: [...palettes].map((value) => `0x${toHex(value, 2)}`),
      chrBanks: descriptor.runtimeContext.chrBanks,
      validationWindows: segment.validationWindows,
      columns
    }
  };
}

function renderLayoutSegmentPng(rom, info, segment, output, opts = {}) {
  const rendered = renderLayoutSegment(rom, info, segment, opts);
  writePng(output, rendered.width, rendered.height, rendered.rgba);
  return {
    output: path.resolve(output),
    width: rendered.width,
    height: rendered.height,
    metadata: rendered.metadata
  };
}

module.exports = {
  DEFAULT_LAYOUT_SEGMENTS_FILE,
  loadLayoutSegment,
  loadLayoutSegmentFile,
  renderLayoutSegment,
  renderLayoutSegmentPng
};
