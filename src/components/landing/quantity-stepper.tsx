"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  variant?: "light" | "dark";
  ariaLabel?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
  size = "md",
  variant = "light",
  ariaLabel = "Cantidad",
}: QuantityStepperProps) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const isSm = size === "sm";
  const isDark = variant === "dark";

  const btnBase = `flex shrink-0 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40 ${
    isSm ? "h-9 w-8" : "h-11 w-10"
  } ${isDark ? "text-cream hover:bg-cream/10" : "text-forest hover:bg-forest/5"}`;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex select-none items-center overflow-hidden rounded-lg border ${
        isSm ? "h-9" : "h-11"
      } ${
        isDark
          ? "border-cream/25 bg-forest-deep/80"
          : "border-forest/20 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Disminuir cantidad"
        className={btnBase}
      >
        <Minus className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          if (!digits) {
            onChange(min);
            return;
          }
          onChange(clamp(parseInt(digits, 10)));
        }}
        onBlur={() => onChange(clamp(value))}
        aria-label={ariaLabel}
        className={`w-11 shrink-0 border-0 bg-transparent p-0 text-center text-sm font-bold focus:outline-none ${
          isDark ? "text-cream" : "text-forest"
        }`}
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Aumentar cantidad"
        className={btnBase}
      >
        <Plus className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
      </button>
    </div>
  );
}
