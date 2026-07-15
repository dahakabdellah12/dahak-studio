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
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue">
            الخبرات
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
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <span
                      key={skill.name}
                      className="rounded-lg bg-secondary/80 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-blue/10 hover:text-blue"
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
