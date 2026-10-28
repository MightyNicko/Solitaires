// Offline-stöd och snabba sidbyten: allt appen behöver sparas i cachen vid installation och visas sedan direkt
// därifrån, utan att vänta på nätet. Sidor och filer kommer alltid från samma version, så de passar ihop.
// En ny version hämtas när webbläsaren ser att sw.js har ändrats: den installeras i bakgrunden och tar över,
// och används från nästa sidbyte. Byt därför CACHE varje gång någon fil ändras, och lägg till nya filer i FILES.
const CACHE = 'solitaires-v25';
const FILES = ['./', './index.html', './games.html', './games.js', './spider.html', './pyramid.html', './golf.html', './klondike.html', './freecell.html', './tripeaks.html', './yukon.html', './forty.html', './cards.css', './cards.js', './i18n.js', './sounds.js', './sounds/card-place-1.wav', './sounds/card-place-2.wav', './sounds/card-place-3.wav', './sounds/card-place-4.wav', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  // cache:'reload' hämtar förbi webbläsarens egen cache, så att den nya versionen inte blandas med gamla filer
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
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
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    // Inte i cachen (t.ex. en fil som saknas i FILES): hämta från nätet och spara. Offline visas startsidan.
    try {
      const res = await fetch(req);
      if (res.ok && !res.redirected) cache.put(req, res.clone());
      return res;
    } catch (err) {
      const home = req.mode === 'navigate' ? await cache.match('./') : undefined;
      if (home) return home;
      throw err;
    }
  })());
});
