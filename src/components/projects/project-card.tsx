"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Download, Calendar } from "lucide-react";
import { GithubIcon } from "@/components/social-icons";
import type { Project } from "@/lib/types";

function getStatusColor(status: Project["status"]) {
  switch (status) {
    case "released":
      return "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";
    case "in-development":
      return "border-cyan/20 text-cyan bg-cyan/5";
    case "beta":
      return "border-yellow-neon/20 text-yellow-neon bg-yellow-neon/5";
    case "archived":
      return "border-border text-muted-foreground bg-secondary/30";
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
        className="glass-card group relative flex h-full flex-col overflow-hidden rounded border"
      >
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/15" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/15" />
        <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan/15" />
        <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan/15" />

        {project.thumbnail ? (
          <div className="relative aspect-video overflow-hidden bg-secondary/20">
            <Image
              src={project.thumbnail}
              alt={project.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-cyan/3 via-transparent to-magenta/3">
            <div className="flex h-16 w-16 items-center justify-center rounded border border-cyan/10 bg-cyan/5 text-2xl font-bold text-cyan/60 transition-all group-hover:border-cyan/25 group-hover:text-cyan">
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
            <p className="mb-2 font-mono text-xs text-cyan/50">
              v{project.version}
            </p>
          )}

          <p className="mb-3 text-xs text-muted-foreground/60">
            {getPlatformIcons(project.platforms)}
          </p>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded border border-border/40 bg-secondary/25 px-2 py-0.5 text-[10px] text-muted-foreground/70"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="rounded border border-border/40 bg-secondary/25 px-2 py-0.5 text-[10px] text-muted-foreground/70">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center gap-3 border-t border-border/40 pt-3">
            {project.lastUpdated && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                <Calendar className="h-3 w-3" />
                {new Date(project.lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            {project.stars !== undefined && project.stars > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                <GithubIcon className="h-3 w-3" />
                {project.stars.toLocaleString("ar-SA")}
              </span>
            )}
            <div className="mr-auto flex gap-2">
              {project.downloadUrl && (
                <Download className="h-3.5 w-3.5 text-muted-foreground/40 transition-colors hover:text-cyan" />
              )}
              {project.websiteUrl && (
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 transition-colors hover:text-cyan" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
