<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Nuestra organización | PokéTech</title>
<link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Rubik:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/variables.css">
<link rel="stylesheet" href="../css/main.css">
<link rel="stylesheet" href="../css/organizacion.css">
<link rel="stylesheet" href="../css/tema.css">
<script src="../js/tema.js"></script>
</head>
<body>

<?php $base_url = '../'; include __DIR__ . '/../components/header.php'; ?>

<!-- ===== CONTENIDO ===== -->
<section class="pagehead">
<div class="pagehead-media" aria-hidden="true">
<img class="pagehead-slide" src="../assets/img/organizacion/Empresa.png" alt="">
<img class="pagehead-slide" src="../assets/img/organizacion/Tecnologia.png" alt="">
<img class="pagehead-slide" src="../assets/img/organizacion/Investigacion.png" alt="">
<img class="pagehead-slide" src="../assets/img/organizacion/Marketing.png" alt="">
</div>
<div class="w pagehead-inner">
<div class="pagehead-copy">
<h1>Nuestra organización</h1>
<p>PokéTech Research &amp; Development Corp. es la empresa que investiga especies Pokémon y desarrolla la tecnología Pokédex que llega a entrenadores e instituciones de todas las regiones. Detrás de cada dispositivo trabaja un equipo multidisciplinario de científicos, ingenieros y especialistas comprometidos con la calidad.</p>
<p>En esta sección conocerás cómo estamos estructurados, qué función cumple cada departamento y quiénes lideran nuestro trabajo.</p>
</div>
</div>
</section>

<div class="og-tabs"><div class="w">
<div class="og-seg" role="tablist" aria-label="Secciones de organización"><i class="og-thumb"></i>
<button role="tab" data-t="estructura" data-ic="net" aria-selected="true">Nuestra estructura</button>
<button role="tab" data-t="areas" data-ic="bld" aria-selected="false">Nuestras áreas</button>
<button role="tab" data-t="equipo" data-ic="usr" aria-selected="false">Nuestro equipo</button>
</div></div></div>

<main>
<section class="og-sec" id="estructura">
  <div class="w og-wide">
    <div class="og-head">
      <span class="og-kicker">POKÉTECH</span>
      <h2 class="sh">Nuestra estructura</h2>
      <span class="og-hint"><i></i>Pasa el cursor sobre un puesto o tócalo para ver más</span>
    </div>
    <button class="bx og-ceo og-n" id="og-ceo" data-i="0" aria-label="Dirección General"></button>
    <div class="og-stem"></div>
    <div id="og-chart"><div class="og-cols" id="og-cols"></div></div>
  </div>
</section>

<section class="og-sec alt" id="areas" hidden>
  <div class="w">
    <div class="og-head">
      <span class="og-kicker">DEPARTAMENTOS</span>
      <h2 class="sh">Nuestras áreas</h2>
      <p class="lead">Seis áreas, una misma misión: crear, fabricar y entregar la mejor Pokédex con respaldo científico y atención cercana.</p>
    </div>
    <div class="og-cols3" id="og-areas"></div>
  </div>
</section>

<section class="og-sec" id="equipo" hidden>
  <div class="w">
    <div class="og-head">
      <span class="og-kicker">LIDERAZGO Y TALENTO</span>
      <h2 class="sh">Nuestro equipo</h2>
    </div>
    <div class="og-filter" id="og-filter" role="group" aria-label="Filtrar por área"></div>
    <div class="og-team" id="og-team"></div>
  </div>
</section>
</main>

<dialog class="og-modal pokedex-dialog" id="og-modal" aria-label="Pokédex - Detalle del puesto">
  <div class="pokedex-modal-wrapper">
    <img class="pokedex-frame-img" src="../assets/img/organizacion/Pokedex.png" alt="Pokédex" aria-hidden="true">
    <button class="og-x pokedex-close-btn" aria-label="Cerrar Pokédex">✕</button>
    
    <!-- Pantalla Izquierda: Imagen del personal en recuadro transparente -->
    <div class="pokedex-screen-left">
      <div class="pokedex-photo-wrap">
        <img class="pokedex-photo" src="" alt="" onerror="this.style.display='none'">
        <div class="pokedex-avatar-fallback"></div>
      </div>
      <div class="pokedex-personal-info">
        <h3 class="pokedex-name"></h3>
        <p class="pokedex-role"></p>
        <span class="pokedex-dept-badge"></span>
      </div>
      <div class="pokedex-scanline" aria-hidden="true"></div>
    </div>
    
    <!-- Pantalla Derecha: Información en verde con animación robótica -->
    <div class="pokedex-screen-right">
      <div class="pokedex-terminal-header">
        <span class="pokedex-status-dot"></span>
        <span class="pokedex-terminal-title">REGISTRO POKÉDEX</span>
      </div>
      <div class="pokedex-typewriter-content" id="pokedex-typewriter">
        <!-- Contenido generado por js con efecto máquina de escribir -->
      </div>
      <div class="pokedex-terminal-scanline" aria-hidden="true"></div>
    </div>
  </div>
</dialog>

<?php include __DIR__ . '/../components/footer.php'; ?>

<script src="../js/organizacion.js"></script>
</body>
</html>
