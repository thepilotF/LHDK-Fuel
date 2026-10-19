// LHDK Fuel App – service worker: the app opens and works without internet.
// Pages: network first (always the newest version), cached copy when offline.
// Requests to the Google Apps Script backend are never cached here (the app keeps its own data cache + outbox).
const CACHE = 'lhdk-fuel-v1';
const ALAP = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ALAP)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;   // backend & other sites: untouched
  e.respondWith(
    fetch(e.request).then(v => {
      const masolat = v.clone();
      if (v.ok) caches.open(CACHE).then(c => c.put(e.request, masolat));
      return v;
    }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
  );
});
