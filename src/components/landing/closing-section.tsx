"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Factory,
  Gem,
  PenTool,
  Star,
  Truck,
} from "lucide-react";
import { Check, ChevronRight } from "lucide-react";

const ADVANTAGES = [
  {
    icon: BriefcaseBusiness,
    title: "Maletines importados de primera calidad",
    description: "Importadores directos, sin intermediarios: respaldo y confianza real.",
  },
  {
    icon: Star,
    title: "Productos de marcas reconocidas",
    description: "Alpina, Colombina, Alquería, Manitoba, Concha y Toro y más aliados.",
  },
  {
    icon: Truck,
    title: "Despachos a nivel nacional",
    description: "Coordinamos la logística según tus necesidades, en diferentes sedes.",
  },
  {
    icon: Factory,
    title: "Producción y armado propio",
    description: "Capacidad de gran volumen: 100, 800, 5.000 o más anchetas.",
  },
  {
    icon: PenTool,
    title: "Personalización según tu presupuesto",
    description: "Nos adaptamos al presupuesto asignado por colaborador.",
  },
  {
    icon: Gem,
    title: "Regalos que se perciben de mayor valor",
    description: "Una experiencia que se disfruta en diciembre y sirve todo el año.",
  },
];

const EXPERIENCE_POINTS = [
  "Maletines, morrales y empaques reutilizables",
  "Personalización",
  "Diferentes presupuestos",
  "Soluciones para diferente público: colaboradores, clientes, proveedores, aliados y directivos",
  "Pedidos de grandes volúmenes",
  "Entregas nacionales: coordinamos la logística según tus necesidades de despacho",
];

const GRATITUDE_LIST = [
  "A quienes trabajan contigo",
  "A quienes te eligen",
  "A quienes te proveen",
  "A quienes te acompañan",
  "A quienes creen en tu proyecto",
];

export function ClosingSection() {
  return (
    <section
      id="por-que-nosotros"
      aria-label="Por qué comprar con nosotros"
      className="relative bg-forest-deep py-20 pattern-stars sm:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Confianza y respaldo
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-cream sm:text-4xl">
            ¿Por qué comprar <span className="text-gold-gradient italic">con nosotros?</span>
          </h2>
          <div className="mx-auto mt-5 h-px w-20 bg-gold" aria-hidden />
        </motion.div>

        {/* Ventajas */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {ADVANTAGES.map((adv, index) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
              className="rounded-2xl border border-cream/12 bg-forest/50 p-5 transition-colors hover:border-gold/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15">
                <adv.icon className="h-5 w-5 text-gold" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold leading-snug text-cream">
                {adv.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream/65">{adv.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Experiencia + Gratitud */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Experiencia */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              <BadgeCheck className="h-4 w-4" aria-hidden />
              La experiencia
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-cream sm:text-3xl">
              No entregamos solamente una ancheta:{" "}
              <span className="text-gold-gradient italic">entregamos una experiencia.</span>
            </h3>
            <p className="mt-4 text-base leading-relaxed text-cream/75">
              Tu regalo puede disfrutarse en diciembre y seguir siendo útil todo el año.
            </p>

            <ul className="mt-6 space-y-3">
              {EXPERIENCE_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20">
                    <Check className="h-3 w-3 text-gold" aria-hidden />
                  </span>
                  <span className="text-sm leading-snug text-cream/80">{point}</span>
                </li>
              ))}
            </ul>

            <blockquote className="mt-7 rounded-2xl border-l-4 border-gold bg-forest/50 p-5">
              <p className="text-sm leading-relaxed text-cream/85">
                Los productos se disfrutan, <strong className="text-gold">el maletín permanece</strong>.
                Por eso creamos una propuesta diferente: convertir el tradicional regalo empresarial
                en algo útil, funcional y reutilizable. Para viajar, trabajar, organizar y para el
                día a día.
              </p>
            </blockquote>
          </motion.div>

          {/* Gratitud navideña */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="relative overflow-hidden rounded-3xl bg-holly p-7 shadow-2xl shadow-holly-deep/40 sm:p-9"
          >
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/15"
              aria-hidden
            />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-light">
              Esta navidad
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-cream sm:text-3xl">
              Agradece a quienes hacen crecer tu empresa
            </h3>

            <ul className="mt-6 space-y-3.5">
              {GRATITUDE_LIST.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <ChevronRight className="h-4 w-4 shrink-0 text-gold-light" aria-hidden />
                  <span className="text-base font-medium text-cream/95">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-7 border-t border-cream/25 pt-5 text-sm leading-relaxed text-cream/90">
              Las grandes empresas también se construyen a través de grandes relaciones.
            </p>
            <p className="mt-2 font-display text-xl font-bold text-gold-light">
              Haz que tu regalo perdure con Ancheta &amp; Co.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
