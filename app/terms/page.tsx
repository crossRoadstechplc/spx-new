/* Phase 7: Terms of service page */
import { SiteLayout, PageHero, Container } from "@/components/layout";

export const metadata = {
  title: "Terms of Service | SPX",
  description: "SPX terms of service and engagement terms.",
};

export default function TermsPage() {
  const lastUpdated = "March 26, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Terms of Service"
        description="Terms and conditions for using SPX services"
      />

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="prose prose-slate prose-lg max-w-none">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: {lastUpdated}
            </p>

            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using the SPX website and services, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our
              services.
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
              Terms of Service do not constitute an engagement agreement or create any client
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
              These Terms of Service are governed by applicable law. Any disputes will be resolved
              through appropriate legal channels.
            </p>

            <h2>Contact</h2>
            <p>For questions about these Terms of Service, please contact us:</p>
            <ul>
              <li>
                Email: <a href="mailto:hello@spx.com">hello@spx.com</a>
              </li>
              <li>
                Contact Form: <a href="/contact">spx.com/contact</a>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
