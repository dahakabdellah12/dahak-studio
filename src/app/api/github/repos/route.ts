import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data/projects-store";
import type { GitHubRepo } from "@/lib/types";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }

  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=updated&type=public",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 502 });
  }

  const allRepos: GitHubRepo[] = await res.json();
  const existingProjects = await getProjects();
  const importedIds = new Set(
    existingProjects.map((p) => p.githubRepoId).filter((id): id is number => id != null)
  );

  const repos = allRepos
    .filter((r) => !r.fork && r.size > 0)
    .map((r) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      description: r.description,
      html_url: r.html_url,
      language: r.language,
      stargazers_count: r.stargazers_count,
      topics: r.topics,
      license: r.license?.spdx_id ?? null,
      pushed_at: r.pushed_at,
      created_at: r.created_at,
      archived: r.archived,
      size: r.size,
      alreadyImported: importedIds.has(r.id),
    }));

  return NextResponse.json(repos);
}
