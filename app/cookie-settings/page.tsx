/* Cookie Settings page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, SITE_DOMAIN_LABEL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Cookie Settings",
  description:
    `How to manage cookies and similar technologies on ${SITE_DOMAIN_LABEL}: browser controls, essential cookies, and contact.`,
};

export default function CookieSettingsPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Cookie Settings"
        description={`Manage cookies and similar technologies when you use ${SITE_DOMAIN_LABEL}, in line with our Cookie notice.`}
      />

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className={LEGAL_DOCUMENT_PROSE}>
            <div className={LEGAL_DOCUMENT_META}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Last updated
              </p>
              <p className="mt-2 text-sm text-foreground tabular-nums">{lastUpdated}</p>
            </div>

            <h2>What this page is for</h2>
            <p>
              The SPX public site uses cookies and similar technologies as described in our{" "}
              <Link href="/cookie-notice">Cookie notice</Link>: strictly necessary, functional where
              applicable, analytics in aggregated form, and possible third-party cookies from
              embedded content. This page explains how you can control them.
            </p>

            <h2>Browser controls</h2>
            <p>
              You can delete or block cookies through your browser. Blocking cookies may affect
              site functionality (for example forms or saved preferences).
            </p>
            <ul>
              <li>
                <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site
                data
              </li>
              <li>
                <strong>Safari:</strong> Settings → Privacy → Manage Website Data
              </li>
              <li>
                <strong>Firefox:</strong> Settings → Privacy and Security → Cookies and Site Data
              </li>
              <li>
                <strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete
                cookies
              </li>
            </ul>

            <h2>Strictly necessary</h2>
            <p>
              Some storage is required for core operation, security, and remembering essential
              choices. These cannot be turned off through the site without breaking basic use.
            </p>

            <h2>Analytics and preferences</h2>
            <p>
              Non-essential cookies (for example preferences or aggregated analytics) can often be
              limited via browser settings. Details on categories appear in the{" "}
              <Link href="/cookie-notice">Cookie notice</Link>.
            </p>

            <h2>Privacy choices beyond cookies</h2>
            <p>
              Marketing and personal data requests are covered under our{" "}
              <Link href="/privacy">Privacy Policy</Link>, <Link href="/privacy-notices">Privacy Notices</Link>, and{" "}
              <Link href="/privacy-choices">Your privacy choices</Link>.
            </p>

            <h2>Contact</h2>
            <p>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
