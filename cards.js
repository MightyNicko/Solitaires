// Kortens framsidor. Delas av spelen och av förhandsvisningen i inställningarna (stilarna finns i cards.css).
// CardFaces.html({ s, r }, stil) ger HTML för ett korts framsida. Färg s: 0 spader, 1 hjärter, 2 ruter, 3 klöver.
// Valör r: 1–13. Stil: 'standard', 'classic' eller 'modern'.
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

  function html(c, style) {
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

  window.CardFaces = { html, FACES: ['standard', 'classic', 'modern'], BACKS: ['rings', 'classic', 'deco'] };
})();
