import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import { getProjectBySlug } from "@/lib/data/projects-store";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
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
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
