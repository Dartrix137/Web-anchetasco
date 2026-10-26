// Consentimiento de cookies (Google Consent Mode v2) para las etiquetas de GTM.
// El estado por defecto ("denied") lo fija un script inline en src/app/layout.tsx
// antes de cargar GTM; aquí solo se guarda y se actualiza la decisión del visitante.

export type ConsentValue = "granted" | "denied";

/** Clave en localStorage con la decisión del visitante. */
export const CONSENT_STORAGE_KEY = "cookie-consent";

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

/** Decisión guardada, o null si no hay (o si el almacenamiento está bloqueado). */
export function getStoredConsent(): ConsentValue | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: ConsentValue) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Modo privado o almacenamiento bloqueado: la decisión vale solo para esta visita
  }
}

/** Avisa a GTM del cambio de consentimiento. */
export function applyConsent(value: ConsentValue) {
  window.gtag?.("consent", "update", consentState(value));
  window.dataLayer?.push({ event: "cookie_consent_update", consent: value });
}
