"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  applyConsent,
  getStoredConsent,
  saveConsent,
  type ConsentValue,
} from "@/lib/cookie-consent";

/**
 * Banner de cookies (abajo-izquierda). Aparece mientras el visitante no haya
 * decidido y se puede reabrir desde el footer con <CookieSettingsButton />.
 */
export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (getStoredConsent() === null) setIsOpen(true);
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
  }, []);

  const decide = (value: ConsentValue) => {
    saveConsent(value);
    applyConsent(value);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
          className="fixed inset-x-4 bottom-4 z-[60] rounded-2xl border border-gold/60 bg-forest p-5 text-cream shadow-2xl shadow-forest/50 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-sm"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-text"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5">
            <Cookie className="h-5 w-5 shrink-0 text-gold" aria-hidden />
            <h2 id="cookie-consent-title" className="font-display text-lg font-semibold">
              Usamos cookies
            </h2>
          </div>
          <p id="cookie-consent-text" className="mt-2 text-sm leading-relaxed text-cream/75">
            Utilizamos cookies necesarias para el funcionamiento del sitio y, con tu
            autorización, cookies de analítica y publicidad para medir y mejorar nuestras
            campañas. Puedes aceptarlas o seguir solo con las necesarias.{" "}
            <a
              href="/politica-de-datos"
              className="font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline"
            >
              Más información
            </a>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => decide("denied")}
              className="h-10 border-cream/30 bg-transparent font-semibold text-cream hover:bg-cream/10 hover:text-cream"
            >
              Solo necesarias
            </Button>
            <Button
              type="button"
              onClick={() => decide("granted")}
              className="h-10 bg-gold font-bold text-forest-deep hover:bg-gold-light"
            >
              Aceptar
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Enlace para volver a mostrar el banner y cambiar la decisión. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className={className}
    >
      Preferencias de cookies
    </button>
  );
}
