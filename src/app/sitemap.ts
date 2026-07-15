import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dahakstudio.com";

  const staticPages = ["", "/projects", "/games", "/applications", "/open-source", "/about", "/contact"];

  const staticRoutes = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.lastUpdated ? new Date(project.lastUpdated) : new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
