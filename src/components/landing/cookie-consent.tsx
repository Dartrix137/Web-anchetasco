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
          className="fixed inset-x-3 bottom-3 z-[60] rounded-xl border border-gold/60 bg-forest p-3.5 text-cream shadow-2xl shadow-forest/50 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-sm sm:rounded-2xl sm:p-5"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-text"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Cookie className="h-4 w-4 shrink-0 text-gold sm:h-5 sm:w-5" aria-hidden />
            <h2 id="cookie-consent-title" className="font-display text-base font-semibold sm:text-lg">
              Usamos cookies
            </h2>
          </div>
          <p
            id="cookie-consent-text"
            className="mt-1 text-xs leading-snug text-cream/75 sm:mt-2 sm:text-sm sm:leading-relaxed"
          >
            Utilizamos cookies necesarias para el funcionamiento del sitio. Puedes aceptarlas o
            seguir solo con las necesarias.{" "}
            <a
              href="/politica-de-datos"
              className="font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline"
            >
              Más información.
            </a>
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => decide("denied")}
              className="h-9 border-cream/30 bg-transparent font-semibold text-cream hover:bg-cream/10 hover:text-cream sm:h-10"
            >
              Solo necesarias
            </Button>
            <Button
              type="button"
              onClick={() => decide("granted")}
              className="h-9 bg-gold font-bold text-forest-deep hover:bg-gold-light sm:h-10"
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
