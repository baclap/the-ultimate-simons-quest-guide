'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte } = require('./background');
const { BACKGROUND_TABLE_BANK } = require('./background-context');
const { renderLayoutSegment } = require('./layout-segments');
const { readBackgroundPalette, CHR_4KB_BANK_SIZE } = require('./native-image');
const { readPng } = require('./png');

const BLOCK_SIZE = 32;
const BLOCK_TILES = 4;
const TILE_SIZE = 8;
const CHR_PAIR_BYTES = CHR_4KB_BANK_SIZE * 2;
const METATILE_COUNT = 256;
const METATILE_TILE_BYTES = METATILE_COUNT * 16;
const METATILE_ATTRIBUTE_BYTES = METATILE_COUNT;

function parseHex(value) {
  if (Number.isInteger(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    throw new Error(`expected hex string, got ${value}`);
  }
  return value.startsWith('0x') || value.startsWith('0X')
    ? Number.parseInt(value.slice(2), 16)
    : Number.parseInt(value, 10);
}

function appendChunk(chunks, buffer) {
  const offset = chunks.reduce((total, chunk) => total + chunk.length, 0);
  chunks.push(Buffer.from(buffer));
  return { offset, length: buffer.length };
}

function readPrgBytes(rom, info, cpuAddress, length, opts = {}) {
  const buffer = Buffer.alloc(length);
  for (let index = 0; index < length; index += 1) {
    buffer[index] = readPrgByte(rom, info, cpuAddress + index, opts);
  }
  return buffer;
}

function readChrPair(rom, info, chrBanks) {
  if (!Array.isArray(chrBanks) || chrBanks.length !== 2) {
    throw new Error(`expected exactly two CHR banks, got ${chrBanks}`);
  }
  const buffer = Buffer.alloc(CHR_PAIR_BYTES);
  chrBanks.forEach((bank, index) => {
    const sourceStart = info.chrStart + bank * CHR_4KB_BANK_SIZE;
    rom.copy(buffer, index * CHR_4KB_BANK_SIZE, sourceStart, sourceStart + CHR_4KB_BANK_SIZE);
  });
  return buffer;
}

function segmentFromEntry(entry) {
  const recipe = entry.recipe;
  if (!recipe || recipe.status === 'blocked') {
    throw new Error(`${entry.id} is missing a usable render recipe`);
  }
  const layoutContext = recipe.layoutContext;
  const palette = recipe.palette;
  return {
    id: entry.id,
    label: recipe.label,
    location: entry.name,
    variant: entry.variant,
    access: entry.access,
    paletteMode: entry.variant,
    status: recipe.status,
    validation: recipe.statusDetail,
    runtimeContext: {
      objset: parseHex(layoutContext.objset),
      area: parseHex(layoutContext.area),
      submap: parseHex(layoutContext.submap || '0x00')
    },
    layoutIndexOverride: entry.screenRecord.layoutIndexSource === 'screen-record-byte-0'
      ? undefined
      : parseHex(entry.screenRecord.layoutIndex),
    renderAllSections: true,
    columnGroups: entry.columnGroups,
    bgPatternBase: 0,
    template: recipe.id,
    templates: {
      [recipe.id]: {
        id: recipe.id,
        label: recipe.label,
        variant: entry.variant,
        access: entry.access,
        paletteMode: entry.variant,
        renderer: 'native-background-v1',
        chrBanks: recipe.chrBanks.map(parseHex),
        layoutBank: BACKGROUND_TABLE_BANK,
        tileBank: 4,
        paletteBank: palette.bank,
        paletteAddress: parseHex(palette.address),
        widthBlocks: recipe.widthBlocks,
        heightBlocks: recipe.heightBlocks,
        rowsPerLayoutSection: recipe.rowsPerLayoutSection
      }
    }
  };
}

function columnLayoutToBlocks(metadata) {
  const blockWidth = metadata.widthBlocks;
  const blockHeight = metadata.heightBlocks;
  const blocks = Buffer.alloc(blockWidth * blockHeight);
  for (const column of metadata.columns) {
    column.layoutBytes.forEach((row, rowIndex) => {
      row.forEach((block, blockIndex) => {
        const x = column.columnIndex * metadata.groupWidthBlocks + blockIndex;
        const y = column.sectionIndex * metadata.sectionHeightBlocks + rowIndex;
        blocks[y * blockWidth + x] = block;
      });
    });
  }
  return { blockWidth, blockHeight, blocks };
}

function cropBlocks(blockMatrix, crop) {
  if (!crop) {
    return {
      blockWidth: blockMatrix.blockWidth,
      blockHeight: blockMatrix.blockHeight,
      blocks: blockMatrix.blocks,
      crop: null
    };
  }
  for (const key of ['x', 'y', 'width', 'height']) {
    if (crop[key] % BLOCK_SIZE !== 0) {
      throw new Error(`crop.${key} must be a multiple of ${BLOCK_SIZE}`);
    }
  }
  const cropX = crop.x / BLOCK_SIZE;
  const cropY = crop.y / BLOCK_SIZE;
  const cropWidth = crop.width / BLOCK_SIZE;
  const cropHeight = crop.height / BLOCK_SIZE;
  const blocks = Buffer.alloc(cropWidth * cropHeight);
  for (let y = 0; y < cropHeight; y += 1) {
    for (let x = 0; x < cropWidth; x += 1) {
      blocks[y * cropWidth + x] = blockMatrix.blocks[(cropY + y) * blockMatrix.blockWidth + cropX + x];
    }
  }
  return {
    blockWidth: cropWidth,
    blockHeight: cropHeight,
    blocks,
    crop: { ...crop }
  };
}

function compareRgbaWithYOffset(rendered, validation) {
  const capture = readPng(validation.capture);
  const width = validation.width;
  const height = validation.height;
  const yOffset = validation.atlasYOffset || 0;
  let differingPixels = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const source = (y * rendered.width + x) * 4;
      const target = ((y + yOffset) * capture.width + x) * 4;
      if (
        rendered.rgba[source] !== capture.rgba[target] ||
        rendered.rgba[source + 1] !== capture.rgba[target + 1] ||
        rendered.rgba[source + 2] !== capture.rgba[target + 2]
      ) {
        differingPixels += 1;
      }
    }
  }
  return {
    capture: validation.capture,
    atlasYOffset: yOffset,
    width,
    height,
    differingPixels,
    requiredDifferingPixels: validation.requiredDifferingPixels
  };
}

function readMetatileSet(rom, info, metadata) {
  const tileBank = metadata.tileBank;
  const tileSetAddress = parseHex(metadata.tileSetAddress);
  const tileBaseAddress = parseHex(metadata.tileBaseAddress);
  return {
    tileBank,
    tileSetAddress,
    tileBaseAddress,
    metatileTiles: readPrgBytes(rom, info, tileBaseAddress, METATILE_TILE_BYTES, { bank: tileBank }),
    metatileAttributes: readPrgBytes(rom, info, tileSetAddress + 1, METATILE_ATTRIBUTE_BYTES, { bank: tileBank })
  };
}

function paletteBytesFromEntry(rom, info, entry) {
  const recipe = entry.recipe;
  return readBackgroundPalette(rom, info, {
    id: entry.id,
    paletteBank: recipe.palette.bank,
    paletteAddress: parseHex(recipe.palette.address)
  });
}

function buildGuideSlice(rom, info, opts) {
  const slicePath = path.resolve(opts.sliceFile);
  const atlasPath = path.resolve(opts.atlasFile);
  const outDir = path.resolve(opts.outDir);
  const sliceConfig = JSON.parse(fs.readFileSync(slicePath, 'utf8'));
  const atlas = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
  const entriesById = new Map(atlas.entries.map((entry) => [entry.id, entry]));
  const chunks = [];
  const chrSets = [];
  const chrSetByKey = new Map();
  const tileSets = [];
  const tileSetByKey = new Map();
  const palettes = [];
  const segments = [];
  const validations = [];

  function addChrSet(chrBanks) {
    const key = chrBanks.join('-');
    if (chrSetByKey.has(key)) {
      return chrSetByKey.get(key);
    }
    const id = `chr-${chrBanks.map((bank) => bank.toString(16).padStart(2, '0')).join('-')}`;
    const chunk = appendChunk(chunks, readChrPair(rom, info, chrBanks));
    const record = {
      id,
      banks: chrBanks.map((bank) => `0x${bank.toString(16).toUpperCase().padStart(2, '0')}`),
      data: chunk,
      decodedAtlas: {
        width: 128,
        height: 256,
        tilesPerRow: 16,
        tileCount: 512
      }
    };
    chrSets.push(record);
    chrSetByKey.set(key, record);
    return record;
  }

  function addTileSet(metadata) {
    const raw = readMetatileSet(rom, info, metadata);
    const key = [raw.tileBank, raw.tileSetAddress, raw.tileBaseAddress].join(':');
    if (tileSetByKey.has(key)) {
      return tileSetByKey.get(key);
    }
    const id = `tiles-${raw.tileBank}-${raw.tileSetAddress.toString(16)}-${raw.tileBaseAddress.toString(16)}`;
    const tiles = appendChunk(chunks, raw.metatileTiles);
    const attributes = appendChunk(chunks, raw.metatileAttributes);
    const record = {
      id,
      tileBank: raw.tileBank,
      tileSetAddress: `0x${raw.tileSetAddress.toString(16).toUpperCase().padStart(4, '0')}`,
      tileBaseAddress: `0x${raw.tileBaseAddress.toString(16).toUpperCase().padStart(4, '0')}`,
      metatileTiles: tiles,
      metatileAttributes: attributes
    };
    tileSets.push(record);
    tileSetByKey.set(key, record);
    return record;
  }

  function addPalette(segmentId, variant, entry) {
    const bytes = paletteBytesFromEntry(rom, info, entry);
    const chunk = appendChunk(chunks, bytes);
    const record = {
      id: `${segmentId}-${variant}`,
      segmentId,
      variant,
      paletteAddress: entry.recipe.palette.address,
      paletteBank: entry.recipe.palette.bank,
      data: chunk
    };
    palettes.push(record);
    return record;
  }

  for (const segmentConfig of sliceConfig.segments) {
    const dayEntry = entriesById.get(`${segmentConfig.locationId}-day`);
    const nightEntry = entriesById.get(`${segmentConfig.locationId}-night`);
    if (!dayEntry || !nightEntry) {
      throw new Error(`${segmentConfig.locationId} must have day and night atlas entries`);
    }
    if (dayEntry.renderStatus !== 'rendered' || nightEntry.renderStatus !== 'rendered') {
      throw new Error(`${segmentConfig.locationId} day and night entries must be rendered`);
    }

    const daySegment = segmentFromEntry(dayEntry);
    const rendered = renderLayoutSegment(rom, info, daySegment);
    const blockMatrix = cropBlocks(columnLayoutToBlocks(rendered.metadata), segmentConfig.crop);
    const chrSet = addChrSet(daySegment.templates[daySegment.template].chrBanks);
    const tileSet = addTileSet(rendered.metadata);
    const layoutBlocks = appendChunk(chunks, blockMatrix.blocks);
    const dayPalette = addPalette(segmentConfig.id, 'day', dayEntry);
    const nightPalette = addPalette(segmentConfig.id, 'night', nightEntry);

    if (segmentConfig.validation) {
      const validation = compareRgbaWithYOffset(rendered, segmentConfig.validation);
      validations.push({
        segmentId: segmentConfig.id,
        ...validation
      });
      if (validation.differingPixels !== validation.requiredDifferingPixels) {
        throw new Error(
          `${segmentConfig.id} validation expected ${validation.requiredDifferingPixels} differing pixels, got ${validation.differingPixels}`
        );
      }
    }

    segments.push({
      id: segmentConfig.id,
      locationId: segmentConfig.locationId,
      label: segmentConfig.label || dayEntry.name,
      sourceName: dayEntry.name,
      position: {
        x: segmentConfig.x,
        y: segmentConfig.y,
        width: blockMatrix.blockWidth * BLOCK_SIZE,
        height: blockMatrix.blockHeight * BLOCK_SIZE
      },
      blockSize: BLOCK_SIZE,
      tileSize: TILE_SIZE,
      blockWidth: blockMatrix.blockWidth,
      blockHeight: blockMatrix.blockHeight,
      tileWidth: blockMatrix.blockWidth * BLOCK_TILES,
      tileHeight: blockMatrix.blockHeight * BLOCK_TILES,
      crop: blockMatrix.crop,
      chrSet: chrSet.id,
      tileSet: tileSet.id,
      layoutBlocks,
      palettes: {
        day: dayPalette.id,
        night: nightPalette.id
      },
      atlasEntries: {
        day: dayEntry.id,
        night: nightEntry.id
      },
      recipeStatus: {
        day: dayEntry.recipe.status,
        night: nightEntry.recipe.status
      },
      provenance: {
        pixels: sliceConfig.provenance?.pixels || 'rom-derived',
        layout: sliceConfig.provenance?.layout || 'presentation-authored',
        binary: 'rom-derived-tile-data'
      }
    });
  }

  const world = segments.reduce((bounds, segment) => ({
    width: Math.max(bounds.width, segment.position.x + segment.position.width),
    height: Math.max(bounds.height, segment.position.y + segment.position.height)
  }), { width: 0, height: 0 });

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const data = Buffer.concat(chunks);
  const dataFile = path.join(outDir, 'slice-data.bin');
  fs.writeFileSync(dataFile, data);

  const manifest = {
    schemaVersion: 1,
    id: sliceConfig.id,
    label: sliceConfig.label,
    summary: sliceConfig.summary,
    source: {
      sliceConfig: path.relative(process.cwd(), slicePath),
      atlas: path.relative(process.cwd(), atlasPath),
      renderer: 'rust-wasm-webgl-tilemap-v1',
      notes: [
        'Pixels are rendered in the browser from ROM-derived CHR, layout, metatile, and palette bytes.',
        'Presentation coordinates are authored for player readability and are not ROM world coordinates.',
        'No PNG map textures are emitted for this app slice.'
      ]
    },
    provenance: sliceConfig.provenance,
    world,
    dataFile: 'slice-data.bin',
    byteLength: data.length,
    chrSets,
    tileSets,
    palettes,
    segments,
    validations
  };
  const manifestPath = path.join(outDir, 'slice.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  return {
    output: outDir,
    manifest: manifestPath,
    dataFile,
    byteLength: data.length,
    summary: {
      segments: segments.length,
      chrSets: chrSets.length,
      tileSets: tileSets.length,
      palettes: palettes.length,
      validations: validations.length,
      world
    }
  };
}

module.exports = {
  buildGuideSlice
};
