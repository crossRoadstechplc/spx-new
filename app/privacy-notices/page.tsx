/* Privacy Notices page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, ORGANIZATION_MAP_URL, SITE_DOMAIN_LABEL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Privacy Notices",
  description:
    "How SPX (formerly Spiralytix) describes its data practices across our public website, insights, and inquiries—based in Ethiopia and serving partners across Africa.",
};

export default function PrivacyNoticesPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Privacy Notices"
        description="Transparency about how we handle information when you use spxafrica.com, read SPX Insights, or contact our team."
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

            <h2>Who this applies to</h2>
            <p>
              These notices describe SPX&apos;s privacy practices for visitors and users of our
              public website at <strong>{SITE_DOMAIN_LABEL}</strong>, including the{" "}
              <Link href="/insights">Insights</Link> library, newsletter sign-up flows, and the{" "}
              <Link href="/contact">Contact</Link> form. SPX is an Africa-focused consulting and
              strategy-to-implementation organization headquartered in{" "}
              <strong>Addis Ababa, Ethiopia</strong>, operating across East Africa and the wider
              continent. We are transitioning our public brand from <strong>Spiralytix</strong> to{" "}
              <strong>SPX</strong>; references to either name describe the same operating entity
              for purposes of these notices.
            </p>

            <h2>Relationship to our Privacy Policy</h2>
            <p>
              Our <Link href="/privacy">Privacy Policy</Link> is the primary document explaining
              what we collect, why we use it, retention, and your rights. These{" "}
              <strong>Privacy Notices</strong> summarize how that policy applies in specific
              contexts (website browsing, marketing email, and business inquiries) and point you to
              the right controls—such as <Link href="/privacy-choices">Your Privacy Choices</Link>{" "}
              and <Link href="/cookie-settings">Cookie Settings</Link>.
            </p>

            <h2>Website and analytics</h2>
            <p>
              When you browse SPX content, we may process technical data (for example device type,
              approximate region, and pages viewed) to keep the site secure, measure readership, and
              improve clarity of our consulting and insights materials. Where we use cookies or
              similar technologies, we describe them in our{" "}
              <Link href="/cookie-notice">Cookie notice</Link>. We do not sell your personal
              information.
            </p>

            <h2>Contact and project inquiries</h2>
            <p>
              If you email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use the
              contact form, we process your name, organization, message, and any attachments you
              provide to respond to consulting, partnership, or employment-related requests. This
              information is used for professional correspondence and is retained only as long as
              needed for that relationship or as required by law.
            </p>

            <h2>Insights and newsletter</h2>
            <p>
              <strong>SPX Insights</strong> articles may collect readership metrics in aggregate.
              If you subscribe to email updates, we process your email address and preferences under
              the terms stated at subscription and in our Privacy Policy. You may withdraw consent
              using links in each email or via{" "}
              <Link href="/newsletter/unsubscribe-email">email unsubscribe</Link>.
            </p>

            <h2>Location and supervisory contacts</h2>
            <p>
              SPX is based in Ethiopia. Depending on your jurisdiction, you may have additional
              rights regarding access, correction, or deletion of personal data. To exercise those
              rights or ask a question about these notices, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or visit our{" "}
              <Link href="/contact">Contact</Link> page. Our office location is shown on{" "}
              <a href={ORGANIZATION_MAP_URL} target="_blank" rel="noreferrer noopener">
                Google Maps
              </a>
              .
            </p>

            <h2>Changes</h2>
            <p>
              We may update these notices when our services, analytics, or regulations change.
              Material updates will be reflected by revising the &quot;Last updated&quot; date above
              and, where appropriate, summarizing changes on this page.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
