/* ============================================================
   js/contactanos.js — Lógica de la página CONTÁCTANOS (PokéTech)
   - Titular letra por letra y estado de horario en vivo.
   - Acordeón de respuestas rápidas.
   - Chat de atención (respuestas rápidas + mensaje libre).
   - Formulario de quejas y sugerencias con folio (QS-XXXXX).
   - Consulta de folio con línea de seguimiento: guarda las
     solicitudes en localStorage.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var KEY = 'poketech-quejas';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- AVISO Y CONFETI ---------- */
  var tt;
  function aviso(m) { var t = $('ct-toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2800); }
  var cv, cx, parts = [], raf = 0, COLS = ['#E3350D', '#0075BE', '#ffffff', '#000000', '#E3350D'];
  function confeti(x, y, n) {
    if (REDUCE) return;
    cv = cv || $('ct-confetti'); cx = cx || cv.getContext('2d');
    var d = window.devicePixelRatio || 1; cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0);
    for (var i = 0; i < n; i++) parts.push({ x: x, y: y, vx: (Math.random() - .5) * 13, vy: -Math.random() * 12 - 3, r: Math.random() * 6, vr: (Math.random() - .5) * .4, w: 6 + Math.random() * 6, h: 4 + Math.random() * 5, c: COLS[(Math.random() * 5) | 0], t: 0, m: 60 + Math.random() * 45, b: Math.random() < .2 });
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function loop() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (q) { return q.t < q.m; });
    parts.forEach(function (q) {
      q.t++; q.vy += .32; q.vx *= .985; q.x += q.vx; q.y += q.vy; q.r += q.vr;
      cx.save(); cx.globalAlpha = Math.max(0, 1 - q.t / q.m); cx.translate(q.x, q.y); cx.rotate(q.r);
      if (q.b) { cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(0, 0, 7, 0, 6.3); cx.fill(); cx.fillStyle = '#E3350D'; cx.beginPath(); cx.arc(0, 0, 7, Math.PI, 0); cx.fill(); cx.strokeStyle = '#000'; cx.lineWidth = 2; cx.beginPath(); cx.arc(0, 0, 7, 0, 6.3); cx.moveTo(-7, 0); cx.lineTo(7, 0); cx.stroke(); }
      else { cx.fillStyle = q.c; cx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h); cx.strokeStyle = '#000'; cx.lineWidth = 1; cx.strokeRect(-q.w / 2, -q.h / 2, q.w, q.h); }
      cx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(loop); else { raf = 0; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  /* ---------- TITULAR LETRA POR LETRA ---------- */
  function titular() {
    var h = document.querySelector('[data-split]'); if (!h) return;
    var t = h.textContent.trim();
    h.setAttribute('aria-label', t);
    h.innerHTML = t.split('').map(function (c, i) {
      return '<span class="ct-l' + (c === '.' ? ' ct-pt' : '') + '" style="--i:' + i + '" aria-hidden="true">' + c + '</span>';
    }).join('');
  }

  /* ---------- HORARIO EN VIVO (lunes a sábado, 9:00 a 18:00) ---------- */
  function horario() {
    var d = new Date(), dia = d.getDay(), h = d.getHours() + d.getMinutes() / 60;
    var abierto = dia >= 1 && dia <= 6 && h >= 9 && h < 18, txt;
    if (abierto) txt = 'Atendemos ahora, hasta las 18:00 h';
    else if (dia === 0) txt = 'Hoy no atendemos, volvemos el lunes a las 9:00 h';
    else if (h < 9) txt = 'Aún no abrimos, hoy desde las 9:00 h';
    else txt = dia === 6 ? 'Cerrado por hoy, volvemos el lunes a las 9:00 h' : 'Cerrado por hoy, volvemos mañana a las 9:00 h';
    $$('[data-status]').forEach(function (el) {
      el.setAttribute('data-open', abierto ? 'true' : 'false');
      el.querySelector('span').textContent = txt;
    });
  }

  /* ---------- ACORDEÓN ---------- */
  function acordeon() {
    var its = $$('.ct-it');
    its.forEach(function (it) {
      var q = it.querySelector('.ct-q');
      q.addEventListener('click', function () {
        var abre = !it.classList.contains('open');
        its.forEach(function (o) { o.classList.remove('open'); o.querySelector('.ct-q').setAttribute('aria-expanded', 'false'); });
        if (abre) { it.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  /* ---------- CHAT DE ATENCIÓN ---------- */
  var RESP = {
    'Envíos': 'Enviamos a domicilio en 3 a 5 días hábiles ($99, gratis desde $500) o puedes recoger gratis en sucursal en 24 horas.',
    'Cambios': 'Aceptamos cambios dentro de 15 días y devoluciones por defecto hasta 30 días. Escribe a atencion@poketech.com para iniciar el trámite.',
    'Mi pedido': 'Con tu folio (PT-XXXXXX) revisamos el estado de tu pedido. Compártelo por correo a atencion@poketech.com y te respondemos en menos de 24 horas.',
    'Hablar con alguien': 'Con gusto. Escríbenos a atencion@poketech.com o deja tu mensaje en el formulario de quejas y sugerencias; un asesor te contactará.'
  };
  function msg(t, quien) {
    var m = $('ct-msgs'), d = document.createElement('div');
    d.className = 'ct-msg ' + quien; d.textContent = t; m.appendChild(d); m.scrollTop = m.scrollHeight;
  }
  function bot(t) {
    var m = $('ct-msgs'), d = document.createElement('div');
    d.className = 'ct-msg bot ct-typing'; d.innerHTML = '<i></i><i></i><i></i>'; m.appendChild(d); m.scrollTop = m.scrollHeight;
    setTimeout(function () { d.remove(); msg(t, 'bot'); }, REDUCE ? 0 : 900);
  }
  function abrirChat() {
    $('ct-chat').classList.add('on');
    document.body.classList.add('ct-chat-on');
    if (!$('ct-msgs').children.length) {
      msg('¡Hola! Soy el asistente de PokéTech. ¿En qué te ayudo?', 'bot');
      $('ct-quick').innerHTML = Object.keys(RESP).map(function (k) { return '<button type="button">' + k + '</button>'; }).join('');
    }
    $('ct-say-q').focus();
  }
  function cerrarChat() {
    $('ct-chat').classList.remove('on');
    document.body.classList.remove('ct-chat-on');
  }
  function libre(t) {
    var s = t.toLowerCase();
    if (/env[ií]o|entrega|domicilio|sucursal/.test(s)) return RESP['Envíos'];
    if (/cambio|devol|garant/.test(s)) return RESP['Cambios'];
    if (/pedido|folio|compra/.test(s)) return RESP['Mi pedido'];
    return 'Gracias por escribirnos. Para darte una mejor respuesta, elige una opción rápida o escríbenos a atencion@poketech.com.';
  }

  /* ---------- FOLIOS (seguimiento) ---------- */
  function leer() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function guardar(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function fecha() { return new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }); }

  function iniciar() {
    titular(); horario(); acordeon();
    setInterval(horario, 60000);

    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return; var b;
      if (t.closest('#ct-chat-open, [data-chat]')) abrirChat();
      else if (t.closest('#ct-chat-x')) cerrarChat();
      else if ((b = t.closest('#ct-quick button'))) { var k = b.textContent; msg(k, 'me'); bot(RESP[k]); }
      else if ((b = t.closest('[data-copiar]'))) {
        var folio = b.getAttribute('data-copiar');
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(folio).then(function () { aviso('¡Folio ' + folio + ' copiado!'); }, function () { aviso('Tu folio es ' + folio); });
        else aviso('Tu folio es ' + folio);
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarChat(); });

    $('ct-say').addEventListener('submit', function (e) {
      e.preventDefault();
      var i = $('ct-say-q'), v = i.value.trim(); if (!v) return;
      msg(v, 'me'); i.value = ''; bot(libre(v));
    });

    // Formulario de quejas y sugerencias
    var f = $('ct-form');
    f.addEventListener('input', function (e) {
      var c = e.target.closest ? e.target.closest('.ct-f') : null;
      if (c) c.classList.remove('bad');
      if (e.target.name === 'msg') $('ct-count').textContent = e.target.value.length + ' / 500';
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, primero = null;
      $$('[required]', f).forEach(function (c) {
        var malo = !c.value.trim() || (c.type === 'email' && !/^\S+@\S+\.\S+$/.test(c.value));
        var caja = c.closest('.ct-f'); caja.classList.remove('bad');
        if (malo) { ok = false; void caja.offsetWidth; caja.classList.add('bad'); if (!primero) primero = c; }
      });
      if (!ok) { aviso('Revisa los campos marcados'); primero.focus(); return; }
      var tipo = f.tipo.value;
      var envio = f.querySelector('[type="submit"]');
      envio.classList.add('is-load'); envio.disabled = true; envio.textContent = 'Enviando…';
      setTimeout(function () {
        var folio = 'QS-' + Math.random().toString(36).slice(2, 7).toUpperCase();
        var datos = leer(); datos[folio] = { tipo: tipo, fecha: fecha() }; guardar(datos);
        f.innerHTML = '<div class="ct-ok" role="status">' +
          '<svg class="ct-check" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23" pathLength="1"/><path d="M15 27l8 8 14-16" pathLength="1"/></svg>' +
          '<h3>¡Mensaje recibido!</h3><p>Guarda tu folio para dar seguimiento:</p>' +
          '<div class="ct-folio">' + folio + '</div>' +
          '<div><button type="button" class="btn w2" data-copiar="' + folio + '">Copiar folio</button></div>' +
          '<p>Nuestro equipo revisará tu caso y se pondrá en contacto contigo por correo en un máximo de 48 horas para ofrecerte una solución.</p></div>';
        f.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
        confeti(innerWidth / 2, innerHeight * .5, 70);
      }, REDUCE ? 0 : 900);
    });

    // Consulta de folio
    $('ct-seg').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('ct-seg-q').value.trim().toUpperCase(), r = $('ct-estado'), d = leer()[v];
      r.hidden = false;
      r.classList.remove('bad'); void r.offsetWidth;
      if (d) {
        r.innerHTML = '<ol class="ct-trk"><li class="done">Recibida</li><li class="now">En revisión</li><li>Te contactamos</li></ol>' +
          '<p><b>Folio ' + esc(v) + '</b>. ' + esc(d.tipo) + ' recibida el ' + esc(d.fecha) + '. Te respondemos en un máximo de 48 horas.</p>';
      } else {
        r.innerHTML = '<p>No encontramos ese folio. Revisa que esté escrito como lo recibiste (QS-XXXXX).</p>';
        r.classList.add('bad');
      }
    });

    if (location.hash === '#chat') abrirChat();
  }
  document.addEventListener('DOMContentLoaded', iniciar);
})();