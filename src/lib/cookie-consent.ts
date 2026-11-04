// Consentimiento de cookies (Google Consent Mode v2) para las etiquetas de GTM.
// El estado por defecto ("denied") lo fija un script inline en src/app/layout.tsx
// antes de cargar GTM; aquí solo se guarda y se actualiza la decisión del visitante.

export type ConsentValue = "granted" | "denied";

/** Clave en localStorage y nombre de la cookie con la decisión del visitante. */
export const CONSENT_STORAGE_KEY = "cookie-consent";

/** Duración de la cookie de consentimiento: 12 meses, en segundos. */
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Ruta que pone la cookie desde el servidor (ver src/app/api/cookie-consent/route.ts). */
const CONSENT_API_PATH = "/api/cookie-consent";

/** Tipos de consentimiento que usan GA4 y Google Ads. */
export const CONSENT_TYPES = [
  "analytics_storage",
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
] as const;

/** Evento de window para volver a mostrar el banner (enlace del footer). */
export const OPEN_COOKIE_SETTINGS_EVENT = "open-cookie-settings";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Objeto { analytics_storage: value, ad_storage: value, … } para gtag("consent", …). */
export function consentState(value: ConsentValue): Record<string, ConsentValue> {
  return Object.fromEntries(CONSENT_TYPES.map((type) => [type, value]));
}

function isConsentValue(value: unknown): value is ConsentValue {
  return value === "granted" || value === "denied";
}

function readLocalStorage(): ConsentValue | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return isConsentValue(value) ? value : null;
  } catch {
    return null;
  }
}

function writeLocalStorage(value: ConsentValue) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Modo privado o almacenamiento bloqueado: queda la cookie
  }
}

function readCookie(): ConsentValue | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CONSENT_STORAGE_KEY}=([^;]*)`));
  const value = match?.[1];
  return isConsentValue(value) ? value : null;
}

/** Pide al servidor la cookie de 12 meses. Si falla, sigue valiendo el localStorage. */
function persistCookie(value: ConsentValue) {
  fetch(CONSENT_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
    keepalive: true,
  }).catch(() => {});
}

/**
 * Decisión guardada (localStorage o, si se borró, la cookie), o null si no hay.
 * Si solo existe en uno de los dos sitios, la copia al otro: así quienes
 * aceptaron antes de existir la cookie la reciben en su siguiente visita.
 */
export function getStoredConsent(): ConsentValue | null {
  const stored = readLocalStorage();
  const cookie = readCookie();
  const value = stored ?? cookie;
  if (value && !stored) writeLocalStorage(value);
  if (value && cookie !== value) persistCookie(value);
  return value;
}

export function saveConsent(value: ConsentValue) {
  writeLocalStorage(value);
  persistCookie(value);
}

/** Avisa a GTM del cambio de consentimiento. */
export function applyConsent(value: ConsentValue) {
  window.gtag?.("consent", "update", consentState(value));
  window.dataLayer?.push({ event: "cookie_consent_update", consent: value });
}
