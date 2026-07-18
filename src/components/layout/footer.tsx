import Link from "next/link";
import { navLinks } from "@/lib/data/navigation";
import { siteConfig } from "@/lib/data/site";
import { SocialLinksList } from "@/components/social-links";

export function Footer() {
  return (
    <footer className="relative border-t border-border/30">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan/15 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded border border-cyan/20 bg-cyan/5 text-sm font-bold text-cyan">
                D
                <div className="absolute -top-px -left-px h-2 w-2 border-t border-l border-cyan/40" />
                <div className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-cyan/40" />
              </div>
              <span className="text-lg font-bold tracking-widest">
                DAHAK{" "}
                <span className="text-cyan font-normal">Studio</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground/60">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold tracking-[0.2em] text-cyan/50 uppercase">
              التنقل //
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground/60 transition-colors hover:text-cyan"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold tracking-[0.2em] text-cyan/50 uppercase">
              وسائل التواصل //
            </h3>
            <SocialLinksList className="flex gap-4" />
          </div>
        </div>

        <div className="mt-10 border-t border-border/30 pt-6">
          <p className="text-center text-xs text-muted-foreground/40">
            <span className="text-cyan/30">&lt;</span>
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/legal" className="text-cyan/50 hover:text-cyan transition-colors">
              {siteConfig.name}
            </Link>
            <span className="text-cyan/30"> /&gt;</span>{" "}
            جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
