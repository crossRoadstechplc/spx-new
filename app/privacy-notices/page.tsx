/* Privacy Notices page */
import { SiteLayout, PageHero, Container } from "@/components/layout";

export const metadata = {
  title: "Privacy Notices | SPX",
  description: "Privacy notices and data protection information for SPX platform users.",
};

export default function PrivacyNoticesPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Privacy Notices"
        description="How we collect, use, and protect your personal information."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <p className="text-muted-foreground">
              Content will be updated soon. This page will contain detailed information about our privacy practices and data protection measures.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
