import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import type { Project } from "@/lib/types";

export const revalidate = 3600;

async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";
    if (!token || !repo) return null;
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/data/projects.json?ref=${branch}`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const file = await res.json();
    if (file.encoding !== "base64" || !file.content) return null;
    const binary = atob(file.content.replace(/\n/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const projects: Project[] = JSON.parse(new TextDecoder("utf-8").decode(bytes));
    return projects.find((p) => p.slug === slug) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.name} - DAHAK Studio`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
