/* Cookie Settings page */
import { SiteLayout, PageHero, Container } from "@/components/layout";

export const metadata = {
  title: "Cookie Settings | SPX",
  description: "Manage your cookie preferences and privacy settings.",
};

export default function CookieSettingsPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Cookie Settings"
        description="Manage your cookie preferences and control your privacy settings."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <p className="text-muted-foreground">
              Content will be updated soon. This page will allow you to manage your cookie preferences.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
