/* Sitemap page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";

export const metadata = {
  title: "Sitemap",
  description:
    "Main sections of spxafrica.com: who we are, what we do, insights, contact, terms, privacy notices, cookie notice, accessibility, and privacy choices.",
};

type SitemapGroup = { title: string; links: { href: string; label: string }[] };

const groups: SitemapGroup[] = [
  {
    title: "Company",
    links: [
      { href: "/who-we-are", label: "Who We Are" },
      { href: "/what-we-do", label: "What We Do" },
      { href: "/how-we-work", label: "How We Work" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Expertise & work",
    links: [
      { href: "/sectors", label: "Sectors" },
      { href: "/our-work", label: "Our Work" },
      { href: "/partners", label: "Partners" },
      { href: "/insights", label: "SPX Insights" },
    ],
  },
  {
    title: "Connect",
    links: [{ href: "/contact", label: "Contact" }],
  },
  {
    title: "Legal & trust",
    links: [
      { href: "/terms", label: "Terms and Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/privacy-notices", label: "Privacy Notices" },
      { href: "/privacy-choices", label: "Your Privacy Choices" },
      { href: "/cookie-notice", label: "Cookie Notice" },
      { href: "/cookie-settings", label: "Cookie Settings" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/sitemap", label: "Sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Sitemap"
        description="Quick links across the SPX public site: capabilities, insights, contact, and policies (terms, privacy notices, cookies, accessibility, privacy choices)."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto space-y-14 md:space-y-16">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Use this page to navigate <strong>spxafrica.com</strong>: company and methodology,
              sectors and work, <Link href="/insights" className="text-primary font-medium hover:underline">SPX Insights</Link>, and{" "}
              <Link href="/contact" className="text-primary font-medium hover:underline">contact</Link>. Legal and trust pages include{" "}
              <Link href="/terms" className="text-primary font-medium hover:underline">Terms and Conditions</Link>,{" "}
              <Link href="/privacy-notices" className="text-primary font-medium hover:underline">Privacy Notices</Link>,{" "}
              <Link href="/cookie-notice" className="text-primary font-medium hover:underline">Cookie Notice</Link>,{" "}
              <Link href="/cookie-settings" className="text-primary font-medium hover:underline">Cookie settings</Link>,{" "}
              <Link href="/accessibility" className="text-primary font-medium hover:underline">Accessibility</Link>, and{" "}
              <Link href="/privacy-choices" className="text-primary font-medium hover:underline">Your privacy choices</Link>. Individual insight URLs are listed on the Insights index and in{" "}
              <Link href="/sitemap.xml" className="text-primary font-medium hover:underline">
                sitemap.xml
              </Link>{" "}
              for crawlers.
            </p>

            <div className="grid gap-12 sm:gap-14 sm:grid-cols-2">
              {groups.map((group) => (
                <div key={group.title} className="space-y-5">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground border-b border-border/80 pb-3">
                    {group.title}
                  </h2>
                  <ul className="space-y-3.5">
                    {group.links.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-base text-muted-foreground hover:text-primary transition-colors inline-block py-0.5"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
