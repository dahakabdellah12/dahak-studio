"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { logout } from "./actions";
import { cn } from "@/lib/utils";

const dashLinks = [
  { href: "/dashboard", label: "الرئيسية" },
  { href: "/dashboard/projects", label: "المشاريع" },
  { href: "/dashboard/social", label: "التواصل" },
  { href: "/dashboard/sync", label: "المزامنة" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const isSubPage = pathname !== "/dashboard";

  return (
    <div className="flex items-center gap-4 overflow-x-auto">
      {isSubPage && (
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-cyan"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          الداش بورد
        </Link>
      )}
      <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded border border-cyan/40 bg-cyan/10 text-xs font-bold text-cyan">
          D
        </div>
        <span className="text-sm font-semibold">لوحة التحكم</span>
      </Link>
      <nav className="flex items-center gap-1">
        {dashLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded border px-3 py-1.5 text-xs font-medium transition-all",
              pathname === link.href
                ? "border-cyan/30 bg-cyan/10 text-cyan"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function DashboardActions() {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <Link
        href="/"
        className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-cyan/20 hover:text-cyan"
      >
        عرض الموقع
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-magenta/30 hover:text-magenta"
        >
          خروج
        </button>
      </form>
    </div>
  );
}
