"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/social-icons";
import type { SocialLink } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon className="h-4.5 w-4.5" />,
  email: <ExternalLink className="h-4.5 w-4.5" />,
};

export function SocialLinksList({ className }: { className?: string }) {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch("/api/social")
      .then((res) => res.json())
      .then((data) => setLinks(Array.isArray(data) ? data : []))
      .catch(() => setLinks([]));
  }, []);

  if (links.length === 0) return null;

  return (
    <div className={className}>
      {links.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded border border-border bg-secondary/50 text-muted-foreground transition-all hover:border-cyan/30 hover:text-cyan hover:shadow-[0_0_10px_rgba(0,240,255,0.1)]"
          aria-label={social.name}
        >
          {iconMap[social.icon] ?? <ExternalLink className="h-4.5 w-4.5" />}
        </a>
      ))}
    </div>
  );
}

export function SocialLinksFull() {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch("/api/social")
      .then((res) => res.json())
      .then((data) => setLinks(Array.isArray(data) ? data : []))
      .catch(() => setLinks([]));
  }, []);

  if (links.length === 0) return null;

  return (
    <ul className="space-y-2">
      {links.map((social) => (
        <li key={social.name}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-cyan"
          >
            {social.name}: {social.url}
          </a>
        </li>
      ))}
    </ul>
  );
}
