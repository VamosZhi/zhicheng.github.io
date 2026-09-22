(() => {
  const videos = [...document.querySelectorAll('.r-video')];
  const button = document.querySelector('.r-motion-toggle');
  if (!button) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = !preference.matches && !navigator.connection?.saveData;
  const visible = new Set();
  const manuallyPaused = new Set();
  const automaticPauses = new WeakSet();
  function pause(v) { if (!v.paused) { automaticPauses.add(v); v.pause(); } }
  function sync() {
    button.textContent = enabled ? 'Pause animations' : 'Play animations';
    button.setAttribute('aria-pressed', String(!enabled));
    videos.forEach(v => {
      if (enabled && visible.has(v) && !manuallyPaused.has(v) && !document.hidden) v.play().catch(() => {});
      else pause(v);
    });
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    sync();
  }, {threshold:0.3});
  videos.forEach(v => {
    observer.observe(v);
    v.addEventListener('pause', () => {
      if (automaticPauses.has(v)) automaticPauses.delete(v);
      else manuallyPaused.add(v);
    });
    v.addEventListener('play', () => manuallyPaused.delete(v));
  });
  button.addEventListener('click', () => { enabled = !enabled; manuallyPaused.clear(); sync(); });
  preference.addEventListener('change', () => { enabled = !preference.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  sync();
})();
