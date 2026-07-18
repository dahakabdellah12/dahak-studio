"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.05)]"
          : "bg-background"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded border border-cyan/30 bg-cyan/10 text-sm font-bold text-cyan transition-all duration-300 group-hover:border-cyan/60 group-hover:bg-cyan/20 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            D
            <div className="absolute -top-px -left-px h-2 w-2 border-t border-l border-cyan/60" />
            <div className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-cyan/60" />
          </div>
          <span className="text-lg font-bold tracking-widest text-foreground">
            DAHAK{" "}
            <span className="text-cyan font-normal">Studio</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium tracking-wider uppercase transition-all duration-200",
                pathname === link.href
                  ? "text-cyan text-shadow-cyan"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 rounded border border-cyan/20 bg-cyan/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded border border-border text-muted-foreground transition-all hover:border-cyan/30 hover:text-cyan hover:shadow-[0_0_10px_rgba(0,240,255,0.1)] md:hidden"
          aria-label="القائمة"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-background/98 backdrop-blur-xl md:hidden"
          >
            {/* Scanlines overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
              <div className="h-full w-full" style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 4px)"
              }} />
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 h-16 w-16 border-t border-l border-cyan/15" />
            <div className="absolute top-4 right-4 h-16 w-16 border-t border-r border-cyan/15" />
            <div className="absolute bottom-4 left-4 h-16 w-16 border-b border-l border-cyan/15" />
            <div className="absolute bottom-4 right-4 h-16 w-16 border-b border-r border-cyan/15" />

            {/* System status line */}
            <div className="relative mx-6 mt-6 flex items-center gap-2 text-[10px] font-mono tracking-widest text-cyan/40 uppercase">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan/60" />
              system.nav.menu.active
              <span className="flex-1 h-px bg-gradient-to-r from-cyan/20 to-transparent" />
            </div>

            {/* Navigation links */}
            <div className="relative mx-6 mt-6 space-y-1">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "group flex items-center gap-4 rounded-sm border px-5 py-4 transition-all duration-200",
                        isActive
                          ? "border-cyan/30 bg-cyan/5 text-cyan shadow-[0_0_15px_rgba(0,240,255,0.05)]"
                          : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary/30 hover:text-foreground"
                      )}
                    >
                      <span className={cn(
                        "font-mono text-[10px] tracking-wider",
                        isActive ? "text-cyan/60" : "text-muted-foreground/40"
                      )}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium tracking-wider uppercase">
                        {link.label}
                      </span>
                      {isActive && (
                        <span className="mr-auto inline-block h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                      )}
                      <span className={cn(
                        "mr-auto text-[10px] font-mono transition-colors",
                        isActive ? "text-cyan/40" : "text-muted-foreground/0 group-hover:text-muted-foreground/30"
                      )}>
                        &gt;_
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-6 left-0 right-0 px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan/15 to-transparent" />
              <div className="mt-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-muted-foreground/30 uppercase">
                <span>dahak.studio</span>
                <span>v2.0.77</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
