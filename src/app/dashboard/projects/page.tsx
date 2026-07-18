import Link from "next/link";
import { getProjects } from "@/lib/data/projects-store";
import { Plus, Pencil } from "lucide-react";
import { DeleteProjectButton } from "./delete-button";

export default async function ProjectsListPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-bold tracking-[0.2em] text-cyan/70 uppercase">
            // إدارة المشاريع
          </p>
          <h1 className="text-2xl font-bold">إدارة المشاريع</h1>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition-all hover:bg-cyan/20 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
        >
          <Plus className="h-4 w-4" />
          مشروع جديد
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card rounded border py-16 text-center">
          <p className="text-muted-foreground">لا توجد مشاريع بعد</p>
          <Link
            href="/dashboard/projects/new"
            className="mt-3 inline-block text-sm text-cyan hover:underline"
          >
            أضف مشروعك الأول
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card relative rounded border p-4 transition-all hover:border-cyan/20"
            >
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/20" />
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/20" />
              <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan/20" />
              <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan/20" />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    {project.featured && (
                      <span className="rounded border border-magenta/30 bg-magenta/5 px-2 py-0.5 text-[10px] text-magenta">
                        مميز
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {project.shortDescription || "بدون وصف"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {project.category}
                    </span>
                    <span className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {project.status}
                    </span>
                    {project.platforms.map((p) => (
                      <span
                        key={p}
                        className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground transition-all hover:border-cyan/30 hover:text-cyan"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteProjectButton id={project.id} name={project.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
