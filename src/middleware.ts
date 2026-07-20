import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "dahak_session";
const RATE_LIMIT_COOKIE = "dahak_rl";

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

async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = getSessionSecret();
    const parts = token.split(":");
    if (parts.length !== 3) return false;
    const [timestamp, random, signature] = parts;
    const payload = `${timestamp}:${random}`;
    const expectedSignature = await hmacSign(payload, secret);
    if (signature.length !== expectedSignature.length) return false;
    const encoder = new TextEncoder();
    const a = encoder.encode(signature);
    const b = encoder.encode(expectedSignature);
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    if (diff !== 0) return false;
    const created = parseInt(timestamp, 10);
    const maxAge = 24 * 60 * 60 * 1000;
    return Date.now() - created < maxAge;
  } catch {
    return false;
  }
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;

interface RateLimitData {
  count: number;
  resetAt: number;
}

async function getRateLimitData(cookie: string | undefined): Promise<RateLimitData> {
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

function hasValidCsrfHeader(request: NextRequest): boolean {
  return request.headers.get("x-requested-with") === "xmlhttprequest" ||
    request.headers.get("x-csrf-token") !== null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (pathname.startsWith("/api/auth/login") && method === "POST") {
    const rlCookie = request.cookies.get(RATE_LIMIT_COOKIE)?.value;
    const data = await getRateLimitData(rlCookie);
    const now = Date.now();
    if (data.resetAt > now && data.count >= RATE_LIMIT_MAX) {
      const retryAfter = Math.ceil((data.resetAt - now) / 1000);
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${retryAfter} seconds.` },
        { status: 429 }
      );
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard/login") {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (token && (await verifySessionToken(token))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  if (pathname.startsWith("/api/projects") || pathname.startsWith("/api/social") || pathname.startsWith("/api/github")) {
    if (method !== "GET") {
      if (!hasValidCsrfHeader(request)) {
        return NextResponse.json({ error: "Missing CSRF header" }, { status: 403 });
      }
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (!token || !(await verifySessionToken(token))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/projects/:path*", "/api/social/:path*", "/api/auth/:path*", "/api/github/:path*"],
};
