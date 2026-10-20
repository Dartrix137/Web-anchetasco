"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid, SlidersHorizontal } from "lucide-react";

const OPTIONS = [
  {
    id: "catalogo",
    icon: LayoutGrid,
    title: "Seleccionar de las opciones sugeridas",
    description:
      "Explora nuestro catálogo con combos listos para entregar: cajas, loncheras y maletines desde $18.300.",
    cta: "Ver nuestro catálogo",
    href: "#catalogo",
    accent: "text-gold",
    ring: "hover:border-gold/60",
    chip: "bg-gold/15 text-gold",
  },
  {
    id: "configurador",
    icon: SlidersHorizontal,
    title: "Crea tu propia ancheta",
    description:
      "Elige el contenido de tu regalo y el empaque que más te guste. Tu combo a la medida, paso a paso.",
    cta: "Armar mi combo",
    href: "#configurador",
    accent: "text-gold",
    ring: "hover:border-gold/60",
    chip: "bg-holly/15 text-holly-soft",
  },
];

export function WhatNext() {
  return (
    <section id="que-quieres" className="relative scroll-mt-20 bg-cream pt-16 pb-12 pattern-snow sm:pt-20 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-deep">
            Empecemos
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest sm:text-4xl">
            ¿Qué quieres hacer?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Te acompañamos de la forma que prefieras: elige una opción y continúa en un solo clic.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {OPTIONS.map((option, index) => (
            <motion.a
              key={option.id}
              href={option.href}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`group flex flex-col rounded-2xl border border-forest/10 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${option.ring}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest">
                  <option.icon className={`h-6 w-6 ${option.accent}`} aria-hidden />
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${option.chip}`}
                >
                  Opción {index + 1}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl font-bold leading-snug text-forest">
                {option.title}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {option.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold-deep">
                {option.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
