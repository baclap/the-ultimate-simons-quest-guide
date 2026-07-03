import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const root = path.resolve(argValue('root', 'public'));
const out = path.resolve(argValue('out', path.join(root, 'asset-manifest.json')));
const ignored = new Set(['.DS_Store', 'asset-manifest.json']);

async function walk(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (ignored.has(entry.name)) {
      continue;
    }
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(absolute, base));
    } else if (entry.isFile()) {
      const fileStat = await stat(absolute);
      files.push({
        url: path.relative(base, absolute).split(path.sep).join('/'),
        bytes: fileStat.size
      });
    }
  }
  return files;
}

const files = await walk(root);
const appShell = files.some((file) => file.url === 'index.html') ? [] : [''];
const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  assets: [
    ...appShell,
    ...files.map((file) => file.url)
  ],
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0)
};

await writeFile(out, `${JSON.stringify(manifest, null, 2)}\n`);
