const CACHE_SHELL = 'app-shell-v3';
const CACHE_DATA = 'app-data-v3';

const SHELL_URLS = ['/', '/index.html'];

// ── Install: pre-cache shell ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then(cache => cache.addAll(SHELL_URLS))
  );
  self.skipWaiting();
});

// ── Activate: remove stale caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_SHELL && k !== CACHE_DATA)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first for API, cache-first for assets ─────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests entirely.
  if (request.method !== 'GET') return;
  // Skip ALL cross-origin requests (fonts, CDNs, third-party scripts, images).
  // Serving cross-origin scripts through the SW cache makes them "opaque" —
  // any error inside them surfaces as a detail-less "Script error." cascade.
  if (url.origin !== self.location.origin) return;

  // API / entity requests → network-first, fall back to cache
  if (url.pathname.includes('/api/') || url.pathname.includes('/entities/')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_DATA).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Navigation (HTML) → network-first, fall back to /index.html shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html').then(r => r || new Response('Offline', { status: 503 }))
      )
    );
    return;
  }

  // Static assets → network-first to always get fresh code
  event.respondWith(
    fetch(request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE_SHELL).then(c => c.put(request, clone));
      }
      return res;
    }).catch(() => caches.match(request))
  );
});

// ── Message: manual sync trigger from app ────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
