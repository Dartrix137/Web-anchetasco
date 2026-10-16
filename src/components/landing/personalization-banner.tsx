"use client";

import { motion } from "framer-motion";
import { BadgePercent, CalendarCheck2, Info } from "lucide-react";
import { PERSONALIZATION_CAMPAIGN, PERSONALIZATION_COST } from "@/lib/catalog-data";

export function PersonalizationBanner() {
  return (
    <section
      aria-label="Campaña de personalización anticipada"
      className="relative bg-cream py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-3xl border border-holly/25 bg-white shadow-xl shadow-holly/5"
        >
          <div className="grid gap-0 md:grid-cols-[auto_1fr]">
            {/* Bloque de oferta */}
            <div className="relative flex flex-col justify-center gap-1 bg-holly px-6 py-7 sm:px-8 md:w-72">
              <BadgePercent
                className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-gold p-2.5 text-forest-deep shadow-lg"
                aria-hidden
              />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light">
                Campaña anticipada
              </p>
              <p className="font-display text-2xl font-bold leading-tight text-cream sm:text-3xl">
                Personalización <span className="text-gold-light">GRATIS</span>
              </p>
              <p className="text-sm font-medium text-cream/85">
                Comprando antes del {PERSONALIZATION_CAMPAIGN.deadline}
              </p>
            </div>

            {/* Condiciones */}
            <div className="px-6 py-6 sm:px-8">
              <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
                Si compras <strong>antes del {PERSONALIZATION_CAMPAIGN.deadline}</strong>, la
                personalización del empaque con el logo de tu empresa va por nuestra cuenta.
              </p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <li className="flex items-start gap-2.5 rounded-xl border border-forest/10 bg-cream/70 px-3.5 py-2.5">
                  <CalendarCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                  <span className="text-xs leading-snug text-foreground/80">
                    {PERSONALIZATION_CAMPAIGN.note}
                  </span>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl border border-forest/10 bg-cream/70 px-3.5 py-2.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-holly" aria-hidden />
                  <span className="text-xs leading-snug text-foreground/80">
                    Después de esta fecha, la personalización tiene un costo adicional de{" "}
                    <strong>${PERSONALIZATION_COST.toLocaleString("es-CO")}</strong> por unidad.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                La personalización puede ser estampada o bordada, de acuerdo al maletín
                seleccionado: hay maletines que no se pueden bordar sino solo estampar.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
