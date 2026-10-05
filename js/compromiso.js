document.addEventListener('DOMContentLoaded', function () {
  var carousel = document.querySelector('.commit-carousel');
  if (carousel) {
    var track = carousel.querySelector('.commit-track');
    var cards = Array.from(track.querySelectorAll('.cf'));
    var previous = carousel.querySelector('.commit-prev');
    var next = carousel.querySelector('.commit-next');
    var current = 0;

    function updateNavigation() {
      if (previous) {
        previous.disabled = current <= 0;
        previous.style.opacity = current <= 0 ? '0.35' : '1';
        previous.style.cursor = current <= 0 ? 'not-allowed' : 'pointer';
      }
      if (next) {
        next.disabled = current >= cards.length - 1;
        next.style.opacity = current >= cards.length - 1 ? '0.35' : '1';
        next.style.cursor = current >= cards.length - 1 ? 'not-allowed' : 'pointer';
      }
    }

    function showCard(index) {
      current = Math.max(0, Math.min(index, cards.length - 1));
      cards.forEach(function (card) {
        card.style.transform = 'translateX(-' + (current * 100) + '%)';
      });
      updateNavigation();
    }

    if (previous) {
      previous.addEventListener('click', function (e) {
        e.preventDefault();
        if (current > 0) {
          showCard(current - 1);
        }
      });
    }

    if (next) {
      next.addEventListener('click', function (e) {
        e.preventDefault();
        if (current < cards.length - 1) {
          showCard(current + 1);
        }
      });
    }

    track.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showCard(current - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showCard(current + 1);
      }
    });

    var startX = 0;
    var isSwiping = false;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isSwiping = true;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (!isSwiping) return;
      isSwiping = false;
      var diffX = e.changedTouches[0].clientX - startX;
      if (diffX > 45 && current > 0) {
        showCard(current - 1);
      } else if (diffX < -45 && current < cards.length - 1) {
        showCard(current + 1);
      }
    }, { passive: true });

    showCard(0);
  }

  var improvementCarousel = document.querySelector('.improvement-carousel');
  if (!improvementCarousel) return;

  var items = [
    { title: 'Auditorías periódicas', description: 'Revisamos nuestros procesos y registros para detectar errores y oportunidades de mejora.', image: 'Auditorias.jpg' },
    { title: 'Actualizaciones científicas', description: 'Incorporamos nuevos descubrimientos a la Pokédex después de verificar su validez.', image: 'Actualizaciones.jpg' },
    { title: 'Corrección de errores', description: 'Establecemos mecanismos para recibir reportes, investigar incidencias y publicar correcciones.', image: 'Correciones.jpg' },
    { title: 'Innovación responsable', description: 'Reinvertimos parte de nuestros ingresos en investigación, desarrollo y mejoras tecnológicas.', image: 'innovacion.jpg' },
    { title: 'Protección ambiental', description: 'Revisamos el impacto de nuestras operaciones y promovemos prácticas sostenibles, tomando como referencia la norma ISO 14001.', image: 'Sostenibilidad.jpg' },
    { title: 'Rendición de cuentas', description: 'Comunicamos los avances, las limitaciones y las acciones correctivas a nuestros colaboradores y usuarios.', image: 'Rendicion.jpg' }
  ];
  var image = improvementCarousel.querySelector('.improvement-image');
  var backdropImage = document.querySelector('.improvement-backdrop-image');
  var cards = [
    improvementCarousel.querySelector('.improvement-card-top'),
    improvementCarousel.querySelector('.improvement-card-upper-right'),
    improvementCarousel.querySelector('.improvement-card-lower-right'),
    improvementCarousel.querySelector('.improvement-card-bottom'),
    improvementCarousel.querySelector('.improvement-card-lower-left'),
    improvementCarousel.querySelector('.improvement-card-upper-left')
  ];
  var title = document.querySelector('.improvement-title');
  var description = document.querySelector('.improvement-description');
  var count = document.querySelector('.improvement-count');
  var selected = 0;
  var transitionTimer;

  function renderImprovement() {
    cards.forEach(function (card, slot) {
      var itemIndex = (selected + slot - 2 + items.length) % items.length;
      card.textContent = items[itemIndex].title;
      card.dataset.index = itemIndex;
      card.setAttribute('aria-label', 'Seleccionar ' + items[itemIndex].title);
      if (itemIndex === selected) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
    });
    image.src = '../assets/img/compromiso/' + items[selected].image;
    image.alt = items[selected].title;
    backdropImage.src = '../assets/img/compromiso/' + items[selected].image;
    title.textContent = items[selected].title;
    description.textContent = items[selected].description;
    count.textContent = String(selected + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
  }

  function selectImprovement(index) {
    selected = (index + items.length) % items.length;
    window.clearTimeout(transitionTimer);
    image.classList.add('is-changing');
    backdropImage.classList.add('is-changing');
    title.classList.add('is-changing');
    description.classList.add('is-changing');
    renderImprovement();
    transitionTimer = window.setTimeout(function () {
      image.classList.remove('is-changing');
      backdropImage.classList.remove('is-changing');
      title.classList.remove('is-changing');
      description.classList.remove('is-changing');
    }, 50);
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () { selectImprovement(Number(card.dataset.index)) });
  });
  improvementCarousel.querySelector('.improvement-prev').addEventListener('click', function () { selectImprovement(selected - 1) });
  improvementCarousel.querySelector('.improvement-next').addEventListener('click', function () { selectImprovement(selected + 1) });
  improvementCarousel.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectImprovement(selected - 1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); selectImprovement(selected + 1) }
  });
  renderImprovement();
});
