/* Your Privacy Choices page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Your Privacy Choices",
  description:
    "Manage marketing email, understand your rights, and contact SPX about personal data related to spxafrica.com and SPX Insights.",
};

export default function PrivacyChoicesPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Your Privacy Choices"
        description="Control how SPX uses your information for newsletters, inquiries, and analytics—aligned with our work in Ethiopia and across Africa."
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
              If you subscribed to updates about <strong>SPX Insights</strong> or events, you can
              withdraw consent at any time:
            </p>
            <ul>
              <li>Use the unsubscribe link in the footer of any marketing email we send.</li>
              <li>
                Or use our dedicated{" "}
                <Link href="/newsletter/unsubscribe-email">email unsubscribe</Link> page if you no
                longer have the original message.
              </li>
            </ul>
            <p>
              Unsubscribing does not delete records we must keep for legal compliance (for example
              proof of consent or suppression lists).
            </p>

            <h2>Access, correction, and deletion</h2>
            <p>
              Depending on your jurisdiction, you may request access to personal data we hold
              about you, ask us to correct inaccuracies, or request deletion where no overriding
              legal obligation applies. SPX is headquartered in <strong>Ethiopia</strong>; we
              respond to valid requests in a reasonable timeframe.
            </p>
            <p>
              To make a request, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with &quot;Privacy request&quot;
              in the subject line, your name, and enough detail for us to verify your identity
              without collecting excessive sensitive data.
            </p>

            <h2>Cookies and analytics</h2>
            <p>
              For choices about cookies and similar technologies, read our{" "}
              <Link href="/cookie-notice">Cookie notice</Link> and{" "}
              <Link href="/cookie-settings">Cookie Settings</Link>. Browser-level controls remain
              the primary way to block non-essential storage.
            </p>

            <h2>Full policies</h2>
            <p>
              These choices summarize common actions. The authoritative descriptions of processing
              are in our <Link href="/privacy">Privacy Policy</Link> and sector-specific{" "}
              <Link href="/privacy-notices">Privacy Notices</Link>.
            </p>

            <h2>Contact</h2>
            <p>
              Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or{" "}
              <Link href="/contact">Contact SPX</Link>.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
