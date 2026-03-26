/* Sitemap page */
import { SiteLayout, PageHero, Container } from "@/components/layout";

export const metadata = {
  title: "Sitemap | SPX",
  description: "Navigate through all pages and sections of the SPX platform.",
};

export default function SitemapPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Sitemap"
        description="Navigate through all pages and sections of our platform."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <p className="text-muted-foreground">
              Content will be updated soon. This page will contain a comprehensive sitemap of all platform pages.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
