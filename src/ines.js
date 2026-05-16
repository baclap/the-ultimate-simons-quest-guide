'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const HEADER_SIZE = 16;
const PRG_BANK_SIZE = 16 * 1024;
const CHR_BANK_SIZE = 8 * 1024;
const TRAINER_SIZE = 512;

function parseInes(buffer, romPath = '') {
  if (buffer.length < HEADER_SIZE) {
    throw new Error('ROM is too small to contain an iNES header');
  }

  if (buffer[0] !== 0x4e || buffer[1] !== 0x45 || buffer[2] !== 0x53 || buffer[3] !== 0x1a) {
    throw new Error('ROM does not start with an iNES magic header');
  }

  const prgRomBanks = buffer[4];
  const chrRomBanks = buffer[5];
  const flags6 = buffer[6];
  const flags7 = buffer[7];
  const trainerSize = (flags6 & 0x04) ? TRAINER_SIZE : 0;
  const prgRomSize = prgRomBanks * PRG_BANK_SIZE;
  const chrRomSize = chrRomBanks * CHR_BANK_SIZE;
  const prgStart = HEADER_SIZE + trainerSize;
  const chrStart = prgStart + prgRomSize;
  const expectedSize = chrStart + chrRomSize;
  const mapper = ((flags7 & 0xf0) | (flags6 >> 4));
  const mirroring = (flags6 & 0x08)
    ? 'four-screen'
    : ((flags6 & 0x01) ? 'vertical' : 'horizontal');

  return {
    file: romPath ? path.resolve(romPath) : undefined,
    size: buffer.length,
    sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
    format: ((flags7 & 0x0c) === 0x08) ? 'NES 2.0' : 'iNES',
    prgRomBanks,
    prgRomSize,
    chrRomBanks,
    chrRomSize,
    mapper,
    mirroring,
    hasBatteryBackedRam: Boolean(flags6 & 0x02),
    hasTrainer: Boolean(flags6 & 0x04),
    trainerSize,
    prgStart,
    chrStart,
    expectedSize,
    hasTrailingData: buffer.length > expectedSize,
    trailingDataSize: Math.max(0, buffer.length - expectedSize),
    isComplete: buffer.length >= expectedSize
  };
}

function readRom(romPath) {
  const buffer = fs.readFileSync(romPath);
  const info = parseInes(buffer, romPath);
  if (!info.isComplete) {
    throw new Error(`ROM is truncated: expected at least ${info.expectedSize} bytes, got ${info.size}`);
  }
  return { buffer, info };
}

function describeRom(info) {
  return {
    file: info.file,
    size: info.size,
    sha256: info.sha256,
    format: info.format,
    mapper: info.mapper,
    mirroring: info.mirroring,
    prgRomBanks: info.prgRomBanks,
    prgRomSize: info.prgRomSize,
    chrRomBanks: info.chrRomBanks,
    chrRomSize: info.chrRomSize,
    prgStart: info.prgStart,
    chrStart: info.chrStart,
    expectedSize: info.expectedSize,
    hasTrainer: info.hasTrainer,
    hasBatteryBackedRam: info.hasBatteryBackedRam,
    hasTrailingData: info.hasTrailingData,
    trailingDataSize: info.trailingDataSize
  };
}

module.exports = {
  CHR_BANK_SIZE,
  HEADER_SIZE,
  PRG_BANK_SIZE,
  describeRom,
  parseInes,
  readRom
};

