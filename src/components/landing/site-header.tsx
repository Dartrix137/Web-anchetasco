"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuoteStore } from "@/lib/quote-store";

const NAV_LINKS = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#configurador", label: "Crea tu ancheta" },
  { href: "/#cotizar", label: "Cotizar" },
  { href: "/#proveedores", label: "Proveedores" },
  { href: "/#ubicacion", label: "Ubicación" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useQuoteStore((s) => s.items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-forest/95 shadow-lg shadow-forest/20 backdrop-blur-md"
          : "bg-gradient-to-b from-forest-deep/80 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/#inicio" className="flex items-center" aria-label="Ancheta & Co. - Inicio">
          {/* Caja con la proporción del logo (3651×1545 ≈ 2,36:1) */}
          <span className="relative h-14 w-[132px] shrink-0">
            <Image
              src="/logo_brand.png"
              alt="Ancheta & Co. — Detalles Corporativos"
              fill
              priority
              sizes="132px"
              className="object-contain"
            />
          </span>
        </a>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-cream/85 transition-colors hover:bg-cream/10 hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Botón cotizar con contador */}
          <a href="/#cotizar" className="hidden sm:block">
            <Button
              asChild
              className="group relative border border-gold/70 bg-gold text-sm font-semibold text-forest-deep shadow-md transition-all hover:bg-gold-light hover:shadow-lg"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" aria-hidden />
                Cotizar
                {items.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1.5 text-[11px] font-bold text-gold">
                    {items.length}
                  </span>
                )}
              </span>
            </Button>
          </a>

          {/* Menú móvil */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-cream transition-colors hover:bg-cream/10 lg:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Panel móvil */}
      {mobileOpen && (
        <div className="border-t border-cream/10 bg-forest/98 shadow-xl backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4" aria-label="Navegación móvil">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-cream/90 transition-colors hover:bg-cream/10 hover:text-gold"
              >
                {link.label}
              </a>
            ))}
            <a href="/#cotizar" onClick={() => setMobileOpen(false)} className="mt-2">
              <Button className="w-full border border-gold/70 bg-gold font-semibold text-forest-deep hover:bg-gold-light">
                <ShoppingBag className="mr-2 h-4 w-4" aria-hidden />
                Cotizar {items.length > 0 && `(${items.length})`}
              </Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
