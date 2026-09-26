const CACHE = 'home-base-v2';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only manage our own app shell files. Everything else (Sheets API calls,
  // Google Fonts, etc.) is left completely alone so a network hiccup there
  // never turns into a broken response.
  const isOwnAsset = url.origin === self.location.origin && e.request.method === 'GET';
  if (!isOwnAsset) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

// Handles a real Web Push message if you add a push server later.
self.addEventListener('push', e => {
  const data = e.data ? e.data.text() : 'Update from Home Base';
  e.waitUntil(self.registration.showNotification('Home Base', { body: data }));
});
