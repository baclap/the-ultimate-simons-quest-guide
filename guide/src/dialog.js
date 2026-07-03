export const TILE_SIZE = 8;

export const CV2_DIALOG_TILES = {
  fill: 0x00,
  topLeft: 0x47,
  top: 0x48,
  topRight: 0x49,
  side: 0x4a,
  bottomLeft: 0x4b,
  bottomRight: 0x4c
};

export const CV2_DIALOG_PALETTE_BYTES = [0x0f, 0x11, 0x20, 0x15];

export const NES_PALETTE = [
  [102, 102, 102], [0, 42, 136], [20, 18, 167], [59, 0, 164],
  [92, 0, 126], [110, 0, 64], [108, 6, 0], [86, 29, 0],
  [51, 53, 0], [11, 72, 0], [0, 82, 0], [0, 79, 8],
  [0, 64, 77], [0, 0, 0], [0, 0, 0], [0, 0, 0],
  [173, 173, 173], [21, 95, 217], [66, 64, 255], [117, 39, 254],
  [160, 26, 204], [183, 30, 123], [181, 49, 32], [153, 78, 0],
  [107, 109, 0], [56, 135, 0], [12, 147, 0], [0, 143, 50],
  [0, 124, 141], [0, 0, 0], [0, 0, 0], [0, 0, 0],
  [255, 254, 255], [100, 176, 255], [146, 144, 255], [198, 118, 255],
  [243, 106, 255], [254, 110, 204], [254, 129, 112], [234, 158, 34],
  [188, 190, 0], [136, 216, 0], [92, 228, 48], [69, 224, 130],
  [72, 205, 222], [79, 79, 79], [0, 0, 0], [0, 0, 0],
  [255, 254, 255], [192, 223, 255], [211, 210, 255], [232, 200, 255],
  [251, 194, 255], [254, 196, 234], [254, 204, 197], [247, 216, 165],
  [228, 229, 148], [207, 239, 150], [189, 244, 171], [179, 243, 204],
  [181, 235, 242], [184, 184, 184], [0, 0, 0], [0, 0, 0]
];

const REPLACEMENTS = new Map([
  ['\u2018', "'"],
  ['\u2019', "'"],
  ['\u201c', "'"],
  ['\u201d', "'"],
  ['\u2013', '-'],
  ['\u2014', '-'],
  [':', ' '],
  [';', ','],
  ['/', ' '],
  ['(', ' '],
  [')', ' '],
  ['"', "'"]
]);

export function createGlyphMap(fontManifest) {
  const glyphs = new Map();
  for (const item of fontManifest?.characters || []) {
    const character = String(item.character || '').toUpperCase();
    if (!character) {
      continue;
    }
    glyphs.set(character, Number.parseInt(String(item.tileId).replace(/^0x/i, ''), 16));
  }
  return glyphs;
}

export function normalizeCv2DialogText(text, glyphs) {
  const unsupported = new Set();
  const source = String(text ?? '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .toUpperCase();
  let normalized = '';

  for (const character of source) {
    if (character === '\n') {
      normalized += character;
      continue;
    }
    if (/\s/.test(character)) {
      normalized += ' ';
      continue;
    }
    const replacement = REPLACEMENTS.get(character) || character;
    if (glyphs.has(replacement)) {
      normalized += replacement;
      continue;
    }
    unsupported.add(character);
    normalized += '?';
  }

  return {
    text: normalized
      .split('\n')
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join('\n'),
    unsupported: [...unsupported].sort()
  };
}

function splitLongToken(token, textColumns) {
  const parts = [];
  for (let index = 0; index < token.length; index += textColumns) {
    parts.push(token.slice(index, index + textColumns));
  }
  return parts;
}

function wrapLine(line, textColumns) {
  const output = [];
  let current = '';
  const tokens = line.split(' ').filter(Boolean);

  for (const token of tokens) {
    if (token.length > textColumns) {
      if (current) {
        output.push(current);
        current = '';
      }
      output.push(...splitLongToken(token, textColumns));
      continue;
    }

    if (!current) {
      current = token;
      continue;
    }

    if (current.length + token.length + 1 <= textColumns) {
      current += ` ${token}`;
    } else {
      output.push(current);
      current = token;
    }
  }

  if (current) {
    output.push(current);
  }

  return output.length ? output : [''];
}

export function isCv2DialogRuleLine(line) {
  return /^-{3,}$/.test(String(line || '').trim());
}

export class Cv2DialogLayout {
  static constraints(viewportWidth, _viewportHeight, options = {}) {
    const compact = viewportWidth <= 760;
    const desiredScale = options.desiredScale || (viewportWidth <= 520 ? 2 : 3);
    const maxCssWidth = Math.max(240, Math.min(compact ? viewportWidth - 18 : 720, viewportWidth - 32));
    const maxTileColumns = Math.floor(maxCssWidth / (TILE_SIZE * desiredScale));
    const textColumns = Math.max(12, Math.min(compact ? 20 : 28, maxTileColumns - 4));
    return { textColumns, desiredScale, maxCssWidth };
  }

  static layout(text, glyphs, options = {}) {
    const textColumns = options.textColumns || 20;
    const normalized = normalizeCv2DialogText(text, glyphs);
    const lines = normalized.text
      .split('\n')
      .flatMap((line) => wrapLine(line, textColumns));
    return {
      ...normalized,
      textColumns,
      lines: lines.length ? lines : ['']
    };
  }
}

function dialogPalette(overrides = {}) {
  const palette = CV2_DIALOG_PALETTE_BYTES.map((byte) => NES_PALETTE[byte & 0x3f] || [0, 0, 0]);
  for (const [slot, color] of Object.entries(overrides)) {
    const index = Number.parseInt(slot, 10);
    if (Number.isInteger(index) && index >= 0 && index < palette.length && Array.isArray(color)) {
      palette[index] = color;
    }
  }
  return palette;
}

function tileIdForCell(tileX, tileY, tileColumns, tileRows, horizontalRuleTileRows = []) {
  if (
    horizontalRuleTileRows.includes(tileY)
    && tileY > 0
    && tileY < tileRows - 1
    && tileX > 0
    && tileX < tileColumns - 1
  ) {
    return CV2_DIALOG_TILES.top;
  }
  if (tileY === 0) {
    if (tileX === 0) return CV2_DIALOG_TILES.topLeft;
    if (tileX === tileColumns - 1) return CV2_DIALOG_TILES.topRight;
    return CV2_DIALOG_TILES.top;
  }
  if (tileY === tileRows - 1) {
    if (tileX === 0) return CV2_DIALOG_TILES.bottomLeft;
    if (tileX === tileColumns - 1) return CV2_DIALOG_TILES.bottomRight;
    return CV2_DIALOG_TILES.top;
  }
  if (tileX === 0 || tileX === tileColumns - 1) {
    return CV2_DIALOG_TILES.side;
  }
  return CV2_DIALOG_TILES.fill;
}

function drawTile(rgba, width, atlas, tileId, destTileX, destTileY, palette) {
  const sourceX = (tileId % atlas.tilesPerRow) * TILE_SIZE;
  const sourceY = Math.floor(tileId / atlas.tilesPerRow) * TILE_SIZE;
  for (let y = 0; y < TILE_SIZE; y += 1) {
    for (let x = 0; x < TILE_SIZE; x += 1) {
      const colorId = atlas.pixels[(sourceY + y) * atlas.width + sourceX + x] || 0;
      const color = palette[colorId] || palette[0];
      const out = ((destTileY * TILE_SIZE + y) * width + destTileX * TILE_SIZE + x) * 4;
      rgba[out] = color[0];
      rgba[out + 1] = color[1];
      rgba[out + 2] = color[2];
      rgba[out + 3] = color[3] ?? 255;
    }
  }
}

export function renderCv2DialogFrameToRgba({
  atlas,
  tileColumns = 3,
  tileRows = 3,
  horizontalRuleTileRows = [],
  paletteOverrides = {}
}) {
  const width = tileColumns * TILE_SIZE;
  const height = tileRows * TILE_SIZE;
  const rgba = new Uint8ClampedArray(width * height * 4);
  const palette = dialogPalette(paletteOverrides);

  for (let tileY = 0; tileY < tileRows; tileY += 1) {
    for (let tileX = 0; tileX < tileColumns; tileX += 1) {
      drawTile(
        rgba,
        width,
        atlas,
        tileIdForCell(tileX, tileY, tileColumns, tileRows, horizontalRuleTileRows),
        tileX,
        tileY,
        palette
      );
    }
  }

  return {
    width,
    height,
    tileColumns,
    tileRows,
    rgba
  };
}

export function renderCv2DialogToRgba({ atlas, glyphs, lines, textColumns }) {
  const safeLines = lines?.length ? lines : [''];
  const tileColumns = textColumns + 4;
  const tileRows = safeLines.length * 2 + 2;
  const width = tileColumns * TILE_SIZE;
  const height = tileRows * TILE_SIZE;
  const rgba = new Uint8ClampedArray(width * height * 4);
  const palette = dialogPalette();
  const horizontalRuleTileRows = safeLines
    .map((line, index) => (isCv2DialogRuleLine(line) ? 2 + index * 2 : null))
    .filter((tileY) => tileY != null);

  for (let tileY = 0; tileY < tileRows; tileY += 1) {
    for (let tileX = 0; tileX < tileColumns; tileX += 1) {
      drawTile(
        rgba,
        width,
        atlas,
        tileIdForCell(tileX, tileY, tileColumns, tileRows, horizontalRuleTileRows),
        tileX,
        tileY,
        palette
      );
    }
  }

  for (let lineIndex = 0; lineIndex < safeLines.length; lineIndex += 1) {
    const line = safeLines[lineIndex] || '';
    if (isCv2DialogRuleLine(line)) {
      continue;
    }
    const tileY = 2 + lineIndex * 2;
    for (let charIndex = 0; charIndex < Math.min(line.length, textColumns); charIndex += 1) {
      const tileId = glyphs.get(line[charIndex]) ?? glyphs.get('?') ?? CV2_DIALOG_TILES.fill;
      drawTile(rgba, width, atlas, tileId, 2 + charIndex, tileY, palette);
    }
  }

  return {
    width,
    height,
    tileColumns,
    tileRows,
    rgba
  };
}
