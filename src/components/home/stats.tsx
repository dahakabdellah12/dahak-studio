"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FolderOpen, GitBranch, Star, GitCommit } from "lucide-react";

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
    <div ref={ref} className="text-4xl font-bold text-cyan text-shadow-cyan sm:text-5xl font-mono tracking-tight">
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
    icon: GitBranch,
    label: "مستودعات GitHub",
    key: "githubRepos" as const,
    suffix: "",
  },
  {
    icon: Star,
    label: "نجوم GitHub",
    key: "githubStars" as const,
    suffix: "",
  },
  {
    icon: GitCommit,
    label: "مساهمات GitHub",
    key: "githubCommits" as const,
    suffix: "",
  },
];

export function Stats() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    githubRepos: 0,
    githubStars: 0,
    githubCommits: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()).catch(() => []),
      fetch("/api/github/stats").then((r) => r.json()).catch(() => ({ githubRepos: 0, githubStars: 0, githubCommits: 0 })),
    ]).then(([projects, gh]) => {
      setStats({
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        githubRepos: gh.githubRepos || 0,
        githubStars: gh.githubStars || 0,
        githubCommits: gh.githubCommits || 0,
      });
    });
  }, []);

  const hasData = Object.values(stats).some((v) => v > 0);

  if (!hasData) return null;

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
            // الإحصائيات
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            أرقام تتحدث
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statItems.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card relative rounded border p-6 text-center"
            >
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/20" />
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/20" />
              <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan/20" />
              <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan/20" />

              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded border border-cyan/15 bg-cyan/5">
                <item.icon className="h-5 w-5 text-cyan/70" />
              </div>
              <AnimatedCounter target={stats[item.key]} suffix={item.suffix} />
              <p className="mt-2 text-sm text-muted-foreground">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
