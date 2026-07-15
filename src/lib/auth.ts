import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE = "dahak_session";
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

function getSessionSecret(): string {
  const secret = process.env.DASHBOARD_SESSION_SECRET;
  if (!secret) throw new Error("DASHBOARD_SESSION_SECRET is not set");
  return secret;
}

function hmacSign(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export function createSessionToken(): string {
  const secret = getSessionSecret();
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(16).toString("hex");
  const payload = `${timestamp}:${random}`;
  const signature = hmacSign(payload, secret);
  return `${payload}:${signature}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const secret = getSessionSecret();
    const parts = token.split(":");
    if (parts.length !== 3) return false;
    const [timestamp, random, signature] = parts;
    const payload = `${timestamp}:${random}`;
    const expectedSignature = hmacSign(payload, secret);
    if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"))) return false;
    const created = parseInt(timestamp, 10);
    return Date.now() - created < SESSION_MAX_AGE * 1000;
  } catch {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  const envPassword = process.env.DASHBOARD_PASSWORD;
  if (!envPassword) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(envPassword);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function isAuthenticatedRequest(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}
