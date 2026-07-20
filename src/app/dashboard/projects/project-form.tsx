"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import type { Project, ProjectCategory, Platform, ProjectStatus } from "@/lib/types";

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "desktop", label: "سطح مكتب" },
  { value: "mobile", label: "محمول" },
  { value: "game", label: "ألعاب" },
  { value: "open-source", label: "مصادر مفتوحة" },
  { value: "os", label: "أنظمة تشغيل" },
  { value: "library", label: "مكتبات" },
  { value: "design", label: "تصميم" },
  { value: "experiment", label: "تجارب" },
  { value: "article", label: "مقالات" },
];

const platforms: { value: Platform; label: string }[] = [
  { value: "windows", label: "ويندوز" },
  { value: "android", label: "أندرويد" },
  { value: "linux", label: "لينكس" },
  { value: "web", label: "ويب" },
  { value: "ios", label: "آيوس" },
  { value: "multi", label: "متعدد" },
];

const statuses: { value: ProjectStatus; label: string }[] = [
  { value: "released", label: "صادر" },
  { value: "in-development", label: "قيد التطوير" },
  { value: "beta", label: "تجريبي" },
  { value: "archived", label: "مؤرشف" },
];

interface ProjectFormProps {
  initial?: Project;
  mode: "create" | "edit";
}

export function ProjectForm({ initial, mode }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initial?.name || "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription || "");
  const [fullDescription, setFullDescription] = useState(initial?.fullDescription || "");
  const [category, setCategory] = useState<ProjectCategory>(initial?.category || "desktop");
  const [status, setStatus] = useState<ProjectStatus>(initial?.status || "in-development");
  const [platformsList, setPlatformsList] = useState<Platform[]>(initial?.platforms || []);
  const [technologies, setTechnologies] = useState(initial?.technologies?.join(", ") || "");
  const [version, setVersion] = useState(initial?.version || "");
  const [lastUpdated, setLastUpdated] = useState(initial?.lastUpdated || new Date().toISOString().split("T")[0]);
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail || "");
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl || "");
  const [websiteUrl, setWebsiteUrl] = useState(initial?.websiteUrl || "");
  const [downloadUrl, setDownloadUrl] = useState(initial?.downloadUrl || "");
  const [license, setLicense] = useState(initial?.license || "");
  const [featuresText, setFeaturesText] = useState(initial?.features?.join("\n") || "");
  const [screenshots, setScreenshots] = useState<string[]>(initial?.screenshots || []);
  const [newScreenshotUrl, setNewScreenshotUrl] = useState("");
  const [notes, setNotes] = useState(initial?.notes || "");

  const togglePlatform = (p: Platform) => {
    setPlatformsList((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const addScreenshot = () => {
    const url = newScreenshotUrl.trim();
    if (!url) return;
    if (!/^https?:\/\/.+/.test(url)) {
      setError("رابط الصورة يجب أن يبدأ بـ http:// أو https://");
      return;
    }
    setScreenshots((prev) => [...prev, url]);
    setNewScreenshotUrl("");
    setError("");
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = {
      name,
      shortDescription,
      fullDescription,
      category,
      status,
      platforms: platformsList,
      technologies: technologies.split(",").map((t) => t.trim()).filter(Boolean),
      version,
      lastUpdated,
      thumbnail,
      githubUrl,
      websiteUrl,
      downloadUrl,
      license,
      features: featuresText.split("\n").filter(Boolean),
      screenshots,
      notes,
    };

    try {
      const url = mode === "edit" && initial ? `/api/projects/${initial.id}` : "/api/projects";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "xmlhttprequest",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/dashboard/projects");
        router.refresh();
      } else {
        setError("حدث خطأ، حاول مرة أخرى");
      }
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-cyan focus:ring-1 focus:ring-cyan";
  const labelClass = "block mb-1.5 text-xs font-medium text-muted-foreground";
  const sectionTitle = "mb-4 text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded border border-magenta/30 bg-magenta/10 px-4 py-3 text-sm text-magenta">
          {error}
        </div>
      )}

      <div className="glass-card relative rounded border p-6">
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
        <h2 className={sectionTitle}>// المعلومات الأساسية</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>اسم المشروع *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>وصف مختصر</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>وصف كامل</label>
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className={inputClass}
              rows={4}
            />
          </div>
          <div>
            <label className={labelClass}>الفئة</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>الحالة</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className={inputClass}
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>الإصدار</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>آخر تحديث</label>
            <input
              type="date"
              value={lastUpdated}
              onChange={(e) => setLastUpdated(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="glass-card relative rounded border p-6">
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
        <h2 className={sectionTitle}>// المنصات</h2>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => togglePlatform(p.value)}
              className={`rounded border px-3 py-1.5 text-xs transition-all ${
                platformsList.includes(p.value)
                  ? "border-cyan/50 bg-cyan/10 text-cyan"
                  : "border-border bg-secondary/50 text-muted-foreground hover:border-cyan/20 hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card relative rounded border p-6">
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
        <h2 className={sectionTitle}>// التقنيات والروابط</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>التقنيات (مفصولة بفاصلة)</label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="C#, WPF, .NET"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>رابط GitHub</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>رابط الموقع</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>رابط التحميل</label>
            <input
              type="url"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>الترخيص</label>
            <input
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="MIT"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>لوجو المشروع</label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/logo.png"
              className={inputClass}
            />
            {thumbnail && (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail}
                  alt="معاينة اللوجو"
                  className="h-14 w-14 rounded border border-border object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <span className="text-xs text-muted-foreground">معاينة اللوجو</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card relative rounded border p-6">
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
        <h2 className={sectionTitle}>// الصور ({screenshots.length})</h2>
        <div className="space-y-3">
          {screenshots.map((url, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono text-muted-foreground w-6 text-center">
                {i + 1}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`صورة ${i + 1}`}
                className="h-12 w-20 shrink-0 rounded border border-border object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <input
                type="url"
                value={url}
                readOnly
                className="flex-1 rounded border border-border bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground font-mono"
              />
              <button
                type="button"
                onClick={() => removeScreenshot(i)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border text-muted-foreground transition-all hover:border-magenta/30 hover:text-magenta"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={newScreenshotUrl}
              onChange={(e) => setNewScreenshotUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addScreenshot(); } }}
              placeholder="https://example.com/screenshot.png"
              className="flex-1 rounded border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-cyan"
            />
            <button
              type="button"
              onClick={addScreenshot}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-cyan/30 bg-cyan/5 text-cyan transition-all hover:bg-cyan/10"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card relative rounded border p-6">
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
        <h2 className={sectionTitle}>// الميزات</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>الميزات (سطر واحد لكل ميزة)</label>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className={inputClass}
              rows={4}
              placeholder={"ميزة 1\nميزة 2\nميزة 3"}
            />
          </div>
        </div>
      </div>

      <div className="glass-card relative rounded border p-6">
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
        <h2 className={sectionTitle}>// ملاحظات المشروع</h2>
        <div>
          <label className={labelClass}>ملاحظات خاصة بالمشروع (وصف، ميزات، أي ملاحظات)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={inputClass}
            rows={6}
            placeholder={"أضف ملاحظاتك هنا...\n\nيمكنك كتابة أي معلومات إضافية عن المشروع"}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded border border-cyan/40 bg-cyan/10 px-6 py-2.5 text-sm font-medium text-cyan transition-all hover:bg-cyan/20 hover:border-cyan/60 disabled:opacity-50"
        >
          {loading ? "جاري الحفظ..." : mode === "edit" ? "حفظ التعديلات" : "إنشاء المشروع"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-border bg-secondary/50 px-6 py-2.5 text-sm text-muted-foreground transition-all hover:border-cyan/20 hover:text-cyan"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
