import Link from "next/link";
import { getProjects } from "@/lib/data/projects-store";
import { FolderGit2, Plus, ExternalLink, Share2 } from "lucide-react";

export default async function DashboardPage() {
  const projects = await getProjects();

  const totalProjects = projects.length;
  const releasedCount = projects.filter((p) => p.status === "released").length;
  const inDevCount = projects.filter((p) => p.status === "in-development").length;
  const featuredCount = projects.filter((p) => p.featured).length;

  const stats = [
    { label: "إجمالي المشاريع", value: totalProjects, color: "text-cyan" },
    { label: "صادر", value: releasedCount, color: "text-emerald-400" },
    { label: "قيد التطوير", value: inDevCount, color: "text-yellow-neon" },
    { label: "مميزة", value: featuredCount, color: "text-magenta" },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-bold tracking-[0.2em] text-cyan/70 uppercase">
            // لوحة التحكم
          </p>
          <h1 className="text-2xl font-bold">مرحباً، Dahak</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            إدارة مشاريعك من مكان واحد
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 rounded border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition-all hover:bg-cyan/20 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <Plus className="h-4 w-4" />
            مشروع جديد
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-cyan/20 hover:text-cyan"
          >
            <ExternalLink className="h-4 w-4" />
            عرض الموقع
          </Link>
          <Link
            href="/dashboard/social"
            className="inline-flex items-center gap-2 rounded border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-cyan/20 hover:text-cyan"
          >
            <Share2 className="h-4 w-4" />
            وسائل التواصل
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card relative cursor-pointer rounded border p-5 transition-all hover:border-cyan/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.05)]"
          >
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan/30" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan/30" />
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`mt-2 font-mono text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded border">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold">آخر المشاريع</h2>
          <Link
            href="/dashboard/projects"
            className="text-xs text-muted-foreground transition-colors hover:text-cyan"
          >
            عرض الكل
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderGit2 className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              لا توجد مشاريع بعد
            </p>
            <Link
              href="/dashboard/projects/new"
              className="mt-3 text-sm text-cyan hover:underline"
            >
              أضف مشروعك الأول
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-secondary/30"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {project.category} · {project.status}
                  </p>
                </div>
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="text-xs text-muted-foreground transition-colors hover:text-cyan"
                >
                  تعديل
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
