/* Accessibility page */
import { SiteLayout, PageHero, Container } from "@/components/layout";

export const metadata = {
  title: "Accessibility | SPX",
  description: "Our commitment to web accessibility and inclusive design.",
};

export default function AccessibilityPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Accessibility"
        description="Our commitment to creating an accessible and inclusive digital experience."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <p className="text-muted-foreground">
              Content will be updated soon. This page will detail our accessibility standards and compliance efforts.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
