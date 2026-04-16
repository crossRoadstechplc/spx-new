/* Accessibility page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, ORGANIZATION_PHONE } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Accessibility",
  description:
    "SPX commitment to an accessible web experience for visitors exploring our consulting, strategy-to-implementation, and SPX Insights content.",
};

export default function AccessibilityPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Accessibility"
        description="We aim to make spxafrica.com usable for people with diverse abilities across Ethiopia, Africa, and our global readership."
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
              <strong>SPX</strong> (formerly <strong>Spiralytix</strong>) publishes long-form
              insights, sector perspectives, and service descriptions for governments, enterprises,
              and development partners. We strive for clear structure, readable typography, keyboard
              access for navigation, and descriptive labels for interactive elements—consistent with
              the <strong>Web Content Accessibility Guidelines (WCAG) 2.1</strong> Level AA as our
              target for new and updated public pages.
            </p>

            <h2>What we are improving</h2>
            <p>We regularly review:</p>
            <ul>
              <li>Color contrast for body text, links, and focus states</li>
              <li>Heading hierarchy on long policy and insights pages</li>
              <li>Form labels and error messages on the contact flow</li>
              <li>Alt text for meaningful images and charts where we control the asset</li>
            </ul>

            <h2>Third-party content</h2>
            <p>
              Some embedded media, maps, or document viewers are provided by external platforms.
              Their accessibility may vary; when we select vendors, we favor options that support
              captions and keyboard use where feasible.
            </p>

            <h2>Feedback and assistance</h2>
            <p>
              If you encounter a barrier—such as a missing label, unreadable contrast, or a keyboard
              trap—please tell us so we can prioritize a fix:
            </p>
            <ul>
              <li>
                Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                Phone: <a href={`tel:${ORGANIZATION_PHONE.replace(/\s/g, "")}`}>{ORGANIZATION_PHONE}</a>
              </li>
              <li>
                <Link href="/contact">Contact form</Link> (include the page URL and a short
                description of the issue)
              </li>
            </ul>
            <p>
              We welcome suggestions in English or Amharic; we may request follow-up detail to
              reproduce technical issues.
            </p>

            <h2>Formal standards</h2>
            <p>
              Accessibility requirements evolve. We document major template changes alongside our{" "}
              <Link href="/privacy-notices">Privacy Notices</Link> and site releases. This statement
              does not create legally binding obligations beyond applicable law; it describes our
              operational intent for inclusive access to SPX&apos;s public information.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
