import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ancheta & Co. | Detalles Corporativos Navidad 2026",
  description:
    "Regala una ancheta que perdure. Anchetas navideñas corporativas en maletín funcional y elegante para tu equipo y clientes. Cali, Colombia.",
  keywords: [
    "anchetas corporativas",
    "regalos empresariales navidad",
    "detalles corporativos",
    "anchetas Cali",
    "Nativity World",
  ],
  icons: {
    icon: "/logo_amp_sq.png",
  },
  openGraph: {
    title: "Ancheta & Co. | Detalles Corporativos Navidad 2026",
    description: "Regala una ancheta que perdure. Encuentra el detalle para tu equipo y clientes.",
    siteName: "Ancheta & Co.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <Sonner position="bottom-right" richColors />
      </body>
    </html>
  );
}
