import { NextRequest, NextResponse } from "next/server";
import { getSocialLinks, saveSocialLinks } from "@/lib/data/social-store";
import { isValidHttpUrl } from "@/lib/utils";
import type { SocialLink } from "@/lib/types";

const VALID_ICONS = ["github", "twitter", "linkedin", "youtube", "discord", "telegram", "email", "website"];

export async function GET() {
  try {
    const links = await getSocialLinks();
    return NextResponse.json(links);
  } catch (err) {
    console.error("Failed to fetch social links:", err);
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
        name: l.name.replace(/[<>&"']/g, "").slice(0, 50).trim(),
        url: l.url.slice(0, 500).trim(),
        icon: VALID_ICONS.includes(l.icon) ? l.icon : "website",
      }));

    for (const l of sanitized) {
      if (!isValidHttpUrl(l.url)) {
        return NextResponse.json(
          { error: `Invalid URL for "${l.name}": must be http or https` },
          { status: 400 }
        );
      }
    }

    await saveSocialLinks(sanitized);
    return NextResponse.json(sanitized);
  } catch (err) {
    console.error("Failed to save social links:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
