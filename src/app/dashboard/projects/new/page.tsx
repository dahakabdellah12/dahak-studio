import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">مشروع جديد</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
