"use client";

import { motion } from "framer-motion";
import { Boxes, Factory, FileCheck2, PenTool, Route, Truck, Users } from "lucide-react";

const CAPABILITIES = [
  { icon: Factory, label: "Producción" },
  { icon: Boxes, label: "Armado" },
  { icon: PenTool, label: "Personalización" },
  { icon: Truck, label: "Logística nacional" },
  { icon: FileCheck2, label: "Facturación electrónica" },
  { icon: Users, label: "Asesoría comercial" },
  { icon: Route, label: "Planeación de entregas" },
];

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
            className="flex flex-wrap gap-2.5"
            aria-label="Capacidades"
          >
            {CAPABILITIES.map((cap) => (
              <li
                key={cap.label}
                className="flex items-center gap-2 rounded-full border border-cream/15 bg-forest/60 px-3.5 py-1.5 text-xs font-semibold text-cream/85 transition-colors hover:border-gold/50 hover:text-gold"
              >
                <cap.icon className="h-3.5 w-3.5 text-gold" aria-hidden />
                {cap.label}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
