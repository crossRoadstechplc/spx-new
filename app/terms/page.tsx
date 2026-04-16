/* Phase 7: Terms of service page */
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL, SITE_DOMAIN_LABEL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions for using spxafrica.com and engaging with SPX (formerly Spiralytix)—Ethiopia-based consulting and strategy-to-implementation.",
};

export default function TermsPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Terms and Conditions"
        description="Rules for using our public website and how they relate to professional engagements with SPX."
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
              By accessing or using the SPX public website at <strong>{SITE_DOMAIN_LABEL}</strong>{" "}
              (&quot;Site&quot;), you agree to these Terms and Conditions.{" "}
              <strong>SPX</strong> is the trading name we use alongside our prior public brand,{" "}
              <strong>Spiralytix</strong>, as we complete the transition. If you do not agree,
              please stop using the Site. Separate written agreements apply to paid consulting,
              research, or implementation work.
            </p>

            <h2>Use of Services</h2>
            <h3>Permitted Use</h3>
            <p>You may use our website and services for:</p>
            <ul>
              <li>Researching information about SPX and our capabilities</li>
              <li>Submitting inquiries about potential engagements</li>
              <li>Accessing published insights and research</li>
              <li>Learning about our methodology and approach</li>
            </ul>

            <h3>Prohibited Use</h3>
            <p>You may not:</p>
            <ul>
              <li>Use our services for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our website</li>
              <li>Reproduce, modify, or distribute our content without permission</li>
              <li>Use automated systems to access our services without authorization</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software,
              is the property of SPX or its content suppliers and is protected by intellectual
              property laws.
            </p>

            <h2>Service Engagement</h2>
            <p>
              Any professional engagement with SPX will be governed by a separate agreement. These
              Terms and Conditions do not constitute an engagement agreement or create any client
              relationship.
            </p>

            <h2>Confidentiality</h2>
            <p>
              Information you share through contact forms or inquiries will be treated as
              confidential and used only for responding to your inquiry, unless you explicitly
              consent to other uses.
            </p>

            <h2>Disclaimers</h2>
            <p>
              Our website and published content are provided &quot;as is&quot; without warranties
              of any kind. While we strive for accuracy, we make no guarantees about the
              completeness or reliability of information presented.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              SPX shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of our website or services.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of our
              services after changes constitutes acceptance of the updated terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms and Conditions are governed by applicable law. Any disputes will be resolved
              through appropriate legal channels.
            </p>

            <h2>Contact</h2>
            <p>For questions about these Terms and Conditions, please contact us:</p>
            <ul>
              <li>
                Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                Contact form: <a href="/contact">{SITE_DOMAIN_LABEL}/contact</a>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
