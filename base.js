// Gemensamt för alla sidor: offline-stödet, och stjärnhimlen på startsidan och sidan Spela
const Base = {
  // Stjärnhimmel: små vita och guldiga stjärnor, och (på startsidan) några fyruddiga gnistor, alla i egen takt
  stars(count, gold, sparks = 0) {
    const sky = document.querySelector('.stars'), rnd = (a, b) => a + Math.random() * (b - a);
    for (let i = 0; i < count; i++) {
      const s = document.createElement('i');
      const kind = i < sparks ? 'spark' : i < sparks + gold ? 'gold' : '';
      s.className = 'star ' + kind;
      s.style.cssText = `left:${rnd(2, 98)}%;top:${rnd(2, 98)}%;--s:${kind === 'spark' ? rnd(16, 24) : rnd(3, 5)}px;` +
                        `--t:${rnd(2.5, 6)}s;--d:${-rnd(0, 6)}s`;
      sky.appendChild(s);
    }
  },
  // Offline-stöd (kräver https eller localhost)
  offline() {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  },
};
