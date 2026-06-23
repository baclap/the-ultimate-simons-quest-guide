'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte, readPrgWord } = require('./background');
const { decodeMetaspriteSelector, decodeSelectorRecordAt, renderSelectorStrip } = require('./actor-selector-streams');
const { buildPatternTableFromChrBanks } = require('./native-image');
const { writePng } = require('./png');

const DEFAULT_OUT_DIR = path.join('out', 'guide-actor-sprite-coverage');
const ACTOR_DISPATCH_TABLE = 0x81d3;
const SELECTOR_RECORD_BASE = 0xdda2;
const FIXED_BANK = 7;
const SWITCHABLE_BANK = 1;
const DED0_SELECTOR_WRITE = 0xded0;

const TOWN_PALETTE_CAPTURE = path.join('out', 'captures', 'jova-day', 'ppu-3f00-3f1f-palettes.bin');
const TOWN_NIGHT_PALETTE_CAPTURE = path.join('out', 'captures', 'jova-town-night', 'ppu-3f00-3f1f-palettes.bin');
const WOODS_PALETTE_CAPTURE = path.join('out', 'captures', 'jova-woods-day', 'ppu-3f00-3f1f-palettes.bin');
const AA_RUNTIME_CAPTURE = path.join(
  'out',
  'transition-probes',
  'jova-town-interior-round-trip',
  'jova-town-to-interior-after-cpu-0000-07ff.bin'
);
const FISHMAN_PROOF = path.join('out', 'fishman-sprite-proof', 'analysis.json');

const TOWN_ROWS = [
  {
    key: 'jova-shepherd',
    label: 'Jova shepherd',
    kind: 'npc',
    actorId: 0xb5,
    liveId: 0x35,
    selectorRecordIndex: 0x0e,
    dispatchTarget: 0x8f50,
    proofAddress: 0x8f5d,
    rows: [
      { offset: 0x50bc, bytes: [0x04, 0x0c, 0xb5, 0x38], text: 'first thing to do in this town is buy a white crystal.' },
      { offset: 0x50c0, bytes: [0x04, 0x1a, 0xb5, 0x3d], text: 'you have a friend in the town of aldra. go and see him.' },
      { offset: 0x50c4, bytes: [0x08, 0x12, 0xb5, 0x3e], text: "13 clues will solve dracula's riddle." },
      { offset: 0x50d0, bytes: [0x14, 0x1a, 0xb5, 0x41], text: 'a magic potion will destroy the wall of evil.' },
      { offset: 0x50e4, bytes: [0x24, 0x0c, 0xb5, 0x4c], text: 'a crooked trader is offering bum deals in this town.' }
    ],
    proof: 'Live actor $35 branches to animation record $0E; record $0E emits selectors $24/$25. Existing Jova day RAM captures also show row data $3E with selector $24.'
  },
  {
    key: 'jova-man',
    label: 'Jova man',
    kind: 'npc',
    actorId: 0xaa,
    liveId: 0x2a,
    selectorRecordIndex: 0x0d,
    dispatchTarget: 0x8f0b,
    proofAddress: 0x8f19,
    rows: [
      { offset: 0x50d8, bytes: [0x18, 0x14, 0xaa, 0x44], text: 'rumor has it, the ferryman at dead river loves garlic.' },
      { offset: 0x50e8, bytes: [0x28, 0x14, 0xaa, 0x4d], text: 'a flame is on top of the 6th tree in denis woods.' }
    ],
    runtimeSlot: { capture: AA_RUNTIME_CAPTURE, activeId: 0x2a, selector: 0x22, rowData: 0x44 },
    proof: 'Live actor $2A loads animation record $0D. The older Jova transition probe also catches row data $44 live with selector $22, matching the first selector in record $0D.'
  },
  {
    key: 'jova-a8',
    label: 'Jova clue NPC $A8',
    kind: 'npc',
    actorId: 0xa8,
    liveId: 0x28,
    selectorRecordIndex: 0x0d,
    dispatchTarget: 0x8ee2,
    proofAddress: 0x8eec,
    rows: [
      { offset: 0x50ec, bytes: [0x2c, 0x1a, 0xa8, 0x4e], text: "clues to dracula's riddle are in the town of veros." }
    ],
    proof: 'The row byte $A8 becomes live actor $28 through the town high-bit path. Dispatch entry $28 starts by loading animation record $0D, the same town-man record proven live for $AA.'
  },
  {
    key: 'jova-merchant',
    label: 'White-crystal merchant',
    kind: 'npc',
    actorId: 0xae,
    liveId: 0x2e,
    selectorRecordIndex: 0x0b,
    dispatchTarget: 0x83cc,
    proofAddress: 0x83d8,
    rows: [
      { offset: 0x50f8, bytes: [0x34, 0x12, 0xae, 0x07], text: 'buy a white crystal?' }
    ],
    proof: 'Live actor $2E indexes the small merchant selector table at $83F3. Table entry $0B resolves to selectors $1E/$1F; existing Jova right RAM captures show selector $1E for the merchant slot.'
  },
  {
    key: 'jova-sign',
    label: 'Jova sign fixture',
    kind: 'fixture',
    actorId: 0xa4,
    liveId: 0x24,
    dispatchTarget: 0x905a,
    proofAddress: 0x905f,
    rows: [
      { offset: 0x50c8, bytes: [0x0c, 0x1a, 0xa4, 0x3a], text: 'turn right for the jova woods. left for belasco marsh.' }
    ],
    proof: 'Dispatch entry $24 calls $DED0 with Y=$00. $DED0 stores Y to $0300,x, and selector $00 decodes to zero OAM sprites, so the sign is a background fixture with interaction text, not a rendered actor sprite.'
  }
];

const ENEMY_ROWS = [
  {
    key: 'skeleton',
    label: 'Skeleton',
    kind: 'enemy',
    actorId: 0x03,
    selectorRecordIndex: 0x05,
    chrBanks: [0x02, 0x03],
    paletteCapture: WOODS_PALETTE_CAPTURE,
    image: 'skeleton.png',
    locations: ['Jova Woods', 'South Bridge', 'Veros Woods', 'Denis Woods'],
    hp: { day: 1, night: 2 },
    proof: 'Selector-stream record $DDB1 emits $0E/$0F, proven from live actor traces and decoded from fixed-bank ROM.'
  },
  {
    key: 'werewolf',
    label: 'Werewolf',
    kind: 'enemy',
    actorId: 0x13,
    selectorRecordIndex: 0x1e,
    chrBanks: [0x02, 0x03],
    paletteCapture: WOODS_PALETTE_CAPTURE,
    image: 'werewolf.png',
    locations: ['Jova Woods'],
    hp: { day: 2, night: 4 },
    proof: 'Selector-stream record $DDFC emits $65/$66, proven from live Jova Woods traces.'
  },
  {
    key: 'zombie',
    label: 'Zombie',
    kind: 'enemy',
    actorId: 0x17,
    selectorRecordIndex: 0x37,
    chrBanks: [0x00, 0x01],
    paletteCapture: TOWN_NIGHT_PALETTE_CAPTURE,
    image: 'zombie.png',
    locations: ['Town of Jova at night'],
    hp: { day: null, night: 2 },
    proof: 'Selector-stream record $DE47 emits the town-night zombie selectors. The town actor gate suppresses these rows during day and loads them at night.'
  }
];

function hex(value, width = 2) {
  if (value == null) {
    return null;
  }
  const number = Number(value);
  if (!Number.isInteger(number)) {
    throw new Error(`cannot format invalid hex value: ${value}`);
  }
  return `0x${number.toString(16).toUpperCase().padStart(width, '0')}`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeEvidenceJs(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `window.GUIDE_ACTOR_SPRITE_COVERAGE = ${JSON.stringify(value, null, 2)};\n`);
}

function publicBytes(bytes) {
  return Array.from(bytes).map((byte) => hex(byte, 2));
}

function publicSpritePalettes(palettes) {
  const out = [];
  for (let palette = 0; palette < 4; palette += 1) {
    const start = 0x10 + palette * 4;
    out.push(publicBytes(palettes.subarray(start, start + 4)));
  }
  return out;
}

function readBytesFromRomFile(rom, offset, expected) {
  const actual = Array.from(rom.subarray(offset, offset + expected.length));
  const matches = actual.length === expected.length && actual.every((byte, index) => byte === expected[index]);
  if (!matches) {
    throw new Error(`ROM row at ${hex(offset, 4)} expected ${publicBytes(expected).join(' ')} but found ${publicBytes(actual).join(' ')}`);
  }
  return actual;
}

function readSwitchableBytes(rom, info, cpuAddress, count, bank = SWITCHABLE_BANK) {
  const bytes = [];
  for (let i = 0; i < count; i += 1) {
    bytes.push(readPrgByte(rom, info, cpuAddress + i, { bank }));
  }
  return bytes;
}

function readFixedBytes(rom, info, cpuAddress, count) {
  const bytes = [];
  for (let i = 0; i < count; i += 1) {
    bytes.push(readPrgByte(rom, info, cpuAddress + i, { fixedBank: FIXED_BANK }));
  }
  return bytes;
}

function dispatchTargetForLiveId(rom, info, liveId) {
  const pointerAddress = ACTOR_DISPATCH_TABLE + liveId * 2;
  return {
    pointerAddress,
    target: readPrgWord(rom, info, pointerAddress, { bank: SWITCHABLE_BANK }),
    bytes: readSwitchableBytes(rom, info, pointerAddress, 2)
  };
}

function selectorRecordForIndex(rom, info, index) {
  const cpuAddress = SELECTOR_RECORD_BASE + index * 3;
  return decodeSelectorRecordAt(rom, info, cpuAddress);
}

function publicSelectorRecord(record) {
  return {
    index: hex(record.recordIndex, 2),
    cpuAddress: hex(record.cpuAddress, 4),
    fileOffset: hex(record.fileOffset, 5),
    bytes: publicBytes(record.bytes),
    selectors: record.selectors.map((selector) => hex(selector, 2)),
    frameLimit: record.frameLimit,
    baseSelector: hex(record.baseSelector, 2),
    sidecar: hex(record.sidecar, 2)
  };
}

function publicMetasprite(rom, info, selector) {
  const decoded = decodeMetaspriteSelector(rom, info, selector);
  return {
    selector: hex(selector, 2),
    pointer: hex(decoded.pointer.target, 4),
    status: hex(decoded.status, 2),
    count: decoded.count,
    usesSharedShape: decoded.usesSharedShape,
    shapePointer: decoded.shapePointer ? hex(decoded.shapePointer, 4) : null,
    sprites: decoded.sprites.map((sprite) => ({
      tile: hex(sprite.tile, 2),
      attr: hex(sprite.attr, 2),
      palette: sprite.attr & 0x03,
      xOffset: sprite.xOffset,
      yOffset: sprite.yOffset
    }))
  };
}

function findRuntimeSlot(capturePath, expected) {
  if (!fs.existsSync(capturePath)) {
    return null;
  }

  const cpu = fs.readFileSync(capturePath);
  for (let slot = 0; slot < 0x12; slot += 1) {
    const activeId = cpu[0x03b4 + slot];
    const selector = cpu[0x0300 + slot];
    const rowData = cpu[0x04d4 + slot];
    if (activeId === expected.activeId && selector === expected.selector && rowData === expected.rowData) {
      return {
        capture: capturePath,
        slot,
        activeId: hex(activeId, 2),
        selector: hex(selector, 2),
        rowData: hex(rowData, 2),
        screenX: cpu[0x0348 + slot],
        screenY: cpu[0x0324 + slot],
        state: hex(cpu[0x03d8 + slot], 2),
        sidecar: hex(cpu[0x03ea + slot], 2)
      };
    }
  }

  return null;
}

function renderSelectorRecord(rom, info, outDir, entry, opts) {
  const record = selectorRecordForIndex(rom, info, entry.selectorRecordIndex);
  const patterns = buildPatternTableFromChrBanks(rom, info, opts.chrBanks);
  const palettes = opts.palettes || fs.readFileSync(opts.paletteCapture);
  const rendered = renderSelectorStrip(rom, info, record, {
    patterns,
    palettes,
    baseAttr: 0,
    largeSprites: true,
    spritePatternBase: 0x1000
  });
  const output = path.join(outDir, 'sprites', entry.image || `${entry.key}.png`);
  writePng(output, rendered.width, rendered.height, rendered.rgba);
  return {
    output,
    image: path.relative(outDir, output),
    width: rendered.width,
    height: rendered.height,
    record: publicSelectorRecord(record),
    ppuSpritePalettes: publicSpritePalettes(palettes),
    metasprites: record.selectors.map((selector) => publicMetasprite(rom, info, selector)),
    render: rendered.metadata
  };
}

function renderDirectSelector(rom, info, outDir, entry, selector, opts) {
  const patterns = buildPatternTableFromChrBanks(rom, info, opts.chrBanks);
  const palettes = opts.palettes || fs.readFileSync(opts.paletteCapture);
  const record = {
    selectors: [selector]
  };
  const rendered = renderSelectorStrip(rom, info, record, {
    patterns,
    palettes,
    baseAttr: 0,
    largeSprites: true,
    spritePatternBase: 0x1000
  });
  const output = path.join(outDir, 'sprites', entry.image);
  writePng(output, rendered.width, rendered.height, rendered.rgba);
  return {
    output,
    image: path.relative(outDir, output),
    width: rendered.width,
    height: rendered.height,
    selector: hex(selector, 2),
    ppuSpritePalettes: publicSpritePalettes(palettes),
    metasprites: [publicMetasprite(rom, info, selector)],
    render: rendered.metadata
  };
}

function parsePaletteMemory(hexBytes) {
  return Buffer.from(hexBytes.map((value) => Number.parseInt(String(value).replace(/^0x/i, ''), 16)));
}

function renderFishman(rom, info, outDir) {
  const fishmanProof = readJson(FISHMAN_PROOF);
  const variant = fishmanProof.proof.paletteAndChr.variants.find((candidate) => candidate.id === 'south-bridge-day');
  if (!variant) {
    throw new Error(`Fishman proof does not include south-bridge-day palette variant: ${FISHMAN_PROOF}`);
  }

  const palettes = parsePaletteMemory(variant.palette.ppuPaletteMemory);
  const body = renderSelectorRecord(rom, info, outDir, {
    key: 'fishman-body',
    image: 'fishman-body.png',
    selectorRecordIndex: 0x06
  }, {
    chrBanks: [0x02, 0x03],
    palettes
  });
  const attack = renderDirectSelector(rom, info, outDir, {
    key: 'fishman-attack',
    image: 'fishman-attack.png'
  }, 0x67, {
    chrBanks: [0x02, 0x03],
    palettes
  });

  return {
    key: 'fishman',
    label: 'Fishman',
    kind: 'enemy',
    actorId: hex(0x04, 2),
    locations: ['South Bridge', 'Denis Woods - Part 1'],
    hp: { day: 1, night: 2 },
    status: 'covered',
    proof: 'Fishman body selectors come from record $DDB4 and the attack state writes selector $67 directly. Palette bytes come from the ROM palette selector chain captured in the fishman proof.',
    upstreamProof: FISHMAN_PROOF,
    paletteVariant: {
      id: variant.id,
      label: variant.label,
      spritePalette2: variant.palette.spritePalette2
    },
    sprites: [body, attack]
  };
}

function buildTownActor(rom, info, outDir, actor) {
  const dispatch = dispatchTargetForLiveId(rom, info, actor.liveId);
  if (dispatch.target !== actor.dispatchTarget) {
    throw new Error(`Actor ${actor.key} dispatch expected ${hex(actor.dispatchTarget, 4)} but found ${hex(dispatch.target, 4)}`);
  }

  const rows = actor.rows.map((row) => {
    const bytes = readBytesFromRomFile(rom, row.offset, row.bytes);
    return {
      offset: hex(row.offset, 4),
      rawBytes: publicBytes(bytes),
      tileX: bytes[0],
      tileY: bytes[1],
      pixelX: bytes[0] * 16,
      pixelY: bytes[1] * 16,
      actorId: hex(bytes[2], 2),
      liveId: hex(bytes[2] & 0x7f, 2),
      data: hex(bytes[3], 2),
      text: row.text
    };
  });

  const base = {
    key: actor.key,
    label: actor.label,
    kind: actor.kind,
    actorId: hex(actor.actorId, 2),
    liveId: hex(actor.liveId, 2),
    status: actor.kind === 'fixture' ? 'covered-no-sprite-fixture' : 'covered',
    rows,
    dispatch: {
      table: hex(ACTOR_DISPATCH_TABLE, 4),
      pointerAddress: hex(dispatch.pointerAddress, 4),
      pointerBytes: publicBytes(dispatch.bytes),
      target: hex(dispatch.target, 4),
      proofBytesAddress: hex(actor.proofAddress, 4),
      proofBytes: publicBytes(readSwitchableBytes(rom, info, actor.proofAddress, 8))
    },
    proof: actor.proof
  };

  if (actor.kind === 'fixture') {
    const zero = decodeMetaspriteSelector(rom, info, 0x00);
    return {
      ...base,
      sprite: null,
      noSprite: {
        selector: hex(0x00, 2),
        selectorCount: zero.count,
        ded0Address: hex(DED0_SELECTOR_WRITE, 4),
        ded0Bytes: publicBytes(readFixedBytes(rom, info, DED0_SELECTOR_WRITE, 8)),
        meaning: '$DED0 stores A to $03D8,x, transfers Y to A, then stores Y as the current metasprite selector at $0300,x.'
      }
    };
  }

  const rendered = renderSelectorRecord(rom, info, outDir, {
    key: actor.key,
    image: `${actor.key}.png`,
    selectorRecordIndex: actor.selectorRecordIndex
  }, {
    chrBanks: [0x00, 0x01],
    paletteCapture: TOWN_PALETTE_CAPTURE
  });

  return {
    ...base,
    selectorRecordIndex: hex(actor.selectorRecordIndex, 2),
    sprite: rendered,
    runtimeSlot: actor.runtimeSlot ? findRuntimeSlot(actor.runtimeSlot.capture, actor.runtimeSlot) : null
  };
}

function buildEnemyActor(rom, info, outDir, actor) {
  const rendered = renderSelectorRecord(rom, info, outDir, actor, {
    chrBanks: actor.chrBanks,
    paletteCapture: actor.paletteCapture
  });

  return {
    key: actor.key,
    label: actor.label,
    kind: actor.kind,
    actorId: hex(actor.actorId, 2),
    status: 'covered',
    locations: actor.locations,
    hp: actor.hp,
    proof: actor.proof,
    sprite: rendered
  };
}

function decodeGuideActorSpriteCoverage(rom, info, opts = {}) {
  const outDir = path.resolve(opts.outDir || DEFAULT_OUT_DIR);
  fs.mkdirSync(path.join(outDir, 'sprites'), { recursive: true });

  const townActors = TOWN_ROWS.map((actor) => buildTownActor(rom, info, outDir, actor));
  const enemies = ENEMY_ROWS.map((actor) => buildEnemyActor(rom, info, outDir, actor));
  enemies.splice(1, 0, renderFishman(rom, info, outDir));

  const coveredSprites = [
    ...townActors.filter((actor) => actor.sprite),
    ...enemies
  ];
  const noSpriteFixtures = townActors.filter((actor) => actor.status === 'covered-no-sprite-fixture');
  const missing = [...townActors, ...enemies].filter((actor) => !actor.status.startsWith('covered'));

  const analysis = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    title: 'Guide Actor Sprite Coverage',
    summary: {
      status: missing.length === 0 ? 'complete-for-current-guide-slice' : 'incomplete',
      actorsCovered: townActors.length + enemies.length,
      renderedActorClasses: coveredSprites.length,
      noSpriteFixtures: noSpriteFixtures.length,
      missing: missing.length,
      townNpcClasses: townActors.filter((actor) => actor.kind === 'npc').length,
      enemyClasses: enemies.length
    },
    provenance: [
      'Actor rows are verified directly from ROM file offsets.',
      'Town high-bit actor ids are matched to live ids by masking with $7F, consistent with the already-captured shepherd and merchant slots.',
      'Actor dispatch entries are read from bank 1 table $81D3.',
      'Animation records are decoded from the fixed-bank selector table rooted at $DDA2.',
      'Sprite pixels are rendered from PRG metasprite tables, CHR ROM banks, and runtime PPU palette memory captured from the same ROM execution.',
      'The fishman color variant uses the previously generated fishman proof, which derives palette bytes through the ROM palette selector path.'
    ],
    townActors,
    enemies,
    integrationStatus: [
      { item: 'Town NPC row locations', status: 'covered' },
      { item: 'Town NPC sprites', status: 'covered' },
      { item: 'Town NPC text', status: 'covered' },
      { item: 'Town sign', status: 'covered as background fixture; no actor sprite exists' },
      { item: 'Guide-slice enemy sprites', status: 'covered' },
      { item: 'Guide-slice enemy HP day/night values', status: 'covered' }
    ],
    shortcuts: []
  };

  const analysisOutput = path.join(outDir, 'analysis.json');
  const evidenceOutput = path.join(outDir, 'evidence.js');
  writeJson(analysisOutput, analysis);
  writeEvidenceJs(evidenceOutput, analysis);

  return {
    output: analysisOutput,
    evidenceOutput,
    spriteDir: path.join(outDir, 'sprites'),
    summary: analysis.summary
  };
}

module.exports = {
  decodeGuideActorSpriteCoverage
};
