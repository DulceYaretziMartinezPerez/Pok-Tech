/* ============================================================
   js/ofertas.js — Lógica de la página de OFERTAS
   - Toma los precios reales de js/catalogo.js (window.PT_CATALOGO)
     y les aplica el descuento definido en OFERTAS (aquí abajo).
   - Para cambiar/añadir ofertas, edita SOLO el arreglo OFERTAS.
   - Al pulsar "Lo quiero" se lanza el evento 'pt:agregar'
     (para conectarlo al carrito de la tienda) y sale un aviso.
   Carga este archivo DESPUÉS de utilidades.js y catalogo.js.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- CONFIGURACIÓN (edita aquí) ---------- */
  // g = generación (igual que en catalogo.js) · off = % de descuento
  // stock = piezas que quedan · max = piezas con las que empezó la oferta
  var OFERTAS = [
    { g: 'I',    off: 30, stock: 12, max: 40 },
    { g: 'II',   off: 20, stock: 25, max: 50 },
    { g: 'III',  off: 25, stock: 9,  max: 30 },
    { g: 'V',    off: 35, stock: 6,  max: 30, tag: 'Más vendida' },
    { g: 'VII',  off: 40, stock: 4,  max: 25 },
    { g: 'VIII', off: 15, stock: 30, max: 60 },
    { g: 'IX',   off: 10, stock: 18, max: 40, tag: 'Nueva' }
  ];
  var COMBOS = [
    { n: 'Dúo Clásico',       d: 'Kanto + Johto, los dos modelos que empezaron todo.', g: ['I', 'II'] },
    { n: 'Dúo Hoenn + Unova', d: 'Pantalla a color y el primer modelo 100% digital.',  g: ['III', 'V'] },
    { n: 'Trío Moderno',      d: 'Alola, Galar y Paldea para entrenadores actuales.',  g: ['VII', 'VIII', 'IX'] }
  ];
  var COMBO_EXTRA = 10; // % extra de descuento al comprar el combo
  var CUPON = 'POKETECH10';

  // Imágenes de cada generación (carpeta assets/img/tienda/, sin ".png").
  // La primera es la principal; las demás salen como miniaturas para cambiar de modelo.
  var RUTA_IMG = '../assets/img/tienda/';
  var IMGS = {
    I:    ['gen1_v1', 'gen1_v2'],
    II:   ['gen2_v1'],
    III:  ['gen3_v1', 'gen3_v2', 'gen3_v3'],
    IV:   ['gen4_v1', 'gen4_v2', 'gen4_v3'],
    V:    ['gen5_v1'],
    VI:   ['gen6_v1'],
    VII:  ['gen7_v1'],
    VIII: ['gen8_v1', 'libro_arte'],
    IX:   ['gen9_v1']
  };

  var NUM = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9 };
  var CAT = window.PT_CATALOGO || [];
  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return '$' + Math.round(n).toLocaleString('es-MX'); };
  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- EFECTOS: confeti de pokébolas ---------- */
  var cv, cx, parts = [], raf = 0;
  var COLS = ['#b82707', '#0075BE', '#ffcb05', '#ffffff', '#000000'];
  function medir() {
    var d = window.devicePixelRatio || 1;
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
  }
  function confeti(x, y, n) {
    if (REDUCE) return;
    cv = cv || $('of-confetti'); if (!cv) return;
    cx = cx || cv.getContext('2d');
    medir();
    for (var i = 0; i < n; i++) {
      parts.push({
        x: x, y: y, vx: (Math.random() - .5) * 12, vy: -Math.random() * 11 - 3, g: .32,
        r: Math.random() * 6.28, vr: (Math.random() - .5) * .4,
        w: 6 + Math.random() * 6, h: 4 + Math.random() * 5,
        c: COLS[(Math.random() * COLS.length) | 0], t: 0, max: 60 + Math.random() * 40,
        ball: Math.random() < .2
      });
    }
    if (!raf) raf = requestAnimationFrame(bucle);
  }
  function bucle() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (q) { return q.t < q.max; });
    for (var i = 0; i < parts.length; i++) {
      var q = parts[i];
      q.t++; q.vy += q.g; q.vx *= .985; q.x += q.vx; q.y += q.vy; q.r += q.vr;
      cx.save(); cx.globalAlpha = Math.max(0, 1 - q.t / q.max);
      cx.translate(q.x, q.y); cx.rotate(q.r);
      if (q.ball) {
        cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(0, 0, 7, 0, 6.29); cx.fill();
        cx.fillStyle = '#b82707'; cx.beginPath(); cx.arc(0, 0, 7, Math.PI, 0); cx.fill();
        cx.lineWidth = 2; cx.strokeStyle = '#000'; cx.beginPath(); cx.arc(0, 0, 7, 0, 6.29); cx.moveTo(-7, 0); cx.lineTo(7, 0); cx.stroke();
      } else {
        cx.fillStyle = q.c; cx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h);
        cx.lineWidth = 1; cx.strokeStyle = '#000'; cx.strokeRect(-q.w / 2, -q.h / 2, q.w, q.h);
      }
      cx.restore();
    }
    if (parts.length) raf = requestAnimationFrame(bucle);
    else { raf = 0; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function desdeBoton(b, n) {
    var r = b.getBoundingClientRect();
    confeti(r.left + r.width / 2, r.top + r.height / 2, n);
  }

  /* ---------- EFECTOS: precios que "cuentan" hasta su valor ---------- */
  function contar(raiz) {
    if (REDUCE || !raiz) return;
    var els = raiz.querySelectorAll('.of-now');
    for (var i = 0; i < els.length; i++) {
      (function (el) {
        var fin = parseInt(el.textContent.replace(/[^\d]/g, ''), 10); if (!fin) return;
        var t0 = null;
        el.textContent = money(0);
        requestAnimationFrame(function paso(t) {
          if (t0 === null) t0 = t;
          var k = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - k, 3);
          el.textContent = money(fin * e);
          if (k < 1) requestAnimationFrame(paso); else el.textContent = money(fin);
        });
      })(els[i]);
    }
  }

  /* ---------- EFECTOS: aparecer al hacer scroll ---------- */
  function revelar() {
    var els = document.querySelectorAll('.of-head, .of-bar-tools, .of-combo, .of-info > div, .of-coupon, .of-dia');
    var i;
    if (!('IntersectionObserver' in window) || REDUCE) { for (i = 0; i < els.length; i++) els[i].classList.add('in'); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    for (i = 0; i < els.length; i++) {
      var idx = Array.prototype.indexOf.call(els[i].parentNode.children, els[i]);
      els[i].style.setProperty('--d', Math.min(idx, 4) * 110 + 'ms');
      els[i].classList.add('of-rv');
      io.observe(els[i]);
    }
  }

  /* ---------- EFECTOS: inclinación 3D de las tarjetas ---------- */
  function inclinar() {
    var grid = $('of-grid');
    if (!grid || REDUCE || !window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var ult = null;
    function quitar(c) { c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); }
    grid.addEventListener('pointermove', function (e) {
      var c = e.target.closest ? e.target.closest('.of-card') : null;
      if (ult && ult !== c) quitar(ult);
      ult = c; if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - .5) * 7).toFixed(2) + 'deg');
      c.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 7).toFixed(2) + 'deg');
    });
    grid.addEventListener('pointerleave', function () { if (ult) quitar(ult); ult = null; });
  }

  /* ---------- EFECTOS: barra de progreso de lectura ---------- */
  function progreso() {
    var b = document.createElement('div');
    b.className = 'of-progress'; b.setAttribute('aria-hidden', 'true');
    document.body.appendChild(b);
    function f() {
      var h = document.documentElement.scrollHeight - innerHeight;
      b.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.pageYOffset / h) : 0) + ')';
    }
    window.addEventListener('scroll', f, { passive: true });
    window.addEventListener('resize', f);
    f();
  }

  /* ---------- DATOS ---------- */
  function construir() {
    return OFERTAS.map(function (o) {
      var c = CAT.filter(function (x) { return x.g === o.g; })[0];
      if (!c) return null;
      var nuevo = Math.round(c.p * (1 - o.off / 100));
      return {
        g: o.g, num: NUM[o.g] || 0, n: c.n, d: c.d, c: c.c, imgs: IMGS[o.g] || [],
        off: o.off, tag: o.tag || '', stock: o.stock, max: o.max,
        viejo: c.p, nuevo: nuevo, ahorro: c.p - nuevo
      };
    }).filter(Boolean);
  }
  var items = construir();

  /* ---------- PIEZAS DE HTML ---------- */
  function dispositivo(color) {
    return '<svg viewBox="0 0 60 80" aria-hidden="true"><rect x="5" y="4" width="50" height="72" rx="9" fill="#fff" stroke="#000" stroke-width="4"/>' +
      '<rect x="12" y="12" width="36" height="28" rx="4" fill="#000" stroke="#000" stroke-width="3"/>' +
      '<circle cx="20" cy="56" r="6" fill="' + color + '" stroke="#000" stroke-width="3"/>' +
      '<circle cx="42" cy="52" r="4" fill="#0075BE" stroke="#000" stroke-width="2"/><circle cx="42" cy="64" r="4" fill="#000"/></svg>';
  }
  // Imagen de la Pokédex (con miniaturas si tiene varias versiones)
  function imgTag(p, i) {
    return '<img class="of-img" src="' + RUTA_IMG + p.imgs[i] + '.png" alt="Pokédex ' + p.n + '" loading="lazy" data-c="' + p.c + '">';
  }
  function visual(p) {
    if (!p.imgs.length) return dispositivo(p.c);
    var vars = '';
    if (p.imgs.length > 1) {
      vars = '<div class="of-vars" role="group" aria-label="Versiones de la Pokédex ' + p.n + '">' +
        p.imgs.map(function (n, i) {
          return '<button type="button" class="of-var" aria-pressed="' + (i === 0) + '" data-src="' + RUTA_IMG + n + '.png" aria-label="Ver versión ' + (i + 1) + '"><img src="' + RUTA_IMG + n + '.png" alt="" loading="lazy"></button>';
        }).join('') + '</div>';
    }
    return '<div class="of-pic">' + imgTag(p, 0) + '</div>' + vars;
  }
  function mini(p) {
    return p.imgs.length ? '<img class="of-mini" src="' + RUTA_IMG + p.imgs[0] + '.png" alt="Pokédex ' + p.n + '" loading="lazy" data-c="' + p.c + '">' : dispositivo(p.c);
  }
  function stockHtml(p) {
    var pct = Math.max(4, Math.min(100, Math.round(p.stock / p.max * 100)));
    var bajo = p.stock <= 5;
    return '<div class="of-stock"><div class="of-stock-top"><span>' +
      (bajo ? '<span class="low">¡Últimas ' + p.stock + ' piezas!</span>' : 'Quedan <b>' + p.stock + '</b> piezas') +
      '</span><span>' + pct + '%</span></div><div class="of-bar" role="img" aria-label="Quedan ' + p.stock + ' de ' + p.max + ' piezas"><i data-w="' + pct + '"></i></div></div>';
  }
  function precioHtml(p) {
    return '<div class="of-price"><span class="of-now">' + money(p.nuevo) + '</span><span class="of-was">' + money(p.viejo) + '</span></div>' +
      '<span class="of-save">Ahorras ' + money(p.ahorro) + '</span>';
  }
  function boton(p) {
    return '<div class="of-buy"><button type="button" class="btn r" data-g="' + p.g + '">Lo quiero</button></div>';
  }

  /* ---------- OFERTA DEL DÍA ---------- */
  function pintarDia() {
    var host = $('of-dia'); if (!host || !items.length) return null;
    var p = items.slice().sort(function (a, b) { return b.off - a.off; })[0];
    host.innerHTML =
      '<div class="of-dia-vis" style="background-color:' + p.c + '"><span class="of-gen">Gen ' + p.g + '</span>' + visual(p) +
      '<i class="of-spark sp1"></i><i class="of-spark sp2"></i><i class="of-spark sp3"></i>' +
      '<div class="of-burst" aria-label="' + p.off + '% de descuento">-' + p.off + '%<small>OFF</small></div></div>' +
      '<div class="of-dia-body"><span class="of-flag">⚡ Oferta del día</span><h3>Pokédex ' + p.n + '</h3><p>' + p.d + '</p>' +
      precioHtml(p) + stockHtml(p) + boton(p) + '</div>';
    contar(host);
    return p;
  }

  /* ---------- LISTA CON FILTROS ---------- */
  var estado = { filtro: 'todas', orden: 'desc' };
  var RANGOS = { todas: [1, 9], clasicas: [1, 3], medias: [4, 6], modernas: [7, 9] };

  function pintarLista(excluir) {
    var grid = $('of-grid'); if (!grid) return;
    var r = RANGOS[estado.filtro] || RANGOS.todas;
    var lista = items.filter(function (p) { return p !== excluir && p.num >= r[0] && p.num <= r[1]; });
    lista.sort(function (a, b) {
      switch (estado.orden) {
        case 'asc':  return a.nuevo - b.nuevo;
        case 'prc':  return b.nuevo - a.nuevo;
        case 'gen':  return a.num - b.num;
        default:     return b.off - a.off;
      }
    });
    var cnt = $('of-count');
    if (cnt) cnt.textContent = lista.length === 1 ? 'Mostrando 1 oferta' : 'Mostrando ' + lista.length + ' ofertas';
    if (!lista.length) { grid.innerHTML = '<p class="of-empty bx">No hay ofertas en esta categoría por ahora. ¡Vuelve pronto!</p>'; return; }
    grid.innerHTML = lista.map(function (p, i) {
      return '<article class="bx of-card' + (p.off >= 30 ? ' of-hot' : '') + '" style="--i:' + i + '"><span class="of-ribbon">-' + p.off + '%</span>' +
        '<div class="of-th" style="background-color:' + p.c + '"><span class="of-gen">Gen ' + p.g + '</span>' + visual(p) +
        (p.tag ? '<span class="of-tag">' + p.tag + '</span>' : '') + '</div>' +
        '<div class="of-bd"><h3>Pokédex ' + p.n + '</h3><p class="of-d">' + p.d + '</p>' +
        precioHtml(p) + stockHtml(p) + boton(p) + '</div></article>';
    }).join('');
    animarBarras(grid);
    contar(grid);
  }
  function animarBarras(raiz) {
    var barras = raiz.querySelectorAll('.of-bar i[data-w]');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        for (var i = 0; i < barras.length; i++) barras[i].style.width = barras[i].getAttribute('data-w') + '%';
      });
    });
  }

  /* ---------- COMBOS ---------- */
  function pintarCombos() {
    var host = $('of-combos'); if (!host) return;
    host.innerHTML = COMBOS.map(function (c) {
      var ps = c.g.map(function (g) { return items.filter(function (p) { return p.g === g; })[0]; }).filter(Boolean);
      if (ps.length < 2) return '';
      var sumaNueva = ps.reduce(function (s, p) { return s + p.nuevo; }, 0);
      var sumaVieja = ps.reduce(function (s, p) { return s + p.viejo; }, 0);
      var total = Math.round(sumaNueva * (1 - COMBO_EXTRA / 100));
      var minis = ps.map(mini).join('<b>+</b>');
      return '<article class="bx of-combo"><div class="of-minis">' + minis + '</div><h3>' + c.n + '</h3><p>' + c.d + '</p>' +
        '<div class="of-price"><span class="of-now">' + money(total) + '</span><span class="of-was">' + money(sumaVieja) + '</span></div>' +
        '<span class="of-save">Ahorras ' + money(sumaVieja - total) + '</span>' +
        '<div class="of-buy"><button type="button" class="btn w2" data-combo="' + c.n + '" data-precio="' + total + '">Quiero el combo</button></div></article>';
    }).join('');
    contar(host);
  }

  /* ---------- CUENTA REGRESIVA (hasta el domingo 23:59:59) ---------- */
  function meta() {
    var d = new Date();
    var falta = (7 - d.getDay()) % 7;
    var t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + falta, 23, 59, 59, 999);
    return t <= d ? new Date(t.getTime() + 7 * 864e5) : t;
  }
  var fin = meta();
  function cero(n) { return (n < 10 ? '0' : '') + n; }
  function tic() {
    var ms = fin - new Date();
    if (ms <= 0) { fin = meta(); ms = fin - new Date(); }
    var s = Math.floor(ms / 1000);
    var v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    for (var k in v) {
      var el = document.querySelector('[data-t="' + k + '"]'), nv = cero(v[k]);
      if (el && el.textContent !== nv) {
        el.textContent = nv;
        if (!REDUCE) { el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); }
      }
    }
  }

  /* ---------- AVISO (toast) ---------- */
  var toastTimer;
  function aviso(msg) {
    var t = $('of-toast'); if (!t) return;
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }

  /* ---------- EVENTOS ---------- */
  function copiarCupon() {
    var btn = $('of-copiar');
    var ok = function () {
      aviso('¡Cupón ' + CUPON + ' copiado!');
      if (btn) {
        desdeBoton(btn, 40);
        btn.textContent = '¡Copiado!';
        clearTimeout(btn._t);
        btn._t = setTimeout(function () { btn.textContent = 'Copiar'; }, 1600);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CUPON).then(ok, function () { aviso('Tu código es ' + CUPON); });
    } else { aviso('Tu código es ' + CUPON); }
  }
  function alComprar(e) {
    var b = e.target.closest ? e.target.closest('button[data-g],button[data-combo]') : null;
    if (!b) return;
    var detalle, nombre;
    if (b.hasAttribute('data-combo')) {
      nombre = b.getAttribute('data-combo');
      detalle = { tipo: 'combo', nombre: nombre, precio: +b.getAttribute('data-precio') };
    } else {
      var p = items.filter(function (x) { return x.g === b.getAttribute('data-g'); })[0]; if (!p) return;
      nombre = 'Pokédex ' + p.n;
      detalle = { tipo: 'pokedex', gen: p.g, nombre: nombre, precio: p.nuevo };
    }
    document.dispatchEvent(new CustomEvent('pt:agregar', { detail: detalle }));
    aviso('✓ ' + nombre + ' agregado');
    desdeBoton(b, 28);
    if (!b.getAttribute('data-txt')) b.setAttribute('data-txt', b.textContent);
    b.classList.add('ok'); b.textContent = '¡Agregado!';
    clearTimeout(b._t);
    b._t = setTimeout(function () { b.textContent = b.getAttribute('data-txt'); b.classList.remove('ok'); }, 1500);
  }

  function cambiarVersion(e) {
    var b = e.target.closest ? e.target.closest('button.of-var') : null;
    if (!b) return;
    var caja = b.closest('.of-card, .of-dia');
    var grande = caja && caja.querySelector('.of-pic .of-img');
    if (grande) grande.src = b.getAttribute('data-src');
    var hermanos = b.parentNode.querySelectorAll('.of-var');
    for (var i = 0; i < hermanos.length; i++) hermanos[i].setAttribute('aria-pressed', hermanos[i] === b ? 'true' : 'false');
  }
  // Si una imagen no existe o falla, se muestra el dibujito de respaldo
  function respaldo(e) {
    var im = e.target;
    if (!im || im.tagName !== 'IMG' || !/of-img|of-mini/.test(im.className)) return;
    var tmp = document.createElement('div');
    tmp.innerHTML = dispositivo(im.getAttribute('data-c') || '#E3350D');
    var svg = tmp.firstChild;
    svg.setAttribute('class', 'of-fallback');
    if (im.parentNode.classList.contains('of-pic')) im.parentNode.classList.add('of-pic-fb');
    im.parentNode.replaceChild(svg, im);
  }

  function iniciar() {
    document.documentElement.classList.add('of-js');
    if (!items.length) {
      var g = $('of-grid');
      if (g) g.innerHTML = '<p class="of-empty bx">No se pudo cargar el catálogo. Revisa que js/catalogo.js esté incluido.</p>';
      return;
    }
    var dia = pintarDia();
    pintarLista(dia);
    pintarCombos();
    animarBarras(document);
    tic(); setInterval(tic, 1000);
    revelar(); inclinar(); progreso();

    var chips = document.querySelectorAll('.of-chip');
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', function () {
        for (var j = 0; j < chips.length; j++) chips[j].setAttribute('aria-pressed', 'false');
        this.setAttribute('aria-pressed', 'true');
        estado.filtro = this.getAttribute('data-f');
        pintarLista(dia);
      });
    }
    var sel = $('of-orden');
    if (sel) sel.addEventListener('change', function () { estado.orden = this.value; pintarLista(dia); });
    var cp = $('of-copiar'); if (cp) cp.addEventListener('click', copiarCupon);
    document.addEventListener('click', alComprar);
    document.addEventListener('click', cambiarVersion);
    document.addEventListener('error', respaldo, true);
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();