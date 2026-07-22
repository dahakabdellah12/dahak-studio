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

export function AboutContent() {
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
          className="mt-6 text-muted-foreground/80 leading-relaxed"
        >
          <p>
            مطور برمجيات من الجزائر، متخصص في بناء تطبيقات سطح المكتب والهواتف المحمولة
            والألعاب والمواقع الإلكترونية. أعمل بشكل أساسي بلغة C# وأهتم بالمصادر المفتوحة
            ومشاركة مشاريعي مع المجتمع.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 glass-card rounded border relative"
        >
          <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/25" />
          <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/25" />
          <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan/25" />
          <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan/25" />

          {fields.map((field, i) => (
            <div
              key={field.label}
              className={`flex items-center justify-between px-6 py-4 ${
                i < fields.length - 1 ? "border-b border-border/30" : ""
              }`}
            >
              <span className="text-sm text-muted-foreground/60">{field.label}</span>
              <span className="font-medium text-foreground/90">{field.value}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10"
        >
          <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-cyan uppercase">
            // ماذا أبني
          </h2>
          <ul className="space-y-2 text-muted-foreground/80 text-sm leading-relaxed">
            <li>تطبيقات سطح المكتب لأنظمة ويندوز ولينكس</li>
            <li>تطبيقات محمولة لنظام أندرويد</li>
            <li>ألعاب فيديو ومصادر مفتوحة</li>
            <li>مواقع إلكترونية وتطبيقات ويب</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
