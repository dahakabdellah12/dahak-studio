"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FolderOpen, Download, Star, Calendar } from "lucide-react";
import { siteConfig } from "@/lib/data/site";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || target === 0) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-3xl font-bold text-cyan text-shadow-cyan sm:text-4xl font-mono">
      {target === 0 ? "—" : count.toLocaleString("en-US") + suffix}
    </div>
  );
}

const statItems = [
  {
    icon: FolderOpen,
    label: "إجمالي المشاريع",
    key: "totalProjects" as const,
    suffix: "",
  },
  {
    icon: Download,
    label: "التنزيلات",
    key: "downloads" as const,
    suffix: "",
  },
  {
    icon: Star,
    label: "نجوم GitHub",
    key: "githubStars" as const,
    suffix: "",
  },
  {
    icon: Calendar,
    label: "سنوات الخبرة",
    key: "yearsOfExperience" as const,
    suffix: "",
  },
];

export function Stats() {
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjectCount(data.length))
      .catch(() => setProjectCount(0));
  }, []);

  const stats = {
    ...siteConfig.stats,
    totalProjects: projectCount,
  };

  const hasData = Object.values(stats).some((v) => v > 0);

  if (!hasData) return null;

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statItems.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card group relative cursor-pointer rounded border p-6 text-center"
            >
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
              <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan/30" />
              <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan/30" />

              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded border border-cyan/20 bg-cyan/5 text-cyan transition-all group-hover:border-cyan/40 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <item.icon className="h-5 w-5" />
              </div>
              <AnimatedCounter target={stats[item.key]} suffix={item.suffix} />
              <p className="mt-1 text-sm text-muted-foreground">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
