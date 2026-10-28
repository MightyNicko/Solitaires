// Gemensamt för alla spel. Varje spel anropar Game.init(board) först, och Game.watch(...) när spelets egna funktioner finns.
// Spelreglerna, layouten och dialogernas innehåll ligger kvar i respektive spel.
const Game = (() => {
  const $ = id => document.getElementById(id);
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  // Animationer, tips, ångra, ljud och kortens utseende är övergripande inställningar (startsidan)
  const global = store.get('solitaires.settings') || {};
  const SPEED = { normal: 1, fast: .5, off: 0 }[global.anim] ?? 1;
  // Hur många drag som går att ångra: 0 = av, 1 eller 5
  const UNDO = [0, 1, 5].includes(global.undo) ? global.undo : 5;
  const HINTS = global.hints !== false;
  const FACE = CardFaces.FACES.includes(global.face) ? global.face : 'standard';
  const BACK = CardFaces.BACKS.includes(global.back) ? global.back : 'rings';
  const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  // Slutdialogernas knappar: rubrik plus en rad om vad som händer
  const btnText = (title, sub) => `${title}<small>${sub}</small>`;
  // Kortets plats sätts med translate, som iPaden kan animera mjukt utan att räkna om sidan. Platsen sparas i _x och _y.
  const place = (e, x, y) => { e._x = x; e._y = y; e.style.translate = x + 'px ' + y + 'px'; };
  let toastTimer = 0;
  function toast(msg) {
    const el = $('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }
  function shake(list) {
    list.forEach(el => { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); });
    setTimeout(() => list.forEach(el => el.classList.remove('shake')), 350);
  }

  // Förbereder spelplanen: kortens utseende, animationernas längd, ljud, och knapparna Tips och Ångra om de är avstängda
  function init(board) {
    board.classList.add('face-' + FACE, 'back-' + BACK);
    board.style.setProperty('--dur', (.3 * SPEED) + 's');
    CardSounds.init(global.sound);
    if (!HINTS) $('b-hint').classList.add('off');
    if (!UNDO) $('b-undo').classList.add('off');
    // Gör ändringar utan animation (t.ex. när korten läggs på plats efter en vridning)
    const instant = fn => { board.classList.add('noanim'); fn(); void board.offsetWidth; board.classList.remove('noanim'); };
    return { store, global, SPEED, UNDO, HINTS, FACE, BACK, fmt, btnText, place, instant, toast, shake };
  }

  // Tidtagning, sparande och omräkning av layouten. game() ger spelets tillstånd och paused() om en dialog är öppen.
  function watch({ board, game, paused, save, relayout }) {
    setInterval(() => {
      const st = game();
      if (!st || st.won || paused() || document.hidden || st.moves === 0) return;
      st.time++;
      $('time').textContent = fmt(st.time);
      if (st.time % 5 === 0) save();
    }, 1000);
    window.addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
    // Räkna om layouten när skärmen ändrar storlek. iOS skickar inte alltid resize vid vridning
    // (t.ex. om iPaden vreds medan appen låg i bakgrunden), så vi lyssnar på flera håll.
    const relayoutSoon = () => { relayout(); requestAnimationFrame(relayout); setTimeout(relayout, 350); };
    window.addEventListener('resize', relayoutSoon);
    window.addEventListener('orientationchange', relayoutSoon);
    window.addEventListener('pageshow', relayoutSoon);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) relayoutSoon(); });
    if (window.ResizeObserver) new ResizeObserver(relayout).observe(board);
    // Offline-stöd (kräver https eller localhost)
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  return { init, watch };
})();
