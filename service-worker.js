// Forensika — service worker.
// Network-first pre navigáciu (nový deploy sa načíta hneď), cache ako offline záloha.
var VERSION = 'forensika-v7-1.3';
var CORE = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/i18n.js',
  './js/experts.js',
  './js/tools.js',
  './manifest.webmanifest',
  './assets/logo.svg',
  './assets/favicon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== VERSION) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Umožní stránke prepnúť na novú verziu bez čakania.
self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return; // externé odkazy → sieť

  var isNav = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isNav) {
    // Network-first: vždy skús najnovšiu verziu, offline padni na cache.
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match('./index.html'); });
      })
    );
    return;
  }

  // Ostatné statické súbory: stale-while-revalidate.
  e.respondWith(
    caches.match(req).then(function (cached) {
      var net = fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return cached; });
      return cached || net;
    })
  );
});
