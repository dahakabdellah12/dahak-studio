"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";
import { cn } from "@/lib/utils";

const dashLinks = [
  { href: "/dashboard", label: "الرئيسية" },
  { href: "/dashboard/projects", label: "المشاريع" },
  { href: "/dashboard/social", label: "وسائل التواصل" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-6">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue text-xs font-bold text-white">
          D
        </div>
        <span className="text-sm font-semibold">لوحة التحكم</span>
      </Link>
      <nav className="hidden items-center gap-1 md:flex">
        {dashLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              pathname === link.href
                ? "bg-blue/10 text-blue"
                : "text-muted-foreground hover:text-foreground"
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
  );
}
