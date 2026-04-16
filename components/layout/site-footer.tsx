/* Phase 2: Site footer with clear information hierarchy */
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Linkedin } from "lucide-react";
import { LINKEDIN_ORG_URL } from "@/lib/seo-config";

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
      { label: "LinkedIn", href: LINKEDIN_ORG_URL },
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
                href={LINKEDIN_ORG_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Spiralytix on LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary/40"
              >
                <Linkedin className="h-4 w-4" />
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
