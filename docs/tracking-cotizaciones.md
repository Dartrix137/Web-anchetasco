# Tracking de cotizaciones (código COT-, Cloudflare D1, GTM)

Objetivo: saber qué campaña y anuncio generó cada cotización, para cruzarla después con los
pedidos pagados (Google Sheets) y enviar las compras a Meta por CAPI.

## Flujo

1. **Al entrar** (`src/components/landing/attribution-capture.tsx` → `captureAttribution()`):
   - UTMs (`utm_source/medium/campaign/content/term`) → `localStorage["quote-attribution"]`,
     último toque, 90 días. Una visita con UTMs o con click ID reemplaza al toque anterior;
     una visita directa no lo borra.
   - Click IDs de la URL (`gclid`, `gbraid`, `wbraid`, `fbclid`) → `sessionStorage` (solo la
     visita actual). Para visitas posteriores se usan las cookies que ponen las etiquetas con
     consentimiento (`_gcl_aw`, `_fbc`, `_fbp`).
2. **Al enviar el formulario** (`src/components/landing/quote-form.tsx` → `handleWhatsApp`):
   - Se genera el código `COT-` + 8 hex (`generateQuoteId()`), igual que el que hacía GTM.
   - Va en la **primera línea** del mensaje de WhatsApp: `Código de cotización: COT-XXXXXXXX`.
   - Se envía `quote_whatsapp_open` al `dataLayer` con `quote_id` (ver «Transición»).
   - Se envía la atribución a `POST /api/quote-attribution` (`fetch` con `keepalive`, sin
     esperar respuesta: WhatsApp abre igual aunque falle).
   - Si se reenvía el mismo formulario sin cambios, se reutiliza el código y no se repiten
     ni el evento ni el envío a D1.
3. **En el servidor** (`src/app/api/quote-attribution/route.ts`): valida, añade IP y
   user agent (solo con consentimiento) y lo reenvía al Worker con la clave privada.

## Consentimiento

Si el visitante **no** aceptó las cookies (`hasConsentGranted()`), solo se envían `quote_id`,
UTMs, `landing_page`, `referrer` y `event_source_url`. Van en `null`: `gclid`, `gbraid`,
`wbraid`, `fbclid`, `fbp`, `fbc`, `ga_client_id`, `ga_session_id`, `client_user_agent` y
`client_ip_address`. El servidor vuelve a anularlos aunque el navegador los mande.

## Contrato con el Worker

`POST https://anchetasco-attribution.cgiraldoidarraga.workers.dev/quote`
(`ATTRIBUTION_WORKER_URL`), cabeceras `Content-Type: application/json` y
`X-API-Key: ${ATTRIBUTION_WORKER_SECRET}`. Cuerpo (objeto plano, `null` si no hay dato):

```json
{
  "quote_id": "COT-3FA91C0B",
  "utm_source": "facebook", "utm_medium": "paid", "utm_campaign": "navidad26",
  "utm_content": "video1", "utm_term": null,
  "gclid": null,
  "fbp": "fb.1.1700000000000.123", "fbc": "fb.1.1700000000000.IwAR…",
  "ga_client_id": "123456789.1700000000", "ga_session_id": "1730740000"
}
```

`quote_id` es la clave primaria en D1.

Disponibles pero **aún no enviados** (el Worker no los guarda todavía; se añaden en el
`body` de `route.ts` cuando se amplíe D1): `gbraid`, `wbraid`, `fbclid`, `landing_page`,
`referrer`, `event_source_url` (llegan del navegador), `client_user_agent`, `client_ip_address`
y `consent_granted` (los arma el servidor). Para Meta CAPI con `action_source: "website"`,
Meta pide `client_user_agent` y `event_source_url`; la IP mejora el emparejamiento.

Respuestas: 2xx = OK. Con 5xx o error de red se reintenta una vez; con 4xx no (p. ej. un
`quote_id` repetido). Los fallos
quedan en `docker compose logs app | grep quote-attribution`.

El código tiene 32 bits: la probabilidad de que se repita con 1.000 cotizaciones es ~0,01 %.

## GTM: cambios necesarios

Contenedor `GTM-MCXWQXHN`.

1. **Pausar el tag HTML personalizado que envuelve `window.open`** (el que genera
   `COT-` y define `window.__anchetasWaListener`). No borrarlo hasta confirmar que todo funciona.
2. Las etiquetas que hoy se disparan con el evento personalizado `quote_whatsapp_open`
   (GA4 y el `fbq("track","Lead")`) **no cambian**: el evento sigue llegando, ahora desde Next,
   con `quote_id` y `whatsapp_destination: "cotizador"` como antes, más `quote_type`
   (`cotizacion`/`asesoria`), `value`, `currency` (`COP`) y `units`.
3. Recomendado:
   - En el evento GA4 `quote_whatsapp_open`, añadir el parámetro `quote_id` (variable de capa
     de datos `quote_id`, ya existe) y registrarlo como dimensión personalizada de evento.
   - En el `Lead` de Meta, pasar el código como ID del evento:
     `fbq("track","Lead",{…},{eventID:{{quote_id}}})`. Así, si algún día se envía también el
     Lead por CAPI, Meta lo deduplica.

### Transición (no importa el orden)

Mientras el tag viejo siga publicado, `pushQuoteEvent()` **no** envía el evento: lo envía ese
tag al llamar a `window.open`, con el código de Next (como ya va en el texto, no agrega otro).
Cuando se pausa el tag, `window.__anchetasWaListener` deja de existir y Next envía el evento.
Resultado: un solo código y un solo evento antes, durante y después del cambio en GTM.
Tras pausar el tag, se puede quitar ese `if` de `src/lib/attribution.ts`.

Diferencia con el tag viejo: si el navegador bloquea la ventana nueva y la página navega a
WhatsApp (`location.assign`), el tag viejo no se enteraba; ahora también se registra.

## Configuración en el servidor

Ver DEPLOY.md, sección 5, «Atribución de cotizaciones». Variables:
`ATTRIBUTION_WORKER_URL` y `ATTRIBUTION_WORKER_SECRET` en `/home/deploy/app/.env`.
