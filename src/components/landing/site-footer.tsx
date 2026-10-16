"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { COMPANY } from "@/lib/catalog-data";

const FOOTER_LINKS = [
  { href: "#por-que-nosotros", label: "Beneficios" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#configurador", label: "Crea tu ancheta" },
  { href: "#cotizar", label: "Cotizar" },
  { href: "#proveedores", label: "Proveedores" },
  { href: "#ubicacion", label: "Ubicación" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto bg-forest-deep pb-8 pt-14 text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <span className="relative h-12 w-[245px] shrink-0">
                <Image
                  src="/logo_brand.png"
                  alt="Ancheta & Co. — Detalles Corporativos"
                  fill
                  sizes="245px"
                  className="object-contain"
                />
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/65">
              {COMPANY.legalName} — {COMPANY.slogan}. Transformamos el detalle navideño en una
              experiencia útil, elegante y memorable: un regalo que no termina en diciembre.
            </p>

            {/* Logos corporativos */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="flex h-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cream/15 bg-cream/5 px-3">
                <span className="relative h-10 w-[204px]">
                  <Image
                    src="/logo_brand.png"
                    alt="Logo corporativo Nativity World S.A.S."
                    fill
                    sizes="204px"
                    className="object-contain"
                  />
                </span>
              </span>
              <a
                href={COMPANY.pesebreSite}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visita la página de El Pesebre Más Grande del Mundo"
                className="group flex h-14 items-center gap-3 rounded-xl border border-cream/15 bg-cream/5 px-3 transition-all hover:border-gold/60"
              >
                <span className="flex h-10 w-10 items-center justify-center overflow-hidden">
                  <Image
                    src="/brands/pesebre-logo.png"
                    alt="Logo El Pesebre Más Grande del Mundo"
                    width={40}
                    height={40}
                    className="h-full w-full rounded-lg bg-white object-contain p-1"
                  />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gold group-hover:text-gold-light">
                    El Pesebre Más Grande del Mundo
                    <ExternalLink
                      className="h-3 w-3 transition-transform group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                  <span className="text-[10px] text-cream/55">
                    Conoce el proyecto · pesebremasgrandedelmundo.com
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* Navegación */}
          <nav aria-label="Navegación del pie de página">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Explora</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-cream/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Contacto</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
              <li>Of. Principal: Av 6A Bis #35N-100, Of. 413</li>
              <li>Chipichape, Cali — Valle</li>
              <li>
                <a
                  href={`https://wa.me/${COMPANY.whatsappIntl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gold transition-colors hover:text-gold-light"
                >
                  WhatsApp: {COMPANY.whatsapp}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="text-xs text-cream/50">
            © 2026 Anchetas &amp; Co. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-cream/50">
            Diseño y Desarrollo por{" "}
            <a
              href="https://lafilial.digital/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La_Filial — Diseño y Desarrollo (lafilial.digital)"
              className="font-semibold text-gold underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              La_Filial
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
