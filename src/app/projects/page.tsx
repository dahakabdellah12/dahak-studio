"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue">
            الأعمال
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            جميع المشاريع
          </h1>
        </motion.div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-secondary/50"
              />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-4xl font-bold text-muted-foreground">
              ؟
            </div>
            <h3 className="text-lg font-semibold">لم يتم العثور على مشاريع</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              لم تُضف أي مشاريع بعد.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
