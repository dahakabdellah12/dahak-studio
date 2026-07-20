import { NextResponse } from "next/server";

export const revalidate = 3600;

interface GitHubRepo {
  fork: boolean;
  stargazers_count: number;
  size: number;
}

interface GitHubSearchResult {
  total_count: number;
}

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github.v3+json",
});

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { githubRepos: 0, githubStars: 0, githubCommits: 0 },
      { status: 200 }
    );
  }

  try {
    const reposRes = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated&type=public",
      { headers: authHeaders(token), next: { revalidate: 3600 } }
    );

    let githubRepos = 0;
    let githubStars = 0;

    if (reposRes.ok) {
      const repos: GitHubRepo[] = await reposRes.json();
      const nonForkRepos = repos.filter((r) => !r.fork && r.size > 0);
      githubRepos = nonForkRepos.length;
      githubStars = nonForkRepos.reduce(
        (sum, r) => sum + r.stargazers_count,
        0
      );
    }

    let githubCommits = 0;

    try {
      const userRes = await fetch("https://api.github.com/user", {
        headers: authHeaders(token),
        next: { revalidate: 3600 },
      });
      if (userRes.ok) {
        const user = await userRes.json();
        const username: string = user.login;

        const commitsRes = await fetch(
          `https://api.github.com/search/commits?q=author:${username}+author-date:>=2000-01-01&per_page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.cloak-preview+json",
            },
            next: { revalidate: 3600 },
          }
        );
        if (commitsRes.ok) {
          const data: GitHubSearchResult = await commitsRes.json();
          githubCommits = data.total_count;
        }
      }
    } catch {
      // Commit count unavailable — keep 0
    }

    return NextResponse.json({ githubRepos, githubStars, githubCommits });
  } catch {
    return NextResponse.json(
      { githubRepos: 0, githubStars: 0, githubCommits: 0 },
      { status: 200 }
    );
  }
}
