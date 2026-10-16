"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/catalog-data";
import { useQuoteStore, MAX_ITEM_QUANTITY } from "@/lib/quote-store";

export function QuoteBar() {
  const items = useQuoteStore((s) => s.items);
  const removeItem = useQuoteStore((s) => s.removeItem);
  const updateQuantity = useQuoteStore((s) => s.updateQuantity);
  const [isOpen, setIsOpen] = useState(false);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const units = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* Espaciador para que la barra fija no cubra el contenido */}
      {items.length > 0 && (
        <div className={isOpen ? "h-[248px] sm:h-[208px]" : "h-[76px]"} aria-hidden />
      )}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-gold/60 bg-forest/97 shadow-2xl shadow-forest/50 backdrop-blur-md"
            role="region"
            aria-label="Barra de cotización"
          >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            {/* Toggle lista */}
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="flex min-w-0 items-center gap-3 text-left"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Ocultar productos agregados" : "Ver productos agregados"}
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold text-forest-deep">
                <ShoppingBag className="h-5 w-5" aria-hidden />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-forest bg-cream px-1 text-[10px] font-bold text-forest">
                  {units}
                </span>
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-semibold text-cream">
                  {items.length} {items.length === 1 ? "producto" : "productos"} · {units}{" "}
                  {units === 1 ? "unidad" : "unidades"}
                </span>
                <span className="block text-sm font-bold text-gold">
                  {formatCOP(total)}{" "}
                  <span className="text-[11px] font-normal text-cream/60">sin IVA</span>
                </span>
              </span>
              <span className="sm:hidden">
                <span className="block text-sm font-bold text-gold">{formatCOP(total)}</span>
              </span>
            </button>

            {/* Acciones */}
            <div className="flex shrink-0 items-center gap-2">
              {isOpen ? (
                <ClipboardList className="h-4 w-4 text-cream/60 sm:hidden" aria-hidden />
              ) : null}
              <a href="#cotizar">
                <Button
                  size="sm"
                  className="h-10 bg-gold px-5 font-bold text-forest-deep shadow-md hover:bg-gold-light"
                >
                  <ShoppingBag className="mr-1.5 h-4 w-4" aria-hidden />
                  Cotizar
                </Button>
              </a>
            </div>
          </div>

          {/* Lista expandible */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-cream/10"
              >
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
                  <ul className="quote-scroll flex gap-3 overflow-x-auto pb-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex w-64 shrink-0 flex-col rounded-xl border border-cream/15 bg-forest-deep/70 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-cream">
                              {item.name}
                            </p>
                            <p className="truncate text-[11px] text-cream/60">{item.detail}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 rounded p-1 text-cream/50 transition-colors hover:text-red-300"
                            aria-label={`Quitar ${item.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          {/* Stepper de cantidad */}
                          <div
                            className="flex h-7 items-center rounded-full border border-cream/20 bg-forest/70"
                            role="group"
                            aria-label={`Cantidad de ${item.name}`}
                          >
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="h-3 w-3" aria-hidden />
                            </button>
                            <span className="w-8 text-center text-[11px] font-bold text-cream">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= MAX_ITEM_QUANTITY}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-3 w-3" aria-hidden />
                            </button>
                          </div>
                          <p className="text-xs font-bold text-gold">
                            {formatCOP(item.price * item.quantity)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
