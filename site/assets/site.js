(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav?.classList.contains('open')) { closeMenu(); menu.focus(); } });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  const search = document.querySelector('#pub-search');
  const topic = document.querySelector('#pub-topic');
  const papers = [...document.querySelectorAll('#journal-list .publication, #conference-list .publication')];
  function filter() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    let conferenceCount = 0;
    papers.forEach(p => {
      p.hidden = !((topic.value === 'all' || p.dataset.category === topic.value) && p.textContent.toLowerCase().includes(query));
      if (!p.hidden) { if (p.classList.contains('conference-paper')) conferenceCount++; else count++; }
    });
    document.querySelector('#pub-count').textContent = `${count} journal ${count === 1 ? 'article' : 'articles'}`;
    const conferenceStatus = document.querySelector('#conference-count');
    if (conferenceStatus) conferenceStatus.textContent = `${conferenceCount} conference ${conferenceCount === 1 ? 'paper' : 'papers'}`;
    document.querySelector('#no-results').hidden = count + conferenceCount > 0;
  }
  search?.addEventListener('input', filter);
  topic?.addEventListener('change', filter);
  document.querySelector('.print-cv')?.addEventListener('click', () => window.print());
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('video').forEach(video => {
    if (video.hasAttribute('data-autoplay') && !reduced.matches && !navigator.connection?.saveData) {
      let userPaused = false;
      let autoPause = false;
      video.addEventListener('pause', () => { if (!autoPause) userPaused = true; autoPause = false; });
      video.addEventListener('play', () => { userPaused = false; });
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !userPaused && !reduced.matches) video.play().catch(() => {});
          else if (!video.paused) { autoPause = true; video.pause(); }
        });
      }, {threshold: 0.25});
      observer.observe(video);
    }
    reduced.addEventListener('change', () => { if (reduced.matches) video.pause(); });
  });
})();
