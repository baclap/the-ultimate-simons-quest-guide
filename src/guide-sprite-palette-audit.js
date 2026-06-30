'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte, readPrgWord, toHex } = require('./background');

const COMMON_SPRITE_PALETTE_ADDRESS = 0xcaae;
const COMMON_SPRITE_PALETTE_LENGTH = 8;
const VARIANT_SPRITE_PALETTE_LENGTH = 8;
const SPRITE_TRANSFER_POINTER_TABLE = 0x8895;
const SPRITE_TRANSFER_POINTER_TABLE_BANK = 7;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function parseInteger(value) {
  if (value == null) {
    return null;
  }
  if (typeof value === 'number') {
    return value;
  }
  const text = String(value);
  return text.startsWith('0x') || text.startsWith('0X')
    ? Number.parseInt(text.slice(2), 16)
    : Number.parseInt(text, 10);
}

function parseByte(value, label) {
  const parsed = parseInteger(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 0xff) {
    throw new Error(`${label} must be a byte`);
  }
  return parsed;
}

function readPrgBytes(rom, info, address, length, opts = {}) {
  const bytes = [];
  for (let index = 0; index < length; index += 1) {
    bytes.push(readPrgByte(rom, info, address + index, opts));
  }
  return bytes;
}

function actorSpritePaletteVariantBank(address) {
  return address < 0xc000 ? 4 : undefined;
}

function formatBytes(bytes) {
  return bytes.map((byte) => toHex(byte, 2)).join(' ');
}

function expectedSpritePaletteForAtlasEntry(rom, info, atlasEntry) {
  const auxiliaryTransferId = parseInteger(atlasEntry?.recipe?.palette?.selector?.auxiliaryTransferId);
  if (!Number.isInteger(auxiliaryTransferId)) {
    return null;
  }

  const transferPointerAddress = SPRITE_TRANSFER_POINTER_TABLE + auxiliaryTransferId * 2;
  const variantAddress = readPrgWord(rom, info, transferPointerAddress, {
    bank: SPRITE_TRANSFER_POINTER_TABLE_BANK
  });
  const variantBank = actorSpritePaletteVariantBank(variantAddress);
  const common = readPrgBytes(
    rom,
    info,
    COMMON_SPRITE_PALETTE_ADDRESS,
    COMMON_SPRITE_PALETTE_LENGTH
  );
  const variant = readPrgBytes(
    rom,
    info,
    variantAddress,
    VARIANT_SPRITE_PALETTE_LENGTH,
    variantBank == null ? {} : { bank: variantBank }
  );

  return {
    bytes: common.concat(variant),
    auxiliaryTransferId,
    transferPointerAddress,
    variantAddress,
    variantBank,
    source: [
      `rom:${toHex(COMMON_SPRITE_PALETTE_ADDRESS, 4)}..${toHex(COMMON_SPRITE_PALETTE_ADDRESS + COMMON_SPRITE_PALETTE_LENGTH - 1, 4)}`,
      `rom-bank${SPRITE_TRANSFER_POINTER_TABLE_BANK}:${toHex(transferPointerAddress, 4)}..${toHex(transferPointerAddress + 1, 4)}`,
      `aux:${toHex(auxiliaryTransferId, 2)}`,
      variantBank == null
        ? `rom:${toHex(variantAddress, 4)}..${toHex(variantAddress + VARIANT_SPRITE_PALETTE_LENGTH - 1, 4)}`
        : `rom-bank${variantBank}:${toHex(variantAddress, 4)}..${toHex(variantAddress + VARIANT_SPRITE_PALETTE_LENGTH - 1, 4)}`
    ].join('+')
  };
}

function sameBytes(left, right) {
  return left.length === right.length && left.every((byte, index) => byte === right[index]);
}

function normalizeSpritePaletteBytes(rawBytes, id) {
  const bytes = rawBytes.map((byte, index) => parseByte(byte, `${id}.bytes[${index}]`));
  const normalized = bytes.length === 32 ? bytes.slice(0x10, 0x20) : bytes;
  if (normalized.length !== 16) {
    throw new Error(`Sprite palette ${id} must contain 16 sprite bytes or 32 full PPU palette bytes`);
  }
  return normalized;
}

function discoverGuideManifestFiles(opts = {}) {
  if (Array.isArray(opts.manifestFiles) && opts.manifestFiles.length > 0) {
    return opts.manifestFiles;
  }

  const guideAssetsDir = opts.guideAssetsDir || path.join('guide', 'assets');
  const files = [];
  const slicesDir = path.join(guideAssetsDir, 'slices');
  const scenesDir = path.join(guideAssetsDir, 'scenes');

  if (fs.existsSync(slicesDir)) {
    for (const entry of fs.readdirSync(slicesDir)) {
      const candidate = path.join(slicesDir, entry, 'slice.json');
      if (fs.existsSync(candidate)) {
        files.push(candidate);
      }
    }
  }

  if (fs.existsSync(scenesDir)) {
    for (const entry of fs.readdirSync(scenesDir)) {
      const candidate = path.join(scenesDir, entry, 'slice.json');
      if (fs.existsSync(candidate)) {
        files.push(candidate);
      }
    }
  }

  return files.sort();
}

function collectSpritePaletteUses(manifest) {
  const uses = [];

  function visit(value, trail, inheritedSegmentId = null, inheritedId = null) {
    if (!value || typeof value !== 'object') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${trail}[${index}]`, inheritedSegmentId, inheritedId));
      return;
    }

    const segmentId = value.segmentId || inheritedSegmentId;
    const id = value.id || inheritedId || trail;
    if (value.paletteByVariant && segmentId) {
      uses.push({
        id,
        segmentId,
        paletteByVariant: value.paletteByVariant,
        path: trail
      });
    }

    for (const [key, child] of Object.entries(value)) {
      visit(child, trail ? `${trail}.${key}` : key, segmentId, id);
    }
  }

  visit({
    actors: manifest.actors || [],
    secretFeatures: manifest.secretFeatures || [],
    itemIcons: manifest.itemIcons || {},
    doorHotspots: manifest.doorHotspots || []
  }, '');

  return uses;
}

function auditGuideSpritePalettes(rom, info, opts = {}) {
  const atlasFile = opts.atlasFile || path.join('out', 'render-recipe-atlas', 'manifest.json');
  const atlas = readJson(atlasFile);
  const atlasById = new Map((atlas.entries || []).map((entry) => [entry.id, entry]));
  const manifestFiles = discoverGuideManifestFiles(opts);
  const mismatches = [];
  const skipped = [];
  let usesChecked = 0;

  for (const manifestFile of manifestFiles) {
    const manifest = readJson(manifestFile);
    const segmentById = new Map((manifest.segments || []).map((segment) => [segment.id, segment]));
    const spritePaletteById = new Map(
      (manifest.spritePalettes || []).map((palette) => [
        palette.id,
        normalizeSpritePaletteBytes(palette.bytes || [], palette.id)
      ])
    );

    for (const use of collectSpritePaletteUses(manifest)) {
      const segment = segmentById.get(use.segmentId);
      if (!segment) {
        skipped.push({
          manifest: manifestFile,
          id: use.id,
          path: use.path,
          segmentId: use.segmentId,
          reason: 'missing-segment'
        });
        continue;
      }

      for (const [variant, paletteId] of Object.entries(use.paletteByVariant)) {
        const atlasEntryId = segment.atlasEntries?.[variant];
        if (!atlasEntryId) {
          skipped.push({
            manifest: manifestFile,
            id: use.id,
            path: use.path,
            segmentId: use.segmentId,
            variant,
            paletteId,
            reason: 'missing-segment-atlas-entry'
          });
          continue;
        }

        const atlasEntry = atlasById.get(atlasEntryId);
        const expected = expectedSpritePaletteForAtlasEntry(rom, info, atlasEntry);
        if (!expected) {
          skipped.push({
            manifest: manifestFile,
            id: use.id,
            path: use.path,
            segmentId: use.segmentId,
            variant,
            paletteId,
            atlasEntryId,
            reason: 'atlas-entry-has-no-sprite-palette-transfer'
          });
          continue;
        }

        const actual = spritePaletteById.get(paletteId);
        if (!actual) {
          mismatches.push({
            manifest: manifestFile,
            id: use.id,
            path: use.path,
            segmentId: use.segmentId,
            variant,
            atlasEntryId,
            paletteId,
            reason: 'missing-sprite-palette'
          });
          continue;
        }

        usesChecked += 1;
        if (!sameBytes(actual, expected.bytes)) {
          mismatches.push({
            manifest: manifestFile,
            id: use.id,
            path: use.path,
            segmentId: use.segmentId,
            variant,
            atlasEntryId,
            paletteId,
            actual: formatBytes(actual),
            expected: formatBytes(expected.bytes),
            expectedSource: expected.source
          });
        }
      }
    }
  }

  const audit = {
    atlasFile,
    manifests: manifestFiles,
    summary: {
      manifests: manifestFiles.length,
      usesChecked,
      skipped: skipped.length,
      mismatches: mismatches.length
    },
    mismatches,
    skipped
  };

  if (opts.outDir) {
    writeJson(path.join(opts.outDir, 'audit.json'), audit);
  }

  return audit;
}

module.exports = {
  auditGuideSpritePalettes,
  discoverGuideManifestFiles
};
