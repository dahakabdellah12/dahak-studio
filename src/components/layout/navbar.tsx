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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden border-t border-cyan/10 bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "rounded px-4 py-2.5 text-sm font-medium tracking-wider uppercase transition-all",
                    pathname === link.href
                      ? "border border-cyan/20 bg-cyan/5 text-cyan text-shadow-cyan"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
