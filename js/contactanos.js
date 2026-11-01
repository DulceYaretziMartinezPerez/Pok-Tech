/* ============================================================
   js/contactanos.js — Lógica de la página CONTÁCTANOS (PokéTech)
   - Chat de atención (respuestas rápidas + mensaje libre).
   - Formulario de quejas y sugerencias con folio (QS-XXXXX).
   - Consulta de folio: guarda las solicitudes en localStorage.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var KEY = 'poketech-quejas';

  /* ---------- AVISO Y CONFETI ---------- */
  var tt;
  function aviso(m) { var t = $('ct-toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2800); }
  var cv, cx, parts = [], raf = 0, COLS = ['#E3350D', '#0075BE', '#ffffff', '#000000', '#E3350D'];
  function confeti(x, y, n) {
    if (REDUCE) return;
    cv = cv || $('ct-confetti'); cx = cx || cv.getContext('2d');
    var d = window.devicePixelRatio || 1; cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0);
    for (var i = 0; i < n; i++) parts.push({ x: x, y: y, vx: (Math.random() - .5) * 13, vy: -Math.random() * 12 - 3, r: Math.random() * 6, vr: (Math.random() - .5) * .4, w: 6 + Math.random() * 6, h: 4 + Math.random() * 5, c: COLS[(Math.random() * 5) | 0], t: 0, m: 60 + Math.random() * 45 });
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function loop() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (q) { return q.t < q.m; });
    parts.forEach(function (q) {
      q.t++; q.vy += .32; q.vx *= .985; q.x += q.vx; q.y += q.vy; q.r += q.vr;
      cx.save(); cx.globalAlpha = Math.max(0, 1 - q.t / q.m); cx.translate(q.x, q.y); cx.rotate(q.r);
      cx.fillStyle = q.c; cx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h); cx.strokeStyle = '#000'; cx.lineWidth = 1; cx.strokeRect(-q.w / 2, -q.h / 2, q.w, q.h);
      cx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(loop); else { raf = 0; cx.clearRect(0, 0, innerWidth, innerHeight); }
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
    if (!$('ct-msgs').children.length) {
      msg('¡Hola! Soy el asistente de PokéTech. ¿En qué te ayudo?', 'bot');
      $('ct-quick').innerHTML = Object.keys(RESP).map(function (k) { return '<button type="button">' + k + '</button>'; }).join('');
    }
    $('ct-say-q').focus();
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
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return; var b;
      if (t.closest('#ct-chat-open, [data-chat]')) abrirChat();
      else if (t.closest('#ct-chat-x')) $('ct-chat').classList.remove('on');
      else if ((b = t.closest('#ct-quick button'))) { var k = b.textContent; msg(k, 'me'); bot(RESP[k]); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('ct-chat').classList.remove('on'); });

    $('ct-say').addEventListener('submit', function (e) {
      e.preventDefault();
      var i = $('ct-say-q'), v = i.value.trim(); if (!v) return;
      msg(v, 'me'); i.value = ''; bot(libre(v));
    });

    // Formulario de quejas y sugerencias
    var f = $('ct-form');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      Array.prototype.forEach.call(f.querySelectorAll('[required]'), function (c) {
        if (!c.value.trim() || (c.type === 'email' && !/^\S+@\S+\.\S+$/.test(c.value))) { ok = false; c.style.borderColor = 'var(--red)'; } else c.style.borderColor = '';
      });
      if (!ok) { aviso('Revisa los campos marcados'); return; }
      var folio = 'QS-' + Math.random().toString(36).slice(2, 7).toUpperCase();
      var datos = leer(); datos[folio] = { tipo: f.tipo.value, fecha: fecha() }; guardar(datos);
      f.innerHTML = '<div class="ct-ok" role="status"><h3>¡Mensaje recibido!</h3><p>Guarda tu folio para dar seguimiento:</p><div class="ct-folio">' + folio + '</div><p>Nuestro equipo revisará tu caso y se pondrá en contacto contigo por correo en un máximo de 48 horas para ofrecerte una solución.</p></div>';
      confeti(innerWidth / 2, innerHeight * .5, 60);
    });

    // Consulta de folio
    $('ct-seg').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('ct-seg-q').value.trim().toUpperCase(), r = $('ct-estado'), d = leer()[v];
      r.hidden = false;
      r.textContent = d ? 'Folio ' + v + ' · ' + d.tipo + ' recibida el ' + d.fecha + ' · En revisión (máximo 48 horas).'
                        : 'No encontramos ese folio. Revisa que esté escrito como lo recibiste (QS-XXXXX).';
    });

    if (location.hash === '#chat') abrirChat();
  }
  document.addEventListener('DOMContentLoaded', iniciar);
})();
