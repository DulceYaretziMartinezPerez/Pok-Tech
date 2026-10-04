/* Nuestra organización — datos y comportamiento (sin dependencias externas) */
(() => {
  const IMG = '../assets/img/organizacion/';
  const P = (n, r, img, fn) => ({ n, r, img, fn });
  const D = [
    { id: 'tec', name: 'Tecnología', icon: '💻', c: 'var(--blu)',
      d: '¿Cómo funciona la Pokédex por dentro?',
      desc: 'Procesa la información de cada Pokémon, actualiza el sistema con nuevas especies y mantiene el reconocimiento en tiempo real y la interfaz.',
      dir: P('Jared de Jesús Olazarán López', 'Director de Tecnología (CTO)', 'Jared', ['Define la visión tecnológica de la Pokédex', 'Coordina software, infraestructura y datos', 'Impulsa el reconocimiento en tiempo real']),
      m: [
        [P('Jesús Alejandro Aguilar Hernández', 'Gerente de Desarrollo de Software', 'Jesus', ['Dirige al equipo de desarrollo', 'Supervisa la interfaz y el conteo de capturas']), ['Programadores', 'Diseñadores UX/UI', 'Ingenieros de software']],
        [P('Alejandro Sánchez Varela', 'Gerente de Infraestructura y TI', 'Alejandro', ['Mantiene servidores y redes operando', 'Protege los sistemas y la información']), ['Administradores de sistemas', 'Soporte técnico', 'Ciberseguridad']],
        [P('Arturo Rosales Velázquez', 'Gerente de Datos', 'Arturo', ['Organiza la base de datos de especies', 'Garantiza datos confiables y actualizados']), ['Ingenieros de datos', 'Administradores de bases de datos']] ] },
    { id: 'ope', name: 'Operaciones', icon: '🏭', c: 'var(--red)',
      desc: 'Fabrica y ensambla cada Pokédex y verifica su calidad con pruebas antes de llegar a tus manos.',
      dir: P('Angel Gabriel Coronado Sánchez', 'Director de Operaciones (COO)', 'Angel', ['Dirige la fabricación y el ensamblaje', 'Asegura entregas y estándares de calidad']),
      m: [
        [P('Diego Ramírez Ibarra', 'Gerente de Producción', 'Diego_Ibarra', ['Planea la línea de ensamblaje', 'Coordina a técnicos y operarios']), ['Técnicos de hardware', 'Operarios']],
        [P('Ana Sofía Cano Sandoval', 'Gerente de Calidad', 'Ana', ['Define las pruebas de calidad', 'Valida que cada equipo funcione bien']), ['Supervisores de calidad', 'Técnicos de pruebas']] ] },
    { id: 'fin', name: 'Finanzas', icon: '💰', c: 'var(--blu)',
      desc: 'Cuida el capital de la empresa, calcula márgenes y evalúa la factibilidad de cada producto nuevo.',
      dir: P('Diego Eduardo Zapata Aguilar', 'Director Financiero (CFO)', 'Diego_Zapata', ['Administra el presupuesto y la inversión', 'Evalúa la viabilidad de nuevos productos']),
      m: [[P('César Euresti', 'Gerente Financiero', 'Cesar', ['Supervisa la contabilidad diaria', 'Reporta márgenes y resultados']), ['Contadores', 'Analistas financieros', 'Auxiliares administrativos']]] },
    { id: 'mkt', name: 'Marketing', icon: '📣', c: 'var(--red)',
      desc: 'Da a conocer la Pokédex al mundo, atiende dudas del público y negocia ventas a sucursales y clientes privados.',
      dir: P('Dulce Yaretzi Martínez Pérez', 'Directora de Marketing (CMO)', 'Dulce', ['Diseña la estrategia de marca', 'Une comunicación, ventas y atención']),
      m: [
        [P('Aldo Mizahel Ornelas García', 'Gerente de Marketing', 'Aldo', ['Lidera campañas y contenido', 'Cuida la imagen de PokéTech']), ['Publicidad', 'Diseño', 'Redes sociales']],
        [P('Nahomi Sherlyn Grimaldo Cruz', 'Gerente de Ventas', 'Sherlyn', ['Cierra ventas mayoristas y privadas', 'Supervisa la atención al cliente']), ['Ejecutivos de ventas', 'Atención al cliente']] ] },
    { id: 'inv', name: 'Investigación Pokémon', icon: '🔬', c: 'var(--blu)',
      desc: 'Descubre especies, analiza su tipo, habilidades y distribución en las rutas, y apoya el cuidado de la flora y fauna.',
      dir: P('Melissa Jazmin Torres Martínez', 'Directora de Investigación Pokémon', 'Melissa', ['Dirige los estudios de campo y laboratorio', 'Valida científicamente nuevas especies']),
      m: [
        [P('Hiram Alejandro Alvarado López', 'Gerente de Investigación', 'Hiram', ['Coordina investigaciones científicas', 'Revisa los hallazgos del laboratorio']), ['Maestros Pokémon', 'Biólogos y especialistas']],
        [P('Luis Arturo Villar Sudek', 'Gerente de Exploración', 'Luis', ['Organiza expediciones a las rutas', 'Mapea hábitats y poblaciones']), ['Exploradores', 'Investigadores de campo', 'Cartógrafos']],
        [P('Sujin Kim', 'Coordinadora de Registro Pokémon', 'Chinguamiga', ['Cataloga cada especie descubierta', 'Mantiene el registro oficial']), ['Analistas de información', 'Catalogadores de especies']] ] },
    { id: 'rh', name: 'Recursos Humanos', icon: '🤝', c: 'var(--red)',
      desc: 'Cuida al equipo: contrata talento, capacita, paga la nómina y vela por el bienestar laboral.',
      dir: P('Liliana Sarahi Gutiérrez Balderas', 'Directora de Recursos Humanos', 'Liliana', ['Impulsa la cultura organizacional', 'Atrae y retiene al mejor talento']),
      m: [[P('Emanuel Hernández Aguirre', 'Gerente de Recursos Humanos', 'Emanuel', ['Gestiona contratación y nómina', 'Organiza capacitación y bienestar']), ['Reclutamiento', 'Capacitación', 'Nómina', 'Bienestar laboral']]] }
  ];
  const CEO = P('Georgina Reta Limas', 'Directora General (CEO)', 'Georgina', ['Guía la visión y la estrategia de PokéTech', 'Alinea a las seis direcciones con una meta común', 'Representa a la empresa ante socios y regiones']);
  D[0].d = D[0].desc;

  const $ = s => document.querySelector(s);
  const ini = n => n.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('');
  const av = p => `<div class="og-av" aria-hidden="true">${ini(p.n)}<img src="${IMG}${p.img}.png" alt="" loading="lazy" onerror="this.remove()"></div>`;

  function burst(e) {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
    ['#c32e0d', '#0075BE', '#fff', '#000'].forEach(c => { for (let i = 0; i < 3; i++) {
      const s = document.createElement('span'), a = Math.random() * 6.28, d = 40 + Math.random() * 60;
      s.className = 'og-cf'; s.style.cssText = `left:${x}px;top:${y}px;background:${c};--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d}px`;
      document.body.appendChild(s); setTimeout(() => s.remove(), 750); } });
  }

  /* ---- datos planos: persona + departamento + equipo a cargo ---- */
  const CEOD = { id: 'ceo', name: 'Dirección General', icon: '⭐', c: 'var(--red)', desc: 'Guía la visión de PokéTech y alinea a las seis direcciones.' };
  const all = [{ p: CEO, d: CEOD, t: D.map(x => x.name), desc: CEO.fn[0] }];
  D.forEach(x => { all.push({ p: x.dir, d: x, t: x.m.map(([m]) => m.r), desc: x.desc });
    x.m.forEach(([p, t]) => all.push({ p, d: x, t, desc: p.fn[0] })); });

  /* ---- modal ---- */
  const dlg = $('#og-modal');
  function openPerson(o, e) {
    burst(e); hideTip();
    dlg.style.setProperty('--c', o.d.c);
    dlg.querySelector('.og-mh').innerHTML = `${av(o.p)}<div><h3>${o.p.n}</h3><small>${o.p.r}</small></div>`;
    dlg.querySelector('.og-mb').innerHTML = `<h4>Qué hace</h4><ul>${o.p.fn.map(f => `<li>${f}</li>`).join('')}</ul><h4>${o.t === undefined ? '' : 'A su cargo'}</h4><div class="og-chips">${o.t.map(s => `<span>${s}</span>`).join('')}</div>`;
    dlg.showModal();
  }
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.og-x')) dlg.close(); });

  /* ---- tooltip ---- */
  const tip = document.createElement('div'); tip.className = 'og-tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip);
  function showTip(el) {
    const o = all[el.dataset.i];
    tip.style.setProperty('--c', o.d.c);
    tip.innerHTML = `<b>${o.d.icon} ${o.p.n}</b><em>${o.p.r}</em><p>${o.desc}</p><i>Clic para ver más</i>`;
    const r = el.getBoundingClientRect(), t = tip.getBoundingClientRect();
    let top = r.top - t.height - 12; if (top < 8) top = r.bottom + 12;
    const left = Math.max(8, Math.min(innerWidth - t.width - 8, r.left + r.width / 2 - t.width / 2));
    tip.style.top = top + 'px'; tip.style.left = left + 'px'; tip.classList.add('on');
  }
  function hideTip() { tip.classList.remove('on'); }

  /* ---- 2.1 organigrama completo ---- */
  const chart = $('#estructura');
  $('#og-ceo').innerHTML = `${av(CEO)}<div><b>${CEO.n}</b><small>${CEO.r}</small></div>`;
  $('#og-cols').innerHTML = D.map(x => {
    const i = all.findIndex(o => o.p === x.dir);
    return `<div class="og-col" data-id="${x.id}" style="--c:${x.c}"><button class="bx og-d og-n" data-i="${i}">${av(x.dir)}<b>${x.dir.r.replace(/ \(.*/, '')}</b><span>${x.dir.n}</span></button>
      <div class="og-ms">${x.m.map(([p]) => `<button class="bx og-mn og-n" data-i="${all.findIndex(o => o.p === p)}">${av(p)}<span><b>${p.n}</b><small>${p.r}</small></span></button>`).join('')}</div></div>`;
  }).join('');
  chart.addEventListener('click', e => { const b = e.target.closest('.og-n'); if (b) openPerson(all[b.dataset.i], e); });
  chart.addEventListener('mouseover', e => { const b = e.target.closest('.og-n'); if (b) showTip(b); });
  chart.addEventListener('mouseout', e => { if (e.target.closest('.og-n')) hideTip(); });
  chart.addEventListener('focusin', e => { const b = e.target.closest('.og-n'); if (b) showTip(b); });
  chart.addEventListener('focusout', hideTip);
  addEventListener('scroll', hideTip, { passive: true });

  /* ---- pestañas ---- */
  const secs = ['estructura', 'areas', 'equipo'], tabs = [...document.querySelectorAll('.og-tabs [data-t]')];
  function show(id, scroll) {
    secs.forEach(s => $('#' + s).hidden = s !== id);
    tabs.forEach(b => b.setAttribute('aria-selected', b.dataset.t === id));
    history.replaceState(null, '', '#' + id);
    if (scroll) $('.og-tabs').scrollIntoView({ behavior: 'smooth' });
  }
  tabs.forEach(b => b.onclick = e => { burst(e); show(b.dataset.t, true); });
  function focusDept(id) {
    show('estructura');
    const c = document.querySelector(`.og-col[data-id="${id}"]`);
    c.scrollIntoView({ behavior: 'smooth', block: 'center' });
    c.classList.add('og-hl'); setTimeout(() => c.classList.remove('og-hl'), 1700);
  }

  /* ---- 2.2 áreas con imágenes ---- */
  const BANDS = [['Tecnologia', 'Tecnología y Operaciones', 'tec', 'ope'], ['Marketing', 'Finanzas y Marketing', 'fin', 'mkt'], ['Investigacion', 'Investigación y Recursos Humanos', 'inv', 'rh']];
  $('#og-areas').innerHTML = BANDS.map(([img, cap, ...ids], k) => `<div class="og-band ${k % 2 ? 'rev' : ''}">
    <figure class="bx"><img src="${IMG}${img}.png" alt="${cap}" loading="lazy" onerror="this.remove()"><figcaption>${cap}</figcaption></figure>
    <div class="og-bc">${ids.map(id => { const x = D.find(d => d.id === id);
      return `<article class="bx og-a" style="--c:${x.c}"><div class="ic" aria-hidden="true">${x.icon}</div><h3>${x.name}</h3><p>${x.desc}</p><button class="btn" data-id="${id}">Ver en el organigrama</button></article>`; }).join('')}</div></div>`).join('');
  $('#og-areas').onclick = e => { const b = e.target.closest('[data-id]'); if (b) { burst(e); focusDept(b.dataset.id); } };

  /* ---- 2.3 equipo ---- */
  const fl = $('#og-filter'), tm = $('#og-team');
  fl.innerHTML = [['all', 'Todos'], ...D.map(x => [x.id, x.name])].map(([i, n], k) => `<button data-f="${i}" aria-pressed="${k === 0}">${n}</button>`).join('');
  function draw(f) {
    tm.innerHTML = all.filter(o => f === 'all' || o.d.id === f).map(o => `<button class="bx og-p" data-i="${all.indexOf(o)}" style="--c:${o.d.c}">${av(o.p)}<h3>${o.p.n}</h3><div class="rl">${o.p.r}</div><span class="tag">${o.d.name}</span></button>`).join('');
  }
  fl.onclick = e => { const b = e.target.closest('[data-f]'); if (!b) return;
    fl.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); burst(e); draw(b.dataset.f); };
  tm.onclick = e => { const b = e.target.closest('.og-p'); if (b) openPerson(all[b.dataset.i], e); };
  draw('all');
  const h = location.hash.slice(1); show(secs.includes(h) ? h : 'estructura');
})();