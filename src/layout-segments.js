'use strict';

const fs = require('fs');
const path = require('path');
const {
  AREA_TABLE_POINTERS,
  BACKGROUND_TABLE_BANK,
  LAYOUT_TABLE_POINTERS,
  SCREEN_RECORD_POINTERS_OFFSET,
  TILE_SET_POINTERS
} = require('./background-context');
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

function parseOptionalIntegerArray(values, label) {
  if (values == null) {
    return undefined;
  }
  return parseIntegerArray(values, label);
}

function normalizeRuntimeContext(raw = {}, label = 'runtimeContext') {
  return {
    ...raw,
    objset: parseInteger(raw.objset, `${label}.objset`),
    area: parseInteger(raw.area, `${label}.area`),
    submap: parseInteger(raw.submap, `${label}.submap`)
  };
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

function normalizeSegmentRef(raw, index) {
  return {
    ...raw,
    segment: raw.segment,
    x: parseInteger(raw.x, `segments[${index}].x`),
    y: parseInteger(raw.y, `segments[${index}].y`)
  };
}

function normalizeLayoutTemplate(raw, id) {
  return {
    ...raw,
    id,
    runtimeContext: normalizeRuntimeContext(raw.runtimeContext, `templates.${id}.runtimeContext`),
    chrBanks: parseOptionalIntegerArray(raw.chrBanks, `templates.${id}.chrBanks`),
    layoutBank: parseInteger(raw.layoutBank, `templates.${id}.layoutBank`),
    layoutHeaderBank: parseInteger(raw.layoutHeaderBank, `templates.${id}.layoutHeaderBank`),
    tileBank: parseInteger(raw.tileBank, `templates.${id}.tileBank`),
    tileSetAddress: parseInteger(raw.tileSetAddress, `templates.${id}.tileSetAddress`),
    paletteBank: parseInteger(raw.paletteBank, `templates.${id}.paletteBank`),
    paletteAddress: parseInteger(raw.paletteAddress, `templates.${id}.paletteAddress`),
    paletteLength: parseInteger(raw.paletteLength, `templates.${id}.paletteLength`),
    widthBlocks: parseInteger(raw.widthBlocks, `templates.${id}.widthBlocks`),
    heightBlocks: parseInteger(raw.heightBlocks, `templates.${id}.heightBlocks`)
  };
}

function normalizeLayoutSegment(raw) {
  return {
    ...raw,
    runtimeContext: normalizeRuntimeContext(raw.runtimeContext, `${raw.id}.runtimeContext`),
    layoutHeaderAddress: parseInteger(raw.layoutHeaderAddress, `${raw.id}.layoutHeaderAddress`),
    layoutHeaderBank: parseInteger(raw.layoutHeaderBank, `${raw.id}.layoutHeaderBank`),
    layoutIndexOverride: parseInteger(raw.layoutIndexOverride, `${raw.id}.layoutIndexOverride`),
    layoutBank: parseInteger(raw.layoutBank, `${raw.id}.layoutBank`),
    tileBank: parseInteger(raw.tileBank, `${raw.id}.tileBank`),
    tileSetAddress: parseInteger(raw.tileSetAddress, `${raw.id}.tileSetAddress`),
    paletteBank: parseInteger(raw.paletteBank, `${raw.id}.paletteBank`),
    paletteAddress: parseInteger(raw.paletteAddress, `${raw.id}.paletteAddress`),
    paletteLength: parseInteger(raw.paletteLength, `${raw.id}.paletteLength`),
    chrBanks: parseOptionalIntegerArray(raw.chrBanks, `${raw.id}.chrBanks`),
    layoutSection: parseInteger(raw.layoutSection, `${raw.id}.layoutSection`) ?? 0,
    layoutSections: parseOptionalIntegerArray(raw.layoutSections, `${raw.id}.layoutSections`),
    renderAllSections: Boolean(raw.renderAllSections),
    columnGroups: parseIntegerArray(raw.columnGroups || [], `${raw.id}.columnGroups`),
    widthBlocks: parseInteger(raw.widthBlocks, `${raw.id}.widthBlocks`),
    heightBlocks: parseInteger(raw.heightBlocks, `${raw.id}.heightBlocks`),
    bgPatternBase: parseInteger(raw.bgPatternBase, `${raw.id}.bgPatternBase`) ?? 0,
    validationWindows: (raw.validationWindows || []).map(normalizeValidationWindow)
  };
}

function normalizeLayoutRoute(raw) {
  return {
    ...raw,
    segments: (raw.segments || []).map(normalizeSegmentRef)
  };
}

function loadLayoutSegmentFile(filePath = DEFAULT_LAYOUT_SEGMENTS_FILE) {
  const resolved = path.resolve(filePath);
  const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  const templates = {};
  for (const [id, template] of Object.entries(data.templates || {})) {
    templates[id] = normalizeLayoutTemplate(template, id);
  }
  return {
    ...data,
    filePath: resolved,
    templates,
    segments: (data.segments || []).map(normalizeLayoutSegment),
    routes: (data.routes || []).map(normalizeLayoutRoute)
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
    templates: file.templates,
    filePath: file.filePath
  };
}

function loadLayoutRoute(id, opts = {}) {
  const file = loadLayoutSegmentFile(opts.filePath);
  const route = file.routes.find((candidate) => candidate.id === id);
  if (!route) {
    throw new Error(`unknown layout route "${id}" in ${file.filePath}`);
  }
  return {
    ...route,
    templates: file.templates,
    segmentCatalog: file.segments,
    filePath: file.filePath
  };
}

function requireInteger(value, label) {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} is required`);
  }
  return value;
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

function hex(value, width = 4) {
  return `0x${toHex(value, width)}`;
}

function readBackgroundTableByte(rom, info, cpuAddress) {
  return readPrgByte(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readBackgroundTableWord(rom, info, cpuAddress) {
  return readPrgWord(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readByteList(rom, info, cpuAddress, count) {
  const bytes = [];
  for (let index = 0; index < count; index += 1) {
    bytes.push(hex(readBackgroundTableByte(rom, info, cpuAddress + index), 2));
  }
  return bytes;
}

function deriveLayoutContext(rom, info, segment) {
  const runtimeContext = segment.runtimeContext || {};
  const objset = requireInteger(runtimeContext.objset, `${segment.id}.runtimeContext.objset`);
  const area = requireInteger(runtimeContext.area, `${segment.id}.runtimeContext.area`);
  const submap = runtimeContext.submap ?? 0;
  const areaTablePointerAddress = AREA_TABLE_POINTERS + objset * 2;
  const areaTableAddress = readBackgroundTableWord(rom, info, areaTablePointerAddress);
  const areaRecordPointerAddress = areaTableAddress + area * 2;
  const areaRecordAddress = readBackgroundTableWord(rom, info, areaRecordPointerAddress);
  const screenRecordPointerAddress = areaRecordAddress + SCREEN_RECORD_POINTERS_OFFSET + submap * 2;
  const screenRecordAddress = readBackgroundTableWord(rom, info, screenRecordPointerAddress);
  const rawLayoutIndex = readBackgroundTableByte(rom, info, screenRecordAddress);
  const layoutIndex = segment.layoutIndexOverride ?? rawLayoutIndex;
  const layoutTablePointerAddress = LAYOUT_TABLE_POINTERS + objset * 2;
  const layoutTableAddress = readBackgroundTableWord(rom, info, layoutTablePointerAddress);
  const layoutHeaderPointerAddress = layoutTableAddress + layoutIndex * 4;
  const layoutHeaderAddress = segment.layoutHeaderAddress ?? readBackgroundTableWord(rom, info, layoutHeaderPointerAddress);
  const secondaryLayoutHeaderAddress = readBackgroundTableWord(rom, info, layoutHeaderPointerAddress + 2);
  const tileSetPointerAddress = TILE_SET_POINTERS + objset * 4;
  const tileSetAddress = segment.tileSetAddress ?? readBackgroundTableWord(rom, info, tileSetPointerAddress);
  const auxiliaryTileAddress = readBackgroundTableWord(rom, info, tileSetPointerAddress + 2);

  return {
    runtimeContext: { objset, area, submap },
    screenRecord: {
      pointerAddress: hex(screenRecordPointerAddress),
      address: hex(screenRecordAddress),
      firstBytes: readByteList(rom, info, screenRecordAddress, 8),
      rawLayoutIndex,
      rawLayoutIndexHex: hex(rawLayoutIndex, 2),
      layoutIndex,
      layoutIndexHex: hex(layoutIndex, 2),
      layoutIndexSource: segment.layoutIndexOverride == null ? 'screen-record-byte-0' : 'segment-override'
    },
    layoutTable: {
      pointerAddress: hex(layoutTablePointerAddress),
      address: hex(layoutTableAddress)
    },
    layoutHeader: {
      pointerAddress: hex(layoutHeaderPointerAddress),
      address: hex(layoutHeaderAddress),
      bank: layoutHeaderAddress < 0xc000 ? BACKGROUND_TABLE_BANK : undefined,
      secondaryAddress: hex(secondaryLayoutHeaderAddress)
    },
    tileSet: {
      pointerAddress: hex(tileSetPointerAddress),
      address: hex(tileSetAddress),
      auxiliaryAddress: hex(auxiliaryTileAddress)
    }
  };
}

function valueFromSegmentTemplate(segment, template, key) {
  return segment[key] ?? template?.[key];
}

function descriptorFromLayoutSegment(rom, info, segment, opts = {}) {
  if (segment.descriptor) {
    return {
      descriptor: loadBackgroundDescriptor(segment.descriptor, {
        filePath: opts.descriptorFile
      }),
      derivation: undefined
    };
  }

  const template = segment.template ? segment.templates?.[segment.template] : undefined;
  if (segment.template && !template) {
    throw new Error(`layout segment "${segment.id}" references unknown template "${segment.template}"`);
  }

  const derivation = deriveLayoutContext(rom, info, segment);
  const runtimeContext = {
    ...(template?.runtimeContext || {}),
    ...(segment.runtimeContext || {})
  };
  const chrBanks = segment.chrBanks || template?.chrBanks;
  const layoutHeaderAddress = valueFromSegmentTemplate(segment, template, 'layoutHeaderAddress') ??
    Number.parseInt(derivation.layoutHeader.address.slice(2), 16);
  const tileSetAddress = valueFromSegmentTemplate(segment, template, 'tileSetAddress') ??
    Number.parseInt(derivation.tileSet.address.slice(2), 16);

  return {
    derivation,
    descriptor: {
      id: `${segment.id}-derived`,
      label: segment.label,
      location: segment.location || segment.label,
      variant: valueFromSegmentTemplate(segment, template, 'variant'),
      access: valueFromSegmentTemplate(segment, template, 'access'),
      paletteMode: valueFromSegmentTemplate(segment, template, 'paletteMode'),
      renderer: valueFromSegmentTemplate(segment, template, 'renderer') || 'native-background-v1',
      runtimeContext: {
        ...runtimeContext,
        chrBanks
      },
      layoutHeaderAddress,
      layoutHeaderBank: valueFromSegmentTemplate(segment, template, 'layoutHeaderBank') ?? derivation.layoutHeader.bank,
      layoutBank: requireInteger(valueFromSegmentTemplate(segment, template, 'layoutBank'), `${segment.id}.layoutBank`),
      tileBank: requireInteger(valueFromSegmentTemplate(segment, template, 'tileBank'), `${segment.id}.tileBank`),
      tileSetAddress,
      paletteBank: valueFromSegmentTemplate(segment, template, 'paletteBank'),
      paletteAddress: requireInteger(valueFromSegmentTemplate(segment, template, 'paletteAddress'), `${segment.id}.paletteAddress`),
      paletteLength: valueFromSegmentTemplate(segment, template, 'paletteLength'),
      widthBlocks: requireInteger(valueFromSegmentTemplate(segment, template, 'widthBlocks'), `${segment.id}.widthBlocks`),
      heightBlocks: requireInteger(valueFromSegmentTemplate(segment, template, 'heightBlocks'), `${segment.id}.heightBlocks`)
    }
  };
}

function readLayoutHeaderInfo(rom, info, descriptor) {
  if (!Number.isInteger(descriptor.layoutHeaderAddress)) {
    throw new Error(`descriptor "${descriptor.id}" is missing layoutHeaderAddress`);
  }

  const readOpts = descriptor.layoutHeaderBank == null ? {} : { bank: descriptor.layoutHeaderBank };
  const columns = readPrgByte(rom, info, descriptor.layoutHeaderAddress, readOpts);
  const rows = readPrgByte(rom, info, descriptor.layoutHeaderAddress + 1, readOpts);
  if (!Number.isInteger(columns) || columns <= 0 || columns > 8) {
    throw new Error(`layout header ${hex(descriptor.layoutHeaderAddress)} has unsupported column count ${columns}`);
  }
  if (!Number.isInteger(rows) || rows <= 0 || rows > 8) {
    throw new Error(`layout header ${hex(descriptor.layoutHeaderAddress)} has unsupported row count ${rows}`);
  }

  return {
    address: hex(descriptor.layoutHeaderAddress),
    bank: descriptor.layoutHeaderBank,
    columns,
    rows,
    totalPointers: columns * rows,
    pointerBaseAddress: descriptor.layoutHeaderAddress + 2,
    readOpts
  };
}

function layoutPointerInfo(rom, info, descriptor, section, columnGroup) {
  const header = readLayoutHeaderInfo(rom, info, descriptor);
  const pointerIndex = section * header.columns + columnGroup;
  if (section < 0 || section >= header.rows) {
    throw new Error(
      `layout section ${section} is outside 0-${header.rows - 1} for descriptor "${descriptor.id}"`
    );
  }
  if (columnGroup < 0 || columnGroup >= header.columns) {
    throw new Error(
      `column group ${columnGroup} is outside 0-${header.columns - 1} for descriptor "${descriptor.id}"`
    );
  }

  const pointerAddress = header.pointerBaseAddress + pointerIndex * 2;
  return {
    layoutHeader: {
      columns: header.columns,
      rows: header.rows,
      totalPointers: header.totalPointers
    },
    pointersPerSection: header.columns,
    pointerIndex,
    pointerAddress,
    layoutAddress: readPrgWord(rom, info, pointerAddress, header.readOpts)
  };
}

function layoutSectionsForSegment(segment, header) {
  if (segment.layoutSections?.length) {
    return segment.layoutSections;
  }
  if (segment.renderAllSections) {
    return Array.from({ length: header.rows }, (_, index) => index);
  }
  return [segment.layoutSection ?? 0];
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
  const { descriptor, derivation } = descriptorFromLayoutSegment(rom, info, segment, opts);
  const header = readLayoutHeaderInfo(rom, info, descriptor);
  const columnGroups = segment.columnGroups;
  const layoutSections = layoutSectionsForSegment(segment, header);
  if (!columnGroups.length) {
    throw new Error(`layout segment "${segment.id}" must define at least one column group`);
  }
  if (!layoutSections.length) {
    throw new Error(`layout segment "${segment.id}" must define at least one layout section`);
  }

  const groupWidthBlocks = segment.widthBlocks || descriptor.widthBlocks;
  const heightBlocks = segment.heightBlocks || descriptor.heightBlocks;
  if (groupWidthBlocks !== descriptor.widthBlocks) {
    throw new Error(
      `layout segment "${segment.id}" widthBlocks ${groupWidthBlocks} must currently match descriptor widthBlocks ${descriptor.widthBlocks}`
    );
  }

  const widthBlocks = groupWidthBlocks * columnGroups.length;
  const renderedHeightBlocks = heightBlocks * layoutSections.length;
  const width = widthBlocks * BLOCK_SIZE;
  const height = renderedHeightBlocks * BLOCK_SIZE;
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

  layoutSections.forEach((layoutSection, sectionIndex) => {
    columnGroups.forEach((columnGroup, columnIndex) => {
      const pointer = layoutPointerInfo(rom, info, descriptor, layoutSection, columnGroup);
      const layoutBytes = [];
      for (let blockRow = 0; blockRow < heightBlocks; blockRow += 1) {
        const row = [];
        for (let blockColumn = 0; blockColumn < groupWidthBlocks; blockColumn += 1) {
          const blockIndex = readBlockIndex(rom, info, descriptor, pointer.layoutAddress, blockRow, blockColumn);
          row.push(blockIndex);
          renderBlock(
            rgba,
            renderState,
            descriptor,
            blockIndex,
            columnIndex * groupWidthBlocks + blockColumn,
            sectionIndex * heightBlocks + blockRow
          );
        }
        layoutBytes.push(row);
      }

      columns.push({
        index: columns.length,
        section: layoutSection,
        sectionIndex,
        columnGroup,
        columnIndex,
        x: columnIndex * groupWidthBlocks * BLOCK_SIZE,
        y: sectionIndex * heightBlocks * BLOCK_SIZE,
        width: groupWidthBlocks * BLOCK_SIZE,
        height: heightBlocks * BLOCK_SIZE,
        pointersPerSection: pointer.pointersPerSection,
        layoutPointerIndex: pointer.pointerIndex,
        layoutPointerAddress: `0x${toHex(pointer.pointerAddress)}`,
        layoutAddress: `0x${toHex(pointer.layoutAddress)}`,
        layoutBytes
      });
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
      status: segment.status || 'unknown',
      validation: segment.validation,
      template: segment.template,
      descriptor: descriptor.id,
      descriptorLabel: descriptor.label,
      variant: descriptor.variant,
      access: descriptor.access,
      paletteMode: descriptor.paletteMode,
      runtimeContext: descriptor.runtimeContext,
      layoutSection: layoutSections.length === 1 ? layoutSections[0] : undefined,
      layoutSections,
      layoutGrid: {
        columns: header.columns,
        rows: header.rows,
        renderedColumns: columnGroups.length,
        renderedRows: layoutSections.length,
        totalPointers: header.totalPointers
      },
      columnGroups,
      blockSize: BLOCK_SIZE,
      widthBlocks,
      heightBlocks: renderedHeightBlocks,
      sectionHeightBlocks: heightBlocks,
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
      derivation,
      columns
    }
  };
}

function copyRenderedSegment(destRgba, routeWidth, rendered, destX, destY) {
  for (let y = 0; y < rendered.height; y += 1) {
    const sourceStart = y * rendered.width * 4;
    const destStart = ((destY + y) * routeWidth + destX) * 4;
    rendered.rgba.copy(destRgba, destStart, sourceStart, sourceStart + rendered.width * 4);
  }
}

function renderLayoutRoute(rom, info, route, opts = {}) {
  const segmentCatalog = route.segmentCatalog || [];
  const segmentById = new Map(segmentCatalog.map((segment) => [segment.id, segment]));
  const gapPixels = route.gapPixels || 0;
  const renderedSegments = [];
  let cursorX = 0;
  let minY = 0;
  let maxY = 0;

  for (let index = 0; index < route.segments.length; index += 1) {
    const ref = route.segments[index];
    const segment = segmentById.get(ref.segment);
    if (!segment) {
      throw new Error(`layout route "${route.id}" references unknown segment "${ref.segment}"`);
    }
    const rendered = renderLayoutSegment(rom, info, {
      ...segment,
      templates: route.templates
    }, opts);
    const x = ref.x ?? cursorX;
    const y = ref.y ?? 0;
    renderedSegments.push({
      ref,
      rendered,
      x,
      y
    });
    cursorX = Math.max(cursorX, x + rendered.width + gapPixels);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y + rendered.height);
  }

  const width = renderedSegments.reduce((max, entry) => Math.max(max, entry.x + entry.rendered.width), 0);
  const height = maxY - minY;
  const rgba = Buffer.alloc(width * height * 4);
  const segments = [];

  for (const entry of renderedSegments) {
    const destY = entry.y - minY;
    copyRenderedSegment(rgba, width, entry.rendered, entry.x, destY);
    segments.push({
      id: entry.rendered.metadata.id,
      label: entry.rendered.metadata.label,
      status: entry.ref.status || entry.rendered.metadata.status,
      validation: entry.ref.validation || entry.rendered.metadata.validation,
      position: {
        x: entry.x,
        y: destY,
        width: entry.rendered.width,
        height: entry.rendered.height
      },
      layoutSections: entry.rendered.metadata.layoutSections,
      layoutGrid: entry.rendered.metadata.layoutGrid,
      columnGroups: entry.rendered.metadata.columnGroups,
      layoutHeaderAddress: entry.rendered.metadata.layoutHeaderAddress,
      layoutHeaderBank: entry.rendered.metadata.layoutHeaderBank,
      tileSetAddress: entry.rendered.metadata.tileSetAddress,
      paletteAddress: entry.rendered.metadata.paletteAddress,
      runtimeContext: entry.rendered.metadata.runtimeContext,
      derivation: entry.rendered.metadata.derivation,
      columns: entry.rendered.metadata.columns
    });
  }

  return {
    width,
    height,
    rgba,
    metadata: {
      id: route.id,
      label: route.label,
      summary: route.summary,
      source: 'rom-native-layout-route',
      width,
      height,
      gapPixels,
      segments
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

function renderLayoutRoutePng(rom, info, route, output, opts = {}) {
  const rendered = renderLayoutRoute(rom, info, route, opts);
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
  deriveLayoutContext,
  loadLayoutSegment,
  loadLayoutSegmentFile,
  loadLayoutRoute,
  readLayoutHeaderInfo,
  renderLayoutSegment,
  renderLayoutSegmentPng,
  renderLayoutRoute,
  renderLayoutRoutePng
};
