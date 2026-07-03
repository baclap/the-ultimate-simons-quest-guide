const swUrl = new URL(self.location.href);
const BUILD_VERSION = swUrl.searchParams.get('version') || 'dev';
const CACHE_PREFIX = 'ultimate-simons-quest-guide';
const STATIC_CACHE = `${CACHE_PREFIX}:static:${BUILD_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}:runtime:${BUILD_VERSION}`;
const CORE_ASSETS = ['', 'asset-manifest.json'];

function scopedUrl(url) {
  return new URL(url, self.registration.scope).toString();
}

function shouldIgnore(request) {
  const url = new URL(request.url);
  return request.method !== 'GET'
    || url.origin !== self.location.origin
    || url.pathname.startsWith('/_vercel/')
    || url.pathname.includes('/insights/');
}

async function cacheCoreAssets() {
  const cache = await caches.open(STATIC_CACHE);
  await Promise.allSettled(
    CORE_ASSETS.map((asset) => cache.add(new Request(scopedUrl(asset), { credentials: 'same-origin' })))
  );
}

async function deleteOldCaches() {
  const keys = await caches.keys();
  await Promise.all(keys
    .filter((key) => key.startsWith(CACHE_PREFIX) && !key.endsWith(`:${BUILD_VERSION}`))
    .map((key) => caches.delete(key)));
}

async function cacheAssets(assets) {
  const cache = await caches.open(RUNTIME_CACHE);
  const uniqueAssets = [...new Set(assets)].filter(Boolean);
  await Promise.allSettled(uniqueAssets.map(async (asset) => {
    const url = scopedUrl(asset);
    const request = new Request(url, {
      credentials: 'same-origin',
      cache: 'reload'
    });
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response);
    }
  }));
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return await cache.match(request)
      || await cache.match(scopedUrl('index.html'))
      || await cache.match(scopedUrl(''));
  }
}

async function matchCachedRequest(request) {
  const directMatch = await caches.match(request);
  if (directMatch) {
    return directMatch;
  }

  const url = new URL(request.url);
  return await caches.match(scopedUrl(url.pathname), {
    ignoreSearch: true
  });
}

async function cacheFirst(request) {
  const cached = await matchCachedRequest(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheCoreAssets());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(deleteOldCaches());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'CACHE_GUIDE_ASSETS' && Array.isArray(event.data.assets)) {
    event.waitUntil(cacheAssets(event.data.assets));
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (shouldIgnore(request)) {
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});
