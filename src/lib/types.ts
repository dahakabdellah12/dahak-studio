export type ProjectCategory =
  | "desktop"
  | "mobile"
  | "game"
  | "open-source"
  | "os"
  | "library"
  | "design"
  | "experiment"
  | "article";

export type Platform = "windows" | "android" | "linux" | "web" | "ios" | "multi";

export type ProjectStatus = "released" | "in-development" | "archived" | "beta";

export type SortOption = "newest" | "oldest" | "popularity";

export interface Project {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  thumbnail?: string;
  screenshots?: string[];
  category: ProjectCategory;
  technologies: string[];
  status: ProjectStatus;
  platforms: Platform[];
  version?: string;
  lastUpdated?: string;
  githubUrl?: string;
  websiteUrl?: string;
  downloadUrl?: string;
  docsUrl?: string;
  license?: string;
  stars?: number;
  downloads?: number;
  featured?: boolean;
  features?: string[];
  changelog?: ChangelogEntry[];
  timeline?: TimelineEntry[];
  relatedProjects?: string[];
  githubRepoId?: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  license: { spdx_id: string } | null;
  owner: { login: string };
  pushed_at: string;
  created_at: string;
  archived: boolean;
  fork: boolean;
  size: number;
  open_issues_count: number;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  email?: string;
  socialLinks: SocialLink[];
  stats: SiteStats;
}

export interface SiteStats {
  totalProjects: number;
  downloads: number;
  githubStars: number;
  yearsOfExperience: number;
}

export interface Skill {
  name: string;
  category: string;
  level?: number;
}

export interface Testimonial {
  name: string;
  role?: string;
  content: string;
  avatar?: string;
}
