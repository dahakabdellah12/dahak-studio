"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteProjectButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "X-Requested-With": "xmlhttprequest" },
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("فشل الحذف");
      }
    } catch {
      alert("حدث خطأ");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground transition-all hover:border-magenta/30 hover:text-magenta"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
