import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const SESSION_COOKIE = "dahak_session";

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

function hasValidCsrfHeader(request: NextRequest): boolean {
  return request.headers.get("x-requested-with") === "xmlhttprequest" ||
    request.headers.get("x-csrf-token") !== null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const ip = getClientIp(request);

  if (pathname.startsWith("/api/auth/login") && method === "POST") {
    const { allowed, retryAfter } = checkRateLimit(ip);
    if (!allowed) {
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
