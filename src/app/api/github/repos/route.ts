import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data/projects-store";
import type { GitHubRepo } from "@/lib/types";

async function fetchReadme(owner: string, repo: string, token: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.encoding === "base64" && data.content) {
      const binaryStr = atob(data.content.replace(/\n/g, ""));
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      return new TextDecoder("utf-8").decode(bytes);
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchLatestRelease(owner: string, repo: string, token: string): Promise<{ tag: string; date: string | null } | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    if (res.ok) {
      const data = await res.json();
      return { tag: data.tag_name, date: data.published_at?.split("T")[0] || null };
    }
    // Fallback: fetch latest tag if no release exists
    const tagsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/tags?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    if (tagsRes.ok) {
      const tags = await tagsRes.json();
      if (Array.isArray(tags) && tags.length > 0 && typeof tags[0].name === "string") {
        return { tag: tags[0].name, date: null };
      }
    }
    return null;
  } catch {
    return null;
  }
}

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

  const filteredRepos = allRepos.filter((r) => !r.fork && r.size > 0);

  const repos = await Promise.all(
    filteredRepos.map(async (r) => {
      const [readme, release] = await Promise.all([
        fetchReadme(r.owner.login, r.name, token),
        fetchLatestRelease(r.owner.login, r.name, token),
      ]);

      return {
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        readme: readme?.substring(0, 5000) || null,
        html_url: r.html_url,
        language: r.language,
        stargazers_count: r.stargazers_count,
        topics: r.topics,
        license: r.license?.spdx_id ?? null,
        pushed_at: r.pushed_at,
        created_at: r.created_at,
        archived: r.archived,
        size: r.size,
        latestVersion: release?.tag || null,
        latestReleaseDate: release?.date || null,
        alreadyImported: importedIds.has(r.id),
      };
    })
  );

  return NextResponse.json(repos);
}
