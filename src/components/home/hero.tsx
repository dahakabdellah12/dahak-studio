"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 cyber-grid" />

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/5 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-magenta/3 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 h-[250px] w-[250px] rounded-full bg-cyan/3 blur-[80px]" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded border border-cyan/20 bg-cyan/5 px-4 py-1.5 text-xs font-medium tracking-widest text-cyan uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-neon-pulse" />
          DEVELOPER // PORTFOLIO
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-balance text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="text-foreground">مرحباً، أنا </span>
          <span className="text-cyan text-shadow-cyan">Dahak</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          أصمم وأطور تطبيقات سطح المكتب والهواتف والألعاب والأدوات مفتوحة المصدر
          مع التركيز على الأداء والتصميم وتجربة المستخدم.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/projects"
            className="group inline-flex h-12 items-center gap-2 rounded border border-cyan/40 bg-cyan/10 px-7 text-sm font-bold tracking-wider text-cyan uppercase transition-all hover:bg-cyan/20 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            عرض المشاريع
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center gap-2 rounded border border-border bg-secondary/50 px-7 text-sm font-medium tracking-wider text-muted-foreground uppercase transition-all hover:border-magenta/30 hover:text-magenta hover:shadow-[0_0_15px_rgba(255,42,109,0.1)]"
          >
            اعرف عني
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
    </section>
  );
}
