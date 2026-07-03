import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const sourcePath = path.join(repoRoot, 'tools/rom-music-player/music-data.js');
const outPath = path.join(repoRoot, 'guide/public/assets/audio/cv2-music-data.js');

const GUIDE_TRACK_LABELS = new Map([
  [0x128, 'Deborah Cliff Tornado Event'],
  [0x39, 'Daytime Town'],
  [0x3d, 'Bloody Tears'],
  [0x41, 'Nighttime'],
  [0x45, 'Mansion'],
  [0x49, 'Castlevania'],
  [0x4d, 'Dracula Battle']
]);

function readGeneratedExport(filePath, exportName) {
  const source = fs.readFileSync(filePath, 'utf8');
  const prefix = `export const ${exportName} =`;
  const start = source.indexOf(prefix);
  if (start === -1) {
    throw new Error(`${filePath} is missing ${exportName}.`);
  }
  const jsonSource = source.slice(start + prefix.length).trim().replace(/;$/, '');
  return JSON.parse(jsonSource);
}

const musicData = readGeneratedExport(sourcePath, 'MUSIC_DATA');
const guideTracks = musicData.tracks
  .filter((track) => GUIDE_TRACK_LABELS.has(track.soundId))
  .map((track) => ({
    ...track,
    label: GUIDE_TRACK_LABELS.get(track.soundId)
  }));

if (guideTracks.length !== GUIDE_TRACK_LABELS.size) {
  const found = new Set(guideTracks.map((track) => track.soundId));
  const missing = Array.from(GUIDE_TRACK_LABELS.keys())
    .filter((soundId) => !found.has(soundId))
    .map((soundId) => `$${soundId.toString(16).toUpperCase().padStart(2, '0')}`);
  throw new Error(`Guide music data is missing track(s): ${missing.join(', ')}`);
}

const guideData = {
  ...musicData,
  tracks: guideTracks
};

const js = [
  '// Generated from tools/rom-music-player/music-data.js. Do not edit by hand.',
  'export const GUIDE_MUSIC_DATA = ',
  JSON.stringify(guideData),
  ';',
  ''
].join('\n');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, js);
console.log(`Wrote ${guideTracks.length} guide music tracks to ${outPath}`);
