"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/lib/types";

export function FeaturedProjects() {
  const [featured, setFeatured] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setFeatured(data.filter((p: Project) => p.featured)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (featured.length === 0) return null;

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue">
              مميزة
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              مشاريع مختارة
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            عرض الكل
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            عرض كل المشاريع
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
