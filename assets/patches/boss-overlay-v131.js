(() => {
  'use strict';

  const VERSION = 'v1.7.0 · MOBILE FLOW + ENDGAME · 4×8';
  const stats = window.WGRunStats = window.WGRunStats || { bossesDefeated:0, laneRescues:0, emergencyUses:0 };
  const seenBosses = new Map();
  const mobile = matchMedia('(max-width: 600px), (pointer: coarse)').matches;
  const minFrame = mobile ? 33 : 16;
  let lastDraw = 0;

  function ensureOverlay() {
    const boardBox = document.getElementById('boardBox');
    if (!boardBox) return null;
    let overlay = document.getElementById('bossOverlayV131');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bossOverlayV131';
      overlay.className = 'bossOverlayV131';
      overlay.setAttribute('aria-hidden', 'true');
      boardBox.prepend(overlay);
    }
    return overlay;
  }

  function updateVersionAndCopy() {
    const version = document.querySelector('.version');
    if (version) version.textContent = VERSION;
    const intro = document.querySelector('#intro .modal p');
    if (intro) intro.textContent = 'Premium-Wächter, Muschel-Depots und Boss-Sprites direkt über ihrer eigenen Spur: Der Boss bleibt spielerisch lane-gebunden, wird aber vollständig mit Glow über den Lane-Grenzen angezeigt.';
  }

  function trackBosses(liveBosses) {
    const liveIds = new Set(liveBosses.map(b => String(b.id)));
    liveBosses.forEach(b => seenBosses.set(String(b.id), true));
    if (typeof S === 'undefined' || !S || S.end) return;
    for (const [id, wasLive] of seenBosses) {
      if (wasLive && !liveIds.has(id)) {
        stats.bossesDefeated += 1;
        seenBosses.set(id, false);
      }
    }
  }

  function drawBosses() {
    const overlay = ensureOverlay();
    if (!overlay) return;
    if (typeof S === 'undefined' || !S || !Array.isArray(S.e)) {
      overlay.replaceChildren();
      return;
    }

    const lanes = Array.from(document.querySelectorAll('.lane'));
    const bosses = S.e.filter(e => e && e.hp > 0 && typeof e.cl === 'string' && e.cl.includes('boss')).sort((a,b) => a.x - b.x);
    trackBosses(bosses);

    const ids = new Set(bosses.map(b => String(b.id)));
    overlay.querySelectorAll('.bossFloatingV131').forEach(node => {
      if (!ids.has(node.dataset.id)) node.remove();
    });

    const now = performance.now();
    bosses.forEach(boss => {
      const lane = lanes[boss.r];
      if (!lane) return;
      let node = overlay.querySelector(`.bossFloatingV131[data-id="${boss.id}"]`);
      if (!node) {
        node = document.createElement('div');
        node.className = 'bossFloatingV131';
        node.dataset.id = String(boss.id);
        node.innerHTML = '<img alt=""><span class="bossLaneBadge"></span>';
        overlay.appendChild(node);
      }

      node.classList.toggle('hit', Number(boss.hitUntil || 0) > now);
      const img = node.querySelector('img');
      if (img && boss.asset && img.getAttribute('src') !== boss.asset) img.src = boss.asset;
      if (img) img.alt = boss.n || 'Boss';
      const badge = node.querySelector('.bossLaneBadge');
      if (badge) badge.textContent = `BOSS · Spur ${Number(boss.r) + 1}`;

      const x = lane.offsetLeft + lane.offsetWidth * (Math.max(0, Math.min(100, Number(boss.x || 0))) / 100);
      const y = lane.offsetTop + lane.offsetHeight / 2;
      node.style.transform = `translate3d(${x}px,${y}px,0)`;
      node.style.left = '0';
      node.style.top = '0';
      node.style.setProperty('--bossScale', String(Math.min(1.16, 1 + Number(boss.rank || 1) * 0.016)));
    });
  }

  function frame(ts) {
    if (ts - lastDraw >= minFrame) {
      lastDraw = ts;
      try { drawBosses(); } catch (err) { console.warn('Boss overlay patch:', err); }
    }
    requestAnimationFrame(frame);
  }

  function start() {
    updateVersionAndCopy();
    ensureOverlay();
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})();
