/* ============================================================
   js/moderno.js — Carrusel reutilizable + menú móvil
   Uso:  <div class="cr" data-auto="6000">
           <div class="cr-track"><article class="cr-slide">…</article></div>
         </div>
   - Los botones y puntos se crean solos.
   - data-auto="ms" activa el avance automático (se pausa con el
     mouse encima, con el foco dentro o si el usuario reduce el movimiento).
   - Si el contenido se pinta con JS, llama PTCarrusel.init(elemento)
     cuando termines (se puede llamar varias veces).
   ============================================================ */
(function () {
  'use strict';
  var RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var PREV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  var NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  function init(el) {
    if (!el) return;
    if (el._cr) { el._cr(); return; }
    var tr = el.querySelector('.cr-track');
    if (!tr || !tr.children.length) return;

    var auto = parseInt(el.getAttribute('data-auto'), 10) || 0;
    var ui = document.createElement('div');
    ui.className = 'cr-ui';
    ui.innerHTML = '<div class="cr-dots"></div><div class="cr-btns"><button type="button" class="cr-btn" data-d="-1" aria-label="Anterior">' + PREV + '</button><button type="button" class="cr-btn" data-d="1" aria-label="Siguiente">' + NEXT + '</button></div>';
    el.appendChild(ui);
    el.setAttribute('role', 'region');
    el.setAttribute('aria-roledescription', 'carrusel');

    var dots = ui.querySelector('.cr-dots'), prev = ui.children[1].children[0], next = ui.children[1].children[1];
    var cur = 0, total = 1, paso = 1, hold = false, last = Date.now(), raf = 0;

    function medir() {
      var s = tr.children, n = s.length;
      paso = n > 1 ? s[1].offsetLeft - s[0].offsetLeft : tr.clientWidth;
      var vis = Math.max(1, Math.round((tr.clientWidth + (paso - s[0].offsetWidth)) / paso));
      total = Math.max(1, n - vis + 1);
    }
    function actual() {
      var fin = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 3;
      return fin ? total - 1 : Math.max(0, Math.min(total - 1, Math.round(tr.scrollLeft / paso)));
    }
    function pintar() {
      cur = actual();
      var ds = dots.children;
      for (var i = 0; i < ds.length; i++) ds[i].setAttribute('aria-current', i === cur ? 'true' : 'false');
      prev.disabled = cur === 0; next.disabled = cur >= total - 1;
    }
    function ir(i) {
      i = Math.max(0, Math.min(total - 1, i));
      tr.scrollTo({ left: i * paso, behavior: RM ? 'auto' : 'smooth' });
      last = Date.now();
    }
    function armar() {
      medir();
      ui.hidden = total < 2;
      if (dots.children.length !== total) {
        dots.innerHTML = '';
        for (var i = 0; i < total; i++) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'cr-dot'; b.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
          b.setAttribute('data-i', i); dots.appendChild(b);
        }
      }
      pintar();
    }

    ui.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null; if (!b) return;
      if (b.hasAttribute('data-d')) ir(cur + (+b.getAttribute('data-d')));
      else if (b.hasAttribute('data-i')) ir(+b.getAttribute('data-i'));
    });
    tr.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; pintar(); }); }, { passive: true });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { ir(cur + 1); } else if (e.key === 'ArrowLeft') { ir(cur - 1); }
    });
    window.addEventListener('resize', armar);

    if (auto && !RM) {
      var pausa = function () { hold = true; }, sigue = function () { hold = false; last = Date.now(); };
      el.addEventListener('pointerenter', pausa); el.addEventListener('pointerleave', sigue);
      el.addEventListener('focusin', pausa); el.addEventListener('focusout', sigue);
      el.addEventListener('touchstart', function () { last = Date.now() + 6000; }, { passive: true });
      setInterval(function () {
        if (hold || document.hidden || total < 2 || Date.now() - last < auto) return;
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        ir(cur >= total - 1 ? 0 : cur + 1);
      }, 500);
    }

    el._cr = armar;
    armar();
  }

  function todos() {
    var l = document.querySelectorAll('.cr');
    for (var i = 0; i < l.length; i++) init(l[i]);
  }
  window.PTCarrusel = { init: init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', todos); else todos();

  /* Menú en celular: centra el enlace activo */
  document.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () {
      var nav = document.querySelector('header nav'), on = nav && nav.querySelector('a.on');
      if (on && nav.scrollWidth > nav.clientWidth) {
        nav.scrollLeft = on.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft - (nav.clientWidth - on.offsetWidth) / 2;
      }
    });
  });
})();
