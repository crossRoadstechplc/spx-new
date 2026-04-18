/* Phase 2: Creative site header with elegant navigation */
"use client";

import * as React from "react";
import Link from "next/link";
import { LazyImage } from "@/components/ui/lazy-image";
import { SITE_LOGO_PATH } from "@/lib/seo-config";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  description?: string;
}

const navItems: NavItem[] = [
  { label: "Who We Are", href: "/who-we-are", description: "Our platform and vision" },
  { label: "What We Do", href: "/what-we-do", description: "Strategic services" },
  { label: "How We Work", href: "/how-we-work", description: "Our methodology" },
  { label: "Sectors", href: "/sectors", description: "Focus areas" },
  { label: "Our Work", href: "/our-work", description: "Projects and ventures" },
  { label: "Insights", href: "/insights", description: "Research and perspectives" },
  { label: "Partners", href: "/partners", description: "Collaborations" },
  { label: "Careers", href: "/careers", description: "Join us" },
];

export function SiteHeader({
  showInsightsNav = true,
}: {
  /** When false, the Insights link is hidden (no published insights yet). */
  showInsightsNav?: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const visibleNavItems = showInsightsNav
    ? navItems
    : navItems.filter((item) => item.href !== "/insights");

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center py-1" aria-label="SPX home">
          <LazyImage
            src={SITE_LOGO_PATH}
            alt="SPX"
            width={140}
            height={40}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative px-3 py-2 text-sm font-medium transition-colors",
                  "hover:text-primary",
                  isActive
                    ? "text-primary"
                    : "text-foreground/80"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Contact CTA (Desktop) */}
        <div className="hidden lg:block">
          <Button asChild size="sm" className="font-medium">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="lg:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden border-t border-border/40 bg-background"
          >
            <div className="container px-4 py-6 space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      "hover:bg-muted hover:text-primary",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80"
                    )}
                  >
                    <div>{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </Link>
                );
              })}
              <div className="pt-4">
                <Button asChild className="w-full font-medium">
                  <Link href="/contact">Contact</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
