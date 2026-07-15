import { NextRequest, NextResponse } from "next/server";
import { getProjectById, updateProject, deleteProject } from "@/lib/data/projects-store";
import type { ProjectCategory, Platform, ProjectStatus } from "@/lib/types";

const MAX_BODY_SIZE = 1024 * 100;

const VALID_CATEGORIES: ProjectCategory[] = [
  "desktop", "mobile", "game", "open-source", "os", "library", "design", "experiment", "article",
];
const VALID_PLATFORMS: Platform[] = ["windows", "android", "linux", "web", "ios", "multi"];
const VALID_STATUSES: ProjectStatus[] = ["released", "in-development", "beta", "archived"];

function sanitizeString(value: unknown, maxLen = 500): string {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen).trim();
}

function sanitizeArray(value: unknown, maxItems = 20, maxItemLen = 100): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .slice(0, maxItems)
    .map((v) => v.slice(0, maxItemLen).trim())
    .filter(Boolean);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = sanitizeString(body.name, 100);
    if (body.shortDescription !== undefined) data.shortDescription = sanitizeString(body.shortDescription, 300);
    if (body.fullDescription !== undefined) data.fullDescription = sanitizeString(body.fullDescription, 5000);
    if (body.thumbnail !== undefined) data.thumbnail = sanitizeString(body.thumbnail, 500);
    if (body.screenshots !== undefined) data.screenshots = sanitizeArray(body.screenshots, 10, 500);
    if (body.version !== undefined) data.version = sanitizeString(body.version, 20);
    if (body.lastUpdated !== undefined) data.lastUpdated = sanitizeString(body.lastUpdated, 10);
    if (body.githubUrl !== undefined) data.githubUrl = sanitizeString(body.githubUrl, 500);
    if (body.websiteUrl !== undefined) data.websiteUrl = sanitizeString(body.websiteUrl, 500);
    if (body.downloadUrl !== undefined) data.downloadUrl = sanitizeString(body.downloadUrl, 500);
    if (body.docsUrl !== undefined) data.docsUrl = sanitizeString(body.docsUrl, 500);
    if (body.license !== undefined) data.license = sanitizeString(body.license, 50);
    if (body.stars !== undefined) data.stars = typeof body.stars === "number" ? Math.max(0, Math.floor(body.stars)) : 0;
    if (body.downloads !== undefined) data.downloads = typeof body.downloads === "number" ? Math.max(0, Math.floor(body.downloads)) : 0;
    if (body.featured !== undefined) data.featured = body.featured === true;
    if (body.features !== undefined) data.features = sanitizeArray(body.features, 30, 200);
    if (body.changelog !== undefined) data.changelog = Array.isArray(body.changelog) ? body.changelog.slice(0, 50) : [];
    if (body.timeline !== undefined) data.timeline = Array.isArray(body.timeline) ? body.timeline.slice(0, 50) : [];

    if (body.category !== undefined) {
      data.category = VALID_CATEGORIES.includes(body.category) ? body.category : "desktop";
    }
    if (body.status !== undefined) {
      data.status = VALID_STATUSES.includes(body.status) ? body.status : "in-development";
    }
    if (body.platforms !== undefined) {
      data.platforms = sanitizeArray(body.platforms, 6).filter((p) =>
        VALID_PLATFORMS.includes(p as Platform)
      );
    }
    if (body.technologies !== undefined) {
      data.technologies = sanitizeArray(body.technologies, 20, 50);
    }

    if (body.name !== undefined && !body.slug) {
      data.slug = (data.name as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    } else if (body.slug !== undefined) {
      data.slug = sanitizeString(body.slug, 100);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await updateProject(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
