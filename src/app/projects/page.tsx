import { getProjects } from "@/lib/data/projects-store";
import { ProjectsList } from "@/components/projects/projects-list";

export const revalidate = 3600;

export const metadata = {
  title: "المشاريع",
  description: "جميع مشاريع DAHAK Studio",
};

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);
  return <ProjectsList projects={projects} />;
}
