import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeString(value: unknown, maxLen = 500): string {
  if (typeof value !== "string") return "";
  return value.replace(/[<>&"']/g, "").slice(0, maxLen).trim();
}

export function sanitizeArray(value: unknown, maxItems = 20, maxItemLen = 100): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .slice(0, maxItems)
    .map((v) => v.replace(/[<>&"']/g, "").slice(0, maxItemLen).trim())
    .filter(Boolean);
}

export function isValidHttpUrl(value: string): boolean {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}
