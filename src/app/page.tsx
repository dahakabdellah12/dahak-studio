import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Timeline } from "@/components/home/timeline";
import { Skills } from "@/components/home/skills";
import type { Project } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "DAHAK Studio — مطور برمجيات | تطبيقات سطح مكتب، محمولة، ألعاب",
  description:
    "DAHAK Studio (داهك ستوديو) — معرض مشاريع Dahak Abdellah لتطوير البرمجيات. تطبيقات سطح مكتب، تطبيقات محمولة، ألعاب، ومصادر مفتوحة من الجزائر.",
  alternates: {
    canonical: "https://dahak-studio.vercel.app",
  },
};

async function fetchProjects(): Promise<Project[]> {
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

async function fetchGitHubStats() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { githubRepos: 0, githubStars: 0, githubCommits: 0 };
  try {
    const reposRes = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated&type=public",
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" }, next: { revalidate: 3600 } }
    );
    if (!reposRes.ok) return { githubRepos: 0, githubStars: 0, githubCommits: 0 };
    const repos: { fork: boolean; stargazers_count: number; size: number }[] = await reposRes.json();
    const nonFork = repos.filter((r) => !r.fork && r.size > 0);
    let githubCommits = 0;
    try {
      const userRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      });
      if (userRes.ok) {
        const user = await userRes.json();
        const commitsRes = await fetch(
          `https://api.github.com/search/commits?q=author:${user.login}+author-date:>=2000-01-01&per_page=1`,
          { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.cloak-preview+json" }, next: { revalidate: 3600 } }
        );
        if (commitsRes.ok) {
          const data = await commitsRes.json();
          githubCommits = data.total_count || 0;
        }
      }
    } catch {}
    return { githubRepos: nonFork.length, githubStars: nonFork.reduce((s, r) => s + r.stargazers_count, 0), githubCommits };
  } catch {
    return { githubRepos: 0, githubStars: 0, githubCommits: 0 };
  }
}

export default async function Home() {
  const [projects, githubStats] = await Promise.all([fetchProjects(), fetchGitHubStats()]);
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <Hero />
      <Stats totalProjects={projects.length} {...githubStats} />
      <FeaturedProjects projects={featured} />
      <Skills />
      <Timeline />
    </>
  );
}
