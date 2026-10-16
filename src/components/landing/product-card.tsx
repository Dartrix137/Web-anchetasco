"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Clock, Minus, Package, Plus, Ruler, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCOP } from "@/lib/catalog-data";
import type { CatalogProduct } from "@/lib/catalog-data";
import { MAX_ITEM_QUANTITY, useQuoteStore } from "@/lib/quote-store";

interface ProductCardProps {
  product: CatalogProduct;
  onOpenDetail: (product: CatalogProduct) => void;
}

export function ProductCard({ product, onOpenDetail }: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useQuoteStore((s) => s.addItem);
  const updateQuantity = useQuoteStore((s) => s.updateQuantity);
  const inCart = useQuoteStore((s) => s.items.find((i) => i.id === product.id) ?? null);

  const handleAdd = () => {
    const result = addItem(
      {
        id: product.id,
        type: "product",
        name: product.name,
        detail: `${product.format} · ${product.itemsCount} ítems`,
        price: product.price,
      },
      qty
    );
    setQty(1);
    toast.success(`${product.name} agregado a tu cotización`, {
      description:
        `${result.totalQuantity} ${result.totalQuantity === 1 ? "unidad" : "unidades"} · ` +
        `${formatCOP(product.price * result.totalQuantity)}`,
      action: { label: "Cotizar", onClick: () => (window.location.hash = "#cotizar") },
    });
  };

  const changeCartQty = (delta: number) => {
    if (!inCart) return;
    updateQuantity(product.id, inCart.quantity + delta);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-xl hover:shadow-forest/15">
      {/* Imagen clicable + miniaturas de la galería (2-4 fotos) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => onOpenDetail(product)}
          className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          aria-label={`Ver detalle de ${product.name}`}
        >
          <motion.div
            key={activeImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={product.images[activeImg]}
              alt={`Ancheta ${product.name} — ${product.format}`}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 28vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-forest-deep opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
            Ver detalle
          </span>
          {product.specialOrder && (
            <span className="absolute left-3 top-3 rounded-full bg-forest/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur-sm">
              Sobre pedido
            </span>
          )}
          {product.price > 100000 && !product.specialOrder && (
            <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-forest-deep">
              Premium
            </span>
          )}
        </button>

        {/* Miniaturas de la galería (hermanas del botón para no anidar botones) */}
        {product.images.length > 1 && (
          <div
            className="absolute bottom-2.5 left-2.5 z-10 flex gap-1.5"
            role="group"
            aria-label={`Fotos de ${product.name}`}
          >
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImg(i)}
                aria-label={`Ver foto ${i + 1} de ${product.name}`}
                aria-pressed={i === activeImg}
                className={`relative h-9 w-9 cursor-pointer overflow-hidden rounded-md border-2 shadow-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:h-10 sm:w-10 ${
                  i === activeImg
                    ? "border-gold opacity-100"
                    : "border-white/85 opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="40px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-deep">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Package className="h-3.5 w-3.5" aria-hidden />
            {product.itemsCount} ítems
          </span>
        </div>

        <h3 className="mt-1.5 font-display text-xl font-bold text-forest">{product.name}</h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Ruler className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {product.format} · {product.dimensions}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-lg font-bold text-forest">{formatCOP(product.price)}</p>
              <p className="text-[11px] text-muted-foreground">IVA no incluido</p>
            </div>
            {product.specialOrder && (
              <Badge
                variant="outline"
                className="border-gold/50 bg-gold/10 text-[10px] text-gold-deep"
              >
                <Clock className="mr-1 h-3 w-3" aria-hidden />
                Mín. {product.specialOrder.minUnits} u.
              </Badge>
            )}
          </div>

          {/* Cantidad + Agregar / Stepper sincronizado */}
          <div className="mt-3">
            {inCart ? (
              <div
                className="flex h-11 items-center justify-between rounded-full bg-forest px-1.5"
                role="group"
                aria-label={`Cantidad de ${product.name} en tu cotización`}
              >
                <button
                  type="button"
                  onClick={() => changeCartQty(-1)}
                  disabled={inCart.quantity <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gold transition-colors hover:bg-forest/70 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Quitar una unidad de la cotización"
                >
                  <Minus className="h-4 w-4" aria-hidden />
                </button>
                <span className="flex items-center gap-1.5 text-sm font-bold text-gold">
                  <Check className="h-4 w-4" aria-hidden />
                  {inCart.quantity} {inCart.quantity === 1 ? "unidad" : "unidades"}
                </span>
                <button
                  type="button"
                  onClick={() => changeCartQty(1)}
                  disabled={inCart.quantity >= MAX_ITEM_QUANTITY}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gold transition-colors hover:bg-forest/70 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Agregar una unidad más a la cotización"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="flex h-11 shrink-0 items-center rounded-full border border-forest/20 bg-white"
                  role="group"
                  aria-label={`Cantidad de ${product.name}`}
                >
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-forest transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </button>
                  <span className="w-7 text-center text-sm font-bold text-forest" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(MAX_ITEM_QUANTITY, q + 1))}
                    disabled={qty >= MAX_ITEM_QUANTITY}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-forest transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-gold bg-gold px-3 text-sm font-bold text-forest-deep shadow-sm transition-all hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden />
                  Agregar
                </button>
              </div>
            )}

            {product.specialOrder && (
              <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
                <Clock className="mt-0.5 h-3 w-3 shrink-0 text-gold-deep" aria-hidden />
                Sobre pedido: mínimo {product.specialOrder.minUnits} unidades, pedir antes del 1
                de noviembre.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
