/***********************
 *  Configuración base
 ***********************/
const destacados = [
  {
    id: 1,
    titulo: "Camiseta de algodon personalizada",
    descripcion: "Pensada para merch, eventos y pedidos por lote.",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop",
    rating: 4.8,
    reviews: 124,
    precio: 24.99,
    viejo: 34.99,
    badge: "Bestseller",
    tag: "Textil",
    cat: "camisetas"
  },
  {
    id: 2,
    titulo: "Taza termica personalizada",
    descripcion: "Una opcion funcional para regalo, oficina y promociones.",
    img: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1600&auto=format&fit=crop",
    rating: 4.9,
    reviews: 89,
    precio: 15.99,
    badge: "Nuevo",
    tag: "Hogar",
    cat: "tazas"
  },
  {
    id: 3,
    titulo: "Funda personalizada para iPhone",
    descripcion: "Proteccion diaria con impresion aplicada a medida.",
    img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12?q=80&w=1600&auto=format&fit=crop",
    rating: 4.7,
    reviews: 156,
    precio: 18.99,
    viejo: 25.99,
    badge: "Oferta",
    tag: "Tecnología",
    cat: "fundas"
  },
  {
    id: 4,
    titulo: "Bolsa textil personalizada",
    descripcion: "Alternativa reutilizable para eventos, empaque y punto de venta.",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop",
    rating: 4.6,
    reviews: 78,
    precio: 12.99,
    badge: "Eco",
    tag: "Merch",
    cat: "bolsas"
  }
];

const CART_STORAGE_KEY = "liquid-colors-cart-v1";
const DIRECT_ORDER_STORAGE_KEY = "liquid-colors-direct-order-v1";
const CONTACT_CONFIG = {
  email: "contacto@liquidcolors.com",
  whatsappNumber: "5215555555555",
  whatsappDisplay: "+52 55 5555 5555",
  phoneHref: "+525555555555",
  phoneDisplay: "+52 55 5555 5555"
};
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let revealObserver = null;
let directOrderController = null;

const badgeToneMap = {
  Bestseller: "is-bestseller",
  Nuevo: "is-new",
  Oferta: "is-sale",
  Eco: "is-eco"
};

document.addEventListener("DOMContentLoaded", () => {
  syncCartBadge();
  initNavbar();
  initRevealObserver();
  initImageFallbacks();
  initProductos();
  initOrderForm();
  initContactForm();
});

/***********************
 *  Utilidades
 ***********************/
function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function formatDateValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0];
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const decimals = unitIndex === 0 ? 0 : size < 10 ? 1 : 0;
  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
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

function readCartStorage() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Cart storage unavailable:", error);
    return [];
  }
}

function writeCartStorage(items) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Cart storage unavailable:", error);
  }
}

function getCartCount() {
  return readCartStorage().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

function syncCartBadge() {
  const cartBadge = document.getElementById("cartBadge");
  if (!cartBadge) return;

  cartBadge.textContent = String(getCartCount());
}

function addProductToCart(product) {
  const items = readCartStorage();
  const existingItem = items.find((item) => String(item.id) === String(product.id));

  if (existingItem) {
    existingItem.qty = (Number(existingItem.qty) || 0) + 1;
  } else {
    items.push({
      id: String(product.id),
      titulo: product.titulo,
      precio: Number(product.precio) || 0,
      img: product.img || "",
      tag: product.tag || "Producto",
      cat: product.cat || "destacados",
      qty: 1
    });
  }

  writeCartStorage(items);
  syncCartBadge();
}

function mapDirectOrderProductValue(category) {
  switch (String(category || "").trim()) {
    case "camisetas":
    case "camiseta":
      return "camiseta";
    case "tazas":
    case "taza":
      return "taza";
    case "fundas":
    case "funda":
      return "funda";
    case "bolsas":
    case "bolsa":
      return "bolsa";
    default:
      return "otro";
  }
}

function writeDirectOrderSelection(product) {
  try {
    const selection = {
      id: String(product.id || "").trim(),
      titulo: String(product.titulo || "Producto personalizado").trim(),
      productValue: mapDirectOrderProductValue(product.cat),
      qty: 1
    };

    window.localStorage.setItem(DIRECT_ORDER_STORAGE_KEY, JSON.stringify(selection));
  } catch (error) {
    console.warn("Direct order storage unavailable:", error);
  }
}

function readDirectOrderSelection() {
  try {
    const raw = window.localStorage.getItem(DIRECT_ORDER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (!parsed || typeof parsed !== "object") return null;

    return {
      id: String(parsed.id || "").trim(),
      titulo: String(parsed.titulo || "Producto personalizado").trim(),
      productValue: mapDirectOrderProductValue(parsed.productValue),
      qty: Math.max(1, Number(parsed.qty) || 1)
    };
  } catch (error) {
    console.warn("Direct order storage unavailable:", error);
    return null;
  }
}

function clearDirectOrderSelection() {
  try {
    window.localStorage.removeItem(DIRECT_ORDER_STORAGE_KEY);
  } catch (error) {
    console.warn("Direct order storage unavailable:", error);
  }
}

function buyNow(product) {
  writeDirectOrderSelection(product);
  window.location.href = "./order.html";
}

function toast(message) {
  const toastEl = document.createElement("div");
  toastEl.className = "toast-floating";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  toastEl.innerHTML = `
    <i class="bi bi-check2-circle" aria-hidden="true"></i>
    <span>${escapeHTML(message)}</span>
  `;

  document.body.appendChild(toastEl);
  requestAnimationFrame(() => toastEl.classList.add("is-visible"));

  window.setTimeout(() => {
    toastEl.classList.remove("is-visible");
    window.setTimeout(() => toastEl.remove(), 220);
  }, 2200);
}

function buildContactMessage(data) {
  return [
    "Hola Liquid Colors, quiero contactarlos.",
    "",
    `Nombre: ${data.nombre || "-"}`,
    `Correo: ${data.email || "-"}`,
    `WhatsApp/Teléfono: ${data.telefono || "-"}`,
    `Canal preferido: ${data.canal || "-"}`,
    `Interés: ${data.interes || "-"}`,
    `Asunto: ${data.asunto || "-"}`,
    "",
    "Mensaje:",
    data.mensaje || "-"
  ].join("\n");
}

function highlightTotal() {
  const totalCard = document.querySelector(".summary-total");
  if (!totalCard) return;

  totalCard.classList.remove("is-highlighted");
  void totalCard.offsetWidth;
  totalCard.classList.add("is-highlighted");
}

/***********************
 *  Navbar
 ***********************/
function initNavbar() {
  const nav = document.querySelector(".navbar");
  const collapseEl = document.getElementById("mainNav");
  const sectionLinks = Array.from(document.querySelectorAll("[data-section-link]"));

  if (!nav) return;

  const targetSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function syncNavbarState() {
    nav.classList.toggle("scrolled", window.scrollY > 18);
  }

  function setActiveLink(targetId) {
    sectionLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${targetId}`;
      link.classList.toggle("active", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  syncNavbarState();

  let isTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (isTicking) return;

      isTicking = true;
      window.requestAnimationFrame(() => {
        syncNavbarState();
        isTicking = false;
      });
    },
    { passive: true }
  );

  if (targetSections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveLink(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-46% 0px -42% 0px",
        threshold: [0.15, 0.35, 0.6]
      }
    );

    targetSections.forEach((section) => sectionObserver.observe(section));
  }

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

/***********************
 *  Reveal on scroll
 ***********************/
function initRevealObserver() {
  const revealElements = document.querySelectorAll("[data-reveal]");

  if (!revealElements.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -12% 0px"
      }
    );
  }

  observeRevealElements(revealElements);
}

function observeRevealElements(elements) {
  if (!elements?.length) return;

  Array.from(elements).forEach((element) => {
    if (element.dataset.revealBound === "true") return;

    element.dataset.revealBound = "true";

    if (prefersReducedMotion() || !revealObserver) {
      element.classList.add("is-visible");
      return;
    }

    revealObserver.observe(element);
  });
}

/***********************
 *  Productos destacados
 ***********************/
function initProductos() {
  if (renderProductosCarrusel()) return;
  renderProductosGrid();
}

function productCardHTML(product, index) {
  const badgeClass = badgeToneMap[product.badge] || "";
  const delay = (index % 4) * 0.06;

  return `
    <div class="product-card position-relative" data-reveal="up" style="--reveal-delay: ${delay}s">
      <div class="product-media">
        ${product.badge ? `<span class="badge-soft ${badgeClass}">${product.badge}</span>` : ""}
        <button class="wishlist border-0" aria-label="Agregar ${escapeHTML(product.titulo)} a favoritos" aria-pressed="false" data-id="${product.id}">
          <i class="bi bi-heart" aria-hidden="true"></i>
        </button>
        <img class="product-cover" src="${product.img}" alt="${escapeHTML(product.titulo)}" loading="lazy" decoding="async" />
      </div>

      <div class="product-body">
        <div class="product-topline">
          <span class="product-tag">${escapeHTML(product.tag)}</span>
          <span class="product-rating">
            <i class="bi bi-star-fill" aria-hidden="true"></i>
            <span class="product-rating-copy">${product.rating.toFixed(1)}</span>
            <span class="product-rating-reviews">(${product.reviews})</span>
          </span>
        </div>

        <h3 class="product-title">${escapeHTML(product.titulo)}</h3>
        <p class="product-description">${escapeHTML(product.descripcion)}</p>

        <div class="product-price-row">
          <span class="product-price">${formatPrice(product.precio)}</span>
          ${product.viejo ? `<span class="product-old">${formatPrice(product.viejo)}</span>` : ""}
        </div>

        <div class="product-meta">Colores vivos, acabado durable y personalización bajo pedido.</div>

        <div class="product-actions">
          <button type="button" class="btn btn-grad btn-product buy-now" data-id="${product.id}">
            <i class="bi bi-lightning-charge" aria-hidden="true"></i>
            Comprar ahora
          </button>
          <button type="button" class="btn btn-surface btn-product add-to-cart" data-id="${product.id}">
            <i class="bi bi-bag-plus" aria-hidden="true"></i>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProductosCarrusel() {
  const track = document.getElementById("carouselDestacados");
  if (!track) return false;

  track.innerHTML = destacados
    .map(
      (product, index) => `
        <div class="carousel-item-card">
          ${productCardHTML(product, index)}
        </div>
      `
    )
    .join("");

  bindProductActions(track);
  initImageFallbacks(track);
  setupCarousel(track);
  observeRevealElements(track.querySelectorAll("[data-reveal]"));

  return true;
}

function renderProductosGrid() {
  const grid = document.getElementById("gridDestacados");
  if (!grid) return false;

  grid.innerHTML = destacados
    .map(
      (product, index) => `
        <div class="col-12 col-sm-6 col-xl-3">
          ${productCardHTML(product, index)}
        </div>
      `
    )
    .join("");

  bindProductActions(grid);
  initImageFallbacks(grid);
  observeRevealElements(grid.querySelectorAll("[data-reveal]"));

  return true;
}

function bindProductActions(root) {
  const cartBadge = document.getElementById("cartBadge");

  root.querySelectorAll(".buy-now").forEach((button) => {
    button.addEventListener("click", () => {
      const product = destacados.find((item) => String(item.id) === String(button.dataset.id));
      if (!product) return;

      buyNow(product);
    });
  });

  root.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const product = destacados.find((item) => String(item.id) === String(button.dataset.id));
      if (!product) return;

      addProductToCart(product);

      if (cartBadge) {
        cartBadge.classList.remove("is-bump");
        void cartBadge.offsetWidth;
        cartBadge.classList.add("is-bump");
      }

      toast(`${product.titulo} agregado al carrito`);
    });
  });

  root.querySelectorAll(".wishlist").forEach((button) => {
    button.addEventListener("click", () => {
      const isActive = button.classList.toggle("active");
      button.setAttribute("aria-pressed", String(isActive));
      button.innerHTML = `<i class="bi ${isActive ? "bi-heart-fill" : "bi-heart"}" aria-hidden="true"></i>`;
    });
  });
}

function initImageFallbacks(root = document) {
  const images = root.querySelectorAll(".cat-card img, .product-cover");

  images.forEach((image) => {
    const card = image.closest(".cat-card, .product-card");
    if (!card || image.dataset.fallbackBound === "true") return;

    image.dataset.fallbackBound = "true";

    const applyFallback = () => {
      card.classList.add("is-image-missing");
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
    };

    image.addEventListener("error", applyFallback, { once: true });

    if (image.complete && image.naturalWidth === 0) {
      applyFallback();
    }
  });
}

function setupCarousel(track) {
  const wrapper = track.closest(".destacados-wrapper");
  const btnPrev = wrapper?.querySelector(".car-arrow.prev");
  const btnNext = wrapper?.querySelector(".car-arrow.next");

  if (!wrapper || !btnPrev || !btnNext) return;

  const getScrollBehavior = () => (prefersReducedMotion() ? "auto" : "smooth");
  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || "0") || 0;
  };

  const getStep = () => {
    const item = track.querySelector(".carousel-item-card");
    return item ? item.getBoundingClientRect().width + getGap() : track.clientWidth * 0.9;
  };

  const updateControls = () => {
    const maxScroll = Math.max(track.scrollWidth - track.clientWidth - 2, 0);
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= maxScroll;

    btnPrev.disabled = atStart;
    btnNext.disabled = atEnd;
    wrapper.classList.toggle("is-at-start", atStart);
    wrapper.classList.toggle("is-at-end", atEnd);
  };

  const slide = (direction) => {
    track.scrollBy({
      left: direction * getStep(),
      behavior: getScrollBehavior()
    });
  };

  btnPrev.addEventListener("click", () => slide(-1));
  btnNext.addEventListener("click", () => slide(1));
  track.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);

  track.setAttribute("tabindex", "0");
  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      slide(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      slide(-1);
    }
  });

  track.querySelectorAll("img").forEach((image) => {
    image.addEventListener("dragstart", (event) => event.preventDefault());
  });

  let isPointerDown = false;
  let startX = 0;
  let startLeft = 0;
  let dragMoved = false;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    isPointerDown = true;
    dragMoved = false;
    startX = event.clientX;
    startLeft = track.scrollLeft;
    track.dataset.dragMoved = "false";
    track.classList.add("dragging");
    track.setPointerCapture?.(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!isPointerDown) return;

    const delta = event.clientX - startX;

    if (Math.abs(delta) > 6) {
      dragMoved = true;
      track.dataset.dragMoved = "true";
    }

    track.scrollLeft = startLeft - delta;
  });

  const endDrag = (event) => {
    if (!isPointerDown) return;

    isPointerDown = false;
    track.classList.remove("dragging");
    track.releasePointerCapture?.(event?.pointerId);
    updateControls();

    window.setTimeout(() => {
      track.dataset.dragMoved = "false";
      dragMoved = false;
    }, 0);
  };

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("pointerleave", (event) => {
    if (event.buttons === 0) endDrag(event);
  });

  track.addEventListener(
    "click",
    (event) => {
      if (track.dataset.dragMoved !== "true") return;

      event.preventDefault();
      event.stopPropagation();
    },
    true
  );

  updateControls();
}

/***********************
 *  Formulario de pedido
 ***********************/
function initOrderForm() {
  const form = document.getElementById("orderForm");
  if (!form) return;

  const elements = {
    selProducto: document.getElementById("selProducto"),
    selTalla: document.getElementById("selTalla"),
    selTecnica: document.getElementById("selTecnica"),
    selEnvio: document.getElementById("selEnvio"),
    inpCantidad: document.getElementById("inpCantidad"),
    inpFecha: document.getElementById("inpFecha"),
    inpDireccion: document.getElementById("inpDireccion"),
    txtNotas: document.getElementById("txtNotas"),
    grpTalla: document.getElementById("grpTalla"),
    totalSpan: document.getElementById("totalSpan"),
    btnSimular: document.getElementById("btnSimular"),
    fileInput: document.getElementById("fileDesign"),
    fileDrop: document.getElementById("fileDrop"),
    fileName: document.getElementById("fileName"),
    filePreview: document.getElementById("filePreview"),
    btnPickFile: document.getElementById("btnPickFile"),
    summaryChips: document.getElementById("orderSummaryChips"),
    summaryFileState: document.getElementById("summaryFileState"),
    resumenBody: document.getElementById("resumenBody"),
    resumenModal: document.getElementById("resumenModal")
  };

  const labels = {
    producto: {
      camiseta: "Camiseta",
      taza: "Taza",
      funda: "Funda",
      bolsa: "Bolsa",
      otro: "Otro"
    },
    tecnica: {
      sublimacion: "Sublimación",
      vinil: "Vinil textil"
    },
    envio: {
      recoger: "Recoger en tienda",
      estandar: "Envío estándar",
      express: "Envío express"
    }
  };

  const PRICE = {
    base: { camiseta: 12, taza: 8, funda: 10, bolsa: 9, otro: 15 },
    tecnica: { sublimacion: 1, vinil: 1.15 },
    envio: { recoger: 0, estandar: 5, express: 12 }
  };

  let previewUrl = "";
  let directSelection = null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  elements.inpFecha.min = formatDateValue(tomorrow);

  function revokePreviewUrl() {
    if (!previewUrl) return;

    URL.revokeObjectURL(previewUrl);
    previewUrl = "";
  }

  function toggleTalla() {
    const isCamiseta = elements.selProducto.value === "camiseta";
    elements.grpTalla.hidden = !isCamiseta;
    elements.selTalla.disabled = !isCamiseta;
    elements.selTalla.required = isCamiseta;
  }

  function syncShippingField() {
    const isPickup = elements.selEnvio.value === "recoger";
    elements.inpDireccion.disabled = isPickup;
    elements.inpDireccion.required = !isPickup;
    elements.inpDireccion.placeholder = isPickup
      ? "No se requiere dirección al recoger en tienda"
      : "Calle, número, colonia, ciudad";
  }

  function getUrgencyMultiplier() {
    if (!elements.inpFecha.value) return 1;

    const selectedDate = new Date(`${elements.inpFecha.value}T00:00:00`);
    const today = new Date();
    const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const diffDays = Math.round((targetDay - currentDay) / (1000 * 60 * 60 * 24));

    return diffDays > 0 && diffDays <= 3 ? 1.2 : 1;
  }

  function calcTotal() {
    const producto = elements.selProducto.value;
    const tecnica = elements.selTecnica.value;
    const envio = elements.selEnvio.value;
    const cantidad = Math.max(1, parseInt(elements.inpCantidad.value || "1", 10));

    let total = (PRICE.base[producto] || 12) * (PRICE.tecnica[tecnica] || 1) * cantidad;
    total += PRICE.envio[envio] || 0;
    total *= getUrgencyMultiplier();

    return total;
  }

  function buildSummaryChips() {
    const chips = [
      labels.producto[elements.selProducto.value] || "Producto",
      `Cantidad: ${Math.max(1, parseInt(elements.inpCantidad.value || "1", 10))}`,
      labels.tecnica[elements.selTecnica.value] || "Técnica",
      labels.envio[elements.selEnvio.value] || "Envío"
    ];

    if (directSelection?.titulo) {
      chips.unshift(`Referencia: ${directSelection.titulo}`);
    }

    if (elements.selProducto.value === "camiseta" && !elements.grpTalla.hidden) {
      chips.push(`Talla: ${elements.selTalla.value}`);
    }

    if (elements.inpFecha.value) {
      chips.push(`Fecha: ${elements.inpFecha.value}`);
    }

    return chips;
  }

  function renderSummaryChips() {
    const chips = buildSummaryChips();
    elements.summaryChips.innerHTML = chips
      .map((chip) => `<span class="summary-chip">${escapeHTML(chip)}</span>`)
      .join("");
  }

  function renderFileState(file = elements.fileInput.files?.[0]) {
    if (!file) {
      elements.summaryFileState.innerHTML = `
        <i class="bi bi-cloud-arrow-up" aria-hidden="true"></i>
        <div>
          <strong>Sin archivo cargado</strong>
          <span>Adjunta tu diseño para agilizar la confirmación.</span>
        </div>
      `;
      return;
    }

    elements.summaryFileState.innerHTML = `
      <i class="bi bi-file-earmark-check" aria-hidden="true"></i>
      <div>
        <strong>${escapeHTML(file.name)}</strong>
        <span>${escapeHTML(formatFileSize(file.size))}</span>
      </div>
    `;
  }

  function updateTotal(animate = false) {
    const total = calcTotal();
    elements.totalSpan.textContent = formatPrice(total);
    renderSummaryChips();
    renderFileState();

    if (animate) {
      highlightTotal();
    }

    return total;
  }

  function handleFile() {
    const file = elements.fileInput.files?.[0];
    revokePreviewUrl();

    if (!file) {
      elements.fileName.textContent = "Ningún archivo seleccionado";
      elements.filePreview.innerHTML = "";
      elements.fileDrop.classList.remove("has-file");
      renderFileState();
      return;
    }

    elements.fileName.textContent = `${file.name} · ${formatFileSize(file.size)}`;
    elements.fileDrop.classList.add("has-file");

    if (file.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(file);
      elements.filePreview.innerHTML = `
        <div class="file-preview-card">
          <img src="${previewUrl}" alt="Vista previa de ${escapeHTML(file.name)}" />
          <div class="file-preview-meta">
            <strong>${escapeHTML(file.name)}</strong>
            <span>${escapeHTML(formatFileSize(file.size))}</span>
          </div>
        </div>
      `;
    } else {
      elements.filePreview.innerHTML = `
        <div class="file-preview-card">
          <div class="file-preview-icon">
            <i class="bi bi-file-earmark-text" aria-hidden="true"></i>
          </div>
          <div class="file-preview-meta">
            <strong>${escapeHTML(file.name)}</strong>
            <span>${escapeHTML(formatFileSize(file.size))}</span>
          </div>
        </div>
      `;
    }

    renderFileState(file);
    renderSummaryChips();
  }

  function openFilePicker() {
    elements.fileInput.click();
  }

  function buildModalRows(formData, total) {
    const file = elements.fileInput.files?.[0];
    const notes = formData.notas
      ? escapeHTML(formData.notas).replace(/\n/g, "<br>")
      : "Sin notas adicionales";

    const rows = [
      { label: "Nombre", value: formData.nombre || "-" },
      { label: "Correo", value: formData.email || "-" },
      { label: "Teléfono", value: formData.telefono || "-" },
      { label: "Producto", value: labels.producto[formData.producto] || formData.producto || "-" },
      ...(directSelection?.titulo ? [{ label: "Referencia elegida", value: directSelection.titulo }] : []),
      { label: "Cantidad", value: formData.cantidad || "1" },
      { label: "Técnica", value: labels.tecnica[formData.tecnica] || formData.tecnica || "-" },
      { label: "Envío", value: labels.envio[formData.envio] || formData.envio || "-" },
      { label: "Dirección", value: formData.direccion || "No aplica" },
      { label: "Fecha requerida", value: formData.fecha || "-" },
      { label: "Archivo", value: file ? `${file.name} (${formatFileSize(file.size)})` : "Sin archivo adjunto" },
      { label: "Notas", value: notes, allowHTML: true }
    ];

    if (formData.producto === "camiseta") {
      rows.splice(4, 0, { label: "Talla", value: formData.talla || "-" });
    }

    return `
      <div class="summary-modal">
        <div class="summary-modal-chips">
          ${buildSummaryChips()
            .map((chip) => `<span class="summary-chip">${escapeHTML(chip)}</span>`)
            .join("")}
        </div>

        <div class="summary-modal-grid">
          ${rows
            .map(
              (row) => `
                <div class="summary-modal-row">
                  <strong>${escapeHTML(row.label)}</strong>
                  <span>${row.allowHTML ? row.value : escapeHTML(row.value)}</span>
                </div>
              `
            )
            .join("")}
        </div>

        <div class="summary-modal-total">
          <span>Total estimado</span>
          <strong class="grad-text">${formatPrice(total)}</strong>
          <small>El monto final se confirma al validar archivo, tiempos y forma de pago.</small>
        </div>
      </div>
    `;
  }

  function applyDirectOrderSelection(selection, options = {}) {
    if (!selection) return false;

    directSelection = selection;
    elements.selProducto.value = selection.productValue;
    elements.inpCantidad.value = String(selection.qty);
    toggleTalla();
    syncShippingField();

    const total = updateTotal(options.animate === true);

    if (options.announce !== false) {
      toast(`Compra directa lista: ${selection.titulo}`);
    }

    return total > 0;
  }

  toggleTalla();
  syncShippingField();
  updateTotal();

  directOrderController = (selection) =>
    applyDirectOrderSelection(selection, {
      animate: true,
      announce: true
    });

  const pendingDirectOrder = readDirectOrderSelection();
  if (pendingDirectOrder) {
    applyDirectOrderSelection(pendingDirectOrder, {
      animate: true,
      announce: true
    });
    clearDirectOrderSelection();
  }

  [elements.selProducto, elements.selTalla, elements.selTecnica, elements.selEnvio, elements.inpCantidad, elements.inpFecha].forEach(
    (input) => {
      input.addEventListener("input", () => updateTotal());
      input.addEventListener("change", () => {
        if (input === elements.selProducto && directSelection && input.value !== directSelection.productValue) {
          directSelection = null;
        }
        toggleTalla();
        syncShippingField();
        updateTotal();
      });
    }
  );

  elements.btnSimular.addEventListener("click", () => {
    const total = updateTotal(true);
    toast(`Total estimado actualizado: ${formatPrice(total)}`);
  });

  elements.btnPickFile.addEventListener("click", openFilePicker);
  elements.fileInput.addEventListener("change", handleFile);

  elements.fileDrop.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    openFilePicker();
  });

  elements.fileDrop.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    if (event.target !== elements.fileDrop) return;

    event.preventDefault();
    openFilePicker();
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    elements.fileDrop.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.fileDrop.classList.add("is-active");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    elements.fileDrop.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.fileDrop.classList.remove("is-active");
    });
  });

  elements.fileDrop.addEventListener("drop", (event) => {
    const files = event.dataTransfer?.files;
    if (!files?.length) return;

    elements.fileInput.files = files;
    handleFile();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const total = updateTotal(true);
    const formData = Object.fromEntries(new FormData(form).entries());
    elements.resumenBody.innerHTML = buildModalRows(formData, total);

    if (window.bootstrap && elements.resumenModal) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(elements.resumenModal);
      modal.show();
    }
  });
}

/***********************
 *  Contacto
 ***********************/
function initContactForm() {
  const form = document.getElementById("contactForm");

  document.querySelectorAll("[data-contact-text='email']").forEach((element) => {
    element.textContent = CONTACT_CONFIG.email;
  });

  document.querySelectorAll("[data-contact-text='whatsapp']").forEach((element) => {
    element.textContent = CONTACT_CONFIG.whatsappDisplay;
  });

  document.querySelectorAll("[data-contact-text='phone']").forEach((element) => {
    element.textContent = CONTACT_CONFIG.phoneDisplay;
  });

  document.querySelectorAll("[data-contact-link='email']").forEach((link) => {
    link.href = `mailto:${CONTACT_CONFIG.email}`;
  });

  document.querySelectorAll("[data-contact-link='whatsapp']").forEach((link) => {
    link.href = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}`;
  });

  document.querySelectorAll("[data-contact-link='phone']").forEach((link) => {
    link.href = `tel:${CONTACT_CONFIG.phoneHref}`;
  });

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    const subject = data.asunto || "Contacto Liquid Colors";
    const message = buildContactMessage(data);
    const channel = data.canal || "whatsapp";

    if (channel === "whatsapp") {
      window.open(`https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
      toast("Abrimos WhatsApp con tu mensaje preparado.");
      return;
    }

    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    if (channel === "phone") {
      window.location.href = mailtoUrl;
      toast("Abrimos correo solicitando llamada al teléfono indicado.");
      return;
    }

    window.location.href = mailtoUrl;
    toast("Abrimos tu correo con el mensaje preparado.");
  });
}
