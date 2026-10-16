# syntax=docker/dockerfile:1
#
# Imagen de producción de la landing Ancheta & Co. (Next.js standalone).
# Se construye en GitHub Actions; el VPS solo hace pull de la imagen final.
#
# Todas las etapas usan Alpine (musl) para que los binarios nativos de
# `sharp` (optimizador de imágenes) instalados en el build sean los mismos
# que necesita la imagen final.

ARG NODE_IMAGE=node:24-alpine
ARG BUN_IMAGE=oven/bun:1.3.14-alpine

# Binario de bun (el gestor de paquetes del proyecto, ver bun.lock)
FROM ${BUN_IMAGE} AS bun

# ---------- 1. Dependencias ----------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---------- 2. Build ----------
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# `bun run build` = next build + copia de .next/static y public/ dentro de .next/standalone
RUN bun run build

# ---------- 3. Imagen final ----------
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# El usuario `node` (uid 1000) ya existe en la imagen oficial. La app necesita
# poder escribir en .next/cache (caché del optimizador de imágenes).
RUN chown node:node /app
COPY --from=builder --chown=node:node /app/.next/standalone ./

USER node
EXPOSE 3000

CMD ["node", "server.js"]
