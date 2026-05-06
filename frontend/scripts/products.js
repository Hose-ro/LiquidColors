/* =======================
   Catálogo demo
======================= */
const ALL_PRODUCTS = [
  {
    id: 101,
    cat: "camisetas",
    titulo: "Camiseta Básica Algodón",
    descripcion: "Opción accesible para eventos, uniformes y producciones promocionales por volumen.",
    precio: 14.99,
    rating: 4.7,
    reviews: 98,
    img: "https://images.unsplash.com/photo-1520975933918-2002eab5fd2e?q=80&w=1600&auto=format&fit=crop",
    badge: "Nuevo",
    tag: "Textil"
  },
  {
    id: 102,
    cat: "camisetas",
    titulo: "Camiseta Algodón Peinado",
    descripcion: "Tela de mayor gramaje para merch premium, retail y pedidos recurrentes.",
    precio: 24.99,
    rating: 4.8,
    reviews: 124,
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop",
    viejo: 34.99,
    badge: "Bestseller",
    tag: "Algodón"
  },
  {
    id: 103,
    cat: "camisetas",
    titulo: "Camiseta Dri-Fit Deportiva",
    descripcion: "Pensada para equipos, gimnasios y proyectos con uso más intensivo.",
    precio: 19.5,
    rating: 4.6,
    reviews: 76,
    img: "https://images.unsplash.com/photo-1520975922033-2952e80f0e9b?q=80&w=1600&auto=format&fit=crop",
    tag: "Deportiva"
  },
  {
    id: 104,
    cat: "camisetas",
    titulo: "Camiseta Oversize Street",
    descripcion: "Formato amplio con caída relajada para colecciones urbanas y drops pequeños.",
    precio: 26.5,
    rating: 4.9,
    reviews: 61,
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1600&auto=format&fit=crop",
    badge: "Nuevo",
    tag: "Oversize"
  },
  {
    id: 105,
    cat: "camisetas",
    titulo: "Playera Manga Larga Soft",
    descripcion: "Alternativa para climas templados, kits corporativos y tiendas de temporada.",
    precio: 22.75,
    rating: 4.5,
    reviews: 42,
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    tag: "Manga larga"
  },
  {
    id: 106,
    cat: "camisetas",
    titulo: "Polo Corporativa Sublimada",
    descripcion: "Modelo más formal para uniformes, atención a cliente y presentaciones de marca.",
    precio: 28.9,
    rating: 4.7,
    reviews: 53,
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1600&auto=format&fit=crop",
    badge: "Oferta",
    tag: "Corporativa"
  },
  {
    id: 107,
    cat: "camisetas",
    titulo: "Camiseta Infantil Full Color",
    descripcion: "Talla junior para regalos, eventos escolares y producciones familiares.",
    precio: 16.4,
    rating: 4.5,
    reviews: 28,
    img: "",
    tag: "Infantil"
  },
  {
    id: 108,
    cat: "camisetas",
    titulo: "Tank Top Fitness",
    descripcion: "Formato sin mangas para gimnasios, carreras y activaciones deportivas.",
    precio: 18.8,
    rating: 4.6,
    reviews: 34,
    img: "",
    badge: "Nuevo",
    tag: "Sin mangas"
  },
  {
    id: 201,
    cat: "tazas",
    titulo: "Taza Térmica Personalizada",
    descripcion: "Formato ideal para regalo, oficina y promociones con mejor percepción de valor.",
    precio: 15.99,
    rating: 4.9,
    reviews: 89,
    img: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1600&auto=format&fit=crop",
    badge: "Nuevo",
    tag: "Regalo"
  },
  {
    id: 202,
    cat: "tazas",
    titulo: "Taza Blanca Sublimación",
    descripcion: "Formato clásico para personalización limpia, producción rápida y buena rotación.",
    precio: 9.5,
    rating: 4.5,
    reviews: 62,
    img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1600&auto=format&fit=crop",
    tag: "Clásica"
  },
  {
    id: 203,
    cat: "tazas",
    titulo: "Taza Color Interior",
    descripcion: "Variante con contraste de color pensada para branding más expresivo.",
    precio: 10.99,
    rating: 4.6,
    reviews: 44,
    img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1600&auto=format&fit=crop",
    tag: "Color"
  },
  {
    id: 204,
    cat: "tazas",
    titulo: "Taza Asa Corazón",
    descripcion: "Diseñada para colecciones románticas, fechas especiales y regalos personalizados.",
    precio: 12.5,
    rating: 4.8,
    reviews: 57,
    img: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=1600&auto=format&fit=crop",
    badge: "Bestseller",
    tag: "Especial"
  },
  {
    id: 205,
    cat: "tazas",
    titulo: "Taza Peltre Vintage",
    descripcion: "Opción con look retro para outdoor, regalos de marca y líneas de nicho.",
    precio: 14.25,
    rating: 4.4,
    reviews: 27,
    img: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?q=80&w=1600&auto=format&fit=crop",
    tag: "Vintage"
  },
  {
    id: 206,
    cat: "tazas",
    titulo: "Mug Latte Alto",
    descripcion: "Más alto que el formato regular, útil para cafeterías, oficinas y paquetes premium.",
    precio: 13.9,
    rating: 4.6,
    reviews: 35,
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop",
    badge: "Oferta",
    tag: "Latte"
  },
  {
    id: 207,
    cat: "tazas",
    titulo: "Taza Cónica Premium",
    descripcion: "Silueta más estilizada para colecciones de cafetería y líneas de regalo.",
    precio: 16.2,
    rating: 4.7,
    reviews: 26,
    img: "",
    tag: "Cónica"
  },
  {
    id: 208,
    cat: "tazas",
    titulo: "Travel Mug Office",
    descripcion: "Vaso con tapa para oficina, movilidad y kits corporativos de mayor ticket.",
    precio: 18.6,
    rating: 4.8,
    reviews: 39,
    img: "",
    badge: "Nuevo",
    tag: "Travel"
  },
  {
    id: 301,
    cat: "fundas",
    titulo: "Funda Rígida para iPhone",
    descripcion: "Acabado firme para tienda, regalo y pedidos personalizados por modelo.",
    precio: 18.99,
    rating: 4.7,
    reviews: 156,
    img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12?q=80&w=1600&auto=format&fit=crop",
    viejo: 25.99,
    badge: "Oferta",
    tag: "iPhone"
  },
  {
    id: 302,
    cat: "fundas",
    titulo: "Funda TPU Android",
    descripcion: "Alternativa funcional para pedidos diarios y catálogos compatibles con Android.",
    precio: 12.99,
    rating: 4.4,
    reviews: 38,
    img: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1600&auto=format&fit=crop",
    tag: "Android"
  },
  {
    id: 303,
    cat: "fundas",
    titulo: "Funda MagSafe Premium",
    descripcion: "Pensada para gamas altas y clientes que buscan compatibilidad con accesorios.",
    precio: 24.5,
    rating: 4.8,
    reviews: 49,
    img: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1600&auto=format&fit=crop",
    badge: "Nuevo",
    tag: "MagSafe"
  },
  {
    id: 304,
    cat: "fundas",
    titulo: "Case Acrílico Transparente",
    descripcion: "Base clara para diseños minimalistas, logos y fotografías a una cara.",
    precio: 16.75,
    rating: 4.5,
    reviews: 29,
    img: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1600&auto=format&fit=crop",
    tag: "Transparente"
  },
  {
    id: 305,
    cat: "fundas",
    titulo: "Funda Antigolpes Full Print",
    descripcion: "Mayor protección y cobertura completa para diseños más envolventes.",
    precio: 21.25,
    rating: 4.6,
    reviews: 63,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
    badge: "Bestseller",
    tag: "Antigolpes"
  },
  {
    id: 306,
    cat: "fundas",
    titulo: "Glitter Case Personalizada",
    descripcion: "Acabado con brillo para líneas juveniles, regalos y colecciones de temporada.",
    precio: 19.8,
    rating: 4.3,
    reviews: 18,
    img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1600&auto=format&fit=crop",
    tag: "Glitter"
  },
  {
    id: 307,
    cat: "fundas",
    titulo: "Funda Wallet Personalizada",
    descripcion: "Con tapa frontal para usuarios que buscan protección extra y espacio para tarjetas.",
    precio: 23.4,
    rating: 4.5,
    reviews: 22,
    img: "",
    tag: "Wallet"
  },
  {
    id: 308,
    cat: "fundas",
    titulo: "Case Soft Touch Mate",
    descripcion: "Acabado suave y visual más sobrio para líneas premium y corporativas.",
    precio: 20.9,
    rating: 4.7,
    reviews: 31,
    img: "",
    badge: "Nuevo",
    tag: "Soft touch"
  },
  {
    id: 401,
    cat: "bolsas",
    titulo: "Bolsa Ecológica Personalizada",
    descripcion: "Opción reusable para marcas con enfoque eco y visibilidad recurrente.",
    precio: 12.99,
    rating: 4.6,
    reviews: 78,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop",
    badge: "Eco",
    tag: "Eco"
  },
  {
    id: 402,
    cat: "bolsas",
    titulo: "Bolsa Tote Grande",
    descripcion: "Formato amplio para regalos corporativos, merch y retail ligero.",
    precio: 14.5,
    rating: 4.5,
    reviews: 50,
    img: "https://images.unsplash.com/photo-1520974814325-60f4e96e1c34?q=80&w=1600&auto=format&fit=crop",
    tag: "Tote"
  },
  {
    id: 403,
    cat: "bolsas",
    titulo: "Bolsa de Yute Natural",
    descripcion: "Ideal para boutiques, kits de regalo y tiendas que buscan una textura más orgánica.",
    precio: 16.4,
    rating: 4.7,
    reviews: 32,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
    tag: "Yute"
  },
  {
    id: 404,
    cat: "bolsas",
    titulo: "Morral Deportivo Sublimado",
    descripcion: "Útil para escuelas, equipos y eventos con entregas de volumen mediano.",
    precio: 13.75,
    rating: 4.4,
    reviews: 25,
    img: "https://images.unsplash.com/photo-1514986888952-8cd320577b68?q=80&w=1600&auto=format&fit=crop",
    badge: "Nuevo",
    tag: "Deportivo"
  },
  {
    id: 405,
    cat: "bolsas",
    titulo: "Bolsa Boutique Premium",
    descripcion: "Más estructurada para marcas que quieren una entrega con mejor presencia visual.",
    precio: 19.9,
    rating: 4.8,
    reviews: 36,
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1600&auto=format&fit=crop",
    badge: "Bestseller",
    tag: "Boutique"
  },
  {
    id: 406,
    cat: "bolsas",
    titulo: "Canvas Mini Bag",
    descripcion: "Versión compacta para detalles, regalos pequeños y líneas de impulso.",
    precio: 11.8,
    rating: 4.3,
    reviews: 20,
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop",
    tag: "Mini"
  },
  {
    id: 407,
    cat: "bolsas",
    titulo: "Bolsa Cooler Personalizada",
    descripcion: "Opción térmica para promociones food, picnic y kits de temporada.",
    precio: 17.9,
    rating: 4.6,
    reviews: 24,
    img: "",
    tag: "Cooler"
  },
  {
    id: 408,
    cat: "bolsas",
    titulo: "Shopper Reforzada XL",
    descripcion: "Mayor capacidad para retail, ferias y entregas con más volumen.",
    precio: 18.5,
    rating: 4.7,
    reviews: 27,
    img: "",
    badge: "Oferta",
    tag: "XL"
  },
  {
    id: 501,
    cat: "accesorios",
    titulo: "Llavero Personalizado",
    descripcion: "Pequeño formato para activaciones, recuerdos y paquetes promocionales.",
    precio: 5.5,
    rating: 4.4,
    reviews: 23,
    img: "https://images.unsplash.com/photo-1621262057397-829f7900c71e?q=80&w=1600&auto=format&fit=crop",
    tag: "Promo"
  },
  {
    id: 502,
    cat: "accesorios",
    titulo: "Mouse Pad Sublimado",
    descripcion: "Pieza práctica para oficinas, regalos tecnológicos y kits de bienvenida.",
    precio: 6.99,
    rating: 4.3,
    reviews: 18,
    img: "https://images.unsplash.com/photo-1557825835-70d97c4aa1d7?q=80&w=1600&auto=format&fit=crop",
    tag: "Oficina"
  },
  {
    id: 503,
    cat: "accesorios",
    titulo: "Rompecabezas Personalizado",
    descripcion: "Formato lúdico para regalos familiares, recuerdos y campañas creativas.",
    precio: 8.9,
    rating: 4.7,
    reviews: 31,
    img: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?q=80&w=1600&auto=format&fit=crop",
    badge: "Nuevo",
    tag: "Regalo"
  },
  {
    id: 504,
    cat: "accesorios",
    titulo: "Termo 20oz Personalizado",
    descripcion: "Producto con mayor ticket para oficina, gifting y marcas con uso diario.",
    precio: 21.5,
    rating: 4.8,
    reviews: 41,
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1600&auto=format&fit=crop",
    badge: "Bestseller",
    tag: "Termo"
  },
  {
    id: 505,
    cat: "accesorios",
    titulo: "Portagafete Full Color",
    descripcion: "Ideal para credenciales, eventos corporativos y producción institucional.",
    precio: 4.8,
    rating: 4.2,
    reviews: 16,
    img: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1600&auto=format&fit=crop",
    tag: "Evento"
  },
  {
    id: 506,
    cat: "accesorios",
    titulo: "Libreta Tapa Dura",
    descripcion: "Complemento atractivo para kits, lanzamientos y entregas de marca más completas.",
    precio: 9.75,
    rating: 4.5,
    reviews: 22,
    img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1600&auto=format&fit=crop",
    tag: "Papelería"
  },
  {
    id: 507,
    cat: "accesorios",
    titulo: "Posavasos Cerámico",
    descripcion: "Pieza pequeña para cafeterías, home office y regalos corporativos accesibles.",
    precio: 5.9,
    rating: 4.4,
    reviews: 19,
    img: "",
    tag: "Hogar"
  },
  {
    id: 508,
    cat: "accesorios",
    titulo: "Desk Plate Personalizada",
    descripcion: "Identificador de escritorio para oficinas, recepciones y regalos ejecutivos.",
    precio: 12.3,
    rating: 4.6,
    reviews: 15,
    img: "",
    badge: "Nuevo",
    tag: "Escritorio"
  }
];

/* =======================
   Config
======================= */
const CATEGORY_ORDER = ["camisetas", "tazas", "fundas", "bolsas", "accesorios"];
const CATEGORY_LABELS = {
  all: "todo el catálogo",
  camisetas: "camisetas",
  tazas: "tazas",
  fundas: "fundas",
  bolsas: "bolsas",
  accesorios: "accesorios"
};
const CART_STORAGE_KEY = "liquid-colors-cart-v1";
const DIRECT_ORDER_STORAGE_KEY = "liquid-colors-direct-order-v1";
const LIMIT_INIT = 4;
const LIMIT_STEP = 4;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const badgeToneMap = {
  Bestseller: "is-bestseller",
  Nuevo: "is-new",
  Oferta: "is-sale",
  Eco: "is-eco"
};

const state = {
  search: "",
  sort: "relevancia",
  activePill: "all",
  limits: Object.fromEntries(CATEGORY_ORDER.map((cat) => [cat, LIMIT_INIT])),
  cart: []
};

const elements = {
  cartBadge: document.getElementById("cartBadge"),
  cartPanelCount: document.getElementById("cartPanelCount"),
  cartUniqueCount: document.getElementById("cartUniqueCount"),
  cartList: document.getElementById("cartList"),
  cartEmptyState: document.getElementById("cartEmptyState"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  cartCanvas: document.getElementById("shoppingCart"),
  heroProductCount: document.getElementById("heroProductCount"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  resultCount: document.getElementById("resultsCount"),
  resultsMeta: document.getElementById("resultsMeta"),
  clearFilters: document.getElementById("clearFilters"),
  emptyState: document.getElementById("emptyState"),
  pills: Array.from(document.querySelectorAll(".filter-pill")),
  moreButtons: Array.from(document.querySelectorAll("[data-more]")),
  sections: Object.fromEntries(CATEGORY_ORDER.map((cat) => [cat, document.getElementById(`sec-${cat}`)])),
  grids: Object.fromEntries(CATEGORY_ORDER.map((cat) => [cat, document.getElementById(`grid-${cat}`)])),
  sectionCounts: Object.fromEntries(CATEGORY_ORDER.map((cat) => [cat, document.querySelector(`[data-count-label="${cat}"]`)]))
};

let revealObserver = null;
let cartCanvas = null;

document.addEventListener("DOMContentLoaded", () => {
  initHeroMeta();
  restoreCart();
  applyInitialCategoryFromUrl();
  initNavbar();
  initRevealObserver();
  initControls();
  initCart();
  renderAllSections();
  renderCart();
  syncCartBadge();
  openCartFromHash();
  scrollToInitialCategory();
});

/* =======================
   Utils
======================= */
function prefersReducedMotion() {
  return reducedMotionQuery.matches;
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

function fmtPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function buildCardStars(rating) {
  const r = Number(rating) || 0;
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<i class="bi bi-star-fill" aria-hidden="true"></i>'.repeat(full) +
    (half ? '<i class="bi bi-star-half" aria-hidden="true"></i>' : '') +
    '<i class="bi bi-star" aria-hidden="true"></i>'.repeat(empty)
  );
}

function escapeXML(value = "") {
  return String(value).replace(/[&<>"']/g, (match) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    };

    return entities[match] || match;
  });
}

function splitTitleLines(title, maxChars = 18) {
  const words = String(title || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= maxChars || !current) {
      current = next;
      return;
    }

    lines.push(current);
    current = word;
  });

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, 2);
}

function getProductVisualTheme(product) {
  const title = String(product.titulo || "").toLowerCase();
  const themes = {
    camisetas: {
      start: "#6d28d9",
      end: "#db2777",
      chip: "TEXTIL",
      icon: `
        <path d="M292 126h216l54 48-38 56-52-30v186H236V200l-52 30-38-56 54-48z" fill="#f8fafc"/>
        <path d="M326 126c8 30 26 45 74 45s66-15 74-45" fill="none" stroke="#cbd5e1" stroke-width="16" stroke-linecap="round"/>
      `
    },
    tazas: {
      start: "#2563eb",
      end: "#8b5cf6",
      chip: "MUG",
      icon: `
        <rect x="234" y="164" width="228" height="174" rx="28" fill="#f8fafc"/>
        <path d="M462 204h46c42 0 68 23 68 58s-26 58-68 58h-46" fill="none" stroke="#f8fafc" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M270 138c14 18 14 34 0 52M326 138c14 18 14 34 0 52M382 138c14 18 14 34 0 52" fill="none" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
      `
    },
    fundas: {
      start: "#0891b2",
      end: "#2563eb",
      chip: "CASE",
      icon: `
        <rect x="252" y="94" width="216" height="352" rx="42" fill="#f8fafc"/>
        <circle cx="310" cy="148" r="16" fill="#cbd5e1"/>
        <circle cx="360" cy="148" r="16" fill="#cbd5e1"/>
        <rect x="308" y="398" width="104" height="12" rx="6" fill="#cbd5e1"/>
      `
    },
    bolsas: {
      start: "#059669",
      end: "#7c3aed",
      chip: "BAG",
      icon: `
        <path d="M248 186h224c24 0 44 20 44 44v154c0 24-20 44-44 44H248c-24 0-44-20-44-44V230c0-24 20-44 44-44z" fill="#f8fafc"/>
        <path d="M290 188v-30c0-38 31-69 69-69h2c38 0 69 31 69 69v30" fill="none" stroke="#f8fafc" stroke-width="22" stroke-linecap="round"/>
      `
    },
    accesorios: {
      start: "#d97706",
      end: "#db2777",
      chip: "EXTRA",
      icon: `
        <rect x="228" y="158" width="264" height="198" rx="34" fill="#f8fafc"/>
        <circle cx="300" cy="224" r="24" fill="#cbd5e1"/>
        <path d="M346 214h92M346 248h72M262 306h176" fill="none" stroke="#cbd5e1" stroke-width="18" stroke-linecap="round"/>
      `
    }
  };

  if (product.cat === "accesorios") {
    if (title.includes("termo")) {
      return {
        start: "#0f766e",
        end: "#1d4ed8",
        chip: "TERMO",
        icon: `
          <rect x="318" y="108" width="84" height="272" rx="26" fill="#f8fafc"/>
          <rect x="332" y="78" width="56" height="42" rx="16" fill="#cbd5e1"/>
          <rect x="334" y="192" width="52" height="14" rx="7" fill="#cbd5e1"/>
        `
      };
    }

    if (title.includes("libreta")) {
      return {
        start: "#7c3aed",
        end: "#2563eb",
        chip: "NOTAS",
        icon: `
          <rect x="258" y="112" width="224" height="300" rx="28" fill="#f8fafc"/>
          <path d="M310 168h118M310 220h118M310 272h118M310 324h88" fill="none" stroke="#cbd5e1" stroke-width="18" stroke-linecap="round"/>
          <rect x="276" y="112" width="24" height="300" rx="12" fill="#cbd5e1"/>
        `
      };
    }

    if (title.includes("llavero")) {
      return {
        start: "#ea580c",
        end: "#db2777",
        chip: "KEY",
        icon: `
          <circle cx="314" cy="208" r="54" fill="none" stroke="#f8fafc" stroke-width="24"/>
          <path d="M362 246l106 106M420 300h66M402 318h42" fill="none" stroke="#f8fafc" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
        `
      };
    }

    if (title.includes("mouse")) {
      return {
        start: "#1d4ed8",
        end: "#8b5cf6",
        chip: "DESK",
        icon: `
          <rect x="184" y="264" width="372" height="112" rx="30" fill="#f8fafc"/>
          <rect x="328" y="144" width="112" height="152" rx="56" fill="#cbd5e1"/>
          <path d="M384 170v44" fill="none" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
        `
      };
    }

    if (title.includes("rompecabezas")) {
      return {
        start: "#7c3aed",
        end: "#db2777",
        chip: "PUZZLE",
        icon: `
          <path d="M262 148h92c0 24 16 40 38 40s38-16 38-40h108v92c-24 0-40 16-40 38s16 38 40 38v96H444c0-24-16-40-38-40s-38 16-38 40H262V304c24 0 40-16 40-38s-16-38-40-38z" fill="#f8fafc"/>
        `
      };
    }

    if (title.includes("portagafete")) {
      return {
        start: "#0f766e",
        end: "#0891b2",
        chip: "ID",
        icon: `
          <rect x="250" y="124" width="232" height="288" rx="30" fill="#f8fafc"/>
          <circle cx="324" cy="220" r="28" fill="#cbd5e1"/>
          <path d="M370 206h58M370 236h48M294 300h144M294 340h114" fill="none" stroke="#cbd5e1" stroke-width="18" stroke-linecap="round"/>
          <path d="M366 124v-24c0-28 22-50 50-50h22" fill="none" stroke="#f8fafc" stroke-width="18" stroke-linecap="round"/>
        `
      };
    }

    if (title.includes("posavasos")) {
      return {
        start: "#b45309",
        end: "#db2777",
        chip: "HOME",
        icon: `
          <circle cx="400" cy="258" r="118" fill="#f8fafc"/>
          <circle cx="400" cy="258" r="78" fill="#cbd5e1"/>
          <path d="M286 258h228M400 144v228" fill="none" stroke="#f8fafc" stroke-width="18" stroke-linecap="round"/>
        `
      };
    }

    if (title.includes("desk plate") || title.includes("escritorio")) {
      return {
        start: "#0f766e",
        end: "#2563eb",
        chip: "DESK",
        icon: `
          <rect x="228" y="178" width="344" height="126" rx="20" fill="#f8fafc"/>
          <path d="M274 350h252M316 304l-28 46M484 304l28 46" fill="none" stroke="#f8fafc" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M274 218h192M274 252h156" fill="none" stroke="#cbd5e1" stroke-width="18" stroke-linecap="round"/>
        `
      };
    }
  }

  return themes[product.cat] || themes.accesorios;
}

function getProductImageSrc(product) {
  const theme = getProductVisualTheme(product);
  const lines = splitTitleLines(product.titulo, 18);
  const safeTag = escapeXML(product.tag || "Producto");
  const lineMarkup = lines
    .map(
      (line, index) =>
        `<text x="78" y="${420 + index * 34}" fill="#f8fafc" font-size="26" font-weight="700" font-family="Poppins, Arial, sans-serif">${escapeXML(line)}</text>`
    )
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" role="img" aria-label="${escapeXML(product.titulo)}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${theme.start}" />
          <stop offset="100%" stop-color="${theme.end}" />
        </linearGradient>
      </defs>
      <rect width="800" height="560" rx="34" fill="url(#bg)" />
      <circle cx="690" cy="108" r="126" fill="rgba(255,255,255,0.08)" />
      <circle cx="122" cy="494" r="132" fill="rgba(255,255,255,0.06)" />
      <g transform="translate(0 0)">${theme.icon}</g>
      <rect x="76" y="74" width="124" height="38" rx="19" fill="rgba(255,255,255,0.16)" />
      <text x="138" y="99" text-anchor="middle" fill="#f8fafc" font-size="16" font-weight="700" font-family="Poppins, Arial, sans-serif">${escapeXML(theme.chip)}</text>
      <rect x="76" y="130" width="132" height="34" rx="17" fill="rgba(15,18,34,0.22)" stroke="rgba(255,255,255,0.18)" />
      <text x="142" y="152" text-anchor="middle" fill="#f8fafc" font-size="15" font-weight="600" font-family="Poppins, Arial, sans-serif">${safeTag}</text>
      ${lineMarkup}
      <text x="78" y="500" fill="rgba(248,250,252,0.88)" font-size="15" font-weight="500" font-family="Poppins, Arial, sans-serif">Liquid Colors</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
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

function getProductById(productId) {
  return ALL_PRODUCTS.find((product) => String(product.id) === String(productId)) || null;
}

function createCartItem(product) {
  return {
    id: String(product.id),
    titulo: product.titulo,
    precio: Number(product.precio) || 0,
    img: getProductImageSrc(product),
    tag: product.tag || "Producto",
    cat: product.cat || "general",
    qty: 1
  };
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

function buyNow(product) {
  writeDirectOrderSelection(product);
  window.location.href = "./order.html";
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

function writeCartStorage() {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  } catch (error) {
    console.warn("Cart storage unavailable:", error);
  }
}

function getCartItemCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.precio * item.qty, 0);
}

function bumpCartBadge() {
  if (!elements.cartBadge) return;
  elements.cartBadge.classList.remove("is-bump");
  void elements.cartBadge.offsetWidth;
  elements.cartBadge.classList.add("is-bump");
}

/* =======================
   Navbar
======================= */
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

/* =======================
   Reveal
======================= */
function initRevealObserver() {
  const revealElements = document.querySelectorAll("[data-reveal]");

  if (!revealElements.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  observeRevealElements(revealElements);
}

function observeRevealElements(elementsToObserve) {
  Array.from(elementsToObserve || []).forEach((element) => {
    if (element.dataset.revealBound === "true") return;

    element.dataset.revealBound = "true";

    if (prefersReducedMotion() || !revealObserver) {
      element.classList.add("is-visible");
      return;
    }

    revealObserver.observe(element);
  });
}

/* =======================
   Cards
======================= */
function productCard(product, index) {
  const badgeClass = badgeToneMap[product.badge] || "";
  const delay = (index % 4) * 0.05;

  return `
    <div class="col-12 col-sm-6 col-xl-3 catalog-card-slot">
      <article class="product-card position-relative" data-reveal="up" style="--reveal-delay: ${delay}s">
        <div class="product-media">
          ${product.badge ? `<span class="badge-soft ${badgeClass}">${escapeHTML(product.badge)}</span>` : ""}
          <button class="wishlist border-0" aria-label="Agregar ${escapeHTML(product.titulo)} a favoritos" aria-pressed="false" data-id="${product.id}">
            <i class="bi bi-heart" aria-hidden="true"></i>
          </button>
          <img class="product-cover" src="${getProductImageSrc(product)}" alt="${escapeHTML(product.titulo)}" loading="lazy" decoding="async" />
        </div>

        <div class="product-body">
          <div class="product-topline">
            <span class="product-tag">${escapeHTML(product.tag || product.cat)}</span>
            <span class="product-rating" aria-label="${(product.rating ?? 4.5).toFixed(1)} de 5 estrellas, ${product.reviews ?? 0} reseñas">
              <span class="product-rating-stars">${buildCardStars(product.rating ?? 4.5)}</span>
              <span class="product-rating-copy">${(product.rating ?? 4.5).toFixed(1)}</span>
              <span class="product-rating-reviews">(${product.reviews ?? 0})</span>
            </span>
          </div>

          <h3 class="product-title">${escapeHTML(product.titulo)}</h3>
          <p class="product-description">${escapeHTML(product.descripcion || "Producto personalizable con sublimación y acabados duraderos.")}</p>

          <div class="product-price-row">
            <span class="product-price">${fmtPrice(product.precio)}</span>
            ${product.viejo ? `<span class="product-old">${fmtPrice(product.viejo)}</span>` : ""}
          </div>

          <div class="product-meta">Ideal para pedidos personalizados y producción sobre demanda.</div>

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
          <div class="product-reviews-link">
            <button type="button" class="btn-reviews-open" data-id="${product.id}" data-titulo="${escapeHTML(product.titulo)}" aria-label="Ver reseñas de ${escapeHTML(product.titulo)}">
              <i class="bi bi-star-half" aria-hidden="true"></i>
              Ver reseñas y opinar
            </button>
          </div>
        </div>
      </article>
    </div>
  `;
}

function bindProductActions(root) {
  root.querySelectorAll(".buy-now").forEach((button) => {
    button.addEventListener("click", () => {
      const product = getProductById(button.dataset.id);
      if (!product) return;

      buyNow(product);
    });
  });

  root.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const product = getProductById(button.dataset.id);
      if (!product) return;

      addToCart(product);
    });
  });

  root.querySelectorAll(".btn-reviews-open").forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof abrirModalResenas === "function") {
        abrirModalResenas(button.dataset.id, button.dataset.titulo);
      }
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
  const images = root.querySelectorAll(".product-cover");

  images.forEach((image) => {
    const card = image.closest(".product-card");
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

/* =======================
   Render catálogo
======================= */
function initHeroMeta() {
  if (elements.heroProductCount) {
    elements.heroProductCount.textContent = String(ALL_PRODUCTS.length);
  }
}

function resetLimits() {
  CATEGORY_ORDER.forEach((cat) => {
    state.limits[cat] = LIMIT_INIT;
  });
}

function filterAndSort(products, category) {
  let output = products.filter((product) => product.cat === category);

  if (state.search.trim()) {
    const query = state.search.trim().toLowerCase();
    output = output.filter((product) =>
      [product.titulo, product.descripcion, product.tag, product.cat].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }

  switch (state.sort) {
    case "precio_asc":
      output.sort((a, b) => a.precio - b.precio);
      break;
    case "precio_desc":
      output.sort((a, b) => b.precio - a.precio);
      break;
    case "rating_desc":
      output.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    default:
      break;
  }

  return output;
}

function renderCategory(category) {
  const section = elements.sections[category];
  const grid = elements.grids[category];
  const countLabel = elements.sectionCounts[category];
  const moreButton = document.querySelector(`[data-more="${category}"]`);

  if (!section || !grid) return 0;

  const filtered = filterAndSort(ALL_PRODUCTS, category);
  const shouldShowSection = state.activePill === "all" || state.activePill === category;
  const visibleItems = filtered.slice(0, state.limits[category]);
  const isEmpty = filtered.length === 0;

  section.classList.toggle("is-hidden", !shouldShowSection || isEmpty);

  if (!shouldShowSection) return 0;

  if (isEmpty) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="product-empty-card">
          No hay productos que coincidan en esta categoría con la búsqueda actual.
        </div>
      </div>
    `;
  } else {
    grid.innerHTML = visibleItems.map((product, index) => productCard(product, index)).join("");
    bindProductActions(grid);
    initImageFallbacks(grid);
    observeRevealElements(grid.querySelectorAll("[data-reveal]"));
  }

  if (countLabel) {
    countLabel.textContent = `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`;
  }

  if (moreButton) {
    if (filtered.length > state.limits[category]) {
      const remaining = filtered.length - state.limits[category];
      moreButton.disabled = false;
      moreButton.hidden = false;
      moreButton.textContent = `Ver más (${remaining})`;
    } else if (filtered.length > 0) {
      moreButton.disabled = true;
      moreButton.hidden = false;
      moreButton.textContent = "Todo visto";
    } else {
      moreButton.disabled = true;
      moreButton.hidden = true;
    }
  }

  return shouldShowSection ? filtered.length : 0;
}

function updateSummary(totalResults, visibleSections) {
  if (elements.resultCount) {
    elements.resultCount.textContent = `${totalResults} producto${totalResults === 1 ? "" : "s"}`;
  }

  if (elements.resultsMeta) {
    const parts = [];

    if (state.activePill === "all") {
      parts.push("Mostrando todo el catálogo");
    } else {
      parts.push(`Filtrado por ${CATEGORY_LABELS[state.activePill] || state.activePill}`);
    }

    if (state.search.trim()) {
      parts.push(`búsqueda: "${state.search.trim()}"`);
    }

    parts.push(`${visibleSections} categor${visibleSections === 1 ? "ía" : "ías"} visibles`);
    elements.resultsMeta.textContent = parts.join(" · ");
  }

  if (elements.clearFilters) {
    const hasActiveFilters = state.search.trim() || state.activePill !== "all" || state.sort !== "relevancia";
    elements.clearFilters.disabled = !hasActiveFilters;
  }
}

function renderAllSections() {
  let totalResults = 0;
  let visibleSections = 0;

  CATEGORY_ORDER.forEach((category) => {
    const count = renderCategory(category);

    if (count > 0) {
      totalResults += count;
      visibleSections += 1;
    }
  });

  updateSummary(totalResults, visibleSections);
  elements.emptyState?.classList.toggle("d-none", totalResults > 0);
}

/* =======================
   Carrito
======================= */
function restoreCart() {
  state.cart = readCartStorage();
}

function syncCartBadge() {
  if (!elements.cartBadge) return;

  elements.cartBadge.textContent = String(getCartItemCount());
}

function syncCartState() {
  writeCartStorage();
  syncCartBadge();
  renderCart();
}

function addToCart(product) {
  const existingItem = state.cart.find((item) => item.id === String(product.id));

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    state.cart.push(createCartItem(product));
  }

  syncCartState();
  bumpCartBadge();
  toast(`${product.titulo} agregado al carrito`);
}

function updateCartQuantity(itemId, nextQty) {
  const currentItem = state.cart.find((item) => item.id === String(itemId));
  if (!currentItem) return;

  if (nextQty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== String(itemId));
  } else {
    currentItem.qty = nextQty;
  }

  syncCartState();
}

function clearCart() {
  if (!state.cart.length) return;

  state.cart = [];
  syncCartState();
  toast("Carrito vaciado");
}

function bindCartEvents() {
  elements.cartList?.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-cart-action]");
    if (!actionButton) return;

    const itemId = actionButton.dataset.id;
    const action = actionButton.dataset.cartAction;
    const currentItem = state.cart.find((item) => item.id === String(itemId));
    if (!currentItem) return;

    if (action === "increase") {
      updateCartQuantity(itemId, currentItem.qty + 1);
    } else if (action === "decrease") {
      updateCartQuantity(itemId, currentItem.qty - 1);
    } else if (action === "remove") {
      updateCartQuantity(itemId, 0);
    }
  });

  elements.clearCartBtn?.addEventListener("click", clearCart);
}

function renderCart() {
  const itemCount = getCartItemCount();
  const uniqueCount = state.cart.length;
  const subtotal = getCartSubtotal();

  if (elements.cartPanelCount) {
    elements.cartPanelCount.textContent = String(itemCount);
  }

  if (elements.cartUniqueCount) {
    elements.cartUniqueCount.textContent = String(uniqueCount);
  }

  if (elements.cartSubtotal) {
    elements.cartSubtotal.textContent = fmtPrice(subtotal);
  }

  if (elements.clearCartBtn) {
    elements.clearCartBtn.disabled = itemCount === 0;
  }

  if (!elements.cartList || !elements.cartEmptyState) return;

  elements.cartEmptyState.classList.toggle("is-hidden", itemCount > 0);

  if (!itemCount) {
    elements.cartList.innerHTML = "";
    return;
  }

  elements.cartList.innerHTML = state.cart
    .map((item) => {
      const categoryLabel = CATEGORY_LABELS[item.cat] || item.cat;
      const lineTotal = item.precio * item.qty;

      return `
        <article class="cart-item">
          <div class="cart-item-media">
            <img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.titulo)}" loading="lazy" decoding="async" />
          </div>

          <div class="cart-item-body">
            <div class="cart-item-head">
              <h3 class="cart-item-title">${escapeHTML(item.titulo)}</h3>
              <button
                class="cart-remove-btn"
                type="button"
                data-cart-action="remove"
                data-id="${escapeHTML(item.id)}"
                aria-label="Eliminar ${escapeHTML(item.titulo)} del carrito"
              >
                <i class="bi bi-x-lg" aria-hidden="true"></i>
              </button>
            </div>

            <div class="cart-item-meta">
              <span>${escapeHTML(item.tag)}</span>
              <span>${escapeHTML(categoryLabel)}</span>
            </div>

            <div class="cart-item-footer">
              <div class="cart-qty-controls" aria-label="Cantidad de ${escapeHTML(item.titulo)}">
                <button class="cart-qty-btn" type="button" data-cart-action="decrease" data-id="${escapeHTML(item.id)}" aria-label="Reducir cantidad">
                  <i class="bi bi-dash" aria-hidden="true"></i>
                </button>
                <span class="cart-qty-value">${item.qty}</span>
                <button class="cart-qty-btn" type="button" data-cart-action="increase" data-id="${escapeHTML(item.id)}" aria-label="Aumentar cantidad">
                  <i class="bi bi-plus" aria-hidden="true"></i>
                </button>
              </div>

              <strong class="cart-line-price">${fmtPrice(lineTotal)}</strong>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function initCart() {
  if (elements.cartCanvas && window.bootstrap) {
    cartCanvas = window.bootstrap.Offcanvas.getOrCreateInstance(elements.cartCanvas);
  }

  bindCartEvents();
}

function openCartFromHash() {
  if (window.location.hash !== "#shoppingCart" || !cartCanvas) return;

  window.setTimeout(() => {
    cartCanvas.show();
  }, 120);
}

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const queryCategory = params.get("cat");
  const hashCategory = window.location.hash.replace(/^#(?:sec-)?/, "");
  const category = queryCategory || hashCategory;

  if (category === "all") return "all";
  return CATEGORY_ORDER.includes(category) ? category : null;
}

function setActiveCategory(category) {
  state.activePill = category;
  elements.pills.forEach((pill) => pill.classList.toggle("active", (pill.dataset.cat || "all") === category));
}

function applyInitialCategoryFromUrl() {
  const category = getCategoryFromUrl();
  if (!category) return;

  setActiveCategory(category);
}

function scrollToInitialCategory() {
  const category = getCategoryFromUrl();
  if (!category || category === "all") return;

  window.setTimeout(() => {
    elements.sections[category]?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start"
    });
  }, 120);
}

/* =======================
   Controles
======================= */
function initControls() {
  elements.searchInput?.addEventListener("input", (event) => {
    state.search = event.target.value || "";
    resetLimits();
    renderAllSections();
  });

  elements.sortSelect?.addEventListener("change", (event) => {
    state.sort = event.target.value || "relevancia";
    resetLimits();
    renderAllSections();
  });

  elements.clearFilters?.addEventListener("click", () => {
    state.search = "";
    state.sort = "relevancia";
    setActiveCategory("all");
    resetLimits();

    if (elements.searchInput) elements.searchInput.value = "";
    if (elements.sortSelect) elements.sortSelect.value = "relevancia";

    renderAllSections();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });

  elements.pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const nextCategory = pill.dataset.cat || "all";
      setActiveCategory(nextCategory);
      resetLimits();

      renderAllSections();

      if (nextCategory !== "all") {
        elements.sections[nextCategory]?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  elements.moreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.more;
      if (!category) return;

      state.limits[category] += LIMIT_STEP;
      renderCategory(category);
    });
  });
}
