// Alla spel i appen. Används av startsidans statistik och av spelsidan (games.html). Ett nytt spel läggs till här.
// Varje spel sparar sin statistik under statsKey som { nivå: { played, won, best, fast } },
// där best är bästa poäng och fast är snabbaste vinst i sekunder.
// sub(st, s) ger undertexten på spelets ruta: hur långt ett pågående spel (st) har kommit, annars vald nivå (s = spelets inställningar).
(function () {
  const t = I18N.t;
  // Pyramid: variant (klassisk eller dolda rader) och antal varv genom talongen, där 0 betyder obegränsat
  const pyrLevel = (variant, passes) => (variant === 'hidden' ? t('hiddenRows') + ' · ' : '') + t('passes', passes);
  const GAMES = [
    { id: 'spider', name: 'Spider', icon: '♠︎', url: 'spider.html', statsKey: 'spider.stats', gameKey: 'spider.game', settingsKey: 'spider.settings',
      levels: [1, 2, 4].map(n => ({ key: n, label: t('suits', n) })),
      sub: (st, s) => st ? t('progress', st.done.length / 13) : t('suits', s.suits || 2) },
    { id: 'pyramid', name: 'Pyramid', icon: '▲︎', url: 'pyramid.html', statsKey: 'pyramid.stats', gameKey: 'pyramid.game', settingsKey: 'pyramid.settings',
      levels: ['classic', 'hidden'].flatMap(v => [1, 2, 0].map(n => ({ key: (v === 'hidden' ? 'h' : '') + n, label: pyrLevel(v, n) }))),
      sub: (st, s) => st ? t('pyrProgress', st.pyr.filter(x => x === null).length) : pyrLevel(s.variant, s.passes ?? 0) },
  ];
  // Platshållare som fyller ut spelsidan till hela rader. Bilden ritas som patiensen med samma id.
  const SOON = [
    { id: 'klondike', name: t('klondike') }, { id: 'freecell', name: 'FreeCell' }, { id: 'golf', name: 'Golf' },
    { id: 'forty', name: t('fortyThieves') }, { id: 'yukon', name: 'Yukon' }, { id: 'scorpion', name: t('scorpion') },
  ];
  window.GAMES = GAMES;
  window.SOON = SOON;
})();
