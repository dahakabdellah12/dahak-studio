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

async function createRateLimitCookie(data: RateLimitData): Promise<string> {
  const secret = getSessionSecret();
  const payload = `${data.count}:${data.resetAt}`;
  const signature = await hmacSign(payload, secret);
  return `${payload}:${signature}`;
}

function isValidHttpUrl(url: string): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "0");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.githubusercontent.com https://images.unsplash.com https://*.github.com data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.github.com; frame-ancestors 'none'"
  );
  return response;
}

function hasValidCsrfHeader(request: NextRequest): boolean {
  return request.headers.get("x-requested-with") === "xmlhttprequest" ||
    request.headers.get("x-csrf-token") !== null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth/login") && request.method === "POST") {
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
      const res = NextResponse.next();
      return addSecurityHeaders(res);
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  if (pathname.startsWith("/api/projects") || pathname.startsWith("/api/social")) {
    const method = request.method;
    if (method === "GET") {
      const res = NextResponse.next();
      return addSecurityHeaders(res);
    }

    if (!hasValidCsrfHeader(request)) {
      return NextResponse.json({ error: "Missing CSRF header" }, { status: 403 });
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const res = NextResponse.next();
  return addSecurityHeaders(res);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/projects/:path*", "/api/social/:path*", "/api/auth/:path*"],
};
