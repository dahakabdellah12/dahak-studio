import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data/projects-store";
import { ProjectForm } from "../../project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">تعديل: {project.name}</h1>
      <ProjectForm mode="edit" initial={project} />
    </div>
  );
}
