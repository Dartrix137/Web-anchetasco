"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PERSONALIZATION_COST } from "@/lib/catalog-data";

const FEATURE_BLOCKS = [
  {
    image: "/feature_opciones.png",
    alt: "Variedad de maletines, loncheras y cajas navideñas corporativas",
    eyebrow: "Opciones",
    title: "Diferentes opciones de regalo",
    description:
      "Distintas presentaciones y contenidos para adaptarnos al presupuesto asignado por colaborador: desde cajas navideñas esenciales desde $18.300 hasta maletines premium con productos importados.",
    points: [
      "Cajas, loncheras y maletines ejecutivos",
      "Combos desde $18.300 hasta línea premium",
      "Nos adaptamos al presupuesto de tu empresa",
    ],
  },
  {
    image: "/feature_personalizacion.png",
    alt: "Maletín corporativo verde con cinta dorada, útil todo el año",
    eyebrow: "Experiencia",
    title: "El regalo sigue siendo útil todo el año",
    description:
      "No entregamos solamente una ancheta: entregamos una experiencia. Los productos se disfrutan en diciembre; el maletín permanece: útil, funcional y reutilizable para viajar, trabajar y organizar.",
    points: [
      "Maletines, morrales y empaques reutilizables",
      `Personalización con logo: costo adicional de $${PERSONALIZATION_COST.toLocaleString("es-CO")} por unidad`,
      "Soluciones para colaboradores, clientes, proveedores, aliados y directivos",
    ],
  },
];

export function Features() {
  return (
    <section id="beneficios" className="relative bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-deep">
            Ancheta &amp; Co.
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest sm:text-4xl">
            Flexibilidad para tu empresa
          </h2>
          <div className="mx-auto mt-5 h-px w-20 bg-gold" aria-hidden />
        </motion.div>

        <div className="mt-14 space-y-16 lg:mt-16 lg:space-y-20">
          {FEATURE_BLOCKS.map((block, index) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
            >
              {/* Imagen */}
              <div className="relative lg:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gold/30 shadow-xl shadow-forest/10 sm:aspect-[3/4] lg:aspect-[4/5]">
                  <Image
                    src={block.image}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-4 -right-3 hidden rounded-2xl bg-holly px-5 py-3 shadow-lg sm:block lg:-right-5"
                  aria-hidden
                >
                  <span className="font-display text-2xl font-bold text-cream">0{index + 1}</span>
                </div>
              </div>

              {/* Texto */}
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-deep">
                  {block.eyebrow}
                </span>
                <h3 className="mt-2 text-left font-display text-2xl font-bold uppercase leading-tight tracking-wide text-forest sm:text-3xl">
                  {block.title}
                </h3>
                <p className="mt-4 max-w-xl text-left text-base leading-relaxed text-muted-foreground">
                  {block.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {block.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20">
                        <Check className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                      </span>
                      <span className="text-sm font-medium text-forest/85">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
