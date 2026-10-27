// Alla spel i appen. Används av startsidans statistik och av spelsidan (games.html). Ett nytt spel läggs till här.
// svg är spelets symbol (samma figur som i spelets lobby, ritad i en ruta på 48 × 48 med mitten i 24, 24).
// Varje spel sparar sin statistik under statsKey som { nivå: { played, won, best, fast } },
// där best är bästa poäng och fast är snabbaste vinst i sekunder.
// sub(st, s) ger undertexten på spelets ruta: hur långt ett pågående spel (st) har kommit, annars vald nivå (s = spelets inställningar).
(function () {
  const t = I18N.t;
  // Pyramid: variant (klassisk eller dolda rader) och antal varv genom talongen, där 0 betyder obegränsat
  // Harpan: antal kort per dragning och antal varv genom draghögen (0 = obegränsat)
  const klonLevel = (draw, passes) => t('drawCards', draw) + ' · ' + t('passes', passes);
  const pyrLevel = (variant, passes) => (variant === 'hidden' ? t('hiddenRows') + ' · ' : '') + t('passes', passes);
  const GAMES = [
    { id: 'spider', svg: '<g fill="#f5d58a"><ellipse cx="24" cy="19" rx="6.5" ry="8"/><circle cx="24" cy="31" r="4.5"/></g><g fill="none" stroke="#f5d58a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 20 11 13 8 17M19 24 9 23 6 29M20 29 11 32 9 39M21 33 15 38 14 42"/><path d="M29 20 37 13 40 17M29 24 39 23 42 29M28 29 37 32 39 39M27 33 33 38 34 42"/></g>', name: t('spider'), url: 'spider.html', statsKey: 'spider.stats', gameKey: 'spider.game', settingsKey: 'spider.settings',
      levels: [1, 2, 4].map(n => ({ key: n, label: t('suits', n) })),
      sub: (st, s) => st ? t('progress', st.done.length / 13) : t('suits', s.suits || 2) },
    { id: 'pyramid', svg: '<polygon fill="#f5d58a" points="24,9 40,38 8,38" stroke="#f5d58a" stroke-width="2" stroke-linejoin="round"/>', name: t('pyramid'), url: 'pyramid.html', statsKey: 'pyramid.stats', gameKey: 'pyramid.game', settingsKey: 'pyramid.settings',
      levels: ['classic', 'hidden'].flatMap(v => [1, 2, 0].map(n => ({ key: (v === 'hidden' ? 'h' : '') + n, label: pyrLevel(v, n) }))),
      sub: (st, s) => st ? t('pyrProgress', st.pyr.filter(x => x === null).length) : pyrLevel(s.variant, s.passes ?? 0) },
    { id: 'golf', svg: '<line x1="21" y1="7" x2="21" y2="38" stroke="#f5d58a" stroke-width="2.4" stroke-linecap="round"/><path fill="#f5d58a" d="M22 7l14 5.5L22 18z"/><ellipse cx="24" cy="39.5" rx="11" ry="3" fill="none" stroke="#f5d58a" stroke-width="2"/>', name: 'Golf', url: 'golf.html', statsKey: 'golf.stats', gameKey: 'golf.game', settingsKey: 'golf.settings',
      levels: ['classic', 'wrap'].map(v => ({ key: v, label: t(v) })),
      sub: (st, s) => st ? t('golfProgress', 35 - st.cols.reduce((n, c) => n + c.length, 0)) : t(s.variant === 'wrap' ? 'wrap' : 'classic') },
    { id: 'klondike', svg: '<g fill="none" stroke="#f5d58a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 41V9c6-2 10 3 14 6s8 2 9-1"/><path d="M36 14 17 41H11"/></g><g stroke="#f5d58a" stroke-width="1.1" opacity=".85"><line x1="17" y1="12.7" x2="17" y2="41"/><line x1="21" y1="14.9" x2="21" y2="35.32"/><line x1="25" y1="17.1" x2="25" y2="29.64"/><line x1="29" y1="16.1" x2="29" y2="23.96"/><line x1="33" y1="15.3" x2="33" y2="18.28"/></g>', name: t('klondike'), url: 'klondike.html', statsKey: 'klondike.stats', gameKey: 'klondike.game', settingsKey: 'klondike.settings',
      levels: [1, 3].flatMap(d => [0, 3].map(p => ({ key: d + '-' + p, label: klonLevel(d, p) }))),
      sub: (st, s) => st ? t('klonProgress', st.found.reduce((n, f) => n + f.length, 0)) : klonLevel(s.draw || 1, s.passes ?? 0) },
    { id: 'freecell', svg: '<rect x="11" y="7" width="11" height="16" rx="2" fill="none" stroke="#f5d58a" stroke-width="2"/><rect x="26" y="7" width="11" height="16" rx="2" fill="none" stroke="#f5d58a" stroke-width="2"/><rect x="11" y="25" width="11" height="16" rx="2" fill="none" stroke="#f5d58a" stroke-width="2"/><rect x="26" y="25" width="11" height="16" rx="2" fill="#f5d58a" stroke="#f5d58a" stroke-width="2"/>', name: t('freecell'), url: 'freecell.html', statsKey: 'freecell.stats', gameKey: 'freecell.game', settingsKey: 'freecell.settings',
      levels: ['4', '2'].map(n => ({ key: n, label: t('cellsN', +n) })),
      sub: (st, s) => st ? t('klonProgress', st.found.reduce((n, f) => n + f.length, 0)) : t('cellsN', s.cells || 4) },
    { id: 'tripeaks', svg: '<path d="M12 13 21 35 3 35z" fill="#141a35" stroke="#f5d58a" stroke-width="2" stroke-linejoin="round"/><path d="M24 13 33 35 15 35z" fill="#f5d58a" stroke="#f5d58a" stroke-width="2" stroke-linejoin="round"/><path d="M36 13 45 35 27 35z" fill="#141a35" stroke="#f5d58a" stroke-width="2" stroke-linejoin="round"/>', name: t('tripeaks'), url: 'tripeaks.html', statsKey: 'tripeaks.stats', gameKey: 'tripeaks.game', settingsKey: 'tripeaks.settings',
      levels: ['classic', 'wrap'].map(v => ({ key: v, label: t(v) })),
      sub: (st, s) => st ? t('pyrProgress', st.peaks.filter(x => x === null).length) : t(s.variant === 'wrap' ? 'wrap' : 'classic') },
    { id: 'yukon', svg: '<path fill="#f5d58a" d="M24 6l7 9h-3.5l6 8H30l7 9H11l7-9h-3.5l6-8H17z"/><rect x="21.5" y="32" width="5" height="9" rx="1" fill="#f5d58a"/>', name: t('yukon'), url: 'yukon.html', statsKey: 'yukon.stats', gameKey: 'yukon.game', settingsKey: 'yukon.settings',
      levels: ['classic', 'russian'].map(v => ({ key: v, label: t(v) })),
      sub: (st, s) => st ? t('klonProgress', st.found.reduce((n, f) => n + f.length, 0)) : t(s.variant === 'russian' ? 'russian' : 'classic') },
    { id: 'forty', svg: '<path d="M12 39C18 30 26 22 38 8c-2 9-9 20-21 33z" fill="#f5d58a"/><path d="M9 35l8 8" stroke="#f5d58a" stroke-width="3" stroke-linecap="round"/><path d="M11 41l-3 3" stroke="#f5d58a" stroke-width="3.4" stroke-linecap="round"/>', name: t('fortyThieves'), url: 'forty.html', statsKey: 'forty.stats', gameKey: 'forty.game', settingsKey: 'forty.settings',
      levels: ['1', '2'].map(n => ({ key: n, label: t('passes', +n) })),
      sub: (st, s) => st ? t('ftProgress', st.found.reduce((n, f) => n + f.length, 0)) : t('passes', s.passes || 1) },
  ];
  // Platshållare som fyller ut spelsidan till hela rader. Bilden ritas som patiensen med samma id.
  const SOON = [
    { id: 'scorpion', name: t('scorpion') },
  ];
  window.GAMES = GAMES;
  window.SOON = SOON;
})();
