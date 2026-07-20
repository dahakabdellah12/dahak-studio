import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Timeline } from "@/components/home/timeline";
import { Skills } from "@/components/home/skills";
import { getProjects } from "@/lib/data/projects-store";
import type { Project } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "الرئيسية",
  description:
    "معرض أعمال ومشاريع تطوير البرمجيات — DAHAK Studio",
};

async function getGitHubStats() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { githubRepos: 0, githubStars: 0, githubCommits: 0 };
  try {
    const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated&type=public", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { githubRepos: 0, githubStars: 0, githubCommits: 0 };
    const repos: { fork: boolean; stargazers_count: number; size: number }[] = await res.json();
    const nonFork = repos.filter((r) => !r.fork && r.size > 0);
    const githubRepos = nonFork.length;
    const githubStars = nonFork.reduce((s, r) => s + r.stargazers_count, 0);
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
    } catch { /* keep 0 */ }
    return { githubRepos, githubStars, githubCommits };
  } catch {
    return { githubRepos: 0, githubStars: 0, githubCommits: 0 };
  }
}

export default async function Home() {
  let projects: Project[] = [];
  let githubStats = { githubRepos: 0, githubStars: 0, githubCommits: 0 };
  try {
    [projects, githubStats] = await Promise.all([getProjects(), getGitHubStats()]);
  } catch { /* keep defaults */ }

  const featured = projects.filter((p) => p.featured);
  const totalProjects = projects.length;

  return (
    <>
      <Hero />
      <Stats totalProjects={totalProjects} {...githubStats} />
      <FeaturedProjects projects={featured} />
      <Skills />
      <Timeline />
    </>
  );
}
