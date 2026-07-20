import { ProjectsList } from "@/components/projects/projects-list";
import type { Project } from "@/lib/types";

export const revalidate = 3600;

export const metadata = {
  title: "المشاريع",
  description: "جميع مشاريع DAHAK Studio",
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

export default async function ProjectsPage() {
  const projects = await fetchProjects();
  return <ProjectsList projects={projects} />;
}
