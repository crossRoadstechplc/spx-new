/* Phase 2: Site footer with clear information hierarchy */
import * as React from "react";
import Link from "next/link";
import { LazyImage } from "@/components/ui/lazy-image";
import { cn } from "@/lib/utils";
import { Linkedin } from "lucide-react";
import { LINKEDIN_ORG_URL, SITE_LOGO_PATH } from "@/lib/seo-config";
import { proseBodyClass } from "@/lib/typography";

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

interface SiteFooterProps {
  /** When false, hides the Insights link (e.g. no published posts). Defaults to true. */
  showInsightsLink?: boolean;
}

export function SiteFooter({ showInsightsLink = true }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container px-4 py-12 lg:px-8 lg:py-16">
        {/* Main Footer Content: brand full-width on small; link sections 2 cols → 3 cols → row with brand on lg */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-8 lg:items-start">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block" aria-label="SPX home">
              <LazyImage
                src={SITE_LOGO_PATH}
                alt="SPX"
                width={160}
                height={48}
                className="h-11 w-auto md:h-12"
              />
            </Link>
            <p className={cn(proseBodyClass, "max-w-md")}>
            At the intersection of business and development.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href={LINKEDIN_ORG_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="SPX on LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary/40"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Footer link columns: 2 on narrow screens, 3 from md, inside 3/5 width on large */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-10 md:grid-cols-3 lg:col-span-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-sm mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links
                    .filter(
                      (link) =>
                        showInsightsLink || link.href !== "/insights"
                    )
                    .map((link) => (
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
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} SPX. All rights reserved.
            </p>
            <nav
              aria-label="Legal and site links"
              className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
            >
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
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
