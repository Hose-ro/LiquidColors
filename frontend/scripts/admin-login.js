// LEGACY: esta pantalla demo ya no autentica.
// El login oficial vive en Laravel en /admin/login.

// Mostrar / ocultar contraseña
const toggle = document.getElementById('togglePwd');
const pwd = document.getElementById('password');
if (toggle && pwd) {
  toggle.addEventListener('click', () => {
    const isPwd = pwd.getAttribute('type') === 'password';
    pwd.setAttribute('type', isPwd ? 'text' : 'password');
    toggle.innerHTML = `<i class="bi ${isPwd ? 'bi-eye' : 'bi-eye-slash'}"></i>`;
  });
}

const form = document.getElementById('adminLoginForm');
const alertBox = document.getElementById('loginAlert');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    alertBox?.classList.add('d-none');
    window.location.href = '/admin/login';
  }, false);
}
