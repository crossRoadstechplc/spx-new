/* Your Privacy Choices page */
import { SiteLayout, PageHero, Container } from "@/components/layout";

export const metadata = {
  title: "Your Privacy Choices | SPX",
  description: "Manage your personal data and privacy preferences.",
};

export default function PrivacyChoicesPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Your Privacy Choices"
        description="Control how your personal information is used and shared."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <p className="text-muted-foreground">
              Content will be updated soon. This page will allow you to manage your privacy choices and data preferences.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
