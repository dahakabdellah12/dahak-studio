"use client";

import { useState, useEffect } from "react";
import { RefreshCw, GitBranch, Star, Download, Check } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  readme: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  license: string | null;
  pushed_at: string;
  created_at: string;
  archived: boolean;
  size: number;
  latestVersion: string | null;
  latestReleaseDate: string | null;
  alreadyImported: boolean;
}

function parseFeaturesFromReadme(readme: string): string[] {
  const features: string[] = [];
  const lines = readme.split("\n");
  let inFeaturesSection = false;
  let featuresIndentLevel = 0;

  const featureHeaders = [
    "feature", "highlight", "capability", "benefit", "advantage",
    "key point", "what it does", "overview", "specification",
    "مميز", "ميزة", "مزايا", "مميزات",
  ];

  function isFeatureHeader(text: string): boolean {
    const lower = text.toLowerCase();
    return featureHeaders.some((h) => lower.includes(h));
  }

  function extractBulletItem(line: string): string | null {
    const trimmed = line.trim();
    // Match: - item, * item, - [x] item, - [ ] item, * [x] item
    let match = trimmed.match(/^[-*]\s*(?:\[[ x]\]\s*)?(.+)/);
    if (match) {
      const text = match[1].replace(/`/g, "").trim();
      if (text.length > 2 && text.length < 300) return text;
    }
    // Match: 1. item, 2) item
    match = trimmed.match(/^\d+[.)]\s+(.+)/);
    if (match) {
      const text = match[1].replace(/`/g, "").trim();
      if (text.length > 2 && text.length < 300) return text;
    }
    // Match: | col1 | col2 | — skip table rows
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) return null;
    return null;
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const lower = trimmed.toLowerCase();

    // Detect feature section headers (##, ###, or even ##)
    const headerMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
    if (headerMatch) {
      const headerLevel = headerMatch[1].length;
      const headerText = headerMatch[2];

      if (inFeaturesSection && headerLevel <= featuresIndentLevel) {
        inFeaturesSection = false;
      }

      if (isFeatureHeader(headerText)) {
        inFeaturesSection = true;
        featuresIndentLevel = headerLevel;
        continue;
      }
    }

    if (inFeaturesSection) {
      const item = extractBulletItem(trimmed);
      if (item) {
        features.push(item);
      }
    }
  }

  // Fallback: if no features found from sections, scan for any bullet lists after the first heading
  if (features.length === 0) {
    let pastFirstHeading = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#")) {
        pastFirstHeading = true;
        continue;
      }
      if (pastFirstHeading) {
        const item = extractBulletItem(trimmed);
        if (item) {
          features.push(item);
          if (features.length >= 10) break;
        }
      }
    }
  }

  return features.slice(0, 15);
}

function detectPlatforms(readme: string, topics: string[]): string[] {
  const text = (readme + " " + topics.join(" ")).toLowerCase();
  const platforms: string[] = [];

  // Windows
  if (
    text.includes("windows") || text.includes("wpf") || text.includes("winforms") ||
    text.includes("win32") || text.includes(".net framework") || text.includes(".net core") ||
    text.includes("blazor") || text.includes("avalonia") || text.includes(".exe") ||
    text.includes("uwp") || text.includes("winui") || text.includes("windowsForms")
  ) platforms.push("windows");

  // Android
  if (
    text.includes("android") || text.includes("maui") || text.includes("xamarin") ||
    text.includes("kotlin") || text.includes("java") || text.includes("gradle") ||
    text.includes(".apk") || text.includes("google play") || text.includes("play store") ||
    text.includes("jetpack compose")
  ) platforms.push("android");

  // Linux
  if (
    text.includes("linux") || text.includes("gnome") || text.includes("kde") ||
    text.includes("apt") || text.includes("pacman") || text.includes("flatpak") ||
    text.includes("snap") || text.includes("ubuntu") || text.includes("debian") ||
    text.includes("arch linux") || text.includes("fedora") || text.includes(".deb") ||
    text.includes(".rpm") || text.includes("gtk") || text.includes("qt")
  ) platforms.push("linux");

  // Web
  if (
    text.includes("web") || text.includes("react") || text.includes("next.js") ||
    text.includes("nextjs") || text.includes("html") || text.includes("css") ||
    text.includes("vue") || text.includes("angular") || text.includes("svelte") ||
    text.includes("webpack") || text.includes("vite") || text.includes("npm") ||
    text.includes("yarn") || text.includes("pwa") || text.includes("capacitor") ||
    text.includes("ionic") || text.includes("node.js") || text.includes("nodejs") ||
    text.includes("express") || text.includes("fastapi") || text.includes("django") ||
    text.includes("flask") || text.includes("php") || text.includes("laravel") ||
    text.includes("rails") || text.includes("ruby") || text.includes("deno") ||
    text.includes("bun")
  ) platforms.push("web");

  // iOS
  if (
    text.includes("ios") || text.includes("swift") || text.includes("xcode") ||
    text.includes("cocoa") || text.includes("uikit") || text.includes("swiftui") ||
    text.includes("ipad") || text.includes("iphone") || text.includes("app store") ||
    text.includes("cocoapods") || text.includes("carthage") || text.includes(".ipa")
  ) platforms.push("ios");

  // Desktop (cross-platform) indicators
  if (
    text.includes("electron") || text.includes("tauri") || text.includes("flutter") ||
    text.includes("react native") || text.includes("dart") || text.includes("pyqt") ||
    text.includes("pyside") || text.includes("tkinter") || text.includes("java") && text.includes("desktop") ||
    text.includes("cross-platform") || text.includes("desktop app")
  ) {
    if (!platforms.includes("windows")) platforms.push("windows");
    if (!platforms.includes("linux")) platforms.push("linux");
  }

  if (platforms.length === 0) platforms.push("multi");
  return [...new Set(platforms)] as ("windows" | "android" | "linux" | "web" | "ios" | "multi")[];
}

function extractDescriptionFromReadme(readme: string): string {
  const lines = readme.split("\n");
  let startIdx = 0;

  // Skip first heading (title)
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("# ")) {
      startIdx = i + 1;
      break;
    }
  }

  const descriptionLines: string[] = [];
  let blankCount = 0;

  for (let i = startIdx; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Stop at next heading
    if (trimmed.startsWith("#")) break;

    // Skip badge images, HTML tags, links, empty lines with just badges
    if (
      trimmed.startsWith("![") ||
      trimmed.startsWith("<img") ||
      trimmed.startsWith("[!") ||
      trimmed.match(/^\[.*\]\(.*\)$/) ||
      trimmed.match(/^---+$/) ||
      trimmed.match(/^===+$/)
    ) {
      blankCount = 0;
      continue;
    }

    if (trimmed === "") {
      blankCount++;
      if (blankCount >= 2) break;
      continue;
    }

    blankCount = 0;
    // Clean markdown formatting
    const clean = trimmed
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
      .replace(/`([^`]+)`/g, "$1") // `code` -> code
      .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** -> bold
      .replace(/__([^_]+)__/g, "$1")
      .replace(/[*_~]/g, "")
      .trim();

    if (clean.length > 0) {
      descriptionLines.push(clean);
    }

    if (descriptionLines.length >= 3) break;
  }

  return descriptionLines.join(" ").trim();
}

function buildImportData(repo: Repo) {
  const features = parseFeaturesFromReadme(repo.readme || "");
  const platforms = detectPlatforms(repo.readme || "", repo.topics);
  const techs = [repo.language, ...repo.topics].filter(Boolean) as string[];

  // Fallback: use first meaningful paragraph from README if no GitHub description
  const shortDesc = repo.description || extractDescriptionFromReadme(repo.readme || "");

  return {
    name: repo.name,
    shortDescription: shortDesc,
    fullDescription: repo.readme || "",
    githubUrl: repo.html_url,
    technologies: techs,
    stars: repo.stargazers_count,
    license: repo.license || "",
    lastUpdated: repo.pushed_at?.split("T")[0] || "",
    version: repo.latestVersion?.replace(/^v/, "") || "",
    category: "open-source" as const,
    status: repo.archived ? ("archived" as const) : ("released" as const),
    platforms,
    features,
    githubRepoId: repo.id,
  };
}

export default function SyncPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<number | null>(null);
  const [imported, setImported] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchRepos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/github/repos", {
        headers: { "X-Requested-With": "xmlhttprequest" },
      });
      if (!res.ok) {
        setError("فشل جلب المشاريع من GitHub");
        return;
      }
      const data = await res.json();
      setRepos(data);
      setImported(new Set(data.filter((r: Repo) => r.alreadyImported).map((r: Repo) => r.id)));
    } catch {
      setError("حدث خطأ أثناء الاتصال بـ GitHub");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const importRepo = async (repo: Repo) => {
    setImporting(repo.id);
    setMessage("");
    setError("");

    const data = buildImportData(repo);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "xmlhttprequest",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setImported((prev) => new Set([...prev, repo.id]));
        setMessage(`تم استيراد "${repo.name}" بنجاح`);
        setTimeout(() => setMessage(""), 3000);
      } else {
        const body = await res.json();
        setError(body.error || "حدث خطأ أثناء الاستيراد");
      }
    } catch {
      setError("حدث خطأ أثناء الاستيراد");
    } finally {
      setImporting(null);
    }
  };

  const importAll = async () => {
    const unimported = repos.filter((r) => !r.alreadyImported && !imported.has(r.id));
    if (unimported.length === 0) return;

    setImporting(-1);
    setMessage("");
    let successCount = 0;
    let failCount = 0;

    for (const repo of unimported) {
      const data = buildImportData(repo);

      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "xmlhttprequest",
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          setImported((prev) => new Set([...prev, repo.id]));
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setImporting(null);
    if (failCount === 0) {
      setMessage(`تم استيراد ${successCount} مشاريع بنجاح`);
    } else {
      setMessage(`تم استيراد ${successCount} مشاريع، فشل ${failCount}`);
    }
    setTimeout(() => setMessage(""), 5000);
  };

  const unimportedCount = repos.filter((r) => !r.alreadyImported && !imported.has(r.id)).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-bold tracking-[0.2em] text-cyan/70 uppercase">
            // مزامنة GitHub
          </p>
          <h1 className="text-2xl font-bold">مزامنة المشاريع</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            جلب المشاريع من حسابك على GitHub واستيرادها
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchRepos}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-cyan/20 hover:text-cyan disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </button>
          {unimportedCount > 0 && (
            <button
              onClick={importAll}
              disabled={importing === -1}
              className="inline-flex items-center gap-2 rounded border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition-all hover:bg-cyan/20 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              استيراد الكل ({unimportedCount})
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-magenta/30 bg-magenta/10 px-4 py-3 text-sm text-magenta">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded border border-border bg-secondary/30" />
          ))}
        </div>
      ) : repos.length === 0 ? (
        <div className="glass-card rounded border py-16 text-center">
          <p className="text-muted-foreground">لا توجد مشاريع في حسابك</p>
        </div>
      ) : (
        <div className="space-y-3">
          {repos.map((repo) => {
            const isImported = repo.alreadyImported || imported.has(repo.id);
            const isLoading = importing === repo.id || importing === -1;

            return (
              <div
                key={repo.id}
                className={`glass-card relative rounded border p-5 transition-all ${
                  isImported ? "opacity-60" : ""
                }`}
              >
                <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/20" />
                <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/20" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{repo.name}</h3>
                      {repo.archived && (
                        <span className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                          أرشيف
                        </span>
                      )}
                      {repo.license && (
                        <span className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                          {repo.license}
                        </span>
                      )}
                      {repo.latestVersion && (
                        <span className="rounded border border-cyan/20 bg-cyan/5 px-2 py-0.5 text-[10px] font-mono text-cyan">
                          {repo.latestVersion}
                        </span>
                      )}
                      {isImported && (
                        <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 text-[10px] text-emerald-400">
                          <Check className="h-3 w-3" />
                          مستورد
                        </span>
                      )}
                    </div>

                    {repo.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {repo.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-cyan" />
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {repo.stargazers_count}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono">
                        <GitBranch className="h-3 w-3" />
                        {repo.pushed_at?.split("T")[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-cyan/20 hover:text-cyan"
                    >
                      GitHub
                    </a>
                    {!isImported && (
                      <button
                        onClick={() => importRepo(repo)}
                        disabled={isLoading}
                        className="rounded border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-xs font-medium text-cyan transition-all hover:bg-cyan/20 hover:border-cyan/60 disabled:opacity-50"
                      >
                        {isLoading ? "جاري..." : "استيراد"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
