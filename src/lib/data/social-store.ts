import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { SocialLink } from "@/lib/types";

const GITHUB_API = "https://api.github.com";
const DATA_FILE_PATH = "data/social.json";
const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "social.json");

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) return null;
  return { token, repo, branch };
}

async function fetchFile(filePath: string): Promise<{ sha: string; content: string } | null> {
  const config = getConfig();
  if (!config) return null;
  const { token, repo, branch } = config;
  const url = `${GITHUB_API}/repos/${repo}/contents/${filePath}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  const binaryStr = atob(data.content.replace(/\n/g, ""));
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return { sha: data.sha, content: new TextDecoder("utf-8").decode(bytes) };
}

async function updateFile(filePath: string, content: string, sha: string | null, message: string): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;
  const { token, repo, branch } = config;
  const url = `${GITHUB_API}/repos/${repo}/contents/${filePath}`;
  const body: Record<string, unknown> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch,
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.ok;
}

async function readFromFile(): Promise<SocialLink[]> {
  try {
    const data = await readFile(LOCAL_DATA_FILE, "utf-8");
    return JSON.parse(data) as SocialLink[];
  } catch {
    return [];
  }
}

async function writeToFile(links: SocialLink[]): Promise<void> {
  await writeFile(LOCAL_DATA_FILE, JSON.stringify(links, null, 2), "utf-8");
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const config = getConfig();
    if (config) {
      const file = await fetchFile(DATA_FILE_PATH);
      if (!file) return [];
      try {
        return JSON.parse(file.content) as SocialLink[];
      } catch {
        return [];
      }
    }
    return await readFromFile();
  } catch {
    return [];
  }
}

export async function saveSocialLinks(links: SocialLink[]): Promise<boolean> {
  const config = getConfig();
  const content = JSON.stringify(links, null, 2);
  if (config) {
    const file = await fetchFile(DATA_FILE_PATH);
    const sha = file?.sha || null;
    return updateFile(DATA_FILE_PATH, content, sha, "Update social links");
  }
  await writeToFile(links);
  return true;
}
