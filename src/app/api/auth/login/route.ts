import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSession } from "@/lib/auth";
import { checkRateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const ip = getClientIp(request);
    const { allowed, retryAfter } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${retryAfter} seconds.` },
        { status: 429 }
      );
    }

    if (!(await checkPassword(password))) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    resetRateLimit(ip);
    await createSession();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
