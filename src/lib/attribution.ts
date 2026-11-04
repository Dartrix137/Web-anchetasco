// Atribución de cotizaciones: código COT-XXXXXXXX, UTMs e identificadores publicitarios.
//
// Flujo (ver docs/tracking-cotizaciones.md):
// 1. <AttributionCapture /> guarda al entrar los UTMs (localStorage, último toque, 90 días)
//    y los click IDs de la URL (sessionStorage: solo la visita actual).
// 2. Al enviar el formulario, quote-form.tsx genera el código, lo pone en el mensaje de
//    WhatsApp, lo envía al dataLayer (evento quote_whatsapp_open) y llama a
//    sendQuoteAttribution(), que lo manda a /api/quote-attribution.
// 3. Esa ruta (servidor) lo reenvía al Worker de Cloudflare con la clave privada.
//
// Los identificadores publicitarios y de GA4 solo se envían si el visitante aceptó las cookies.

import { hasConsentGranted } from "@/lib/cookie-consent";

/** Evento del dataLayer que escuchan las etiquetas de GA4 y Meta Pixel en GTM. */
export const QUOTE_EVENT = "quote_whatsapp_open";

/** Ruta del servidor que reenvía la atribución al Worker. */
export const QUOTE_ATTRIBUTION_API_PATH = "/api/quote-attribution";

/**
 * Formato del código: COT- + 8 hexadecimales en mayúscula. Es el mismo que generaba
 * el listener de GTM, así los códigos viejos y nuevos son comparables y ese listener
 * (mientras siga activo) reconoce el código y no agrega otro al mensaje.
 */
export const QUOTE_ID_PATTERN = /^COT-[A-F0-9]{8}$/;

export const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;
export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid"] as const;

type UtmKey = (typeof UTM_KEYS)[number];
type ClickIdKey = (typeof CLICK_ID_KEYS)[number];

/** Lo que el navegador envía a /api/quote-attribution. */
export interface QuoteAttributionPayload {
  quote_id: string;
  consent_granted: boolean;
  utm: Record<UtmKey, string | null>;
  landing_page: string | null;
  referrer: string | null;
  page_url: string;
  /** Solo con consentimiento; si no, todo null. */
  ads: {
    gclid: string | null;
    gbraid: string | null;
    wbraid: string | null;
    fbclid: string | null;
    fbp: string | null;
    fbc: string | null;
  };
  /** Solo con consentimiento; si no, todo null. */
  ga: {
    client_id: string | null;
    session_id: string | null;
  };
}

interface StoredTouch {
  utm: Record<UtmKey, string | null>;
  landing_page: string;
  referrer: string | null;
  captured_at: number;
}

interface StoredClickIds {
  ids: Partial<Record<ClickIdKey, string>>;
  captured_at: number;
}

const TOUCH_STORAGE_KEY = "quote-attribution";
const CLICK_IDS_STORAGE_KEY = "quote-click-ids";
const TOUCH_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_VALUE_LENGTH = 500;

/** Código único de cotización, p. ej. COT-3FA91C0B (32 bits aleatorios). */
export function generateQuoteId(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return (
    "COT-" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()
  );
}

function clean(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, MAX_VALUE_LENGTH) : null;
}

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Modo privado o almacenamiento lleno: se pierde la atribución, no la cotización
  }
}

function readCookie(name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/** Referente externo (otro dominio) o null. */
function externalReferrer(): string | null {
  if (!document.referrer) return null;
  try {
    return new URL(document.referrer).host === location.host ? null : clean(document.referrer);
  } catch {
    return null;
  }
}

/**
 * Guarda la atribución de la visita. Se llama una vez al cargar la página.
 * Una visita con UTMs o con click ID es un "toque" nuevo y reemplaza al anterior.
 */
export function captureAttribution() {
  const params = new URLSearchParams(location.search);

  const utm = Object.fromEntries(
    UTM_KEYS.map((key) => [key, clean(params.get(`utm_${key}`))])
  ) as Record<UtmKey, string | null>;

  const ids: Partial<Record<ClickIdKey, string>> = {};
  for (const key of CLICK_ID_KEYS) {
    const value = clean(params.get(key));
    if (value) ids[key] = value;
  }

  const hasUtm = Object.values(utm).some(Boolean);
  const hasClickId = Object.keys(ids).length > 0;
  const now = Date.now();

  if (hasUtm || hasClickId) {
    // La landing se guarda solo con los utm_*: los click IDs no van a localStorage
    const landingParams = new URLSearchParams();
    UTM_KEYS.forEach((key) => {
      if (utm[key]) landingParams.set(`utm_${key}`, utm[key]!);
    });
    const query = landingParams.toString();
    writeJson(localStorage, TOUCH_STORAGE_KEY, {
      utm,
      landing_page: location.pathname + (query ? `?${query}` : ""),
      referrer: externalReferrer(),
      captured_at: now,
    } satisfies StoredTouch);
  }

  if (hasClickId) {
    writeJson(sessionStorage, CLICK_IDS_STORAGE_KEY, { ids, captured_at: now } satisfies StoredClickIds);
  }
}

function storedTouch(): StoredTouch | null {
  const touch = readJson<StoredTouch>(localStorage, TOUCH_STORAGE_KEY);
  if (!touch || Date.now() - touch.captured_at > TOUCH_MAX_AGE_MS) return null;
  return touch;
}

/** gclid de la URL de esta visita o, si no, de la cookie _gcl_aw (GCL.<tiempo>.<gclid>). */
function readGclid(fromUrl: string | undefined): string | null {
  if (fromUrl) return fromUrl;
  const cookie = readCookie("_gcl_aw");
  return clean(cookie?.split(".").slice(2).join("."));
}

/** _fbc de la cookie del Pixel o, si no, armado desde el fbclid (formato de Meta). */
function readFbc(fbclid: string | undefined, capturedAt: number | undefined): string | null {
  const cookie = clean(readCookie("_fbc"));
  if (cookie) return cookie;
  return fbclid ? `fb.1.${capturedAt ?? Date.now()}.${fbclid}` : null;
}

/** client_id de GA4 desde _ga (GA1.1.<aleatorio>.<tiempo> → <aleatorio>.<tiempo>). */
function readGaClientId(): string | null {
  const parts = readCookie("_ga")?.split(".");
  return parts && parts.length >= 4 ? clean(parts.slice(-2).join(".")) : null;
}

/**
 * session_id de GA4 desde la cookie _ga_<ID de medición>.
 * Formatos: GS1.1.<session_id>.<n>... y GS2.1.s<session_id>$o<n>$...
 */
function readGaSessionId(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)_ga_[A-Z0-9]+=([^;]*)/);
  const value = match?.[1];
  if (!value) return null;
  const parts = value.split(".");
  if (value.startsWith("GS1.")) return clean(parts[2]);
  if (value.startsWith("GS2.")) return clean(parts[2]?.match(/^s(\d+)/)?.[1]);
  return null;
}

/** Arma la atribución de una cotización, respetando el consentimiento. */
export function collectAttribution(quoteId: string): QuoteAttributionPayload {
  const consentGranted = hasConsentGranted();
  const touch = storedTouch();
  const clicks = readJson<StoredClickIds>(sessionStorage, CLICK_IDS_STORAGE_KEY);
  const ids = clicks?.ids ?? {};

  return {
    quote_id: quoteId,
    consent_granted: consentGranted,
    utm:
      touch?.utm ??
      (Object.fromEntries(UTM_KEYS.map((key) => [key, null])) as Record<UtmKey, string | null>),
    landing_page: touch?.landing_page ?? null,
    referrer: touch?.referrer ?? externalReferrer(),
    page_url: location.origin + location.pathname,
    ads: consentGranted
      ? {
          gclid: readGclid(ids.gclid),
          gbraid: ids.gbraid ?? null,
          wbraid: ids.wbraid ?? null,
          fbclid: ids.fbclid ?? null,
          fbp: clean(readCookie("_fbp")),
          fbc: readFbc(ids.fbclid, clicks?.captured_at),
        }
      : { gclid: null, gbraid: null, wbraid: null, fbclid: null, fbp: null, fbc: null },
    ga: consentGranted
      ? { client_id: readGaClientId(), session_id: readGaSessionId() }
      : { client_id: null, session_id: null },
  };
}

/**
 * Envía la atribución al servidor sin esperar respuesta. `keepalive` deja terminar
 * la petición aunque la pestaña navegue a WhatsApp (popup bloqueado).
 */
export function sendQuoteAttribution(payload: QuoteAttributionPayload) {
  fetch(QUOTE_ATTRIBUTION_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

declare global {
  interface Window {
    /** Lo pone el listener viejo de GTM (tag "COT", id 11) que envuelve window.open. */
    __anchetasWaListener?: boolean;
  }
}

/**
 * Avisa a GTM (GA4, Meta Pixel) de la cotización con su código.
 *
 * TRANSICIÓN: mientras el listener viejo de GTM siga publicado, él mismo envía
 * quote_whatsapp_open (con este código, porque ya va en el texto) al llamar a
 * window.open; si también lo enviáramos aquí, GA4 y Meta contarían doble.
 * Cuando se pause ese tag en GTM, este bloque deja de aplicar solo; luego se puede borrar.
 */
export function pushQuoteEvent(data: {
  quoteId: string;
  quoteType: "cotizacion" | "asesoria";
  value?: number;
  units?: number;
}) {
  if (window.__anchetasWaListener) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: QUOTE_EVENT,
    quote_id: data.quoteId,
    // Igual que el listener de GTM, por si algún disparador lo usa
    whatsapp_destination: "cotizador",
    quote_type: data.quoteType,
    value: data.value,
    currency: data.value !== undefined ? "COP" : undefined,
    units: data.units,
  });
}
