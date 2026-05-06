/* =======================
   Reseñas de productos – Público
   Requiere: Bootstrap 5, products.js (escapeHTML)
======================= */

const API_BASE = '/api/public/productos';

let selectedRating = 0;
let resenasModal = null;

document.addEventListener('DOMContentLoaded', () => {
  resenasModal = new bootstrap.Modal(document.getElementById('modalResenas'));
  initStarPicker();
  initForm();
});

/* =======================
   Abrir modal
======================= */
function abrirModalResenas(productId, titulo) {
  document.getElementById('resenaProductId').value = productId;
  document.getElementById('modalResenasTitulo').textContent = titulo || '';

  resetForm();
  limpiarResultados();

  resenasModal.show();
  cargarResenas(productId);
}

/* =======================
   Carga de reseñas
======================= */
async function cargarResenas(productId) {
  mostrarCargando();

  try {
    const resp = await fetch(`${API_BASE}/${productId}/resenas`);
    if (!resp.ok) throw new Error('Error de red');

    const data = await resp.json();
    renderResenas(data);
  } catch {
    document.getElementById('resenasLista').innerHTML = `
      <p class="text-muted small text-center py-3">
        <i class="bi bi-exclamation-circle me-1"></i>
        No se pudieron cargar las reseñas en este momento.
      </p>
    `;
  }
}

function mostrarCargando() {
  document.getElementById('resenasLista').innerHTML = `
    <p class="text-muted small text-center py-3">
      <i class="bi bi-hourglass-split me-1"></i>Cargando reseñas...
    </p>
  `;
  document.getElementById('resenasSummary').classList.add('d-none');
  document.getElementById('resenasEmpty').classList.add('d-none');
}

function limpiarResultados() {
  document.getElementById('resenasLista').innerHTML = '';
  document.getElementById('resenasSummary').classList.add('d-none');
  document.getElementById('resenasEmpty').classList.add('d-none');
}

/* =======================
   Render reseñas
======================= */
function renderResenas(data) {
  const { resenas, promedio, total, distribucion } = data;

  if (total === 0) {
    document.getElementById('resenasEmpty').classList.remove('d-none');
    document.getElementById('resenasLista').innerHTML = '';
    document.getElementById('resenasSummary').classList.add('d-none');
    return;
  }

  // Resumen
  document.getElementById('resenasPromedio').textContent = promedio.toFixed(1);
  document.getElementById('resenasStarsBig').innerHTML = buildStarsDisplay(promedio);
  document.getElementById('resenasStarsBig').setAttribute('aria-label', `${promedio} de 5 estrellas`);
  document.getElementById('resenasTotal').textContent =
    `${total} reseña${total === 1 ? '' : 's'}`;

  // Distribución
  const distribContainer = document.getElementById('resenasDistribucion');
  distribContainer.innerHTML = [5, 4, 3, 2, 1].map(star => {
    const count = distribucion[star] ?? 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return `
      <div class="distrib-row">
        <span class="distrib-label">${star} <i class="bi bi-star-fill text-warning" aria-hidden="true"></i></span>
        <div class="distrib-bar-wrap" role="meter" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${star} estrellas: ${count}">
          <div class="distrib-bar-fill" style="width:${pct}%"></div>
        </div>
        <span class="distrib-count">${count}</span>
      </div>
    `;
  }).join('');

  document.getElementById('resenasSummary').classList.remove('d-none');

  // Lista
  document.getElementById('resenasLista').innerHTML = resenas.map(r => `
    <article class="resena-publica">
      <div class="resena-pub-head">
        <div>
          <span class="resena-pub-autor">${escapeHTML(r.nombre || 'Cliente')}</span>
          <span class="resena-pub-fecha">${fmtDate(r.created_at)}</span>
        </div>
        <div class="resena-pub-stars" aria-label="${r.rating} de 5 estrellas">
          ${buildStarsDisplay(r.rating)}
        </div>
      </div>
      <p class="resena-pub-comentario">${escapeHTML(r.comentario)}</p>
    </article>
  `).join('');
}

/* =======================
   Formulario
======================= */
function initStarPicker() {
  const picker = document.getElementById('starPicker');
  if (!picker) return;

  const btns = picker.querySelectorAll('.star-btn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = Number(btn.dataset.val);
      actualizarPicker(btns, selectedRating);
      document.getElementById('errorRating').classList.add('d-none');
    });

    btn.addEventListener('mouseenter', () => {
      actualizarPicker(btns, Number(btn.dataset.val), true);
    });
  });

  picker.addEventListener('mouseleave', () => {
    actualizarPicker(btns, selectedRating);
  });
}

function actualizarPicker(btns, valor, hover = false) {
  btns.forEach(btn => {
    const v = Number(btn.dataset.val);
    const activo = v <= valor;
    btn.innerHTML = activo
      ? '<i class="bi bi-star-fill" aria-hidden="true"></i>'
      : '<i class="bi bi-star" aria-hidden="true"></i>';
    btn.classList.toggle('active', activo);
    btn.classList.toggle('hover', hover && activo);
  });
}

function initForm() {
  const form = document.getElementById('formResena');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarForm()) return;

    const productId = document.getElementById('resenaProductId').value;
    const comentario = document.getElementById('resenaComentario').value.trim();
    const nombre = document.getElementById('resenaNombre').value.trim() || null;
    const email = document.getElementById('resenaEmail').value.trim() || null;

    const btn = document.getElementById('btnEnviarResena');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';

    try {
      const resp = await fetch(`${API_BASE}/${productId}/resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ rating: selectedRating, comentario, nombre, email }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const errMsg = data?.message || 'Error al enviar la reseña.';
        throw new Error(errMsg);
      }

      document.getElementById('resenaFormSuccess').classList.remove('d-none');
      form.classList.add('d-none');
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-send me-2" aria-hidden="true"></i>Enviar reseña';
      mostrarErrorForm(err.message || 'Ocurrió un error. Inténtalo de nuevo.');
    }
  });
}

function validarForm() {
  let valido = true;

  if (selectedRating < 1 || selectedRating > 5) {
    document.getElementById('errorRating').classList.remove('d-none');
    valido = false;
  }

  const comentario = document.getElementById('resenaComentario').value.trim();
  const errorComent = document.getElementById('errorComentario');
  if (comentario.length < 5 || comentario.length > 1000) {
    document.getElementById('resenaComentario').classList.add('is-invalid');
    errorComent.style.display = 'block';
    valido = false;
  } else {
    document.getElementById('resenaComentario').classList.remove('is-invalid');
    errorComent.style.display = 'none';
  }

  const emailInput = document.getElementById('resenaEmail');
  const errorEmail = document.getElementById('errorEmail');
  const emailVal = emailInput.value.trim();
  if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    emailInput.classList.add('is-invalid');
    errorEmail.style.display = 'block';
    valido = false;
  } else {
    emailInput.classList.remove('is-invalid');
    errorEmail.style.display = 'none';
  }

  return valido;
}

function mostrarErrorForm(mensaje) {
  let errBox = document.getElementById('resenaFormError');
  if (!errBox) {
    errBox = document.createElement('div');
    errBox.id = 'resenaFormError';
    errBox.className = 'alert alert-danger mb-3';
    errBox.setAttribute('role', 'alert');
    document.getElementById('formResena').prepend(errBox);
  }
  errBox.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${escapeHTML(mensaje)}`;
}

function resetForm() {
  selectedRating = 0;
  const form = document.getElementById('formResena');
  if (form) {
    form.reset();
    form.classList.remove('d-none');
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  }

  document.getElementById('resenaFormSuccess')?.classList.add('d-none');
  document.getElementById('resenaFormError')?.remove();
  document.getElementById('errorRating').classList.add('d-none');

  const btns = document.querySelectorAll('#starPicker .star-btn');
  actualizarPicker(btns, 0);

  const submitBtn = document.getElementById('btnEnviarResena');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-send me-2" aria-hidden="true"></i>Enviar reseña';
  }
}

/* =======================
   Helpers visuales
======================= */
function buildStarsDisplay(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    '<i class="bi bi-star-fill text-warning" aria-hidden="true"></i>'.repeat(full) +
    (half ? '<i class="bi bi-star-half text-warning" aria-hidden="true"></i>' : '') +
    '<i class="bi bi-star text-secondary" aria-hidden="true"></i>'.repeat(empty)
  );
}

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}
