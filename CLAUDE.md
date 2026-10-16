# CLAUDE.md

Guía para trabajar en este repositorio.

## Qué es

Landing page de **Ancheta & Co.** (Detalles Corporativos, Cali, Colombia): anchetas navideñas corporativas (temporada Navidad 2026) entregadas en maletines/morrales reutilizables. Es una sola página con:

- Hero en carrusel, catálogo de productos (anchetas) con filtros, modal de detalle y comparador.
- Configurador "Crea tu ancheta" (formatos de maletín + packs, precios con IVA 19 %).
- Carrito de cotización (barra flotante) y formulario de cotización que **abre WhatsApp** con el mensaje armado (`wa.me`). **No hay base de datos ni backend de cotizaciones**: todo el estado vive en el navegador (zustand) y la cotización se envía solo por WhatsApp.
- Secciones de proveedores/marcas, cierre, ubicación y footer.

Proyecto generado originalmente con la plataforma **chat.z.ai** (agente "Z.ai Code") y luego limpiado de sus dependencias (ver más abajo). El historial de commits de z.ai no está en este repositorio.

## Stack

| Área | Tecnología (versión instalada) |
|---|---|
| Framework | Next.js 16.1 (App Router, Turbopack, `output: "standalone"`) |
| UI | React 19.2, shadcn/ui estilo "new-york" (Radix UI), lucide-react |
| Estilos | Tailwind CSS 4 (`@tailwindcss/postcss`), `tw-animate-css`; tokens en `src/app/globals.css` |
| Animación / carrusel | framer-motion 12, embla-carousel |
| Estado | zustand 5 (`src/lib/quote-store.ts`, carrito de cotización y comparador) |
| Formularios | react-hook-form 7 + zod 4 (`@hookform/resolvers`) |
| Notificaciones | sonner |
| Fuentes | `next/font/google`: Inter y Playfair Display (se descargan en build) |
| Lenguaje | TypeScript 5 |
| Gestor de paquetes | **bun** (`bun.lock`); probado con bun 1.3 y Node 24 |

`package.json` trae muchas dependencias de la plantilla de z.ai que **no se usan** (next-auth, next-intl, @tanstack/*, @mdxeditor/editor, @dnd-kit/*, react-markdown, react-syntax-highlighter, qrcode.react, uuid, date-fns…). No afectan el bundle del cliente, pero sí el tiempo de instalación.

## Estructura

```
src/
  app/
    layout.tsx           # <html lang="es">, fuentes, metadata SEO, Toasters
    page.tsx             # Compone la landing con las secciones de components/landing
    globals.css          # Tailwind 4 + tokens de color (forest, gold, cream…) y tema shadcn
    api/route.ts         # GET /api -> {"message":"Hello, world!"} (plantilla; útil como healthcheck)
  components/
    landing/             # Secciones de la landing (una por archivo, kebab-case)
    ui/                  # Componentes shadcn/ui generados (no editar salvo necesidad)
  hooks/                 # use-mobile, use-toast (shadcn)
  lib/
    catalog-data.ts      # FUENTE DE DATOS: productos, formatos, packs, precios, WhatsApp, empresa, ciudades
    quote-store.ts       # Store zustand del carrito/comparador
    utils.ts             # cn()
public/                  # Imágenes servidas (products, packs, formats, hero, brands, location…) ~58 MB
docs/worklog-zai.md      # Bitácora del agente de z.ai: historial de decisiones de diseño/contenido y
                         # de cómo se procesaron las imágenes (útil antes de cambiar fotos o secciones)
upload/                  # Solo local, fuera de git: originales subidos a z.ai (~111 MB). NO lo usa la app;
                         # las fotos de combos/packs/formatos/logos ya están procesadas en public/
```

Al reemplazar una imagen en `public/` manteniendo el mismo nombre, borrar `.next/dev/cache/images` y reiniciar el dev server: el optimizador de Next cachea las variantes y seguiría mostrando la vieja (ver `docs/worklog-zai.md`).

Los textos, precios, teléfonos, número de WhatsApp y productos se cambian en `src/lib/catalog-data.ts`. El mensaje de WhatsApp se arma en `buildWhatsAppMessage` dentro de `src/components/landing/quote-form.tsx`.

## Comandos

```bash
bun install                 # instalar dependencias

bun run dev                 # desarrollo en http://localhost:3000
bunx next dev -p 3000       # alternativa en Windows: el `| tee dev.log` del script oculta la salida

bun run build               # build de producción -> .next/standalone (+ copia static y public)
bun run start               # producción con bun (usa `tee`, pensado para Linux)
node .next/standalone/server.js   # producción con Node (PORT y HOSTNAME por env)

bun run lint                # ESLint (muchas reglas desactivadas en eslint.config.mjs)
bunx tsc --noEmit           # chequeo de tipos (el build NO lo hace, ver Convenciones)
```

## Variables de entorno

La app **no necesita variables de entorno** ni claves de servicios externos. Solo aplican las estándar del servidor standalone:

| Variable | Uso |
|---|---|
| `PORT`, `HOSTNAME` | Puerto e interfaz de `server.js` standalone (en contenedor: `3000` / `0.0.0.0`). |
| `NODE_ENV` | `production` en el servidor. |
| `NEXT_TELEMETRY_DISABLED` | Opcional, `1` para desactivar la telemetría de Next. |

## Base de datos

No hay. La versión generada por z.ai guardaba cada cotización en SQLite (Prisma, `POST/GET /api/quotes`); se eliminó porque el flujo previsto es solo WhatsApp. Si en el futuro se quiere registrar cotizaciones, habría que volver a añadir un backend (y proteger cualquier endpoint de lectura, porque contiene datos personales).

## Dependencias de z.ai

| Elemento | Dónde | Estado |
|---|---|---|
| `z-ai-web-dev-sdk` | `package.json` | **Eliminada** (no se importaba en ningún archivo). |
| SQLite/Prisma con `DATABASE_URL=file:/home/z/my-project/db/custom.db` | `.env`, `prisma/`, `src/lib/db.ts`, `/api/quotes` | **Eliminada** (no se necesita base de datos). |
| Caddyfile `:81` + `XTransformPort` | `Caddyfile` | **Eliminado**; el Caddyfile de producción se crea con el despliegue. |
| Scripts de build/arranque del sandbox (`/home/z/my-project`, `/app/next-service-dist`) | `.zscripts/`, `tests/` | **Eliminados**. |
| CLI `z-ai` (image, image-search, vision) | `scripts/*.py` | **Eliminados** (solo generaron imágenes ya guardadas en `public/`). |
| Ejemplo socket.io con `XTransformPort` | `examples/websocket/` | **Eliminado**. |
| Carpetas vacías de la plantilla | `download/`, `mini-services/` | **Eliminadas**. |
| `.z-ai-config`, `/skills/` | `.gitignore`, `eslint.config.mjs` | Inofensivo. |
| Scripts `build`/`start` con `cp`/`tee`/`bun` | `package.json` | `build` **arreglado** (`cp -r` → `cp -R`, compatible con el shell de bun en Windows y con Linux). `dev`/`start` siguen usando `tee`. |

## Convenciones

- Componentes de sección en `src/components/landing/<nombre-kebab>.tsx`, exportación **nombrada** en PascalCase (`export function Hero()`), casi todos `"use client"` con framer-motion para animaciones al hacer scroll (`whileInView`, `viewport={{ once: true }}`).
- Imports con alias `@/` → `src/`. Componentes UI desde `@/components/ui/*`.
- Textos de la interfaz, comentarios y mensajes de error **en español**.
- Colores de marca vía clases Tailwind propias definidas en `globals.css` (`text-forest`, `bg-cream`, `text-gold-deep`, `font-display`…).
- Datos estáticos centralizados en `catalog-data.ts`; nada de datos hardcodeados dentro de los componentes.
- Imágenes con `next/image` (optimizador activo, requiere `sharp`).
- `next.config.ts`: `typescript.ignoreBuildErrors: true` (el build ignora errores de tipos; hoy existen 12 en `quote-form.tsx` por el desajuste zod 4 ↔ `@hookform/resolvers` en campos con `.default()`, sin efecto en ejecución), `reactStrictMode: false`, `devIndicators: false`.
- ESLint muy permisivo (ver `eslint.config.mjs`).

## Despliegue

Destino: **VPS Ubuntu 26.04, 1 vCPU, 2 GB RAM + 2 GB swap**, con **Docker + Docker Compose**, **Caddy** como reverse proxy con HTTPS automático, y **despliegue automático con GitHub Actions**: la imagen se construye en GitHub, se sube a **GHCR** y el servidor solo hace `docker compose pull && docker compose up -d`. El SSH del servidor usa el **puerto 2222**.

Reglas por los recursos limitados:

- **Nunca hacer `bun install` ni `next build` en el servidor**: 1 vCPU y 2 GB no bastan con holgura. Todo el build ocurre en GitHub Actions.
- Imagen liviana con **multi-stage**: etapa de build (bun) que ejecuta `bun install --frozen-lockfile` + `bun run build`; etapa final con una base mínima de Node (p. ej. `node:22-alpine` o `node:22-slim`) que copia **solo** `.next/standalone` (~99 MB, ya incluye `.next/static` y `public` gracias al script `build`) y arranca con `node server.js` como usuario no root. Usar `.dockerignore` para no enviar `node_modules`, `.next`, `upload/`, `docs/`, `.git`.
- `sharp` (optimizador de imágenes) tiene binarios nativos: instalar dependencias en una etapa con el mismo SO/libc que la imagen final (Alpine ↔ Alpine, Debian ↔ Debian) y construir para la arquitectura del VPS (normalmente `linux/amd64`).
- La app es **sin estado**: no necesita volúmenes ni base de datos; se puede reemplazar el contenedor libremente.
- Variables: `NODE_ENV=production`, `PORT=3000`, `HOSTNAME=0.0.0.0`, opcional `NEXT_TELEMETRY_DISABLED=1`.
- **Caddy**: crear un `Caddyfile` de producción (`dominio { reverse_proxy app:3000 }`), con Caddy en el mismo `docker-compose.yml` y volúmenes para `/data` y `/config` (certificados). Solo Caddy publica puertos (80/443); el contenedor de la app no expone puertos al host.
- **GitHub Actions**: job de build+push a `ghcr.io/<owner>/<repo>` (con cache de capas) y job de deploy por SSH (`-p 2222`) que ejecuta `docker compose pull && docker compose up -d && docker image prune -f`. Secretos: host, usuario, llave SSH, y un token con `read:packages` en el servidor si el paquete GHCR es privado.
- Limitar memoria del contenedor de Node (p. ej. `mem_limit` ~512 MB) para dejar margen al sistema y a Caddy.
