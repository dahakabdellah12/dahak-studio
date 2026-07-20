"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Download,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  Monitor,
  Smartphone,
  Terminal,
  Globe,
  Layers,
  FileText,
} from "lucide-react";
import { GithubIcon } from "@/components/social-icons";
import type { Project } from "@/lib/types";

function getStatusColor(status: Project["status"]) {
  switch (status) {
    case "released":
      return "border-emerald-500/30 text-emerald-400 bg-emerald-500/5";
    case "in-development":
      return "border-cyan/30 text-cyan bg-cyan/5";
    case "beta":
      return "border-yellow-neon/30 text-yellow-neon bg-yellow-neon/5";
    case "archived":
      return "border-border text-muted-foreground bg-secondary/50";
  }
}

function getStatusLabel(status: Project["status"]) {
  switch (status) {
    case "released": return "صادر";
    case "in-development": return "قيد التطوير";
    case "beta": return "تجريبي";
    case "archived": return "مؤرشف";
  }
}

const platformInfo: Record<string, { label: string; icon: typeof Monitor; color: string }> = {
  windows: { label: "ويندوز", icon: Monitor, color: "text-blue-400" },
  android: { label: "أندرويد", icon: Smartphone, color: "text-emerald-400" },
  linux: { label: "لينكس", icon: Terminal, color: "text-yellow-neon" },
  web: { label: "ويب", icon: Globe, color: "text-cyan" },
  ios: { label: "آيوس", icon: Smartphone, color: "text-muted-foreground" },
  multi: { label: "متعدد المنصات", icon: Layers, color: "text-magenta" },
};

export function ProjectDetail({ project }: { project: Project }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const screenshots = project.screenshots ?? [];

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/projects"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cyan"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            جميع المشاريع
          </Link>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {project.name}
              </h1>
              {project.version && (
                <p className="mt-1 font-mono text-sm text-cyan/60">
                  v{project.version}
                </p>
              )}
            </div>
            <span
              className={`w-fit rounded border px-3 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
            >
              {getStatusLabel(project.status)}
            </span>
          </div>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {project.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.downloadUrl && (
              <a
                href={project.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded border border-cyan/40 bg-cyan/10 px-5 text-sm font-bold tracking-wider text-cyan uppercase transition-all hover:bg-cyan/20 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
              >
                <Download className="h-4 w-4" />
                تنزيل
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded border border-border bg-secondary/50 px-5 text-sm font-medium transition-all hover:border-cyan/20 hover:text-cyan"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
              </a>
            )}
            {project.websiteUrl && (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded border border-border bg-secondary/50 px-5 text-sm font-medium transition-all hover:border-cyan/20 hover:text-cyan"
              >
                <ExternalLink className="h-4 w-4" />
                الموقع
              </a>
            )}
            {project.docsUrl && (
              <a
                href={project.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded border border-border bg-secondary/50 px-5 text-sm font-medium transition-all hover:border-cyan/20 hover:text-cyan"
              >
                <BookOpen className="h-4 w-4" />
                التوثيق
              </a>
            )}
          </div>
        </motion.div>

        {screenshots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-12"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {screenshots.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="glass-card overflow-hidden rounded border transition-all hover:border-cyan/30"
                >
                  <img
                    src={src}
                    alt={`${project.name} - لقطة شاشة ${i + 1}`}
                    className="w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded border border-border bg-background/50 text-foreground transition-colors hover:border-cyan/30 hover:text-cyan"
              >
                <X className="h-5 w-5" />
              </button>

              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(
                        lightboxIndex > 0 ? lightboxIndex - 1 : screenshots.length - 1
                      );
                    }}
                    className="absolute right-4 flex h-10 w-10 items-center justify-center rounded border border-border bg-background/50 text-foreground transition-colors hover:border-cyan/30 hover:text-cyan"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(
                        lightboxIndex < screenshots.length - 1 ? lightboxIndex + 1 : 0
                      );
                    }}
                    className="absolute left-4 flex h-10 w-10 items-center justify-center rounded border border-border bg-background/50 text-foreground transition-colors hover:border-cyan/30 hover:text-cyan"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </>
              )}

              <img
                src={screenshots[lightboxIndex]}
                alt={`${project.name} - لقطة شاشة ${lightboxIndex + 1}`}
                className="max-h-[85vh] max-w-[90vw] rounded object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            {project.fullDescription && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-cyan uppercase">
                  // عن المشروع
                </h2>
                <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                  {project.fullDescription}
                </p>
              </motion.section>
            )}

            {project.features && project.features.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-cyan uppercase">
                  // المميزات
                </h2>
                <ul className="space-y-2">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan rotate-180" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {project.notes && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-cyan uppercase">
                  // ملاحظات
                </h2>
                <div className="glass-card rounded border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-cyan/60" />
                    <span className="text-xs text-cyan/60 font-mono">NOTES</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {project.notes}
                  </p>
                </div>
              </motion.section>
            )}

            {project.changelog && project.changelog.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-cyan uppercase">
                  // سجل التغييرات
                </h2>
                <div className="space-y-6">
                  {project.changelog.map((entry) => (
                    <div key={entry.version} className="glass-card rounded border p-4">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="rounded border border-cyan/20 bg-cyan/5 px-2 py-0.5 font-mono text-xs text-cyan">
                          v{entry.version}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {entry.changes.map((change, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            - {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card relative rounded border p-5 space-y-4">
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
              <h3 className="text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
                التفاصيل
              </h3>
              <div className="space-y-3 text-sm">
                {project.version && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الإصدار</span>
                    <span className="font-mono text-cyan/80">{project.version}</span>
                  </div>
                )}
                {project.lastUpdated && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">آخر تحديث</span>
                    <span>
                      {new Date(project.lastUpdated).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {project.license && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الرخصة</span>
                    <span>{project.license}</span>
                  </div>
                )}
                {project.downloads !== undefined && project.downloads > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">التنزيلات</span>
                    <span>{project.downloads.toLocaleString("en-US")}</span>
                  </div>
                )}
                {project.stars !== undefined && project.stars > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">النجوم</span>
                    <span>{project.stars.toLocaleString("en-US")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card rounded border p-5 space-y-3">
              <h3 className="text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
                المنصات
              </h3>
              <div className="space-y-2">
                {project.platforms.map((p) => {
                  const info = platformInfo[p] || { label: p, icon: Monitor, color: "text-muted-foreground" };
                  const Icon = info.icon;
                  return (
                    <div key={p} className="flex items-center gap-2.5 rounded border border-border bg-secondary/30 px-3 py-2">
                      <Icon className={`h-4 w-4 ${info.color}`} />
                      <span className="text-sm">{info.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded border p-5 space-y-3">
              <h3 className="text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
                التقنيات
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
