import type { MetadataRoute } from "next";

import { projetos } from "@/lib/projects-data";

const site = "https://marcelomouro.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site}/links`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Uma entrada por projeto. Sem isto o buscador só chegaria nelas pelo
    // link do card, e o conteúdo dos cases ficaria de fora do índice.
    ...projetos.map((p) => ({
      url: `${site}/projetos/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
