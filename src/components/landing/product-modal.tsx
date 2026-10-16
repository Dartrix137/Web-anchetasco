"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  GitCompareArrows,
  ListChecks,
  Minus,
  Package,
  Plus,
  Ruler,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatCOP, priceWithIVA } from "@/lib/catalog-data";
import type { CatalogProduct } from "@/lib/catalog-data";
import { MAX_ITEM_QUANTITY, useQuoteStore } from "@/lib/quote-store";

interface ProductModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
}

function QtyStepper({
  value,
  onChange,
  min = 1,
  max = MAX_ITEM_QUANTITY,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div
      className="flex h-10 items-center rounded-full border border-forest/20 bg-white"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-full text-forest transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Reducir cantidad"
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <span className="w-10 text-center text-sm font-bold text-forest" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-full text-forest transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const items = useQuoteStore((s) => s.items);
  const addItem = useQuoteStore((s) => s.addItem);
  const updateQuantity = useQuoteStore((s) => s.updateQuantity);
  const removeItem = useQuoteStore((s) => s.removeItem);
  const toggleCompare = useQuoteStore((s) => s.toggleCompare);
  const compareIds = useQuoteStore((s) => s.compareIds);
  const [localQty, setLocalQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [galleryProductId, setGalleryProductId] = useState<string | null>(null);

  // La galería vuelve a la foto principal (y la cantidad a 1) al cambiar de producto
  // o al cerrar el modal — ajuste durante el render, sin efectos
  const currentId = product?.id ?? null;
  if (currentId !== galleryProductId) {
    setGalleryProductId(currentId);
    setActiveImg(0);
    setLocalQty(1);
  }

  if (!product) return null;

  const cartItem = items.find((i) => i.id === product.id) ?? null;
  const inCompare = compareIds.includes(product.id);

  const handleAdd = () => {
    const result = addItem(
      {
        id: product.id,
        type: "product",
        name: product.name,
        detail: `${product.format} · ${product.itemsCount} ítems`,
        price: product.price,
      },
      localQty
    );
    toast.success(`${product.name} agregado a tu cotización`, {
      description:
        `${result.totalQuantity} ${result.totalQuantity === 1 ? "unidad" : "unidades"} · ` +
        `${formatCOP(product.price * result.totalQuantity)}`,
      action: { label: "Cotizar", onClick: () => (window.location.hash = "#cotizar") },
    });
  };

  const handleRemove = () => {
    removeItem(product.id);
    toast.info(`${product.name} quitado de tu cotización`);
  };

  const handleCompare = () => {
    const result = toggleCompare(product.id);
    if (result.ok) {
      toast.success(result.message, {
        description: "Abre la bandeja de comparación para ver el comparador.",
      });
    } else {
      toast.warning(result.message);
    }
  };

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto rounded-2xl p-0 sm:max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Galería de imágenes (2-4 fotos) */}
          <div className="flex flex-col bg-cream">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream md:aspect-auto md:min-h-[460px] md:flex-1">
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
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
              {product.specialOrder && (
                <span className="absolute left-4 top-4 rounded-full bg-forest/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold backdrop-blur-sm">
                  Sobre pedido
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div
                className="flex gap-2.5 border-t border-forest/10 bg-white p-3"
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
                    className={`relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                      i === activeImg
                        ? "border-gold shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalle */}
          <div className="flex flex-col p-6 sm:p-8">
            <DialogHeader className="text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">
                {product.category} · {product.format}
              </p>
              <DialogTitle className="mt-1 font-display text-3xl font-bold text-forest">
                {product.name}
              </DialogTitle>
              <DialogDescription className="text-sm italic text-muted-foreground">
                {product.tagline}
              </DialogDescription>
            </DialogHeader>

            {/* Precio */}
            <div className="mt-5 rounded-xl bg-cream p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-3xl font-bold text-forest">{formatCOP(product.price)}</p>
                  <p className="text-xs text-muted-foreground">IVA no incluido</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-forest">
                    {formatCOP(priceWithIVA(product.price))}
                  </p>
                  <p className="text-xs text-muted-foreground">Total con IVA (19%)</p>
                </div>
              </div>
            </div>

            {/* Metadatos */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 rounded-lg border border-forest/10 p-3">
                <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Dimensiones
                  </p>
                  <p className="text-sm font-medium text-forest">{product.dimensions}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-forest/10 p-3">
                <Package className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Contenido
                  </p>
                  <p className="text-sm font-medium text-forest">
                    {product.itemsCount} productos
                  </p>
                </div>
              </div>
            </div>

            {product.specialOrder && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 p-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                <p className="text-xs leading-relaxed text-forest">
                  <strong>Disponible sobre pedido:</strong> solicitar antes del{" "}
                  {product.specialOrder.deadline}. Pedido mínimo: {product.specialOrder.minUnits}{" "}
                  unidades.
                </p>
              </div>
            )}

            {/* Contenido detallado */}
            <div className="mt-6">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-forest">
                <ListChecks className="h-4 w-4 text-gold-deep" aria-hidden />
                Contenido
              </h4>
              <Separator className="my-3 bg-forest/10" />
              <ul className="max-h-56 space-y-2 overflow-y-auto pr-2">
                {product.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Acciones */}
            <div className="mt-auto space-y-3 pt-6">
              {cartItem ? (
                <>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-forest/15 bg-cream/60 p-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest/70">
                      Cantidad en tu cotización
                    </span>
                    <QtyStepper
                      value={cartItem.quantity}
                      onChange={(next) => updateQuantity(product.id, next)}
                      label={`Cantidad de ${product.name}`}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-forest p-3.5 text-cream">
                    <span className="text-xs text-cream/80">
                      {cartItem.quantity} × {formatCOP(product.price)}
                    </span>
                    <span className="text-lg font-bold text-gold">
                      {formatCOP(product.price * cartItem.quantity)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={handleRemove}
                      variant="outline"
                      className="flex-1 border-2 border-forest/30 font-semibold text-forest transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                      Quitar de la cotización
                    </Button>
                    <Button
                      onClick={handleCompare}
                      variant="outline"
                      className={`flex-1 border-2 font-semibold transition-all ${
                        inCompare
                          ? "border-forest bg-forest/5 text-forest"
                          : "border-forest/30 text-forest hover:border-forest hover:bg-forest hover:text-cream"
                      }`}
                    >
                      <GitCompareArrows className="mr-2 h-4 w-4" aria-hidden />
                      {inCompare ? "En comparación" : "Comparar"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-forest/15 bg-cream/60 p-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest/70">
                      Cantidad
                    </span>
                    <QtyStepper
                      value={localQty}
                      onChange={setLocalQty}
                      label={`Cantidad de ${product.name}`}
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={handleAdd}
                      className="flex-1 border border-gold bg-gold font-semibold text-forest-deep transition-all hover:bg-gold-light"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" aria-hidden />
                      Agregar a mi cotización{localQty > 1 ? ` (${localQty} u.)` : ""}
                    </Button>
                    <Button
                      onClick={handleCompare}
                      variant="outline"
                      className={`flex-1 border-2 font-semibold transition-all ${
                        inCompare
                          ? "border-forest bg-forest/5 text-forest"
                          : "border-forest/30 text-forest hover:border-forest hover:bg-forest hover:text-cream"
                      }`}
                    >
                      <GitCompareArrows className="mr-2 h-4 w-4" aria-hidden />
                      {inCompare ? "En comparación" : "Comparar"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
