<!doctype html>
<html lang="es" data-bs-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Panel Reseñas – Liquid Colors (Admin)</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

  <link rel="stylesheet" href="{{ asset('admin/styles.css') }}">
  <link rel="stylesheet" href="{{ asset('admin/resenas.css') }}">
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark nav-glass fixed-top nav-glass-soft">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center gap-2" href="{{ route('admin.resenas.index') }}">
      <img src="{{ asset('admin/logo.svg') }}" class="logo-brand" alt="Liquid Colors" />
      <span class="fw-semibold">Liquid Colors</span>
      <span class="badge bg-warning text-dark ms-2 small">Admin</span>
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div id="mainNav" class="collapse navbar-collapse">
      <ul class="navbar-nav center-nav gap-lg-4">
        <li class="nav-item"><a class="nav-link" href="{{ route('admin.dashboard') }}">Dashboard</a></li>
        <li class="nav-item"><a class="nav-link" href="{{ route('admin.posts.index') }}">Publicaciones</a></li>
        <li class="nav-item"><a class="nav-link active" href="{{ route('admin.resenas.index') }}" aria-current="page">Reseñas</a></li>
      </ul>

      <div class="d-flex align-items-center gap-3 ms-auto">
        <span class="text-muted-300 small d-none d-md-inline">Sesión: {{ session('admin_email') }}</span>
        <a class="icon-link text-danger" href="{{ route('admin.logout') }}"><i class="bi bi-box-arrow-right"></i></a>
      </div>
    </div>
  </div>
</nav>

<!-- HERO -->
<header class="blog-admin-hero">
  <div class="container position-relative">
    <div class="row g-4 align-items-center">
      <div class="col-lg-7">
        <div class="pill mb-3">
          <i class="bi bi-star-half me-2"></i> Panel de reseñas
        </div>
        <h1 class="display-5 fw-bold lh-1 mb-3">
          Reseñas de <span class="grad-text">productos</span>
        </h1>
        <p class="lead text-muted-300 mb-3">
          Aprueba, rechaza o elimina reseñas de clientes. Solo las reseñas aprobadas se muestran públicamente.
        </p>
        <div class="d-flex flex-wrap gap-3">
          <button class="btn btn-outline-light btn-lg" id="btnFiltrarPendientes">
            Pendientes <span class="badge bg-warning text-dark ms-1" id="badgePendientes">0</span>
          </button>
          <button class="btn btn-outline-light btn-lg" id="btnFiltrarTodas">
            Todas <span class="badge bg-light text-dark ms-1" id="badgeTodas">0</span>
          </button>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="blog-admin-stats card-dark rounded-4 p-3 p-md-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-circle-sm">
                <i class="bi bi-star-fill"></i>
              </div>
              <div>
                <div class="small text-muted-300">Resumen general</div>
                <div class="fw-semibold" id="lblResumen">Cargando...</div>
              </div>
            </div>
            <span class="badge bg-primary-subtle text-light small">Stats</span>
          </div>

          <div class="border-top border-secondary-subtle my-3"></div>

          <div class="row g-3 text-center text-md-start">
            <div class="col-4">
              <div class="small text-muted-300">Total</div>
              <div class="h4 fw-bold" id="statTotal">0</div>
            </div>
            <div class="col-4">
              <div class="small text-muted-300">Aprobadas</div>
              <div class="h4 fw-bold text-success" id="statAprobadas">0</div>
            </div>
            <div class="col-4">
              <div class="small text-muted-300">Pendientes</div>
              <div class="h4 fw-bold text-warning" id="statPendientes">0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- CONTENIDO -->
<main class="py-5">
  <div class="container">
    <div class="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
      <div>
        <h4 class="fw-semibold mb-0">Listado de reseñas</h4>
        <small class="text-muted-300">Gestiona todas las reseñas recibidas</small>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <select class="form-select form-select-sm" id="filtroEstado" style="width: auto;">
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
        </select>
        <select class="form-select form-select-sm" id="filtroRating" style="width: auto;">
          <option value="todos">Todos los ratings</option>
          <option value="5">★★★★★ 5 estrellas</option>
          <option value="4">★★★★☆ 4 estrellas</option>
          <option value="3">★★★☆☆ 3 estrellas</option>
          <option value="2">★★☆☆☆ 2 estrellas</option>
          <option value="1">★☆☆☆☆ 1 estrella</option>
        </select>
      </div>
    </div>

    <div id="resenasList" class="card-dark rounded-4 p-3 p-md-4">
      <div class="text-center py-5 text-muted-300">
        <i class="bi bi-hourglass-split fs-2 mb-2 d-block"></i>
        Cargando reseñas...
      </div>
    </div>
  </div>
</main>

<!-- MODAL: Ver comentario completo -->
<div class="modal fade" id="modalComentario" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content card-dark">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-semibold">Reseña completa</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body pt-0" id="modalComentarioBody">
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="{{ asset('admin/resenas.js') }}"></script>
</body>
</html>
