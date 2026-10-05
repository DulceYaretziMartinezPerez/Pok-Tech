<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Tienda Pokédex | PokéTech</title>
<link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Rubik:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/variables.css">
<link rel="stylesheet" href="../css/main.css">
<link rel="stylesheet" href="../css/tema.css">
<script src="../js/tema.js"></script>
</head>
<body>

<?php $base_url = '../'; include __DIR__ . '/../components/header.php'; ?>

<!-- ===== CONTENIDO ===== -->
<div class="pagehead"><div class="w">
<h1>Tienda Pokédex</h1>
<p>Cada modelo está restaurado y certificado por PokéTech. Elige la generación de tu región.</p>
</div></div>

<main>
<section><div class="w">
<div class="row" id="cat"></div>
</div></section>
</main>

<div class="bd2"></div>
<?php include __DIR__ . '/../components/footer.php'; ?>

<script src="../js/utilidades.js"></script>
<script src="../js/catalogo.js"></script>
<script src="../js/app.js"></script>
</body>
</html>