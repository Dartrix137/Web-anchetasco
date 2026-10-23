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

const SITE_URL = "https://anchetasco.com";

// Contenedor de Google Tag Manager (tracking)
const GTM_ID = "GTM-MCXWQXHN";

export const metadata: Metadata = {
  // Base para convertir en absolutas las URLs de Open Graph, canonical, etc.
  metadataBase: new URL(SITE_URL),
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
  alternates: {
    canonical: "/",
  },
  // Vista previa al compartir el enlace (WhatsApp, Facebook, LinkedIn…).
  // public/og-image.jpg: 1200×630, generada desde hero.png + logo_brand.png
  openGraph: {
    title: "Ancheta & Co. | Detalles Corporativos Navidad 2026",
    description: "Regala una ancheta que perdure. Encuentra el detalle para tu equipo y clientes.",
    url: "/",
    siteName: "Ancheta & Co.",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ancheta & Co. — anchetas navideñas corporativas en maletines reutilizables",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ancheta & Co. | Detalles Corporativos Navidad 2026",
    description: "Regala una ancheta que perdure. Encuentra el detalle para tu equipo y clientes.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        <Toaster />
        <Sonner position="bottom-right" richColors />
      </body>
    </html>
  );
}
