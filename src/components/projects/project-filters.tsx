"use client";

import { motion } from "framer-motion";

interface ProjectFiltersProps {
  categories: string[];
  technologies: string[];
  selectedCategory: string | null;
  selectedTech: string | null;
  onCategoryChange: (category: string | null) => void;
  onTechChange: (tech: string | null) => void;
}

export function ProjectFilters({
  categories,
  technologies,
  selectedCategory,
  selectedTech,
  onCategoryChange,
  onTechChange,
}: ProjectFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`rounded border px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === null
                ? "border-cyan/50 bg-cyan/10 text-cyan"
                : "border-border bg-secondary/50 text-muted-foreground hover:border-cyan/20 hover:text-foreground"
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`rounded border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "border-cyan/50 bg-cyan/10 text-cyan"
                  : "border-border bg-secondary/50 text-muted-foreground hover:border-cyan/20 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <button
              key={tech}
              onClick={() => onTechChange(selectedTech === tech ? null : tech)}
              className={`rounded border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedTech === tech
                  ? "border-magenta/50 bg-magenta/10 text-magenta"
                  : "border-border bg-secondary/50 text-muted-foreground hover:border-magenta/20 hover:text-foreground"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
