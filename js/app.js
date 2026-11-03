(function () {
  var root = document.documentElement;

  /* tema chiaro/scuro */
  var btn = document.getElementById('theme');
  var sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
  }
  function paint() { if (btn) { btn.innerHTML = isDark() ? sun : moon; btn.setAttribute('aria-label', isDark() ? 'Passa al tema chiaro' : 'Passa al tema scuro'); } }
  if (btn) btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('cf-theme', next); } catch (e) {}
    paint();
  });
  paint();

  /* barra di avanzamento lettura */
  var bar = document.getElementById('progress');
  if (bar) {
    var tick = false;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
      tick = false;
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* player */
  document.querySelectorAll('audio').forEach(function (a) {
    var note = document.querySelector('.song-note');
    a.addEventListener('error', function () {
      a.style.display = 'none';
      if (note) note.hidden = false;
    });
    a.addEventListener('play', function () {
      if ('mediaSession' in navigator && window.MediaMetadata) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: a.getAttribute('data-title') || 'Caffè Freddo',
          artist: 'Caffè Freddo',
          album: 'Caffè Freddo',
          artwork: [{ src: a.getAttribute('data-art') || 'images/cover.jpg', sizes: '768x768', type: 'image/jpeg' }]
        });
      }
    });
    a.addEventListener('ended', function () {
      var next = document.querySelector('.btn.primary');
      if (next) next.classList.add('pulse');
    });
  });
})();
