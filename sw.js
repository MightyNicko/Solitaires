// Offline-stöd: allt appen behöver sparas i cachen vid installation.
// Online hämtas alltid senaste versionen från nätet (och cachen uppdateras).
// Cachen används bara offline, eller om nätet inte svarar inom TIMEOUT.
// Byt CACHE när filer läggs till eller tas bort.
const CACHE = 'solitaires-v23';
const TIMEOUT = 3000;
const FILES = ['./', './index.html', './games.html', './games.js', './spider.html', './pyramid.html', './golf.html', './klondike.html', './freecell.html', './tripeaks.html', './yukon.html', './forty.html', './cards.css', './cards.js', './i18n.js', './sounds.js', './sounds/card-place-1.wav', './sounds/card-place-2.wav', './sounds/card-place-3.wav', './sounds/card-place-4.wav', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const network = fetch(req, { cache: 'no-cache' }).then(res => {
      if (res.ok && !res.redirected) cache.put(req, res.clone());
      return res;
    });
    try {
      return await Promise.race([network, new Promise((_, fail) => setTimeout(fail, TIMEOUT))]);
    } catch (err) {
      const cached = await cache.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await cache.match('./') : undefined);
      if (cached) { e.waitUntil(network.catch(() => {})); return cached; }
      return network;
    }
  })());
});
