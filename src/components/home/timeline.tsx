"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/data/projects";

export function Timeline() {
  const allTimeline = projects
    .flatMap((p) =>
      (p.timeline ?? []).map((t) => ({
        ...t,
        projectName: p.name,
        projectSlug: p.slug,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  if (allTimeline.length === 0) return null;

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue">
            الرحلة
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            جدول أعمال التطوير
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute right-[19px] top-0 bottom-0 w-px bg-border md:right-1/2" />

          <div className="space-y-8">
            {allTimeline.map((entry, i) => (
              <motion.div
                key={`${entry.date}-${entry.title}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : ""
                }`}
              >
                <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-muted-foreground md:absolute md:right-1/2 md:mr-[-20px]">
                  {new Date(entry.date).getFullYear().toString().slice(2)}
                </div>
                <div
                  className={`glass-card mr-[52px] flex-1 rounded-2xl p-5 md:mr-0 md:w-[calc(50%-40px)] ${
                    i % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                  }`}
                >
                  <time className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="mt-1 font-semibold">{entry.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
