"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Handshake } from "lucide-react";

const SUPPLIERS = [
  { name: "Colombina", image: "/brands/colombina.png" },
  { name: "Alpina", image: "/brands/alpina.png" },
  { name: "Alquería", image: "/brands/alqueria.png" },
  { name: "La Constancia", image: "/brands/la-constancia.png" },
  { name: "Rica", image: "/brands/rica.png" },
  { name: "Manitoba", image: "/brands/manitoba.png" },
  { name: "Café Buendía", image: "/brands/cafe-buendia.png" },
  { name: "J.P. Chenet", image: "/brands/jp-chenet.png" },
  { name: "Heineken", image: "/brands/heineken.png" },
  { name: "Piazza", image: "/brands/piazza.png" },
];

export function SuppliersSection() {
  return (
    <section id="proveedores" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-deep">
            <Handshake className="h-4 w-4" aria-hidden />
            Proveedores y aliados comerciales
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-forest sm:text-3xl">
            Marcas que respaldan cada regalo
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Si quieres incluir o cambiar algún producto del contenido de tu regalo, tenemos
            acceso a todo el catálogo institucional de nuestros proveedores y aliados.
          </p>
          <div className="mx-auto mt-5 h-px w-20 bg-gold" aria-hidden />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {SUPPLIERS.map((supplier) => (
            <figure
              key={supplier.name}
              className="flex items-center justify-center rounded-2xl border border-forest/10 bg-cream/50 p-5 transition-all duration-200 hover:border-gold/50 hover:bg-white hover:shadow-md"
            >
              <Image
                src={supplier.image}
                alt={`Logo de ${supplier.name}`}
                width={480}
                height={480}
                className="h-[72px] w-[72px] object-contain opacity-75 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0 sm:h-20 sm:w-20"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
              />
              <span className="sr-only">{supplier.name}</span>
            </figure>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          ¿Quieres cambiar el vino por una cerveza, adicionar una chocolatina más premium o hacer
          algún cambio puntual? Cuéntanos en las notas de tu cotización.
        </p>
      </div>
    </section>
  );
}
