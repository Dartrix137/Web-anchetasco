import type { MetadataRoute } from "next";

// /sitemap.xml para buscadores (la landing es una sola página)
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://anchetasco.com/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
