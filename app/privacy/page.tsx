/* Phase 7: Privacy policy page */
import { SiteLayout, PageHero, Container } from "@/components/layout";

export const metadata = {
  title: "Privacy Policy | SPX",
  description: "SPX privacy policy and data handling practices.",
};

export default function PrivacyPage() {
  const lastUpdated = "March 26, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Privacy Policy"
        description="How we collect, use, and protect your information"
      />

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="prose prose-slate prose-lg max-w-none">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: {lastUpdated}
            </p>

            <h2>Overview</h2>
            <p>
              SPX (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website or use our services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Information You Provide</h3>
            <p>We collect information you voluntarily provide when you:</p>
            <ul>
              <li>Submit a contact form</li>
              <li>Sign up for updates or newsletters</li>
              <li>Engage with our content or services</li>
            </ul>
            <p>
              This may include your name, email address, organization, phone number, and any
              message or inquiry you submit.
            </p>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect certain technical
              information, including:
            </p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and requests</li>
              <li>Provide information about our services</li>
              <li>Improve our website and services</li>
              <li>Send periodic updates (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may
              share your information only:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>
                With service providers who assist in our operations (under strict confidentiality
                agreements)
              </li>
              <li>When required by law or to protect our rights</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information from
              unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
              <li>Object to processing of your information</li>
            </ul>

            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our
              website. You can control cookie preferences through your browser settings.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for the
              privacy practices of these external sites.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant
              changes by posting the new policy on this page with an updated &quot;Last
              updated&quot; date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how we handle your information,
              please contact us:
            </p>
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
