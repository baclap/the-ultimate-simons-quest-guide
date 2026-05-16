'use strict';

const path = require('path');
const { CHR_BANK_SIZE } = require('./ines');
const { colorFromNesIndex } = require('./palette');
const { writePng } = require('./png');

const TILE_SIZE = 8;
const TILE_BYTES = 16;
const TILES_PER_BANK = CHR_BANK_SIZE / TILE_BYTES;
const DEFAULT_TILE_PALETTE = [0x0f, 0x00, 0x10, 0x30];

function decodeTile(buffer, tileOffset) {
  const pixels = new Uint8Array(TILE_SIZE * TILE_SIZE);
  for (let y = 0; y < TILE_SIZE; y += 1) {
    const low = buffer[tileOffset + y];
    const high = buffer[tileOffset + y + 8];
    for (let x = 0; x < TILE_SIZE; x += 1) {
      const bit = 7 - x;
      pixels[y * TILE_SIZE + x] = ((low >> bit) & 1) | (((high >> bit) & 1) << 1);
    }
  }
  return pixels;
}

function writeScaledPixel(rgba, width, x, y, scale, rgb) {
  for (let sy = 0; sy < scale; sy += 1) {
    for (let sx = 0; sx < scale; sx += 1) {
      const offset = ((y + sy) * width + x + sx) * 4;
      rgba[offset] = rgb[0];
      rgba[offset + 1] = rgb[1];
      rgba[offset + 2] = rgb[2];
      rgba[offset + 3] = 0xff;
    }
  }
}

function renderChrBank(buffer, info, bankIndex, opts = {}) {
  if (bankIndex < 0 || bankIndex >= info.chrRomBanks) {
    throw new Error(`CHR bank ${bankIndex} is outside 0-${info.chrRomBanks - 1}`);
  }

  const outDir = opts.outDir || path.join('out', 'chr');
  const scale = opts.scale || 1;
  const columns = opts.columns || 16;
  const rows = Math.ceil(TILES_PER_BANK / columns);
  const width = columns * TILE_SIZE * scale;
  const height = rows * TILE_SIZE * scale;
  const rgba = Buffer.alloc(width * height * 4);
  const bankOffset = info.chrStart + bankIndex * CHR_BANK_SIZE;

  for (let tileIndex = 0; tileIndex < TILES_PER_BANK; tileIndex += 1) {
    const tileOffset = bankOffset + tileIndex * TILE_BYTES;
    const tile = decodeTile(buffer, tileOffset);
    const tileX = (tileIndex % columns) * TILE_SIZE * scale;
    const tileY = Math.floor(tileIndex / columns) * TILE_SIZE * scale;

    for (let y = 0; y < TILE_SIZE; y += 1) {
      for (let x = 0; x < TILE_SIZE; x += 1) {
        const colorId = tile[y * TILE_SIZE + x];
        const rgb = colorFromNesIndex(DEFAULT_TILE_PALETTE[colorId]);
        writeScaledPixel(rgba, width, tileX + x * scale, tileY + y * scale, scale, rgb);
      }
    }
  }

  const file = path.join(outDir, `chr-bank-${bankIndex.toString(16).padStart(2, '0')}.png`);
  writePng(file, width, height, rgba);

  return {
    bank: bankIndex,
    file,
    offset: bankOffset,
    size: CHR_BANK_SIZE,
    width,
    height,
    scale,
    tiles: TILES_PER_BANK
  };
}

function renderChrBanks(buffer, info, opts = {}) {
  const outputs = [];
  for (let bankIndex = 0; bankIndex < info.chrRomBanks; bankIndex += 1) {
    outputs.push(renderChrBank(buffer, info, bankIndex, opts));
  }
  return outputs;
}

module.exports = {
  decodeTile,
  renderChrBank,
  renderChrBanks
};

