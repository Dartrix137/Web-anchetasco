"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, Clock, ExternalLink, MapPin, MessageCircle, Phone, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, WHATSAPP_NUMBER } from "@/lib/catalog-data";

const LOCATION_PHOTOS = [
  {
    src: "/location/chipichape.jpg",
    alt: "Entrada del Edificio Centro Empresarial Chipichape con su letrero y dirección Av 6A Bis # 35N-100, sede de la oficina principal en Cali",
    caption: "Ed. Centro Empresarial Chipichape",
    detail: "Oficina Principal — Av 6A Bis # 35N-100, Of. 413",
  },
  {
    src: "/location/santa-monica.jpg",
    alt: "Fachada real del punto de venta Anchetas Corporativas en Santa Mónica, Cali, con su letrero y puerta decorada de Navidad",
    caption: "Punto de Venta Santa Mónica",
    detail: "Av 6 Norte # 28N-41",
  },
];

export function LocationSection() {
  return (
    <section id="ubicacion" className="relative scroll-mt-20 bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-deep">
            Encuéntranos
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest sm:text-4xl">
            Ubicación y contactos
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Visítanos en nuestros puntos de atención en Cali o escríbenos por WhatsApp.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Mapa + fotos */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-5"
          >
            {/* Mapa — clicable: abre la ubicación exacta en Google Maps */}
            <a
              href={COMPANY.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir nuestra ubicación en Google Maps (Av 6 N # 28N-39, San Vicente, Cali)"
              title="Abrir en Google Maps"
              className="group block overflow-hidden rounded-2xl border border-forest/10 shadow-lg shadow-forest/10 transition-all duration-300 hover:border-gold/60 hover:shadow-xl hover:shadow-forest/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <div className="relative h-56 sm:h-64">
                <Image
                  src="/map_area.png"
                  alt="Mapa de ubicación — Chipichape y Santa Mónica, Cali"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 to-transparent" />
                {/* Indicador de acción siempre visible */}
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-forest-deep shadow-md transition-transform duration-300 group-hover:scale-105">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  Ver en Google Maps
                </span>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold transition-transform duration-300 group-hover:scale-110">
                    <MapPin className="h-5 w-5 text-forest-deep" aria-hidden />
                  </span>
                  <p className="text-sm font-semibold text-cream">
                    Cali, Valle del Cauca — Chipichape &amp; Santa Mónica
                  </p>
                </div>
              </div>
            </a>

            {/* Fotos: edificio + fachada */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {LOCATION_PHOTOS.map((photo) => (
                <figure
                  key={photo.src}
                  className="group relative overflow-hidden rounded-2xl border border-forest/10 shadow-md shadow-forest/10"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/50 to-transparent p-3 pt-10">
                      <p className="text-sm font-bold leading-tight text-cream">
                        {photo.caption}
                      </p>
                      <p className="mt-0.5 text-[11px] text-cream/75">{photo.detail}</p>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          </motion.div>

          {/* Puntos y contactos */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="flex flex-col gap-5"
          >
            {COMPANY.locations.map((loc) => (
              <article
                key={loc.title}
                className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm transition-all hover:border-gold/50 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-gold">
                    {loc.title.includes("Oficina") ? (
                      <Building2 className="h-5 w-5" aria-hidden />
                    ) : (
                      <Store className="h-5 w-5" aria-hidden />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold text-forest">{loc.title}</h3>
                    <p className="mt-1 text-sm font-medium text-foreground/85">{loc.address}</p>
                    <p className="text-sm text-muted-foreground">{loc.detail}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-forest">
                      <Phone className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                      {loc.phone}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            <article className="rounded-2xl bg-forest p-6 shadow-lg shadow-forest/20 sm:p-7">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-cream">
                <MessageCircle className="h-5 w-5 text-gold" aria-hidden />
                Asesoría corporativa
              </h3>
              <p className="mt-2 text-sm text-cream/70">
                Nuestro equipo está listo para acompañarte en la planeación de tus detalles
                navideños:
              </p>
              <ul className="mt-4 space-y-3">
                {COMPANY.contacts.map((contact) => (
                  <li key={contact.name} className="flex items-center justify-between gap-3">
                    {/* El nombre cede espacio; el teléfono nunca se parte en dos líneas */}
                    <span className="min-w-0 text-sm font-medium text-cream/90">{contact.name}</span>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="shrink-0 whitespace-nowrap rounded-full border border-gold/40 bg-forest-deep/60 px-3 py-1 text-xs font-semibold text-gold transition-colors hover:bg-gold hover:text-forest-deep"
                    >
                      {contact.phone}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "¡Hola Ancheta & Co.! Quiero información sobre detalles corporativos Navidad 2026."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block"
              >
                <Button className="w-full border border-gold/70 bg-gold font-semibold text-forest-deep hover:bg-gold-light">
                  <MessageCircle className="mr-2 h-4 w-4" aria-hidden />
                  Escríbenos: {COMPANY.whatsapp}
                </Button>
              </a>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-cream/50">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                Lun a Vie 8:00 a.m. – 6:00 p.m. · Sáb 9:00 a.m. – 1:00 p.m.
              </p>
            </article>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
