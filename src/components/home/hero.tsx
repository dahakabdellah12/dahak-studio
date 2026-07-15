"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/5 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-blue/3 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 h-[250px] w-[250px] rounded-full bg-blue/3 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-balance text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          مرحباً، أنا Dahak
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
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
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-blue px-7 text-sm font-medium text-white shadow-lg shadow-blue/25 transition-all hover:bg-blue-light hover:shadow-blue/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4 rotate-180" />
            عرض المشاريع
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-secondary/50 px-7 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:border-muted-foreground/20"
          >
            اعرف عني
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
