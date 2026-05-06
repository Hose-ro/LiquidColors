// ===============================
//   Mostrar / ocultar contraseña
// ===============================
const toggle = document.getElementById('togglePwd');
const pwd = document.getElementById('password');

if (toggle && pwd) {
  toggle.addEventListener('click', () => {
    const isPwd = pwd.type === 'password';
    pwd.type = isPwd ? 'text' : 'password';

    toggle.innerHTML = `<i class="bi ${isPwd ? 'bi-eye' : 'bi-eye-slash'}"></i>`;
  });
}

// =====================================
//   IMPORTANTE: ENVÍO REAL A LARAVEL
// =====================================
//
// NO usamos preventDefault()
// NO validamos credenciales falsas
// NO redirigimos por JS
//
// Laravel maneja todo el proceso:
//  - Validación
//  - Sesión
//  - Redirecciones
//  - Errores
//
// Por lo tanto, NO se requiere JS adicional aquí.
// El formulario se envía normalmente a:
//   POST /admin/login
//
// Si Laravel detecta error -> lo muestra en el Blade
// Si es correcto -> redirige al Dashboard.
//

// Optional: ocultar el alert si se empieza a escribir
const alertBox = document.getElementById('loginAlert');
const emailInput = document.getElementById('email');
const passInput  = document.getElementById('password');

if (alertBox) {
  [emailInput, passInput].forEach(input => {
    input.addEventListener('input', () => {
      alertBox.classList.add('d-none');
    });
  });
}