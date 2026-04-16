/* Your Privacy Choices page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, SITE_DOMAIN_LABEL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Your Privacy Choices",
  description:
    `Manage marketing email, cookies, and personal data requests for ${SITE_DOMAIN_LABEL} and SPX Insights-in line with our Privacy Policy and Privacy Notices.`,
};

export default function PrivacyChoicesPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Your Privacy Choices"
        description={`How to control SPX use of your information on ${SITE_DOMAIN_LABEL}: newsletters, inquiries, cookies, and data requests—consistent with our Privacy Notices.`}
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

            <h2>Marketing and Insights email</h2>
            <p>
              If you subscribed to <strong>SPX Insights</strong> or related updates, you can
              withdraw consent at any time:
            </p>
            <ul>
              <li>Use the unsubscribe link in any marketing email we send.</li>
              <li>
                Or use our{" "}
                <Link href="/newsletter/unsubscribe-email">email unsubscribe</Link> page if you
                no longer have the original message.
              </li>
            </ul>
            <p>
              Unsubscribing does not delete records we must keep for legal compliance (for example
              proof of consent or suppression lists).
            </p>

            <h2>Access, correction, and deletion</h2>
            <p>
              Depending on your jurisdiction, you may request access, correction, or deletion of
              personal data where no overriding legal obligation applies. SPX is headquartered in{" "}
              <strong>Addis Ababa, Ethiopia</strong>.
            </p>
            <p>
              Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with
              &quot;Privacy request&quot; in the subject line, your name, and enough detail to
              verify your identity without collecting excessive sensitive data.
            </p>

            <h2>Cookies</h2>
            <p>
              For categories and control, see the <Link href="/cookie-notice">Cookie notice</Link>{" "}
              and <Link href="/cookie-settings">Cookie settings</Link>. Browser settings remain the
              primary way to block non-essential storage.
            </p>

            <h2>Full policies</h2>
            <p>
              Authoritative detail is in the <Link href="/privacy">Privacy Policy</Link> and{" "}
              <Link href="/privacy-notices">Privacy Notices</Link> (overview of handling when using
              the site, Insights, newsletter, and contact).
            </p>

            <h2>Contact</h2>
            <p>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ·{" "}
              <Link href="/contact">Contact</Link>
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
