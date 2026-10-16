"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

export function LogosSection() {
  return (
    <section id="empresas" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="text-center"
        >
          <span className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-deep">
            <Building2 className="h-4 w-4" aria-hidden />
            Empresas que confían en nosotros
          </span>
          <div className="mx-auto mt-5 h-px w-20 bg-gold" aria-hidden />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-10 overflow-hidden rounded-2xl border border-forest/10 bg-cream/40 px-6 py-8"
        >
          <Image
            src="/logos_strip.png"
            alt="Logos de empresas cliente de Ancheta & Co."
            width={1400}
            height={180}
            className="mx-auto h-auto w-full max-w-4xl object-contain"
            sizes="(max-width: 1024px) 90vw, 900px"
          />
        </motion.div>
      </div>
    </section>
  );
}
