import Link from "next/link";
import { logout } from "./actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue text-xs font-bold text-white">
              D
            </div>
            <span className="text-sm font-semibold">لوحة التحكم</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              عرض الموقع
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-red-500"
              >
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
