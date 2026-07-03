#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {
    cv2rRoot: path.join(ROOT, 'third_party', 'cv2r'),
    outDir: path.join(ROOT, 'data', 'vendor', 'cv2r')
  };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--cv2r-root') {
      args.cv2rRoot = path.resolve(argv[++index]);
    } else if (arg === '--out') {
      args.outDir = path.resolve(argv[++index]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function sanitizeLocations(locations) {
  return locations.map((location) => ({
    ...location,
    doors: location.doors
      ? {
          requirements: location.doors.requirements || {},
          data: location.doors.data || []
        }
      : undefined,
    actors: location.actors || []
  }));
}

function sanitizeObjects(objects) {
  const enemies = (objects.enemies || []).map((enemy) => ({ ...enemy }));
  const fixtures = Object.values(objects.fixture || {})
    .filter((fixture) => typeof fixture === 'function')
    .map((fixture) => ({ id: fixture.id, name: fixture.name }))
    .filter((fixture, index, all) => all.findIndex((candidate) => candidate.id === fixture.id) === index)
    .sort((left, right) => left.id - right.id);
  const npcs = Object.values(objects.npc || {})
    .filter((npc) => typeof npc === 'function')
    .map((npc) => ({ id: npc.id, name: npc.name }))
    .filter((npc, index, all) => all.findIndex((candidate) => candidate.id === npc.id) === index)
    .sort((left, right) => left.id - right.id);

  return {
    constants: {
      POS_AIR: objects.POS_AIR,
      POS_GROUND: objects.POS_GROUND,
      POS_BELOW: objects.POS_BELOW,
      POS_DEADHAND: objects.POS_DEADHAND
    },
    fixtures,
    npcs,
    enemies
  };
}

function main() {
  const args = parseArgs(process.argv);
  const packagePath = path.join(args.cv2rRoot, 'package.json');
  const corePath = path.join(args.cv2rRoot, 'lib', 'core.js');
  const objectPath = path.join(args.cv2rRoot, 'lib', 'object.js');

  if (!fs.existsSync(corePath) || !fs.existsSync(objectPath)) {
    throw new Error(`Unable to find cv2r metadata under ${args.cv2rRoot}`);
  }

  delete require.cache[require.resolve(corePath)];
  delete require.cache[require.resolve(objectPath)];
  const locations = sanitizeLocations(require(corePath));
  const objects = sanitizeObjects(require(objectPath));
  const packageJson = fs.existsSync(packagePath)
    ? JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    : {};
  const provenance = {
    name: 'tonylukasavage/cv2r',
    packageName: packageJson.name || 'cv2r',
    packageLicense: packageJson.license || 'ISC',
    extractedFrom: path.relative(ROOT, args.cv2rRoot) || '.',
    note: 'Extracted from cv2r build-time metadata so this guide repository does not need to vendor the full randomizer project.'
  };

  fs.mkdirSync(args.outDir, { recursive: true });
  fs.writeFileSync(
    path.join(args.outDir, 'locations.json'),
    `${JSON.stringify({ provenance, locations }, null, 2)}\n`
  );
  fs.writeFileSync(
    path.join(args.outDir, 'objects.json'),
    `${JSON.stringify({ provenance, ...objects }, null, 2)}\n`
  );
}

main();
