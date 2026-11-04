import { NextResponse, type NextRequest } from "next/server";
import {
  CONSENT_COOKIE_MAX_AGE,
  CONSENT_STORAGE_KEY,
  type ConsentValue,
} from "@/lib/cookie-consent";

/**
 * Guarda la decisión del banner de cookies en una cookie de 12 meses.
 * La cookie la pone el servidor (Set-Cookie) y no JavaScript, porque Safari (ITP)
 * borra a los 7 días las cookies y el localStorage escritos desde el navegador.
 * No es HttpOnly: el script de Consent Mode del <head> necesita leerla.
 */
export async function POST(request: NextRequest) {
  let value: unknown;
  try {
    ({ value } = await request.json());
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }
  if (value !== "granted" && value !== "denied") {
    return NextResponse.json({ error: "Valor de consentimiento inválido" }, { status: 400 });
  }

  // Detrás de Caddy la petición llega por http; el protocolo real viene en X-Forwarded-Proto
  const protocol =
    request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(CONSENT_STORAGE_KEY, value satisfies ConsentValue, {
    maxAge: CONSENT_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: protocol === "https",
  });
  return response;
}
