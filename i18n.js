// Översättningar för alla sidor och spel. Språket väljs i startsidans inställningar (engelska som standard).
// I18N.t('nyckel', värde) ger texten på valt språk. Element med data-i18n (text) eller data-i18n-html (HTML)
// fylls i av I18N.apply(). Lägg till nya texter på båda språken.
(function () {
  const STR = {
    en: {
      // Gemensamt
      on: 'On', off: 'Off', done: 'Done', cancel: 'Cancel',
      suits: n => n === 1 ? '1 suit' : `${n} suits`,
      progress: n => `${n} of 8 done`,
      played: 'Played', won: 'Won', winRate: 'Win rate', best: 'Best', bestScore: 'Best score',
      fastest: 'Fastest', level: 'Level', total: 'Total',
      cardNames: { 1: 'Ace', 11: 'Jack', 12: 'Queen', 13: 'King' },
      // Startsidan
      subtitle: 'Solitaire for iPad', continue: 'Continue',
      stats: 'Statistics', statsSub: 'Results & records',
      settings: 'Settings', settingsSub: 'Appearance & data',
      sAnim: 'Animations <em>in all games</em>', animNormal: 'Normal', animFast: 'Fast',
      sEffects: 'Background effects <em>stars, rays, glow</em>',
      sHints: 'Hints <em>the Hint button in all games</em>',
      sSound: 'Sound <em>card sounds in all games</em>',
      sFace: 'Card front', faceStandard: 'Standard', faceClassic: 'Classic', faceModern: 'Modern',
      sBack: 'Card back', backRings: 'Rings', backClassic: 'Burgundy', backDeco: 'Art deco',
      sLang: 'Language', sData: 'Data',
      resetStats: 'Reset statistics for all games', resetStatsDone: 'Statistics have been reset',
      resetGames: 'Delete saved games', resetGamesDone: 'Saved games deleted',
      confirmTap: 'Tap again to confirm',
      // Spelsidan
      playSub: 'Choose a game', soon: 'Coming soon', allGames: '‹ All games',
      spider: 'Spider', pyramid: 'Pyramid', klondike: 'Klondike', fortyThieves: 'Forty Thieves', scorpion: 'Scorpion',
      // Spider
      score: 'Score', moves: 'Moves', time: 'Time',
      menu: 'Menu', undo: 'Undo', deal: n => `Deal · ${n}`, hint: 'Hint', new: 'New',
      difficulty: 'Difficulty', tapMove: 'Tap a card to move it',
      resume: 'Continue game', play: 'Play', newGame: 'New game', home: '‹ Home',
      confirmTitle: 'New game?', confirmText: 'The current game will end.',
      winTitle: 'Congratulations!', winText: 'All eight suits are complete.', playAgain: 'Play again',
      changeGame: 'Change game', undoSub: 'Take back the last move',
      pyrChangeSub: 'Choose variant and passes', spiderChangeSub: 'Choose number of suits',
      winStats: v => `${v.score} points · ${v.moves} moves · ${v.time}`,
      toastSuit: 'Suit complete! +100', toastNeedCards: 'Every column needs a card before you deal',
      toastNoMovesDeal: 'No moves – deal new cards', toastNoMoves: 'No more moves',
      toastHintsOff: 'Hints are turned off in Settings',
      // Pyramid
      pass: 'Pass', passes: n => n === 0 ? '∞ passes' : n === 1 ? '1 pass' : `${n} passes`, passesLabel: 'Passes through the draw pile',
      variant: 'Variant', classic: 'Classic', hiddenRows: 'Hidden rows',
      pyrHiddenRules: 'Every other row lies face down and turns over when nothing covers it any more.',
      stock: 'Draw pile', waste: 'Discard pile', draw: n => `Draw · ${n}`, turn: 'Turn over',
      pyrRules: 'Remove pairs that add up to 13. Kings go on their own. Clear the pyramid to win.',
      pyrProgress: n => `${n} of 28 cleared`, pyrWin: 'The pyramid is cleared!',
      lostTitle: 'No more moves', lostText: 'No pairs remain and the draw pile can no longer help.',
      toastNoPairsDraw: 'No pairs – draw a card', toastNoPairsTurn: 'No pairs – turn over the draw pile',
      // Golf
      left: 'Left', wrap: 'Round the corner', golfWin: 'All columns are cleared!', golfLost: 'No card fits and the draw pile is empty.',
      golfRules: 'Move the top card of a column to the discard pile if it is one higher or one lower, regardless of suit. Draw a card when nothing fits. Clear all seven columns to win.',
      golfClassicRules: 'Nothing can be played on a king.', golfWrapRules: 'Ace and king connect: an ace goes on a king and a king on an ace.',
      golfProgress: n => `${n} of 35 played`, golfChangeSub: 'Choose variant', toastNoFitDraw: 'Nothing fits – draw a card',
      // Harpan (Klondike)
      klonRules: 'Build the columns down in alternating colours; only a king may go in an empty column. Build the four foundations up by suit from ace to king. Tap a card to move it where it fits best.',
      klonWin: 'All cards are on the foundations!', klonLost: 'No move helps any more and the draw pile can no longer help.',
      klonProgress: n => `${n} of 52 home`, klonChangeSub: 'Choose cards per draw and passes',
      drawLabel: 'Cards per draw', drawCards: n => n === 1 ? 'Draw 1' : `Draw ${n}`, toastNoMoveDraw: 'No moves – draw a card',
      // FreeCell, TriPeaks, Yukon och Fyrtio rövare
      freecell: 'FreeCell', tripeaks: 'TriPeaks', yukon: 'Yukon',
      cellsHud: 'Cells', cellsLabel: 'Free cells', cellsN: n => `${n} cells`, fcChangeSub: 'Choose number of free cells', fcLost: 'No card can be moved any more.',
      fcRules: 'All cards are face up. Build the columns down in alternating colours and park single cards in the free cells. Any card may go in an empty column. Build the foundations up by suit from ace to king.',
      streak: 'Streak', tpWin: 'All three peaks are cleared!', tpClassicRules: 'Ace and king do not connect.',
      tpRules: 'Move free cards to the discard pile if they are one higher or one lower, regardless of suit. Cards turn over when nothing covers them. Long streaks give bonus points. Clear all three peaks to win.',
      russian: 'Russian', ykClassicRules: 'Build down in alternating colours.', ykRussianRules: 'Build down in the same suit – much harder.',
      ykRules: 'There is no draw pile. Move any face-up card together with all cards on top of it onto a card one higher. Only a king may go in an empty column. Build the foundations up by suit from ace to king.',
      ftRules: 'Two decks. Build the columns down in the same suit, one card at a time; any card may go in an empty column. Build the eight foundations up by suit from ace to king.',
      ftProgress: n => `${n} of 104 home`, ftChangeSub: 'Choose passes',
    },
    sv: {
      on: 'På', off: 'Av', done: 'Klar', cancel: 'Avbryt',
      suits: n => n === 1 ? '1 färg' : `${n} färger`,
      progress: n => `${n} av 8 klara`,
      played: 'Spelade', won: 'Vunna', winRate: 'Vinster', best: 'Bästa', bestScore: 'Bästa poäng',
      fastest: 'Snabbast', level: 'Nivå', total: 'Totalt',
      cardNames: { 1: 'Ess', 11: 'Knekt', 12: 'Dam', 13: 'Kung' },
      subtitle: 'Patienser för iPad', continue: 'Fortsätt',
      stats: 'Statistik', statsSub: 'Resultat & rekord',
      settings: 'Inställningar', settingsSub: 'Utseende & data',
      sAnim: 'Animationer <em>i alla spel</em>', animNormal: 'Normala', animFast: 'Snabba',
      sEffects: 'Bakgrundseffekter <em>stjärnor, strålar, glöd</em>',
      sHints: 'Tips <em>Tips-knappen i alla spel</em>',
      sSound: 'Ljud <em>kortljud i alla spel</em>',
      sFace: 'Kortens framsida', faceStandard: 'Standard', faceClassic: 'Klassisk', faceModern: 'Modern',
      sBack: 'Kortens baksida', backRings: 'Ringar', backClassic: 'Vinröd', backDeco: 'Art deco',
      sLang: 'Språk', sData: 'Data',
      resetStats: 'Nollställ statistik för alla spel', resetStatsDone: 'Statistiken är nollställd',
      resetGames: 'Radera sparade spel', resetGamesDone: 'Sparade spel är raderade',
      confirmTap: 'Tryck igen för att bekräfta',
      playSub: 'Välj patiens', soon: 'Kommer snart', allGames: '‹ Alla spel',
      spider: 'Spindelharpan', pyramid: 'Pyramiden', klondike: 'Harpan', fortyThieves: 'Fyrtio rövare', scorpion: 'Skorpionen',
      score: 'Poäng', moves: 'Drag', time: 'Tid',
      menu: 'Meny', undo: 'Ångra', deal: n => `Ge · ${n}`, hint: 'Tips', new: 'Ny',
      difficulty: 'Svårighetsgrad', tapMove: 'Tryck på kort för att flytta',
      resume: 'Fortsätt spelet', play: 'Spela', newGame: 'Nytt spel', home: '‹ Till startsidan',
      confirmTitle: 'Nytt spel?', confirmText: 'Det pågående spelet avslutas.',
      winTitle: 'Grattis!', winText: 'Alla åtta färger är klara.', playAgain: 'Spela igen',
      changeGame: 'Byt spel', undoSub: 'Ta tillbaka senaste draget',
      pyrChangeSub: 'Välj variant och varv', spiderChangeSub: 'Välj antal färger',
      winStats: v => `${v.score} poäng · ${v.moves} drag · ${v.time}`,
      toastSuit: 'Färg klar! +100', toastNeedCards: 'Alla kolumner måste ha kort innan du ger',
      toastNoMovesDeal: 'Inga drag – ge nya kort', toastNoMoves: 'Inga fler drag',
      toastHintsOff: 'Tips är avstängt i inställningarna',
      pass: 'Varv', passes: n => n === 0 ? '∞ varv' : `${n} varv`, passesLabel: 'Varv genom draghögen',
      variant: 'Variant', classic: 'Klassisk', hiddenRows: 'Dolda rader',
      pyrHiddenRules: 'Varannan rad ligger med baksidan upp och vänds när inget längre ligger på den.',
      stock: 'Draghög', waste: 'Kasthög', draw: n => `Dra · ${n}`, turn: 'Vänd',
      pyrRules: 'Ta bort par som blir 13 tillsammans. Kungar tas bort ensamma. Töm pyramiden för att vinna.',
      pyrProgress: n => `${n} av 28 borta`, pyrWin: 'Pyramiden är tömd!',
      lostTitle: 'Inga fler drag', lostText: 'Inga par finns kvar och draghögen kan inte hjälpa längre.',
      toastNoPairsDraw: 'Inga par – dra ett kort', toastNoPairsTurn: 'Inga par – vänd draghögen',
      left: 'Kvar', wrap: 'Runt hörnet', golfWin: 'Alla kolumner är tömda!', golfLost: 'Inget kort passar och draghögen är tom.',
      golfRules: 'Lägg det översta kortet i en kolumn på kasthögen om det är ett steg högre eller lägre, oavsett färg. Dra ett kort när inget passar. Töm alla sju kolumner för att vinna.',
      golfClassicRules: 'Inget får läggas på en kung.', golfWrapRules: 'Ess och kung hänger ihop: ess går på kung och kung på ess.',
      golfProgress: n => `${n} av 35 lagda`, golfChangeSub: 'Välj variant', toastNoFitDraw: 'Inget passar – dra ett kort',
      klonRules: 'Bygg nedåt i kolumnerna med omväxlande röd och svart. Bara en kung får läggas i en tom kolumn. Bygg de fyra grundhögarna uppåt i samma färg från ess till kung. Tryck på ett kort så flyttas det dit det passar bäst.',
      klonWin: 'Alla kort ligger på grundhögarna!', klonLost: 'Inget drag hjälper längre och draghögen kan inte hjälpa mer.',
      klonProgress: n => `${n} av 52 klara`, klonChangeSub: 'Välj antal kort och varv',
      drawLabel: 'Kort per dragning', drawCards: n => `Dra ${n}`, toastNoMoveDraw: 'Inga drag – dra ett kort',
      freecell: 'FreeCell', tripeaks: 'TriPeaks', yukon: 'Yukon',
      cellsHud: 'Celler', cellsLabel: 'Fria celler', cellsN: n => `${n} celler`, fcChangeSub: 'Välj antal fria celler', fcLost: 'Inget kort kan flyttas längre.',
      fcRules: 'Alla kort ligger uppvända. Bygg nedåt i kolumnerna med omväxlande röd och svart, och parkera enstaka kort i de fria cellerna. Vilket kort som helst får läggas i en tom kolumn. Bygg grundhögarna uppåt i samma färg från ess till kung.',
      streak: 'Serie', tpWin: 'Alla tre toppar är tömda!', tpClassicRules: 'Ess och kung hänger inte ihop.',
      tpRules: 'Lägg fria kort på kasthögen om de är ett steg högre eller lägre, oavsett färg. Korten vänds upp när inget längre ligger på dem. Långa serier ger bonuspoäng. Töm alla tre topparna för att vinna.',
      russian: 'Ryska', ykClassicRules: 'Bygg nedåt i omväxlande röd och svart.', ykRussianRules: 'Bygg nedåt i samma färg – mycket svårare.',
      ykRules: 'Det finns ingen draghög. Flytta vilket uppvänt kort som helst, med alla kort ovanpå, till ett kort som är ett steg högre. Bara en kung får läggas i en tom kolumn. Bygg grundhögarna uppåt i samma färg från ess till kung.',
      ftRules: 'Två kortlekar. Bygg nedåt i kolumnerna i samma färg, ett kort i taget. Vilket kort som helst får läggas i en tom kolumn. Bygg de åtta grundhögarna uppåt i samma färg från ess till kung.',
      ftProgress: n => `${n} av 104 klara`, ftChangeSub: 'Välj antal varv',
    },
  };

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('solitaires.settings')) || {}; } catch (e) {}
  const lang = STR[saved.lang] ? saved.lang : 'en';
  document.documentElement.lang = lang;

  function t(key, v) {
    const s = key in STR[lang] ? STR[lang][key] : STR.en[key];
    return typeof s === 'function' ? s(v) : s === undefined ? key : s;
  }
  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    (root || document).querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  }

  window.I18N = { lang, t, apply, LANGS: ['en', 'sv'] };
})();
