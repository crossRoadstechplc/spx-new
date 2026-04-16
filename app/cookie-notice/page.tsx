/* Cookie Notice page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, SITE_DOMAIN_LABEL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Cookie Notice",
  description:
    "How SPX uses cookies and similar technologies on spxafrica.com for essential functionality, preferences, and aggregated analytics.",
};

export default function CookieNoticePage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Cookie Notice"
        description="What cookies and similar technologies we use on our public site, and how you can control them."
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

            <h2>Scope</h2>
            <p>
              This notice applies to visitors of <strong>{SITE_DOMAIN_LABEL}</strong>, the public
              website of <strong>SPX</strong> (formerly marketed as <strong>Spiralytix</strong>), an
              Ethiopia-based consulting and strategy-to-implementation firm serving partners across
              Africa. It explains how we use cookies, local storage, and similar technologies
              (&quot;cookies&quot;) alongside our <Link href="/privacy">Privacy Policy</Link> and{" "}
              <Link href="/privacy-notices">Privacy Notices</Link>.
            </p>

            <h2>What cookies are</h2>
            <p>
              Cookies are small text files stored on your device. They help the site remember
              preferences, keep sessions secure, and understand—in aggregate—which content (such as{" "}
              <Link href="/insights">SPX Insights</Link>) is useful to readers.
            </p>

            <h2>Types we use</h2>
            <h3>Strictly necessary</h3>
            <p>
              Required for core operation—for example load balancing, security, remembering cookie
              choices, or keeping you signed in if we offer authenticated areas. These cannot be
              switched off without breaking the experience.
            </p>
            <h3>Functional</h3>
            <p>
              Used to remember choices you make (such as language or form drafts where implemented).
            </p>
            <h3>Analytics</h3>
            <p>
              Where enabled, we may use first-party or privacy-oriented analytics to collect
              aggregated usage data (pages viewed, approximate region, device type). We use this to
              improve navigation between our consulting, sectors, and insights content—not to build
              individual advertising profiles on this site.
            </p>

            <h2>Third parties</h2>
            <p>
              Embedded media or maps may set their own cookies when you interact with them. Those
              services have separate policies; we encourage you to review them when you leave our
              domain.
            </p>

            <h2>How to control cookies</h2>
            <p>
              You can delete or block cookies through your browser settings. You can also read{" "}
              <Link href="/cookie-settings">Cookie Settings</Link> for how we present choices on
              this site. Blocking all cookies may affect form behavior or saved preferences.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this notice:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or{" "}
              <Link href="/contact">Contact SPX</Link>.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
