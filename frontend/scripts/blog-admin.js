// LEGACY: demo estático conservado solo como referencia visual.
// El flujo oficial de administración de publicaciones vive en Laravel.

// ===== Datos de ejemplo (luego los podrás cargar desde PHP/MySQL) =====
const posts = [
  {
    id: 1,
    tipo: "noticia",
    titulo: "Cambio de horarios este fin de semana",
    resumen: "El sábado abriremos de 10:00 a 16:00 por mantenimiento.",
    contenido: "",
    fecha: new Date().toISOString().slice(0,10),
    estado: "publicado"
  },
  {
    id: 2,
    tipo: "articulo",
    titulo: "Idea del día: sets de tazas personalizadas",
    resumen: "Recomendación de combos para regalo usando foto + frase.",
    contenido: "",
    fecha: new Date().toISOString().slice(0,10),
    estado: "publicado"
  },
  {
    id: 3,
    tipo: "pedido",
    titulo: "Pedidos entregados – Semana 03 nov",
    resumen: "Resumen de entregas a domicilio de la semana.",
    contenido: "",
    fecha: new Date().toISOString().slice(0,10),
    estado: "borrador",
    numPedidos: 18,
    rangoFechas: "03 nov – 09 nov"
  }
];

let nextId = 4;

// ===== Utilidades =====

const $ = (sel) => document.querySelector(sel);

function formatearFechaISO(iso){
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" });
}

function tipoLabel(tipo){
  switch(tipo){
    case "noticia": return "Noticia / Aviso";
    case "articulo": return "Artículo diario";
    case "pedido": return "Pedidos entregados";
    default: return tipo;
  }
}

function tipoColor(tipo){
  switch(tipo){
    case "noticia": return "bg-info-subtle";
    case "articulo": return "bg-success-subtle";
    case "pedido": return "bg-warning-subtle text-dark";
    default: return "bg-secondary-subtle";
  }
}

// ===== Render principal =====

function actualizarSemana(){
  const hoy = new Date();
  const inicio = new Date(hoy);
  inicio.setDate(hoy.getDate() - hoy.getDay() + 1); // lunes
  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + 6);
  $("#lblSemana").textContent =
    `${inicio.toLocaleDateString("es-MX", { day:"2-digit", month:"short" })} — ` +
    `${fin.toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" })}`;
}

function actualizarStats(){
  let noticias=0, articulos=0, pedidos=0, hoy=0;
  const hoyStr = new Date().toISOString().slice(0,10);
  posts.forEach(p=>{
    if (p.tipo==="noticia") noticias++;
    if (p.tipo==="articulo") articulos++;
    if (p.tipo==="pedido") pedidos++;
    if (p.fecha===hoyStr && p.estado==="publicado") hoy++;
  });
  $("#statNoticias").textContent = noticias;
  $("#statArticulos").textContent = articulos;
  $("#statPedidos").textContent = pedidos;
  $("#badgeHoy").textContent = hoy;
}

function renderLista(){
  const cont = $("#listaPosts");
  cont.innerHTML = "";

  const tipoFiltro   = $("#filtroTipo").value;
  const estadoFiltro = $("#filtroEstado").value;

  const hoyStr = new Date().toISOString().slice(0,10);

  const filtrados = posts.filter(p=>{
    if (tipoFiltro !== "todas" && p.tipo !== tipoFiltro) return false;
    if (estadoFiltro !== "todos" && p.estado !== estadoFiltro) return false;
    return true;
  }).sort((a,b)=> b.fecha.localeCompare(a.fecha) || b.id - a.id);

  if (!filtrados.length){
    cont.innerHTML = `<div class="text-muted-300 small text-center py-3">
      No hay publicaciones con los filtros actuales.
    </div>`;
    return;
  }

  filtrados.forEach(p=>{
    const item = document.createElement("div");
    item.className = "blog-post-item";

    const esHoy = p.fecha === hoyStr;

    item.innerHTML = `
      <div class="blog-post-header">
        <div>
          <span class="blog-post-badge ${tipoColor(p.tipo)} me-2">
            ${tipoLabel(p.tipo)}
          </span>
          ${p.estado === "borrador" ? `<span class="badge bg-secondary-subtle text-light">Borrador</span>` : ""}
          ${esHoy && p.estado === "publicado" ? `<span class="badge bg-success">Hoy</span>` : ""}
        </div>
        <div class="blog-post-actions">
          <button class="btn btn-outline-light btn-sm me-1" data-action="edit" data-id="${p.id}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${p.id}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div class="fw-semibold">${p.titulo}</div>
      <div class="blog-post-meta">
        ${formatearFechaISO(p.fecha)} · ${p.resumen || "Sin resumen"}
      </div>
    `;
    cont.appendChild(item);
  });
}

function renderBorradores(){
  const cont = $("#listaBorradores");
  cont.innerHTML = "";
  const borr = posts.filter(p=>p.estado==="borrador").sort((a,b)=> b.fecha.localeCompare(a.fecha));
  if (!borr.length){
    cont.innerHTML = `<div class="text-muted-300">No hay borradores por ahora.</div>`;
    return;
  }
  borr.forEach(p=>{
    const div = document.createElement("div");
    div.className = "draft-item d-flex justify-content-between align-items-center";
    div.innerHTML = `
      <div class="me-2">
        <div class="fw-semibold small">${p.titulo}</div>
        <div class="text-muted-300 small">${formatearFechaISO(p.fecha)} · ${tipoLabel(p.tipo)}</div>
      </div>
      <button class="btn btn-sm btn-outline-light" data-action="edit" data-id="${p.id}">
        <i class="bi bi-pencil"></i>
      </button>
    `;
    cont.appendChild(div);
  });
}

// ===== Modal: creación / edición =====

let editId = null;
let modalInstance = null;

function abrirNuevo(tipoPreseleccionado){
  editId = null;
  $("#modalTitle").textContent = "Nueva publicación";
  $("#tipoPost").value = tipoPreseleccionado || "noticia";
  $("#estadoPost").value = "publicado";
  $("#tituloPost").value = "";
  $("#resumenPost").value = "";
  $("#contenidoPost").value = "";
  $("#numPedidos").value = "";
  $("#rangoFechas").value = "";

  const hoyStr = new Date().toISOString().slice(0,10);
  $("#fechaPost").value = hoyStr;

  actualizarCamposPedidos();
  modalInstance.show();
}

function abrirEditar(id){
  const p = posts.find(x=>x.id===Number(id));
  if (!p) return;

  editId = p.id;
  $("#modalTitle").textContent = "Editar publicación";
  $("#tipoPost").value = p.tipo;
  $("#estadoPost").value = p.estado;
  $("#tituloPost").value = p.titulo || "";
  $("#resumenPost").value = p.resumen || "";
  $("#contenidoPost").value = p.contenido || "";
  $("#fechaPost").value = p.fecha || new Date().toISOString().slice(0,10);
  $("#numPedidos").value = p.numPedidos || "";
  $("#rangoFechas").value = p.rangoFechas || "";

  actualizarCamposPedidos();
  modalInstance.show();
}

function actualizarCamposPedidos(){
  const tipo = $("#tipoPost").value;
  const show = tipo === "pedido";
  $("#grpPedidos").classList.toggle("d-none", !show);
  $("#grpRango").classList.toggle("d-none", !show);
}

// ===== Eventos =====

document.addEventListener("DOMContentLoaded", () => {
  modalInstance = new bootstrap.Modal(document.getElementById("modalPost"));

  // Semana / stats inicial
  actualizarSemana();
  actualizarStats();
  renderLista();
  renderBorradores();

  // Filtros
  $("#filtroTipo").addEventListener("change", ()=> renderLista());
  $("#filtroEstado").addEventListener("change", ()=> renderLista());

  // Botón "Hoy"
  $("#btnFiltrarHoy").addEventListener("click", () => {
    const hoyStr = new Date().toISOString().slice(0,10);
    $("#filtroTipo").value = "todas";
    $("#filtroEstado").value = "publicado";
    const cont = $("#listaPosts");
    cont.innerHTML = "";
    const hoyPosts = posts.filter(p=>p.fecha===hoyStr && p.estado==="publicado");
    if (!hoyPosts.length){
      cont.innerHTML = `<div class="text-muted-300 small text-center py-3">
        No hay publicaciones publicadas el día de hoy.
      </div>`;
      return;
    }
    hoyPosts.forEach(p=>{
      const item = document.createElement("div");
      item.className = "blog-post-item";
      item.innerHTML = `
        <div class="blog-post-header">
          <div>
            <span class="blog-post-badge ${tipoColor(p.tipo)} me-2">${tipoLabel(p.tipo)}</span>
            <span class="badge bg-success">Hoy</span>
          </div>
          <div class="blog-post-actions">
            <button class="btn btn-outline-light btn-sm me-1" data-action="edit" data-id="${p.id}">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${p.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <div class="fw-semibold">${p.titulo}</div>
        <div class="blog-post-meta">${formatearFechaISO(p.fecha)} · ${p.resumen || "Sin resumen"}</div>
      `;
      cont.appendChild(item);
    });
  });

  // Acciones rápidas
  document.querySelectorAll(".btn-quick").forEach(btn=>{
    btn.addEventListener("click", () => {
      const tipo = btn.getAttribute("data-type");
      abrirNuevo(tipo);
    });
  });

  // Cambiar campos cuando cambia tipo
  $("#tipoPost").addEventListener("change", actualizarCamposPedidos);

  // Guardar publicación
  $("#formPost").addEventListener("submit",(e)=>{
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data.entries());
    const tipo = obj.tipo;
    const fecha = obj.fecha || new Date().toISOString().slice(0,10);

    if (editId){
      const p = posts.find(x=>x.id===editId);
      if (!p) return;
      Object.assign(p, {
        tipo,
        fecha,
        estado: obj.estado,
        titulo: obj.titulo,
        resumen: obj.resumen,
        contenido: obj.contenido,
        numPedidos: obj.numPedidos || null,
        rangoFechas: obj.rangoFechas || null
      });
    } else {
      posts.push({
        id: nextId++,
        tipo,
        fecha,
        estado: obj.estado,
        titulo: obj.titulo,
        resumen: obj.resumen,
        contenido: obj.contenido,
        numPedidos: obj.numPedidos || null,
        rangoFechas: obj.rangoFechas || null
      });
    }

    modalInstance.hide();
    actualizarStats();
    renderLista();
    renderBorradores();
  });

  // Delegación de eventos para editar/eliminar
  document.body.addEventListener("click",(e)=>{
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (action==="edit"){
      abrirEditar(id);
    } else if (action==="delete"){
      if (confirm("¿Eliminar esta publicación?")){
        const idx = posts.findIndex(p=>p.id===Number(id));
        if (idx>=0) posts.splice(idx,1);
        actualizarStats();
        renderLista();
        renderBorradores();
      }
    }
  });
});
