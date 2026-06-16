'use strict';

const fs = require('fs');
const path = require('path');
const { decodeMetaspriteSelector, decodeSelectorRecordAt, renderSelectorStrip } = require('./actor-selector-streams');
const { readPrgByte, readPrgWord } = require('./background');
const { BACKGROUND_TABLE_BANK } = require('./background-context');
const { buildPatternTableFromChrBanks } = require('./native-image');
const { writePng } = require('./png');

const DEFAULT_OUT_DIR = path.join('out', 'fishman-sprite-proof');

const ACTOR_ID = 0x04;
const BANK_1 = 1;
const FIXED_BANK = 7;
const DISPATCH_HELPER = 0xc5bb;
const ACTOR_DISPATCH_TABLE = 0x81d3;
const FISHMAN_ROUTINE = 0xa27e;
const FISHMAN_SELECTOR_STATE = 0xa2c7;
const FISHMAN_ATTACK_SELECTOR_WRITE = 0xa325;
const SELECTOR_STREAM_RECORD = 0xdda2 + 0x06 * 3;
const ATTACK_SELECTOR = 0x67;
const PALETTE_INDEX_POINTERS = 0xf7c5;
const TRANSFER_POINTER_TABLE = 0x8895;
const COMMON_SPRITE_TRANSFER_ID = 0x0a;
const CHR_BANKS = [0x02, 0x03];

const ROUTE_CONTEXTS = [
  {
    id: 'south-bridge-day',
    label: 'South Bridge, day',
    objset: 0x02,
    area: 0x00,
    submap: 0x01,
    variant: 'day',
    placements: [
      { pointer: 0x6021, bytes: [0x0e, 0x0c, 0x04, 0x01], pixelX: 0x0e * 16, pixelY: 0x0c * 16 },
      { pointer: 0x6025, bytes: [0x15, 0x0c, 0x04, 0x01], pixelX: 0x15 * 16, pixelY: 0x0c * 16 },
      { pointer: 0x6029, bytes: [0x1a, 0x0c, 0x04, 0x01], pixelX: 0x1a * 16, pixelY: 0x0c * 16 },
      { pointer: 0x602d, bytes: [0x25, 0x0c, 0x04, 0x01], pixelX: 0x25 * 16, pixelY: 0x0c * 16 },
      { pointer: 0x6031, bytes: [0x2a, 0x0c, 0x04, 0x01], pixelX: 0x2a * 16, pixelY: 0x0c * 16 },
      { pointer: 0x6039, bytes: [0x35, 0x0c, 0x04, 0x01], pixelX: 0x35 * 16, pixelY: 0x0c * 16 }
    ]
  },
  {
    id: 'south-bridge-night',
    label: 'South Bridge, night',
    objset: 0x02,
    area: 0x00,
    submap: 0x01,
    variant: 'night',
    placements: []
  },
  {
    id: 'denis-woods-part-1-day',
    label: 'Denis Woods - Part 1, day',
    objset: 0x02,
    area: 0x01,
    submap: 0x00,
    variant: 'day',
    placements: [
      { pointer: 0x607c, bytes: [0x0a, 0x0c, 0x04, 0x01], pixelX: 0x0a * 16, pixelY: 0x0c * 16 }
    ]
  },
  {
    id: 'denis-woods-part-1-night',
    label: 'Denis Woods - Part 1, night',
    objset: 0x02,
    area: 0x01,
    submap: 0x00,
    variant: 'night',
    placements: []
  }
];

function hex(value, width = 2) {
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function readSwitchableByte(rom, info, cpuAddress, bank = BANK_1) {
  return readPrgByte(rom, info, cpuAddress, { bank });
}

function readSwitchableWord(rom, info, cpuAddress, bank = BANK_1) {
  return readPrgWord(rom, info, cpuAddress, { bank });
}

function readFixedByte(rom, info, cpuAddress) {
  return readPrgByte(rom, info, cpuAddress, { fixedBank: FIXED_BANK });
}

function readFixedWord(rom, info, cpuAddress) {
  return readPrgWord(rom, info, cpuAddress, { fixedBank: FIXED_BANK });
}

function readBytes(readByte, cpuAddress, count) {
  const bytes = [];
  for (let offset = 0; offset < count; offset += 1) {
    bytes.push(readByte(cpuAddress + offset));
  }
  return bytes;
}

function publicBytes(bytes) {
  return bytes.map((byte) => hex(byte, 2));
}

function publicPlacement(placement) {
  return {
    pointer: hex(placement.pointer, 4),
    rowBytes: publicBytes(placement.bytes),
    tileX: placement.bytes[0],
    tileY: placement.bytes[1],
    actorId: hex(placement.bytes[2], 2),
    data: hex(placement.bytes[3], 2),
    pixelX: placement.pixelX,
    pixelY: placement.pixelY
  };
}

function readBackgroundTableByte(rom, info, cpuAddress) {
  return readPrgByte(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readBackgroundTableWord(rom, info, cpuAddress) {
  return readPrgWord(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function transferPointerAddress(transferId) {
  return TRANSFER_POINTER_TABLE + transferId * 2;
}

function transferBank(address) {
  return address < 0xc000 ? 4 : undefined;
}

function readTransfer(rom, info, transferId, terminators = new Set([0xff])) {
  const pointerAddress = transferPointerAddress(transferId);
  const address = readPrgWord(rom, info, pointerAddress, { bank: FIXED_BANK });
  const bank = transferBank(address);
  const readOpts = bank == null ? { fixedBank: FIXED_BANK } : { bank };
  const bytes = [];

  for (let offset = 0; offset < 0x80; offset += 1) {
    const byte = readPrgByte(rom, info, address + offset, readOpts);
    if (terminators.has(byte)) {
      break;
    }
    bytes.push(byte);
  }

  return {
    transferId,
    pointerAddress,
    address,
    bank,
    bytes
  };
}

function derivePaletteSelector(rom, info, context) {
  const selectorVariant = context.variant === 'night' ? 'night' : 'day';
  const variantOffset = selectorVariant === 'night' ? 2 : 0;
  const paletteTableAddress = readBackgroundTableWord(rom, info, PALETTE_INDEX_POINTERS + context.objset * 2);
  const indexListPointerAddress = paletteTableAddress + context.area * 4 + variantOffset;
  const indexListAddress = readBackgroundTableWord(rom, info, indexListPointerAddress);
  const indexOffset = (context.submap & 0x7f) * 2;
  const transferId = readBackgroundTableByte(rom, info, indexListAddress + indexOffset);
  const auxiliaryTransferId = readBackgroundTableByte(rom, info, indexListAddress + indexOffset + 1);

  return {
    selectorVariant,
    paletteIndexPointersAddress: PALETTE_INDEX_POINTERS,
    paletteTableAddress,
    indexListPointerAddress,
    indexListAddress,
    indexOffset,
    transferId,
    auxiliaryTransferId,
    transferPointerAddress: transferPointerAddress(transferId),
    auxiliaryTransferPointerAddress: transferPointerAddress(auxiliaryTransferId)
  };
}

function buildPaletteMemory(rom, info, context) {
  const selector = derivePaletteSelector(rom, info, context);
  const backgroundTransfer = readTransfer(rom, info, selector.transferId, new Set([0xff]));
  const commonSpriteTransfer = readTransfer(rom, info, COMMON_SPRITE_TRANSFER_ID, new Set([0xff]));
  const auxiliarySpriteTransfer = readTransfer(rom, info, selector.auxiliaryTransferId, new Set([0xfe, 0xff, 0x00]));
  const palettes = Buffer.alloc(0x20, 0x0f);

  for (let i = 0; i < Math.min(0x10, backgroundTransfer.bytes.length); i += 1) {
    palettes[i] = backgroundTransfer.bytes[i];
  }
  for (let i = 0; i < Math.min(0x08, commonSpriteTransfer.bytes.length); i += 1) {
    palettes[0x10 + i] = commonSpriteTransfer.bytes[i];
  }
  for (let i = 0; i < Math.min(0x08, auxiliarySpriteTransfer.bytes.length); i += 1) {
    palettes[0x18 + i] = auxiliarySpriteTransfer.bytes[i];
  }

  return {
    palettes,
    selector,
    backgroundTransfer,
    commonSpriteTransfer,
    auxiliarySpriteTransfer
  };
}

function publicTransfer(transfer) {
  return {
    transferId: hex(transfer.transferId, 2),
    pointerAddress: hex(transfer.pointerAddress, 4),
    address: hex(transfer.address, 4),
    bank: transfer.bank == null ? 'fixed' : transfer.bank,
    bytes: publicBytes(transfer.bytes)
  };
}

function publicPaletteEvidence(evidence) {
  return {
    selector: {
      selectorVariant: evidence.selector.selectorVariant,
      paletteIndexPointersAddress: hex(evidence.selector.paletteIndexPointersAddress, 4),
      paletteTableAddress: hex(evidence.selector.paletteTableAddress, 4),
      indexListPointerAddress: hex(evidence.selector.indexListPointerAddress, 4),
      indexListAddress: hex(evidence.selector.indexListAddress, 4),
      indexOffset: evidence.selector.indexOffset,
      transferId: hex(evidence.selector.transferId, 2),
      auxiliaryTransferId: hex(evidence.selector.auxiliaryTransferId, 2),
      transferPointerAddress: hex(evidence.selector.transferPointerAddress, 4),
      auxiliaryTransferPointerAddress: hex(evidence.selector.auxiliaryTransferPointerAddress, 4)
    },
    backgroundTransfer: publicTransfer(evidence.backgroundTransfer),
    commonSpriteTransfer: publicTransfer(evidence.commonSpriteTransfer),
    auxiliarySpriteTransfer: publicTransfer(evidence.auxiliarySpriteTransfer),
    ppuPaletteMemory: publicBytes([...evidence.palettes]),
    spritePalette2: publicBytes([...evidence.palettes.slice(0x18, 0x1c)]),
    spritePalette3: publicBytes([...evidence.palettes.slice(0x1c, 0x20)])
  };
}

function renderVariant(rom, info, outDir, context, selectorRecord, attackRecord) {
  const patterns = buildPatternTableFromChrBanks(rom, info, CHR_BANKS);
  const paletteEvidence = buildPaletteMemory(rom, info, context);
  const renderOpts = {
    patterns,
    palettes: paletteEvidence.palettes,
    baseAttr: 0,
    largeSprites: true,
    spritePatternBase: 0x1000
  };
  const body = renderSelectorStrip(rom, info, selectorRecord, renderOpts);
  const attack = renderSelectorStrip(rom, info, attackRecord, renderOpts);
  const bodyOutput = path.join(outDir, 'sprites', `${context.id}-fishman-body.png`);
  const attackOutput = path.join(outDir, 'sprites', `${context.id}-fishman-attack.png`);

  writePng(bodyOutput, body.width, body.height, body.rgba);
  writePng(attackOutput, attack.width, attack.height, attack.rgba);

  return {
    context,
    paletteEvidence,
    body: {
      output: bodyOutput,
      width: body.width,
      height: body.height,
      metadata: body.metadata
    },
    attack: {
      output: attackOutput,
      width: attack.width,
      height: attack.height,
      metadata: attack.metadata
    }
  };
}

function copyScaled(src, srcWidth, srcHeight, dst, dstWidth, dstX, dstY, scale) {
  for (let y = 0; y < srcHeight; y += 1) {
    for (let x = 0; x < srcWidth; x += 1) {
      const srcOffset = (y * srcWidth + x) * 4;
      const alpha = src[srcOffset + 3];
      if (alpha === 0) {
        continue;
      }
      for (let sy = 0; sy < scale; sy += 1) {
        for (let sx = 0; sx < scale; sx += 1) {
          const dx = dstX + x * scale + sx;
          const dy = dstY + y * scale + sy;
          const dstOffset = (dy * dstWidth + dx) * 4;
          dst[dstOffset] = src[srcOffset];
          dst[dstOffset + 1] = src[srcOffset + 1];
          dst[dstOffset + 2] = src[srcOffset + 2];
          dst[dstOffset + 3] = alpha;
        }
      }
    }
  }
}

function renderPreview(rom, info, outDir, renderedVariants) {
  const scale = 5;
  const gap = 12;
  const padding = 8;
  const cells = renderedVariants.map((variant) => ({
    width: Math.max(variant.body.width, variant.attack.width),
    height: variant.body.height + variant.attack.height + gap,
    body: variant.body,
    attack: variant.attack
  }));
  const cellWidth = Math.max(...cells.map((cell) => cell.width));
  const cellHeight = Math.max(...cells.map((cell) => cell.height));
  const width = padding * 2 + cells.length * cellWidth * scale + (cells.length - 1) * gap;
  const height = padding * 2 + cellHeight * scale;
  const rgba = Buffer.alloc(width * height * 4);

  rgba.fill(0x00);
  for (let index = 0; index < renderedVariants.length; index += 1) {
    const variant = renderedVariants[index];
    const x = padding + index * (cellWidth * scale + gap);
    const bodyRender = renderSelectorStrip(rom, info, {
      selectors: variant.body.metadata.selectors
    }, {
      patterns: buildPatternTableFromChrBanks(rom, info, CHR_BANKS),
      palettes: variant.paletteEvidence.palettes,
      baseAttr: 0,
      largeSprites: true,
      spritePatternBase: 0x1000
    });
    const attackRender = renderSelectorStrip(rom, info, {
      selectors: variant.attack.metadata.selectors
    }, {
      patterns: buildPatternTableFromChrBanks(rom, info, CHR_BANKS),
      palettes: variant.paletteEvidence.palettes,
      baseAttr: 0,
      largeSprites: true,
      spritePatternBase: 0x1000
    });
    copyScaled(bodyRender.rgba, bodyRender.width, bodyRender.height, rgba, width, x, padding, scale);
    copyScaled(
      attackRender.rgba,
      attackRender.width,
      attackRender.height,
      rgba,
      width,
      x,
      padding + (bodyRender.height * scale) + gap,
      scale
    );
  }

  const output = path.join(outDir, 'fishman-preview.png');
  writePng(output, width, height, rgba);
  return {
    output,
    width,
    height,
    scale
  };
}

function publicMetasprite(meta) {
  return {
    selector: hex(meta.selector, 2),
    pointerTable: hex(meta.pointer.pointerTable, 4),
    pointerIndex: hex(meta.pointer.pointerIndex, 2),
    pointerAddress: hex(meta.pointer.pointerAddress, 4),
    target: hex(meta.pointer.target, 4),
    fileOffset: hex(meta.pointer.fileOffset, 5),
    status: hex(meta.status, 2),
    count: meta.count,
    usesSharedShape: meta.usesSharedShape,
    shapePointer: meta.shapePointer == null ? undefined : hex(meta.shapePointer, 4),
    sprites: meta.sprites.map((sprite) => ({
      index: sprite.index,
      tile: hex(sprite.tile, 2),
      attr: hex(sprite.attr, 2),
      palette: sprite.attr & 0x03,
      xOffset: sprite.xOffset,
      yOffset: sprite.yOffset,
      reusePreviousAttr: sprite.reusePreviousAttr
    }))
  };
}

function publicRecord(record) {
  return {
    cpuAddress: hex(record.cpuAddress, 4),
    fileOffset: hex(record.fileOffset, 5),
    recordIndex: record.recordIndex,
    bytes: publicBytes(record.bytes),
    frameLimit: hex(record.frameLimit, 2),
    baseSelector: hex(record.baseSelector, 2),
    sidecar: hex(record.sidecar, 2),
    selectors: publicBytes(record.selectors)
  };
}

function makeAnalysis(rom, info, renderedVariants, preview, selectorRecord, attackRecord) {
  const dispatchPointerAddress = ACTOR_DISPATCH_TABLE + ACTOR_ID * 2;
  const dispatchTarget = readSwitchableWord(rom, info, dispatchPointerAddress);
  const bodyMetasprites = selectorRecord.selectors.map((selector) => decodeMetaspriteSelector(rom, info, selector));
  const attackMetasprite = decodeMetaspriteSelector(rom, info, ATTACK_SELECTOR);

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    summary: {
      actorId: hex(ACTOR_ID, 2),
      label: 'fishman',
      status: 'rom-proven-body-and-attack-selectors',
      bodySelectorRecord: hex(selectorRecord.cpuAddress, 4),
      bodySelectors: publicBytes(selectorRecord.selectors),
      attackSelector: hex(ATTACK_SELECTOR, 2),
      chrBanks: publicBytes(CHR_BANKS),
      renderedVariants: renderedVariants.length
    },
    rom: {
      file: info.file,
      sha256: info.sha256
    },
    proof: {
      actorRows: {
        meaning: 'Route actor rows encode x tile, y tile, actor id, and data/base HP. The loader shifts x/y by four pixels bits and copies actor id/data into actor RAM.',
        dayHp: hex(0x01, 2),
        nightHp: hex(0x02, 2),
        placements: ROUTE_CONTEXTS.flatMap((context) => context.placements.map((placement) => ({
          location: context.label.replace(/, (day|night)$/, ''),
          ...publicPlacement(placement)
        })))
      },
      dispatcher: {
        helperCpuAddress: hex(DISPATCH_HELPER, 4),
        helperBytes: publicBytes(readBytes((address) => readFixedByte(rom, info, address), DISPATCH_HELPER, 0x1e)),
        activeActorReadCpuAddress: hex(0x81cd, 4),
        actorDispatchTable: hex(ACTOR_DISPATCH_TABLE, 4),
        fishmanPointerAddress: hex(dispatchPointerAddress, 4),
        fishmanPointerBytes: publicBytes(readBytes((address) => readSwitchableByte(rom, info, address), dispatchPointerAddress, 2)),
        fishmanRoutine: hex(dispatchTarget, 4),
        expectedRoutine: hex(FISHMAN_ROUTINE, 4),
        formula: 'fixed $C5BB doubles A, reads the inline pointer at tableBase + actorId * 2, restores X/Y, then JMPs through that pointer'
      },
      stateMachine: {
        entry: hex(FISHMAN_ROUTINE, 4),
        entryBytes: publicBytes(readBytes((address) => readSwitchableByte(rom, info, address), FISHMAN_ROUTINE, 0x20)),
        selectorState: {
          cpuAddress: hex(FISHMAN_SELECTOR_STATE, 4),
          bytes: publicBytes(readBytes((address) => readSwitchableByte(rom, info, address), FISHMAN_SELECTOR_STATE, 5)),
          meaning: 'A9 06 / JMP $DED8: load selector-stream index 0x06, then fixed $DED8 stores it into $040E,x through $DD8B.'
        },
        fixedSelectorStore: {
          ded8Bytes: publicBytes(readBytes((address) => readFixedByte(rom, info, address), 0xded8, 6)),
          dd8bBytes: publicBytes(readBytes((address) => readFixedByte(rom, info, address), 0xdd8b, 0x13)),
          dd2aBytes: publicBytes(readBytes((address) => readFixedByte(rom, info, address), 0xdd2a, 0x0c))
        },
        attackSelectorWrite: {
          cpuAddress: hex(FISHMAN_ATTACK_SELECTOR_WRITE, 4),
          bytes: publicBytes(readBytes((address) => readSwitchableByte(rom, info, address), FISHMAN_ATTACK_SELECTOR_WRITE, 5)),
          meaning: 'A9 67 / STA $0300,x: later fishman attack state writes selector 0x67 directly.'
        }
      },
      selectorStream: {
        routine: 'fixed $DD35-$DD86',
        record: publicRecord(selectorRecord),
        bodyMetasprites: bodyMetasprites.map(publicMetasprite),
        attackRecord,
        attackMetasprite: publicMetasprite(attackMetasprite)
      },
      paletteAndChr: {
        chrBanks: publicBytes(CHR_BANKS),
        note: 'Route render recipes for South Bridge and Denis Woods Part 1 resolve both locations to CHR banks 0x02/0x03; fishman tiles use the 8x16 sprite pattern selection in bank 0x03.',
        variants: renderedVariants.map((variant) => ({
          id: variant.context.id,
          label: variant.context.label,
          objset: hex(variant.context.objset, 2),
          area: hex(variant.context.area, 2),
          submap: hex(variant.context.submap, 2),
          variant: variant.context.variant,
          palette: publicPaletteEvidence(variant.paletteEvidence),
          sprites: {
            body: path.relative(process.cwd(), variant.body.output),
            attack: path.relative(process.cwd(), variant.attack.output)
          }
        }))
      }
    },
    outputs: {
      preview: {
        ...preview,
        output: path.relative(process.cwd(), preview.output)
      },
      sprites: renderedVariants.flatMap((variant) => [
        path.relative(process.cwd(), variant.body.output),
        path.relative(process.cwd(), variant.attack.output)
      ])
    }
  };
}

function decodeFishmanSpriteProof(rom, info, opts = {}) {
  const outDir = path.resolve(opts.outDir || DEFAULT_OUT_DIR);
  fs.mkdirSync(path.join(outDir, 'sprites'), { recursive: true });

  const selectorRecord = decodeSelectorRecordAt(rom, info, SELECTOR_STREAM_RECORD);
  const attackRecord = {
    cpuAddress: undefined,
    fileOffset: undefined,
    recordIndex: undefined,
    frameLimit: 0,
    baseSelector: ATTACK_SELECTOR,
    sidecar: 0,
    selectors: [ATTACK_SELECTOR],
    bytes: [ATTACK_SELECTOR]
  };
  const renderedVariants = ROUTE_CONTEXTS.map((context) => renderVariant(rom, info, outDir, context, selectorRecord, attackRecord));
  const preview = renderPreview(rom, info, outDir, renderedVariants);
  const analysis = makeAnalysis(rom, info, renderedVariants, preview, selectorRecord, {
    selector: hex(ATTACK_SELECTOR, 2),
    source: 'fishman state writes this selector directly to $0300,x'
  });
  const output = path.join(outDir, 'analysis.json');

  fs.writeFileSync(output, `${JSON.stringify(analysis, null, 2)}\n`);

  return {
    output,
    preview: preview.output,
    spriteDir: path.join(outDir, 'sprites'),
    summary: analysis.summary
  };
}

module.exports = {
  decodeFishmanSpriteProof
};
