import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Project } from "@/lib/types";

const GITHUB_API = "https://api.github.com";
const DATA_FILE_PATH = "data/projects.json";
const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "projects.json");

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) return null;
  return { token, repo, branch };
}

interface GitHubFile {
  sha: string;
  content: string;
}

async function fetchFile(filePath: string): Promise<GitHubFile | null> {
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
  return { sha: data.sha, content: atob(data.content.replace(/\n/g, "")) };
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

async function readProjectsFromGitHub(): Promise<Project[]> {
  const file = await fetchFile(DATA_FILE_PATH);
  if (!file) return [];
  try {
    return JSON.parse(file.content) as Project[];
  } catch {
    return [];
  }
}

async function writeProjectsToGitHub(projects: Project[], message: string): Promise<boolean> {
  const file = await fetchFile(DATA_FILE_PATH);
  const sha = file?.sha || null;
  const content = JSON.stringify(projects, null, 2);
  return updateFile(DATA_FILE_PATH, content, sha, message);
}

async function getProjectsFromFile(): Promise<Project[]> {
  try {
    const data = await readFile(LOCAL_DATA_FILE, "utf-8");
    return JSON.parse(data) as Project[];
  } catch {
    return [];
  }
}

async function saveProjectsToFile(projects: Project[]): Promise<void> {
  await writeFile(LOCAL_DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

export async function getProjects(): Promise<Project[]> {
  try {
    const config = getConfig();
    if (config) {
      return await readProjectsFromGitHub();
    }
    return await getProjectsFromFile();
  } catch {
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function addProject(project: Project): Promise<Project> {
  const projects = await getProjects();
  projects.push(project);
  const config = getConfig();
  if (config) {
    await writeProjectsToGitHub(projects, `Add project: ${project.name}`);
  } else {
    await saveProjectsToFile(projects);
  }
  return project;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const safeData = { ...data };
  delete safeData.id;
  projects[index] = { ...projects[index], ...safeData, id };
  const config = getConfig();
  if (config) {
    await writeProjectsToGitHub(projects, `Update project: ${projects[index].name}`);
  } else {
    await saveProjectsToFile(projects);
  }
  return projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  const config = getConfig();
  if (config) {
    await writeProjectsToGitHub(filtered, `Delete project: ${project?.name || id}`);
  } else {
    await saveProjectsToFile(filtered);
  }
  return true;
}
