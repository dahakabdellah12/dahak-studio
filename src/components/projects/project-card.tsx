"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Download, Calendar } from "lucide-react";
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
        className="glass-card group flex flex-col overflow-hidden rounded-2xl transition-all"
      >
        {project.thumbnail ? (
          <div className="relative aspect-video overflow-hidden bg-secondary/30">
            <img
              src={project.thumbnail}
              alt={project.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue/10 via-transparent to-blue/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue/10 text-2xl font-bold text-blue transition-transform group-hover:scale-110">
              {project.name.charAt(0)}
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground transition-colors group-hover:text-blue">
              {project.name}
            </h3>
            <Badge
              variant="outline"
              className={`shrink-0 text-[10px] capitalize ${getStatusColor(project.status)}`}
            >
              {getStatusLabel(project.status)}
            </Badge>
          </div>

          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.shortDescription}
          </p>

          {project.version && (
            <p className="mb-2 text-xs text-muted-foreground">
              الإصدار {project.version}
            </p>
          )}

          <p className="mb-3 text-xs text-muted-foreground">
            {getPlatformIcons(project.platforms)}
          </p>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-[10px] font-normal">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 5 && (
              <Badge variant="secondary" className="text-[10px] font-normal">
                +{project.technologies.length - 5}
              </Badge>
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
                <Download className="h-3.5 w-3.5 text-muted-foreground transition-colors hover:text-blue" />
              )}
              {project.websiteUrl && (
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-colors hover:text-blue" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
