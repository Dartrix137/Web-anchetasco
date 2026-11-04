import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { QUOTE_ID_PATTERN } from "@/lib/attribution";

/**
 * Recibe la atribución de una cotización desde el navegador (src/lib/attribution.ts)
 * y la reenvía al Worker de Cloudflare (D1) con la clave privada.
 *
 * Variables de entorno (en /home/deploy/app/.env del VPS, nunca en el navegador):
 *   ATTRIBUTION_WORKER_URL     URL completa del endpoint del Worker (POST /quote)
 *   ATTRIBUTION_WORKER_SECRET  Clave privada; se envía en la cabecera "X-API-Key"
 *
 * Si faltan, la ruta responde 204 sin hacer nada: la cotización por WhatsApp no depende de esto.
 */

const WORKER_TIMEOUT_MS = 5000;

const text = z
  .string()
  .max(500)
  .nullish()
  .transform((value) => value?.trim() || null);

const payloadSchema = z.object({
  quote_id: z.string().regex(QUOTE_ID_PATTERN),
  consent_granted: z.boolean(),
  utm: z.object({ source: text, medium: text, campaign: text, content: text, term: text }),
  landing_page: text,
  referrer: text,
  page_url: text,
  ads: z.object({
    gclid: text,
    gbraid: text,
    wbraid: text,
    fbclid: text,
    fbp: text,
    fbc: text,
  }),
  ga: z.object({ client_id: text, session_id: text }),
});

// Límite sencillo por IP (en memoria; un solo contenedor) para que no llenen D1 con basura
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

/** IP del visitante. Caddy reemplaza X-Forwarded-For con la IP real (no confía en la del cliente). */
function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",").pop()?.trim() || request.headers.get("x-real-ip");
  return ip || null;
}

/** Solo se aceptan peticiones del propio sitio. */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

async function postToWorker(url: string, secret: string, body: string): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": secret },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(WORKER_TIMEOUT_MS),
  });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

  const ip = clientIp(request);
  if (ip && isRateLimited(ip)) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  let parsed: z.infer<typeof payloadSchema>;
  try {
    const result = payloadSchema.safeParse(await request.json());
    if (!result.success) {
      return NextResponse.json({ error: "Datos de atribución inválidos" }, { status: 400 });
    }
    parsed = result.data;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const workerUrl = process.env.ATTRIBUTION_WORKER_URL;
  const workerSecret = process.env.ATTRIBUTION_WORKER_SECRET;
  if (!workerUrl || !workerSecret) {
    console.warn("[quote-attribution] Falta ATTRIBUTION_WORKER_URL o ATTRIBUTION_WORKER_SECRET");
    return new NextResponse(null, { status: 204 });
  }

  const granted = parsed.consent_granted;
  // Contrato con el Worker: solo los campos que guarda hoy en D1 (quote_id es la clave
  // primaria). El navegador también manda gbraid, wbraid, fbclid, landing_page, referrer
  // y page_url, y aquí están la IP y el user agent: no se envían hasta que el Worker los
  // admita (ver docs/tracking-cotizaciones.md).
  const body = JSON.stringify({
    quote_id: parsed.quote_id,
    utm_source: parsed.utm.source,
    utm_medium: parsed.utm.medium,
    utm_campaign: parsed.utm.campaign,
    utm_content: parsed.utm.content,
    utm_term: parsed.utm.term,
    // El navegador ya los manda en null sin consentimiento; se refuerza aquí
    gclid: granted ? parsed.ads.gclid : null,
    fbp: granted ? parsed.ads.fbp : null,
    fbc: granted ? parsed.ads.fbc : null,
    ga_client_id: granted ? parsed.ga.client_id : null,
    ga_session_id: granted ? parsed.ga.session_id : null,
  });

  // Un reintento si falla la red o el Worker responde 5xx
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await postToWorker(workerUrl, workerSecret, body);
      if (response.ok) return new NextResponse(null, { status: 204 });
      const detail = (await response.text().catch(() => "")).slice(0, 300);
      console.error(
        `[quote-attribution] Worker respondió ${response.status} para ${parsed.quote_id}: ${detail}`
      );
      if (response.status < 500) break;
    } catch (error) {
      console.error(
        `[quote-attribution] Error al contactar el Worker para ${parsed.quote_id} (intento ${attempt}):`,
        error instanceof Error ? error.message : error
      );
    }
  }
  return NextResponse.json({ error: "No se pudo registrar la atribución" }, { status: 502 });
}
