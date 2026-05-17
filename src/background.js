'use strict';

const fs = require('fs');
const { loadBackgroundDescriptor } = require('./descriptors');
const { PRG_BANK_SIZE } = require('./ines');

const SWITCHABLE_PRG_START = 0x8000;
const FIXED_PRG_START = 0xc000;
const NAMETABLE_BASE = 0x2000;
const NAMETABLE_SIZE = 0x1000;
const NAMETABLE_PAGE_SIZE = 0x400;
const NAMETABLE_TILE_BYTES = 0x3c0;

const JOVA_NATIVE_DESCRIPTOR = loadBackgroundDescriptor('jova-day');
const JOVA_WOODS_NATIVE_DESCRIPTOR = loadBackgroundDescriptor('jova-woods-day');

function assertByte(value, label) {
  if (!Number.isInteger(value) || value < 0 || value > 0xff) {
    throw new Error(`${label} must be a byte`);
  }
}

function parseHexByte(value) {
  return Number.parseInt(value, 16);
}

function toHex(value, width = 4) {
  return value.toString(16).toUpperCase().padStart(width, '0');
}

function cpuAddressToPrgOffset(info, cpuAddress, opts = {}) {
  if (!Number.isInteger(cpuAddress) || cpuAddress < SWITCHABLE_PRG_START || cpuAddress > 0xffff) {
    throw new Error(`CPU address must be in PRG ROM space ($8000-$FFFF): $${toHex(cpuAddress)}`);
  }

  if (cpuAddress < FIXED_PRG_START) {
    if (!Number.isInteger(opts.bank)) {
      throw new Error(`bank is required for switchable PRG address $${toHex(cpuAddress)}`);
    }
    if (opts.bank < 0 || opts.bank >= info.prgRomBanks) {
      throw new Error(`PRG bank ${opts.bank} is outside 0-${info.prgRomBanks - 1}`);
    }
    return info.prgStart + opts.bank * PRG_BANK_SIZE + (cpuAddress - SWITCHABLE_PRG_START);
  }

  const fixedBank = opts.fixedBank ?? (info.prgRomBanks - 1);
  if (fixedBank < 0 || fixedBank >= info.prgRomBanks) {
    throw new Error(`fixed PRG bank ${fixedBank} is outside 0-${info.prgRomBanks - 1}`);
  }
  return info.prgStart + fixedBank * PRG_BANK_SIZE + (cpuAddress - FIXED_PRG_START);
}

function readPrgByte(rom, info, cpuAddress, opts = {}) {
  const offset = cpuAddressToPrgOffset(info, cpuAddress, opts);
  return rom[offset];
}

function readPrgWord(rom, info, cpuAddress, opts = {}) {
  const low = readPrgByte(rom, info, cpuAddress, opts);
  const high = readPrgByte(rom, info, advancePrgAddress(cpuAddress, 1), opts);
  return low | (high << 8);
}

function advancePrgAddress(cpuAddress, amount) {
  const advanced = cpuAddress + amount;
  if (advanced > 0xffff) {
    throw new Error(`PRG stream advanced past $FFFF from $${toHex(cpuAddress)} by ${amount}`);
  }
  return advanced;
}

function readStreamByte(rom, info, cpuAddress, opts) {
  return readPrgByte(rom, info, cpuAddress, opts);
}

function decodePpuTransferStream(rom, info, opts) {
  const bank = opts.bank;
  const fixedBank = opts.fixedBank;
  let cpuAddress = opts.cpuAddress;
  const maxCommands = opts.maxCommands ?? 4096;
  const writes = [];
  const commands = [];

  const readByte = (address) => readStreamByte(rom, info, address, { bank, fixedBank });

  function readPpuAddress(address) {
    const low = readByte(address);
    const high = readByte(advancePrgAddress(address, 1));
    return (high << 8) | low;
  }

  let ppuAddress = readPpuAddress(cpuAddress);
  const initialPpuAddress = ppuAddress;
  cpuAddress = advancePrgAddress(cpuAddress, 2);

  for (let commandIndex = 0; commandIndex < maxCommands; commandIndex += 1) {
    const commandAddress = cpuAddress;
    const command = readByte(cpuAddress);

    if (command === 0xff) {
      commands.push({
        type: 'end',
        commandAddress,
        command
      });
      return {
        startAddress: opts.cpuAddress,
        bank,
        fixedBank,
        ppuStartAddress: initialPpuAddress,
        commands,
        writes,
        ended: true
      };
    }

    if (command === 0x7f) {
      cpuAddress = advancePrgAddress(cpuAddress, 1);
      ppuAddress = readPpuAddress(cpuAddress);
      commands.push({
        type: 'address',
        commandAddress,
        command,
        ppuAddress
      });
      cpuAddress = advancePrgAddress(cpuAddress, 2);
      continue;
    }

    if (command & 0x80) {
      const count = command & 0x7f;
      if (count === 0) {
        throw new Error(`unsupported zero-length literal run at $${toHex(commandAddress)}`);
      }

      const commandWrites = [];
      for (let index = 0; index < count; index += 1) {
        const value = readByte(advancePrgAddress(cpuAddress, 1 + index));
        const write = {
          ppuAddress,
          value,
          sourceAddress: advancePrgAddress(cpuAddress, 1 + index)
        };
        writes.push(write);
        commandWrites.push(write);
        ppuAddress = (ppuAddress + 1) & 0x3fff;
      }

      commands.push({
        type: 'literal',
        commandAddress,
        command,
        count,
        ppuAddress: commandWrites.length ? commandWrites[0].ppuAddress : ppuAddress
      });
      cpuAddress = advancePrgAddress(cpuAddress, 1 + count);
      continue;
    }

    const count = command === 0 ? 256 : command;
    const valueAddress = advancePrgAddress(cpuAddress, 1);
    const value = readByte(valueAddress);
    for (let index = 0; index < count; index += 1) {
      writes.push({
        ppuAddress,
        value,
        sourceAddress: valueAddress
      });
      ppuAddress = (ppuAddress + 1) & 0x3fff;
    }

    commands.push({
      type: 'repeat',
      commandAddress,
      command,
      count,
      value,
      ppuAddress: (ppuAddress - count) & 0x3fff
    });
    cpuAddress = advancePrgAddress(cpuAddress, 2);
  }

  return {
    startAddress: opts.cpuAddress,
    bank,
    fixedBank,
    commands,
    writes,
    ended: false
  };
}

function nametableOffsetsForAddress(ppuAddress, mirroring = 'none') {
  const normalized = ppuAddress & 0x3fff;
  if (normalized < NAMETABLE_BASE || normalized >= NAMETABLE_BASE + NAMETABLE_SIZE) {
    return [];
  }

  const nametableOffset = normalized - NAMETABLE_BASE;
  const page = Math.floor(nametableOffset / NAMETABLE_PAGE_SIZE);
  const inner = nametableOffset % NAMETABLE_PAGE_SIZE;

  if (mirroring === 'vertical') {
    return [page & 0x01, (page & 0x01) + 2]
      .map((mirroredPage) => mirroredPage * NAMETABLE_PAGE_SIZE + inner);
  }

  if (mirroring === 'horizontal') {
    const firstPage = page < 2 ? 0 : 2;
    return [firstPage, firstPage + 1]
      .map((mirroredPage) => mirroredPage * NAMETABLE_PAGE_SIZE + inner);
  }

  if (mirroring !== 'none') {
    throw new Error(`unsupported nametable mirroring mode "${mirroring}"`);
  }

  return [nametableOffset];
}

function applyPpuWritesToNametables(writes, opts = {}) {
  const nametables = Buffer.alloc(NAMETABLE_SIZE, opts.fill ?? 0);
  const mirroring = opts.mirroring || 'none';
  let appliedWrites = 0;

  for (const write of writes) {
    assertByte(write.value, 'PPU write value');
    const offsets = nametableOffsetsForAddress(write.ppuAddress, mirroring);
    for (const offset of offsets) {
      nametables[offset] = write.value;
      appliedWrites += 1;
    }
  }

  return {
    nametables,
    appliedWrites,
    mirroring
  };
}

function copyNametablePage(nametables, sourcePage, targetPage) {
  const sourceStart = sourcePage * NAMETABLE_PAGE_SIZE;
  const targetStart = targetPage * NAMETABLE_PAGE_SIZE;
  nametables.copy(nametables, targetStart, sourceStart, sourceStart + NAMETABLE_PAGE_SIZE);
}

function readNativeLayoutPointer(rom, info, descriptor, section, columnGroup) {
  const pointersPerSection = readPrgByte(rom, info, descriptor.layoutHeaderAddress);
  const pointerIndex = section * pointersPerSection + columnGroup;
  return readPrgWord(rom, info, descriptor.layoutHeaderAddress + 2 + pointerIndex * 2);
}

function nativeLayoutPointerInfo(rom, info, descriptor, section, columnGroup) {
  const pointersPerSection = readPrgByte(rom, info, descriptor.layoutHeaderAddress);
  const pointerIndex = section * pointersPerSection + columnGroup;
  const pointerAddress = descriptor.layoutHeaderAddress + 2 + pointerIndex * 2;
  return {
    pointersPerSection,
    pointerIndex,
    pointerAddress,
    layoutAddress: readPrgWord(rom, info, pointerAddress)
  };
}

function nativeBlockAttribute(rom, info, descriptor, blockIndex) {
  return readPrgByte(rom, info, descriptor.tileSetAddress + 1 + blockIndex, { bank: descriptor.tileBank });
}

function nativePaletteBits(attributeByte, tileRow, tileColumn) {
  const quadrant = (tileRow >= 2 ? 2 : 0) + (tileColumn >= 2 ? 1 : 0);
  return (attributeByte >> (quadrant * 2)) & 0x03;
}

function writeNativeTileRow(nametables, paletteBits, rom, info, descriptor, tileBaseAddress, page, blockIndex, tileRow, nametableRow, blockColumn) {
  const attributeByte = nativeBlockAttribute(rom, info, descriptor, blockIndex);
  for (let tileColumn = 0; tileColumn < 4; tileColumn += 1) {
    const nametableColumn = blockColumn * 4 + tileColumn;
    if (nametableRow < 30) {
      nametables[page * NAMETABLE_PAGE_SIZE + nametableRow * 32 + nametableColumn] = readPrgByte(
        rom,
        info,
        tileBaseAddress + blockIndex * 16 + tileRow * 4 + tileColumn,
        { bank: descriptor.tileBank }
      );
      paletteBits[nametableRow][nametableColumn] = nativePaletteBits(attributeByte, tileRow, tileColumn);
    }
  }
}

function renderNativeBlock(nametables, paletteBits, rom, info, descriptor, tileBaseAddress, page, blockIndex, blockRow, blockColumn) {
  for (let tileRow = 0; tileRow < 4; tileRow += 1) {
    const nametableRow = blockRow * 4 + tileRow;
    writeNativeTileRow(nametables, paletteBits, rom, info, descriptor, tileBaseAddress, page, blockIndex, tileRow, nametableRow, blockColumn);
  }
}

function nativeRowStreamState(descriptor, worldRow) {
  let layoutRow = worldRow >> 2;
  let section = 0;
  while (layoutRow >= descriptor.rowsPerLayoutSection) {
    layoutRow -= descriptor.rowsPerLayoutSection;
    section += 1;
  }

  return {
    section,
    layoutRow,
    tileRow: worldRow & 0x03,
    nametableRow: ((worldRow % 30) + 30) % 30
  };
}

function renderNativeRowStream(nametables, paletteBits, rom, info, descriptor, tileBaseAddress, page, stream) {
  const renderedRows = [];
  for (let offset = 0; offset < stream.rowCount; offset += 1) {
    const worldRow = stream.startWorldRow + offset;
    const rowState = nativeRowStreamState(descriptor, worldRow);
    const layoutAddress = readNativeLayoutPointer(rom, info, descriptor, rowState.section, stream.columnGroup);

    for (let blockColumn = 0; blockColumn < stream.columnCount; blockColumn += 1) {
      const blockIndex = readPrgByte(
        rom,
        info,
        layoutAddress + rowState.layoutRow * descriptor.widthBlocks + blockColumn,
        { bank: descriptor.layoutBank }
      );
      writeNativeTileRow(
        nametables,
        paletteBits,
        rom,
        info,
        descriptor,
        tileBaseAddress,
        page,
        blockIndex,
        rowState.tileRow,
        rowState.nametableRow,
        blockColumn
      );
    }

    renderedRows.push({
      worldRow,
      nametableRow: rowState.nametableRow,
      section: rowState.section,
      layoutRow: rowState.layoutRow,
      tileRow: rowState.tileRow,
      layoutAddress: `0x${toHex(layoutAddress)}`
    });
  }
  return renderedRows;
}

function assembleNativeAttributes(nametables, paletteBits, page, rowStream) {
  for (let attributeRow = 0; attributeRow < 8; attributeRow += 1) {
    for (let attributeColumn = 0; attributeColumn < 8; attributeColumn += 1) {
      const y = attributeRow * 4;
      const x = attributeColumn * 4;
      const topLeft = paletteBits[y]?.[x] ?? 0;
      const topRight = paletteBits[y]?.[x + 2] ?? 0;
      const bottomLeft = paletteBits[y + 2]?.[x] ?? 0;
      const bottomRight = paletteBits[y + 2]?.[x + 2] ?? 0;
      nametables[page * NAMETABLE_PAGE_SIZE + NAMETABLE_TILE_BYTES + attributeRow * 8 + attributeColumn] =
        topLeft | (topRight << 2) | (bottomLeft << 4) | (bottomRight << 6);
    }
  }

  const hiddenHighNibbles = rowStream?.hiddenAttributeHighNibbles;
  if (hiddenHighNibbles) {
    hiddenHighNibbles.forEach((highNibble, attributeColumn) => {
      const offset = page * NAMETABLE_PAGE_SIZE + NAMETABLE_TILE_BYTES + 7 * 8 + attributeColumn;
      nametables[offset] = ((highNibble & 0x0f) << 4) | (nametables[offset] & 0x0f);
    });
  }
}

function renderNativePage(nametables, rom, info, descriptor, tileBaseAddress, pageDescriptor, opts = {}) {
  const page = pageDescriptor.page;
  const paletteBits = Array.from({ length: 30 }, () => Array(32).fill(0));
  const layoutSection = pageDescriptor.layoutSection ?? 0;
  const columnGroup = pageDescriptor.columnGroup ?? 0;
  const pointerInfo = pageDescriptor.layoutAddress == null
    ? nativeLayoutPointerInfo(rom, info, descriptor, layoutSection, columnGroup)
    : {
      pointersPerSection: undefined,
      pointerIndex: undefined,
      pointerAddress: undefined,
      layoutAddress: pageDescriptor.layoutAddress
    };

  if (
    opts.strict !== false &&
    pageDescriptor.expectedLayoutAddress != null &&
    pointerInfo.layoutAddress !== pageDescriptor.expectedLayoutAddress
  ) {
    throw new Error(
      `${pageDescriptor.name} layout pointer mismatch at $${toHex(pointerInfo.pointerAddress)}: expected $${toHex(pageDescriptor.expectedLayoutAddress)}, got $${toHex(pointerInfo.layoutAddress)}`
    );
  }

  const layoutBytes = [];
  for (let blockRow = 0; blockRow < descriptor.heightBlocks; blockRow += 1) {
    const layoutRow = [];
    for (let blockColumn = 0; blockColumn < descriptor.widthBlocks; blockColumn += 1) {
      const blockIndex = readPrgByte(
        rom,
        info,
        pointerInfo.layoutAddress + blockRow * descriptor.widthBlocks + blockColumn,
        { bank: descriptor.layoutBank }
      );
      layoutRow.push(blockIndex);
      renderNativeBlock(nametables, paletteBits, rom, info, descriptor, tileBaseAddress, page, blockIndex, blockRow, blockColumn);
    }
    layoutBytes.push(layoutRow);
  }

  const streamedRows = pageDescriptor.rowStream
    ? renderNativeRowStream(nametables, paletteBits, rom, info, descriptor, tileBaseAddress, page, pageDescriptor.rowStream)
    : [];
  assembleNativeAttributes(nametables, paletteBits, page, pageDescriptor.rowStream);

  return {
    name: pageDescriptor.name,
    page,
    layoutSection,
    columnGroup,
    pointersPerSection: pointerInfo.pointersPerSection,
    layoutPointerIndex: pointerInfo.pointerIndex,
    layoutPointerAddress: pointerInfo.pointerAddress == null ? undefined : `0x${toHex(pointerInfo.pointerAddress)}`,
    layoutAddress: `0x${toHex(pointerInfo.layoutAddress)}`,
    streamedRows,
    hiddenAttributeHighNibbles: pageDescriptor.rowStream?.hiddenAttributeHighNibbles,
    layoutBytes
  };
}

function renderNativeBackgroundNametables(rom, info, opts = {}) {
  const descriptor = opts.descriptor;
  const nametables = Buffer.alloc(NAMETABLE_SIZE, opts.fill ?? 0);
  const tileSetOffset = readPrgByte(rom, info, descriptor.tileSetAddress, { bank: descriptor.tileBank });
  const tileBaseAddress = descriptor.tileSetAddress + tileSetOffset;
  const pages = (descriptor.pages || []).map((pageDescriptor) => (
    renderNativePage(nametables, rom, info, descriptor, tileBaseAddress, pageDescriptor, opts)
  ));

  const mirroring = opts.mirroring || descriptor.nametableMirroring || 'vertical';
  if (mirroring === 'vertical') {
    copyNametablePage(nametables, 0, 2);
    copyNametablePage(nametables, 1, 3);
  } else if (mirroring !== 'none') {
    throw new Error(`unsupported native background mirroring mode "${mirroring}"`);
  }

  return {
    nametables,
    descriptor: descriptor.name,
    metadata: {
      id: descriptor.id,
      label: descriptor.label,
      location: descriptor.location,
      variant: descriptor.variant,
      access: descriptor.access,
      paletteMode: descriptor.paletteMode,
      renderer: descriptor.renderer,
      runtimeContext: descriptor.runtimeContext,
      layoutHeaderAddress: descriptor.layoutHeaderAddress == null ? undefined : `0x${toHex(descriptor.layoutHeaderAddress)}`,
      layoutBank: descriptor.layoutBank,
      tileBank: descriptor.tileBank,
      tileSetAddress: `0x${toHex(descriptor.tileSetAddress)}`,
      tileSetOffset: `0x${toHex(tileSetOffset, 2)}`,
      tileBaseAddress: `0x${toHex(tileBaseAddress)}`,
      mirroring,
      pages
    }
  };
}

function renderJovaNativeNametables(rom, info, opts = {}) {
  return renderNativeBackgroundNametables(rom, info, {
    ...opts,
    descriptor: opts.descriptor || JOVA_NATIVE_DESCRIPTOR
  });
}

function renderJovaWoodsNativeNametables(rom, info, opts = {}) {
  return renderNativeBackgroundNametables(rom, info, {
    ...opts,
    descriptor: opts.descriptor || JOVA_WOODS_NATIVE_DESCRIPTOR
  });
}

function parsePpuBufferTrace(tracePath) {
  const text = fs.readFileSync(tracePath, 'utf8').trim();
  if (!text) {
    return [];
  }

  const lines = text.split(/\r?\n/);
  const header = lines.shift().split('\t');
  const frameIndex = header.indexOf('frame');
  const pcIndex = header.indexOf('pc');
  const addrIndex = header.indexOf('addr');
  const valueIndex = header.indexOf('value');

  if (frameIndex === -1 || addrIndex === -1 || valueIndex === -1) {
    throw new Error(`trace is missing required frame/addr/value columns: ${tracePath}`);
  }

  const eventsByFrame = new Map();
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const fields = line.split('\t');
    const frame = Number.parseInt(fields[frameIndex], 10);
    const address = parseHexByte(fields[addrIndex]);
    const value = parseHexByte(fields[valueIndex]);
    if (!Number.isFinite(frame) || !Number.isFinite(address) || !Number.isFinite(value)) {
      continue;
    }
    if (address < 0x0700 || address > 0x07ff) {
      continue;
    }

    if (!eventsByFrame.has(frame)) {
      eventsByFrame.set(frame, []);
    }
    eventsByFrame.get(frame).push({
      frame,
      pc: pcIndex === -1 ? '' : fields[pcIndex],
      address,
      value
    });
  }

  return [...eventsByFrame]
    .sort((a, b) => a[0] - b[0])
    .map(([frame, events]) => ({ frame, events }));
}

function replayPpuBuffer(buffer, opts = {}) {
  const writes = [];
  const commands = [];
  const unsupported = [];
  let offset = opts.offset ?? 0;

  while (offset < buffer.length) {
    const commandOffset = offset;
    const command = buffer[offset];
    offset += 1;

    if (command === 0x00) {
      return { writes, commands, unsupported, ended: true };
    }

    if (command !== 0x01) {
      unsupported.push({ offset: commandOffset, command });
      return { writes, commands, unsupported, ended: false };
    }

    if (offset + 2 > buffer.length) {
      unsupported.push({ offset: commandOffset, command, reason: 'missing PPU address bytes' });
      return { writes, commands, unsupported, ended: false };
    }

    let ppuAddress = (buffer[offset] << 8) | buffer[offset + 1];
    const startPpuAddress = ppuAddress;
    offset += 2;
    const dataStartOffset = offset;
    let dataBytes = 0;

    while (offset < buffer.length && buffer[offset] !== 0xff) {
      writes.push({
        ppuAddress,
        value: buffer[offset],
        bufferOffset: offset
      });
      ppuAddress = (ppuAddress + 1) & 0x3fff;
      offset += 1;
      dataBytes += 1;
    }

    if (offset >= buffer.length) {
      unsupported.push({ offset: commandOffset, command, reason: 'unterminated data run' });
      return { writes, commands, unsupported, ended: false };
    }

    commands.push({
      command,
      offset: commandOffset,
      ppuAddress: startPpuAddress,
      dataStartOffset,
      dataBytes
    });
    offset += 1;
  }

  return { writes, commands, unsupported, ended: false };
}

function replayPpuBufferTrace(tracePath, opts = {}) {
  const frames = parsePpuBufferTrace(tracePath);
  const firstFrame = opts.firstFrame ?? -Infinity;
  const lastFrame = opts.lastFrame ?? Infinity;
  const mirroring = opts.mirroring || 'none';
  const nametables = Buffer.alloc(NAMETABLE_SIZE, opts.fill ?? 0);
  const frameSummaries = [];
  let commandCount = 0;
  let ppuWriteCount = 0;
  let appliedWrites = 0;
  let unsupportedCount = 0;

  for (const frame of frames) {
    if (frame.frame < firstFrame || frame.frame > lastFrame) {
      continue;
    }

    const ppuBuffer = Buffer.alloc(0x100);
    for (const event of frame.events) {
      ppuBuffer[event.address - 0x0700] = event.value;
    }

    const replay = replayPpuBuffer(ppuBuffer);
    if (!replay.commands.length && !replay.writes.length && !replay.unsupported.length) {
      continue;
    }

    for (const write of replay.writes) {
      const offsets = nametableOffsetsForAddress(write.ppuAddress, mirroring);
      for (const nametableOffset of offsets) {
        nametables[nametableOffset] = write.value;
        appliedWrites += 1;
      }
    }

    commandCount += replay.commands.length;
    ppuWriteCount += replay.writes.length;
    unsupportedCount += replay.unsupported.length;
    frameSummaries.push({
      frame: frame.frame,
      events: frame.events.length,
      commands: replay.commands.length,
      ppuWrites: replay.writes.length,
      unsupported: replay.unsupported
    });
  }

  return {
    trace: tracePath,
    firstFrame: Number.isFinite(firstFrame) ? firstFrame : undefined,
    lastFrame: Number.isFinite(lastFrame) ? lastFrame : undefined,
    mirroring,
    framesSeen: frames.length,
    framesApplied: frameSummaries.length,
    commands: commandCount,
    ppuWrites: ppuWriteCount,
    appliedWrites,
    unsupported: unsupportedCount,
    frameSummaries,
    nametables
  };
}

function compareNametables(actual, expected) {
  if (actual.length !== expected.length) {
    throw new Error(`nametable sizes differ: ${actual.length} vs ${expected.length}`);
  }

  const pages = [];
  let differingBytes = 0;
  for (let page = 0; page < 4; page += 1) {
    let pageDifferences = 0;
    const start = page * NAMETABLE_PAGE_SIZE;
    for (let offset = 0; offset < NAMETABLE_PAGE_SIZE; offset += 1) {
      if (actual[start + offset] !== expected[start + offset]) {
        pageDifferences += 1;
      }
    }
    differingBytes += pageDifferences;
    pages.push({
      page,
      differingBytes: pageDifferences,
      totalBytes: NAMETABLE_PAGE_SIZE,
      differenceRatio: pageDifferences / NAMETABLE_PAGE_SIZE
    });
  }

  return {
    differingBytes,
    totalBytes: actual.length,
    differenceRatio: differingBytes / actual.length,
    pages
  };
}

module.exports = {
  JOVA_NATIVE_DESCRIPTOR,
  JOVA_WOODS_NATIVE_DESCRIPTOR,
  NAMETABLE_PAGE_SIZE,
  NAMETABLE_SIZE,
  applyPpuWritesToNametables,
  compareNametables,
  cpuAddressToPrgOffset,
  decodePpuTransferStream,
  nametableOffsetsForAddress,
  parsePpuBufferTrace,
  readPrgByte,
  readPrgWord,
  renderJovaNativeNametables,
  renderJovaWoodsNativeNametables,
  renderNativeBackgroundNametables,
  replayPpuBuffer,
  replayPpuBufferTrace,
  toHex
};
