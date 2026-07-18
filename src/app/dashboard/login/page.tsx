"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("كلمة السر غير صحيحة");
      }
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded border border-cyan/30 bg-cyan/5 text-cyan shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <Lock className="h-7 w-7" />
          </div>
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-cyan/70 uppercase">
            // الوصول المحظور
          </p>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            أدخل كلمة السر للدخول
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة السر"
              className="w-full rounded border border-border bg-secondary/50 px-4 py-3 text-center font-mono text-sm outline-none transition-all focus:border-cyan focus:ring-1 focus:ring-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.1)]"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-center text-sm text-magenta">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded border border-cyan/40 bg-cyan/10 py-3 text-sm font-medium text-cyan transition-all hover:bg-cyan/20 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] disabled:opacity-50"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
