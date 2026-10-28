// Kortljud för alla spel. Inspelningar från Kenney "Casino Audio" (CC0), se sounds/License.txt.
// CardSounds.place(ms) spelar ett "lägga ner"-ljud så att klappet hörs om ms millisekunder,
// alltså när kortet landar. Varje fil startas så att dess ljudtopp hamnar på landningen.
const CardSounds = (() => {
  const FILES = [1, 2, 3, 4].map(n => `sounds/card-place-${n}.wav`);
  const GAP = .035;   // ljud tätare än så slås ihop (t.ex. en hel serie som flyttas samtidigt)
  let ac = null, sounds = [], last = -1, on = true;
  const planned = [];

  function init(enabled) {
    on = enabled !== false;
    if (!on) return;
    try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    FILES.forEach(f => fetch(f).then(r => r.arrayBuffer()).then(b => ac.decodeAudioData(b)).then(buf => {
      const d = buf.getChannelData(0);
      let peak = 0, at = 0;
      for (let i = 0; i < d.length; i++) if (Math.abs(d[i]) > peak) { peak = Math.abs(d[i]); at = i; }
      sounds.push({ buf, peak: at / buf.sampleRate });
    }).catch(() => {}));
    // iOS släpper bara fram ljud efter en beröring, så väck ljudet vid första tryck
    const unlock = () => { if (ac.state !== 'running') ac.resume(); };
    ['pointerdown', 'touchend', 'keydown'].forEach(t => window.addEventListener(t, unlock, { capture: true, passive: true }));
  }

  function place(ms = 0, vol = 1) {
    if (!on || !ac || !sounds.length) return;
    // Ljudet startar först vid en beröring (iOS). Har det inte hunnit starta (t.ex. när samma tryck startar utdelningen)
    // spelas ljudet när det har startat. Ljud som då har hunnit bli för gamla hoppas över.
    if (ac.state !== 'running') {
      const t0 = performance.now();
      ac.resume().then(() => {
        const left = ms - (performance.now() - t0);
        if (left > -150 && ac.state === 'running') place(Math.max(0, left), vol);
      }).catch(() => {});
      return;
    }
    const now = ac.currentTime, hit = now + ms / 1000;
    while (planned.length && planned[0] < now - 1) planned.shift();
    if (planned.some(t => Math.abs(t - hit) < GAP)) return;
    planned.push(hit);
    let k = Math.floor(Math.random() * sounds.length);
    if (k === last && sounds.length > 1) k = (k + 1) % sounds.length;
    last = k;
    const { buf, peak } = sounds[k];
    const s = ac.createBufferSource(), g = ac.createGain();
    s.buffer = buf; s.playbackRate.value = .95 + Math.random() * .1; g.gain.value = vol;
    s.connect(g).connect(ac.destination);
    const start = hit - peak / s.playbackRate.value;
    if (start >= now) s.start(start); else s.start(now, now - start);
  }

  return { init, place };
})();
