/* Accessibility page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, ORGANIZATION_PHONE, SITE_DOMAIN_LABEL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Accessibility",
  description:
    `Accessibility at SPX (${SITE_DOMAIN_LABEL})our commitment, ongoing improvements, and how to report barriers.`,
};

export default function AccessibilityPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Accessibility"
        description={`We aim to make ${SITE_DOMAIN_LABEL} usable for visitors exploring SPX—insights, sectors, and contact—regardless of ability.`}
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

            <h2>Our commitment</h2>
            <p>
              <strong>SPX</strong> (trading name alongside <strong>Spiralytix</strong> during the
              transition) publishes the public site for partners and readers. We work toward clear
              structure, readable typography, keyboard access, and descriptive labels for
              interactive elements, using <strong>WCAG 2.1 Level AA</strong> as our target for new
              and updated public pages where feasible.
            </p>

            <h2>What we review</h2>
            <p>We regularly review:</p>
            <ul>
              <li>Color contrast for body text, links, and focus states</li>
              <li>Heading hierarchy on policy and insights pages</li>
              <li>Form labels and error messages on the contact flow</li>
              <li>Alt text for images and figures where we control the asset</li>
            </ul>

            <h2>Third-party content</h2>
            <p>
              Embedded media, maps, or tools from other providers may behave differently. Their
              accessibility varies; we favor options that support keyboard use and captions where we
              can.
            </p>

            <h2>Feedback</h2>
            <p>
              If you hit a barrier (missing label, poor contrast, keyboard trap), tell us the page
              URL and what went wrong:
            </p>
            <ul>
              <li>
                Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                Phone: <a href={`tel:${ORGANIZATION_PHONE.replace(/\s/g, "")}`}>{ORGANIZATION_PHONE}</a>
              </li>
              <li>
                <Link href="/contact">Contact form</Link>
              </li>
            </ul>

            <h2>Related policies</h2>
            <p>
              For how we handle data when you use the site, see{" "}
              <Link href="/privacy-notices">Privacy Notices</Link> and{" "}
              <Link href="/privacy-choices">Your privacy choices</Link>.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
