/* Phase 7: Terms of service page */
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, SITE_DOMAIN_LABEL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Terms and Conditions",
  description:
    "Rules governing use of spxafrica.com and how they relate to professional engagements with SPX (trading name alongside Spiralytix during the transition).",
};

export default function TermsPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Terms and Conditions"
        description="Rules governing use of the SPX public website and its relation to professional engagements."
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

            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using <strong>{SITE_DOMAIN_LABEL}</strong> (&quot;Site&quot;), you
              agree to these Terms. <strong>SPX</strong> is the trading name used alongside{" "}
              <strong>Spiralytix</strong> during the transition. If you do not agree, discontinue
              use. Separate written agreements govern paid engagements.
            </p>

            <h2>Use of Services</h2>
            <h3>Permitted Use</h3>
            <p>You may use the Site to:</p>
            <ul>
              <li>Review information about SPX</li>
              <li>Submit inquiries regarding engagements</li>
              <li>Access published insights and materials</li>
              <li>Understand our approach and methodology</li>
            </ul>

            <h3>Prohibited Use</h3>
            <p>You may not:</p>
            <ul>
              <li>Use the Site for unlawful purposes</li>
              <li>Attempt unauthorized access</li>
              <li>Disrupt site functionality</li>
              <li>Reproduce, distribute, or modify Site content without authorization</li>
              <li>Use automated systems to access the Site without permission</li>
            </ul>

            <h2>Contact</h2>
            <p>
              Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
