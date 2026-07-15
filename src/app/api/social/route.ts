import { NextRequest, NextResponse } from "next/server";
import { getSocialLinks, saveSocialLinks } from "@/lib/data/social-store";
import type { SocialLink } from "@/lib/types";

const VALID_ICONS = ["github", "twitter", "linkedin", "youtube", "discord", "telegram", "email", "website"];

export async function GET() {
  try {
    const links = await getSocialLinks();
    return NextResponse.json(links);
  } catch {
    return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { links } = body as { links: SocialLink[] };

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const sanitized: SocialLink[] = links
      .filter((l) => l.name && l.url)
      .slice(0, 20)
      .map((l) => ({
        name: l.name.slice(0, 50).trim(),
        url: l.url.slice(0, 500).trim(),
        icon: VALID_ICONS.includes(l.icon) ? l.icon : "website",
      }));

    await saveSocialLinks(sanitized);
    return NextResponse.json(sanitized);
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
