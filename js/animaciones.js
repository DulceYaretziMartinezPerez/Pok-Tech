/* ============================================================
   js/animaciones.js — Capa de movimiento compartida (PokéTech)
   Se usa en TIENDA, OFERTAS y CONTÁCTANOS. Cárgalo AL FINAL, después
   de tienda.js / ofertas.js / contactanos.js.
   - Barra de progreso y header que se compacta al bajar.
   - Titular del hero palabra por palabra + burbujas + foco de luz.
   - Aparición al hacer scroll (cada tipo de bloque entra distinto).
   - Tarjetas con inclinación 3D y brillo que sigue al cursor.
   - Botones con onda e imán; el producto vuela al carrito.
   - Contadores, barras de stock e íconos que se dibujan al verse.
   Vigila los contenedores que pintan tienda.js y ofertas.js, así que
   también anima lo que se redibuja al filtrar u ordenar.
   ============================================================ */
(function () {
  'use strict';

  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var FINO = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(function () { f(Date.now()); }, 16); };

  /* ---------- Barra de progreso + header ---------- */
  function barra() {
    if (REDUCE) return;
    var b = document.createElement('div');
    b.className = 'fx-progress'; b.setAttribute('aria-hidden', 'true'); b.innerHTML = '<i></i>';
    document.body.appendChild(b);
    var i = b.firstChild, h = document.querySelector('header'), espera = false;
    function actualizar() {
      espera = false;
      var max = document.documentElement.scrollHeight - innerHeight, y = window.pageYOffset;
      i.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
      if (h) h.classList.toggle('fx-stuck', y > 8);
    }
    addEventListener('scroll', function () { if (!espera) { espera = true; raf(actualizar); } }, { passive: true });
    addEventListener('resize', actualizar);
    actualizar();
  }

  /* ---------- Hero: titular, burbujas y foco de luz ---------- */
  function palabras(h) {
    if (h.__fx || REDUCE) return; h.__fx = 1;
    var t = h.textContent.trim();
    h.setAttribute('aria-label', t);
    h.innerHTML = t.split(/\s+/).map(function (w, i) {
      return '<span class="fx-w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
  }
  function hero(h) {
    if (h.__hero) return; h.__hero = 1;
    if (!REDUCE) {
      var tipos = ['', 'r', 'b', 'p', ''], html = '';
      for (var i = 0; i < 16; i++) {
        var s = 8 + Math.random() * (i % 4 === 3 ? 34 : 16);
        html += '<i class="fx-bit ' + tipos[i % 5] + '" style="--x:' + (Math.random() * 100).toFixed(1) + '%;--s:' + s.toFixed(0) +
          'px;--t:' + (9 + Math.random() * 10).toFixed(1) + 's;--dl:-' + (Math.random() * 14).toFixed(1) +
          's;--sw:' + ((Math.random() - .5) * 120).toFixed(0) + 'px"></i>';
      }
      var caja = document.createElement('div');
      caja.className = 'fx-bits'; caja.setAttribute('aria-hidden', 'true'); caja.innerHTML = html;
      h.appendChild(caja);
    }
    if (!FINO || REDUCE) return;
    var espera = 0;
    h.addEventListener('pointermove', function (e) {
      if (espera) return;
      var cx = e.clientX, cy = e.clientY;
      espera = raf(function () {
        espera = 0;
        var r = h.getBoundingClientRect(), x = (cx - r.left) / r.width, y = (cy - r.top) / r.height;
        h.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        h.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        h.style.setProperty('--px', (x * 2 - 1).toFixed(3));
        h.style.setProperty('--py', (y * 2 - 1).toFixed(3));
      });
    });
  }

  /* ---------- Contador animado ---------- */
  function contar(el) {
    var fin = parseInt(el.textContent.replace(/[^\d]/g, ''), 10);
    if (!fin || REDUCE) return;
    var t0 = null; el.textContent = '0';
    raf(function paso(t) {
      t = t || Date.now();
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(fin * e);
      if (k < 1) raf(paso); else el.textContent = fin;
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  function alVer(el) {
    if (el.classList.contains('fx-k-bar')) el.style.setProperty('--w', el.getAttribute('data-w') + '%');
    else if (el.classList.contains('fx-k-count')) contar(el);
  }
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target; io.unobserve(el);
      el.classList.remove('fx-hide'); el.classList.add('fx-in'); alVer(el);
    });
  }, { threshold: .12, rootMargin: '0px 0px -5% 0px' }) : null;

  // [selector, tipo de entrada, ¿escalonar entre hermanos?]
  var REGLAS = [
    ['.mx-head', 'wipe'],
    ['.td-card, .of-card, .of-combo', 'pop', 1],
    ['.td-trust li', 'side', 1],
    ['.td-cond > .bx, .of-info > .bx', 'pop', 1],
    ['.of-coupon', 'rise'],
    ['.bd2', 'plain'],
    ['.of-bar i[data-w]', 'bar'],
    ['.td-stats b', 'count'],
    ['.ct-ch', 'side', 1],
    ['.ct-it', 'rise', 1],
    ['.ct-tl', 'plain'],
    ['.ct-form, .ct-ticket', 'pop'],
    ['.of-ico, .td-ico, .ct-ico, .td-trust svg', 'draw']
  ];
  function marcar(el, tipo, d) {
    if (el.__fx) return; el.__fx = 1;
    var vivo = io && !REDUCE;
    if (tipo === 'bar' && !vivo) { el.style.setProperty('--w', el.getAttribute('data-w') + '%'); return; }
    if (!vivo) return;
    if (tipo === 'draw') {
      el.classList.add('fx-draw');
      $$('path, circle', el).forEach(function (p) { p.setAttribute('pathLength', '1'); });
    } else {
      el.classList.add('fx-k-' + tipo);
      if (tipo !== 'plain' && tipo !== 'bar' && tipo !== 'count') el.classList.add('fx-hide');
    }
    if (d) el.style.setProperty('--d', d + 'ms');
    io.observe(el);
  }
  function barrer() {
    REGLAS.forEach(function (r) {
      var nuevos = $$(r[0]).filter(function (el) { return !el.__fx; }), padres = [];
      nuevos.forEach(function (el) {
        var d = 0;
        if (r[2]) {
          var p = el.parentNode;
          if (p.__n === undefined) { p.__n = 0; padres.push(p); }
          d = Math.min(p.__n++, 8) * 60;
        }
        marcar(el, r[1], d);
      });
      padres.forEach(function (p) { p.__n = undefined; });
    });
  }

  /* ---------- Tarjetas: inclinación 3D y brillo ---------- */
  function inclinar(el) {
    if (el.__tilt) return; el.__tilt = 1;
    if (el.style.getPropertyValue('--i') === '') {
      el.style.setProperty('--i', Array.prototype.indexOf.call(el.parentNode.children, el));
    }
    if (!FINO || REDUCE) return;
    var espera = 0;
    el.classList.add('fx-tilt');
    el.addEventListener('pointermove', function (e) {
      if (espera) return;
      var cx = e.clientX, cy = e.clientY;
      espera = raf(function () {
        espera = 0;
        var r = el.getBoundingClientRect(), x = (cx - r.left) / r.width, y = (cy - r.top) / r.height;
        el.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg');
        el.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
    });
    el.addEventListener('pointerleave', function () {
      el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
    });
  }
  function inclinarTodo() { $$('.td-card, .of-card').forEach(inclinar); }

  /* ---------- Carruseles: marca la diapositiva activa ---------- */
  function diapositivas() {
    if (!('IntersectionObserver' in window)) return;
    $$('.cr-track').forEach(function (tr) {
      var nuevas = $$('.cr-slide', tr).filter(function (s) { return !s.__act; });
      if (!nuevas.length) return;
      if (!tr.__io) {
        tr.__io = new IntersectionObserver(function (es) {
          es.forEach(function (en) { en.target.classList.toggle('fx-act', en.isIntersecting); });
        }, { root: tr, threshold: .6 });
      }
      nuevas.forEach(function (s) { s.__act = 1; tr.__io.observe(s); });
    });
  }

  /* ---------- Botones: onda e imán ---------- */
  function ondas() {
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest ? e.target.closest('.btn') : null;
      if (!b || b.disabled || REDUCE) return;
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement('span');
      s.className = 'fx-rip';
      s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 650);
    });
  }
  function imantar(b) {
    if (!FINO || REDUCE || b.__mag) return; b.__mag = 1;
    b.classList.add('fx-mag');
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.translate = ((e.clientX - (r.left + r.width / 2)) * .22).toFixed(1) + 'px ' + ((e.clientY - (r.top + r.height / 2)) * .3).toFixed(1) + 'px';
    });
    b.addEventListener('pointerleave', function () { b.style.translate = ''; });
  }

  /* ---------- El producto vuela al carrito ---------- */
  function volar(btn) {
    var fab = $('td-fab') || $('of-fab');
    if (!fab || REDUCE || !btn.animate) return;
    var caja = btn.closest('.td-card, .td-slide, .td-m-grid, .of-card, .of-dia, .of-combo');
    var src = caja && caja.querySelector('img.td-img, img.of-img, .td-mini img, img.of-mini, svg.td-fb, svg.of-fallback');
    var a = (src || btn).getBoundingClientRect(), b = fab.getBoundingClientRect();
    var el = document.createElement('div');
    el.className = 'fx-fly'; el.setAttribute('aria-hidden', 'true');
    if (src) el.appendChild(src.cloneNode(true));
    else el.style.cssText = 'border-radius:50%;background:var(--red)';
    (btn.closest('dialog') || document.body).appendChild(el);
    var x0 = a.left + a.width / 2 - 42, y0 = a.top + a.height / 2 - 42, x1 = b.left + b.width / 2 - 42, y1 = b.top + b.height / 2 - 42;
    var anim = el.animate([
      { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + ((x0 + x1) / 2) + 'px,' + (Math.min(y0, y1) - 120) + 'px) scale(.8) rotate(160deg)', opacity: 1, offset: .5 },
      { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.12) rotate(340deg)', opacity: .5 }
    ], { duration: 820, easing: 'cubic-bezier(.45,0,.6,.5)' });
    anim.onfinish = function () { if (el.parentNode) el.parentNode.removeChild(el); };
  }

  /* ---------- Anillo en el carrito cuando tiene productos ---------- */
  function carritos() {
    ['td-fab-n', 'of-fab-n'].forEach(function (id) {
      var n = $(id); if (!n) return;
      var fab = n.parentNode;
      function marcarFab() { fab.classList.toggle('fx-has', (parseInt(n.textContent, 10) || 0) > 0); }
      marcarFab();
      new MutationObserver(marcarFab).observe(n, { childList: true, characterData: true, subtree: true });
    });
  }

  /* ---------- Arranque ---------- */
  function iniciar() {
    document.documentElement.classList.add('fx');
    barra();
    $$('.mx-hero h1').forEach(palabras);
    $$('.mx-hero').forEach(hero);
    $$('.mx-cta .btn, .ct-hero-cta .btn').forEach(imantar);
    ondas();
    barrer(); inclinarTodo(); diapositivas(); carritos();

    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-add], button[data-g], button[data-combo]') : null;
      if (b) volar(b);
    });

    // Lo que tienda.js y ofertas.js vuelven a pintar (filtros, orden, carruseles)
    var hosts = ['td-grid', 'of-grid', 'of-combos', 'td-cr-track'].map($).filter(Boolean).concat($$('.cr-track'));
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () { barrer(); inclinarTodo(); diapositivas(); });
      hosts.forEach(function (h) { mo.observe(h, { childList: true }); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();