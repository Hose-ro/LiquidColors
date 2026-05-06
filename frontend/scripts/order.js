const CART_STORAGE_KEY = "liquid-colors-cart-v1";
const DIRECT_ORDER_STORAGE_KEY = "liquid-colors-direct-order-v1";
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const paymentRuntimeConfig = window.LIQUID_COLORS_PAYMENT_CONFIG || {};

const PAYMENT_CONFIG = {
  paypal: {
    clientId: String(paymentRuntimeConfig.paypal?.clientId || "").trim(),
    currency: String(paymentRuntimeConfig.paypal?.currency || "MXN").trim()
  },
  mercadopago: {
    publicKey: String(paymentRuntimeConfig.mercadopago?.publicKey || "").trim()
  },
  transferencia: {
    banco: String(paymentRuntimeConfig.transferencia?.banco || "").trim(),
    clabe: String(paymentRuntimeConfig.transferencia?.clabe || "").trim(),
    titular: String(paymentRuntimeConfig.transferencia?.titular || "").trim(),
    concepto: String(paymentRuntimeConfig.transferencia?.concepto || "Pedido Liquid Colors").trim()
  }
};

document.addEventListener("DOMContentLoaded", () => {
  syncCartBadge();
  initNavbar();

  const selectionContext = buildSelectionContext();
  renderSelectionState(selectionContext);
  initOrderForm(selectionContext);
});

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

function sanitizeCartItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      id: String(item.id || "").trim(),
      titulo: String(item.titulo || "Producto personalizado").trim(),
      precio: Number(item.precio) || 0,
      img: String(item.img || "").trim(),
      tag: String(item.tag || "Producto").trim(),
      cat: String(item.cat || "general").trim(),
      qty: Math.max(1, Number(item.qty) || 1)
    }))
    .filter((item) => item.id);
}

function readCartStorage() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return sanitizeCartItems(raw ? JSON.parse(raw) : []);
  } catch (error) {
    console.warn("Cart storage unavailable:", error);
    return [];
  }
}

function getCartCount() {
  return readCartStorage().reduce((sum, item) => sum + item.qty, 0);
}

function syncCartBadge() {
  const cartBadge = document.getElementById("cartBadge");
  if (!cartBadge) return;

  cartBadge.textContent = String(getCartCount());
}

function mapProductValue(category) {
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

function readDirectOrderSelection() {
  try {
    const raw = window.localStorage.getItem(DIRECT_ORDER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (!parsed || typeof parsed !== "object") return null;

    return {
      id: String(parsed.id || "").trim(),
      titulo: String(parsed.titulo || "Producto personalizado").trim(),
      productValue: mapProductValue(parsed.productValue),
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

function buildSelectionContext() {
  const directSelection = readDirectOrderSelection();

  if (directSelection) {
    clearDirectOrderSelection();

    return {
      source: "direct",
      title: directSelection.titulo,
      subtitle: "Trajimos la compra directa para continuar aquí el pedido.",
      productValue: directSelection.productValue,
      qty: directSelection.qty,
      itemCount: 1,
      totalQty: directSelection.qty,
      subtotal: null,
      items: [
        {
          titulo: directSelection.titulo,
          qty: directSelection.qty,
          detail: "Compra directa"
        }
      ],
      notesPrefill: ""
    };
  }

  const cartItems = readCartStorage();
  if (!cartItems.length) return null;

  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const mappedCategories = [...new Set(cartItems.map((item) => mapProductValue(item.cat)))];
  const firstItem = cartItems[0];

  return {
    source: "cart",
    title: cartItems.length === 1 ? firstItem.titulo : `Pedido desde carrito (${cartItems.length} referencias)`,
    subtitle:
      cartItems.length === 1
        ? "Tomamos el producto guardado en el carrito para precargar el pedido."
        : "Trajimos tu preselección del carrito para que confirmes el pedido desde este módulo.",
    productValue: cartItems.length === 1 ? mapProductValue(firstItem.cat) : mappedCategories.length === 1 ? mappedCategories[0] : "otro",
    qty: cartItems.length === 1 ? firstItem.qty : totalQty,
    itemCount: cartItems.length,
    totalQty,
    subtotal: cartItems.reduce((sum, item) => sum + item.precio * item.qty, 0),
    items: cartItems.map((item) => ({
      titulo: item.titulo,
      qty: item.qty,
      detail: item.tag || item.cat || "Producto",
      lineTotal: item.precio * item.qty
    })),
    notesPrefill: `Preselección desde carrito:\n${cartItems.map((item) => `- ${item.titulo} x${item.qty}`).join("\n")}`
  };
}

function renderSelectionState(selection) {
  const root = document.getElementById("selectionState");
  if (!root) return;

  if (!selection) {
    root.innerHTML = `
      <div class="selection-empty">
        <div class="selection-empty-icon"><i class="bi bi-bag" aria-hidden="true"></i></div>
        <div class="selection-empty-copy">
          <strong>Sin preselección activa</strong>
          <span class="text-muted-300">Puedes completar el pedido manualmente o volver al catálogo para elegir productos primero.</span>
        </div>
        <a href="./products.html" class="btn btn-surface">Elegir productos</a>
      </div>
    `;
    return;
  }

  const metricMarkup = [
    `<span class="selection-metric">${selection.itemCount} referencia${selection.itemCount === 1 ? "" : "s"}</span>`,
    `<span class="selection-metric">${selection.totalQty} unidad${selection.totalQty === 1 ? "" : "es"}</span>`,
    selection.subtotal != null ? `<span class="selection-metric">${formatPrice(selection.subtotal)}</span>` : ""
  ]
    .filter(Boolean)
    .join("");

  root.innerHTML = `
    <div class="selection-state-head">
      <span class="section-eyebrow">Preselección activa</span>
      <h2 class="fw-semibold">${escapeHTML(selection.title)}</h2>
      <p class="text-muted-300 mb-0">${escapeHTML(selection.subtitle)}</p>
    </div>

    <div class="selection-state-list">
      ${selection.items
        .map(
          (item) => `
            <article class="selection-item">
              <div class="selection-item-copy">
                <strong>${escapeHTML(item.titulo)}</strong>
                <span>${escapeHTML(item.detail)}</span>
              </div>
              <div class="selection-item-meta">
                ${item.lineTotal != null ? `${item.qty} x ${formatPrice(item.lineTotal / item.qty)}` : `${item.qty} unidad${item.qty === 1 ? "" : "es"}`}
              </div>
            </article>
          `
        )
        .join("")}
    </div>

    <div class="selection-metrics">${metricMarkup}</div>
  `;
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

function toast(message, isError = false) {
  const toastEl = document.createElement("div");
  toastEl.className = "toast-floating" + (isError ? " toast-error" : "");
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  toastEl.innerHTML = `
    <i class="bi bi-${isError ? "exclamation-circle" : "check2-circle"}" aria-hidden="true"></i>
    <span>${escapeHTML(message)}</span>
  `;

  document.body.appendChild(toastEl);
  requestAnimationFrame(() => toastEl.classList.add("is-visible"));

  window.setTimeout(() => {
    toastEl.classList.remove("is-visible");
    window.setTimeout(() => toastEl.remove(), 220);
  }, 2800);
}

function highlightTotal() {
  const totalCard = document.querySelector(".summary-total");
  if (!totalCard) return;

  totalCard.classList.remove("is-highlighted");
  void totalCard.offsetWidth;
  totalCard.classList.add("is-highlighted");
}

// --- PayPal SDK loader (lazy) ---
let paypalSDKPromise = null;

function loadPayPalSDK() {
  if (paypalSDKPromise) return paypalSDKPromise;

  paypalSDKPromise = new Promise((resolve, reject) => {
    if (window.paypal) { resolve(window.paypal); return; }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(PAYMENT_CONFIG.paypal.clientId)}&currency=${PAYMENT_CONFIG.paypal.currency}&intent=capture`;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("PayPal SDK no pudo cargarse"));
    document.head.appendChild(script);
  });

  return paypalSDKPromise;
}

// --- MercadoPago SDK loader (lazy) ---
let mpSDKPromise = null;

function loadMercadoPagoSDK() {
  if (mpSDKPromise) return mpSDKPromise;

  mpSDKPromise = new Promise((resolve, reject) => {
    if (window.MercadoPago) { resolve(window.MercadoPago); return; }

    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => resolve(window.MercadoPago);
    script.onerror = () => reject(new Error("MercadoPago SDK no pudo cargarse"));
    document.head.appendChild(script);
  });

  return mpSDKPromise;
}

function initOrderForm(initialSelection) {
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
    resumenModal: document.getElementById("resumenModal"),
    paymentActionSection: document.getElementById("paymentActionSection"),
    btnConfirmOrder: document.getElementById("btnConfirmOrder")
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
    },
    pago: {
      paypal: "PayPal",
      mercadopago: "Mercado Pago",
      transferencia: "Transferencia bancaria",
      pago_entrega: "Pago al recoger / entregar"
    }
  };

  const PRICE = {
    base: { camiseta: 12, taza: 8, funda: 10, bolsa: 9, otro: 15 },
    tecnica: { sublimacion: 1, vinil: 1.15 },
    envio: { recoger: 0, estandar: 5, express: 12 }
  };

  let previewUrl = "";
  let selectionContext = initialSelection;
  let activePaypalButtons = null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  elements.inpFecha.min = formatDateValue(tomorrow);

  function revokePreviewUrl() {
    if (!previewUrl) return;

    URL.revokeObjectURL(previewUrl);
    previewUrl = "";
  }

  function getSelectedPaymentMethod() {
    const checked = form.querySelector('input[name="metodo_pago"]:checked');
    return checked ? checked.value : null;
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

    if (selectionContext?.title) {
      chips.unshift(`Referencia: ${selectionContext.title}`);
    }

    if (elements.selProducto.value === "camiseta" && !elements.grpTalla.hidden) {
      chips.push(`Talla: ${elements.selTalla.value}`);
    }

    if (elements.inpFecha.value) {
      chips.push(`Fecha: ${elements.inpFecha.value}`);
    }

    const payMethod = getSelectedPaymentMethod();
    if (payMethod) {
      chips.push(`Pago: ${labels.pago[payMethod] || payMethod}`);
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

  function getSelectionDetailMarkup() {
    if (!selectionContext?.items?.length) return "-";

    return selectionContext.items
      .map((item) => `${escapeHTML(item.titulo)} x${item.qty}`)
      .join("<br>");
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
      ...(selectionContext?.items?.length ? [{ label: "Preselección", value: getSelectionDetailMarkup(), allowHTML: true }] : []),
      { label: "Cantidad", value: formData.cantidad || "1" },
      { label: "Técnica", value: labels.tecnica[formData.tecnica] || formData.tecnica || "-" },
      { label: "Envío", value: labels.envio[formData.envio] || formData.envio || "-" },
      { label: "Dirección", value: formData.direccion || "No aplica" },
      { label: "Fecha requerida", value: formData.fecha || "-" },
      { label: "Archivo", value: file ? `${file.name} (${formatFileSize(file.size)})` : "Sin archivo adjunto" },
      { label: "Notas", value: notes, allowHTML: true },
      { label: "Método de pago", value: labels.pago[formData.metodo_pago] || formData.metodo_pago || "-" }
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

  // --- Payment action rendering ---

  function renderPaymentAction(method, total) {
    const section = elements.paymentActionSection;
    if (!section) return;

    section.innerHTML = "";
    activePaypalButtons = null;

    switch (method) {
      case "paypal":
        renderPayPalAction(total, section);
        break;
      case "mercadopago":
        renderMercadoPagoAction(total, section);
        break;
      case "transferencia":
        renderTransferenciaAction(total, section);
        break;
      case "pago_entrega":
        renderPagoEntregaAction(section);
        break;
      default:
        break;
    }
  }

  function renderPayPalAction(total, section) {
    section.innerHTML = `
      <div class="payment-action">
        <p class="payment-action-title">
          <i class="bi bi-paypal me-1" aria-hidden="true"></i>
          Pagar con PayPal
        </p>
        <p class="payment-action-note">Serás redirigido a PayPal para completar el pago de forma segura. Puedes usar tu cuenta PayPal o cualquier tarjeta.</p>
        <div id="paypalButtonContainer" class="payment-btn-container">
          <div class="payment-loading">
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Cargando PayPal…
          </div>
        </div>
      </div>
    `;

    const container = section.querySelector("#paypalButtonContainer");

    if (!PAYMENT_CONFIG.paypal.clientId) {
      container.innerHTML = `
        <div class="payment-error">
          <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
          <span>PayPal no está configurado en este entorno. Elige otro método de pago.</span>
        </div>
      `;
      return;
    }

    loadPayPalSDK()
      .then((paypal) => {
        container.innerHTML = "";

        activePaypalButtons = paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "pay" },
          createOrder(_data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  description: "Pedido Liquid Colors",
                  amount: { value: total.toFixed(2), currency_code: PAYMENT_CONFIG.paypal.currency }
                }
              ]
            });
          },
          onApprove(_data, actions) {
            return actions.order.capture().then((details) => {
              const name = details.payer?.name?.given_name || "Cliente";
              container.innerHTML = `
                <div class="payment-success">
                  <i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i>
                  <div>
                    <strong>¡Pago completado, ${escapeHTML(name)}!</strong>
                    <span>Transacción ID: ${escapeHTML(details.id)}. Te contactaremos para confirmar producción.</span>
                  </div>
                </div>
              `;
              if (elements.btnConfirmOrder) elements.btnConfirmOrder.style.display = "none";
              toast("Pago con PayPal completado exitosamente.");
            });
          },
          onError(err) {
            console.error("PayPal error:", err);
            container.innerHTML = `
              <div class="payment-error">
                <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
                <span>Ocurrió un error con PayPal. Intenta nuevamente o elige otro método de pago.</span>
              </div>
            `;
          },
          onCancel() {
            toast("Pago con PayPal cancelado.", true);
          }
        });

        activePaypalButtons.render("#paypalButtonContainer");
      })
      .catch(() => {
        container.innerHTML = `
          <div class="payment-error">
            <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
            <span>No se pudo cargar PayPal. Verifica tu conexión o elige otro método.</span>
          </div>
        `;
      });
  }

  function renderMercadoPagoAction(total, section) {
    section.innerHTML = `
      <div class="payment-action">
        <p class="payment-action-title">
          <i class="bi bi-credit-card-2-front me-1" aria-hidden="true"></i>
          Pagar con Mercado Pago
        </p>
        <p class="payment-action-note">Acepta tarjetas de crédito/débito, efectivo (OXXO, 7-Eleven), transferencia y saldo Mercado Pago.</p>
        <div id="mpButtonContainer" class="payment-btn-container">
          <div class="payment-loading">
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Cargando Mercado Pago…
          </div>
        </div>
      </div>
    `;

    const container = section.querySelector("#mpButtonContainer");

    if (!PAYMENT_CONFIG.mercadopago.publicKey) {
      renderMercadoPagoFallback(container);
      return;
    }

    loadMercadoPagoSDK()
      .then(() => {
        // Mercado Pago Checkout Pro requires a preference_id generated by the backend.
        // Wire this endpoint to your Laravel controller:
        //   POST /api/mp/preference  →  returns { preference_id: "..." }
        return fetch("/api/mp/preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, currency: "MXN", description: "Pedido Liquid Colors" })
        }).then((res) => {
          if (!res.ok) throw new Error("preference_fetch_failed");
          return res.json();
        });
      })
      .then((data) => {
        if (!data.preference_id) throw new Error("no_preference_id");

        const mp = new window.MercadoPago(PAYMENT_CONFIG.mercadopago.publicKey, { locale: "es-MX" });
        const bricksBuilder = mp.bricks();

        container.innerHTML = `<div id="mpWallet"></div>`;

        bricksBuilder.create("wallet", "mpWallet", {
          initialization: { preferenceId: data.preference_id },
          customization: { texts: { valueProp: "smart_option" } }
        });
      })
      .catch(() => {
        renderMercadoPagoFallback(container);
      });
  }

  function renderMercadoPagoFallback(container) {
    container.innerHTML = `
      <div class="payment-mp-fallback">
        <div class="payment-mp-icon"><i class="bi bi-credit-card-2-front" aria-hidden="true"></i></div>
        <div>
          <strong>Mercado Pago</strong>
          <p class="mb-2">Recibirás un enlace de pago por correo electrónico una vez que confirmemos tu pedido. Podrás pagar con cualquier método disponible en Mercado Pago.</p>
          <div class="payment-mp-methods">
            <span><i class="bi bi-credit-card me-1"></i>Tarjeta</span>
            <span><i class="bi bi-building me-1"></i>OXXO / 7-Eleven</span>
            <span><i class="bi bi-bank me-1"></i>Transferencia</span>
            <span><i class="bi bi-wallet2 me-1"></i>Saldo MP</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderTransferenciaAction(total, section) {
    const cfg = PAYMENT_CONFIG.transferencia;

    if (!cfg.banco || !cfg.clabe || !cfg.titular) {
      section.innerHTML = `
        <div class="payment-action">
          <p class="payment-action-title">
            <i class="bi bi-bank me-1" aria-hidden="true"></i>
            Transferencia bancaria
          </p>
          <div class="payment-error">
            <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
            <span>Los datos bancarios no están configurados en este entorno. Te los enviaremos al confirmar el pedido.</span>
          </div>
        </div>
      `;
      return;
    }

    section.innerHTML = `
      <div class="payment-action">
        <p class="payment-action-title">
          <i class="bi bi-bank me-1" aria-hidden="true"></i>
          Datos para transferencia bancaria
        </p>
        <p class="payment-action-note">Realiza la transferencia por el monto indicado y envíanos el comprobante por correo o WhatsApp para agilizar la producción.</p>
        <div class="bank-details">
          <div class="bank-detail-row">
            <strong>Banco</strong>
            <span>${escapeHTML(cfg.banco)}</span>
          </div>
          <div class="bank-detail-row">
            <strong>CLABE interbancaria</strong>
            <span class="bank-clabe">${escapeHTML(cfg.clabe)}</span>
          </div>
          <div class="bank-detail-row">
            <strong>Titular</strong>
            <span>${escapeHTML(cfg.titular)}</span>
          </div>
          <div class="bank-detail-row">
            <strong>Concepto</strong>
            <span>${escapeHTML(cfg.concepto)}</span>
          </div>
          <div class="bank-detail-row bank-detail-total">
            <strong>Monto a transferir</strong>
            <span class="grad-text fw-bold">${formatPrice(total)}</span>
          </div>
        </div>
        <button type="button" class="btn btn-surface btn-sm mt-3" id="btnCopyClabe">
          <i class="bi bi-copy me-1" aria-hidden="true"></i>
          Copiar CLABE
        </button>
      </div>
    `;

    section.querySelector("#btnCopyClabe")?.addEventListener("click", () => {
      navigator.clipboard.writeText(cfg.clabe.replace(/\s/g, "")).then(() => {
        toast("CLABE copiada al portapapeles.");
      }).catch(() => {
        toast("No se pudo copiar. Copia la CLABE manualmente.", true);
      });
    });
  }

  function renderPagoEntregaAction(section) {
    section.innerHTML = `
      <div class="payment-action">
        <p class="payment-action-title">
          <i class="bi bi-shop me-1" aria-hidden="true"></i>
          Pago al recoger o entregar
        </p>
        <ul class="payment-entrega-list">
          <li><i class="bi bi-check2 me-2 text-success" aria-hidden="true"></i>Acepta efectivo y tarjeta (débito/crédito).</li>
          <li><i class="bi bi-check2 me-2 text-success" aria-hidden="true"></i>Paga al momento de recoger en tienda o al recibir tu pedido.</li>
          <li><i class="bi bi-info-circle me-2" aria-hidden="true"></i>Te confirmaremos fecha y lugar de entrega por correo.</li>
          <li><i class="bi bi-info-circle me-2" aria-hidden="true"></i>Para pedidos express se puede solicitar anticipo del 50 %.</li>
        </ul>
      </div>
    `;
  }

  function syncConfirmButton(method) {
    if (!elements.btnConfirmOrder) return;

    const labels = {
      paypal: "Pagar con PayPal",
      mercadopago: "Ir a Mercado Pago",
      transferencia: "Ya tengo los datos",
      pago_entrega: "Confirmar pedido"
    };

    elements.btnConfirmOrder.innerHTML = `
      <i class="bi bi-bag-check me-2" aria-hidden="true"></i>
      ${escapeHTML(labels[method] || "Confirmar pedido")}
    `;

    // For PayPal we use the SDK buttons; hide the generic confirm button
    elements.btnConfirmOrder.style.display = method === "paypal" ? "none" : "";
  }

  function applySelectionContext(nextSelection, options = {}) {
    if (!nextSelection) return false;

    selectionContext = nextSelection;
    elements.selProducto.value = nextSelection.productValue;
    elements.inpCantidad.value = String(nextSelection.qty);

    if (elements.txtNotas && !elements.txtNotas.value.trim() && nextSelection.notesPrefill) {
      elements.txtNotas.value = nextSelection.notesPrefill;
    }

    toggleTalla();
    syncShippingField();

    const total = updateTotal(options.animate === true);

    if (options.announce !== false) {
      toast(`Pedido listo para continuar: ${nextSelection.title}`);
    }

    return total > 0;
  }

  // --- Init ---
  toggleTalla();
  syncShippingField();
  updateTotal();

  if (selectionContext) {
    applySelectionContext(selectionContext, { animate: true, announce: false });
  }

  [elements.selProducto, elements.selTalla, elements.selTecnica, elements.selEnvio, elements.inpCantidad, elements.inpFecha].forEach(
    (input) => {
      input.addEventListener("input", () => updateTotal());
      input.addEventListener("change", () => {
        toggleTalla();
        syncShippingField();
        updateTotal();
      });
    }
  );

  // Update sidebar chips when payment method changes
  form.querySelectorAll('input[name="metodo_pago"]').forEach((radio) => {
    radio.addEventListener("change", () => renderSummaryChips());
  });

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

  // "Confirm order" button in modal — for non-PayPal methods
  if (elements.btnConfirmOrder) {
    elements.btnConfirmOrder.addEventListener("click", () => {
      const method = getSelectedPaymentMethod();
      if (method === "transferencia" || method === "pago_entrega") {
        toast("Pedido confirmado. Te contactaremos pronto.");
        if (window.bootstrap && elements.resumenModal) {
          window.bootstrap.Modal.getInstance(elements.resumenModal)?.hide();
        }
      } else if (method === "mercadopago") {
        toast("Revisa el módulo de Mercado Pago para completar el pago.");
      }
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const method = getSelectedPaymentMethod();
    const total = updateTotal(true);
    const formData = Object.fromEntries(new FormData(form).entries());

    elements.resumenBody.innerHTML = buildModalRows(formData, total);
    renderPaymentAction(method, total);
    syncConfirmButton(method);

    if (window.bootstrap && elements.resumenModal) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(elements.resumenModal);
      modal.show();
    }
  });
}
