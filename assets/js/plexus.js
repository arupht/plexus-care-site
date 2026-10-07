/* =============================================================================
   PlexusCare — site behaviour.
   Theme, navigation, consent preferences and contact handoff.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------- theme --- */
  var KEY = 'plexuscare-theme';
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

  /* --------------------------------------------- analytics consent ----- */
  var analytics = window.PlexusCareAnalytics;
  var consentPanel = document.querySelector('[data-analytics-consent]');
  var preferenceButtons = document.querySelectorAll('[data-analytics-controls], [data-open-analytics]');

  if (analytics && analytics.configured) {
    preferenceButtons.forEach(function (el) { el.hidden = false; });
    if (consentPanel && !analytics.preference()) consentPanel.hidden = false;

    document.addEventListener('click', function (e) {
      var open = e.target.closest('[data-open-analytics]');
      if (open && consentPanel) {
        consentPanel.hidden = false;
        var first = consentPanel.querySelector('button');
        if (first) first.focus();
        return;
      }

      var choice = e.target.closest('[data-analytics-choice]');
      if (!choice) return;
      if (choice.getAttribute('data-analytics-choice') === 'granted') analytics.grant();
      else analytics.decline();
      if (consentPanel) consentPanel.hidden = true;
    });
  }

  /* --------------------------------------------- contact -> WhatsApp ----- */
  document.querySelectorAll('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = 'Hello PlexusCare.\n\n'
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
