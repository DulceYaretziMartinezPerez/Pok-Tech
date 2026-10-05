/* ==========================================================================
   ANIMACIONES
   01. Barra de progreso de scroll
   02. Aparición de elementos al hacer scroll
   ========================================================================== */

(function () {
  'use strict';

  /* ----- 01. Barra de progreso ----- */
  var bar = document.querySelector('.prog');

  function actualizarProgreso() {
    if (!bar) return;

    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var avance = max > 0 ? h.scrollTop / max : 0;

    bar.style.transform = 'scaleX(' + avance + ')';
  }

  addEventListener('scroll', actualizarProgreso, { passive: true });
  addEventListener('resize', actualizarProgreso);
  actualizarProgreso();


  /* ----- 02. Aparición al hacer scroll ----- */
  var selectores = [
    '.pk-card',
    '.pk-team > h2',
    '.pk-team > p',
    '.lead',
    '.bx',
    '.pc',
    '.tz',
    '.mv',
    '.fd',
    '.dp',
    '.pp',
    '.wc',
    '.cf',
    '.spec',
    '.tm',
    '.kp',
    '.fg > div'
  ].join(',');

  var elementos = document.querySelectorAll(selectores);

  elementos.forEach(function (el) {
    var posicion = Array.prototype.indexOf.call(el.parentNode.children, el);

    el.style.setProperty('--d', (posicion % 4) * 0.12 + 's');
    el.classList.add('rv');
  });

  // Navegadores sin IntersectionObserver: mostrar todo directamente
  if (!('IntersectionObserver' in window)) {
    elementos.forEach(function (el) {
      el.classList.add('in');
    });
    return;
  }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('in');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  elementos.forEach(function (el) {
    observador.observe(el);
  });
})();