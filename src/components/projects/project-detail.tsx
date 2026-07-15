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
} from "lucide-react";
import { GithubIcon } from "@/components/social-icons";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

function getStatusColor(status: Project["status"]) {
  switch (status) {
    case "released":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "in-development":
      return "bg-blue/10 text-blue border-blue/20";
    case "beta":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "archived":
      return "bg-muted text-muted-foreground border-border";
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
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                <p className="mt-1 text-sm text-muted-foreground">
                  الإصدار {project.version}
                </p>
              )}
            </div>
            <Badge
              variant="outline"
              className={`w-fit capitalize ${getStatusColor(project.status)}`}
            >
              {getStatusLabel(project.status)}
            </Badge>
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
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue px-5 text-sm font-medium text-white shadow-lg shadow-blue/25 transition-all hover:bg-blue-light hover:scale-[1.02] active:scale-[0.98]"
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
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 text-sm font-medium transition-all hover:bg-secondary"
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
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 text-sm font-medium transition-all hover:bg-secondary"
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
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 text-sm font-medium transition-all hover:bg-secondary"
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
                  className="glass-card overflow-hidden rounded-xl transition-all hover:ring-2 hover:ring-blue/30"
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
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
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
                    className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
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
                    className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </>
              )}

              <img
                src={screenshots[lightboxIndex]}
                alt={`${project.name} - لقطة شاشة ${lightboxIndex + 1}`}
                className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
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
                <h2 className="mb-4 text-xl font-semibold">عن المشروع</h2>
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
                <h2 className="mb-4 text-xl font-semibold">المميزات</h2>
                <ul className="space-y-2">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue rotate-180" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {project.changelog && project.changelog.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="mb-4 text-xl font-semibold">سجل التغييرات</h2>
                <div className="space-y-6">
                  {project.changelog.map((entry) => (
                    <div key={entry.version} className="glass-card rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">الإصدار {entry.version}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString("ar-SA", {
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
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                التفاصيل
              </h3>
              <div className="space-y-3 text-sm">
                {project.version && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الإصدار</span>
                    <span>{project.version}</span>
                  </div>
                )}
                {project.lastUpdated && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">آخر تحديث</span>
                    <span>
                      {new Date(project.lastUpdated).toLocaleDateString("ar-SA", {
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
                    <span>{project.downloads.toLocaleString("ar-SA")}</span>
                  </div>
                )}
                {project.stars !== undefined && project.stars > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">النجوم</span>
                    <span>{project.stars.toLocaleString("ar-SA")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                المنصات
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.platforms.map((p) => (
                  <Badge key={p} variant="secondary" className="capitalize">
                    {p === "multi" ? "متعدد المنصات" : p === "windows" ? "ويندوز" : p === "android" ? "أندرويد" : p === "linux" ? "لينكس" : p === "web" ? "ويب" : p === "ios" ? "آيوس" : p}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                التقنيات
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
