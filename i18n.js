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
      // Spider
      score: 'Score', moves: 'Moves', time: 'Time',
      menu: 'Menu', undo: 'Undo', deal: n => `Deal · ${n}`, hint: 'Hint', new: 'New',
      difficulty: 'Difficulty', tapMove: 'Tap a card to move it',
      resume: 'Continue game', play: 'Play', newGame: 'New game', home: '‹ Home',
      confirmTitle: 'New game?', confirmText: 'The current game will end.',
      winTitle: 'Congratulations!', winText: 'All eight suits are complete.', playAgain: 'Play again',
      winStats: v => `${v.score} points · ${v.moves} moves · ${v.time}`,
      toastSuit: 'Suit complete! +100', toastNeedCards: 'Every column needs a card before you deal',
      toastNoMovesDeal: 'No moves – deal new cards', toastNoMoves: 'No more moves',
      toastHintsOff: 'Hints are turned off in Settings',
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
      score: 'Poäng', moves: 'Drag', time: 'Tid',
      menu: 'Meny', undo: 'Ångra', deal: n => `Ge · ${n}`, hint: 'Tips', new: 'Ny',
      difficulty: 'Svårighetsgrad', tapMove: 'Tryck på kort för att flytta',
      resume: 'Fortsätt spelet', play: 'Spela', newGame: 'Nytt spel', home: '‹ Till startsidan',
      confirmTitle: 'Nytt spel?', confirmText: 'Det pågående spelet avslutas.',
      winTitle: 'Grattis!', winText: 'Alla åtta färger är klara.', playAgain: 'Spela igen',
      winStats: v => `${v.score} poäng · ${v.moves} drag · ${v.time}`,
      toastSuit: 'Färg klar! +100', toastNeedCards: 'Alla kolumner måste ha kort innan du ger',
      toastNoMovesDeal: 'Inga drag – ge nya kort', toastNoMoves: 'Inga fler drag',
      toastHintsOff: 'Tips är avstängt i inställningarna',
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
