import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // En producción comprime Caddy (zstd/gzip); así Node no gasta CPU en ello
  compress: false,
  // Oculta el botón flotante de dev tools (abajo-izquierda) para no tapar
  // el botón flotante de la campaña de personalización en el preview
  devIndicators: false,
};

export default nextConfig;
