/* ============================================================
   js/tienda.js — Lógica de la TIENDA (PokéTech)
   - Toma los modelos de js/catalogo.js (window.PT_CATALOGO).
   - Para cambiar descuentos, imágenes, combos o condiciones
     edita SOLO el bloque CONFIGURACIÓN de aquí abajo.
   - Incluye: filtros, búsqueda, detalle, carrito y cupón
     (el chat y las quejas ahora viven en pages/contactanos.html).
   Carga este archivo DESPUÉS de utilidades.js y catalogo.js.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- CONFIGURACIÓN (edita aquí) ---------- */
  var RUTA_IMG = '../assets/img/tienda/';
  // Imágenes por generación (sin ".png"). La primera es la principal.
  var IMGS = {
    I: ['gen1_v1', 'gen1_v2'], II: ['gen2_v1'], III: ['gen3_v1', 'gen3_v2', 'gen3_v3'],
    IV: ['gen4_v1', 'gen4_v2', 'gen4_v3'], V: ['gen5_v1'], VI: ['gen6_v1'], VII: ['gen7_v1'],
    VIII: ['gen8_v1', 'libro_arte'], IX: ['gen9_v1']
  };
  // Descuentos (mismos que la página de ofertas) y etiquetas
  var PROMO = { I: 30, II: 20, III: 25, V: 35, VII: 40, VIII: 15, IX: 10 };
  var TAGS = { V: 'Más vendida', IX: 'Nueva' };
  var COMBOS = [
    { id: 'combo-clasico', n: 'Dúo Clásico',       d: 'Kanto + Johto, los dos modelos que empezaron todo.', g: ['I', 'II'],         c: '#0075BE' },
    { id: 'combo-hoenn',   n: 'Dúo Hoenn + Unova', d: 'Pantalla a color y el primer modelo 100% digital.',  g: ['III', 'V'],        c: '#000000' },
    { id: 'combo-moderno', n: 'Trío Moderno',      d: 'Alola, Galar y Paldea para entrenadores actuales.',  g: ['VII', 'VIII', 'IX'], c: '#E3350D' }
  ];
  var COMBO_EXTRA = 10;            // % extra al comprar el combo
  var CUPON = 'POKETECH10', CUPON_PCT = 10;
  var ENVIO = 99, ENVIO_GRATIS = 500; // envío a domicilio ($) y mínimo para envío gratis
  var CONDICIONES = [
    'Cambios por otro modelo dentro de 15 días naturales.',
    'Devolución con reembolso completo si llega con defecto (hasta 30 días).',
    '12 meses de garantía PokéTech.'
  ];
  var KEY = 'poketech-carrito';

  var NUM = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9 };
  var CAT = window.PT_CATALOGO || [];
  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return '$' + Math.round(n).toLocaleString('es-MX'); };
  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var ICO = {
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
    shop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16l-1 11H5zM8 9V6a4 4 0 0 1 8 0v3"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4"/></svg>'
  };

  /* ---------- DATOS ---------- */
  function precios(base, off) { var nuevo = Math.round(base * (1 - off / 100)); return { viejo: base, nuevo: nuevo }; }
  function construir() {
    var lista = CAT.map(function (c) {
      var off = PROMO[c.g] || 0, pr = precios(c.p, off);
      return { id: 'gen-' + c.g, tipo: 'pokedex', g: c.g, num: NUM[c.g] || 0, title: 'Pokédex ' + c.n, n: c.n, d: c.d, c: c.c,
        label: 'Gen ' + c.g, imgs: IMGS[c.g] || [], off: off, viejo: pr.viejo, nuevo: pr.nuevo, tag: TAGS[c.g] || '' };
    });
    var combos = COMBOS.map(function (cb) {
      var ps = cb.g.map(function (g) { return lista.filter(function (p) { return p.g === g; })[0]; }).filter(Boolean);
      if (ps.length < 2) return null;
      var suma = ps.reduce(function (s, p) { return s + p.nuevo; }, 0);
      var viejo = ps.reduce(function (s, p) { return s + p.viejo; }, 0);
      var total = Math.round(suma * (1 - COMBO_EXTRA / 100));
      return { id: cb.id, tipo: 'combo', g: '', num: 99, title: cb.n, n: cb.n, d: cb.d, c: cb.c, label: 'Combo', ps: ps,
        imgs: [], off: Math.round((1 - total / viejo) * 100), viejo: viejo, nuevo: total, tag: 'Ahorro extra' };
    }).filter(Boolean);
    return lista.concat(combos);
  }
  var items = construir();
  function porId(id) { return items.filter(function (p) { return p.id === id; })[0]; }

  /* ---------- PIEZAS DE HTML ---------- */
  function dispositivo(color) {
    return '<svg class="td-fb" viewBox="0 0 60 80" aria-hidden="true"><rect x="5" y="4" width="50" height="72" rx="9" fill="#fff" stroke="#000" stroke-width="4"/><rect x="12" y="12" width="36" height="28" rx="4" fill="#000"/><circle cx="20" cy="56" r="6" fill="' + color + '" stroke="#000" stroke-width="3"/><circle cx="42" cy="52" r="4" fill="#0075BE" stroke="#000" stroke-width="2"/><circle cx="42" cy="64" r="4" fill="#000"/></svg>';
  }
  function img(nombre, alt, color, cls) {
    return '<img class="' + (cls || 'td-img') + '" src="' + RUTA_IMG + nombre + '.png" alt="' + alt + '" loading="lazy" data-c="' + color + '">';
  }
  function visual(p) {
    if (p.tipo === 'combo') {
      return '<div class="td-pics">' + p.ps.map(function (q) {
        return '<span class="td-mini">' + (q.imgs.length ? img(q.imgs[0], 'Pokédex ' + q.n, q.c) : dispositivo(q.c)) + '</span>';
      }).join('<b>+</b>') + '</div>';
    }
    if (!p.imgs.length) return '<div class="td-pic">' + dispositivo(p.c) + '</div>';
    var vars = '';
    if (p.imgs.length > 1) {
      vars = '<div class="td-vars" role="group" aria-label="Versiones de ' + p.title + '">' + p.imgs.map(function (n, i) {
        return '<button type="button" class="td-var" aria-pressed="' + (i === 0) + '" data-src="' + RUTA_IMG + n + '.png" aria-label="Ver versión ' + (i + 1) + '"><img src="' + RUTA_IMG + n + '.png" alt="" loading="lazy"></button>';
      }).join('') + '</div>';
    }
    return '<div class="td-pic">' + img(p.imgs[0], p.title, p.c) + '</div>' + vars;
  }
  function precioHtml(p) {
    var h = '<div class="td-price"><span class="td-now">' + money(p.nuevo) + '</span>' + (p.off ? '<span class="td-was">' + money(p.viejo) + '</span>' : '') + '</div>';
    if (p.off) h += '<span class="td-save">Ahorras ' + money(p.viejo - p.nuevo) + '</span>';
    return h;
  }
  function tarjeta(p, i) {
    return '<article class="bx td-card" style="--i:' + i + '" data-id="' + p.id + '">' +
      '<div class="td-th" style="background-color:' + p.c + '"><span class="td-gen">' + p.label + '</span>' +
      (p.off ? '<span class="td-rib">-' + p.off + '%</span>' : '') + visual(p) + (p.tag ? '<span class="td-tag">' + p.tag + '</span>' : '') + '</div>' +
      '<div class="td-bd"><h3>' + p.title + '</h3><p class="td-d">' + p.d + '</p>' + precioHtml(p) +
      '<ul class="td-meta"><li>' + ICO.truck + 'Domicilio</li><li>' + ICO.shop + 'Sucursal</li><li>' + ICO.back + 'Cambios</li></ul>' +
      '<div class="td-act"><button type="button" class="btn w2" data-det="' + p.id + '">Detalles</button><button type="button" class="btn r" data-add="' + p.id + '">Agregar</button></div></div></article>';
  }


  /* ---------- HERO: CARRUSEL DE DESTACADAS (las 5 con más descuento) ---------- */
  function pintarHero() {
    var tr = $('td-cr-track'); if (!tr) return;
    var top = items.filter(function (p) { return p.tipo === 'pokedex' && p.imgs.length; })
      .sort(function (a, b) { return b.off - a.off; }).slice(0, 5);
    tr.innerHTML = top.map(function (p) {
      return '<article class="cr-slide td-slide"><div class="td-s-vis" style="--c:' + p.c + '"><span class="td-gen">' + p.label + '</span>' +
        (p.off ? '<span class="td-rib">-' + p.off + '%</span>' : '') + '<div class="td-pic">' + img(p.imgs[0], p.title, p.c) + '</div></div>' +
        '<div class="td-s-info"><h3>' + p.title + '</h3><p class="td-d">' + p.d + '</p>' + precioHtml(p) +
        '<div class="td-act"><button type="button" class="btn w2" data-det="' + p.id + '">Detalles</button><button type="button" class="btn r" data-add="' + p.id + '">Agregar</button></div></div></article>';
    }).join('');
    if (window.PTCarrusel) window.PTCarrusel.init($('td-cr'));
  }

  /* ---------- CATÁLOGO ---------- */
  var estado = { f: 'todas', o: 'gen', q: '' };
  var RANGOS = { clasicas: [1, 3], medias: [4, 6], modernas: [7, 9] };
  function filtrar() {
    var q = estado.q.trim().toLowerCase();
    var l = items.filter(function (p) {
      var ok = true, r = RANGOS[estado.f];
      if (r) ok = p.tipo === 'pokedex' && p.num >= r[0] && p.num <= r[1];
      else if (estado.f === 'combos') ok = p.tipo === 'combo';
      else if (estado.f === 'oferta') ok = p.off > 0;
      if (ok && q) ok = (p.title + ' ' + p.d + ' ' + p.label).toLowerCase().indexOf(q) > -1;
      return ok;
    });
    l.sort(function (a, b) {
      if (estado.o === 'asc') return a.nuevo - b.nuevo;
      if (estado.o === 'prc') return b.nuevo - a.nuevo;
      if (estado.o === 'off') return b.off - a.off;
      return a.num - b.num;
    });
    return l;
  }
  function pintar() {
    var grid = $('td-grid'), l = filtrar();
    $('td-count').textContent = l.length === 1 ? 'Mostrando 1 opción' : 'Mostrando ' + l.length + ' opciones';
    grid.innerHTML = l.length ? l.map(tarjeta).join('') : '<p class="td-empty bx">No encontramos nada con esa búsqueda. Prueba con otra región o quita los filtros.</p>';
  }

  /* ---------- DETALLE ---------- */
  function detalle(id) {
    var p = porId(id); if (!p) return;
    var incluye = p.tipo === 'combo' ? '<div class="td-m-sec"><h4>Incluye</h4><ul>' + p.ps.map(function (q) { return '<li>' + q.title + ' (' + q.label + ')</li>'; }).join('') + '</ul></div>' : '';
    $('td-modal-in').innerHTML = '<button type="button" class="td-x" data-cerrar aria-label="Cerrar">×</button>' +
      '<div class="td-m-grid"><div class="td-m-vis" style="background-color:' + p.c + '"><span class="td-gen">' + p.label + '</span>' + visual(p) + '</div>' +
      '<div class="td-m-body"><h3>' + p.title + '</h3><p>' + p.d + '</p>' + precioHtml(p) + incluye +
      '<div class="td-m-sec"><h4>Condiciones de compra</h4><ul>' + CONDICIONES.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul></div>' +
      '<div class="td-m-sec"><h4>Opciones de entrega</h4><ul><li class="blu">Envío a domicilio: 3 a 5 días hábiles, ' + money(ENVIO) + ' (gratis desde ' + money(ENVIO_GRATIS) + ').</li><li class="blu">Recolección en sucursal: gratis, lista en 24 horas.</li></ul></div>' +
      '<div class="td-m-act"><button type="button" class="btn r" data-add="' + p.id + '">Agregar al carrito</button><button type="button" class="btn w2" data-cerrar>Seguir viendo</button></div></div></div>';
    var d = $('td-modal');
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
  }
  function cerrarDetalle() { var d = $('td-modal'); if (d.close) d.close(); else d.removeAttribute('open'); }

  /* ---------- CARRITO ---------- */
  var carrito = cargar(), cupon = false, envio = 'casa';
  function cargar() { try { var v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v.filter(function (x) { return porId(x.id); }) : []; } catch (e) { return []; } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(carrito)); } catch (e) {} }
  function agregar(id) {
    var l = carrito.filter(function (x) { return x.id === id; })[0];
    if (l) l.q = Math.min(9, l.q + 1); else carrito.push({ id: id, q: 1 });
    guardar(); pintarCarrito();
    var f = $('td-fab'); f.classList.remove('bump'); void f.offsetWidth; f.classList.add('bump');
  }
  function cambiarQ(id, d) {
    var l = carrito.filter(function (x) { return x.id === id; })[0]; if (!l) return;
    l.q += d; if (l.q < 1) carrito = carrito.filter(function (x) { return x !== l; }); if (l.q > 9) l.q = 9;
    guardar(); pintarCarrito();
  }
  function quitar(id) { carrito = carrito.filter(function (x) { return x.id !== id; }); guardar(); pintarCarrito(); }
  function totales() {
    var sub = carrito.reduce(function (s, l) { return s + porId(l.id).nuevo * l.q; }, 0);
    var desc = cupon ? Math.round(sub * CUPON_PCT / 100) : 0;
    var env = !carrito.length || envio === 'sucursal' ? 0 : (sub - desc >= ENVIO_GRATIS ? 0 : ENVIO);
    return { sub: sub, desc: desc, env: env, total: sub - desc + env };
  }
  function pintarCarrito() {
    var n = carrito.reduce(function (s, l) { return s + l.q; }, 0);
    $('td-fab-n').textContent = n;
    $('td-items').innerHTML = carrito.length ? carrito.map(function (l) {
      var p = porId(l.id), foto = p.tipo === 'combo' ? p.ps[0] : p;
      return '<div class="td-it"><span class="td-mini">' + (foto.imgs.length ? img(foto.imgs[0], '', foto.c) : dispositivo(foto.c)) + '</span>' +
        '<div><h4>' + p.title + '</h4><small>' + money(p.nuevo) + ' c/u</small><div class="td-qty"><button type="button" data-q="-1" data-id="' + p.id + '" aria-label="Quitar uno">−</button><span>' + l.q + '</span><button type="button" data-q="1" data-id="' + p.id + '" aria-label="Agregar uno">+</button></div>' +
        '<button type="button" class="td-rm" data-rm="' + p.id + '">Quitar</button></div><div class="td-line">' + money(p.nuevo * l.q) + '</div></div>';
    }).join('') : '<p class="td-vacio">Tu carrito está vacío. Agrega una Pokédex para empezar.</p>';
    var t = totales();
    $('td-foot').innerHTML =
      '<div class="td-ship" role="radiogroup" aria-label="Opción de entrega">' +
      '<label><input type="radio" name="td-env" value="casa"' + (envio === 'casa' ? ' checked' : '') + '><b>A domicilio</b>3 a 5 días · ' + (ENVIO_GRATIS && t.sub - t.desc >= ENVIO_GRATIS ? 'gratis' : money(ENVIO)) + '</label>' +
      '<label><input type="radio" name="td-env" value="sucursal"' + (envio === 'sucursal' ? ' checked' : '') + '><b>En sucursal</b>Gratis · 24 h</label></div>' +
      '<div class="td-cup"><input id="td-cup" placeholder="Cupón" aria-label="Código de cupón" value="' + (cupon ? CUPON : '') + '"><button type="button" class="btn w2" id="td-cup-b">' + (cupon ? 'Quitar' : 'Aplicar') + '</button></div>' +
      '<div class="td-tot"><span>Subtotal</span><span>' + money(t.sub) + '</span></div>' +
      (t.desc ? '<div class="td-tot"><span>Cupón ' + CUPON + '</span><span class="neg">−' + money(t.desc) + '</span></div>' : '') +
      '<div class="td-tot"><span>Envío</span><span>' + (t.env ? money(t.env) : 'Gratis') + '</span></div>' +
      '<div class="td-tot big"><span>Total</span><span>' + money(t.total) + '</span></div>' +
      '<button type="button" class="btn r" id="td-pagar"' + (carrito.length ? '' : ' disabled') + '>Finalizar compra</button>';
  }
  function abrirCarrito(si) {
    var c = $('td-cart'); c.classList.toggle('on', si); c.setAttribute('aria-hidden', si ? 'false' : 'true');
    $('td-over').classList.toggle('on', si);
    document.body.classList.toggle('td-lock', si);
    if (si) $('td-cart-x').focus(); else $('td-fab').focus();
  }
  function pagar() {
    if (!carrito.length) return;
    var folio = 'PT-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    var t = totales();
    carrito = []; cupon = false; guardar(); pintarCarrito(); abrirCarrito(false);
    aviso('¡Gracias! Pedido ' + folio + ' por ' + money(t.total));
    confeti(innerWidth / 2, innerHeight * .4, 90);
  }

  /* ---------- AVISO Y CONFETI ---------- */
  var tt;
  function aviso(m) { var t = $('td-toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2800); }
  var cv, cx, parts = [], raf = 0, COLS = ['#E3350D', '#0075BE', '#ffffff', '#000000', '#E3350D'];
  function confeti(x, y, n) {
    if (REDUCE) return;
    cv = cv || $('td-confetti'); cx = cx || cv.getContext('2d');
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
  function desde(b, n) { var r = b.getBoundingClientRect(); confeti(r.left + r.width / 2, r.top + r.height / 2, n); }

  /* ---------- EVENTOS ---------- */
  function iniciar() {
    if (!items.length) { $('td-grid').innerHTML = '<p class="td-empty bx">No se pudo cargar el catálogo. Revisa que js/catalogo.js esté incluido.</p>'; return; }
    var gens = items.filter(function (p) { return p.tipo === 'pokedex'; }).length;
    if ($('td-n-op')) $('td-n-op').textContent = items.length;
    if ($('td-n-gen')) $('td-n-gen').textContent = gens;
    pintarHero(); pintar(); pintarCarrito();

    var chips = document.querySelectorAll('.td-chip');
    Array.prototype.forEach.call(chips, function (c) {
      c.addEventListener('click', function () {
        Array.prototype.forEach.call(chips, function (x) { x.setAttribute('aria-pressed', 'false'); });
        c.setAttribute('aria-pressed', 'true'); estado.f = c.getAttribute('data-f'); pintar();
      });
    });
    $('td-orden').addEventListener('change', function () { estado.o = this.value; pintar(); });
    $('td-q').addEventListener('input', function () { estado.q = this.value; pintar(); });

    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      var b;
      if ((b = t.closest('[data-add]'))) {
        var p = porId(b.getAttribute('data-add')); agregar(p.id); desde(b, 26); aviso('✓ ' + p.title + ' agregado al carrito');
        if (!b.getAttribute('data-txt')) b.setAttribute('data-txt', b.textContent);
        b.classList.add('ok'); b.textContent = '¡Agregado!'; clearTimeout(b._t);
        b._t = setTimeout(function () { b.textContent = b.getAttribute('data-txt'); b.classList.remove('ok'); }, 1400);
      } else if ((b = t.closest('[data-det]'))) detalle(b.getAttribute('data-det'));
      else if (t.closest('[data-cerrar]')) cerrarDetalle();
      else if ((b = t.closest('.td-var'))) {
        var caja = b.closest('.td-th, .td-m-vis'), grande = caja && caja.querySelector('.td-pic .td-img');
        if (grande) grande.src = b.getAttribute('data-src');
        Array.prototype.forEach.call(b.parentNode.querySelectorAll('.td-var'), function (h) { h.setAttribute('aria-pressed', h === b ? 'true' : 'false'); });
      } else if ((b = t.closest('[data-q]'))) cambiarQ(b.getAttribute('data-id'), +b.getAttribute('data-q'));
      else if ((b = t.closest('[data-rm]'))) quitar(b.getAttribute('data-rm'));
      else if (t.closest('#td-cup-b')) {
        if (cupon) { cupon = false; pintarCarrito(); return; }
        if ($('td-cup').value.trim().toUpperCase() === CUPON) { cupon = true; pintarCarrito(); aviso('Cupón ' + CUPON + ' aplicado: ' + CUPON_PCT + '% menos'); }
        else aviso('Ese cupón no es válido');
      } else if (t.closest('#td-pagar')) pagar();
    });
    document.addEventListener('change', function (e) { if (e.target.name === 'td-env') { envio = e.target.value; pintarCarrito(); } });
    $('td-fab').addEventListener('click', function () { abrirCarrito(true); });
    $('td-cart-x').addEventListener('click', function () { abrirCarrito(false); });
    $('td-over').addEventListener('click', function () { abrirCarrito(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('td-cart').classList.contains('on')) abrirCarrito(false); });
    $('td-modal').addEventListener('click', function (e) { if (e.target === this) cerrarDetalle(); }); // clic en el fondo
    if (location.hash === '#carrito') abrirCarrito(true); // viene del botón de carrito de Ofertas

    // Imagen que falla → dibujo de respaldo
    document.addEventListener('error', function (e) {
      var im = e.target; if (!im || im.tagName !== 'IMG' || !/td-img|td-mini/.test(im.className + im.parentNode.className)) return;
      var tmp = document.createElement('div'); tmp.innerHTML = dispositivo(im.getAttribute('data-c') || '#E3350D');
      im.parentNode.replaceChild(tmp.firstChild, im);
    }, true);
  }
  document.addEventListener('DOMContentLoaded', iniciar);
})();
