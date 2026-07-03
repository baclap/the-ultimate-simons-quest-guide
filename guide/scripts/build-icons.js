import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { writePng } = require('../../src/png');
const { colorFromNesIndex } = require('../../src/palette');

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const PUBLIC_DIR = path.join(ROOT, 'public');
const SLICE_DIR = path.join(PUBLIC_DIR, 'assets', 'slices', 'jova-to-berkeley');
const SLICE_JSON = path.join(SLICE_DIR, 'slice.json');
const SLICE_BIN = path.join(SLICE_DIR, 'slice-data.bin');
const ICON_DIR = path.join(PUBLIC_DIR, 'icons');

const TILE_SIZE = 8;
const BLOCK_TILES = 4;
const APP_ICON_CROP_INSET = 16;
const FAVICON_SOURCE_SIZE = 16;

function readRange(data, ref) {
  return data.subarray(ref.offset, ref.offset + ref.length);
}

function findById(records, id, label) {
  const record = records.find((candidate) => candidate.id === id);
  if (!record) {
    throw new Error(`missing ${label}: ${id}`);
  }
  return record;
}

function paletteBits(attribute, tileRow, tileCol) {
  const quadrant = (tileRow >= 2 ? 2 : 0) + (tileCol >= 2 ? 1 : 0);
  return (attribute >> (quadrant * 2)) & 0x03;
}

function decodePatternPixel(chr, tileIndex, x, y) {
  const tileOffset = tileIndex * 16;
  if (tileOffset + y + 8 >= chr.length) {
    return 0;
  }
  const low = chr[tileOffset + y];
  const high = chr[tileOffset + y + 8];
  const bit = 7 - x;
  return ((low >> bit) & 1) | (((high >> bit) & 1) << 1);
}

function setPixel(rgba, width, x, y, color, alpha = 0xff) {
  if (x < 0 || y < 0 || x >= width) {
    return;
  }
  const offset = (y * width + x) * 4;
  rgba[offset] = color[0];
  rgba[offset + 1] = color[1];
  rgba[offset + 2] = color[2];
  rgba[offset + 3] = alpha;
}

function readSegmentResources(slice, data, segmentId, variant = 'day') {
  const segment = findById(slice.segments, segmentId, 'segment');
  const chrSet = findById(slice.chrSets, segment.chrSet, 'CHR set');
  const tileSet = findById(slice.tileSets, segment.tileSet, 'tile set');
  const palette = findById(slice.palettes, segment.palettes[variant], 'palette');
  return {
    segment,
    chr: readRange(data, chrSet.data),
    metatileTiles: readRange(data, tileSet.metatileTiles),
    metatileAttributes: readRange(data, tileSet.metatileAttributes),
    layoutBlocks: readRange(data, segment.layoutBlocks),
    palette: readRange(data, palette.data)
  };
}

function numericByte(value) {
  if (typeof value === 'number') {
    return value & 0xff;
  }
  if (typeof value === 'string' && value.toLowerCase().startsWith('0x')) {
    return Number.parseInt(value.slice(2), 16) & 0xff;
  }
  return Number.parseInt(value, 10) & 0xff;
}

function renderSegment(slice, data, segmentId, variant = 'day') {
  const resources = readSegmentResources(slice, data, segmentId, variant);
  const { segment, chr, metatileTiles, metatileAttributes, layoutBlocks, palette } = resources;
  const width = segment.tileWidth * TILE_SIZE;
  const height = segment.tileHeight * TILE_SIZE;
  const rgba = Buffer.alloc(width * height * 4);

  for (let blockY = 0; blockY < segment.blockHeight; blockY += 1) {
    for (let blockX = 0; blockX < segment.blockWidth; blockX += 1) {
      const blockIndex = layoutBlocks[blockY * segment.blockWidth + blockX] || 0;
      const attribute = metatileAttributes[blockIndex] || 0;
      for (let tileRow = 0; tileRow < BLOCK_TILES; tileRow += 1) {
        for (let tileCol = 0; tileCol < BLOCK_TILES; tileCol += 1) {
          const tileIndex = metatileTiles[blockIndex * 16 + tileRow * BLOCK_TILES + tileCol] || 0;
          const paletteIndex = paletteBits(attribute, tileRow, tileCol);
          const paletteOffset = paletteIndex * 4;
          const tileBaseX = (blockX * BLOCK_TILES + tileCol) * TILE_SIZE;
          const tileBaseY = (blockY * BLOCK_TILES + tileRow) * TILE_SIZE;
          for (let py = 0; py < TILE_SIZE; py += 1) {
            for (let px = 0; px < TILE_SIZE; px += 1) {
              const colorIndex = decodePatternPixel(chr, tileIndex, px, py);
              const paletteEntry = colorIndex === 0 ? 0 : paletteOffset + colorIndex;
              const nesColor = palette[paletteEntry] ?? palette[0] ?? 0x0f;
              setPixel(rgba, width, tileBaseX + px, tileBaseY + py, colorFromNesIndex(nesColor));
            }
          }
        }
      }
    }
  }

  return { width, height, rgba };
}

function fillImage(width, height, color) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      setPixel(rgba, width, x, y, color);
    }
  }
  return { width, height, rgba };
}

function drawSpriteTile(image, chr, spritePalette, tileIndex, paletteIndex, destX, destY, flipHorizontal = false, flipVertical = false) {
  for (let py = 0; py < TILE_SIZE; py += 1) {
    for (let px = 0; px < TILE_SIZE; px += 1) {
      const sourceX = flipHorizontal ? TILE_SIZE - 1 - px : px;
      const sourceY = flipVertical ? TILE_SIZE - 1 - py : py;
      const colorIndex = decodePatternPixel(chr, tileIndex, sourceX, sourceY);
      if (colorIndex === 0) {
        continue;
      }
      const nesColor = spritePalette[paletteIndex * 4 + colorIndex] ?? spritePalette[0] ?? 0x0f;
      setPixel(image.rgba, image.width, destX + px, destY + py, colorFromNesIndex(nesColor));
    }
  }
}

function faviconFromNorthBridgeSkeletonHead(slice, data) {
  const actorClass = findById(slice.actorClasses, 'skeleton', 'actor class');
  const chrSet = findById(slice.chrSets, actorClass.chrSet, 'CHR set');
  const palette = findById(slice.spritePalettes, 'north-bridge-day-sprites', 'sprite palette');
  const chr = readRange(data, chrSet.data);
  const spritePalette = readRange(data, palette.data);
  const frame = actorClass.frames[0];
  const topSprites = frame.sprites.filter((sprite) => sprite.yOffset === -19);
  const image = fillImage(FAVICON_SOURCE_SIZE, FAVICON_SOURCE_SIZE, [0, 0, 0]);

  for (let index = topSprites.length - 1; index >= 0; index -= 1) {
    const sprite = topSprites[index];
    const tile = numericByte(sprite.tile);
    const paletteIndex = Number.isFinite(sprite.palette) ? sprite.palette : numericByte(sprite.attr) & 0x03;
    const tableOffset = tile & 0x01 ? 256 : 0;
    const baseTile = tableOffset + (tile & 0xfe);
    const topTile = sprite.flipVertical ? baseTile + 1 : baseTile;
    const bottomTile = sprite.flipVertical ? baseTile : baseTile + 1;
    const x = sprite.xOffset + 8;
    const y = sprite.yOffset + 19;

    drawSpriteTile(image, chr, spritePalette, topTile, paletteIndex, x, y, sprite.flipHorizontal, sprite.flipVertical);
    drawSpriteTile(image, chr, spritePalette, bottomTile, paletteIndex, x, y + 8, sprite.flipHorizontal, sprite.flipVertical);
  }

  return image;
}

function scaleNearest(image, targetWidth, targetHeight) {
  const rgba = Buffer.alloc(targetWidth * targetHeight * 4);
  for (let y = 0; y < targetHeight; y += 1) {
    const srcY = Math.min(image.height - 1, Math.floor(y * image.height / targetHeight));
    for (let x = 0; x < targetWidth; x += 1) {
      const srcX = Math.min(image.width - 1, Math.floor(x * image.width / targetWidth));
      const src = (srcY * image.width + srcX) * 4;
      const dest = (y * targetWidth + x) * 4;
      rgba[dest] = image.rgba[src];
      rgba[dest + 1] = image.rgba[src + 1];
      rgba[dest + 2] = image.rgba[src + 2];
      rgba[dest + 3] = image.rgba[src + 3];
    }
  }
  return { width: targetWidth, height: targetHeight, rgba };
}

function cropToSquare(image, inset = 0) {
  const size = Math.min(image.width, image.height);
  const cropSize = Math.max(1, size - inset * 2);
  const x = Math.floor((image.width - size) / 2) + inset;
  const y = Math.floor((image.height - size) / 2) + inset;
  return cropImage(image, x, y, cropSize, cropSize);
}

function centerScaledOnSquare(image, size, contentSize, background = [0, 0, 0]) {
  const output = fillImage(size, size, background);
  const scaled = scaleNearest(image, contentSize, contentSize);
  const startX = Math.floor((size - contentSize) / 2);
  const startY = Math.floor((size - contentSize) / 2);

  for (let y = 0; y < scaled.height; y += 1) {
    for (let x = 0; x < scaled.width; x += 1) {
      const src = (y * scaled.width + x) * 4;
      const dest = ((startY + y) * output.width + startX + x) * 4;
      output.rgba[dest] = scaled.rgba[src];
      output.rgba[dest + 1] = scaled.rgba[src + 1];
      output.rgba[dest + 2] = scaled.rgba[src + 2];
      output.rgba[dest + 3] = scaled.rgba[src + 3];
    }
  }

  return output;
}

function cropImage(image, x, y, width, height) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const srcX = x + col;
      const srcY = y + row;
      const src = (srcY * image.width + srcX) * 4;
      const dest = (row * width + col) * 4;
      rgba[dest] = image.rgba[src];
      rgba[dest + 1] = image.rgba[src + 1];
      rgba[dest + 2] = image.rgba[src + 2];
      rgba[dest + 3] = image.rgba[src + 3];
    }
  }
  return { width, height, rgba };
}

function writePngImage(filePath, image) {
  writePng(filePath, image.width, image.height, image.rgba);
}

function pngBuffer(image) {
  const temp = path.join(ICON_DIR, `.tmp-${image.width}.png`);
  writePngImage(temp, image);
  const bytes = readFileSync(temp);
  rmSync(temp, { force: true });
  return bytes;
}

function writeIco(filePath, images) {
  const pngs = images.map((image) => pngBuffer(image));
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + entrySize * images.length;
  let imageOffset = directorySize;
  const header = Buffer.alloc(directorySize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  images.forEach((image, index) => {
    const png = pngs[index];
    const entry = headerSize + index * entrySize;
    header[entry] = image.width >= 256 ? 0 : image.width;
    header[entry + 1] = image.height >= 256 ? 0 : image.height;
    header[entry + 2] = 0;
    header[entry + 3] = 0;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(imageOffset, entry + 12);
    imageOffset += png.length;
  });
  writeFileSync(filePath, Buffer.concat([header, ...pngs]));
}

const slice = JSON.parse(readFileSync(SLICE_JSON, 'utf8'));
const data = readFileSync(SLICE_BIN);
mkdirSync(ICON_DIR, { recursive: true });

const bodley = renderSegment(slice, data, 'bodley-mansion-door', 'day');
const bodleySource = cropToSquare(bodley, APP_ICON_CROP_INSET);
const faviconSource = faviconFromNorthBridgeSkeletonHead(slice, data);

const app180 = scaleNearest(bodleySource, 180, 180);
const app192 = scaleNearest(bodleySource, 192, 192);
const app512 = scaleNearest(bodleySource, 512, 512);
const appMaskable512 = scaleNearest(bodleySource, 512, 512);
const favicon16 = scaleNearest(faviconSource, 16, 16);
const favicon32 = scaleNearest(faviconSource, 32, 32);
const favicon48 = scaleNearest(faviconSource, 48, 48);

writePngImage(path.join(ICON_DIR, 'app-icon-180.png'), app180);
writePngImage(path.join(ICON_DIR, 'app-icon-192.png'), app192);
writePngImage(path.join(ICON_DIR, 'app-icon-512.png'), app512);
writePngImage(path.join(ICON_DIR, 'app-icon-maskable-512.png'), appMaskable512);
writePngImage(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), app180);
writePngImage(path.join(PUBLIC_DIR, 'apple-touch-icon-180x180.png'), app180);
writePngImage(path.join(PUBLIC_DIR, 'apple-touch-icon-precomposed.png'), app180);
writePngImage(path.join(PUBLIC_DIR, 'apple-touch-icon-180x180-precomposed.png'), app180);
writePngImage(path.join(ICON_DIR, 'favicon-16.png'), favicon16);
writePngImage(path.join(ICON_DIR, 'favicon-32.png'), favicon32);
writePngImage(path.join(ICON_DIR, 'favicon-48.png'), favicon48);
writeIco(path.join(PUBLIC_DIR, 'favicon.ico'), [favicon16, favicon32, favicon48]);

console.log('Wrote PWA icons and favicon assets to guide/public/icons and guide/public/favicon.ico');
