<!doctype html>
<html lang="es" data-bs-theme="dark">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Acceso Administrador – Liquid Colors</title>
    <meta name="robots" content="noindex,nofollow" />

    <!-- Fuentes -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"/>

    <!-- Bootstrap & Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet"/>

    <!-- Tus estilos -->
    <link rel="stylesheet" href="{{ asset('admin/styles.css') }}">

    <style>
      .login-bg {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background:
          radial-gradient(60% 60% at 80% 10%, rgba(0,181,255,.18), transparent 60%),
          radial-gradient(50% 50% at 10% 80%, rgba(255,43,179,.16), transparent 60%),
          linear-gradient(180deg, var(--bg-2), var(--bg));
      }
      .login-card {
        width: 100%;
        max-width: 520px;
        box-shadow: var(--shadow);
        border-radius: 20px;
      }
      .form-floating > label { color: #cbd5e1; }
      .form-control::placeholder { color: #9ca3af; }
      .input-group-text {
        background: rgba(255,255,255,.06);
        border-color: rgba(255,255,255,.2);
        color: #e5e7eb;
      }
      .brand-mini {
        display: inline-flex; align-items: center; gap: .6rem;
      }
      .brand-mini .brand-name { font-weight: 600; letter-spacing: .2px; }
      .form-hint { font-size: .9rem; color: var(--muted-300); }
      .btn-grad { border-radius: 999px; }
    </style>
</head>

<body>
    <main class="login-bg px-3 px-sm-4">
    <div class="card-dark login-card p-3 p-sm-4">

        <div class="text-center mb-3">
            <span class="brand-mini">
                <img src="{{ asset('admin/logo.svg') }}" class="logo-brand" alt="Liquid Colors" />
                <span class="brand-name">Liquid Colors</span>
            </span>
        </div>

        <div class="text-center mb-2">
            <h1 class="h4 fw-semibold m-0">Acceso Administrador</h1>
            <p class="text-muted-300 m-0">Ingresa tus credenciales para continuar</p>
        </div>

        <!-- Error desde Laravel -->
        @if ($errors->any())
            <div id="loginAlert" class="alert alert-danger py-2 px-3">
                Usuario o contraseña incorrectos.
            </div>
        @endif

        <!-- FORMULARIO REAL -->
        <form method="POST" action="{{ route('admin.login.post') }}" class="mt-3">
            @csrf

            <div class="mb-3">
                <div class="form-floating">
                    <input type="email"
                           class="form-control"
                           name="email"
                           id="email"
                           placeholder="admin@tudominio.com"
                           value="{{ old('email') }}"
                           required />
                    <label><i class="bi bi-envelope me-2"></i>Correo</label>
                </div>
            </div>

            <div class="mb-2">
                <div class="input-group">
                    <div class="form-floating flex-grow-1">
                        <input type="password"
                               class="form-control border-end-0"
                               name="password"
                               id="password"
                               placeholder="••••••••"
                               required />
                        <label><i class="bi bi-shield-lock me-2"></i>Contraseña</label>
                    </div>

                    <!-- Botón para mostrar/ocultar -->
                    <span class="input-group-text border-start-0"
                          id="togglePwd"
                          style="cursor:pointer">
                      <i class="bi bi-eye-slash"></i>
                    </span>
                </div>
            </div>

            <button type="submit" class="btn btn-grad w-100 py-2">
                <i class="bi bi-box-arrow-in-right me-1"></i> Iniciar sesión
            </button>

            <p class="form-hint mt-3 mb-0">
                Acceso restringido. Si necesitas ayuda, contacta al administrador del sistema.
            </p>
        </form>

    </div>
</main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('admin/admin-login.js') }}"></script>
</body>
</html>
