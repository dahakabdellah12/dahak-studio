"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronLeft } from "lucide-react";
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
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 border-l border-cyan/20 bg-background/98 backdrop-blur-xl md:hidden"
            >
              {/* Top accent line */}
              <div className="h-px bg-gradient-to-r from-cyan/50 via-cyan to-cyan/50" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-cyan shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                  <span className="text-xs font-mono tracking-widest text-cyan/60 uppercase">NAV</span>
                </div>
                <button
                  onClick={closeMenu}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground transition-all hover:border-magenta/30 hover:text-magenta"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Divider */}
              <div className="mx-5 h-px bg-border" />

              {/* Navigation */}
              <div className="mt-4 space-y-1 px-3">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className={cn(
                          "group flex items-center gap-3 rounded border px-4 py-3 transition-all duration-200",
                          isActive
                            ? "border-cyan/30 bg-cyan/5 text-cyan"
                            : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary/30 hover:text-foreground"
                        )}
                      >
                        <span className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-mono",
                          isActive
                            ? "bg-cyan/20 text-cyan"
                            : "bg-secondary text-muted-foreground group-hover:bg-secondary/80"
                        )}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium tracking-wider uppercase">
                          {link.label}
                        </span>
                        <ChevronLeft className={cn(
                          "mr-auto h-3.5 w-3.5 transition-all",
                          isActive
                            ? "text-cyan opacity-100"
                            : "text-muted-foreground opacity-0 group-hover:opacity-50"
                        )} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom section */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/50 p-5">
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-muted-foreground/40 uppercase">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  <span>system.online</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-muted-foreground/30">
                  <span>DAHAK STUDIO</span>
                  <span className="text-cyan/30">v2.0.77</span>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 h-20 w-px bg-gradient-to-b from-cyan/30 to-transparent" />
              <div className="absolute bottom-16 left-0 h-20 w-px bg-gradient-to-b from-transparent to-cyan/30" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
