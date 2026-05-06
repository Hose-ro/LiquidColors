/* =======================
   Admin – Reseñas
======================= */

const BASE = '/admin';
const CSRF = document.querySelector('meta[name="csrf-token"]')?.content ?? '';

let allResenas = [];
let filtroEstado = 'todas';
let filtroRating = 'todos';

document.addEventListener('DOMContentLoaded', () => {
  cargarResenas();
  initFiltros();
});

/* =======================
   API helpers
======================= */
async function apiPatch(url) {
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: { 'X-CSRF-TOKEN': CSRF, 'Accept': 'application/json' },
  });
  if (!resp.ok) throw new Error(`Error ${resp.status}`);
  return resp.json();
}

async function apiDelete(url) {
  const resp = await fetch(url, {
    method: 'DELETE',
    headers: { 'X-CSRF-TOKEN': CSRF, 'Accept': 'application/json' },
  });
  if (!resp.ok) throw new Error(`Error ${resp.status}`);
  return resp.json();
}

/* =======================
   Carga y render
======================= */
async function cargarResenas() {
  try {
    const resp = await fetch(`${BASE}/resenas-json`, {
      headers: { 'Accept': 'application/json' },
    });
    allResenas = await resp.json();
    actualizarEstadisticas();
    renderResenas();
  } catch {
    document.getElementById('resenasList').innerHTML = `
      <div class="text-center py-5 text-danger">
        <i class="bi bi-exclamation-triangle fs-2 mb-2 d-block"></i>
        Error al cargar las reseñas. Recarga la página.
      </div>
    `;
  }
}

function actualizarEstadisticas() {
  const total = allResenas.length;
  const aprobadas = allResenas.filter(r => r.aprobada).length;
  const pendientes = total - aprobadas;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statAprobadas').textContent = aprobadas;
  document.getElementById('statPendientes').textContent = pendientes;
  document.getElementById('badgePendientes').textContent = pendientes;
  document.getElementById('badgeTodas').textContent = total;

  const promedio = total > 0
    ? (allResenas.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
    : '—';
  document.getElementById('lblResumen').textContent =
    total > 0 ? `Promedio general: ${promedio} ★` : 'Sin reseñas aún';
}

function filtrarResenas() {
  return allResenas.filter(r => {
    const estadoOk =
      filtroEstado === 'todas' ||
      (filtroEstado === 'aprobada' && r.aprobada) ||
      (filtroEstado === 'pendiente' && !r.aprobada);
    const ratingOk =
      filtroRating === 'todos' || String(r.rating) === filtroRating;
    return estadoOk && ratingOk;
  });
}

function renderResenas() {
  const lista = filtrarResenas();
  const container = document.getElementById('resenasList');

  if (!lista.length) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted-300">
        <i class="bi bi-search fs-2 mb-2 d-block"></i>
        No hay reseñas que coincidan con los filtros.
      </div>
    `;
    return;
  }

  container.innerHTML = lista.map(r => buildRow(r)).join('');
  bindRowActions(container);
}

function buildStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= rating
      ? '<i class="bi bi-star-fill text-warning me-1" aria-hidden="true"></i>'
      : '<i class="bi bi-star text-secondary me-1" aria-hidden="true"></i>';
  }
  return html;
}

function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function buildRow(r) {
  const estadoBadge = r.aprobada
    ? '<span class="badge bg-success">Aprobada</span>'
    : '<span class="badge bg-warning text-dark">Pendiente</span>';

  const autor = escapeHTML(r.nombre || 'Anónimo');
  const email = r.email ? `<small class="text-muted-300 d-block">${escapeHTML(r.email)}</small>` : '';
  const comentarioCorto = escapeHTML(String(r.comentario ?? '').slice(0, 120));
  const esTruncado = (r.comentario ?? '').length > 120;

  return `
    <article class="resena-row" data-id="${r.id}" data-aprobada="${r.aprobada ? '1' : '0'}">
      <div class="resena-meta">
        <div class="resena-autor">
          <strong>${autor}</strong>
          ${email}
          <small class="text-muted-300">${fmtDate(r.created_at)}</small>
        </div>
        <div class="resena-rating">${buildStars(r.rating)} <small class="text-muted-300">${r.rating}/5</small></div>
        <div class="resena-producto text-muted-300 small">Producto #${r.product_id}</div>
        <div>${estadoBadge}</div>
      </div>
      <div class="resena-comentario">
        <p class="mb-1">${comentarioCorto}${esTruncado ? '...' : ''}</p>
        ${esTruncado
          ? `<button class="btn-link-inline btn-ver-completo" data-id="${r.id}">Ver completo</button>`
          : ''}
      </div>
      <div class="resena-acciones">
        ${!r.aprobada
          ? `<button class="btn btn-sm btn-success btn-aprobar" data-id="${r.id}"><i class="bi bi-check2 me-1"></i>Aprobar</button>`
          : `<button class="btn btn-sm btn-outline-warning btn-rechazar" data-id="${r.id}"><i class="bi bi-x me-1"></i>Rechazar</button>`
        }
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${r.id}">
          <i class="bi bi-trash me-1"></i>Eliminar
        </button>
      </div>
    </article>
  `;
}

/* =======================
   Acciones
======================= */
function bindRowActions(root) {
  root.querySelectorAll('.btn-aprobar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      btn.disabled = true;
      try {
        await apiPatch(`${BASE}/resenas/${id}/aprobar`);
        const resena = allResenas.find(r => String(r.id) === String(id));
        if (resena) resena.aprobada = true;
        actualizarEstadisticas();
        renderResenas();
        mostrarToast('Reseña aprobada correctamente.');
      } catch {
        btn.disabled = false;
        mostrarToast('Error al aprobar la reseña.', true);
      }
    });
  });

  root.querySelectorAll('.btn-rechazar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      btn.disabled = true;
      try {
        await apiPatch(`${BASE}/resenas/${id}/rechazar`);
        const resena = allResenas.find(r => String(r.id) === String(id));
        if (resena) resena.aprobada = false;
        actualizarEstadisticas();
        renderResenas();
        mostrarToast('Reseña rechazada.');
      } catch {
        btn.disabled = false;
        mostrarToast('Error al rechazar la reseña.', true);
      }
    });
  });

  root.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta reseña? Esta acción no se puede deshacer.')) return;
      const id = btn.dataset.id;
      btn.disabled = true;
      try {
        await apiDelete(`${BASE}/resenas/${id}`);
        allResenas = allResenas.filter(r => String(r.id) !== String(id));
        actualizarEstadisticas();
        renderResenas();
        mostrarToast('Reseña eliminada.');
      } catch {
        btn.disabled = false;
        mostrarToast('Error al eliminar la reseña.', true);
      }
    });
  });

  root.querySelectorAll('.btn-ver-completo').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const resena = allResenas.find(r => String(r.id) === String(id));
      if (!resena) return;

      const modalBody = document.getElementById('modalComentarioBody');
      modalBody.innerHTML = `
        <div class="mb-2">${buildStars(resena.rating)} <strong>${resena.rating}/5</strong></div>
        <p class="mb-2"><strong>${escapeHTML(resena.nombre || 'Anónimo')}</strong>
          <span class="text-muted-300 small ms-2">${fmtDate(resena.created_at)}</span>
        </p>
        <p class="mb-0 lh-base">${escapeHTML(resena.comentario)}</p>
      `;

      const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalComentario'));
      modal.show();
    });
  });
}

/* =======================
   Filtros
======================= */
function initFiltros() {
  document.getElementById('filtroEstado').addEventListener('change', e => {
    filtroEstado = e.target.value;
    renderResenas();
  });

  document.getElementById('filtroRating').addEventListener('change', e => {
    filtroRating = e.target.value;
    renderResenas();
  });

  document.getElementById('btnFiltrarPendientes').addEventListener('click', () => {
    filtroEstado = 'pendiente';
    document.getElementById('filtroEstado').value = 'pendiente';
    renderResenas();
  });

  document.getElementById('btnFiltrarTodas').addEventListener('click', () => {
    filtroEstado = 'todas';
    document.getElementById('filtroEstado').value = 'todas';
    renderResenas();
  });
}

/* =======================
   Toast
======================= */
function mostrarToast(mensaje, error = false) {
  const el = document.createElement('div');
  el.className = `toast-floating ${error ? 'is-error' : ''}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.innerHTML = `
    <i class="bi ${error ? 'bi-exclamation-triangle' : 'bi-check2-circle'}" aria-hidden="true"></i>
    <span>${escapeHTML(mensaje)}</span>
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  setTimeout(() => {
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 220);
  }, 2800);
}
