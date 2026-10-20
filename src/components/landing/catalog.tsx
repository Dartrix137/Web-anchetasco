"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, PackageOpen, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/landing/product-card";
import { ProductModal } from "@/components/landing/product-modal";
import { PRICE_RANGES, PRODUCTS } from "@/lib/catalog-data";
import type { CatalogProduct } from "@/lib/catalog-data";

export function Catalog() {
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);

  const filteredProducts = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === priceRange) ?? PRICE_RANGES[0];
    return PRODUCTS.filter((p) => p.price >= range.min && p.price < range.max);
  }, [priceRange]);

  return (
    <section id="catalogo" className="relative scroll-mt-[-1rem] bg-cream pt-6 pb-20 pattern-snow sm:pt-8 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-deep">
            Catálogo
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest sm:text-4xl">
            Descubre nuestras opciones
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Combos navideños listos para entregar. Si no sabes cuál elegir, filtra por el
            presupuesto que tienes asignado por regalo.
          </p>
        </motion.div>

        {/* Barra de filtros */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-forest/10 bg-white/70 p-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold text-forest/70" aria-live="polite">
            Mostrando{" "}
            <span className="font-bold text-forest">
              {filteredProducts.length} de {PRODUCTS.length}
            </span>{" "}
            combos
          </p>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
            <span className="flex items-center gap-1.5 text-sm font-bold text-forest">
              <Sparkles className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
              ¿No sabes cuál elegir?
            </span>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger
                className="h-10 w-full border-forest/20 bg-white text-sm font-semibold text-forest sm:w-64"
                aria-label="Filtrar por presupuesto por regalo"
              >
                <SelectValue placeholder="¿Cuál es tu presupuesto por regalo?" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.id} value={range.id}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid de productos */}
        {filteredProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (index % 4) * 0.07 }}
              >
                <ProductCard product={product} onOpenDetail={setSelectedProduct} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-forest/20 bg-white/60 px-6 py-16 text-center">
            <PackageOpen className="mx-auto h-10 w-10 text-forest/30" aria-hidden />
            <p className="mt-3 font-medium text-forest/60">
              No encontramos combos dentro de ese presupuesto.
            </p>
            <button
              type="button"
              onClick={() => setPriceRange("all")}
              className="mt-3 cursor-pointer text-sm font-semibold text-gold-deep underline underline-offset-4 hover:text-forest"
            >
              Ver todos los combos
            </button>
          </div>
        )}

        {/* CTA al configurador */}
        <div className="mt-10 text-center">
          <a
            href="#configurador"
            className="group inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white px-6 py-3 text-sm font-bold text-forest shadow-sm transition-all hover:border-gold/60 hover:text-gold-deep hover:shadow-md"
          >
            ¿Prefieres elegir tú el contenido y el maletín?
            <span className="text-gold-deep">Crea tu propia ancheta</span>
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Todos los precios son IVA no incluido. Haz clic en el combo para ver su contenido
          completo y agregarlo con la cantidad que necesites.
        </p>
      </div>

      {/* Modal de detalle */}
      <ProductModal
        key={selectedProduct?.id ?? "none"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
