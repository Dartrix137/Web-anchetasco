"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgePercent, CalendarCheck2, Info, Scissors, Users } from "lucide-react";
import { PERSONALIZATION_CAMPAIGN, PERSONALIZATION_COST } from "@/lib/catalog-data";
import { useQuoteStore } from "@/lib/quote-store";

/**
 * Botón flotante sutil (abajo-izquierda) con la información de la campaña de
 * personalización. Se abre al pasar el cursor (desktop) o al tocar (móvil).
 * Se desplaza hacia arriba cuando la barra de cotización está visible.
 */
export function PersonalizationFloat() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = useQuoteStore((s) => s.items.length);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const openNow = () => {
    cancelClose();
    setOpen(true);
  };

  const closeLater = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  // Cerrar al hacer clic/tocar fuera
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        cancelClose();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelClose();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Limpieza del temporizador al desmontar
  useEffect(() => cancelClose, []);

  // Cuando hay productos en la barra de cotización (barra colapsada de ~76px),
  // el botón sube para no quedar tapado
  const bottomClass = itemCount > 0 ? "bottom-[92px]" : "bottom-6";

  return (
    <div
      ref={wrapperRef}
      className={`fixed left-4 z-40 transition-[bottom] duration-300 ${bottomClass}`}
    >
      {/* Tarjeta con la información de la campaña */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="personalizacion-campana-info"
            role="tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-[56px] left-0 w-[272px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gold/40 bg-white shadow-2xl shadow-forest/30"
          >
            <div className="rounded-t-[15px] bg-holly px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light">
                Campaña anticipada
              </p>
              <p className="mt-0.5 font-display text-lg font-bold leading-tight text-cream">
                Personalización <span className="text-gold-light">GRATIS</span>
              </p>
              <p className="mt-0.5 text-xs font-medium text-cream/90">
                Comprando antes del {PERSONALIZATION_CAMPAIGN.deadline}
              </p>
            </div>
            <ul className="space-y-2 px-4 py-3">
              <li className="flex items-start gap-2">
                <Scissors className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" aria-hidden />
                <span className="text-[11px] leading-snug text-foreground/80">
                  Estampado o bordado con el logo de tu empresa, según el maletín seleccionado.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" aria-hidden />
                <span className="text-[11px] leading-snug text-foreground/80">
                  Compra mínima de {PERSONALIZATION_CAMPAIGN.minUnits} unidades.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-holly" aria-hidden />
                <span className="text-[11px] leading-snug text-foreground/80">
                  Después de esta fecha:{" "}
                  <strong>${PERSONALIZATION_COST.toLocaleString("es-CO")}</strong> por unidad.
                </span>
              </li>
            </ul>
            <div className="flex items-center gap-1.5 rounded-b-[15px] border-t border-forest/10 bg-cream/60 px-4 py-2">
              <CalendarCheck2 className="h-3.5 w-3.5 shrink-0 text-gold-deep" aria-hidden />
              <span className="text-[10px] leading-snug text-muted-foreground">
                Anticipo confirmado a más tardar el {PERSONALIZATION_CAMPAIGN.deadline}.
              </span>
            </div>
            {/* Flecha que conecta la tarjeta con el botón */}
            <span
              className="absolute -bottom-[5px] left-[17px] h-2.5 w-2.5 rotate-45 border-b border-r border-gold/40 bg-white"
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => (open ? (cancelClose(), setOpen(false)) : openNow())}
        onMouseEnter={openNow}
        onMouseLeave={closeLater}
        onFocus={openNow}
        onBlur={closeLater}
        aria-expanded={open}
        aria-controls="personalizacion-campana-info"
        aria-label="Personalización gratis comprando antes del 15 de noviembre — ver información de la campaña"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-gold/50 bg-holly/85 text-gold shadow-lg shadow-holly/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-gold hover:bg-holly-deep hover:shadow-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      >
        <BadgePercent className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
