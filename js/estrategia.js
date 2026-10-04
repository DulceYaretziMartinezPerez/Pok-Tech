/* ============================================================
   js/estrategia.js
   Animaciones e interacciones SOLO para pages/estrategia.html.
   No toca app.js ni utilidades.js para no chocar con el catálogo.
   ============================================================ */
(function () {
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;

  document.addEventListener('DOMContentLoaded', function () {
    setupHeroCarousel();
    setupAvatarWobble();
    setupContentReveal();
    setupEntranceReveal();
    setupStrategyCards();
    setupEvolutionSteps();
    setupHpBars();
    setupFlavorText();
    setupSideMons();
  });

  /* Carrusel de fotos del encabezado: rota sola cada 4.5s y se puede
     saltar tocando los puntos. Se detiene al pasar el mouse o teclado
     por encima, y no gira sola si hay prefers-reduced-motion
     (los puntos siguen funcionando igual). */
  function setupHeroCarousel() {
    var slides = document.querySelectorAll('.pagehead-slide');
    var dotsWrap = document.querySelector('.pagehead-dots');
    if (!slides.length || !dotsWrap) return;
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('button'));
    var i = 0, timer;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      dots.forEach(function (d, k) {
        d.classList.toggle('on', k === i);
        d.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
    }
    function start() {
      if (reduceMotion) return;
      window.clearInterval(timer);
      timer = window.setInterval(function () { show(i + 1); }, 4500);
    }
    function stop() { window.clearInterval(timer); }

    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { show(k); start(); });
    });
    var hero = document.querySelector('.pagehead');
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);

    show(0);
    start();
  }

  /* Retratos de Misión/Visión: un pequeño "wobble" repetible al tocarlos. */
  function setupAvatarWobble() {
    document.querySelectorAll('.mv-ava').forEach(function (img) {
      img.addEventListener('click', function () {
        img.classList.remove('wobble');
        void img.offsetWidth; // fuerza reflow para poder repetir
        img.classList.add('wobble');
      });
    });
  }

  /* Aparición al hacer scroll para Misión/Visión, valores y tarjetas FODA.
     La clase que las oculta (.reveal-pre) solo se agrega aquí mismo, justo
     antes de observarlas: si este script no llega a correr, esos bloques
     jamás reciben la clase y se ven normales desde el primer momento. */
  function setupContentReveal() {
    var targets = document.querySelectorAll('.mv, .vals span, .fd');
    if (!targets.length || reduceMotion || !canObserve) return;
    targets.forEach(function (el, i) {
      el.classList.add('reveal-pre');
      el.style.transitionDelay = (i % 6) * 0.07 + 's';
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    targets.forEach(function (el) { obs.observe(el); });
  }

  /* Entrada de las cartas y pasos al hacer scroll (una sola vez).
     Si hay prefers-reduced-motion o no hay IntersectionObserver,
     se muestran directamente sin animar. */
  function setupEntranceReveal() {
    var targets = document.querySelectorAll('.evo-step, .strat-chip');
    if (reduceMotion || !canObserve) {
      targets.forEach(function (el) { el.classList.add('show'); });
      return;
    }
    targets.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 0.08 + 's';
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    targets.forEach(function (el) { obs.observe(el); });
  }

  /* Cartas de estrategia: boca abajo por defecto.
     - Clic / Enter / Espacio: voltea la carta (se puede repetir sin límite).
     - Mouse encima: tilt 3D en vivo + brillo holográfico que sigue el cursor. */
  function setupStrategyCards() {
    var chips = document.querySelectorAll('.strat-chip');
    chips.forEach(function (chip) {
      function toggleFlip() {
        var flipped = chip.classList.toggle('flipped');
        chip.style.setProperty('--flip', flipped ? '180deg' : '0deg');
        chip.setAttribute('aria-pressed', flipped ? 'true' : 'false');
      }
      chip.addEventListener('click', toggleFlip);
      chip.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          toggleFlip();
        }
      });

      if (!reduceMotion) {
        chip.addEventListener('mousemove', function (ev) {
          var r = chip.getBoundingClientRect();
          var px = (ev.clientX - r.left) / r.width;  // 0..1
          var py = (ev.clientY - r.top) / r.height;  // 0..1
          var maxTilt = 10; // grados
          chip.style.setProperty('--rx', (-(py - 0.5) * maxTilt * 2).toFixed(2) + 'deg');
          chip.style.setProperty('--ry', ((px - 0.5) * maxTilt * 2).toFixed(2) + 'deg');
          chip.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          chip.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
        chip.addEventListener('mouseleave', function () {
          chip.style.setProperty('--rx', '0deg');
          chip.style.setProperty('--ry', '0deg');
        });
      }
    });
  }

  /* Plan de acción: cada paso "evoluciona" (flash + pulso) al tocarlo,
     tantas veces como se quiera. */
  function setupEvolutionSteps() {
    var steps = document.querySelectorAll('.evo-step');
    steps.forEach(function (step) {
      step.setAttribute('tabindex', '0');
      step.setAttribute('role', 'button');
      if (!step.hasAttribute('aria-label')) {
        step.setAttribute('aria-label', 'Repetir animación de evolución de este paso');
      }
      function evolve() {
        step.classList.remove('evolving');
        void step.offsetWidth; // fuerza reflow para poder repetir la animación
        step.classList.add('evolving');
        window.setTimeout(function () { step.classList.remove('evolving'); }, 650);
      }
      step.addEventListener('click', evolve);
      step.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          evolve();
        }
      });
    });
  }

  /* Barras de HP: se llenan la primera vez que entran en pantalla,
     y se pueden "recargar" (vaciar + rellenar con sacudida) tocándolas. */
  function setupHpBars() {
    var bars = document.querySelectorAll('.stat-bar');
    bars.forEach(function (bar) {
      var fill = bar.querySelector('.stat-fill');
      if (!fill) return;
      bar.setAttribute('tabindex', '0');
      bar.setAttribute('role', 'button');
      if (!bar.hasAttribute('aria-label')) {
        bar.setAttribute('aria-label', 'Repetir animación de esta barra');
      }

      function play() {
        var target = fill.style.getPropertyValue('--target') || '0%';
        fill.style.transition = 'none';
        fill.style.width = '0%';
        void fill.offsetWidth; // fuerza reflow
        fill.style.transition = reduceMotion ? 'none' : 'width 1.1s cubic-bezier(.22,1,.36,1)';
        fill.style.width = target.trim();
        if (!reduceMotion) {
          bar.classList.remove('shake');
          void bar.offsetWidth;
          bar.classList.add('shake');
          window.setTimeout(function () { bar.classList.remove('shake'); }, 450);
        }
      }
      bar.addEventListener('click', play);
      bar.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          play();
        }
      });

      // primer llenado al entrar en pantalla
      if (canObserve) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              play();
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.4 });
        obs.observe(bar);
      } else {
        play();
      }
    });
  }

  /* Entrada de Pokédex: el texto final se "escribe" solo al llegar a él. */
  function setupFlavorText() {
    var flavor = document.querySelector('.flavor[data-text]');
    if (!flavor) return;
    var fullText = flavor.getAttribute('data-text');
    if (reduceMotion || !canObserve) {
      flavor.textContent = fullText;
      return;
    }
    flavor.textContent = '';
    var typed = false;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !typed) {
          typed = true;
          var i = 0;
          var timer = window.setInterval(function () {
            flavor.textContent = fullText.slice(0, i + 1);
            i++;
            if (i >= fullText.length) window.clearInterval(timer);
          }, 18);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    obs.observe(flavor);
  }

  /* Pokémon de las orillas: aparecen al hacer scroll, se mueven con parallax
     (cada uno a distinta velocidad), flotan solos y saltan al tocarlos. */
  function setupSideMons() {
    var mons = Array.prototype.slice.call(document.querySelectorAll('.side-mon'));
    if (!mons.length) return;

    mons.forEach(function (m) {
      function hop() {
        m.classList.remove('hop');
        void m.offsetWidth;
        m.classList.add('hop');
        window.setTimeout(function () { m.classList.remove('hop'); }, 750);
      }
      m.addEventListener('click', hop);
    });

    if (reduceMotion) return;

    if (canObserve) {
      mons.forEach(function (m, i) {
        m.classList.add('reveal-pre');
        m.style.transitionDelay = (i % 5) * 0.1 + 's';
      });
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-pre');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      mons.forEach(function (m) { obs.observe(m); });
    }

    var ticking = false;
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      mons.forEach(function (m) {
        var speed = parseFloat(m.getAttribute('data-speed')) || 0;
        m.style.setProperty('--py', (y * speed).toFixed(1) + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();