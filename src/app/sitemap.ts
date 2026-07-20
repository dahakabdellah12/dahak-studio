import type { MetadataRoute } from "next";

const BASE_URL = "https://dahak-studio.vercel.app";

async function fetchProjects(): Promise<{ slug: string; lastUpdated?: string }[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";
    if (!token || !repo) return [];
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/data/projects.json?ref=${branch}`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const file = await res.json();
    if (file.encoding !== "base64" || !file.content) return [];
    const binary = atob(file.content.replace(/\n/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return JSON.parse(new TextDecoder("utf-8").decode(bytes));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await fetchProjects();

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/legal`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const projectRoutes = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: p.lastUpdated ? new Date(p.lastUpdated) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectRoutes];
}
