import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import type { Project } from "@/lib/types";

const SITE_URL = "https://dahak-studio.vercel.app";

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
    title: `${project.name} — DAHAK Studio | داهك ستوديو`,
    description: project.shortDescription,
    alternates: {
      canonical: `https://dahak-studio.vercel.app/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.name} — DAHAK Studio`,
      description: project.shortDescription,
      url: `https://dahak-studio.vercel.app/projects/${project.slug}`,
      images: project.thumbnail ? [{ url: project.thumbnail, width: 1200, height: 630, alt: project.name }] : undefined,
    },
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "المشاريع", item: `${SITE_URL}/projects` },
      { "@type": "ListItem", position: 3, name: project.name, item: `${SITE_URL}/projects/${project.slug}` },
    ],
  };

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.shortDescription,
    url: `${SITE_URL}/projects/${project.slug}`,
    codeRepository: project.githubUrl || undefined,
    programmingLanguage: project.technologies[0] || undefined,
    runtimePlatform: project.platforms.join(", "),
    license: project.license || undefined,
    author: {
      "@type": "Person",
      name: "Dahak Abdellah",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectDetail project={project} />
    </>
  );
}
