/* Phase 7: Custom 404 page */
import { SiteLayout, Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-8xl font-bold text-primary">404</h1>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Page Not Found
              </h2>
              <p className="text-lg text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>

            <div className="pt-8">
              <Button asChild variant="ghost">
                <Link href="javascript:history.back()" className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
