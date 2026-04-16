/* Cookie Settings page */
import Link from "next/link";
import { SiteLayout, PageHero, Container } from "@/components/layout";
import { CONTACT_EMAIL } from "@/lib/seo-config";
import { LEGAL_DOCUMENT_META, LEGAL_DOCUMENT_PROSE } from "@/lib/legal-document-classes";

export const metadata = {
  title: "Cookie Settings",
  description:
    "How to manage cookie and privacy preferences for SPX (spxafrica.com), including browser controls and how to reach us.",
};

export default function CookieSettingsPage() {
  const lastUpdated = "April 16, 2026";

  return (
    <SiteLayout>
      <PageHero
        title="Cookie Settings"
        description="Control how cookies and similar technologies work when you use our public website."
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

            <h2>What you can change today</h2>
            <p>
              SPX&apos;s public marketing site is designed to use a small set of cookies—mainly
              for security, essential functionality, and aggregated analytics. We do not run
              high-frequency behavioral ad networks on this domain. The most effective way to
              refine tracking is through your browser:
            </p>
            <ul>
              <li>
                <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site
                data
              </li>
              <li>
                <strong>Safari:</strong> Settings → Privacy → Manage Website Data
              </li>
              <li>
                <strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data
              </li>
              <li>
                <strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete
                cookies
              </li>
            </ul>

            <h2>Essential cookies</h2>
            <p>
              Some cookies are required to operate forms, protect against abuse, or remember that
              you have dismissed a notice. If you block all cookies, parts of the{" "}
              <Link href="/contact">contact</Link> experience or admin-adjacent flows may not work
              as expected.
            </p>

            <h2>Analytics preferences</h2>
            <p>
              If we enable privacy-preserving analytics on this site, we configure them to reduce
              personal identifiers and to support improvement of our{" "}
              <Link href="/insights">Insights</Link> and sector pages. For details on what is
              stored, see the <Link href="/cookie-notice">Cookie notice</Link>.
            </p>

            <h2>Privacy choices beyond cookies</h2>
            <p>
              Marketing email and personal data requests are handled under our{" "}
              <Link href="/privacy">Privacy Policy</Link> and{" "}
              <Link href="/privacy-choices">Your Privacy Choices</Link>, not only through cookie
              controls.
            </p>

            <h2>Need help?</h2>
            <p>
              If you cannot adjust a preference or have a question about tracking on{" "}
              <strong>spxafrica.com</strong>, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will respond within a
              reasonable time.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
