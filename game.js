// Gemensamt för alla spel (base.js och games.js laddas före). Varje spel anropar Game.init(board) först, och Game.watch(...) när spelets egna funktioner finns.
// Spelreglerna, layouten och dialogernas innehåll ligger kvar i respektive spel.
const Game = (() => {
  const $ = id => document.getElementById(id);
  const t = I18N.t;
  const store = Base.store;
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

  // Dockan och dialogerna är likadana i alla spel och byggs här. ui.mid är dockans mittknapp ('draw' Dra, 'deal' Ge, eller ingen),
  // ui.win och ui.lost är texterna (i18n-nycklar) i dialogerna Grattis och Inga fler drag.
  const icon = d => `<svg viewBox="0 0 24 24">${d}</svg>`;
  const button = (id, d, key) => `<button id="${id}">${icon(d)}<span data-i18n="${key}">${t(key)}</span></button>`;
  const MID = {
    draw: { id: 'b-draw', lbl: 'draw-lbl', text: 'Draw' },
    deal: { id: 'b-deal', lbl: 'deal-lbl', text: 'Deal · 5' },
  };
  function build(board, ui) {
    const mid = MID[ui.mid];
    board.insertAdjacentHTML('beforeend', `<div class="dock">
    ${button('b-menu', '<path d="M4 7h16M4 12h16M4 17h16"/>', 'menu')}
    ${button('b-undo', '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>', 'undo')}
    ${mid ? `<button id="${mid.id}" class="deal">${icon('<rect x="3" y="6" width="11" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/>')}<span id="${mid.lbl}">${mid.text}</span></button>` : ''}
    ${button('b-hint', '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>', 'hint')}
    ${button('b-new', '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>', 'new')}
  </div>`);
    board.insertAdjacentHTML('afterend', '<div class="toast" id="toast"></div>');
    const tx = key => `<span data-i18n="${key}">${t(key)}</span>`;
    document.body.insertAdjacentHTML('beforeend', `
<div class="overlay" id="confirm"><div class="panel">
  <h2 data-i18n="confirmTitle">${t('confirmTitle')}</h2>
  <p data-i18n="confirmText">${t('confirmText')}</p>
  <div class="row"><button class="btn" id="c-no" data-i18n="cancel">${t('cancel')}</button><button class="btn gold" id="c-yes" data-i18n="newGame">${t('newGame')}</button></div>
</div></div>

<div class="overlay" id="win"><div class="panel end">
  <h2 data-i18n="winTitle">${t('winTitle')}</h2>
  <p>${tx(ui.win)}<br><span id="win-text"></span></p>
  <div class="row"><button class="btn" id="w-change"></button><button class="btn gold" id="w-new"></button></div>
</div></div>

<div class="overlay" id="lost"><div class="panel end">
  <h2 data-i18n="lostTitle">${t('lostTitle')}</h2>
  <p>${tx(ui.lost)}<br><span id="lost-text"></span></p>
  <div class="row"><button class="btn" id="lo-undo"></button><button class="btn" id="lo-change"></button><button class="btn gold" id="lo-new"></button></div>
</div></div>
`);
  }

  // Förbereder spelplanen: dockan och dialogerna, lobbyns symbol, kortens utseende, animationernas längd, ljud,
  // och knapparna Tips och Ångra om de är avstängda
  function init(board, id, ui) {
    const INFO = GAMES.find(g => g.id === id);
    build(board, ui);
    $('lobby').querySelector('.medal svg').innerHTML = INFO.svg;   // samma symbol som på sidan Spela
    board.classList.add('face-' + FACE, 'back-' + BACK);
    board.style.setProperty('--dur', (.3 * SPEED) + 's');
    CardSounds.init(global.sound);
    if (!HINTS) $('b-hint').classList.add('off');
    if (!UNDO) $('b-undo').classList.add('off');
    // Gör ändringar utan animation (t.ex. när korten läggs på plats efter en vridning)
    const instant = fn => { board.classList.add('noanim'); fn(); void board.offsetWidth; board.classList.remove('noanim'); };
    // Statistiken per nivå: { played, won, best, fast }, där best är bästa poäng och fast snabbaste vinst i sekunder
    const loadStats = () => {
      const all = store.get(INFO.statsKey) || {};
      INFO.levels.forEach(l => all[l.key] = all[l.key] || { played:0, won:0, best:0, fast:0 });
      return all;
    };
    const stats = level => loadStats()[level];
    // Ett spel räknas som spelat i statistiken vid första draget, så att ett spel som bara delas ut inte räknas.
    // Nya spel har counted: false. Äldre sparade spel saknar fältet och räknades redan när de delades ut.
    // Ett pågående spel får counted: false igen när statistiken nollställs, så att det räknas på nytt.
    const begin = (level, st) => {
      if (st.counted !== false || !st.moves) return;
      st.counted = true;
      const all = loadStats();
      all[level].played++;
      store.set(INFO.statsKey, all);
    };
    // Topplistan: de 10 bästa spelen per nivå. Klarade spel ligger före ej klarade. Klarade rangordnas efter poäng (sedan tid),
    // ej klarade efter hur långt man kom (sedan poäng), så att ett spel som avbryts direkt inte hamnar högt.
    // Varje spel har ett id (sätts när korten delas ut) och bara en rad i listan: ett spel som läggs in igen (t.ex. klarat efter
    // Inga fler drag och Ångra) ersätter sin gamla rad.
    const record = (level, st, won) => {
      begin(level, st);   // ett spel på listan ska också finnas i statistiken (t.ex. om den nollställdes medan spelet pågick)
      st.id = st.id || Date.now();
      const e = { id: st.id, won, score: st.score, time: st.time, moves: st.moves, prog: INFO.prog(st), date: Date.now() };
      const all = store.get(INFO.topKey) || {}, list = (all[level] || []).filter(r => r.id !== e.id);
      list.push(e);
      list.sort((a, b) => (b.won - a.won) || (a.won ? b.score - a.score || a.time - b.time : b.prog - a.prog || b.score - a.score));
      all[level] = list.slice(0, 10);
      store.set(INFO.topKey, all);
    };
    // Ett klarat spel: på topplistan, och i statistiken (vinst, bästa poäng och snabbaste tid)
    const recordWin = (level, st) => {
      record(level, st, true);
      const all = loadStats(), s = all[level];
      s.won++; if (st.score > s.best) s.best = st.score;
      if (!s.fast || st.time < s.fast) s.fast = st.time;
      store.set(INFO.statsKey, all);
    };

    // Menyn (lobbyn), dialogerna och knapparna, likadant i alla spel. Spelet ger:
    // game() spelets tillstånd, newGame, undo, hint och draw (mittknappen och tangenterna d och mellanslag, om spelet har en),
    // stuck() om spelet kan köra fast, untouched() och save, inställningarna (settings, SKEY, och parse som gör om lobbyns val
    // till värdet som sparas), curLevel() och wantLevel() (spelets och lobbyns nivå), changeSub (texten under Ändra spel)
    // och lobby() som fyller i spelets egna rader i lobbyn (t.ex. reglerna).
    // Ger tillbaka open, close, showLobby, showLost och paused() (om en dialog är öppen).
    function flow({ game, newGame, undo, hint, draw, stuck = () => false, untouched, save, settings, SKEY, parse = v => v,
                    curLevel, wantLevel, changeSub, lobby = () => {} }) {
      let paused = false;
      const label = key => INFO.levels.find(l => String(l.key) === key).label;
      const close = id => { $(id).classList.remove('open'); paused = !!document.querySelector('.overlay.open'); };
      // Slutdialogernas knappar: rubrik plus en rad om vad som händer, och Nytt spel visar inställningarna det startas med
      function fillEnd() {
        const next = btnText(t('newGame'), label(wantLevel())), change = btnText(t('changeGame'), t(changeSub));
        $('w-change').innerHTML = $('lo-change').innerHTML = change;
        $('w-new').innerHTML = $('lo-new').innerHTML = next;
        $('lo-undo').innerHTML = btnText(t('undo'), t('undoSub'));
        $('lo-undo').style.display = UNDO ? '' : 'none';
      }
      const open = id => { if (id === 'win' || id === 'lost') fillEnd(); paused = true; $(id).classList.add('open'); };
      const inProgress = () => { const st = game(); return st && !st.won && st.moves > 0 && !stuck(); };
      // Ett fastlåst spel finns kvar att fortsätta (sidan Spela visar Fortsätt), och då visas Inga fler drag igen
      const resumable = () => { const st = game(); return st && !st.won && st.moves > 0; };
      function showLost() {
        const st = game();
        $('lost-text').textContent = t('winStats', { score: st.score, moves: st.moves, time: fmt(st.time) });
        open('lost');
      }
      function refreshLobby() {
        document.querySelectorAll('#lobby .seg').forEach(seg => {
          const v = String(settings[seg.dataset.key]);
          seg.querySelectorAll('.btn').forEach(b => b.classList.toggle('on', b.dataset.v === v));
        });
        lobby();
        const s = stats(wantLevel());
        $('st-played').textContent = s.played; $('st-won').textContent = s.won; $('st-best').textContent = s.best || '–';
        const going = resumable(), st = game();
        $('l-resume').style.display = going ? '' : 'none';
        if (going) $('l-resume').innerHTML = `${t('resume')}<small>${label(curLevel())} · ${INFO.progText(INFO.prog(st))}</small>`;
        $('l-play').className = going ? 'btn' : 'btn gold';
        $('l-play').innerHTML = `${going ? t('newGame') : t('play')}<small>${label(wantLevel())}</small>`;
      }
      const showLobby = () => { refreshLobby(); open('lobby'); };
      document.querySelectorAll('#lobby .seg').forEach(seg => seg.addEventListener('click', e => {
        const b = e.target.closest('.btn');
        if (!b) return;
        settings[seg.dataset.key] = parse(b.dataset.v, seg.dataset.key);
        store.set(SKEY, settings);
        refreshLobby();
      }));
      if (draw) $(MID[ui.mid].id).onclick = draw;
      $('b-undo').onclick = undo;
      $('b-hint').onclick = hint;
      $('b-menu').onclick = showLobby;
      $('b-new').onclick = () => { if (inProgress()) open('confirm'); else newGame(); };
      $('l-resume').onclick = () => { close('lobby'); if (stuck()) showLost(); };
      $('l-play').onclick = () => { if (inProgress()) open('confirm'); else { close('lobby'); if (!untouched()) newGame(); } };
      $('l-home').onclick = () => { save(); location.href = 'games.html'; };
      $('c-no').onclick = () => close('confirm');
      $('c-yes').onclick = () => { close('confirm'); close('lobby'); newGame(); };
      $('w-new').onclick = () => { close('win'); newGame(); };
      $('lo-undo').onclick = () => { close('lost'); undo(); };
      $('lo-new').onclick = () => { close('lost'); newGame(); };
      $('lo-change').onclick = () => { close('lost'); showLobby(); };
      $('w-change').onclick = () => { close('win'); showLobby(); };
      document.addEventListener('keydown', e => {
        if (paused) return;
        if (e.key === 'z' || e.key === 'Z') undo();
        else if (draw && (e.key === 'd' || e.key === ' ')) { e.preventDefault(); draw(); }
        else if (e.key === 'h') hint();
      });
      return { open, close, showLobby, showLost, paused: () => paused };
    }
    return { store, global, SPEED, UNDO, HINTS, FACE, BACK, fmt, btnText, place, instant, toast, shake, INFO, record, recordWin, begin, stats, flow };
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
    Base.offline();
  }

  return { init, watch };
})();
