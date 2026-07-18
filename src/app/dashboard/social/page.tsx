"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { SocialLink } from "@/lib/types";

const iconOptions = [
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "discord", label: "Discord" },
  { value: "telegram", label: "Telegram" },
  { value: "email", label: "بريد إلكتروني" },
  { value: "website", label: "موقع آخر" },
];

export default function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/social")
      .then((res) => res.json())
      .then((data) => setLinks(Array.isArray(data) ? data : []))
      .catch(() => setLinks([]))
      .finally(() => setLoading(false));
  }, []);

  const addLink = () => {
    setLinks([...links, { name: "", url: "", icon: "github" }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/social", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "xmlhttprequest",
        },
        body: JSON.stringify({ links }),
      });
      if (res.ok) {
        setMessage("تم الحفظ بنجاح");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("حدث خطأ أثناء الحفظ");
      }
    } catch {
      setMessage("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-cyan focus:ring-1 focus:ring-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.05)]";
  const labelClass = "block mb-1.5 text-xs font-medium text-muted-foreground";

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">وسائل التواصل</h1>
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded border border-border bg-secondary/30" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-bold tracking-[0.2em] text-cyan/70 uppercase">
            // شبكات التواصل
          </p>
          <h1 className="text-2xl font-bold">وسائل التواصل</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            أضف وتعديل روابط التواصل الاجتماعي
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addLink}
            className="inline-flex items-center gap-2 rounded border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition-all hover:bg-cyan/20 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <Plus className="h-4 w-4" />
            إضافة رابط
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 rounded border px-4 py-3 text-sm ${message.includes("بنجاح") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-magenta/30 bg-magenta/10 text-magenta"}`}>
          {message}
        </div>
      )}

      {links.length === 0 ? (
        <div className="glass-card rounded border py-16 text-center">
          <p className="text-muted-foreground">لا توجد روابط تواصل بعد</p>
          <button
            onClick={addLink}
            className="mt-3 text-sm text-cyan hover:underline"
          >
            أضف رابطك الأول
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link, i) => (
            <div
              key={i}
              className="glass-card relative rounded border p-4"
            >
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/20" />
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/20" />

              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>الاسم</label>
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateLink(i, "name", e.target.value)}
                      placeholder="GitHub"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>الرابط</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      placeholder="https://..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>الأيقونة</label>
                    <select
                      value={link.icon}
                      onChange={(e) => updateLink(i, "icon", e.target.value)}
                      className={inputClass}
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => removeLink(i)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border text-muted-foreground transition-all hover:border-magenta/30 hover:text-magenta"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded border border-cyan/40 bg-cyan/10 px-6 py-2.5 text-sm font-medium text-cyan transition-all hover:bg-cyan/20 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      )}
    </div>
  );
}
