/* SHARAN lo-fi wireframe — navbar, page-spec drawer, flag toggle.
   No dependencies. Everything degrades to plain HTML without JS. */
(function () {
  'use strict';

  /* ---------------------------------------------------------- mobile navbar */
  var toggle = document.querySelector('.navbar__toggle');
  var drawer = document.getElementById('nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      drawer.setAttribute('data-open', String(!open));
    });
  }

  /* ------------------------------------------------------- page spec drawer */
  var spec = document.getElementById('page-spec');
  if (spec) {
    var lastFocus = null;

    function openSpec() {
      lastFocus = document.activeElement;
      spec.setAttribute('data-open', 'true');
      document.documentElement.style.overflow = 'hidden';
      var close = spec.querySelector('.specdrawer__close');
      if (close) close.focus();
    }

    function closeSpec() {
      spec.setAttribute('data-open', 'false');
      document.documentElement.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-spec-open]');
      if (opener) { e.preventDefault(); openSpec(); return; }
      if (e.target.closest('[data-spec-close]')) { e.preventDefault(); closeSpec(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && spec.getAttribute('data-open') === 'true') closeSpec();
      // Shift + S opens the spec from anywhere, as long as you're not typing.
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (!typing && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        spec.getAttribute('data-open') === 'true' ? closeSpec() : openSpec();
      }
    });

    /* ------------------------------ "confirm" flag visibility (remembered) */
    var flagBox = document.getElementById('spec-flags');
    if (flagBox) {
      var stored = null;
      try { stored = localStorage.getItem('sharan.hideFlags'); } catch (err) { /* private mode */ }
      var hidden = stored === 'true';
      document.body.setAttribute('data-hide-flags', String(hidden));
      flagBox.checked = !hidden;
      flagBox.addEventListener('change', function () {
        var hide = !flagBox.checked;
        document.body.setAttribute('data-hide-flags', String(hide));
        try { localStorage.setItem('sharan.hideFlags', String(hide)); } catch (err) { /* ignore */ }
      });
    }
  }
})();
