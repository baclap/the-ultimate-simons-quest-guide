'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_MESEN_BIN = 'mesen';

function mesenSettingsPath() {
  return path.join(os.homedir(), 'Library', 'Application Support', 'Mesen2', 'settings.json');
}

function runMesenCapture(opts) {
  const mesenBin = opts.mesenBin || process.env.MESEN_BIN || DEFAULT_MESEN_BIN;
  const romPath = path.resolve(opts.romPath);
  const scriptPath = path.resolve(opts.scriptPath);
  const outDir = path.resolve(opts.outDir);
  const timeout = opts.timeout || 10;
  const settings = mesenSettingsPath();

  if (!fs.existsSync(settings)) {
    throw new Error(`Mesen settings file is missing: ${settings}. See docs/mesen-automation.md for the minimal bootstrap file.`);
  }
  if (!fs.existsSync(romPath)) {
    throw new Error(`ROM does not exist: ${romPath}`);
  }
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Mesen Lua script does not exist: ${scriptPath}`);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const args = [
    '--testRunner',
    '--debug.scriptWindow.allowIoOsAccess=true',
    `--timeout=${timeout}`,
    scriptPath,
    romPath
  ];

  const startedAt = Date.now();
  const child = childProcess.spawnSync(mesenBin, args, {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      ...(opts.env || {}),
      CV2MAP_MESEN_OUT: outDir
    },
    encoding: 'utf8'
  });

  if (child.error) {
    throw child.error;
  }

  const result = {
    command: mesenBin,
    args,
    outDir,
    status: child.status,
    signal: child.signal,
    durationMs: Date.now() - startedAt,
    stdout: child.stdout,
    stderr: child.stderr,
    outputs: fs.readdirSync(outDir).sort().map(file => path.join(outDir, file))
  };

  if (child.status !== 0) {
    const stderr = child.stderr ? `\n${child.stderr}` : '';
    throw new Error(`Mesen capture failed with status ${child.status}${stderr}`);
  }

  return result;
}

module.exports = {
  mesenSettingsPath,
  runMesenCapture
};
