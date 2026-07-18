import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSession } from "@/lib/auth";

const RATE_LIMIT_COOKIE = "dahak_rl";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;

function getSessionSecret(): string {
  const secret = process.env.DASHBOARD_SESSION_SECRET;
  if (!secret) throw new Error("DASHBOARD_SESSION_SECRET is not set");
  return secret;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signRateLimit(count: number, resetAt: number): Promise<string> {
  const secret = getSessionSecret();
  const payload = `${count}:${resetAt}`;
  const signature = await hmacSign(payload, secret);
  return `${payload}:${signature}`;
}

async function getRateLimitFromCookie(cookie: string | undefined): Promise<{ count: number; resetAt: number }> {
  if (!cookie) return { count: 0, resetAt: 0 };
  try {
    const parts = cookie.split(":");
    if (parts.length !== 3) return { count: 0, resetAt: 0 };
    const [countStr, resetAtStr, signature] = parts;
    const payload = `${countStr}:${resetAtStr}`;
    const secret = getSessionSecret();
    const expectedSig = await hmacSign(payload, secret);
    if (signature !== expectedSig) return { count: 0, resetAt: 0 };
    const count = parseInt(countStr, 10);
    const resetAt = parseInt(resetAtStr, 10);
    if (isNaN(count) || isNaN(resetAt)) return { count: 0, resetAt: 0 };
    return { count, resetAt };
  } catch {
    return { count: 0, resetAt: 0 };
  }
}

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

    const rlCookie = request.cookies.get(RATE_LIMIT_COOKIE)?.value;
    const rlData = await getRateLimitFromCookie(rlCookie);
    const now = Date.now();

    if (rlData.resetAt > now && rlData.count >= RATE_LIMIT_MAX) {
      const retryAfter = Math.ceil((rlData.resetAt - now) / 1000);
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${retryAfter} seconds.` },
        { status: 429 }
      );
    }

    if (!(await checkPassword(password))) {
      const newCount = (rlData.resetAt > now ? rlData.count : 0) + 1;
      const resetAt = (rlData.resetAt > now ? rlData.resetAt : now + RATE_LIMIT_WINDOW);
      const signed = await signRateLimit(newCount, resetAt);

      const res = NextResponse.json({ error: "Invalid password" }, { status: 401 });
      res.cookies.set(RATE_LIMIT_COOKIE, signed, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Math.ceil((resetAt - now) / 1000),
        path: "/",
      });
      return res;
    }

    await createSession();

    const res = NextResponse.json({ success: true });
    res.cookies.set(RATE_LIMIT_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
