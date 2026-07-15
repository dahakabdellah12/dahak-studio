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
        headers: { "Content-Type": "application/json" },
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
    "w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue focus:ring-1 focus:ring-blue";
  const labelClass = "block mb-1.5 text-xs font-medium text-muted-foreground";

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">وسائل التواصل</h1>
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-secondary/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">وسائل التواصل</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            أضف وتعديل روابط التواصل الاجتماعي
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addLink}
            className="inline-flex items-center gap-2 rounded-xl bg-blue px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue/25 transition-all hover:bg-blue-light"
          >
            <Plus className="h-4 w-4" />
            إضافة رابط
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${message.includes("بنجاح") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          {message}
        </div>
      )}

      {links.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center">
          <p className="text-muted-foreground">لا توجد روابط تواصل بعد</p>
          <button
            onClick={addLink}
            className="mt-3 text-sm text-blue hover:underline"
          >
            أضف رابطك الأول
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-4"
            >
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
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
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
            className="rounded-xl bg-blue px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue/25 transition-all hover:bg-blue-light disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      )}
    </div>
  );
}
