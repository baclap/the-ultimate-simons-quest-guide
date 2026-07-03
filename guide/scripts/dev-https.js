import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const guideRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = dirname(guideRoot);
const outputDir = join(repoRoot, 'out', 'guide-dev-https');
const keyPath = join(outputDir, 'localhost-key.pem');
const certPath = join(outputDir, 'localhost-cert.pem');
const configPath = join(outputDir, 'openssl-san.cnf');
const metadataPath = join(outputDir, 'metadata.json');
const port = process.env.GUIDE_DEV_PORT || '4177';
const devVersion = process.env.VITE_APP_VERSION
  || `dev-${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-')}`;

function findLanAddress() {
  const interfaces = networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        return entry.address;
      }
    }
  }
  return null;
}

function certMetadataMatches(lanAddress) {
  if (!existsSync(keyPath) || !existsSync(certPath) || !existsSync(metadataPath)) {
    return false;
  }
  try {
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
    return metadata.lanAddress === lanAddress;
  } catch {
    return false;
  }
}

function ensureCertificate(lanAddress) {
  mkdirSync(outputDir, { recursive: true });
  if (certMetadataMatches(lanAddress)) {
    return;
  }

  const altNames = [
    'DNS.1 = localhost',
    'IP.1 = 127.0.0.1'
  ];
  if (lanAddress) {
    altNames.push(`IP.2 = ${lanAddress}`);
  }

  writeFileSync(configPath, `
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
x509_extensions = v3_req

[dn]
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
${altNames.join('\n')}
`.trimStart());

  execFileSync('openssl', [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-sha256',
    '-days',
    '30',
    '-keyout',
    keyPath,
    '-out',
    certPath,
    '-config',
    configPath
  ], { stdio: 'ignore' });

  writeFileSync(metadataPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    lanAddress,
    days: 30
  }, null, 2));
}

function run(command, args, options = {}) {
  execFileSync(command, args, {
    cwd: guideRoot,
    stdio: 'inherit',
    ...options
  });
}

const lanAddress = findLanAddress();
ensureCertificate(lanAddress);
run(process.execPath, ['scripts/build-guide-music-data.js']);
run(process.execPath, ['scripts/build-icons.js']);
run(process.execPath, ['scripts/build-asset-manifest.js', '--root', 'public', '--out', 'public/asset-manifest.json']);

console.log('');
console.log('Guide HTTPS dev server');
console.log(`  Version: ${devVersion}`);
console.log(`  Local:   https://localhost:${port}/`);
if (lanAddress) {
  console.log(`  Network: https://${lanAddress}:${port}/`);
}
console.log('');
console.log('The certificate is self-signed. Your phone may ask you to trust it once.');
console.log('');

const viteBin = join(guideRoot, 'node_modules', '.bin', 'vite');
const child = spawn(viteBin, [], {
  cwd: guideRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    GUIDE_DEV_HTTPS: '1',
    GUIDE_DEV_HTTPS_KEY: keyPath,
    GUIDE_DEV_HTTPS_CERT: certPath,
    GUIDE_DEV_PORT: port,
    VITE_APP_VERSION: devVersion
  }
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
