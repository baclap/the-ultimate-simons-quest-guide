'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CRC_TABLE = new Uint32Array(256);

for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function writePng(filePath, width, height, rgba) {
  if (rgba.length !== width * height * 4) {
    throw new Error(`RGBA buffer length ${rgba.length} does not match ${width}x${height}`);
  }

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const srcStart = y * stride;
    const destStart = y * (stride + 1);
    raw[destStart] = 0;
    rgba.copy(raw, destStart + 1, srcStart, srcStart + stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.concat([
    SIGNATURE,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]));
}

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) {
    return a;
  }
  if (pb <= pc) {
    return b;
  }
  return c;
}

function readPng(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (!buffer.subarray(0, SIGNATURE.length).equals(SIGNATURE)) {
    throw new Error(`not a PNG file: ${filePath}`);
  }

  let offset = SIGNATURE.length;
  let ihdr;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      ihdr = data;
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  if (!ihdr) {
    throw new Error(`PNG is missing IHDR: ${filePath}`);
  }

  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  const interlace = ihdr[12];

  if (bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
    throw new Error(`unsupported PNG format in ${filePath}: bitDepth=${bitDepth}, colorType=${colorType}, interlace=${interlace}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const inflated = zlib.inflateSync(Buffer.concat(idat));
  const raw = Buffer.alloc(stride * height);
  let src = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[src];
    src += 1;
    const rowStart = y * stride;
    const prevRowStart = (y - 1) * stride;

    for (let x = 0; x < stride; x += 1) {
      const value = inflated[src + x];
      const left = x >= channels ? raw[rowStart + x - channels] : 0;
      const up = y > 0 ? raw[prevRowStart + x] : 0;
      const upLeft = (y > 0 && x >= channels) ? raw[prevRowStart + x - channels] : 0;
      let reconstructed;

      if (filter === 0) {
        reconstructed = value;
      } else if (filter === 1) {
        reconstructed = value + left;
      } else if (filter === 2) {
        reconstructed = value + up;
      } else if (filter === 3) {
        reconstructed = value + Math.floor((left + up) / 2);
      } else if (filter === 4) {
        reconstructed = value + paethPredictor(left, up, upLeft);
      } else {
        throw new Error(`unsupported PNG filter ${filter} in ${filePath}`);
      }

      raw[rowStart + x] = reconstructed & 0xff;
    }

    src += stride;
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < raw.length; i += channels, j += 4) {
    rgba[j] = raw[i];
    rgba[j + 1] = raw[i + 1];
    rgba[j + 2] = raw[i + 2];
    rgba[j + 3] = channels === 4 ? raw[i + 3] : 0xff;
  }

  return { width, height, rgba };
}

module.exports = {
  readPng,
  writePng
};
