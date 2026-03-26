/* Cookie Notice page */
import { SiteLayout, PageHero, Container } from "@/components/layout";

export const metadata = {
  title: "Cookie Notice | SPX",
  description: "Information about how SPX uses cookies and similar technologies.",
};

export default function CookieNoticePage() {
  return (
    <SiteLayout>
      <PageHero
        title="Cookie Notice"
        description="How we use cookies and similar technologies on our platform."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <p className="text-muted-foreground">
              Content will be updated soon. This page will contain information about our cookie usage and tracking technologies.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
