/* Phase 2: Site footer with clear information hierarchy */
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Linkedin, Instagram } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Company",
    links: [
      { label: "Who We Are", href: "/who-we-are" },
      { label: "What We Do", href: "/what-we-do" },
      { label: "How We Work", href: "/how-we-work" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Expertise",
    links: [
      { label: "Sectors", href: "/sectors" },
      { label: "Our Work", href: "/our-work" },
      { label: "Partners", href: "/partners" },
      { label: "Insights", href: "/insights" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "X", href: "https://x.com" },
    ],
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container px-4 py-12 lg:px-8 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block mb-4"
            >
              <span className="text-4xl font-bold tracking-tight text-foreground">SPX</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              A strategy-to-implementation platform designing, building, and scaling market-shaping systems across emerging markets.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="https://x.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Follow SPX on X"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary/40"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M18.244 2H21.5l-7.11 8.127L22.75 22h-6.544l-5.124-6.72L5.2 22H1.94l7.604-8.693L1.25 2h6.71l4.63 6.158L18.244 2Zm-1.141 18.05h1.805L6.976 3.86H5.04L17.103 20.05Z" />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Follow SPX on LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary/40"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Follow SPX on Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary/40"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-muted-foreground transition-colors",
                        "hover:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} SPX. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                href="/privacy-notices"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Notices
              </Link>
              <Link
                href="/cookie-notice"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie notice
              </Link>
              <Link
                href="/cookie-settings"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Settings
              </Link>
              <Link
                href="/sitemap"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Sitemap
              </Link>
              <Link
                href="/accessibility"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Accessibility
              </Link>
              <Link
                href="/privacy-choices"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                Your Privacy Choices
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
