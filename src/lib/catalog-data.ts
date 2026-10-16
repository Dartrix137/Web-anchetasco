// ============================================================
// Ancheta & Co — Datos del catálogo corporativo Navidad 2026
// Fuente: Catálogo Nativity World S.A.S. (precios sin IVA)
// ============================================================

export const IVA_RATE = 0.19;

// WhatsApp corporativo de cotizaciones (punto de venta configurado como empresa)
export const WHATSAPP_NUMBER = "573123888573";

// Costo adicional de personalización por unidad (fuera de la campaña anticipada)
export const PERSONALIZATION_COST = 3500;

// Campaña de personalización anticipada y programada
export const PERSONALIZATION_CAMPAIGN = {
  deadline: "15 de noviembre de 2026",
  deadlineISO: "2026-11-15",
  minUnits: 50,
  note:
    "Estampado o bordado según el maletín seleccionado (algunos modelos solo admiten estampado). " +
    "Compra mínima de 50 unidades. Anticipo confirmado a más tardar el 15 de noviembre de 2026.",
};

export interface CatalogProduct {
  id: string;
  name: string;
  tagline: string;
  price: number;
  category: string;
  format: string;
  dimensions: string;
  /** Galería de fotos del producto (2 a 4). La primera es la principal. */
  images: string[];
  items: string[];
  itemsCount: number;
  specialOrder?: {
    deadline: string;
    minUnits: number;
  };
}

export interface ComboFormat {
  id: string;
  name: string;
  price: number;
  dimensions: string;
  description: string;
  image: string;
}

export interface PackOption {
  id: string;
  name: string;
  price: number;
  itemsCount: number;
  items: string[];
  image: string;
  premium?: boolean;
  special?: {
    minUnits: number;
    deadline: string;
  };
}

// ---------- PRODUCTOS (Combos predefinidos) ----------
export const PRODUCTS: CatalogProduct[] = [
  {
    id: "aguinaldo",
    name: "Aguinaldo",
    tagline: "Nuestro balance perfecto entre tradición y elegancia.",
    price: 98900,
    category: "Ejecutivo",
    format: "Maletín Ejecutivo",
    dimensions: "30 × 15 × 44 cm",
    images: ["/products/aguinaldo.png", "/products/aguinaldo_1.png"],
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Torta Envinada 220 gr",
      "Gomas Bon Bon Bum Colombina 40 gr",
      "Maní Horneado Manitoba 40 gr",
      "Piazza Deleitte Colombina 30 gr",
      "Paliqueso × 3 unidades",
    ],
    itemsCount: 11,
  },
  {
    id: "noche-de-paz",
    name: "Noche de Paz",
    tagline: "El más espacioso, para compartir en familia.",
    price: 88900,
    category: "Deportivo",
    format: "Maletín Deportivo",
    dimensions: "48 × 28 × 24 cm",
    images: ["/products/noche_de_paz.png", "/products/noche_de_paz_1.png"],
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Torta Envinada 220 gr",
      "Gomas Bon Bon Bum Colombina 40 gr",
      "Maní Horneado Manitoba 50 gr",
      "Mermelada La Constancia 200 gr",
      "Paliqueso × 3 unidades",
      "Piazza Deleitte Colombina 30 gr",
    ],
    itemsCount: 12,
  },
  {
    id: "estrella",
    name: "Estrella",
    tagline: "Diseño clásico y atemporal en maletín Legacy.",
    price: 70900,
    category: "Legacy",
    format: "Maletín Legacy",
    dimensions: "31 × 14 × 40 cm",
    images: ["/products/estrella.png", "/products/estrella_1.png"],
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Torta Envinada 220 gr",
      "Gomas Bon Bon Bum Colombina 40 gr",
      "Maní Horneado Manitoba 40 gr",
    ],
    itemsCount: 9,
    specialOrder: { deadline: "1 de noviembre de 2026", minUnits: 80 },
  },
  {
    id: "zagalillos",
    name: "Zagalillos",
    tagline: "Práctica lonchera expandible con lo mejor de la tradición.",
    price: 66900,
    category: "Lonchera",
    format: "Lonchera Expandible",
    dimensions: "23 × 21 × 14 cm",
    images: ["/products/zagalillos.png", "/products/zagalillos_1.png"],
    items: [
      "Vino de Manzana 750 ml",
      "Torta Envinada 220 gr",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Gomas Bon Bon Bum Colombina 40 gr",
      "Maní Horneado Manitoba 40 gr",
      "Salsa de Tomate La Constancia 120 gr",
      "Mayonesa La Constancia 120 gr",
    ],
    itemsCount: 11,
  },
  {
    id: "noche-buena",
    name: "Noche Buena",
    tagline: "Nuestra versión más completa y generosa.",
    price: 119900,
    category: "Gerencial",
    format: "Maletín Gerencial",
    dimensions: "29 × 12 × 41 cm",
    images: ["/products/noche_buena.png", "/products/noche_buena_1.png"],
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Torta Envinada 220 gr",
      "Gomas Bon Bon Bum Colombina 40 gr",
      "Maní Horneado Manitoba 40 gr",
      "Mermelada La Constancia 200 gr",
      "Salsa de Tomate La Constancia 120 gr",
      "Mayonesa La Constancia 120 gr",
      "Piazza Deleitte Colombina 30 gr",
      "Paliqueso × 3 unidades",
    ],
    itemsCount: 14,
  },
  {
    id: "reyes-magos",
    name: "Reyes Magos",
    tagline: "El maletín urbano ideal para llevar a todas partes.",
    price: 75900,
    category: "Urbano",
    format: "Maletín Urbano",
    dimensions: "33 × 19 × 51 cm",
    images: ["/products/reyes_magos.png", "/products/reyes_magos_1.png"],
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Torta Envinada 220 gr",
      "Gomas Bon Bon Bum Colombina 40 gr",
      "Maní Horneado Manitoba 40 gr",
    ],
    itemsCount: 9,
  },
  {
    id: "natividad",
    name: "Natividad",
    tagline: "Experiencia premium con productos importados.",
    price: 164900,
    category: "Viajero",
    format: "Maletín Viajero + 2 talegas organizadoras",
    dimensions: "30 × 20 × 45 cm",
    images: ["/products/natividad.png", "/products/natividad_1.png"],
    items: [
      "Vino Tinto Importado 750 ml",
      "Arequipe Alquería 220 gr",
      "Galletas Moments Caramelo y Especias 170 gr",
      "Torta Envinada 220 gr",
      "Piazza Deleitte Pie de Limón Lata 120 gr",
      "Durazno en Bombilla 280 gr",
    ],
    itemsCount: 6,
  },
  {
    id: "villancico",
    name: "Villancico",
    tagline: "Tradición colombiana en un maletín ligero.",
    price: 54900,
    category: "Nacional",
    format: "Maletín Nacional",
    dimensions: "29 × 10 × 39 cm",
    images: ["/products/villancico.png", "/products/villancico_1.png"],
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Torta Envinada 220 gr",
      "Salsa de Tomate La Constancia 120 gr",
      "Mayonesa La Constancia 120 gr",
      "Paliqueso Horneado 30 gr",
    ],
    itemsCount: 9,
    specialOrder: { deadline: "1 de noviembre de 2026", minUnits: 80 },
  },
  {
    id: "pastorcitos",
    name: "Pastorcitos",
    tagline: "La esencia de la tradición en caja navideña.",
    price: 32900,
    category: "Caja",
    format: "Caja Navideña",
    dimensions: "Presentación en caja",
    images: ["/products/pastorcitos.png", "/products/pastorcitos_1.png"],
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 150 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Torta Envinada 220 gr",
      "Gomas Bon Bon Bum Colombina 40 gr",
      "Maní Horneado Manitoba 40 gr",
    ],
    itemsCount: 8,
  },
  {
    id: "alborada",
    name: "Alborada",
    tagline: "Detalle navideño esencial, perfecto para grandes equipos.",
    price: 18300,
    category: "Caja",
    format: "Caja Navideña",
    dimensions: "Presentación en caja",
    images: ["/products/alborada.png", "/products/alborada_1.png"],
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
    ],
    itemsCount: 5,
  },
];

// ---------- FORMATOS (Arma tu combo) ----------
export const FORMATS: ComboFormat[] = [
  {
    id: "urbano",
    name: "Urbano",
    price: 41900,
    dimensions: "33 × 19 × 51 cm",
    description: "Maletín urbano espacioso y versátil para el día a día.",
    image: "/formats/formato_urbano.png",
  },
  {
    id: "ejecutivo",
    name: "Ejecutivo",
    price: 60900,
    dimensions: "30 × 15 × 44 cm",
    description: "Elegancia sobria para el profesional exigente.",
    image: "/formats/formato_ejecutivo.png",
  },
  {
    id: "gerencial",
    name: "Gerencial",
    price: 72900,
    dimensions: "29 × 12 × 41 cm",
    description: "Acabados premium para niveles directivos.",
    image: "/formats/formato_gerencial.png",
  },
  {
    id: "viajero-premium",
    name: "Viajero Premium",
    price: 93900,
    dimensions: "30 × 20 × 45 cm + 2 talegas",
    description: "El más completo, incluye dos talegas organizadoras.",
    image: "/formats/formato_viajero.png",
  },
  {
    id: "deportivo",
    name: "Deportivo",
    price: 46900,
    dimensions: "48 × 28 × 24 cm",
    description: "Gran capacidad en formato deportivo resistente.",
    image: "/formats/formato_deportivo.png",
  },
  {
    id: "lonchera",
    name: "Lonchera",
    price: 28900,
    dimensions: "23 × 21 × 14 cm",
    description: "Lonchera expandible práctica y compacta.",
    image: "/formats/formato_lonchera.png",
  },
  {
    id: "legacy",
    name: "Legacy",
    price: 35000,
    dimensions: "31 × 14 × 40 cm",
    description: "Diseño clásico y atemporal que perdura.",
    image: "/formats/formato_legacy.png",
  },
  {
    id: "caja-navidena",
    name: "Caja Navideña",
    price: 4000,
    dimensions: "Presentación en caja",
    description: "Opción económica en caja navideña tradicional.",
    image: "/formats/formato_caja.png",
  },
];

// ---------- PACKS (Configurador - Paso 1) ----------
export const PACKS: PackOption[] = [
  {
    id: "pack-1",
    name: "Pack 1",
    price: 34000,
    itemsCount: 9,
    image: "/packs/pack_1.png",
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Torta Envinada 220 gr",
      "Gomas Bon Bon Bum 40 gr",
      "Maní Horneado Manitoba 40 gr",
    ],
  },
  {
    id: "pack-2",
    name: "Pack 2",
    price: 38000,
    itemsCount: 11,
    image: "/packs/pack_2.png",
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Torta Envinada 220 gr",
      "Gomas Bon Bon Bum 40 gr",
      "Maní Horneado Manitoba 40 gr",
      "Piazza Deleitte Colombina 30 gr",
      "Paliqueso × 3 unidades",
    ],
  },
  {
    id: "pack-3",
    name: "Pack 3",
    price: 47000,
    itemsCount: 14,
    image: "/packs/pack_3.png",
    items: [
      "Vino de Manzana 750 ml",
      "Galleta Navidad Colombina 130 gr",
      "Natilla La Gran Zamba 200 gr",
      "Buñuelo Antioqueño 200 gr",
      "Arequipe Alquería 150 gr",
      "Salchicha Viena Rica 150 gr",
      "Torta Envinada 220 gr",
      "Gomas Bon Bon Bum 40 gr",
      "Maní Horneado Manitoba 40 gr",
      "Mermelada La Constancia 200 gr",
      "Salsa de Tomate La Constancia 120 gr",
      "Mayonesa La Constancia 120 gr",
      "Piazza Deleitte Colombina 30 gr",
      "Paliqueso × 3 unidades",
    ],
  },
  {
    id: "pack-premium",
    name: "Pack Premium",
    price: 71000,
    itemsCount: 6,
    image: "/packs/pack_premium.png",
    items: [
      "Vino Tinto Importado 750 ml",
      "Arequipe Alquería 220 gr",
      "Galletas Moments Caramelo y Especias 170 gr",
      "Torta Envinada 220 gr",
      "Piazza Deleitte Pie de Limón Lata 120 gr",
      "Durazno en Bombilla 280 gr",
    ],
    premium: true,
  },
];

// ---------- PACKS ESPECIALES (Configurador - sobre pedido) ----------
export const SPECIAL_PACKS: PackOption[] = [
  {
    id: "pack-consciente",
    name: "Pack Consciente",
    price: 81900,
    itemsCount: 6,
    image: "/packs/pack_consciente.png",
    items: [
      "Vino Tinto Importado 750 ml",
      "Mantequilla de Maní 100% Manitoba 200 gr",
      "Galletas Colombina 100% Yogurt Griego y Açaí",
      "Galletas Gluten Free Colombina 100%",
      "Mentas Zero con Stevia 100% Colombina",
      "Mix Cacao de Origen y Pretzels Manitoba",
    ],
    special: { minUnits: 100, deadline: "1 de noviembre de 2026" },
  },
  {
    id: "pack-amazon",
    name: "Pack Amazon",
    price: 94900,
    itemsCount: 5,
    image: "/packs/pack_amazon.png",
    items: [
      "Six Pack Cerveza Heineken Lata 310 ml",
      "Maní Limón Pimienta Manitoba 160 gr",
      "Salsa Sweet Chili Amazon 355 ml",
      "Salsa Mayochipotle Amazon 360 ml",
      "Cookies Navidad Premium Tarro 200 gr",
    ],
    special: { minUnits: 100, deadline: "1 de noviembre de 2026" },
  },
  {
    id: "pack-selecto",
    name: "Pack Selecto",
    price: 119900,
    itemsCount: 5,
    image: "/packs/pack_selecto.png",
    items: [
      "J.P. Chenet Ice Blanco 200 ml",
      "Chocolate Moments Premium Caja 90 gr",
      "Queso Holandés Bloque Alpina 220 gr",
      "Arequipe Alpina 220 gr",
      "Café Buendía Tostión Media 340 gr",
    ],
    special: { minUnits: 100, deadline: "1 de noviembre de 2026" },
  },
];

// ---------- CONTACTO / EMPRESA ----------
export const COMPANY = {
  brand: "Ancheta & Co.",
  legalName: "Nativity World S.A.S.",
  slogan: "El Pesebre Más Grande del Mundo",
  campaign: "Detalles Corporativos — Navidad 2026",
  whatsapp: "+57 312 388 8573",
  whatsappIntl: WHATSAPP_NUMBER,
  pesebreSite: "https://elpesebremasgrandedelmundo.com",
  // Ubicación exacta en Google Maps (Punto de Venta — Av 6 N # 28N-39, San Vicente, Cali)
  mapsUrl: "https://maps.app.goo.gl/tYUXSX4v6tC87YjE7",
  // Proveedores y aliados comerciales (sección de logos)
  suppliers: [
    "Colombina",
    "Alpina",
    "Alquería",
    "La Constancia",
    "Rica",
    "Manitoba",
    "Café Buendía",
    "J.P. Chenet",
    "Heineken",
    "Piazza",
  ],
  contacts: [
    { name: "David Franco Arbeláez", phone: "+57 305 284 1207" },
    { name: "Carolina Gómez Ocampo", phone: "+57 301 557 1556" },
    { name: "Isabel Cristina García Corrales", phone: "+57 318 649 5108" },
  ],
  locations: [
    {
      title: "Oficina Principal",
      address: "Av 6A Bis # 35N-100, Oficina 413",
      detail: "Ed. Centro Empresarial Chipichape, Cali - Valle",
      phone: "+57 305 284 1207",
    },
    {
      title: "Punto de Venta",
      address: "Av 6 Norte # 28N-41",
      detail: "Santa Mónica, Cali - Valle",
      phone: "+57 312 388 8573",
    },
  ],
};

// ---------- UTILIDADES ----------
export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function priceWithIVA(price: number): number {
  return Math.round(price * (1 + IVA_RATE));
}

// Rangos amigables por presupuesto por regalo: cada uno devuelve 2–3 combos
export const PRICE_RANGES = [
  { id: "all", label: "Ver todo el catálogo", min: 0, max: Infinity },
  { id: "b1", label: "Hasta $35.000", min: 0, max: 35000 },
  { id: "b2", label: "$35.000 – $75.000", min: 35000, max: 75000 },
  { id: "b3", label: "$75.000 – $100.000", min: 75000, max: 100000 },
  { id: "b4", label: "Más de $100.000", min: 100000, max: Infinity },
] as const;

// Ciudades sugeridas para el campo «Ciudades de entrega» (multi-select)
export const CITY_SUGGESTIONS = [
  "Cali",
  "Bogotá",
  "Medellín",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Armenia",
  "Cúcuta",
  "Ibagué",
  "Neiva",
  "Popayán",
  "Pasto",
  "Santa Marta",
  "Valledupar",
  "Montería",
  "Villavicencio",
];

export const CATEGORIES = ["Todos", "Ejecutivo", "Deportivo", "Legacy", "Lonchera", "Gerencial", "Urbano", "Viajero", "Nacional", "Caja"];
