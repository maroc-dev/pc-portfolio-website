import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { SITE_URL } from "@/lib/site";

/** The home page, the résumé and every project page, so search engines find them all. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/resume/Marco_Ferreira_Resume_2026.pdf`, priority: 0.5 },
  ];
}
