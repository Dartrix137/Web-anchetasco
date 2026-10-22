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
    sitemap.ts           # /sitemap.xml (una sola URL: https://anchetasco.com/)
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

Logo y favicon:
- `public/logo_brand.png` (3651×1545, ≈2,36:1) es el logo de Ancheta & Co. en el header (caja 132×56). En el footer, el recuadro de logos corporativos muestra `public/brands/Logo-Nativity-World.webp` (252×75, caja 148×44) y `public/brands/pesebre-logo-96.webp` (96×96 generado con sharp desde `Pesebre-logo.webp`, con `unoptimized`: la variante w=96 del optimizador se colgaba en producción). Si cambia la proporción de un logo, ajustar su caja para que la imagen la llene (usan `fill` + `object-contain`).
- Favicons generados con sharp desde `public/fav2.png` (fuente 1210×1210), recortados al anillo verde: `favicon-32x32.png` y `favicon-192x192.png` (círculo con esquinas transparentes) y `apple-touch-icon.png` (180×180, fondo blanco). Declarados en `metadata.icons` de `src/app/layout.tsx`. Si cambia el favicon, regenerar los tres.

SEO (`metadata` en `src/app/layout.tsx`):
- `metadataBase` = `https://anchetasco.com` (convierte en absolutas las URLs de canonical y Open Graph) y `alternates.canonical: "/"`.
- Vista previa al compartir (Open Graph + Twitter `summary_large_image`): `public/og-image.jpg`, 1200×630, ~100 KB (WhatsApp ignora imágenes muy pesadas). Se generó con sharp a partir de `hero.png` con `logo_brand.png` encima a la izquierda; si cambian el hero o el logo, regenerarla.
- `public/robots.txt` permite todo y apunta a `/sitemap.xml` (generado por `src/app/sitemap.ts`). No crear `src/app/robots.ts` mientras exista `public/robots.txt` (Next da conflicto).

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

Guía paso a paso para el operador: **`DEPLOY.md`**. Resumen técnico:

**Servidor:** VPS Bluehost, Ubuntu 26.04, 1 vCPU, 2 GB RAM + 2 GB swap, IP `50.6.206.188`. Usuario `deploy` (grupo docker), SSH solo con llave en el **puerto 2222** (el 22 queda para la consola web de Bluehost). ufw: 22, 2222, 80, 443. App en `/home/deploy/app` (`docker-compose.yml`, `Caddyfile`, `.env`).

**Flujo:** push a `main` (o `workflow_dispatch`) → `.github/workflows/deploy.yml` construye la imagen en GitHub → la sube a `ghcr.io/dartrix137/web-anchetasco` con tags `latest` y SHA corto (7 caracteres) → por SSH copia `deploy/docker-compose.yml` y `deploy/Caddyfile` al servidor → `docker compose pull && up -d --remove-orphans` → recarga Caddy → `docker image prune -f`. Los despliegues están serializados (`concurrency`).

| Archivo | Qué hace |
|---|---|
| `Dockerfile` | Multi-stage, todo Alpine: `oven/bun` aporta el binario de bun → `bun install --frozen-lockfile` → `bun run build` en `node:24-alpine` → imagen final `node:24-alpine` con solo `.next/standalone`, usuario `node` (no root), `node server.js` en `0.0.0.0:3000`. |
| `.dockerignore` | Excluye `.git`, `node_modules`, `.next`, `.env*`, bases locales, `deploy/`, `docs/`, `*.md`, `upload/`. |
| `deploy/docker-compose.yml` | Proyecto `anchetasco`: `app` (imagen GHCR, solo `expose: 3000` en la red `web`, `mem_limit 512m`, `NODE_OPTIONS=--max-old-space-size=320`, healthcheck `wget` a `/api`) y `caddy` (`caddy:2`, **único con `ports:`** 80/443/443-udp, `mem_limit 256m`, volúmenes `caddy_data`/`caddy_config`). `restart: unless-stopped` en ambos. |
| `deploy/Caddyfile` | Snippet `(comun)`: `encode zstd gzip`, cabeceras de seguridad, `reverse_proxy app:3000`. Sitio `anchetasco.com` con HTTPS automático (Let's Encrypt) y HSTS; `www` y el acceso por IP (`:80`) redirigen a `https://anchetasco.com`. |
| `deploy/.env.example` | Solo `APP_IMAGE`. La app no necesita secretos. |
| `.github/workflows/deploy.yml` | Job `build` (buildx, caché `type=gha`, `linux/amd64`, `GITHUB_TOKEN` para GHCR) y job `deploy` (`ssh`/`scp` nativos con `ssh-keyscan`; sin acciones de terceros para SSH). Secrets: `SSH_HOST`, `SSH_PORT`, `SSH_USER`, `SSH_KEY`. |

Decisiones y reglas:

- **Nunca hacer `bun install` ni `next build` en el servidor**: no hay RAM suficiente. Todo el build ocurre en GitHub Actions.
- **Docker se salta ufw**: ningún servicio salvo Caddy puede usar `ports:`. Si se añade otro servicio (p. ej. una base de datos), usar solo `expose:`/red interna.
- `next.config.ts` tiene `compress: false`: la compresión la hace Caddy (zstd/gzip) y Node no gasta CPU en ella.
- El servidor siempre despliega `latest`. Así la imagen anterior queda sin tag y `docker image prune -f` la borra. Rollback temporal: `APP_TAG=<sha> docker compose pull app && APP_TAG=<sha> docker compose up -d app`. El siguiente push vuelve a `latest`.
- `deploy/docker-compose.yml` y `deploy/Caddyfile` se sobrescriben en cada despliegue: se editan en el repo, nunca en el servidor. El `.env` del servidor no lo toca el workflow.
- Sin estado y sin base de datos: no hay migraciones ni backups de datos. El único volumen importante es `caddy_data` (certificados de Let's Encrypt).
- `sharp` requiere que dependencias e imagen final compartan libc (Alpine/musl en todas las etapas) y arquitectura (`linux/amd64`, como el VPS).
- Dominio: `anchetasco.com` (Bluehost, nameservers de Bluehost), registros A de `@` y `www` → `50.6.206.188`. Sin AAAA.
