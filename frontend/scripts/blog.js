const FEED_URL = "/api/public/blog-feed";
const PAGE_SIZE = 6;
const CART_STORAGE_KEY = "liquid-colors-cart-v1";
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  feed: { posts: [], notices: [], deliveries: [] },
  page: 1,
  usingFallback: false,
  revealObserver: null,
  postModal: null
};

const elements = {
  weekRange: document.getElementById("weekRange"),
  todayCount: document.getElementById("todayCount"),
  feedTotal: document.getElementById("feedTotal"),
  noticeCount: document.getElementById("noticeCount"),
  postCount: document.getElementById("postCount"),
  deliveryCount: document.getElementById("deliveryCount"),
  deliveryReportCount: document.getElementById("deliveryReportCount"),
  feedStatus: document.getElementById("feedStatus"),
  noticesMeta: document.getElementById("noticesMeta"),
  postsMeta: document.getElementById("postsMeta"),
  deliveriesMeta: document.getElementById("deliveriesMeta"),
  avisosGrid: document.getElementById("avisosGrid"),
  postsGrid: document.getElementById("postsGrid"),
  entregasBody: document.getElementById("entregasBody"),
  searchPost: document.getElementById("searchPost"),
  filterDate: document.getElementById("filterDate"),
  btnLoadMore: document.getElementById("btnLoadMore"),
  btnRefreshFeed: document.getElementById("btnRefreshFeed"),
  cartBadge: document.getElementById("cartBadge"),
  postModal: document.getElementById("postModal"),
  postModalMeta: document.getElementById("postModalMeta"),
  postModalTitle: document.getElementById("postModalTitle"),
  postModalBody: document.getElementById("postModalBody")
};

const FALLBACK_FEED = createFallbackFeed();

document.addEventListener("DOMContentLoaded", () => {
  syncCartBadge();
  initNavbar();
  initRevealObserver();
  initModal();
  initEvents();
  updateWeekRange();
  loadFeed({ silent: true });
});

function createFallbackFeed() {
  const today = new Date();
  const isoForOffset = (offsetDays) => {
    const date = new Date(today);
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString();
  };

  return {
    posts: [
      {
        id: "demo-post-1",
        title: "Como preparar archivos para sublimacion",
        excerpt: "Una guia breve para exportar PNG, cuidar margenes y evitar ajustes de ultima hora.",
        content:
          "Antes de enviar un diseno revisa resolucion, area segura y fondo transparente.\n\nUsa PNG en buena escala, convierte textos importantes en curvas cuando aplique y deja margen suficiente para evitar recortes.\n\nSi tienes dudas sobre el formato, solicita una revision previa desde el formulario de personalizacion.",
        created_at: isoForOffset(0),
        tag: "Guia"
      },
      {
        id: "demo-post-2",
        title: "Que producto elegir segun el uso",
        excerpt: "Un repaso rapido por camisetas, tazas y fundas para pedidos promocionales o de regalo.",
        content:
          "Las tazas funcionan bien cuando buscas presencia diaria.\n\nLas camisetas suelen ser utiles para marcas, equipos o eventos.\n\nLas fundas y accesorios resuelven pedidos pequenos cuando el cliente ya tiene definido el diseno.",
        created_at: isoForOffset(-1),
        tag: "Articulo"
      },
      {
        id: "demo-post-3",
        title: "Errores frecuentes al solicitar personalizacion",
        excerpt: "Tamano, cantidad y fecha requerida son los puntos que mas conviene definir antes de confirmar.",
        content:
          "Los errores mas comunes aparecen cuando el arte final no coincide con el tamano real del producto.\n\nTambien conviene definir cantidades, fecha objetivo y metodo de envio antes de confirmar el pedido.\n\nUna especificacion completa reduce correcciones durante la produccion.",
        created_at: isoForOffset(-3),
        tag: "Guia"
      },
      {
        id: "demo-post-4",
        title: "Como consultar avisos y entregas en el blog",
        excerpt: "El blog reune avisos, articulos y reportes semanales en una sola vista.",
        content:
          "Puedes buscar publicaciones, filtrar por fecha y abrir cada articulo en una vista completa sin salir del blog.\n\nLos avisos operativos y los reportes semanales se muestran por separado para facilitar la consulta.\n\nCuando el backend no esta disponible, el sitio presenta una vista temporal con contenido de ejemplo.",
        created_at: isoForOffset(-6),
        tag: "Actualizacion"
      }
    ],
    notices: [
      {
        id: "demo-notice-1",
        title: "Horario extendido para entregas de temporada",
        body: "Durante esta semana atenderemos recolecciones hasta las 7:00 p.m. para cerrar pedidos pendientes.",
        created_at: isoForOffset(0),
        tag: "Aviso"
      },
      {
        id: "demo-notice-2",
        title: "Nueva ventana para pedidos urgentes",
        body: "Los pedidos express ahora se confirman antes de las 11:00 a.m. para mantener tiempos realistas.",
        created_at: isoForOffset(-2),
        tag: "Operacion"
      }
    ],
    deliveries: [
      {
        id: "demo-delivery-1",
        title: "Entregas corporativas cerradas",
        summary: "Pedidos para kits empresariales y playeras de evento confirmados en tiempo.",
        quantity: 18,
        range: "07 abr - 13 abr",
        created_at: isoForOffset(-1)
      },
      {
        id: "demo-delivery-2",
        title: "Pedidos retail y personalizados",
        summary: "Se completaron tazas y fundas de baja escala con entregas estandar y express.",
        quantity: 11,
        range: "07 abr - 13 abr",
        created_at: isoForOffset(-4)
      }
    ]
  };
}

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function syncCartBadge() {
  if (!elements.cartBadge) return;

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    const count = Array.isArray(items)
      ? items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)
      : 0;

    elements.cartBadge.textContent = String(count);
  } catch (error) {
    console.warn("Cart storage unavailable:", error);
    elements.cartBadge.textContent = "0";
  }
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (match) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[match] || match;
  });
}

function formatDate(value, options) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return date.toLocaleDateString(
    "es-MX",
    options || { day: "2-digit", month: "short", year: "numeric" }
  );
}

function formatArticleBody(value = "") {
  const safe = escapeHTML(value.trim());

  if (!safe) {
    return "<p class=\"text-muted-300 mb-0\">Esta publicacion no incluye contenido adicional.</p>";
  }

  return safe
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function pluralize(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function totalDeliveredOrders() {
  return state.feed.deliveries.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function isToday(value) {
  const date = new Date(value);
  const now = new Date();
  return !Number.isNaN(date.getTime()) && date.toDateString() === now.toDateString();
}

function postTone(tag = "") {
  const normalized = tag.toLowerCase();

  if (normalized.includes("guia")) return "guide";
  if (normalized.includes("entrega") || normalized.includes("pedido")) return "delivery";
  if (normalized.includes("aviso") || normalized.includes("actualizacion")) return "notice";

  return "article";
}

function postIcon(tag = "") {
  const normalized = tag.toLowerCase();

  if (normalized.includes("guia")) return "bi-compass";
  if (normalized.includes("actualizacion")) return "bi-stars";
  if (normalized.includes("pedido") || normalized.includes("entrega")) return "bi-truck";

  return "bi-journal-richtext";
}

function normalizeFeed(data) {
  const byDateDesc = (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0);
  const normalizeItems = (list, mapper) => (Array.isArray(list) ? list.map(mapper).sort(byDateDesc) : []);

  return {
    posts: normalizeItems(data?.posts, (item) => ({
      id: item?.id ?? cryptoRandomId(),
      title: item?.title || "Sin titulo",
      excerpt: item?.excerpt || "",
      content: item?.content || "",
      created_at: item?.created_at || new Date().toISOString(),
      tag: item?.tag || "Articulo",
      cover_url: item?.cover_url || ""
    })),
    notices: normalizeItems(data?.notices, (item) => ({
      id: item?.id ?? cryptoRandomId(),
      title: item?.title || "Sin titulo",
      body: item?.body || "",
      created_at: item?.created_at || new Date().toISOString(),
      tag: item?.tag || "Aviso"
    })),
    deliveries: normalizeItems(data?.deliveries, (item) => ({
      id: item?.id ?? cryptoRandomId(),
      title: item?.title || "Sin titulo",
      summary: item?.summary || "",
      quantity: Number(item?.quantity) || 0,
      range: item?.range || "Sin rango",
      created_at: item?.created_at || new Date().toISOString()
    }))
  };
}

function cryptoRandomId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `blog-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

function setFeedStatus(message, stateName) {
  if (!elements.feedStatus) return;

  elements.feedStatus.textContent = message;
  elements.feedStatus.dataset.state = stateName;
}

function updateWeekRange() {
  if (!elements.weekRange) return;

  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  elements.weekRange.textContent = `${formatDate(monday, {
    day: "2-digit",
    month: "short"
  })} - ${formatDate(sunday, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })}`;
}

function updateSummary() {
  const totalFeedItems =
    state.feed.posts.length + state.feed.notices.length + state.feed.deliveries.length;
  const postsToday = state.feed.posts.filter((item) => isToday(item.created_at)).length;
  const deliveredOrders = totalDeliveredOrders();

  if (elements.todayCount) elements.todayCount.textContent = String(postsToday);
  if (elements.feedTotal) elements.feedTotal.textContent = String(totalFeedItems);
  if (elements.noticeCount) elements.noticeCount.textContent = String(state.feed.notices.length);
  if (elements.postCount) elements.postCount.textContent = String(state.feed.posts.length);
  if (elements.deliveryCount) elements.deliveryCount.textContent = String(deliveredOrders);
  if (elements.deliveryReportCount) {
    elements.deliveryReportCount.textContent = String(state.feed.deliveries.length);
  }
  if (elements.noticesMeta) {
    elements.noticesMeta.textContent = state.feed.notices.length
      ? pluralize(state.feed.notices.length, "aviso activo", "avisos activos")
      : "Sin avisos publicados";
  }
  if (elements.deliveriesMeta) {
    elements.deliveriesMeta.textContent = state.feed.deliveries.length
      ? `${pluralize(state.feed.deliveries.length, "reporte", "reportes")} · ${pluralize(
          deliveredOrders,
          "pedido",
          "pedidos"
        )}`
      : "Sin entregas registradas";
  }
}

function initNavbar() {
  const nav = document.querySelector(".navbar");
  const collapseEl = document.getElementById("mainNav");

  if (!nav) return;

  const syncNavbarState = () => {
    nav.classList.toggle("scrolled", window.scrollY > 18);
  };

  syncNavbarState();
  window.addEventListener("scroll", syncNavbarState, { passive: true });

  if (collapseEl && window.bootstrap) {
    const collapse = window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });

    collapseEl.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992 && collapseEl.classList.contains("show")) {
          collapse.hide();
        }
      });
    });
  }
}

function initRevealObserver() {
  const revealElements = document.querySelectorAll("[data-reveal]");

  if (!revealElements.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  state.revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        state.revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  observeRevealElements(revealElements);
}

function observeRevealElements(items) {
  Array.from(items || []).forEach((item) => {
    if (item.dataset.revealBound === "true") return;

    item.dataset.revealBound = "true";

    if (prefersReducedMotion() || !state.revealObserver) {
      item.classList.add("is-visible");
      return;
    }

    state.revealObserver.observe(item);
  });
}

function initModal() {
  if (!elements.postModal || !window.bootstrap) return;
  state.postModal = window.bootstrap.Modal.getOrCreateInstance(elements.postModal);
}

function initEvents() {
  elements.searchPost?.addEventListener("input", () => renderPosts(true));
  elements.filterDate?.addEventListener("change", () => renderPosts(true));

  elements.btnLoadMore?.addEventListener("click", () => {
    state.page += 1;
    renderPosts();
  });

  elements.btnRefreshFeed?.addEventListener("click", () => {
    loadFeed();
  });

  elements.postsGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-post-id]");

    if (!button) return;

    openPost(button.dataset.postId);
  });
}

function renderLoadingState() {
  if (elements.avisosGrid) {
    elements.avisosGrid.innerHTML = Array.from({ length: 3 }, (_, index) => `
      <div class="col-12 col-md-6 col-xl-4" data-reveal="up" style="--reveal-delay:${index * 0.04}s">
        <div class="notice-card blog-skeleton" aria-hidden="true">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton skeleton-pill mb-3"></div>
          <div class="skeleton skeleton-line is-medium"></div>
          <div class="skeleton skeleton-line is-long"></div>
          <div class="skeleton skeleton-line is-short mb-0"></div>
        </div>
      </div>
    `).join("");
    observeRevealElements(elements.avisosGrid.querySelectorAll("[data-reveal]"));
  }

  if (elements.postsGrid) {
    elements.postsGrid.innerHTML = Array.from({ length: 6 }, (_, index) => `
      <div class="col-12 col-md-6 col-xl-4" data-reveal="up" style="--reveal-delay:${index * 0.04}s">
        <div class="post-card blog-skeleton" aria-hidden="true">
          <div class="skeleton skeleton-media"></div>
          <div class="skeleton skeleton-pill mb-3"></div>
          <div class="skeleton skeleton-line is-medium"></div>
          <div class="skeleton skeleton-line is-long"></div>
          <div class="skeleton skeleton-line is-short mb-0"></div>
        </div>
      </div>
    `).join("");
    observeRevealElements(elements.postsGrid.querySelectorAll("[data-reveal]"));
  }

  if (elements.entregasBody) {
    elements.entregasBody.innerHTML = Array.from({ length: 3 }, () => `
      <tr aria-hidden="true">
        <td><div class="skeleton skeleton-line is-short mb-0"></div></td>
        <td><div class="skeleton skeleton-line is-medium mb-0"></div></td>
        <td><div class="skeleton skeleton-line is-short mb-0"></div></td>
        <td><div class="skeleton skeleton-line is-medium mb-0"></div></td>
        <td><div class="skeleton skeleton-line is-long mb-0"></div></td>
      </tr>
    `).join("");
  }

  if (elements.postsMeta) elements.postsMeta.textContent = "Cargando publicaciones...";
  if (elements.noticesMeta) elements.noticesMeta.textContent = "Cargando avisos...";
  if (elements.deliveriesMeta) elements.deliveriesMeta.textContent = "Cargando entregas...";
  elements.btnLoadMore?.classList.add("d-none");
}

async function loadFeed({ silent = false } = {}) {
  renderLoadingState();
  toggleRefreshButton(true);
  setFeedStatus("Cargando feed...", "loading");

  try {
    const response = await fetch(FEED_URL, {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    if (!response.ok) {
      throw new Error(`Feed request failed with status ${response.status}`);
    }

    state.feed = normalizeFeed(await response.json());
    state.usingFallback = false;
    setFeedStatus("Feed sincronizado", "success");

    if (!silent) {
      toast("Feed actualizado");
    }
  } catch (error) {
    console.error("Blog feed error:", error);
    state.feed = normalizeFeed(FALLBACK_FEED);
    state.usingFallback = true;
    setFeedStatus("Vista temporal: feed no disponible", "warning");

    if (!silent) {
      toast("No se pudo conectar con el feed. Se muestra una vista temporal.");
    }
  } finally {
    updateSummary();
    renderAvisos();
    renderPosts(true);
    renderDeliveries();
    toggleRefreshButton(false);
  }
}

function toggleRefreshButton(isLoading) {
  if (!elements.btnRefreshFeed) return;

  elements.btnRefreshFeed.disabled = isLoading;
  elements.btnRefreshFeed.innerHTML = isLoading
    ? "<i class=\"bi bi-arrow-repeat\" aria-hidden=\"true\"></i><span>Actualizando...</span>"
    : "<i class=\"bi bi-arrow-repeat\" aria-hidden=\"true\"></i><span>Actualizar feed</span>";
}

function getFilteredPosts() {
  const query = (elements.searchPost?.value || "").trim().toLowerCase();
  const filter = elements.filterDate?.value || "all";
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  return state.feed.posts.filter((post) => {
    const content = [post.title, post.excerpt, post.content, post.tag].join(" ").toLowerCase();
    const matchQuery = !query || content.includes(query);
    const createdAt = new Date(post.created_at);
    let matchDate = true;

    if (filter === "today") {
      matchDate = createdAt.toDateString() === now.toDateString();
    } else if (filter === "week") {
      matchDate = createdAt >= weekAgo;
    }

    return matchQuery && matchDate;
  });
}

function renderAvisos() {
  if (!elements.avisosGrid) return;

  if (!state.feed.notices.length) {
    elements.avisosGrid.innerHTML = `
      <div class="col-12">
        <div class="blog-empty">
          <div>
            <div class="blog-empty-icon"><i class="bi bi-megaphone" aria-hidden="true"></i></div>
            <h3 class="fw-semibold mb-2">Sin avisos por ahora</h3>
            <p class="text-muted-300 mb-0">Cuando el admin publique comunicados, apareceran aqui de forma destacada.</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  elements.avisosGrid.innerHTML = state.feed.notices
    .map((notice, index) => `
      <div class="col-12 col-md-6 col-xl-4" data-reveal="up" style="--reveal-delay:${index * 0.05}s">
        <article class="notice-card">
          <div class="notice-top">
            <div class="notice-icon"><i class="bi bi-megaphone" aria-hidden="true"></i></div>
            <div class="notice-meta">
              <span class="badge-date">${escapeHTML(formatDate(notice.created_at))}</span>
              <span class="badge-tag">${escapeHTML(notice.tag || "Aviso")}</span>
            </div>
          </div>
          <div class="notice-content">
            <h3>${escapeHTML(notice.title)}</h3>
            <p class="truncate-3">${escapeHTML(notice.body)}</p>
          </div>
        </article>
      </div>
    `)
    .join("");

  observeRevealElements(elements.avisosGrid.querySelectorAll("[data-reveal]"));
}

function renderPosts(resetPage = false) {
  if (!elements.postsGrid) return;

  if (resetPage) {
    state.page = 1;
  }

  const filteredPosts = getFilteredPosts();
  const visiblePosts = filteredPosts.slice(0, state.page * PAGE_SIZE);

  if (elements.postsMeta) {
    if (!filteredPosts.length) {
      elements.postsMeta.textContent = "Sin coincidencias con el filtro actual";
    } else if (filteredPosts.length === state.feed.posts.length) {
      elements.postsMeta.textContent = pluralize(filteredPosts.length, "articulo", "articulos");
    } else {
      elements.postsMeta.textContent = `${pluralize(visiblePosts.length, "articulo", "articulos")} de ${filteredPosts.length}`;
    }
  }

  if (!filteredPosts.length) {
    elements.postsGrid.innerHTML = `
      <div class="col-12">
        <div class="blog-empty">
          <div>
            <div class="blog-empty-icon"><i class="bi bi-search" aria-hidden="true"></i></div>
            <h3 class="fw-semibold mb-2">No encontramos articulos</h3>
            <p class="text-muted-300 mb-0">Prueba con otro termino o cambia el filtro de fecha para ver mas resultados.</p>
          </div>
        </div>
      </div>
    `;
    elements.btnLoadMore?.classList.add("d-none");
    return;
  }

  elements.postsGrid.innerHTML = visiblePosts
    .map((post, index) => {
      const tone = postTone(post.tag);
      const cover = post.cover_url
        ? `
            <img
              class="post-cover"
              src="${escapeHTML(post.cover_url)}"
              alt="${escapeHTML(post.title)}"
              loading="lazy"
            />
          `
        : `
            <div class="post-cover-fallback" data-tone="${escapeHTML(tone)}">
              <span class="post-cover-chip">${escapeHTML(post.tag || "Articulo")}</span>
              <i class="bi ${escapeHTML(postIcon(post.tag))} post-cover-icon" aria-hidden="true"></i>
            </div>
          `;

      return `
        <div class="col-12 col-md-6 col-xl-4" data-reveal="up" style="--reveal-delay:${(index % 6) * 0.04}s">
          <article class="post-card">
            <div class="post-cover-wrap">
              ${cover}
            </div>
            <div class="post-card-body">
              <div class="post-meta">
                <span class="badge-date">${escapeHTML(formatDate(post.created_at))}</span>
                <span class="badge-tag">${escapeHTML(post.tag || "Articulo")}</span>
              </div>
              <h3>${escapeHTML(post.title)}</h3>
              <p class="truncate-3">${escapeHTML(post.excerpt || post.content || "")}</p>
              <button type="button" class="btn btn-surface btn-sm post-read" data-post-id="${escapeHTML(String(post.id))}">
                Leer articulo
              </button>
            </div>
          </article>
        </div>
      `;
    })
    .join("");

  bindImageFallbacks(elements.postsGrid);
  observeRevealElements(elements.postsGrid.querySelectorAll("[data-reveal]"));

  if (visiblePosts.length < filteredPosts.length) {
    elements.btnLoadMore?.classList.remove("d-none");
  } else {
    elements.btnLoadMore?.classList.add("d-none");
  }
}

function bindImageFallbacks(scope) {
  scope?.querySelectorAll("img.post-cover").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        const parent = image.closest(".post-cover-wrap");

        if (!parent) return;

        parent.innerHTML = `
          <div class="post-cover-fallback" data-tone="article">
            <span class="post-cover-chip">Articulo</span>
            <i class="bi bi-journal-richtext post-cover-icon" aria-hidden="true"></i>
          </div>
        `;
      },
      { once: true }
    );
  });
}

function renderDeliveries() {
  if (!elements.entregasBody) return;

  if (!state.feed.deliveries.length) {
    elements.entregasBody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="blog-empty">
            <div>
              <div class="blog-empty-icon"><i class="bi bi-truck" aria-hidden="true"></i></div>
              <h3 class="fw-semibold mb-2">Sin entregas registradas</h3>
              <p class="text-muted-300 mb-0">Los reportes semanales de pedidos entregados apareceran aqui.</p>
            </div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.entregasBody.innerHTML = state.feed.deliveries
    .map(
      (delivery) => `
        <tr>
          <td>${escapeHTML(formatDate(delivery.created_at))}</td>
          <td class="delivery-title">${escapeHTML(delivery.title)}</td>
          <td><span class="delivery-qty">${escapeHTML(String(delivery.quantity || 0))}</span></td>
          <td class="delivery-range">${escapeHTML(delivery.range || "Sin rango")}</td>
          <td class="delivery-summary">${escapeHTML(delivery.summary || "Sin resumen")}</td>
        </tr>
      `
    )
    .join("");
}

function openPost(postId) {
  const selectedPost = state.feed.posts.find((post) => String(post.id) === String(postId));

  if (!selectedPost || !elements.postModalTitle || !elements.postModalBody) return;

  elements.postModalTitle.textContent = selectedPost.title;
  elements.postModalMeta.innerHTML = `
    <span class="badge-date">${escapeHTML(formatDate(selectedPost.created_at))}</span>
    <span class="badge-tag">${escapeHTML(selectedPost.tag || "Articulo")}</span>
  `;
  elements.postModalBody.innerHTML = formatArticleBody(
    selectedPost.content || selectedPost.excerpt || ""
  );

  state.postModal?.show();
}

function toast(message) {
  const toastEl = document.createElement("div");
  toastEl.className = "toast-floating";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  toastEl.innerHTML = `
    <i class="bi bi-info-circle" aria-hidden="true"></i>
    <span>${escapeHTML(message)}</span>
  `;

  document.body.appendChild(toastEl);
  requestAnimationFrame(() => toastEl.classList.add("is-visible"));

  window.setTimeout(() => {
    toastEl.classList.remove("is-visible");
    window.setTimeout(() => toastEl.remove(), 220);
  }, 2600);
}
