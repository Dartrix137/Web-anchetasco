import type { MetadataRoute } from "next";

// /sitemap.xml para buscadores (landing + política de datos)
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://anchetasco.com/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://anchetasco.com/politica-de-datos",
      lastModified: new Date("2026-10-26"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
