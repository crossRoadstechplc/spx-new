/* Privacy Notices page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, SITE_DOMAIN_LABEL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Privacy Notices",
  description:
    "How information is handled when using spxafrica.com, reading SPX Insights, or contacting the team-Addis Ababa, Ethiopia; SPX and Spiralytix refer to the same entity.",
};

export default function PrivacyNoticesPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Privacy Notices"
        description="Overview of how information is handled when using spxafrica.com, reading SPX Insights, or contacting the team."
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
              These notices apply to users of the SPX public website, including{" "}
              <Link href="/insights">Insights</Link>, newsletter sign-ups, and{" "}
              <Link href="/contact">contact</Link> forms. SPX is headquartered in{" "}
              <strong>Addis Ababa, Ethiopia</strong> and operates across Africa. References to{" "}
              <strong>Spiralytix</strong> and <strong>SPX</strong> refer to the same entity.
            </p>

            <h2>Relationship to Privacy Policy</h2>
            <p>
              The <Link href="/privacy">Privacy Policy</Link> provides full details. These notices
              summarize key applications across website use, marketing communication, and
              inquiries.
            </p>

            <h2>Website and Analytics</h2>
            <p>
              Technical data (device type, region, pages viewed) may be processed for security,
              performance, and content improvement. Cookies are described separately in our{" "}
              <Link href="/cookie-notice">Cookie notice</Link> and{" "}
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
