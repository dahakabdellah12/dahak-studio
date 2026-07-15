"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/social-icons";
import type { SocialLink } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon className="h-4.5 w-4.5" />,
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
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-all hover:bg-blue/10 hover:text-blue"
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
            className="text-blue hover:underline"
          >
            {social.name}: {social.url}
          </a>
        </li>
      ))}
    </ul>
  );
}
