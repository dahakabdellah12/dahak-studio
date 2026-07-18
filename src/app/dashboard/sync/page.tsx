"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, GitBranch, Star, Download, Check } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  license: string | null;
  pushed_at: string;
  created_at: string;
  archived: boolean;
  size: number;
  alreadyImported: boolean;
}

export default function SyncPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<number | null>(null);
  const [imported, setImported] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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

    const techs = [repo.language, ...repo.topics].filter(Boolean) as string[];

    const data = {
      name: repo.name,
      shortDescription: repo.description || "",
      githubUrl: repo.html_url,
      technologies: techs,
      stars: repo.stargazers_count,
      license: repo.license || "",
      lastUpdated: repo.pushed_at?.split("T")[0] || "",
      category: "open-source" as const,
      status: repo.archived ? ("archived" as const) : ("released" as const),
      platforms: ["windows", "linux", "android", "web"] as ("windows" | "linux" | "android" | "web")[],
      githubRepoId: repo.id,
    };

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
      const techs = [repo.language, ...repo.topics].filter(Boolean) as string[];

      const data = {
        name: repo.name,
        shortDescription: repo.description || "",
        githubUrl: repo.html_url,
        technologies: techs,
        stars: repo.stargazers_count,
        license: repo.license || "",
        lastUpdated: repo.pushed_at?.split("T")[0] || "",
        category: "open-source" as const,
        status: repo.archived ? ("archived" as const) : ("released" as const),
        platforms: ["windows", "linux", "android", "web"] as ("windows" | "linux" | "android" | "web")[],
        githubRepoId: repo.id,
      };

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
                    <div className="flex items-center gap-2">
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
