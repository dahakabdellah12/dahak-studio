"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/data/site";
import { GithubIcon } from "@/components/social-icons";

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon className="h-5 w-5" />,
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue">
            تواصل معي
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            الاتصال
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            لديك سؤال، تريد التعاون، أو تريد فقط أن تقول مرحاً؟ لا تتردد في
            التواصل.
          </p>
        </motion.div>

        <div className="space-y-4">
          {siteConfig.email && (
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              href={`mailto:${siteConfig.email}`}
              className="glass-card flex items-center gap-4 rounded-2xl p-5 transition-all hover:border-blue/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-blue">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">البريد الإلكتروني</p>
                <p className="text-sm text-muted-foreground">
                  {siteConfig.email}
                </p>
              </div>
              <ExternalLink className="mr-auto h-4 w-4 text-muted-foreground" />
            </motion.a>
          )}

          {siteConfig.socialLinks.map((social, i) => (
            <motion.a
              key={social.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + (siteConfig.email ? 0.1 : 0) + i * 0.1 }}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex items-center gap-4 rounded-2xl p-5 transition-all hover:border-blue/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-blue">
                {iconMap[social.icon] ?? <ExternalLink className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium">{social.name}</p>
                <p className="text-sm text-muted-foreground">{social.url}</p>
              </div>
              <ExternalLink className="mr-auto h-4 w-4 text-muted-foreground" />
            </motion.a>
          ))}

          {!siteConfig.email && siteConfig.socialLinks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <p className="text-muted-foreground">
                لم يتم تكوين معلومات الاتصال بعد. قم بتحديث{" "}
                <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">
                  src/lib/data/site.ts
                </code>{" "}
                لإضافة بريدك الإلكتروني وروابط التواصل.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
