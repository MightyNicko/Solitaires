// Alla spel i appen. Används av startsidans statistik och av spelsidan (games.html). Ett nytt spel läggs till här.
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
    { id: 'spider', name: t('spider'), icon: '♠︎', url: 'spider.html', statsKey: 'spider.stats', gameKey: 'spider.game', settingsKey: 'spider.settings',
      levels: [1, 2, 4].map(n => ({ key: n, label: t('suits', n) })),
      sub: (st, s) => st ? t('progress', st.done.length / 13) : t('suits', s.suits || 2) },
    { id: 'pyramid', name: t('pyramid'), icon: '▲︎', url: 'pyramid.html', statsKey: 'pyramid.stats', gameKey: 'pyramid.game', settingsKey: 'pyramid.settings',
      levels: ['classic', 'hidden'].flatMap(v => [1, 2, 0].map(n => ({ key: (v === 'hidden' ? 'h' : '') + n, label: pyrLevel(v, n) }))),
      sub: (st, s) => st ? t('pyrProgress', st.pyr.filter(x => x === null).length) : pyrLevel(s.variant, s.passes ?? 0) },
    { id: 'golf', name: 'Golf', icon: '⚑︎', url: 'golf.html', statsKey: 'golf.stats', gameKey: 'golf.game', settingsKey: 'golf.settings',
      levels: ['classic', 'wrap'].map(v => ({ key: v, label: t(v) })),
      sub: (st, s) => st ? t('golfProgress', 35 - st.cols.reduce((n, c) => n + c.length, 0)) : t(s.variant === 'wrap' ? 'wrap' : 'classic') },
    { id: 'klondike', name: t('klondike'), icon: '♣︎', url: 'klondike.html', statsKey: 'klondike.stats', gameKey: 'klondike.game', settingsKey: 'klondike.settings',
      levels: [1, 3].flatMap(d => [0, 3].map(p => ({ key: d + '-' + p, label: klonLevel(d, p) }))),
      sub: (st, s) => st ? t('klonProgress', st.found.reduce((n, f) => n + f.length, 0)) : klonLevel(s.draw || 1, s.passes ?? 0) },
    { id: 'freecell', name: t('freecell'), icon: '▦︎', url: 'freecell.html', statsKey: 'freecell.stats', gameKey: 'freecell.game', settingsKey: 'freecell.settings',
      levels: ['4', '2'].map(n => ({ key: n, label: t('cellsN', +n) })),
      sub: (st, s) => st ? t('klonProgress', st.found.reduce((n, f) => n + f.length, 0)) : t('cellsN', s.cells || 4) },
    { id: 'tripeaks', name: t('tripeaks'), icon: '▲︎', url: 'tripeaks.html', statsKey: 'tripeaks.stats', gameKey: 'tripeaks.game', settingsKey: 'tripeaks.settings',
      levels: ['classic', 'wrap'].map(v => ({ key: v, label: t(v) })),
      sub: (st, s) => st ? t('pyrProgress', st.peaks.filter(x => x === null).length) : t(s.variant === 'wrap' ? 'wrap' : 'classic') },
    { id: 'yukon', name: t('yukon'), icon: '♦︎', url: 'yukon.html', statsKey: 'yukon.stats', gameKey: 'yukon.game', settingsKey: 'yukon.settings',
      levels: ['classic', 'russian'].map(v => ({ key: v, label: t(v) })),
      sub: (st, s) => st ? t('klonProgress', st.found.reduce((n, f) => n + f.length, 0)) : t(s.variant === 'russian' ? 'russian' : 'classic') },
    { id: 'forty', name: t('fortyThieves'), icon: '⚔︎', url: 'forty.html', statsKey: 'forty.stats', gameKey: 'forty.game', settingsKey: 'forty.settings',
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
