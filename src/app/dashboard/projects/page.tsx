import Link from "next/link";
import { getProjects } from "@/lib/data/projects-store";
import { Plus, Pencil } from "lucide-react";
import { DeleteProjectButton } from "./delete-button";

export default async function ProjectsListPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة المشاريع</h1>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue/25 transition-all hover:bg-blue-light"
        >
          <Plus className="h-4 w-4" />
          مشروع جديد
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center">
          <p className="text-muted-foreground">لا توجد مشاريع بعد</p>
          <Link
            href="/dashboard/projects/new"
            className="mt-3 inline-block text-sm text-blue hover:underline"
          >
            أضف مشروعك الأول
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.featured && (
                    <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-500">
                      مميز
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {project.shortDescription || "بدون وصف"}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {project.category}
                  </span>
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {project.status}
                  </span>
                  {project.platforms.map((p) => (
                    <span
                      key={p}
                      className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteProjectButton id={project.id} name={project.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
