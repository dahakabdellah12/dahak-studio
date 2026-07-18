"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SocialLinksList } from "@/components/social-links";

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-cyan uppercase">
            // تواصل معي
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            الاتصال
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 space-y-6"
        >
          <div className="glass-card relative rounded border p-6">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/15" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/15" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan/15" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan/15" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-cyan/10 bg-cyan/5">
                <MapPin className="h-4 w-4 text-cyan/60" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/50">الموقع</p>
                <p className="text-sm font-medium text-foreground/90">الجزائر</p>
              </div>
            </div>
          </div>

          <div className="glass-card relative rounded border p-6">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/15" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/15" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan/15" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan/15" />

            <h3 className="mb-4 text-xs font-bold tracking-[0.15em] text-cyan/50 uppercase">
              // شبكاتي
            </h3>
            <SocialLinksList className="flex gap-3" skeletonCount={2} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
