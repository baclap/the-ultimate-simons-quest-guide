'use strict';

const fs = require('fs');
const path = require('path');
const { deriveBackgroundContext } = require('./background-context');
const { buildManifest } = require('./manifest');

const DEFAULT_ATLAS_FILE = path.join('out', 'render-recipe-atlas', 'manifest.json');
const DEFAULT_OUT_DIR = path.join('out', 'interior-map-research');
const ACTOR_ROW_TERMINATOR = 0xff;
const BERKELEY_ACTOR_TABLE_START_BY_SUBMAP = new Map([
  [0, 0x5ad4],
  [1, 0x5b3d]
]);

const BERKELEY_ACTOR_COVERAGE = new Map([
  [0x03, { classId: 'mansion-skeleton', status: 'promoted', evidence: 'ROM row id $03, selector record $05, fixed mansion CHR/palette.' }],
  [0x05, { classId: 'mansion-spear-knight', status: 'promoted', evidence: 'Berkeley runtime trace observes id $05 selectors $35/$36; selector record $13.' }],
  [0x0d, { classId: 'mansion-bone-thrower', status: 'promoted', evidence: 'Dispatch entry $0D initializes selector record $05; Berkeley rows carry HP $02.' }],
  [0x0f, { classId: 'mansion-gargoyle', status: 'promoted', evidence: 'Dispatch entry $0F initializes selector record $12.' }],
  [0x1f, { classId: 'blob', status: 'promoted-direct-selector', evidence: 'Dispatch entry $1F uses direct $DED0 selector path with selector $3C during initialization and selector $3D during neutral animation.' }],
  [0x22, { classId: null, status: 'control', evidence: 'ROM row is the Part 1 crystal-gated moving-platform control row at $5AD8; it is promoted through guide secretFeatures rather than the normal actor layer.' }],
  [0x25, { classId: 'dracula-rib-orb', status: 'promoted-direct-selector', evidence: 'Dispatch entry $25 uses direct $DED0 selector writes during the orb sequence.' }],
  [0x27, { classId: 'mansion-book', status: 'promoted', evidence: 'Dispatch entry $27 uses selector record $3B; text is decoded from ROM file offsets.' }],
  [0xae, { classId: 'oak-stake-merchant', status: 'promoted', evidence: 'High-bit merchant row maps to live id $2E and merchant selector record $0B; text decoded from ROM file offset.' }]
]);

function hex(value, width = 2) {
  if (value == null) {
    return null;
  }
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function guideLocationId(loc) {
  return [
    `obj${Number(loc.objset).toString(16).padStart(2, '0')}`,
    `area${Number(loc.area).toString(16).padStart(2, '0')}`,
    `sub${Number(loc.submap || 0).toString(16).padStart(2, '0')}`,
    slugify(loc.name)
  ].join('-');
}

function loadAtlas(filePath) {
  const resolved = path.resolve(filePath || DEFAULT_ATLAS_FILE);
  if (!fs.existsSync(resolved)) {
    return { file: resolved, entries: [] };
  }
  const atlas = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  return {
    file: resolved,
    entries: atlas.entries || []
  };
}

function atlasEntryFor(atlas, loc) {
  const id = `${guideLocationId(loc)}-fixed`;
  return atlas.entries.find((entry) => entry.id === id);
}

function publicActorRow(row) {
  const expectedBytes = [row.x, row.y, row.id, row.data];
  const raw = row.rawActorRow || null;
  const byteMatch = raw
    ? expectedBytes.every((byte, index) => byte === raw.bytes[index])
    : false;
  const coverage = BERKELEY_ACTOR_COVERAGE.get(row.id) || {
    classId: null,
    status: 'unmapped',
    evidence: 'No guide class mapping exists for this actor id yet.'
  };
  return {
    pointer: hex(row.pointer, 5),
    kind: row.kind,
    name: row.name,
    actorId: row.idHex,
    x: row.x,
    y: row.y,
    data: row.dataHex,
    itemType: row.itemType || null,
    textFileOffset: row.textPointer == null ? null : hex(row.textPointer, 5),
    romRow: raw ? {
      status: byteMatch ? 'byte-exact' : 'byte-mismatch',
      pointer: raw.pointerHex,
      bytes: raw.bytesHex,
      source: 'rom-file-actor-row'
    } : {
      status: 'missing',
      source: 'manifest-row-without-rom-row-match'
    },
    coverage
  };
}

function publicRawActorRow(row) {
  const coverage = BERKELEY_ACTOR_COVERAGE.get(row.id) || {
    classId: null,
    status: 'unmapped',
    evidence: 'No guide class mapping exists for this raw ROM row yet.'
  };
  return {
    pointer: row.pointerHex,
    x: row.x,
    y: row.y,
    actorId: row.idHex,
    data: row.dataHex,
    bytes: row.bytesHex,
    coverage
  };
}

function readRawActorRows(rom, startOffset) {
  const rows = [];
  let pointer = startOffset;
  while (pointer < rom.length && rom[pointer] !== ACTOR_ROW_TERMINATOR) {
    if (pointer + 3 >= rom.length) {
      throw new Error(`Actor row at ${hex(pointer, 5)} extends beyond ROM`);
    }
    const bytes = [rom[pointer], rom[pointer + 1], rom[pointer + 2], rom[pointer + 3]];
    rows.push({
      pointer,
      pointerHex: hex(pointer, 5),
      x: bytes[0],
      y: bytes[1],
      id: bytes[2],
      idHex: hex(bytes[2], 2),
      data: bytes[3],
      dataHex: hex(bytes[3], 2),
      bytes,
      bytesHex: bytes.map((byte) => hex(byte, 2))
    });
    pointer += 4;
  }
  if (pointer >= rom.length) {
    throw new Error(`Actor table starting at ${hex(startOffset, 5)} has no ${hex(ACTOR_ROW_TERMINATOR, 2)} terminator`);
  }
  return {
    startOffset,
    startOffsetHex: hex(startOffset, 5),
    terminatorOffset: pointer,
    terminatorOffsetHex: hex(pointer, 5),
    rows
  };
}

function actorSummary(locations, rawTablesByLocationId) {
  const rows = locations.flatMap((loc) => loc.actors || []);
  const rawRows = [...rawTablesByLocationId.values()].flatMap((table) => table.rows || []);
  const byKind = {};
  const byActorId = {};
  for (const row of rows) {
    byKind[row.kind] = (byKind[row.kind] || 0) + 1;
    byActorId[row.idHex] = (byActorId[row.idHex] || 0) + 1;
  }
  const rawByActorId = {};
  const unmapped = [];
  const control = [];
  const promoted = [];
  for (const row of rawRows) {
    rawByActorId[row.idHex] = (rawByActorId[row.idHex] || 0) + 1;
    const coverage = BERKELEY_ACTOR_COVERAGE.get(row.id);
    if (!coverage) {
      unmapped.push(row);
    } else if (coverage.status === 'control') {
      control.push(row);
    } else {
      promoted.push(row);
    }
  }
  const manifestPointers = new Set(rows.map((row) => row.pointer));
  const silentRawRows = rawRows.filter((row) => (
    !manifestPointers.has(row.pointer) &&
    BERKELEY_ACTOR_COVERAGE.get(row.id)?.status !== 'control'
  ));
  const missingRawRows = rows.filter((row) => !row.rawActorRow);
  const byteMismatches = rows.filter((row) => (
    row.rawActorRow &&
    ![row.x, row.y, row.id, row.data].every((byte, index) => byte === row.rawActorRow.bytes[index])
  ));
  return {
    promotedManifestRows: rows.length,
    rawRomRows: rawRows.length,
    rawPromotedRows: promoted.length,
    rawControlRows: control.length,
    byKind,
    byActorId,
    rawByActorId,
    controlRows: control.map((row) => row.pointerHex),
    unmappedRows: unmapped.map((row) => row.pointerHex),
    missingRawRows: missingRawRows.map((row) => hex(row.pointer, 5)),
    byteMismatches: byteMismatches.map((row) => hex(row.pointer, 5)),
    silentRawRows: silentRawRows.map((row) => row.pointerHex),
    status: unmapped.length === 0 &&
      missingRawRows.length === 0 &&
      byteMismatches.length === 0 &&
      silentRawRows.length === 0
      ? 'complete'
      : 'incomplete'
  };
}

function computeComposition(locations, atlasEntriesByLocationId) {
  const placements = [];
  let cursorX = 0;
  let status = 'complete';
  const notes = [];

  for (let index = 0; index < locations.length; index += 1) {
    const loc = locations[index];
    const id = guideLocationId(loc);
    const atlasEntry = atlasEntriesByLocationId.get(id);
    if (!atlasEntry) {
      status = 'blocked';
      notes.push(`${loc.name} has no fixed atlas entry.`);
      continue;
    }

    if (index > 0 && !loc.entryRoom) {
      status = 'blocked';
      notes.push(`${loc.name} has no entryRoom relationship.`);
    }

    placements.push({
      locationId: id,
      name: loc.name,
      submap: loc.submap || 0,
      entryRoom: loc.entryRoom || null,
      x: cursorX,
      y: 0,
      width: atlasEntry.width,
      height: atlasEntry.height,
      placementEvidence: index === 0
        ? 'Root interior submap.'
        : 'Submap is chained from entryRoom metadata and composed as direct horizontal continuation pending runtime transition probe.'
    });
    cursorX += atlasEntry.width;
  }

  return {
    status,
    method: 'entry-room-chain-horizontal',
    caveat: 'This proves inventory and renderable submap order. A future runtime transition probe should replace the placementEvidence caveat with Simon/scroll alignment bytes.',
    notes,
    placements
  };
}

function analyzeInteriorMap(rom, info, opts = {}) {
  const manifest = buildManifest();
  const objset = opts.objset;
  const area = opts.area;
  const id = opts.id || `obj${Number(objset).toString(16).padStart(2, '0')}-area${Number(area).toString(16).padStart(2, '0')}`;
  const atlas = loadAtlas(opts.atlasFile);
  const locations = manifest.locations
    .filter((loc) => loc.objset === objset && loc.area === area && !/ - Door$/.test(loc.name))
    .sort((a, b) => (a.submap || 0) - (b.submap || 0));

  if (locations.length === 0) {
    throw new Error(`No interior locations found for objset ${hex(objset)} area ${hex(area)}`);
  }

  const atlasEntriesByLocationId = new Map();
  const rawTablesByLocationId = new Map();
  for (const loc of locations) {
    const locationId = guideLocationId(loc);
    const startOffset = BERKELEY_ACTOR_TABLE_START_BY_SUBMAP.get(loc.submap || 0);
    if (startOffset == null) {
      continue;
    }
    const table = readRawActorRows(rom, startOffset);
    rawTablesByLocationId.set(locationId, table);
  }

  const submaps = locations.map((loc) => {
    const locationId = guideLocationId(loc);
    const atlasEntry = atlasEntryFor(atlas, loc);
    const rawTable = rawTablesByLocationId.get(locationId);
    const rawRowsByPointer = new Map((rawTable?.rows || []).map((row) => [row.pointer, row]));
    const actors = (loc.actors || []).map((row) => publicActorRow({
      ...row,
      rawActorRow: rawRowsByPointer.get(row.pointer)
    }));
    if (atlasEntry) {
      atlasEntriesByLocationId.set(locationId, atlasEntry);
    }
    return {
      locationId,
      name: loc.name,
      objset: hex(loc.objset, 2),
      area: hex(loc.area, 2),
      submap: hex(loc.submap || 0, 2),
      entryRoom: loc.entryRoom || null,
      renderContext: deriveBackgroundContext(rom, info, {
        objset: loc.objset,
        area: loc.area,
        submap: loc.submap || 0
      }),
      atlas: atlasEntry ? {
        entryId: atlasEntry.id,
        renderStatus: atlasEntry.renderStatus,
        recipeStatus: atlasEntry.recipe?.status,
        width: atlasEntry.width,
        height: atlasEntry.height,
        output: atlasEntry.output || null,
        validation: atlasEntry.recipe?.statusDetail || null
      } : null,
      actorTable: rawTable ? {
        startOffset: rawTable.startOffsetHex,
        terminatorOffset: rawTable.terminatorOffsetHex,
        rows: rawTable.rows.length,
        promotedRows: rawTable.rows.filter((row) => {
          const coverage = BERKELEY_ACTOR_COVERAGE.get(row.id);
          return coverage && coverage.status !== 'control';
        }).length,
        controlRows: rawTable.rows.filter((row) => BERKELEY_ACTOR_COVERAGE.get(row.id)?.status === 'control').length,
        source: 'rom-file-actor-table'
      } : null,
      rawActorRows: rawTable ? rawTable.rows.map(publicRawActorRow) : [],
      actors
    };
  });

  return {
    schemaVersion: 1,
    id,
    generatedAt: new Date().toISOString(),
    source: {
      renderer: 'interior-map-research',
      atlasFile: path.relative(process.cwd(), atlas.file) || atlas.file,
      manifestSource: manifest.source
    },
    summary: {
      submaps: submaps.length,
      actorRows: actorSummary(
        locations.map((loc) => {
          const locationId = guideLocationId(loc);
          const rawTable = rawTablesByLocationId.get(locationId);
          const rawRowsByPointer = new Map((rawTable?.rows || []).map((row) => [row.pointer, row]));
          return {
            ...loc,
            actors: (loc.actors || []).map((row) => ({
              ...row,
              rawActorRow: rawRowsByPointer.get(row.pointer)
            }))
          };
        }),
        rawTablesByLocationId
      ),
      atlasEntries: submaps.filter((submap) => submap.atlas).length
    },
    composition: computeComposition(locations, atlasEntriesByLocationId),
    submaps
  };
}

function writeInteriorMapResearch(filePath, analysis) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(analysis, null, 2)}\n`);
}

module.exports = {
  DEFAULT_ATLAS_FILE,
  DEFAULT_OUT_DIR,
  analyzeInteriorMap,
  writeInteriorMapResearch
};
