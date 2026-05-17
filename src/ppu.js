'use strict';

const fs = require('fs');
const path = require('path');
const { colorFromNesIndex } = require('./palette');
const { readPng, writePng } = require('./png');

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const TILE_SIZE = 8;
const TILES_PER_ROW = 32;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function decodePatternPixel(patterns, tileIndex, tableBase, x, y) {
  const tileOffset = tableBase + tileIndex * 16;
  const low = patterns[tileOffset + y];
  const high = patterns[tileOffset + y + 8];
  const bit = 7 - x;
  return ((low >> bit) & 1) | (((high >> bit) & 1) << 1);
}

function bgPaletteColor(palettes, paletteIndex, colorId) {
  const nesColor = colorId === 0
    ? palettes[0]
    : palettes[(paletteIndex * 4) + colorId];
  return colorFromNesIndex(nesColor || 0);
}

function spritePaletteColor(palettes, paletteIndex, colorId) {
  const nesColor = palettes[0x10 + (paletteIndex * 4) + colorId];
  return colorFromNesIndex(nesColor || 0);
}

function attributePaletteIndex(attributeByte, tileX, tileY) {
  const quadrantX = Math.floor((tileX % 4) / 2);
  const quadrantY = Math.floor((tileY % 4) / 2);
  const shift = (quadrantY * 2 + quadrantX) * 2;
  return (attributeByte >> shift) & 0x03;
}

function renderNametableFromMemory(opts) {
  const patterns = opts.patterns;
  const nametables = opts.nametables;
  const palettes = opts.palettes;
  const state = opts.state || {};
  const scrollState = opts.scrollState || state.ppuTmpVideoRamAddr || state.ppuVideoRamAddr || 0;
  const nametableIndex = opts.nametableIndex ?? ((scrollState >> 10) & 0x03);
  const bgPatternBase = opts.bgPatternBase ?? (state.ppuBackgroundPatternAddr ?? (((state.cpu2000 || 0) & 0x10) ? 0x1000 : 0x0000));
  const fineX = opts.fineX ?? (state.ppuXScroll || 0);
  const coarseX = scrollState & 0x1f;
  const coarseY = (scrollState >> 5) & 0x1f;
  const nametableX = (scrollState >> 10) & 0x01;
  const nametableY = (scrollState >> 11) & 0x01;
  const fineY = (scrollState >> 12) & 0x07;
  const scrollX = opts.scrollX ?? ((nametableX * 256) + (coarseX * 8) + fineX);
  const scrollY = opts.scrollY ?? ((nametableY * 240) + (Math.min(coarseY, 29) * 8) + fineY);
  const rgba = Buffer.alloc(SCREEN_WIDTH * SCREEN_HEIGHT * 4);
  const opaque = new Uint8Array(SCREEN_WIDTH * SCREEN_HEIGHT);

  for (let screenY = 0; screenY < SCREEN_HEIGHT; screenY += 1) {
    for (let screenX = 0; screenX < SCREEN_WIDTH; screenX += 1) {
      const worldX = scrollX + screenX;
      const worldY = scrollY + screenY;
      const viewportNametableX = Math.floor(worldX / 256) & 0x01;
      const viewportNametableY = Math.floor(worldY / 240) & 0x01;
      const viewportNametableIndex = (viewportNametableY * 2) + viewportNametableX;
      const nametableOffset = viewportNametableIndex * 0x400;
      const localX = worldX % 256;
      const localY = worldY % 240;
      const tileX = Math.floor(localX / TILE_SIZE);
      const tileY = Math.floor(localY / TILE_SIZE);
      const tileIndex = nametables[nametableOffset + tileY * TILES_PER_ROW + tileX];
      const attributeOffset = nametableOffset + 0x3c0 + Math.floor(tileY / 4) * 8 + Math.floor(tileX / 4);
      const paletteIndex = attributePaletteIndex(nametables[attributeOffset], tileX, tileY);
      const colorId = decodePatternPixel(patterns, tileIndex, bgPatternBase, localX % TILE_SIZE, localY % TILE_SIZE);
      const rgb = bgPaletteColor(palettes, paletteIndex, colorId);
      const pixel = screenY * SCREEN_WIDTH + screenX;
      const out = pixel * 4;
      opaque[pixel] = colorId === 0 ? 0 : 1;
      rgba[out] = rgb[0];
      rgba[out + 1] = rgb[1];
      rgba[out + 2] = rgb[2];
      rgba[out + 3] = 0xff;
    }
  }

  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    rgba,
    opaque,
    metadata: {
      nametableIndex,
      bgPatternBase,
      scrollState,
      fineX,
      scrollX,
      scrollY,
      state
    }
  };
}

function renderNametable(opts) {
  return renderNametableFromMemory({
    ...opts,
    patterns: fs.readFileSync(opts.patternsPath),
    nametables: fs.readFileSync(opts.nametablesPath),
    palettes: fs.readFileSync(opts.palettesPath),
    state: opts.statePath ? readJson(opts.statePath) : {}
  });
}

function renderSprites(opts) {
  const patterns = fs.readFileSync(opts.patternsPath);
  const palettes = fs.readFileSync(opts.palettesPath);
  const oam = fs.readFileSync(opts.oamPath);
  const state = opts.statePath ? readJson(opts.statePath) : {};
  const background = opts.background;
  const backgroundOpaque = background && background.opaque;
  const spritePatternBase = opts.spritePatternBase ?? (state.ppuSpritePatternAddr ?? (((state.cpu2000 || 0) & 0x08) ? 0x1000 : 0x0000));
  const largeSprites = Boolean(state.ppuLargeSprites);
  const spritesEnabled = state.ppuSpritesEnabled !== false;
  const spriteHeight = largeSprites ? 16 : 8;
  const spriteRgba = Buffer.alloc(SCREEN_WIDTH * SCREEN_HEIGHT * 4);
  const compositeRgba = background
    ? Buffer.from(background.rgba)
    : Buffer.alloc(SCREEN_WIDTH * SCREEN_HEIGHT * 4);
  let visibleSprites = 0;
  let drawnPixels = 0;

  if (spritesEnabled) {
    for (let spriteIndex = 63; spriteIndex >= 0; spriteIndex -= 1) {
      const base = spriteIndex * 4;
      const y = oam[base] + 1;
      const tileIndex = oam[base + 1];
      const attributes = oam[base + 2];
      const x = oam[base + 3];
      const paletteIndex = attributes & 0x03;
      const priorityBehindBackground = (attributes & 0x20) !== 0;
      const flipHorizontal = (attributes & 0x40) !== 0;
      const flipVertical = (attributes & 0x80) !== 0;
      let spriteDrewPixel = false;

      for (let row = 0; row < spriteHeight; row += 1) {
        const screenY = y + row;
        if (screenY < 0 || screenY >= SCREEN_HEIGHT) {
          continue;
        }

        const patternY = flipVertical ? (spriteHeight - 1 - row) : row;
        let tableBase = spritePatternBase;
        let patternTile = tileIndex;
        let tileY = patternY;

        if (largeSprites) {
          tableBase = (tileIndex & 0x01) ? 0x1000 : 0x0000;
          patternTile = (tileIndex & 0xfe) + Math.floor(patternY / TILE_SIZE);
          tileY = patternY % TILE_SIZE;
        }

        for (let col = 0; col < TILE_SIZE; col += 1) {
          const screenX = x + col;
          if (screenX < 0 || screenX >= SCREEN_WIDTH) {
            continue;
          }

          const tileX = flipHorizontal ? (TILE_SIZE - 1 - col) : col;
          const colorId = decodePatternPixel(patterns, patternTile, tableBase, tileX, tileY);
          if (colorId === 0) {
            continue;
          }

          const pixel = screenY * SCREEN_WIDTH + screenX;
          if (priorityBehindBackground && backgroundOpaque && backgroundOpaque[pixel]) {
            continue;
          }

          const rgb = spritePaletteColor(palettes, paletteIndex, colorId);
          const out = pixel * 4;
          spriteRgba[out] = rgb[0];
          spriteRgba[out + 1] = rgb[1];
          spriteRgba[out + 2] = rgb[2];
          spriteRgba[out + 3] = 0xff;
          compositeRgba[out] = rgb[0];
          compositeRgba[out + 1] = rgb[1];
          compositeRgba[out + 2] = rgb[2];
          compositeRgba[out + 3] = 0xff;
          drawnPixels += 1;
          spriteDrewPixel = true;
        }
      }

      if (spriteDrewPixel) {
        visibleSprites += 1;
      }
    }
  }

  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    rgba: spriteRgba,
    compositeRgba,
    metadata: {
      spritePatternBase,
      largeSprites,
      spritesEnabled,
      visibleSprites,
      drawnPixels
    }
  };
}

function diffImages(a, b) {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(`image sizes differ: ${a.width}x${a.height} vs ${b.width}x${b.height}`);
  }

  const rgba = Buffer.alloc(a.width * a.height * 4);
  let differingPixels = 0;

  for (let i = 0; i < rgba.length; i += 4) {
    const same = a.rgba[i] === b.rgba[i]
      && a.rgba[i + 1] === b.rgba[i + 1]
      && a.rgba[i + 2] === b.rgba[i + 2];

    if (same) {
      rgba[i] = a.rgba[i];
      rgba[i + 1] = a.rgba[i + 1];
      rgba[i + 2] = a.rgba[i + 2];
      rgba[i + 3] = 0xff;
    } else {
      differingPixels += 1;
      rgba[i] = 0xff;
      rgba[i + 1] = 0x00;
      rgba[i + 2] = 0xff;
      rgba[i + 3] = 0xff;
    }
  }

  return {
    width: a.width,
    height: a.height,
    rgba,
    differingPixels,
    totalPixels: a.width * a.height,
    differenceRatio: differingPixels / (a.width * a.height)
  };
}

function renderPpuCapture(captureDir, outPath) {
  const resolvedCaptureDir = path.resolve(captureDir);
  const output = outPath
    ? path.resolve(outPath)
    : path.join(resolvedCaptureDir, 'background.png');

  const rendered = renderNametable({
    patternsPath: path.join(resolvedCaptureDir, 'ppu-0000-1fff-patterns.bin'),
    nametablesPath: path.join(resolvedCaptureDir, 'ppu-2000-2fff-nametables.bin'),
    palettesPath: path.join(resolvedCaptureDir, 'ppu-3f00-3f1f-palettes.bin'),
    statePath: path.join(resolvedCaptureDir, 'state.json')
  });
  writePng(output, rendered.width, rendered.height, rendered.rgba);

  const result = {
    captureDir: resolvedCaptureDir,
    output,
    width: rendered.width,
    height: rendered.height,
    nametableIndex: rendered.metadata.nametableIndex,
    bgPatternBase: rendered.metadata.bgPatternBase,
    scrollState: rendered.metadata.scrollState,
    fineX: rendered.metadata.fineX,
    scrollX: rendered.metadata.scrollX,
    scrollY: rendered.metadata.scrollY
  };

  const screenshotPath = path.join(resolvedCaptureDir, 'screenshot.png');
  if (fs.existsSync(screenshotPath)) {
    const screenshot = readPng(screenshotPath);
    const diff = diffImages(screenshot, rendered);
    const diffPath = path.join(path.dirname(output), `${path.basename(output, path.extname(output))}.diff.png`);
    writePng(diffPath, diff.width, diff.height, diff.rgba);
    result.diff = {
      screenshot: screenshotPath,
      output: diffPath,
      differingPixels: diff.differingPixels,
      totalPixels: diff.totalPixels,
      differenceRatio: diff.differenceRatio
    };
  }

  const oamPath = path.join(resolvedCaptureDir, 'oam-0000-00ff-sprites.bin');
  if (fs.existsSync(oamPath)) {
    const spriteRendered = renderSprites({
      patternsPath: path.join(resolvedCaptureDir, 'ppu-0000-1fff-patterns.bin'),
      palettesPath: path.join(resolvedCaptureDir, 'ppu-3f00-3f1f-palettes.bin'),
      oamPath,
      statePath: path.join(resolvedCaptureDir, 'state.json'),
      background: rendered
    });
    const base = path.join(path.dirname(output), path.basename(output, path.extname(output)));
    const spritesPath = `${base}.sprites.png`;
    const compositePath = `${base}.composite.png`;
    writePng(spritesPath, spriteRendered.width, spriteRendered.height, spriteRendered.rgba);
    writePng(compositePath, spriteRendered.width, spriteRendered.height, spriteRendered.compositeRgba);
    result.sprites = {
      output: spritesPath,
      spritePatternBase: spriteRendered.metadata.spritePatternBase,
      largeSprites: spriteRendered.metadata.largeSprites,
      spritesEnabled: spriteRendered.metadata.spritesEnabled,
      visibleSprites: spriteRendered.metadata.visibleSprites,
      drawnPixels: spriteRendered.metadata.drawnPixels
    };

    if (fs.existsSync(screenshotPath)) {
      const screenshot = readPng(screenshotPath);
      const compositeDiff = diffImages(screenshot, {
        width: spriteRendered.width,
        height: spriteRendered.height,
        rgba: spriteRendered.compositeRgba
      });
      const compositeDiffPath = `${base}.composite.diff.png`;
      writePng(compositeDiffPath, compositeDiff.width, compositeDiff.height, compositeDiff.rgba);
      result.composite = {
        output: compositePath,
        diff: {
          screenshot: screenshotPath,
          output: compositeDiffPath,
          differingPixels: compositeDiff.differingPixels,
          totalPixels: compositeDiff.totalPixels,
          differenceRatio: compositeDiff.differenceRatio
        }
      };
    } else {
      result.composite = {
        output: compositePath
      };
    }
  }

  return result;
}

module.exports = {
  diffImages,
  renderSprites,
  renderNametableFromMemory,
  renderNametable,
  renderPpuCapture
};
