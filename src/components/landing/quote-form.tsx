"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  MapPin,
  MessageCircle,
  Minus,
  PenTool,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  CITY_SUGGESTIONS,
  COMPANY,
  PERSONALIZATION_COST,
  WHATSAPP_NUMBER,
  formatCOP,
} from "@/lib/catalog-data";
import { useQuoteStore, MAX_ITEM_QUANTITY } from "@/lib/quote-store";

const baseSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  personType: z.enum(["natural", "juridica"]),
  company: z.string().optional(),
  email: z.string().email("Ingresa un correo válido"),
  whatsapp: z.string().min(7, "Ingresa tu número de WhatsApp"),
  cities: z.array(z.string().min(2, "Ciudad inválida")).min(1, "Agrega al menos una ciudad de entrega"),
  deliveryDate: z.string().min(1, "Selecciona la fecha requerida"),
  personalization: z.boolean().default(false),
  estimatedQuantity: z
    .number({ message: "Ingresa una cantidad estimada" })
    .int("Debe ser un número entero")
    .min(1, "Mínimo 1 unidad")
    .max(100000, "Cantidad demasiado alta")
    .optional(),
  budgetPerGift: z.string().max(100, "Máximo 100 caracteres").optional(),
  notes: z.string().max(2000, "Máximo 2000 caracteres").optional(),
});

type QuoteFormValues = z.infer<typeof baseSchema>;

export function QuoteForm() {
  const items = useQuoteStore((s) => s.items);
  const removeItem = useQuoteStore((s) => s.removeItem);
  const updateQuantity = useQuoteStore((s) => s.updateQuantity);
  const clearItems = useQuoteStore((s) => s.clearItems);

  const totalEstimate = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
  // Modo asesoría: sin productos seleccionados (contacto para propuesta personalizada)
  const isAdviceMode = items.length === 0;

  // La empresa es obligatoria solo para personas jurídicas;
  // la cantidad estimada solo se exige en modo asesoría (sin cotización armada)
  const formSchema = useMemo(
    () =>
      baseSchema.superRefine((val, ctx) => {
        if (val.personType === "juridica" && (!val.company || val.company.trim().length < 2)) {
          ctx.addIssue({
            code: "custom",
            path: ["company"],
            message: "Ingresa el nombre de tu empresa",
          });
        }
        if (isAdviceMode && val.estimatedQuantity === undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["estimatedQuantity"],
            message: "Cuéntanos cuántos regalos necesitas",
          });
        }
      }),
    [isAdviceMode]
  );

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      personType: "natural",
      company: "",
      email: "",
      whatsapp: "",
      cities: [],
      deliveryDate: "",
      personalization: false,
      estimatedQuantity: undefined,
      budgetPerGift: "",
      notes: "",
    },
  });

  const personType = useWatch({ control: form.control, name: "personType" }) ?? "natural";

  const buildWhatsAppMessage = (values: QuoteFormValues) => {
    const lines: string[] = [
      "¡Hola Ancheta & Co.! 👋",
      "",
      `*${isAdviceMode ? "SOLICITUD DE ASESORÍA PERSONALIZADA" : "SOLICITUD DE COTIZACIÓN"} — NAVIDAD 2026*`,
      "",
      "*DATOS DEL CLIENTE*",
      `• Nombre: ${values.name}`,
      `• Tipo: ${values.personType === "juridica" ? "Persona jurídica" : "Persona natural"}`,
    ];
    if (values.company && values.company.trim()) {
      lines.push(`• Empresa: ${values.company}`);
    }
    lines.push(
      `• Correo: ${values.email}`,
      `• WhatsApp: ${values.whatsapp}`,
      `• Ciudades de entrega: ${values.cities.join(", ")}`,
      `• Fecha requerida: ${values.deliveryDate}`,
      `• Personalización con logo: ${values.personalization ? "Sí" : "No"}`
    );

    if (isAdviceMode) {
      lines.push(
        `• Cantidad estimada: ${values.estimatedQuantity} unidades`,
        `• Presupuesto por regalo: ${values.budgetPerGift || "Por definir"}`
      );
      lines.push(
        "",
        "*ASESORÍA PERSONALIZADA*",
        "• Sin productos seleccionados: quiero una propuesta diseñada a mi medida."
      );
    } else {
      lines.push("", "*PRODUCTOS SELECCIONADOS*");
      items.forEach((item, index) => {
        lines.push(
          `${index + 1}. ${item.name}`,
          `   ${item.detail}`,
          `   Cantidad: ${item.quantity} × ${formatCOP(item.price)} = ${formatCOP(
            item.price * item.quantity
          )}`
        );
      });
      lines.push(
        "",
        `*TOTAL ESTIMADO (sin IVA): ${formatCOP(totalEstimate)}*`,
        `Unidades: ${totalUnits}`
      );
    }

    if (values.notes) {
      lines.push("", `*Notas:* ${values.notes}`);
    }

    lines.push("", "¡Quedo atento(a) para finalizar mi cotización. ¡Gracias! 🎁");

    return encodeURIComponent(lines.join("\n"));
  };

  const handleWhatsApp = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Revisa los campos del formulario", {
        description: "Hay campos obligatorios sin completar o con errores.",
      });
      return;
    }

    const values = form.getValues();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(values)}`;

    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.assign(url);

    toast.success("Abriendo WhatsApp…", {
      description: "Tu solicitud queda lista para enviarla a nuestro equipo comercial.",
    });
  };

  return (
    <section id="cotizar" className="relative -scroll-mt-16 sm:-scroll-mt-20 bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-deep">
            {isAdviceMode ? "Asesoría" : "Cotización"}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest sm:text-4xl">
            {isAdviceMode ? "Solicita tu asesoría personalizada" : "Solicita tu cotización"}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            {isAdviceMode
              ? "Cuéntanos cuántos regalos necesitas y tu presupuesto por persona: nosotros te diseñamos la propuesta personalizada."
              : "Diligencia el formulario y envíalo a nuestro WhatsApp: tu solicitud llegará completa a nuestro equipo corporativo."}
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Resumen de items */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-24 rounded-2xl border border-forest/10 bg-forest p-6 shadow-xl shadow-forest/20 sm:p-8">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-cream">
                <ClipboardList className="h-5 w-5 text-gold" aria-hidden />
                Tu cotización
              </h3>

              {items.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-cream/25 p-6 text-center">
                  <ShoppingBag className="mx-auto h-8 w-8 text-cream/40" aria-hidden />
                  <p className="mt-3 text-sm text-cream/60">
                    Aún no has agregado productos. Explora el{" "}
                    <a
                      href="#catalogo"
                      className="font-semibold text-gold underline underline-offset-4 hover:text-gold-light"
                    >
                      catálogo
                    </a>{" "}
                    o crea tu propia ancheta.
                  </p>
                </div>
              ) : (
                <>
                  <ul className="quote-scroll mt-6 max-h-80 space-y-3 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-cream/15 bg-forest-deep/60 p-3.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-cream">
                              {item.name}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-cream/60">{item.detail}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 cursor-pointer rounded-md p-1.5 text-cream/50 transition-colors hover:bg-cream/10 hover:text-red-300"
                            aria-label={`Quitar ${item.name} de la cotización`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between gap-3">
                          {/* Stepper de cantidad por producto */}
                          <div
                            className="flex h-8 items-center rounded-full border border-cream/20 bg-forest/70"
                            role="group"
                            aria-label={`Cantidad de ${item.name}`}
                          >
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden />
                            </button>
                            <span
                              className="w-9 text-center text-xs font-bold text-cream"
                              aria-live="polite"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= MAX_ITEM_QUANTITY}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-gold">
                            {formatCOP(item.price * item.quantity)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-4 bg-cream/15" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-wider text-cream/70">
                      Total estimado
                    </span>
                    <span className="text-2xl font-bold text-gold">
                      {formatCOP(totalEstimate)}
                    </span>
                  </div>
                  <p className="mt-1 text-right text-[11px] text-cream/50">
                    {totalUnits} {totalUnits === 1 ? "unidad" : "unidades"} · IVA no incluido
                  </p>

                  {/* Acciones de la lista */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearItems}
                      className="border-cream/25 bg-transparent text-xs font-semibold text-cream/70 hover:border-red-300/60 hover:bg-cream/5 hover:text-red-300"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                      Vaciar lista
                    </Button>
                    <a href="#catalogo" className="group">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-gold/40 bg-gold/10 text-xs font-semibold text-gold hover:border-gold hover:bg-gold/20 hover:text-gold-light"
                      >
                        Agregar algo más
                        <ArrowRight
                          className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                          aria-hidden
                        />
                      </Button>
                    </a>
                  </div>
                </>
              )}
            </div>
          </motion.aside>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm sm:p-8">
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleWhatsApp();
                  }}
                  className="space-y-5"
                >
                  {/* Tipo de persona */}
                  <FormField
                    control={form.control}
                    name="personType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-forest">¿Eres persona natural o jurídica? *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid grid-cols-2 gap-3 pt-1"
                          >
                            <Label
                              htmlFor="person-natural"
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                                field.value === "natural"
                                  ? "border-gold bg-gold/10"
                                  : "border-forest/15 bg-cream/40 hover:border-gold/50"
                              }`}
                            >
                              <RadioGroupItem value="natural" id="person-natural" />
                              <span className="flex flex-col leading-tight">
                                <span className="flex items-center gap-1.5 text-sm font-bold text-forest">
                                  <UserRound className="h-4 w-4 text-gold-deep" aria-hidden />
                                  Persona natural
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  Regalo sin empresa
                                </span>
                              </span>
                            </Label>
                            <Label
                              htmlFor="person-juridica"
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                                field.value === "juridica"
                                  ? "border-gold bg-gold/10"
                                  : "border-forest/15 bg-cream/40 hover:border-gold/50"
                              }`}
                            >
                              <RadioGroupItem value="juridica" id="person-juridica" />
                              <span className="flex flex-col leading-tight">
                                <span className="flex items-center gap-1.5 text-sm font-bold text-forest">
                                  <Building2 className="h-4 w-4 text-gold-deep" aria-hidden />
                                  Persona jurídica
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  Compras para tu empresa
                                </span>
                              </span>
                            </Label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 text-forest">
                            <User className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                            Nombre completo *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: María González"
                              className="border-forest/20 bg-cream/50 focus-visible:ring-gold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-forest">
                            {personType === "juridica"
                              ? "Empresa *"
                              : "Empresa (opcional)"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Acme S.A.S."
                              className="border-forest/20 bg-cream/50 focus-visible:ring-gold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-forest">Correo de contacto *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="nombre@correo.com"
                              className="border-forest/20 bg-cream/50 focus-visible:ring-gold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-forest">WhatsApp de contacto *</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+57 300 000 0000"
                              className="border-forest/20 bg-cream/50 focus-visible:ring-gold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Ciudades de entrega (selección múltiple) */}
                  <FormField
                    control={form.control}
                    name="cities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-forest">
                          <MapPin className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                          Ciudades de entrega * (puedes agregar varias)
                        </FormLabel>
                        <FormControl>
                          <CityChipsInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 text-forest">
                            <CalendarDays className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                            Fecha requerida *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              min="2026-01-01"
                              max="2026-12-31"
                              className="border-forest/20 bg-cream/50 focus-visible:ring-gold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Cantidad y presupuesto solo en modo asesoría (sin productos) */}
                    {isAdviceMode && (
                      <>
                        <FormField
                          control={form.control}
                          name="estimatedQuantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-forest">Cantidad estimada *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  placeholder="Ej: 50"
                                  className="border-forest/20 bg-cream/50 focus-visible:ring-gold"
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === "" ? undefined : Number(v));
                                  }}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="budgetPerGift"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-forest">
                                Presupuesto por regalo (opcional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: $50.000"
                                  className="border-forest/20 bg-cream/50 focus-visible:ring-gold"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="personalization"
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-end">
                          <FormLabel className="flex items-center gap-1.5 text-forest">
                            <PenTool className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                            Personalización con logo
                          </FormLabel>
                          <div className="flex h-10 items-center space-x-3 rounded-md border border-forest/20 bg-cream/50 px-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label="Personalización con logo de la empresa"
                              />
                            </FormControl>
                            <span className="text-sm font-medium text-forest">
                              {field.value ? "Sí, con logo" : "Sin personalizar"}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Costo adicional de ${PERSONALIZATION_COST.toLocaleString("es-CO")} por
                            unidad
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-forest">Notas adicionales (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              isAdviceMode
                                ? "Dinos cuántos regalos necesitas y tu presupuesto por persona: nosotros te diseñamos la propuesta personalizada. También cambios de productos, preferencias, logística…"
                                : "Cambios de productos, preferencias, personalización, logística de entrega…"
                            }
                            className="min-h-24 resize-y border-forest/20 bg-cream/50 focus-visible:ring-gold"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full border border-gold/70 bg-gold py-6 text-base font-bold text-forest-deep shadow-lg transition-all hover:bg-gold-light"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
                    Enviar a nuestro WhatsApp
                  </Button>

                  <p className="text-center text-xs leading-relaxed text-muted-foreground">
                    Se abrirá WhatsApp con tu solicitud lista para enviar · Al enviar aceptas ser
                    contactado por nuestro equipo comercial y el tratamiento de tus datos según
                    nuestra{" "}
                    <a
                      href="/politica-de-datos"
                      target="_blank"
                      className="font-semibold text-forest underline underline-offset-2 hover:text-gold-deep"
                    >
                      Política de tratamiento de datos
                    </a>{" "}
                    · {COMPANY.whatsapp}
                  </p>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------- Selector múltiple de ciudades ----------
function CityChipsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (cities: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [showAll, setShowAll] = useState(false);

  const addCity = (raw: string) => {
    const city = raw.trim().replace(/,+$/, "");
    if (!city) return;
    const exists = value.some(
      (c) => c.toLowerCase() === city.toLowerCase()
    );
    if (!exists) onChange([...value, city]);
    setDraft("");
  };

  const removeCity = (city: string) => onChange(value.filter((c) => c !== city));

  const remaining = CITY_SUGGESTIONS.filter(
    (s) => !value.some((c) => c.toLowerCase() === s.toLowerCase())
  );
  const suggestions = showAll ? remaining : remaining.slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-md border border-forest/20 bg-cream/50 px-3 py-2 focus-within:border-gold/60">
        {value.map((city) => (
          <span
            key={city}
            className="flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-cream"
          >
            {city}
            <button
              type="button"
              onClick={() => removeCity(city)}
              className="rounded-full p-0.5 text-cream/60 transition-colors hover:text-gold"
              aria-label={`Quitar ${city}`}
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addCity(draft);
            } else if (e.key === "Backspace" && !draft && value.length > 0) {
              removeCity(value[value.length - 1]);
            }
          }}
          placeholder={
            value.length === 0 ? "Escribe una ciudad y presiona Enter…" : "Otra ciudad…"
          }
          className="min-w-40 flex-1 bg-transparent text-sm text-forest outline-none placeholder:text-forest/40"
          aria-label="Agregar ciudad de entrega"
          list="city-suggestions"
        />
        <datalist id="city-suggestions">
          {remaining.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      {remaining.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-forest/50">
            Sugerencias:
          </span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addCity(s)}
              className="rounded-full border border-forest/15 bg-white px-2.5 py-1 text-xs font-medium text-forest/80 transition-all hover:border-gold/60 hover:text-gold-deep"
            >
              + {s}
            </button>
          ))}
          {remaining.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="rounded-full px-2.5 py-1 text-xs font-bold text-gold-deep hover:underline"
            >
              {showAll ? "Ver menos" : `+${remaining.length - 6} más`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
