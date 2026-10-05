/* Nuestra organización — datos y comportamiento (sin dependencias externas) */
(() => {
  const IMG = '../assets/img/organizacion/';
  const P = (n, r, img, fn, deb) => ({ n, r, img, fn, deb });
  const D = [
    { id: 'tec', name: 'Tecnología', c: 'var(--blu)',
      d: '¿Cómo funciona la Pokédex por dentro?',
      desc: 'Procesa la información de cada Pokémon, actualiza el sistema con nuevas especies y mantiene el reconocimiento en tiempo real y la interfaz.',
      dir: P('Jared de Jesús Olazarán López', 'Director de Tecnología (CTO)', 'Jared', ['Define la visión tecnológica de la Pokédex', 'Coordina software, infraestructura y datos', 'Impulsa el reconocimiento en tiempo real'], ['Los hombres', 'El amor']),
      m: [
        [P('Jesús Alejandro Aguilar Hernández', 'Gerente de Desarrollo de Software', 'Jesus', ['Dirige al equipo de desarrollo', 'Supervisa la interfaz y el conteo de capturas'], ['Bailar cumbias a solas', 'Los gatos naranjas sin neuronas']), ['Programadores', 'Diseñadores UX/UI', 'Ingenieros de software']],
        [P('Alejandro Sánchez Varela', 'Gerente de Infraestructura y TI', 'Alejandro', ['Mantiene servidores y redes operando', 'Protege los sistemas y la información'], ['Llorar con comerciales de perritos', 'No saberse la tabla del 7']), ['Administradores de sistemas', 'Soporte técnico', 'Ciberseguridad']],
        [P('Arturo Rosales Velázquez', 'Gerente de Datos', 'Arturo', ['Organiza la base de datos de especies', 'Garantiza datos confiables y actualizados'], ['Comerse los mocos en secreto', 'Creer en los horóscopos']), ['Ingenieros de datos', 'Administradores de bases de datos']] ] },
    { id: 'ope', name: 'Operaciones', c: 'var(--red)',
      desc: 'Fabrica y ensambla cada Pokédex y verifica su calidad con pruebas antes de llegar a tus manos.',
      dir: P('Angel Gabriel Coronado Sánchez', 'Director de Operaciones (COO)', 'Angel', ['Dirige la fabricación y el ensamblaje', 'Asegura entregas y estándares de calidad'], ['Las milanesas empanizadas frías', 'Bailar la Chona poseído']),
      m: [
        [P('Diego Ramírez Ibarra', 'Gerente de Producción', 'Diego_Ibarra', ['Planea la línea de ensamblaje', 'Coordina a técnicos y operarios'], ['Dormirse sentado en el camión', 'El reggaetón viejito']), ['Técnicos de hardware', 'Operarios']],
        [P('Ana Sofía Cano Sandoval', 'Gerente de Calidad', 'Ana', ['Define las pruebas de calidad', 'Valida que cada equipo funcione bien'], ['Stalkear a su ex de la primaria', 'Atragantarse con su propia saliva']), ['Supervisores de calidad', 'Técnicos de pruebas']] ] },
    { id: 'fin', name: 'Finanzas', c: 'var(--blu)',
      desc: 'Cuida el capital de la empresa, calcula márgenes y evalúa la factibilidad de cada producto nuevo.',
      dir: P('Diego Eduardo Zapata Aguilar', 'Director Financiero (CFO)', 'Diego_Zapata', ['Administra el presupuesto y la inversión', 'Evalúa la viabilidad de nuevos productos'], ['Gastar la quincena en monas chinas', 'Regatear en el OXXO']),
      m: [[P('César Euresti', 'Gerente Financiero', 'Cesar', ['Supervisa la contabilidad diaria', 'Reporta márgenes y resultados'], ['Cantarle a las plantas a solas', 'El olor a tierra mojada']), ['Contadores', 'Analistas financieros', 'Auxiliares administrativos']]] },
    { id: 'mkt', name: 'Marketing', c: 'var(--red)',
      desc: 'Da a conocer la Pokédex al mundo, atiende dudas del público y negocia ventas a sucursales y clientes privados.',
      dir: P('Dulce Yaretzi Martínez Pérez', 'Directora de Marketing (CMO)', 'Dulce', ['Diseña la estrategia de marca', 'Une comunicación, ventas y atención'], ['Los rockeros', 'Doctor Mario malo']),
      m: [
        [P('Aldo Mizahel Ornelas García', 'Gerente de Marketing', 'Aldo', ['Lidera campañas y contenido', 'Cuida la imagen de PokéTech'], ['Las fotos con filtro de perro de 2016', 'Los payasos de fiesta infantil']), ['Publicidad', 'Diseño', 'Redes sociales']],
        [P('Nahomi Sherlyn Grimaldo Cruz', 'Gerente de Ventas', 'Sherlyn', ['Cierra ventas mayoristas y privadas', 'Supervisa la atención al cliente'], ['Comprar en Shein a las 3 AM', 'Las películas de Shrek']), ['Ejecutivos de ventas', 'Atención al cliente']] ] },
    { id: 'inv', name: 'Investigación Pokémon', c: 'var(--blu)',
      desc: 'Descubre especies, analiza su tipo, habilidades y distribución en las rutas, y apoya el cuidado de la flora y fauna.',
      dir: P('Melissa Jazmin Torres Martínez', 'Directora de Investigación Pokémon', 'Melissa', ['Dirige los estudios de campo y laboratorio', 'Valida científicamente nuevas especies'], ['Hablarle a las palomas de la plaza', 'Los villanos con traumas']),
      m: [
        [P('Hiram Alejandro Alvarado López', 'Gerente de Investigación', 'Hiram', ['Coordina investigaciones científicas', 'Revisa los hallazgos del laboratorio'], ['Creer que la tierra es hueca', 'Tomarse fotos con duck face']), ['Maestros Pokémon', 'Biólogos y especialistas']],
        [P('Luis Arturo Villar Sudek', 'Gerente de Exploración', 'Luis', ['Organiza expediciones a las rutas', 'Mapea hábitats y poblaciones'], ['Los tacos de 5 por 15 pesos', 'Perderse en su propia colonia']), ['Exploradores', 'Investigadores de campo', 'Cartógrafos']],
        [P('Sujin Kim', 'Coordinadora de Registro Pokémon', 'Chinguamiga', ['Cataloga cada especie descubierta', 'Mantiene el registro oficial'], ['Cantar banda sinaloense peda', 'Los memes de tías en Facebook']), ['Analistas de información', 'Catalogadores de especies']] ] },
    { id: 'rh', name: 'Recursos Humanos', c: 'var(--red)',
      desc: 'Cuida al equipo: contrata talento, capacita, paga la nómina y vela por el bienestar laboral.',
      dir: P('Liliana Sarahi Gutiérrez Balderas', 'Directora de Recursos Humanos', 'Liliana', ['Impulsa la cultura organizacional', 'Atrae y retiene al mejor talento'], ['Pelearse con desconocidos en Twitter', 'Los señores con bigote']),
      m: [[P('Emanuel Hernández Aguirre', 'Gerente de Recursos Humanos', 'Emanuel', ['Gestiona contratación y nómina', 'Organiza capacitación y bienestar'], ['Tenerle fobia a las botargas', 'Bailar Payaso de Rodeo descoordinado']), ['Reclutamiento', 'Capacitación', 'Nómina', 'Bienestar laboral']]] }
  ];
  const CEO = P('Georgina Reta Limas', 'Directora General (CEO)', 'Georgina', ['Guía la visión y la estrategia de PokéTech', 'Alinea a las seis direcciones con una meta común', 'Representa a la empresa ante socios y regiones'], ['Los chicos emo', 'Los femboys']);
  D[0].d = D[0].desc;

  const $ = s => document.querySelector(s);
  const ICONS = {
    tec: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    ope: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1M12 18h1M7 18h1"/>',
    fin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.600-1.500-3-1.500-1.700 0-3 .8-3 2s1.300 1.700 3 2 3 .8 3 2-1.300 2-3 2c-1.400 0-2.500-.5-3-1.500M12 6v2M12 16v2"/>',
    mkt: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.600 16.800a3 3 0 1 1-5.800-1.600"/>',
    inv: '<path d="M10 2v7.530a2 2 0 0 1-.210.900L4.720 20.550a1 1 0 0 0 .900 1.450h12.760a1 1 0 0 0 .900-1.450l-5.070-10.130a2 2 0 0 1-.210-.900V2"/><path d="M8.500 2h7M7 16h10"/>',
    rh: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.870M16 3.130a4 4 0 0 1 0 7.750"/>',
    ceo: '<path d="m12 2 3.090 6.260L22 9.270l-5 4.870 1.180 6.880L12 17.770l-6.180 3.250L7 14.140 2 9.270l6.910-1.010z"/>',
    net: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>',
    bld: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/>'
  };
  ICONS.usr = ICONS.rh;
  const sv = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
  const ic = k => `<span class="og-ic" aria-hidden="true">${sv(k)}</span>`;
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
  const CEOD = { id: 'ceo', name: 'Dirección General', c: 'var(--red)', desc: 'Guía la visión de PokéTech y alinea a las seis direcciones.' };
  const all = [{ p: CEO, d: CEOD, t: D.map(x => x.name), desc: CEO.fn[0] }];
  D.forEach(x => { all.push({ p: x.dir, d: x, t: x.m.map(([m]) => m.r), desc: x.desc });
    x.m.forEach(([p, t]) => all.push({ p, d: x, t, desc: p.fn[0] })); });

  /* ---- modal Pokédex con máquina de escribir ---- */
  const dlg = $('#og-modal');
  let typeTimer = null;

  function openPerson(o, e) {
    burst(e); hideTip();
    if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
    dlg.style.setProperty('--c', o.d.c);

    // Pantalla Izquierda: Imagen y datos
    const photo = dlg.querySelector('.pokedex-photo');
    const fallback = dlg.querySelector('.pokedex-avatar-fallback');
    const nameEl = dlg.querySelector('.pokedex-name');
    const roleEl = dlg.querySelector('.pokedex-role');
    const badgeEl = dlg.querySelector('.pokedex-dept-badge');

    if (photo) {
      photo.style.display = 'block';
      photo.src = `${IMG}${o.p.img}.png`;
      photo.alt = o.p.n;
      photo.onerror = () => { photo.style.display = 'none'; if (fallback) fallback.style.display = 'grid'; };
    }
    if (fallback) {
      fallback.style.display = 'none';
      fallback.textContent = ini(o.p.n);
      fallback.style.backgroundColor = o.d.c;
    }
    if (nameEl) nameEl.textContent = o.p.n;
    if (roleEl) roleEl.textContent = o.p.r;
    if (badgeEl) {
      badgeEl.textContent = o.d.name;
      badgeEl.style.backgroundColor = o.d.c;
    }

    // Pantalla Derecha: Texto robótico tipo terminal
    const screenRight = dlg.querySelector('#pokedex-typewriter');
    if (screenRight) {
      const duties = o.p.fn.map(f => `  > ${f}`).join('\n');
      const debilidades = Array.isArray(o.p.deb) 
        ? o.p.deb.map(d => `  > ${d}`).join('\n') 
        : (o.p.deb ? `  > ${o.p.deb}` : '');
      const debilidadesSection = debilidades ? `\n[ DEBILIDADES ]\n${debilidades}\n` : '';
      const team = (o.t && o.t.length) ? o.t.map(s => `  • ${s}`).join('\n') : '  • Dirección General';

      const fullText = 
`>> REGISTRO POKÉDEX CORPORATIVO
>> ACCESO AUTORIZADO
--------------------------------
PERSONAL: ${o.p.n.toUpperCase()}
CARGO: ${o.p.r}
ÁREA: ${o.d.name}

[ QUÉ HACE ]
${duties}
${debilidadesSection}
[ A SU CARGO ]
${team}
--------------------------------
>> ESTADO: ACTIVO / VERIFICADO`;

      screenRight.innerHTML = '';
      const textNode = document.createElement('pre');
      textNode.className = 'pokedex-terminal-text';
      const cursor = document.createElement('span');
      cursor.className = 'pokedex-cursor';
      cursor.textContent = '█';

      screenRight.appendChild(textNode);
      screenRight.appendChild(cursor);

      let charIdx = 0;
      const speed = 10; // ms por carácter

      function finishTyping() {
        if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
        textNode.textContent = fullText;
      }

      screenRight.onclick = finishTyping;

      typeTimer = setInterval(() => {
        if (charIdx < fullText.length) {
          textNode.textContent += fullText[charIdx];
          charIdx++;
          screenRight.scrollTop = screenRight.scrollHeight;
        } else {
          clearInterval(typeTimer);
          typeTimer = null;
        }
      }, speed);
    }

    dlg.showModal();
  }

  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('.og-x')) {
      if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
      dlg.close();
    }
  });
  dlg.addEventListener('close', () => {
    if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
  });

  /* ---- tooltip ---- */
  const tip = document.createElement('div'); tip.className = 'og-tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip);
  function showTip(el) {
    const o = all[el.dataset.i];
    tip.style.setProperty('--c', o.d.c);
    const debList = Array.isArray(o.p.deb) ? o.p.deb.join(' · ') : o.p.deb;
    const debTip = debList ? `<span style="display:block;margin:6px 0;font-size:12px;color:#ffd6ce;font-weight:600">Debilidades: ${debList}</span>` : '';
    tip.innerHTML = `<b>${ic(o.d.id)}${o.p.n}</b><em>${o.p.r}</em><p>${o.desc}</p>${debTip}<i>Clic para ver Pokédex</i>`;
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

  /* ---- pestañas (segmented control) ---- */
  const secs = ['estructura', 'areas', 'equipo'], tabs = [...document.querySelectorAll('.og-tabs [data-t]')], thumb = $('.og-thumb');
  tabs.forEach(b => b.innerHTML = sv(b.dataset.ic) + `<span>${b.textContent}</span>`);
  function place() { const b = tabs.find(x => x.getAttribute('aria-selected') === 'true'); thumb.style.left = b.offsetLeft + 'px'; thumb.style.width = b.offsetWidth + 'px'; }
  function show(id, scroll) {
    secs.forEach(s => $('#' + s).hidden = s !== id);
    tabs.forEach(b => b.setAttribute('aria-selected', b.dataset.t === id));
    place(); history.replaceState(null, '', '#' + id);
    if (scroll) $('#' + id).scrollIntoView({ behavior: 'smooth' });
  }
  tabs.forEach(b => b.onclick = e => { burst(e); show(b.dataset.t, true); });
  addEventListener('resize', place);
  function focusDept(id) {
    show('estructura');
    const c = document.querySelector(`.og-col[data-id="${id}"]`);
    c.scrollIntoView({ behavior: 'smooth', block: 'center' });
    c.classList.add('og-hl'); setTimeout(() => c.classList.remove('og-hl'), 1700);
  }

  /* ---- 2.2 áreas: imagen + dos áreas por columna ---- */
  const BANDS = [['Tecnologia', 'Tecnología y Operaciones', 'tec', 'ope'], ['Marketing', 'Finanzas y Marketing', 'fin', 'mkt'], ['Investigacion', 'Investigación y Recursos Humanos', 'inv', 'rh']];
  $('#og-areas').innerHTML = BANDS.map(([img, cap, ...ids]) => `<div class="bx og-k">
    <figure><img src="${IMG}${img}.png" alt="${cap}" loading="lazy" onerror="this.remove()"><figcaption>${cap}</figcaption></figure>
    ${ids.map(id => { const x = D.find(d => d.id === id);
      return `<article class="og-a" style="--c:${x.c}">${ic(id)}<h3>${x.name}</h3><p>${x.desc}</p><button class="btn" data-id="${id}">Ver en el organigrama</button></article>`; }).join('')}</div>`).join('');
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
  document.fonts.ready.then(() => { place(); requestAnimationFrame(() => thumb.classList.add('ready')); });
})();