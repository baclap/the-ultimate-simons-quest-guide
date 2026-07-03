'use strict';

const fs = require('fs');
const path = require('path');
const {
  DEFAULT_LOCATION_NAMES_FILE,
  loadLocationNames,
  resolveLocationName
} = require('./location-names');

const CV2R_METADATA_SOURCE = 'data/vendor/cv2r/locations.json';
const CV2R_METADATA_FILE = path.join(__dirname, '..', CV2R_METADATA_SOURCE);
const LOCATION_NAMES_SOURCE = 'data/location-names.json';
const BASE_PATTERN_POINTER = 0x7730;
const OBJ_OFFSET = 0x30;
const MAP_SIZE_BY_OBJSET = [2, 4, 4, 5, 2, 2];

function hex(value, width = 2) {
  if (value == null) {
    return undefined;
  }
  const number = Number(value);
  if (!Number.isInteger(number)) {
    throw new Error(`cannot format invalid hex value: ${value}`);
  }
  return `0x${number.toString(16).toUpperCase().padStart(width, '0')}`;
}

function locationId(loc) {
  return [
    `obj${Number(loc.objset).toString(16).padStart(2, '0')}`,
    `area${Number(loc.area).toString(16).padStart(2, '0')}`,
    `sub${Number(loc.submap || 0).toString(16).padStart(2, '0')}`
  ].join('-');
}

function patternPointer(loc) {
  const mapSize = MAP_SIZE_BY_OBJSET[loc.objset];
  if (mapSize == null || loc.area == null || loc.submap == null) {
    return undefined;
  }
  return BASE_PATTERN_POINTER + (loc.objset * OBJ_OFFSET) + (loc.area * mapSize) + loc.submap;
}

function actorKind(actor) {
  if (actor.enemy) {
    return 'enemy';
  }
  if (actor.npc) {
    return 'npc';
  }
  if (actor.fixture) {
    return 'fixture';
  }
  return 'actor';
}

function summarizeActor(actor) {
  return {
    kind: actorKind(actor),
    name: actor.name,
    id: actor.id,
    idHex: hex(actor.id),
    x: actor.x,
    y: actor.y,
    data: actor.data,
    dataHex: hex(actor.data),
    pointer: actor.pointer,
    pointerHex: hex(actor.pointer, 4),
    bank: actor.bank,
    itemType: actor.itemType,
    holdsItem: Boolean(actor.holdsItem),
    textPointer: actor.textPointer,
    textPointerHex: hex(actor.textPointer, 4)
  };
}

function summarizeDoor(door) {
  return {
    name: door.name,
    pointerIndex: door.pointerIndex,
    source: {
      objset: door.objset,
      area: door.area,
      submap: door.submap || 0,
      id: locationId(door)
    },
    target: {
      objset: door.target.objset,
      area: door.target.area,
      submap: door.target.submap || 0,
      id: locationId({
        objset: door.target.objset,
        area: door.target.area,
        submap: door.target.submap || 0
      })
    }
  };
}

function loadCv2rLocations() {
  try {
    const metadata = JSON.parse(fs.readFileSync(CV2R_METADATA_FILE, 'utf8'));
    return metadata.locations || [];
  } catch (error) {
    throw new Error(`failed to load extracted cv2r metadata from ${CV2R_METADATA_FILE}: ${error.message}`);
  }
}

function buildManifest() {
  const core = loadCv2rLocations();
  const locationNames = loadLocationNames();
  let actorCount = 0;
  let doorCount = 0;

  const locations = core.map(loc => {
    const resolvedName = resolveLocationName(loc.name, { names: locationNames });
    const resolvedEntryRoom = loc.entryRoom
      ? resolveLocationName(loc.entryRoom, { names: locationNames })
      : undefined;
    const doors = loc.doors && loc.doors.data ? loc.doors.data.map(summarizeDoor) : [];
    const actors = loc.actors ? loc.actors.map(summarizeActor) : [];
    actorCount += actors.length;
    doorCount += doors.length;

    return {
      id: locationId(loc),
      name: resolvedName.name,
      sourceName: resolvedName.sourceName,
      aliases: resolvedName.aliases,
      namingSource: resolvedName.namingSource,
      namingNote: resolvedName.namingNote,
      objset: loc.objset,
      objsetHex: hex(loc.objset),
      area: loc.area,
      areaHex: hex(loc.area),
      submap: loc.submap || 0,
      submapHex: hex(loc.submap || 0),
      entryRoom: resolvedEntryRoom?.name,
      entryRoomSourceName: loc.entryRoom,
      boss: Boolean(loc.boss),
      death: Boolean(loc.death),
      ceiling: Boolean(loc.ceiling),
      spriteLimit: Boolean(loc.spriteLimit),
      patternPointer: patternPointer(loc),
      patternPointerHex: hex(patternPointer(loc), 4),
      doors,
      actors
    };
  });

  return {
    source: {
      name: 'tonylukasavage/cv2r',
      metadataFile: CV2R_METADATA_SOURCE,
      locationNamesFile: LOCATION_NAMES_SOURCE,
      displayNamePolicy: locationNames.policy
    },
    summary: {
      locations: locations.length,
      actors: actorCount,
      doors: doorCount
    },
    constants: {
      basePatternPointer: BASE_PATTERN_POINTER,
      objOffset: OBJ_OFFSET,
      mapSizeByObjset: MAP_SIZE_BY_OBJSET
    },
    locations
  };
}

function writeManifest(filePath, manifest) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`);
}

module.exports = {
  buildManifest,
  writeManifest
};
