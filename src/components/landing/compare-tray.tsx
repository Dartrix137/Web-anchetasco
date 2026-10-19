"use client";

import { useState } from "react";
import Image from "next/image";
import { GitCompareArrows, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PRODUCTS, formatCOP, priceWithIVA } from "@/lib/catalog-data";
import { useQuoteStore } from "@/lib/quote-store";

export function CompareTray() {
  const compareIds = useQuoteStore((s) => s.compareIds);
  const toggleCompare = useQuoteStore((s) => s.toggleCompare);
  const clearCompare = useQuoteStore((s) => s.clearCompare);
  const [open, setOpen] = useState(false);

  if (compareIds.length === 0) return null;

  const selected = PRODUCTS.filter((p) => compareIds.includes(p.id));

  return (
    <>
      {/* Bandeja flotante */}
      <div className="fixed inset-x-0 bottom-[76px] z-40 flex justify-center px-4 sm:bottom-20">
        <div className="flex max-w-full items-center gap-3 rounded-2xl border border-gold/50 bg-forest/97 px-4 py-3 shadow-2xl shadow-forest/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {selected.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleCompare(p.id)}
                title={`Quitar ${p.name}`}
                className="group relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gold/40"
                aria-label={`Quitar ${p.name} de la comparación`}
              >
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-forest/70 opacity-0 transition-opacity group-hover:opacity-100">
                  <X className="h-4 w-4 text-cream" aria-hidden />
                </span>
              </button>
            ))}
          </div>
          <span className="hidden text-xs font-medium text-cream/80 sm:block">
            {compareIds.length} de 3 para comparar
          </span>
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            disabled={compareIds.length < 2}
            className="bg-gold font-semibold text-forest-deep hover:bg-gold-light disabled:opacity-50"
          >
            <GitCompareArrows className="mr-1.5 h-4 w-4" aria-hidden />
            {compareIds.length < 2 ? "Selecciona 2+" : "Comparar ahora"}
          </Button>
          <button
            type="button"
            onClick={clearCompare}
            className="rounded-md p-1.5 text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
            aria-label="Limpiar comparación"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Modal comparador */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[92vh] max-w-5xl overflow-hidden rounded-2xl p-0"
        >
          {/* Botón de cerrar grande y con contraste (el de shadcn casi no se ve en móvil) */}
          <DialogClose
            className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-forest/10 bg-white/95 text-forest shadow-lg backdrop-blur-sm transition-colors hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold md:h-10 md:w-10"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" strokeWidth={2.5} aria-hidden />
          </DialogClose>
          <DialogHeader className="p-6 pb-4 pr-16 text-left sm:p-8 sm:pb-4 sm:pr-16">
            <DialogTitle className="font-display text-2xl font-bold text-forest sm:text-3xl">
              Comparar productos
            </DialogTitle>
            <DialogDescription>
              Compara precios, formatos y contenidos lado a lado.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] px-6 sm:px-8">
            <div
              className="grid gap-4 pb-8"
              style={{ gridTemplateColumns: `140px repeat(${selected.length}, minmax(0, 1fr))` }}
            >
              {/* Fila: imágenes */}
              <div />
              {selected.map((p) => (
                <div key={p.id} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cream">
                  <Image
                    src={p.images[0]}
                    alt={`Ancheta ${p.name}`}
                    fill
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="object-cover"
                  />
                </div>
              ))}

              {/* Fila: nombre */}
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Producto
              </span>
              {selected.map((p) => (
                <p key={p.id} className="font-display text-lg font-bold text-forest">
                  {p.name}
                </p>
              ))}

              {/* Fila: precio */}
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Precio
              </span>
              {selected.map((p) => (
                <div key={p.id}>
                  <p className="text-xl font-bold text-forest">{formatCOP(p.price)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    + IVA: {formatCOP(priceWithIVA(p.price))}
                  </p>
                </div>
              ))}

              {/* Fila: formato */}
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Formato
              </span>
              {selected.map((p) => (
                <p key={p.id} className="text-sm font-medium text-foreground/85">
                  {p.format}
                </p>
              ))}

              {/* Fila: dimensiones */}
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Dimensiones
              </span>
              {selected.map((p) => (
                <p key={p.id} className="text-sm font-medium text-foreground/85">
                  {p.dimensions}
                </p>
              ))}

              {/* Fila: # ítems */}
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Contenido
              </span>
              {selected.map((p) => (
                <p key={p.id} className="text-sm font-medium text-foreground/85">
                  {p.itemsCount} productos
                </p>
              ))}

              {/* Fila: detalle contenido */}
              <span className="flex items-start pt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Ítems
              </span>
              {selected.map((p) => (
                <ul key={p.id} className="space-y-1.5 pt-1">
                  {p.items.map((item) => (
                    <li key={item} className="text-xs leading-snug text-foreground/80">
                      · {item}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
