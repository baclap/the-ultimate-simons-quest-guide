'use strict';

const fs = require('fs');
const {
  readPrgByte,
  renderNativeBackgroundNametables,
  toHex
} = require('./background');
const { renderNametableFromMemory } = require('./ppu');

const CHR_4KB_BANK_SIZE = 0x1000;
const BACKGROUND_PALETTE_BYTES = 0x10;

function pageOrigin(page) {
  return {
    scrollX: (page & 0x01) * 256,
    scrollY: page >= 2 ? 240 : 0
  };
}

function buildPatternTableFromChrBanks(rom, info, chrBanks) {
  if (!Array.isArray(chrBanks) || chrBanks.length < 2) {
    throw new Error('descriptor runtimeContext.chrBanks must include two 4 KB CHR banks');
  }

  const totalBanks = info.chrRomSize / CHR_4KB_BANK_SIZE;
  const patterns = Buffer.alloc(CHR_4KB_BANK_SIZE * 2);
  for (let index = 0; index < 2; index += 1) {
    const bank = chrBanks[index];
    if (!Number.isInteger(bank) || bank < 0 || bank >= totalBanks) {
      throw new Error(`CHR bank ${bank} is outside 0-${totalBanks - 1}`);
    }
    const sourceStart = info.chrStart + bank * CHR_4KB_BANK_SIZE;
    rom.copy(patterns, index * CHR_4KB_BANK_SIZE, sourceStart, sourceStart + CHR_4KB_BANK_SIZE);
  }
  return patterns;
}

function readBackgroundPalette(rom, info, descriptor) {
  if (!Number.isInteger(descriptor.paletteAddress)) {
    throw new Error(`background descriptor "${descriptor.id}" is missing paletteAddress`);
  }

  const length = descriptor.paletteLength || BACKGROUND_PALETTE_BYTES;
  const bytes = Buffer.alloc(length);
  const readOpts = descriptor.paletteBank == null ? {} : { bank: descriptor.paletteBank };
  for (let offset = 0; offset < length; offset += 1) {
    bytes[offset] = readPrgByte(rom, info, descriptor.paletteAddress + offset, readOpts);
  }
  return bytes;
}

function renderNativeBackgroundImage(rom, info, opts = {}) {
  const descriptor = opts.descriptor;
  if (!descriptor) {
    throw new Error('descriptor is required');
  }

  const visiblePage = opts.visiblePage ??
    descriptor.defaultVisiblePage ??
    descriptor.validation?.[0]?.visiblePage ??
    descriptor.pages[0]?.page ??
    0;
  const state = opts.statePath ? JSON.parse(fs.readFileSync(opts.statePath, 'utf8')) : (opts.state || {});
  const patterns = buildPatternTableFromChrBanks(rom, info, descriptor.runtimeContext?.chrBanks);
  const palettes = readBackgroundPalette(rom, info, descriptor);
  const background = renderNativeBackgroundNametables(rom, info, opts);
  const renderOpts = {
    patterns,
    nametables: background.nametables,
    palettes,
    state,
    nametableIndex: opts.nametableIndex ?? visiblePage
  };

  if (opts.bgPatternBase != null) {
    renderOpts.bgPatternBase = opts.bgPatternBase;
  }

  if (opts.scrollX != null) {
    renderOpts.scrollX = opts.scrollX;
  }
  if (opts.scrollY != null) {
    renderOpts.scrollY = opts.scrollY;
  }
  if (!opts.statePath && !opts.state && opts.scrollX == null && opts.scrollY == null) {
    const origin = pageOrigin(visiblePage);
    renderOpts.scrollX = origin.scrollX;
    renderOpts.scrollY = origin.scrollY;
  }

  const image = renderNametableFromMemory(renderOpts);
  return {
    width: image.width,
    height: image.height,
    rgba: image.rgba,
    metadata: {
      source: 'rom-native-background',
      descriptor: descriptor.id,
      visiblePage,
      chrBanks: descriptor.runtimeContext.chrBanks,
      paletteAddress: `0x${toHex(descriptor.paletteAddress)}`,
      paletteBank: descriptor.paletteBank,
      paletteBytes: [...palettes].map((value) => `0x${toHex(value, 2)}`),
      image: image.metadata,
      background: background.metadata
    }
  };
}

module.exports = {
  BACKGROUND_PALETTE_BYTES,
  CHR_4KB_BANK_SIZE,
  buildPatternTableFromChrBanks,
  readBackgroundPalette,
  renderNativeBackgroundImage
};
