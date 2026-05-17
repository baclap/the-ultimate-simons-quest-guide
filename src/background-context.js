'use strict';

const {
  readPrgByte,
  readPrgWord,
  toHex
} = require('./background');

const BACKGROUND_TABLE_BANK = 2;
const BACKGROUND_TILE_BANK = 4;
const AREA_TABLE_POINTERS = 0xf7ab;
const LAYOUT_TABLE_POINTERS = 0xf7fb;
const TILE_SET_POINTERS = 0xf7d1;
const SCREEN_RECORD_POINTERS_OFFSET = 9;

function hex(value, width = 4) {
  return `0x${toHex(value, width)}`;
}

function readBackgroundTableByte(rom, info, cpuAddress) {
  return readPrgByte(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readBackgroundTableWord(rom, info, cpuAddress) {
  return readPrgWord(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function assertSmallInteger(value, label) {
  if (!Number.isInteger(value) || value < 0 || value > 0xff) {
    throw new Error(`${label} must be a byte-sized integer`);
  }
}

function readByteList(rom, info, cpuAddress, count) {
  const values = [];
  for (let offset = 0; offset < count; offset += 1) {
    values.push(hex(readBackgroundTableByte(rom, info, cpuAddress + offset), 2));
  }
  return values;
}

function switchableBankForAddress(cpuAddress) {
  return cpuAddress < 0xc000 ? BACKGROUND_TABLE_BANK : undefined;
}

function deriveBackgroundContext(rom, info, opts) {
  const objset = opts.objset;
  const area = opts.area;
  const submap = opts.submap ?? 0;
  assertSmallInteger(objset, 'objset');
  assertSmallInteger(area, 'area');
  assertSmallInteger(submap, 'submap');

  const areaTablePointerAddress = AREA_TABLE_POINTERS + objset * 2;
  const areaTableAddress = readBackgroundTableWord(rom, info, areaTablePointerAddress);
  const areaRecordPointerAddress = areaTableAddress + area * 2;
  const areaRecordAddress = readBackgroundTableWord(rom, info, areaRecordPointerAddress);
  const screenRecordPointerAddress = areaRecordAddress + SCREEN_RECORD_POINTERS_OFFSET + submap * 2;
  const screenRecordAddress = readBackgroundTableWord(rom, info, screenRecordPointerAddress);
  const layoutIndex = readBackgroundTableByte(rom, info, screenRecordAddress);

  const layoutTablePointerAddress = LAYOUT_TABLE_POINTERS + objset * 2;
  const layoutTableAddress = readBackgroundTableWord(rom, info, layoutTablePointerAddress);
  const layoutHeaderPointerAddress = layoutTableAddress + layoutIndex * 4;
  const layoutHeaderAddress = readBackgroundTableWord(rom, info, layoutHeaderPointerAddress);
  const secondaryLayoutHeaderAddress = readBackgroundTableWord(rom, info, layoutHeaderPointerAddress + 2);

  const tileSetPointerAddress = TILE_SET_POINTERS + objset * 4;
  const tileSetAddress = readBackgroundTableWord(rom, info, tileSetPointerAddress);
  const auxiliaryTileAddress = readBackgroundTableWord(rom, info, tileSetPointerAddress + 2);

  return {
    input: {
      objset,
      objsetHex: hex(objset, 2),
      area,
      areaHex: hex(area, 2),
      submap,
      submapHex: hex(submap, 2)
    },
    tables: {
      areaTable: {
        pointerTableAddress: hex(AREA_TABLE_POINTERS),
        pointerAddress: hex(areaTablePointerAddress),
        address: hex(areaTableAddress),
        bank: switchableBankForAddress(areaTableAddress)
      },
      areaRecord: {
        pointerAddress: hex(areaRecordPointerAddress),
        address: hex(areaRecordAddress),
        bank: switchableBankForAddress(areaRecordAddress)
      },
      screenRecord: {
        pointerAddress: hex(screenRecordPointerAddress),
        address: hex(screenRecordAddress),
        bank: switchableBankForAddress(screenRecordAddress),
        firstBytes: readByteList(rom, info, screenRecordAddress, 8),
        layoutIndex,
        layoutIndexHex: hex(layoutIndex, 2)
      },
      layoutTable: {
        pointerTableAddress: hex(LAYOUT_TABLE_POINTERS),
        pointerAddress: hex(layoutTablePointerAddress),
        address: hex(layoutTableAddress),
        bank: switchableBankForAddress(layoutTableAddress)
      },
      layoutHeader: {
        pointerAddress: hex(layoutHeaderPointerAddress),
        address: hex(layoutHeaderAddress),
        bank: switchableBankForAddress(layoutHeaderAddress),
        secondaryAddress: hex(secondaryLayoutHeaderAddress),
        secondaryBank: switchableBankForAddress(secondaryLayoutHeaderAddress)
      },
      tileSet: {
        pointerTableAddress: hex(TILE_SET_POINTERS),
        pointerAddress: hex(tileSetPointerAddress),
        address: hex(tileSetAddress),
        bank: BACKGROUND_TILE_BANK,
        auxiliaryAddress: hex(auxiliaryTileAddress),
        auxiliaryBank: switchableBankForAddress(auxiliaryTileAddress)
      }
    },
    derivedDescriptorFields: {
      layoutBank: BACKGROUND_TABLE_BANK,
      layoutHeaderAddress: hex(layoutHeaderAddress),
      layoutHeaderBank: switchableBankForAddress(layoutHeaderAddress),
      tileBank: BACKGROUND_TILE_BANK,
      tileSetAddress: hex(tileSetAddress)
    }
  };
}

module.exports = {
  AREA_TABLE_POINTERS,
  BACKGROUND_TABLE_BANK,
  BACKGROUND_TILE_BANK,
  LAYOUT_TABLE_POINTERS,
  SCREEN_RECORD_POINTERS_OFFSET,
  TILE_SET_POINTERS,
  deriveBackgroundContext
};
