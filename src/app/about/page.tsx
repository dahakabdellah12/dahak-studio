"use client";

import { motion } from "framer-motion";

const fields = [
  { label: "الاسم", value: "Dahak Abdellah" },
  { label: "البلد", value: "الجزائر" },
  { label: "الخبرة", value: "1 - 3 سنوات" },
  { label: "التقنية الأساسية", value: "C#" },
  { label: "التخصص", value: "تطبيقات الهاتف و سطح المكتب، ألعاب، مواقع ويب" },
  { label: "الاهتمام", value: "المصادر المفتوحة" },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-cyan uppercase">
            // من أنا
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Dahak Abdellah
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 glass-card relative rounded border divide-y divide-border"
        >
          <div className="absolute top-0 left-0 h-3 w-3 border-t border-l border-cyan/30" />
          <div className="absolute top-0 right-0 h-3 w-3 border-t border-r border-cyan/30" />
          <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-cyan/30" />
          <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan/30" />

          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between px-6 py-4"
            >
              <span className="text-sm text-muted-foreground">{field.label}</span>
              <span className="font-medium text-foreground">{field.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
