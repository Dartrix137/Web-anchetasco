"use client";

import { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowDown, ChevronLeft, ChevronRight, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    src: "/hero.png",
    mobileSrc: "/hero/hero_mobile1.png",
    alt: "Anchetas corporativas con vino, maletines negros y productos gourmet navideños",
  },
  {
    src: "/hero/hero_slide2.png",
    mobileSrc: "/hero/hero_mobile2.png",
    alt: "Cajas de regalo rojas con detalles dorados y maletines corporativos premium sobre pedestales",
  },
  {
    src: "/hero/hero_slide3.png",
    mobileSrc: "/hero/hero_mobile3.png",
    alt: "Vinos, dulces y delicias navideñas de nuestras anchetas con ramitas de pino",
  },
];

const AUTOPLAY_MS = 6000;

// Breakpoint `sm` de Tailwind: por debajo se usa el banner vertical de móvil
const MOBILE_MAX = "(max-width: 639px)";

/** Banner con dirección de arte: el navegador descarga solo la versión de su tamaño */
function SlideImage({ slide, eager }: { slide: (typeof SLIDES)[number]; eager: boolean }) {
  const common = {
    alt: slide.alt,
    fill: true,
    sizes: "100vw",
    loading: eager ? ("eager" as const) : undefined,
    fetchPriority: eager ? ("high" as const) : undefined,
  };
  const {
    props: { srcSet: desktopSrcSet, ...rest },
  } = getImageProps({ ...common, src: slide.src });
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...common, src: slide.mobileSrc });

  return (
    <picture>
      <source media={MOBILE_MAX} srcSet={mobileSrcSet} sizes="100vw" />
      <img {...rest} alt={slide.alt} srcSet={desktopSrcSet} className="object-cover object-center" />
    </picture>
  );
}

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28 });
  const [selected, setSelected] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interactionRef = useRef(false);

  const restartAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!interactionRef.current) emblaApi?.scrollNext();
    }, AUTOPLAY_MS);
  }, [emblaApi]);

  // Marca interacción manual y pausa el autoplay temporalmente
  const onUserNav = useCallback(() => {
    interactionRef.current = true;
    restartAutoplay();
    // tras 12 s sin interacción, el autoplay continúa
    setTimeout(() => (interactionRef.current = false), AUTOPLAY_MS * 2);
  }, [restartAutoplay]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    onUserNav();
  }, [emblaApi, onUserNav]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    onUserNav();
  }, [emblaApi, onUserNav]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      onUserNav();
    },
    [emblaApi, onUserNav],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    restartAutoplay();
    return () => {
      emblaApi.off("select", onSelect);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [emblaApi, restartAutoplay]);

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] overflow-hidden bg-forest sm:items-center"
    >
      {/* Carrusel de fondo */}
      <div className="absolute inset-0" aria-hidden>
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {SLIDES.map((slide) => (
              <div
                key={slide.src}
                className="relative h-full min-w-0 flex-[0_0_100%]"
              >
                <SlideImage slide={slide} eager={slide.src === SLIDES[0].src} />
              </div>
            ))}
          </div>
        </div>
        {/* Veladuras para legibilidad: izquierda protegida para el texto,
            lado derecho abierto en desktop para que se aprecien los banners.
            En móvil solo se oscurecen arriba (título) y abajo (botones) */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-forest-deep/90 via-forest/60 to-forest/45 lg:from-forest-deep/95 lg:via-forest/40 lg:to-transparent sm:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-forest-deep/75 sm:to-forest-deep/40" />
      </div>

      {/* Contenido */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-28 pt-24 sm:block sm:px-6 sm:pt-32 lg:px-8">
        <div className="flex max-w-2xl flex-1 flex-col sm:block">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden text-xs font-medium uppercase tracking-[0.3em] text-cream/80 sm:block"
          >
            Navidad 2026 · Atención nacional desde Cali, Colombia
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="font-display text-4xl font-bold leading-[1.08] text-cream sm:mt-5 sm:text-5xl lg:text-6xl"
          >
            Regalos que conectan
            <br />y <span className="text-gold-gradient italic">perduran</span>
            <br className="hidden sm:block" /> con tu empresa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-6 hidden text-lg font-medium text-cream/90 sm:block sm:text-xl"
          >
            Esta navidad regala a quienes hacen crecer tu empresa.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-4 hidden max-w-xl text-base leading-relaxed text-cream/75 sm:block"
          >
            Combina productos navideños con maletines funcionales, elegantes y
            reutilizables, personaliza con el logo de tu empresa y crea tu mejor
            regalo.
          </motion.p>

          {/* En móvil, espacio libre para que se vean las imágenes del banner */}
          <div className="min-h-12 flex-1 sm:hidden" aria-hidden />

          {/* Precio de entrada visible */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="inline-flex items-center gap-2.5 self-start rounded-full bg-holly px-5 py-2.5 shadow-lg shadow-holly-deep/40 sm:mt-7"
          >
            <Sparkle className="h-4 w-4 text-gold-light" aria-hidden />
            <span className="text-sm font-bold tracking-wide text-cream sm:text-base">
              Anchetas desde{" "}
              <span className="text-lg font-extrabold text-gold-light sm:text-xl">
                $18.300
              </span>
              <span className="ml-1 font-medium text-cream/85">
                {" "}
                · opciones para todo presupuesto
              </span>
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <a href="#catalogo" className="sm:inline-flex">
              <Button
                size="lg"
                className="w-full border border-gold/70 bg-gold px-8 py-6 text-base font-semibold text-forest-deep shadow-xl shadow-gold/20 transition-all hover:-translate-y-0.5 hover:bg-gold-light sm:w-auto"
              >
                Explorar el catálogo
              </Button>
            </a>
            <a href="#cotizar" className="sm:inline-flex">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-cream/40 bg-transparent px-8 py-6 text-base font-semibold text-cream backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-cream/10 hover:text-gold sm:w-auto"
              >
                Cotizar ahora
              </Button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Controles del carrusel */}
      <div className="absolute bottom-16 right-4 z-10 flex items-center gap-2 sm:right-6 lg:right-8">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Imagen anterior"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream/25 bg-forest-deep/50 text-cream/80 backdrop-blur-sm transition-all hover:border-gold/60 hover:text-gold"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <div
          className="flex items-center gap-2 px-1"
          role="tablist"
          aria-label="Imágenes del banner"
        >
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={selected === i}
              aria-label={`Ir a imagen ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                selected === i
                  ? "w-8 bg-gold"
                  : "w-2.5 bg-cream/40 hover:bg-cream/70"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Imagen siguiente"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream/25 bg-forest-deep/50 text-cream/80 backdrop-blur-sm transition-all hover:border-gold/60 hover:text-gold"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Indicador scroll */}
      <motion.a
        href="#que-quieres"
        aria-label="Desplazarse a opciones"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.8 },
          y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
        }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-cream/70 transition-colors hover:text-gold md:block"
      >
        <ArrowDown className="h-6 w-6" aria-hidden />
      </motion.a>
    </section>
  );
}
