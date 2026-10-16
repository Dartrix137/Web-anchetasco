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
  // Favicons generados desde public/fav2.png
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
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
