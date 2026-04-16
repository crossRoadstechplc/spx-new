/* Cookie Notice page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, SITE_DOMAIN_LABEL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Cookie Notice",
  description:
    "Use of cookies and similar technologies on spxafrica.com—strictly necessary, functional, analytics, and third parties.",
};

export default function CookieNoticePage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Cookie Notice"
        description={`Use of cookies and similar technologies on ${SITE_DOMAIN_LABEL}.`}
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
            <p>Applies to visitors of the SPX public website.</p>

            <h2>What Cookies Are</h2>
            <p>
              Cookies are small files stored on devices to support functionality and measure usage.
            </p>

            <h2>Types Used</h2>
            <h3>Strictly Necessary</h3>
            <p>Required for site operation, security, and core functionality.</p>
            <h3>Functional</h3>
            <p>Store preferences such as language or form inputs.</p>
            <h3>Analytics</h3>
            <p>Used in aggregated form to understand usage and improve content.</p>
            <h3>Third Parties</h3>
            <p>
              External services may set cookies when interacting with embedded content. See also
              our <Link href="/privacy">Privacy Policy</Link> and{" "}
              <Link href="/privacy-notices">Privacy Notices</Link>.
            </p>

            <h2>Control</h2>
            <p>
              Cookies can be managed through browser settings. Blocking cookies may affect
              functionality. For how we present choices on this site, see{" "}
              <Link href="/cookie-settings">Cookie settings</Link>.
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
