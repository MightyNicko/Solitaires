// Kortens framsidor. Delas av spelen och av förhandsvisningen i inställningarna (stilarna finns i cards.css).
// CardFaces.html({ s, r }, stil) ger HTML för ett korts framsida. Färg s: 0 spader, 1 hjärter, 2 ruter, 3 klöver.
// Valör r: 1–13. Stil: 'standard', 'classic', 'modern', 'tradition' eller 'deco'.
(function () {
  const SUITS = ['♠', '♥', '♦', '♣'].map(s => s + '︎');
  const RED = [false, true, true, false];
  const RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  // Namn på klädda kort och ess, på valt språk (i18n.js) eller engelska
  const NAMES = (window.I18N && I18N.t('cardNames')) || { 1: 'Ace', 11: 'Jack', 12: 'Queen', 13: 'King' };
  // Traditionella positioner (x %, y %) för valörsymbolerna på 2–10
  const L = 34, C = 50, R = 66;
  const PIPS = {
    2: [[C, 20], [C, 80]], 3: [[C, 20], [C, 50], [C, 80]], 4: [[L, 20], [R, 20], [L, 80], [R, 80]],
    5: [[L, 20], [R, 20], [C, 50], [L, 80], [R, 80]], 6: [[L, 20], [R, 20], [L, 50], [R, 50], [L, 80], [R, 80]],
    7: [[L, 20], [R, 20], [C, 35], [L, 50], [R, 50], [L, 80], [R, 80]],
    8: [[L, 20], [R, 20], [C, 35], [L, 50], [R, 50], [C, 65], [L, 80], [R, 80]],
    9: [[L, 20], [R, 20], [L, 40], [R, 40], [C, 50], [L, 60], [R, 60], [L, 80], [R, 80]],
    10: [[L, 20], [R, 20], [C, 30], [L, 40], [R, 40], [L, 60], [R, 60], [C, 70], [L, 80], [R, 80]],
  };

  // ---------- Bildkort: Tradition och Art deco ritas som SVG-bilder i kortets mått 100 × 140 ----------
const SUITP = [
  'M0-10C3-5 10-2 10 3C10 6.5 7 8 4.5 7.2C3 6.7 1.8 5.6 1.2 4.6C1.5 7 2.2 8.8 4 10H-4C-2.2 8.8-1.5 7-1.2 4.6C-1.8 5.6-3 6.7-4.5 7.2C-7 8-10 6.5-10 3C-10-2-3-5 0-10Z',
  'M0 10C-3 5.5-10 1-10-4.2C-10-8-7.2-10-4.6-10C-2.6-10-.9-9-0-6.8C.9-9 2.6-10 4.6-10C7.2-10 10-8 10-4.2C10 1 3 5.5 0 10Z',
  'M0-10.5L7.6 0L0 10.5L-7.6 0Z',
  'M-1.1 1C-1.1 5-2.2 8.6-4.2 10H4.2C2.2 8.6 1.1 5 1.1 1ZM0-10A4.8 4.8 0 0 0-3.3-1.7A4.8 4.8 0 1 0-1 3.4H1A4.8 4.8 0 1 0 3.3-1.7A4.8 4.8 0 0 0 0-10Z',
];
  const suit = (s, x, y, k, fill, extra = '') => `<path d="${SUITP[s]}" transform="translate(${x} ${y}) scale(${k})" fill="${fill}" ${extra}/>`;
  const pips = (s, r, fill) => PIPS[r].map(([x, y]) => `<g transform="translate(${x} ${y * 1.4})${y > 55 ? ' rotate(180)' : ''}">${suit(s, 0, 0, .78, fill)}</g>`).join('');
  const rot = inner => `<g transform="rotate(180 50 70)">${inner}</g>`;
  const wrap = (inner, bg = '#fff', edge = '#c9c9c9') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140" preserveAspectRatio="none"><rect x=".5" y=".5" width="99" height="139" rx="8.5" fill="${bg}" stroke="${edge}"/>${inner}</svg>`;

  // Tradition: dubbelhövdad figur i rött, guld och svart med tjock kontur
function tradHalf(s, r, p) {
  const { m, n, a, d } = p, sk = '#fff1dc', ln = `stroke="${d}" stroke-width=".7" stroke-linejoin="round"`, hair = r === 13 ? '#f4f1e8' : r === 12 ? a : '#c98a2b';
  const curls = x => [32, 36, 40, 44].map(y => `<path d="M${x - 2.6} ${y}q2.6 2.4 5.2 0" fill="none" stroke="${d}" stroke-width=".55"/>`).join('');
  let o = '';
  // Föremålet i handen bakom kroppen
  if (r === 13) o += `<path d="M72.5 11L75 16V50H70V16Z" fill="#fff" ${ln}/><path d="M72.5 16V49" stroke="${d}" stroke-width=".4"/><rect x="65.5" y="48.5" width="14" height="3.2" rx="1.2" fill="${a}" ${ln}/><rect x="71" y="51" width="3" height="5" fill="${n}" ${ln}/>`;
  if (r === 11) o += `<path d="M73 13C78 18 77 24 73 28C69 24 68 18 73 13Z" fill="${a}" ${ln}/><path d="M73 15V26" stroke="${d}" stroke-width=".4"/><rect x="71.9" y="27" width="2.2" height="28" fill="${n}" ${ln}/>`;
  // Dräkt: bred axelparti med ok, ärmar och mittstycke
  o += `<path d="M14 62C22 53 34 49 43 46.5H61C70 49 79 53 86 58V90H14Z" fill="${m}" ${ln}/>`;
  o += `<path d="M14 72C22 62 30 56 38 53L41 62C33 66 24 74 18 84Z" fill="${n}" ${ln}/><path d="M86 66C80 60 72 55 65 53L62 62C70 65 79 70 86 76Z" fill="${n}" ${ln}/>`;
  o += [[22,68],[27.5,62.5],[33,58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.3" fill="${a}" ${ln}/><circle cx="${x}" cy="${y}" r=".8" fill="${d}"/>`).join('');
  o += [[78,65],[72.5,60.5],[67,57]].map(([x, y]) => `<path d="M${x} ${y - 2.6}L${x + 2.6} ${y}L${x} ${y + 2.6}L${x - 2.6} ${y}Z" fill="${a}" ${ln}/>`).join('');
  // Mittstycket med rutmönster och färgens symbol
  o += `<path d="M42 47H62L66 82H38Z" fill="${a}" ${ln}/>`;
  for (let row = 0; row < 3; row++) for (let i = -1; i <= 1; i++) { const x = 52 + i * 6.2, y = 54 + row * 7.4; o += `<path d="M${x} ${y - 3.2}L${x + 3} ${y}L${x} ${y + 3.2}L${x - 3} ${y}Z" fill="${(i + row) & 1 ? d : n}"/>`; }
  o += `<path d="M42 47L38 82M62 47L66 82" stroke="${d}" stroke-width="1.5"/>`;
  // Hår bakom ansiktet
  if (r === 12) o += `<path d="M42 16C31 24 32 44 35 56L42 50L44 28Z" fill="${m}" ${ln}/><path d="M62 16C72 24 72 44 69 56L62 50L60 28Z" fill="${m}" ${ln}/>`;
  o += `<path d="M42 24C38 32 37 44 39 50C42 52 45 51 47 49H57C59 51 62 52 65 50C67 44 66 32 62 24Z" fill="${hair}" ${ln}/>` + curls(41.5) + curls(62.5);
  // Krage
  for (let i = 0; i < 6; i++) o += `<circle cx="${42.5 + i * 3.8}" cy="47.2" r="2.5" fill="#fff" ${ln}/>`;
  // Ansikte
  o += `<path d="M43.5 24H60.5C61 32 60.5 37.5 57 41.5C54.6 44 49.4 44 47 41.5C43.5 37.5 43 32 43.5 24Z" fill="${sk}" ${ln}/>`;
  o += `<path d="M45.3 29q2.4-1.5 4.8-.2M53.9 28.8q2.4-1.3 4.8.2" fill="none" stroke="${d}" stroke-width=".8" stroke-linecap="round"/>`;
  o += `<path d="M45.6 31.4q2.2-1.5 4.3 0q-2.1 1.1-4.3 0ZM54.1 31.4q2.2-1.5 4.3 0q-2.1 1.1-4.3 0Z" fill="#fff" stroke="${d}" stroke-width=".45"/><circle cx="47.8" cy="31.3" r=".85" fill="${d}"/><circle cx="56.3" cy="31.3" r=".85" fill="${d}"/>`;
  o += `<path d="M52.2 30.5L51 36.2q1.1.8 2.4.1" fill="none" stroke="${d}" stroke-width=".55" stroke-linecap="round"/>`;
  if (r === 13) {
    o += `<path d="M44.2 34C45 38 47 38.2 49 37.6C50.4 37.2 51 37.4 52 37.8C53 37.4 53.6 37.2 55 37.6C57 38.2 59 38 59.8 34C61.5 38 60 44 56.8 47.5C54.5 49.6 49.5 49.6 47.2 47.5C44 44 42.5 38 44.2 34Z" fill="${hair}" ${ln}/>`;
    o += `<path d="M48 41q4-1.2 8 0" fill="none" stroke="#c8102e" stroke-width="1"/><path d="M48.5 44V47M52 44.5V48M55.5 44V47" stroke="${d}" stroke-width=".45"/>`;
  } else o += `<path d="M49.4 39.2q2.6-1.2 5.2 0q-2.6 1.8-5.2 0Z" fill="#c8102e" stroke="${d}" stroke-width=".3"/>`;
  if (r === 12) o += `<circle cx="47" cy="36" r="1.3" fill="#f6a78f" opacity=".7"/><circle cx="57" cy="36" r="1.3" fill="#f6a78f" opacity=".7"/>`;
  // Huvudbonad
  if (r === 13) o += `<path d="M42 24L38.5 10.5L45 16L48 7.5L52 15L56 7.5L59 16L65.5 10.5L62 24Z" fill="${a}" ${ln}/><rect x="41.5" y="20.5" width="21" height="4.4" fill="${n}" ${ln}/>` + [45,52,59].map(x => `<circle cx="${x}" cy="22.7" r="1.2" fill="#fff" ${ln}/>`).join('') + [38.5,48,56,65.5].map((x, i) => `<circle cx="${x}" cy="${i % 3 ? 7 : 10}" r="1.3" fill="${n}" ${ln}/>`).join('');
  if (r === 12) o += `<path d="M42.5 24L40.5 13L46.3 18L52 10L57.7 18L63.5 13L61.5 24Z" fill="${a}" ${ln}/><path d="M43 21.5H61V25H43Z" fill="${d}" ${ln}/>` + [46,52,58].map(x => `<path d="M${x} 21.8l1.5 1.5l-1.5 1.5l-1.5-1.5Z" fill="#fff"/>`).join('') + [40.5,52,63.5].map((x, i) => `<circle cx="${x}" cy="${i === 1 ? 9.5 : 12.5}" r="1.3" fill="#fff" ${ln}/>`).join('');
  if (r === 11) o += `<path d="M39.5 25C36 17 44 11.5 53 11.5C62 11.5 68 17 64.5 25Z" fill="${m}" ${ln}/><rect x="41" y="21" width="22" height="4.2" fill="${a}" ${ln}/><path d="M62 18C66 11 72 9 78 10C75 15 70 19 64 20Z" fill="${a}" ${ln}/><path d="M63.5 19C68 15 72 12.5 77 10.5" stroke="${d}" stroke-width=".45" fill="none"/>`;
  // Handen och blomman
  if (r === 13 || r === 11) o += `<path d="M68 51.5C69 49.5 76 49.5 77 51.5C78 54 77 57.5 72.5 57.5C69 57.5 67 54 68 51.5Z" fill="${sk}" ${ln}/><path d="M70 51.5V54M72.4 51V54M74.8 51.5V54" stroke="${d}" stroke-width=".4"/>`;
  if (r === 12) o += `<path d="M30 39V55" stroke="${d}" stroke-width="1.1"/>` + [[30,34],[26.2,37],[33.8,37],[27.6,41.3],[32.4,41.3]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${a}" ${ln}/>`).join('') + `<circle cx="30" cy="38.3" r="2" fill="${n}" ${ln}/><path d="M25.5 51C26.5 49 33 49 34.5 51C35.5 54 34 57.5 30 57.5C26.5 57.5 24.6 54 25.5 51Z" fill="${sk}" ${ln}/>`;
  // Färgens symbol i bildens hörn
  o += suit(s, 29, 22, .82, p.sym, `stroke="${d}" stroke-width=".35"`);
  return o;
}
function trad(s, r) {
  const red = s === 1 || s === 2, id = 'a';
  const p = red ? { m:'#d9352b', n:'#17181f', a:'#f4b62f', d:'#17181f', sym:'#d9352b' } : { m:'#17181f', n:'#d9352b', a:'#f4b62f', d:'#17181f', sym:'#17181f' };
  if (s === 2) p.n = '#2a58b5'; if (s === 3) p.m = '#23479c';
  const col = red ? '#d9352b' : '#17181f';
  const idx = `<text x="9.5" y="17" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="16" fill="${col}">${RANKS[r]}</text>${suit(s, 9.5, 27, .6, col)}`;
  if (r <= 10) {
    const mid = r === 1 ? suit(s, 50, 70, 2.1, col) : pips(s, r, col);
    return wrap(mid + idx + rot(idx));
  }
  const half = `<g clip-path="url(#${id})">${tradHalf(s, r, p)}</g>`;
  return wrap(`<defs><clipPath id="${id}"><path d="M19 9H81V62.5L19 77.5Z"/></clipPath></defs>
    <rect x="19" y="9" width="62" height="122" fill="#fff"/>${half}${rot(half)}
    <path d="M19 77.5L81 62.5" stroke="#17181f" stroke-width="2.6"/><path d="M19 77.5L81 62.5" stroke="#f4b62f" stroke-width="1"/>
    <rect x="19" y="9" width="62" height="122" fill="none" stroke="#17181f" stroke-width=".8"/>${idx}${rot(idx)}`, '#fff', '#bdbdbd');
}

  // Art deco: figurerna i marinblått och guld på samma ljusa botten som ess till 10
function decoLightHalf(s, r, acc) {
  const G = '#f5d58a', F = '#e8c063', L = '#a67c26', N = '#121a3f', cx = 54, sk = '#f3d9ab', sh = '#d9b374';
  let o = '';
  for (let i = -12; i <= 12; i++) { const a = i * .25 - Math.PI / 2; o += `<path d="M${cx} 30L${cx + Math.cos(a) * 90} ${30 + Math.sin(a) * 90}" stroke="${L}" stroke-width=".4" opacity=".38"/>`; }
  o += `<path d="M10 70L18 54L42 46.5H66L90 54L90 70Z" fill="${acc}" stroke="${L}" stroke-width=".9"/>`;
  for (let i = 0; i < 4; i++) o += `<path d="M${cx - 30 + i * 4} 70L${cx} ${48 + i * 5.2}L${cx + 30 - i * 4} 70" fill="none" stroke="${G}" stroke-width="${i === 0 ? 1.3 : .8}"/>`;
  o += `<path d="M47 41H61V50L54 54L47 50Z" fill="${sh}" stroke="${N}" stroke-width=".45"/><path d="M${cx} 41V54L47 50V41Z" fill="${sk}"/>`;
  if (r === 12) {
    for (let i = -4; i <= 4; i++) { const a = i * .3 - Math.PI / 2, x = cx + Math.cos(a) * 24, y = 28 + Math.sin(a) * 24, x2 = cx + Math.cos(a + .13) * 24, y2 = 28 + Math.sin(a + .13) * 24, x3 = cx + Math.cos(a - .13) * 24, y3 = 28 + Math.sin(a - .13) * 24; o += `<path d="M${cx} 28L${x3} ${y3}L${x} ${y - 1.5}L${x2} ${y2}Z" fill="${i & 1 ? F : acc}" stroke="${L}" stroke-width=".6"/>`; }
    o += `<path d="M39 24H69V42L63 46V30H45V46L39 42Z" fill="${N}" stroke="${L}" stroke-width=".7"/><path d="M42 30V44M66 30V44" stroke="${G}" stroke-width=".5"/>`;
  }
  o += `<path d="M44 24H${cx}V45.5H49L44 37Z" fill="${sk}"/><path d="M64 24H${cx}V45.5H59L64 37Z" fill="${sh}"/><path d="M44 24H64V37L59 45.5H49L44 37Z" fill="none" stroke="${N}" stroke-width=".55"/>`;
  o += `<path d="M46.2 31.2H51.6M56.4 31.2H61.8" stroke="${N}" stroke-width="1.5"/><path d="M46.2 28.6L51.6 28.2M61.8 28.6L56.4 28.2" stroke="${N}" stroke-width=".7"/>`;
  o += `<path d="M${cx} 29V36.5L${cx - 2} 36.5" fill="none" stroke="${N}" stroke-width=".7"/>`;
  if (r !== 13) o += `<path d="M51.2 40.2L${cx} 39.2L56.8 40.2L${cx} 41.8Z" fill="${acc}"/>`;
  if (r === 13) {
    o += `<path d="M44 36L49 39H59L64 36V43L59 53H49L44 43Z" fill="${N}" stroke="${L}" stroke-width=".8"/><path d="M48 42V50M51 42V52.4M${cx} 42V53M57 42V52.4M60 42V50" stroke="${G}" stroke-width=".6"/><path d="M49.5 39.6H58.5" stroke="${G}" stroke-width="1.2"/>`;
    o += `<path d="M42 24V15H46V10H50V5H58V10H62V15H66V24Z" fill="${F}" stroke="${L}" stroke-width=".7"/><path d="M42 20H66" stroke="${N}" stroke-width=".9"/><path d="M${cx} 8l3 3l-3 3l-3-3Z" fill="${acc}" stroke="${N}" stroke-width=".4"/><path d="M46 15H62M50 10H58" stroke="${L}" stroke-width=".8"/>`;
  }
  if (r === 12) {
    o += `<path d="M43 24H65V21H43Z" fill="${F}" stroke="${L}" stroke-width=".5"/><path d="M${cx} 17l3 4h-6Z" fill="${acc}" stroke="${L}" stroke-width=".5"/>`;
    o += `<path d="M42 40l1.8 2.6l-1.8 2.6l-1.8-2.6ZM66 40l1.8 2.6l-1.8 2.6l-1.8-2.6Z" fill="${F}" stroke="${L}" stroke-width=".4"/>`;
  }
  if (r === 11) {
    o += `<path d="M41 25L45 12H63L67 25Z" fill="${acc}" stroke="${L}" stroke-width=".9"/><path d="M41 25H67" stroke="${F}" stroke-width="2"/><path d="M47 25L49 12M54 25V12M61 25L59 12" stroke="${G}" stroke-width=".5"/>`;
    o += `<path d="M64 14L84 9L80 13L86 14L80 17L84 20L66 19Z" fill="${F}" stroke="${L}" stroke-width=".6"/><path d="M66 16L82 14" stroke="${N}" stroke-width=".5"/>`;
    o += `<path d="M42 25V38L44 37V25ZM66 25V38L64 37V25Z" fill="${N}" stroke="${L}" stroke-width=".5"/>`;
  }
  return o;
}
function decoLight(s, r) {
  const red = s === 1 || s === 2, id = 'e', col = red ? '#c8102e' : '#121a3f', acc = ['#2849a8', '#b5122c', '#8a1f6b', '#14785a'][s];
  const idx = `<text x="10" y="16.5" text-anchor="middle" font-family="'Century Gothic',Futura,'Segoe UI',sans-serif" font-weight="700" font-size="15" fill="${col}">${RANKS[r]}</text>${suit(s, 10, 26, .55, col)}`;
  if (r <= 10) {
    const mid = r === 1 ? `<circle cx="50" cy="70" r="26" fill="#121a3f" stroke="#c9a24a" stroke-width="1.6"/><circle cx="50" cy="70" r="22" fill="none" stroke="#f5d58a" stroke-width=".6"/>${suit(s, 50, 70, 1.5, red ? '#e44a5f' : '#f5d58a')}` : pips(s, r, col);
    return wrap(`<rect x="3" y="3" width="94" height="134" rx="7" fill="none" stroke="#c9a24a" stroke-width=".9"/>${mid}${idx}${rot(idx)}`, '#fbf4e2', '#c9a24a');
  }
  const half = `<g clip-path="url(#${id})">${decoLightHalf(s, r, acc)}</g>`;
  return wrap(`<defs><clipPath id="${id}"><rect x="4" y="4" width="92" height="66"/></clipPath></defs>
    <rect x="3" y="3" width="94" height="134" rx="7" fill="none" stroke="#c9a24a" stroke-width=".9"/>${half}${rot(half)}
    <path d="M4 70H96" stroke="#a67c26" stroke-width="2"/><circle cx="50" cy="70" r="10" fill="#fbf4e2" stroke="#a67c26" stroke-width="1.5"/>${suit(s, 50, 70, .72, col)}${idx}${rot(idx)}`, '#fbf4e2', '#c9a24a');
}

  // Bilderna görs en gång per kort och läses in direkt, så att de inte blinkar första gången ett kort vänds
  const ART = { tradition: trad, deco: decoLight }, artCache = {};
  function artUri(c, style) {
    const key = style + c.s + '-' + c.r;
    if (!artCache[key]) {
      artCache[key] = 'data:image/svg+xml,' + encodeURIComponent(ART[style](c.s, c.r)).replace(/'/g, '%27');
      new Image().src = artCache[key];
    }
    return artCache[key];
  }

  function html(c, style) {
    if (ART[style]) return `<div class="f art" style="background-image:url('${artUri(c, style)}')"></div>`;
    const sym = SUITS[c.s], col = RED[c.s] ? 'red' : 'blk', rank = RANKS[c.r];
    if (style === 'classic') {
      const idx = `${rank}<small>${sym}</small>`;
      let mid;
      if (c.r === 1) mid = `<span class="ca">${sym}</span>`;
      else if (c.r > 10) mid = `<span class="cc"><i class="t">${sym}</i><b>${rank}</b><i>${sym}</i></span>`;
      else mid = PIPS[c.r].map(([x, y]) => `<span class="cp${y > 55 ? ' flip' : ''}" style="left:${x}%;top:${y}%">${sym}</span>`).join('');
      return `<div class="f ${col}"><span class="ci tl">${idx}</span>${mid}<span class="ci br">${idx}</span></div>`;
    }
    if (style === 'modern') {
      return `<div class="f mod s${c.s}"><span class="mr">${rank}</span><span class="ms">${sym}</span>` +
             `<span class="mg">${sym}</span>${NAMES[c.r] ? `<span class="mn">${NAMES[c.r]}</span>` : ''}</div>`;
    }
    return `<div class="f ${col}"><span class="r">${rank}</span><span class="a">${sym}</span><span class="b">${sym}</span></div>`;
  }

  window.CardFaces = { html, FACES: ['standard', 'classic', 'modern', 'tradition', 'deco'], BACKS: ['rings', 'classic', 'deco'] };
})();
