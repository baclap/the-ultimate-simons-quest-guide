import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

function gitCommitVersion() {
  try {
    return execSync('git rev-parse --short=12 HEAD', {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return null;
  }
}

const buildVersion = process.env.VITE_APP_VERSION
  || (process.env.VERCEL_GIT_COMMIT_SHA ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 12) : null)
  || gitCommitVersion()
  || packageJson.version
  || 'dev';

const repositoryUrl = process.env.VITE_REPOSITORY_URL || 'https://github.com/baclap/the-ultimate-simons-quest-guide';
const httpsKeyPath = process.env.GUIDE_DEV_HTTPS_KEY;
const httpsCertPath = process.env.GUIDE_DEV_HTTPS_CERT;
const httpsServer = process.env.GUIDE_DEV_HTTPS === '1'
  ? {
      host: '0.0.0.0',
      port: Number.parseInt(process.env.GUIDE_DEV_PORT || '4177', 10),
      strictPort: true,
      https: {
        key: readFileSync(httpsKeyPath),
        cert: readFileSync(httpsCertPath)
      }
    }
  : undefined;

export default defineConfig({
  server: httpsServer,
  build: {
    assetsDir: 'app'
  },
  define: {
    __GUIDE_BUILD_VERSION__: JSON.stringify(buildVersion),
    __GUIDE_REPOSITORY_URL__: JSON.stringify(repositoryUrl)
  }
});
