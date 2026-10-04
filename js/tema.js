/* ============================================================
   js/tema.js — Cambio de tema claro/oscuro para todo el sitio.
   Ponlo en el <head> (sin defer) para que no parpadee al cargar:
     <script src="../js/tema.js"></script>
   - Recuerda la elección en localStorage.
   - Si nunca eligió, usa la preferencia del sistema.
   - Inyecta el botón dentro del encabezado (.hd), así no hay que
     tocar components/header.html.
   ============================================================ */
(function () {
  var KEY = 'poketech-tema';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; }
    catch (e) { return null; }
  }
  function system() { return mq && mq.matches ? 'dark' : 'light'; }
  function current() { return root.getAttribute('data-theme') || system(); }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    var btn = document.querySelector('.tema-btn');
    if (btn) paint(btn, theme);
  }
  function paint(btn, theme) {
    var toDark = theme === 'light';
    btn.setAttribute('aria-label', toDark ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.querySelector('.tema-txt').textContent = toDark ? 'Oscuro' : 'Claro';
  }

  apply(saved() || system());

  document.addEventListener('DOMContentLoaded', function () {
    var hd = document.querySelector('header .hd') || document.querySelector('.hd');
    if (!hd || hd.querySelector('.tema-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tema-btn';
    btn.innerHTML =
      '<svg class="tema-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="tema-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
      '<span class="tema-txt"></span>';
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
    hd.appendChild(btn);
    paint(btn, current());
  });

  /* Si no eligió manualmente, sigue los cambios del sistema */
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function () { if (!saved()) apply(system()); });
  }
  /* Sincroniza otras pestañas abiertas */
  window.addEventListener('storage', function (e) {
    if (e.key === KEY && (e.newValue === 'light' || e.newValue === 'dark')) apply(e.newValue);
  });
})();