import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {
  createGlyphMap,
  renderCv2DialogToRgba
} from '../guide/dialog.js';

const require = createRequire(import.meta.url);
const { readPng, writePng } = require('../src/png.js');

const captureDir = path.resolve('out/captures/jova-dialog-box');
const patternsPath = path.join(captureDir, 'ppu-0000-1fff-patterns.bin');
const screenshotPath = path.join(captureDir, 'screenshot.png');
const fontPath = path.resolve('guide/assets/fonts/cv2-dialog.json');
const diffPath = path.join(captureDir, 'dialog-renderer.diff.png');

function decodePatternAtlas(patterns) {
  const tileSize = 8;
  const tilesPerRow = 16;
  const tileCount = 512;
  const width = tilesPerRow * tileSize;
  const height = Math.ceil(tileCount / tilesPerRow) * tileSize;
  const pixels = new Uint8Array(width * height);

  for (let tile = 0; tile < tileCount; tile += 1) {
    const tileX = (tile % tilesPerRow) * tileSize;
    const tileY = Math.floor(tile / tilesPerRow) * tileSize;
    const offset = tile * 16;
    for (let y = 0; y < tileSize; y += 1) {
      const low = patterns[offset + y];
      const high = patterns[offset + y + 8];
      for (let x = 0; x < tileSize; x += 1) {
        const bit = 7 - x;
        pixels[(tileY + y) * width + tileX + x] = ((low >> bit) & 1) | (((high >> bit) & 1) << 1);
      }
    }
  }

  return { width, height, tilesPerRow, pixels };
}

function compareCrop(reference, candidate, crop) {
  const diff = Buffer.alloc(candidate.width * candidate.height * 4);
  let differingPixels = 0;

  for (let y = 0; y < candidate.height; y += 1) {
    for (let x = 0; x < candidate.width; x += 1) {
      const referenceOffset = ((crop.y + y) * reference.width + crop.x + x) * 4;
      const candidateOffset = (y * candidate.width + x) * 4;
      const differs = reference.rgba[referenceOffset] !== candidate.rgba[candidateOffset]
        || reference.rgba[referenceOffset + 1] !== candidate.rgba[candidateOffset + 1]
        || reference.rgba[referenceOffset + 2] !== candidate.rgba[candidateOffset + 2]
        || reference.rgba[referenceOffset + 3] !== candidate.rgba[candidateOffset + 3];

      if (differs) {
        differingPixels += 1;
        diff[candidateOffset] = 255;
        diff[candidateOffset + 1] = 0;
        diff[candidateOffset + 2] = 255;
        diff[candidateOffset + 3] = 255;
      } else {
        diff[candidateOffset] = candidate.rgba[candidateOffset];
        diff[candidateOffset + 1] = candidate.rgba[candidateOffset + 1];
        diff[candidateOffset + 2] = candidate.rgba[candidateOffset + 2];
        diff[candidateOffset + 3] = 255;
      }
    }
  }

  return { differingPixels, diff };
}

if (!fs.existsSync(patternsPath) || !fs.existsSync(screenshotPath)) {
  throw new Error(`Missing dialog capture artifacts in ${captureDir}. Regenerate out/captures/jova-dialog-box first.`);
}

const glyphs = createGlyphMap(JSON.parse(fs.readFileSync(fontPath, 'utf8')));
const atlas = decodePatternAtlas(fs.readFileSync(patternsPath));
const rendered = renderCv2DialogToRgba({
  atlas,
  glyphs,
  textColumns: 12,
  lines: [
    'FIRST THING',
    'TO DO IN',
    'THIS TOWN IS',
    'BUY A WHITE',
    'CRYSTAL.'
  ]
});
const candidate = {
  width: rendered.width,
  height: rendered.height,
  rgba: Buffer.from(rendered.rgba)
};
const reference = readPng(screenshotPath);
const crop = { x: 32, y: 31 };
const comparison = compareCrop(reference, candidate, crop);
writePng(diffPath, candidate.width, candidate.height, comparison.diff);

const result = {
  reference: screenshotPath,
  crop,
  width: candidate.width,
  height: candidate.height,
  differingPixels: comparison.differingPixels,
  totalPixels: candidate.width * candidate.height,
  diff: diffPath
};

console.log(JSON.stringify(result, null, 2));
if (comparison.differingPixels !== 0) {
  process.exitCode = 1;
}
