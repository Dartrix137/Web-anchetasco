"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Guarda al cargar la página los UTMs y click IDs de la URL (ver src/lib/attribution.ts). */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
