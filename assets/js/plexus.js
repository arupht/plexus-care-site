/* =============================================================================
   Plexus Care — site behaviour.
   Four small jobs. Everything on the page works without this file.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------- theme --- */
  var KEY = 'plexus-theme';
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function current() {
    var set = document.documentElement.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function apply(t) {
    if (t) document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
    var b = document.querySelector('[data-theme-toggle]');
    if (b) b.setAttribute('aria-label',
      current() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  apply(stored());

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-theme-toggle]')) return;
    var next = current() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch (err) {}
    apply(next);
  });

  /* --------------------------------------------------------------- nav --- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var mark = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    mark();
    window.addEventListener('scroll', mark, { passive: true });
  }

  /* -------------------------------------------------------------- year --- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --------------------------------------------- contact -> WhatsApp ----- */
  document.querySelectorAll('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = 'Hello Plexus Care.\n\n'
        + 'Name: ' + (d.get('name') || '—') + '\n'
        + 'Organisation: ' + (d.get('org') || '—') + '\n'
        + 'Interested in: ' + (d.get('interest') || '—') + '\n\n'
        + (d.get('message') || '');
      window.open('https://wa.me/919582220608?text=' + encodeURIComponent(msg),
                  '_blank', 'noopener');
      var note = form.querySelector('[data-form-note]');
      if (note) note.hidden = false;
    });
  });
})();
