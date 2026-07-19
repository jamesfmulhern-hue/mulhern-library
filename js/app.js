/* The Mulhern Story Library — filtering, search, theme, reveal */
(function () {
  'use strict';

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', mode);
  function paintToggle() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch to ' + (mode === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML = mode === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  paintToggle();
  if (toggle) toggle.addEventListener('click', function () {
    mode = mode === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', mode);
    paintToggle();
  });

  /* ---------- Filtering ---------- */
  var grid = document.getElementById('story-grid');
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
    var state = { author: 'all', theme: 'all', level: 'all', q: '' };
    var countEl = document.getElementById('result-count');
    var emptyEl = document.getElementById('empty-state');

    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var okA = state.author === 'all' || c.dataset.author === state.author;
        var okT = state.theme === 'all' || (c.dataset.themes || '').split('|').indexOf(state.theme) > -1;
        var okL = state.level === 'all' || c.dataset.level === state.level;
        var hay = (c.dataset.search || '').toLowerCase();
        var okQ = !state.q || hay.indexOf(state.q) > -1;
        var vis = okA && okT && okL && okQ;
        c.style.display = vis ? '' : 'none';
        if (vis) shown++;
      });
      if (countEl) countEl.textContent = shown + (shown === 1 ? ' story' : ' stories') + ' shown';
      if (emptyEl) emptyEl.classList.toggle('show', shown === 0);
    }

    document.querySelectorAll('.chip[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var dim = chip.dataset.filter, val = chip.dataset.value;
        state[dim] = val;
        document.querySelectorAll('.chip[data-filter="' + dim + '"]').forEach(function (c) {
          c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
        });
        apply();
      });
    });

    var searchInput = document.getElementById('search');
    if (searchInput) searchInput.addEventListener('input', function () {
      state.q = this.value.trim().toLowerCase();
      apply();
    });

    apply();
  }

  /* ---------- Reveal on scroll ---------- */
  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12 })
    : null;
  document.querySelectorAll('.reveal').forEach(function (el) {
    if (io) io.observe(el); else el.classList.add('in');
  });
})();
