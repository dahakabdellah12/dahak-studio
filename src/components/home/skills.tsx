"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data/skills";

export function Skills() {
  if (skills.length === 0) return null;

  const categories = Array.from(new Set(skills.map((s) => s.category)));

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
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-cyan uppercase">
            // الخبرات
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            المهارات والتقنيات
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card relative rounded border p-6"
            >
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/40" />
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/40" />
              <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan/40" />
              <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan/40" />

              <h3 className="mb-4 text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <span
                      key={skill.name}
                      className="rounded border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-cyan/20 hover:text-cyan hover:shadow-[0_0_10px_rgba(0,240,255,0.05)]"
                    >
                      {skill.name}
                    </span>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
