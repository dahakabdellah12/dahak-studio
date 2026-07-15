import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { navLinks } from "@/lib/data/navigation";
import { siteConfig } from "@/lib/data/site";
import { GithubIcon } from "@/components/social-icons";

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon className="h-4.5 w-4.5" />,
};

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue text-sm font-bold text-white">
                D
              </div>
              <span className="text-lg font-semibold tracking-tight">
                DAHAK{" "}
                <span className="text-muted-foreground font-normal">
                  Studio
                </span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              التنقل :
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              وسائل التواصل :
            </h3>
            <div className="flex gap-5">
              {siteConfig.socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-all hover:bg-blue/10 hover:text-blue"
                  aria-label={social.name}
                >
                  {iconMap[social.icon] ?? <ExternalLink className="h-4.5 w-4.5" />}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/legal" className="hover:text-foreground transition-colors">
              {siteConfig.name}
            </Link>
            . جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
