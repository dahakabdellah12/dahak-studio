"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Download, Calendar } from "lucide-react";
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

function getPlatformIcons(platforms: Project["platforms"]) {
  return platforms
    .map((p) => {
      switch (p) {
        case "windows": return "ويندوز";
        case "android": return "أندرويد";
        case "linux": return "لينكس";
        case "web": return "ويب";
        case "ios": return "آيوس";
        case "multi": return "متعدد";
        default: return p;
      }
    })
    .join(" · ");
}

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="glass-card group relative flex h-full flex-col overflow-hidden rounded border transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.08)]"
      >
        <div className="absolute top-0 left-0 h-3 w-3 border-t border-l border-cyan/30" />
        <div className="absolute top-0 right-0 h-3 w-3 border-t border-r border-cyan/30" />
        <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-cyan/30" />
        <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan/30" />

        {project.thumbnail ? (
          <div className="relative aspect-video overflow-hidden bg-secondary/30">
            <img
              src={project.thumbnail}
              alt={project.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="scanlines pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-20" />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-cyan/5 via-transparent to-magenta/5">
            <div className="flex h-16 w-16 items-center justify-center rounded border border-cyan/20 bg-cyan/5 text-2xl font-bold text-cyan transition-all group-hover:border-cyan/40 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              {project.name.charAt(0)}
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground transition-colors group-hover:text-cyan">
              {project.name}
            </h3>
            <span
              className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-medium ${getStatusColor(project.status)}`}
            >
              {getStatusLabel(project.status)}
            </span>
          </div>

          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.shortDescription}
          </p>

          {project.version && (
            <p className="mb-2 font-mono text-xs text-cyan/60">
              v{project.version}
            </p>
          )}

          <p className="mb-3 text-xs text-muted-foreground">
            {getPlatformIcons(project.platforms)}
          </p>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center gap-3 border-t border-border pt-3">
            {project.lastUpdated && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(project.lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            {project.stars !== undefined && project.stars > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GithubIcon className="h-3 w-3" />
                {project.stars.toLocaleString("ar-SA")}
              </span>
            )}
            <div className="mr-auto flex gap-2">
              {project.downloadUrl && (
                <Download className="h-3.5 w-3.5 text-muted-foreground transition-colors hover:text-cyan" />
              )}
              {project.websiteUrl && (
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-colors hover:text-cyan" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
