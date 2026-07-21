"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import {
  GithubIcon,
  TwitterIcon,
  LinkedInIcon,
  YouTubeIcon,
  DiscordIcon,
  TelegramIcon,
  WebsiteIcon,
  InstagramIcon,
  FacebookIcon,
  EmailIcon,
} from "@/components/social-icons";
import type { SocialLink } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon className="h-4.5 w-4.5" />,
  twitter: <TwitterIcon className="h-4.5 w-4.5" />,
  linkedin: <LinkedInIcon className="h-4.5 w-4.5" />,
  youtube: <YouTubeIcon className="h-4.5 w-4.5" />,
  discord: <DiscordIcon className="h-4.5 w-4.5" />,
  telegram: <TelegramIcon className="h-4.5 w-4.5" />,
  instagram: <InstagramIcon className="h-4.5 w-4.5" />,
  facebook: <FacebookIcon className="h-4.5 w-4.5" />,
  email: <EmailIcon className="h-4.5 w-4.5" />,
  website: <WebsiteIcon className="h-4.5 w-4.5" />,
};

function SocialSkeleton({ count = 2 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-9 w-9 animate-pulse rounded border border-border/30 bg-secondary/20"
        />
      ))}
    </>
  );
}

export function SocialLinksList({ className, skeletonCount }: { className?: string; skeletonCount?: number }) {
  const [links, setLinks] = useState<SocialLink[] | null>(null);

  useEffect(() => {
    fetch("/api/social")
      .then((res) => res.json())
      .then((data) => setLinks(Array.isArray(data) ? data : []))
      .catch(() => setLinks([]));
  }, []);

  if (links === null) {
    return <div className={className}><SocialSkeleton count={skeletonCount} /></div>;
  }

  if (links.length === 0) return null;

  return (
    <div className={className}>
      {links.map((social) => {
        const isEmail = social.icon === "email" || social.url.startsWith("mailto:");
        return (
          <a
            key={social.name}
            href={social.url}
            {...(!isEmail ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={isEmail ? (e) => {
              e.preventDefault();
              window.location.href = social.url;
            } : undefined}
            className="flex h-9 w-9 items-center justify-center rounded border border-border bg-secondary/50 text-muted-foreground transition-all hover:border-cyan/30 hover:text-cyan hover:shadow-[0_0_10px_rgba(0,240,255,0.1)]"
            aria-label={social.name}
          >
            {iconMap[social.icon] ?? <ExternalLink className="h-4.5 w-4.5" />}
          </a>
        );
      })}
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
