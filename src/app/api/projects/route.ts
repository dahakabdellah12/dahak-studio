import { NextRequest, NextResponse } from "next/server";
import { getProjects, addProject } from "@/lib/data/projects-store";
import crypto from "crypto";
import { sanitizeString, sanitizeArray, isValidHttpUrl } from "@/lib/utils";
import type { ProjectCategory, Platform, ProjectStatus } from "@/lib/types";

const MAX_BODY_SIZE = 1024 * 100;

const VALID_CATEGORIES: ProjectCategory[] = [
  "desktop", "mobile", "game", "open-source", "os", "library", "design", "experiment", "article",
];
const VALID_PLATFORMS: Platform[] = ["windows", "android", "linux", "web", "ios", "multi"];
const VALID_STATUSES: ProjectStatus[] = ["released", "in-development", "beta", "archived"];

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const body = await request.json();

    const name = sanitizeString(body.name, 100);
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = VALID_CATEGORIES.includes(body.category) ? body.category : "desktop";
    const status = VALID_STATUSES.includes(body.status) ? body.status : "in-development";
    const platforms = sanitizeArray(body.platforms, 6).filter((p) =>
      VALID_PLATFORMS.includes(p as Platform)
    ) as Platform[];

    const thumbnail = sanitizeString(body.thumbnail, 500);
    if (thumbnail && !isValidHttpUrl(thumbnail)) {
      return NextResponse.json({ error: "Invalid thumbnail URL" }, { status: 400 });
    }
    const githubUrl = sanitizeString(body.githubUrl, 500);
    if (githubUrl && !isValidHttpUrl(githubUrl)) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }
    const websiteUrl = sanitizeString(body.websiteUrl, 500);
    if (websiteUrl && !isValidHttpUrl(websiteUrl)) {
      return NextResponse.json({ error: "Invalid website URL" }, { status: 400 });
    }
    const downloadUrl = sanitizeString(body.downloadUrl, 500);
    if (downloadUrl && !isValidHttpUrl(downloadUrl)) {
      return NextResponse.json({ error: "Invalid download URL" }, { status: 400 });
    }
    const docsUrl = sanitizeString(body.docsUrl, 500);
    if (docsUrl && !isValidHttpUrl(docsUrl)) {
      return NextResponse.json({ error: "Invalid docs URL" }, { status: 400 });
    }

    const screenshots = sanitizeArray(body.screenshots, 10, 500);
    for (const s of screenshots) {
      if (!isValidHttpUrl(s)) {
        return NextResponse.json({ error: "Invalid screenshot URL" }, { status: 400 });
      }
    }

    const existingProjects = await getProjects();
    const githubRepoId = typeof body.githubRepoId === "number" ? body.githubRepoId : null;
    if (githubRepoId && existingProjects.some((p) => p.githubRepoId === githubRepoId)) {
      return NextResponse.json({ error: "Project already imported" }, { status: 409 });
    }

    const project = {
      id: crypto.randomUUID(),
      slug: sanitizeString(body.slug, 100) || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      name,
      shortDescription: sanitizeString(body.shortDescription, 300),
      fullDescription: sanitizeString(body.fullDescription, 5000),
      thumbnail,
      screenshots,
      category,
      technologies: sanitizeArray(body.technologies, 20, 50),
      status,
      platforms,
      version: sanitizeString(body.version, 20),
      lastUpdated: sanitizeString(body.lastUpdated, 10),
      githubUrl,
      websiteUrl,
      downloadUrl,
      docsUrl,
      license: sanitizeString(body.license, 50),
      stars: typeof body.stars === "number" ? Math.max(0, Math.floor(body.stars)) : 0,
      downloads: typeof body.downloads === "number" ? Math.max(0, Math.floor(body.downloads)) : 0,
      featured: body.featured === true,
      features: sanitizeArray(body.features, 30, 200),
      changelog: Array.isArray(body.changelog) ? body.changelog.slice(0, 50) : [],
      timeline: Array.isArray(body.timeline) ? body.timeline.slice(0, 50) : [],
      ...(githubRepoId ? { githubRepoId } : {}),
    };

    const created = await addProject(project);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Failed to create project:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
