"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Crown,
  Gift,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { FORMATS, PACKS, SPECIAL_PACKS, formatCOP } from "@/lib/catalog-data";
import type { ComboFormat, PackOption } from "@/lib/catalog-data";
import { useQuoteStore } from "@/lib/quote-store";

const MAX_COMBO_QUANTITY = 9999;

const shortName = (s: string) => s.replace(/\s*(×|x)?\s*\d+.*$/i, "").trim();

const isMobileView = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

export function Configurator() {
  const [selectedPack, setSelectedPack] = useState<PackOption | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ComboFormat | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useQuoteStore((s) => s.addItem);
  const formatSectionRef = useRef<HTMLDivElement>(null);
  const packsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const minQuantity = selectedPack?.special?.minUnits ?? 1;
  const unitPrice = (selectedPack?.price ?? 0) + (selectedFormat?.price ?? 0);
  const total = unitPrice * quantity;
  const comboReady = !!selectedPack && !!selectedFormat;

  const handleSelectPack = (pack: PackOption) => {
    setSelectedPack(pack);
    // Al cambiar de pack, las unidades vuelven al mínimo del pack elegido
    setQuantity(pack.special?.minUnits ?? 1);
    setJustAdded(false);
    if (isMobileView()) {
      formatSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectFormat = (format: ComboFormat) => {
    setSelectedFormat(format);
    setJustAdded(false);
    if (isMobileView() && selectedPack) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  const handleAdd = () => {
    if (!selectedPack || !selectedFormat) return;
    addItem(
      {
        id: `combo-${selectedPack.id}-${selectedFormat.id}`,
        type: "pack",
        name: `Combo ${selectedPack.name} + ${selectedFormat.name}`,
        detail: `${selectedPack.itemsCount} productos · ${selectedFormat.name}`,
        price: unitPrice,
      },
      quantity
    );
    setJustAdded(true);
    toast.success("¡Combo agregado a tu cotización!", {
      description:
        `${selectedPack.name} + ${selectedFormat.name} · ${quantity} u. · ` +
        `${formatCOP(unitPrice * quantity)}`,
      action: { label: "Cotizar", onClick: () => (window.location.hash = "#cotizar") },
    });
  };

  // Continuar armando otro pack: reinicia el flujo y sube al paso 1
  const handleAddAnother = () => {
    setSelectedPack(null);
    setSelectedFormat(null);
    setQuantity(1);
    setJustAdded(false);
    packsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="configurador" className="relative scroll-mt-20 bg-forest py-20 sm:py-24">
      {/* Textura sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep via-transparent to-forest-deep" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Configurador
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-cream sm:text-4xl">
            Crea tu propia ancheta
          </h2>
          <p className="mt-4 text-base text-cream/70">
            Elige el contenido de tu regalo y el empaque que más te guste. Todo en una sola vista
            y con el precio en vivo.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10 xl:gap-12">
          {/* ---------- Columna izquierda: pasos ---------- */}
          <div>
            {/* Paso 1: contenido */}
            <div ref={packsRef} className="scroll-mt-28">
              <div className="flex items-center gap-3.5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-forest-deep shadow-lg shadow-gold/20"
                  aria-hidden
                >
                  1
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-cream sm:text-2xl">
                    Elige el contenido de tu regalo
                  </h3>
                  <p className="text-xs text-cream/60 sm:text-sm">
                    Packs de productos navideños listos para regalar
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {PACKS.map((pack) => (
                  <PackCard
                    key={pack.id}
                    pack={pack}
                    selected={selectedPack?.id === pack.id}
                    onSelect={() => handleSelectPack(pack)}
                  />
                ))}
              </div>

              {/* Packs especiales */}
              <div className="mt-10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-gold" aria-hidden />
                    <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
                      Packs especiales
                    </h4>
                  </div>
                  <p className="flex items-center gap-1.5 text-[11px] text-cream/60">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    Sobre pedido · antes del 1 de noviembre · mín. 100 u.
                  </p>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {SPECIAL_PACKS.map((pack) => (
                    <PackCard
                      key={pack.id}
                      pack={pack}
                      selected={selectedPack?.id === pack.id}
                      onSelect={() => handleSelectPack(pack)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Paso 2: empaque */}
            <div
              ref={formatSectionRef}
              className="mt-12 scroll-mt-24"
              id="combo-formatos"
              aria-label="Selecciona el empaque"
            >
              <div className="flex items-center gap-3.5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-forest-deep shadow-lg shadow-gold/20"
                  aria-hidden
                >
                  2
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-cream sm:text-2xl">
                    Selecciona el empaque que más te guste
                  </h3>
                  <p className="text-xs text-cream/60 sm:text-sm">
                    El maletín que llevará tu regalo por solo {formatCOP(4000)} desde
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {FORMATS.map((format) => (
                  <FormatCard
                    key={format.id}
                    format={format}
                    selected={selectedFormat?.id === format.id}
                    onSelect={() => handleSelectFormat(format)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ---------- Columna derecha: resumen sticky ---------- */}
          <aside ref={panelRef} className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-2xl border border-gold/30 bg-cream shadow-2xl shadow-forest-deep/40"
              aria-label="Resumen de tu combo"
              aria-live="polite"
            >
              <div className="border-b border-forest/10 bg-forest p-5">
                <h3 className="flex items-center gap-2.5 font-display text-xl font-bold text-cream">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-forest-deep">
                    <ShoppingBag className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  Tu combo
                </h3>
              </div>

              <div className="p-5 sm:p-6">
                {/* Contenido */}
                <div className="flex items-start justify-between gap-3">
                  {selectedPack ? (
                    <>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gold-deep">
                          Contenido
                        </p>
                        <p className="truncate text-sm font-bold text-forest">
                          {selectedPack.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPack.itemsCount} productos
                          {selectedPack.special ? " · sobre pedido" : ""}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-forest">
                        {formatCOP(selectedPack.price)}
                      </p>
                    </>
                  ) : (
                    <p className="flex-1 rounded-lg border border-dashed border-forest/25 px-3 py-2.5 text-center text-xs font-semibold text-forest/50">
                      Paso 1 · Elige el contenido de tu regalo
                    </p>
                  )}
                </div>

                {/* Empaque */}
                <div className="mt-4 flex items-start justify-between gap-3">
                  {selectedFormat ? (
                    <>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gold-deep">
                          Empaque
                        </p>
                        <p className="truncate text-sm font-bold text-forest">
                          {selectedFormat.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedFormat.dimensions}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-forest">
                        {formatCOP(selectedFormat.price)}
                      </p>
                    </>
                  ) : (
                    <p className="flex-1 rounded-lg border border-dashed border-forest/25 px-3 py-2.5 text-center text-xs font-semibold text-forest/50">
                      Paso 2 · Selecciona el empaque
                    </p>
                  )}
                </div>

                {/* Unidades */}
                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-forest/15 bg-white p-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-forest/70">
                      Unidades
                    </p>
                    {selectedPack?.special ? (
                      <p className="text-[10px] font-medium text-gold-deep">
                        Mín. {selectedPack.special.minUnits} u. · antes del 1 nov
                      </p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground">
                        ¿Cuántos combos necesitas?
                      </p>
                    )}
                  </div>
                  <div
                    className="flex h-10 items-center rounded-full border border-forest/20 bg-cream/60"
                    role="group"
                    aria-label="Cantidad de combos"
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(minQuantity, q - 1))}
                      disabled={quantity <= minQuantity}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-forest transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Reducir unidades"
                    >
                      <Minus className="h-4 w-4" aria-hidden />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-forest" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(MAX_COMBO_QUANTITY, q + 1))
                      }
                      disabled={quantity >= MAX_COMBO_QUANTITY}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-forest transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Aumentar unidades"
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-5 border-t border-forest/10 pt-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-forest">
                      Total estimado
                    </span>
                    <span className="font-display text-3xl font-bold text-forest">
                      {comboReady ? formatCOP(total) : "—"}
                    </span>
                  </div>
                  <p className="mt-1 text-right text-[11px] text-muted-foreground">
                    {comboReady
                      ? `${quantity} u. × ${formatCOP(unitPrice)} · IVA no incluido`
                      : "Completa los 2 pasos para ver el total"}
                  </p>
                </div>

                {justAdded ? (
                  <div className="mt-5 space-y-2.5" aria-live="polite">
                    <p className="flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-bold text-gold">
                      <Check className="h-4 w-4" aria-hidden />
                      ¡Combo agregado a tu cotización!
                    </p>
                    <Button
                      onClick={handleAddAnother}
                      className="w-full border border-gold/70 bg-gold py-5 text-base font-bold text-forest-deep shadow-lg transition-all hover:bg-gold-light"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" aria-hidden />
                      Agrega otro pack
                    </Button>
                    <a
                      href="#cotizar"
                      className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-forest/15 bg-white py-4 text-sm font-bold text-forest transition-all hover:border-gold/60 hover:text-gold-deep"
                    >
                      Ir a mi cotización
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </a>
                  </div>
                ) : (
                  <Button
                    onClick={handleAdd}
                    disabled={!comboReady}
                    className="mt-5 w-full border border-gold/70 bg-gold py-5 text-base font-bold text-forest-deep shadow-lg transition-all hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" aria-hidden />
                    Agregar a mi cotización
                  </Button>
                )}

                <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[11px] leading-snug text-muted-foreground">
                  <Gift className="mt-0.5 h-3 w-3 shrink-0 text-gold-deep" aria-hidden />
                  Podrás revisar y ajustar todo en el formulario de cotización.
                </p>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ---------- Tarjeta de pack (visual, con imagen) ----------
function PackCard({
  pack,
  selected,
  onSelect,
}: {
  pack: PackOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
        selected
          ? "border-gold bg-cream/10 shadow-lg shadow-gold/10"
          : "border-cream/10 bg-forest-deep/30 hover:border-gold/50"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="group flex w-full cursor-pointer flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {/* Imagen del contenido */}
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={pack.image}
            alt={`Contenido del ${pack.name}: ${pack.itemsCount} productos navideños`}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1280px) 44vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/60 to-transparent p-3 pt-12">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold leading-tight text-cream">
                  {pack.name}
                </p>
                <p className="text-[11px] text-cream/70">{pack.itemsCount} productos incluidos</p>
              </div>
              <p className="shrink-0 text-lg font-bold text-gold">{formatCOP(pack.price)}</p>
            </div>
          </div>
          {selected && (
            <span
              className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-gold shadow-lg"
              aria-hidden
            >
              <Check className="h-4 w-4 text-forest-deep" />
            </span>
          )}
          {pack.premium && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-forest-deep">
              Premium
            </span>
          )}
          {pack.special && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-holly/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
              Sobre pedido · Mín. {pack.special.minUnits} u.
            </span>
          )}
        </div>
      </button>

      {/* Detalle del contenido */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1.5">
          {pack.items.slice(0, 3).map((item) => (
            <span
              key={item}
              className="max-w-[135px] truncate rounded-full bg-cream/10 px-2 py-0.5 text-[10px] font-medium text-cream/70"
            >
              {shortName(item)}
            </span>
          ))}
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">
            +{pack.itemsCount - 3} más
          </span>
        </div>

        <Collapsible className="mt-3">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-cream/15 px-3 py-2 text-xs font-semibold text-cream/80 transition-colors hover:border-gold/40 hover:text-gold">
            Ver contenido
            <ChevronDown
              className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="quote-scroll mt-2.5 max-h-40 space-y-1.5 overflow-y-auto pr-1">
              {pack.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-1.5 text-xs leading-snug text-cream/75"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

// ---------- Tarjeta de formato (visual) ----------
function FormatCard({
  format,
  selected,
  onSelect,
}: {
  format: ComboFormat;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        selected
          ? "border-gold shadow-xl shadow-gold/20"
          : "border-cream/10 bg-forest-deep/40 hover:border-gold/50"
      }`}
    >
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={format.image}
          alt={`Empaque ${format.name} — ${format.dimensions}`}
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 22vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {selected && (
          <span
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-gold shadow-lg"
            aria-hidden
          >
            <Check className="h-4 w-4 text-forest-deep" />
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/70 to-transparent p-3 pt-10">
          <p className="font-display text-base font-bold leading-tight text-cream">
            {format.name}
          </p>
          <p className="mt-0.5 text-[11px] leading-tight text-cream/70">{format.dimensions}</p>
          <p className="mt-1.5 text-sm font-bold text-gold">{formatCOP(format.price)}</p>
        </div>
      </div>
    </button>
  );
}
