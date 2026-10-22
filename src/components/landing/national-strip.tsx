"use client";

import { motion } from "framer-motion";
import { Building2, Phone, Store } from "lucide-react";
import { COMPANY } from "@/lib/catalog-data";

export function NationalStrip() {
  return (
    <section
      aria-label="Proveedor nacional de regalos empresariales"
      className="relative border-y border-gold/25 bg-forest-deep pattern-stars"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="max-w-md"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
              Proveedor nacional de regalos empresariales
            </p>
            <p className="mt-2 font-display text-xl font-bold leading-snug text-cream sm:text-2xl">
              ¿Necesitas 100, 800, 5.000{" "}
              <span className="text-gold-gradient italic">o más anchetas?</span>
            </p>
            <p className="mt-1 text-sm text-cream/65">
              Operamos con capacidad de gran volumen en todo el país.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto"
            aria-label="Puntos de atención"
          >
            {/* Misma información que la sección de ubicación (COMPANY.locations) */}
            {COMPANY.locations.map((loc) => (
              <li
                key={loc.title}
                className="flex items-start gap-3 rounded-2xl border border-cream/15 bg-forest/60 p-4 transition-colors hover:border-gold/50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-deep text-gold">
                  {loc.title.includes("Oficina") ? (
                    <Building2 className="h-4 w-4" aria-hidden />
                  ) : (
                    <Store className="h-4 w-4" aria-hidden />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-base font-bold text-cream">{loc.title}</p>
                  <p className="mt-0.5 text-xs font-medium text-cream/85">{loc.address}</p>
                  <p className="text-xs text-cream/60">{loc.detail}</p>
                  <a
                    href={`tel:${loc.phone.replace(/\s/g, "")}`}
                    className="mt-1.5 inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-gold transition-colors hover:text-gold-light"
                  >
                    <Phone className="h-3 w-3" aria-hidden />
                    {loc.phone}
                  </a>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
