/* Phase 6: Insights listing page with database integration */
import { SiteLayout, PageHero, SectionIntro, Container } from "@/components/layout";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InsightsFeed } from "./insights-feed";

export const metadata = {
  title: "Insights | SPX",
  description: "Strategic research, editorial analysis, and systems thinking from SPX—exploring complexity across sectors and organizational challenges.",
};

export default async function InsightsPage() {
  const pageSize = 6;
  const insights = await db.insight.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: pageSize + 1,
    include: {
      author: {
        select: { name: true },
      },
      coverImage: {
        select: { url: true, alt: true, filename: true },
      },
      category: {
        select: { name: true },
      },
      tags: {
        include: {
          tag: {
            select: { name: true },
          },
        },
      },
    },
  });
  const hasMore = insights.length > pageSize;
  const initialItems = (hasMore ? insights.slice(0, pageSize) : insights).map((insight) => ({
    ...insight,
    publishedAt: insight.publishedAt ? insight.publishedAt.toISOString() : null,
  }));

  return (
    <SiteLayout>
      <PageHero
        title="Insights"
        description="Strategic research and editorial analysis exploring complexity, systems, and organizational challenges."
      />

      <section className="py-16 md:py-24">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Recent Thinking"
            title="Strategic Research & Analysis"
            description="We share selected research, frameworks, and perspectives developed through our work across sectors."
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <InsightsFeed initialItems={initialItems} initialHasMore={hasMore} />
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              More Insights Coming Soon
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We&apos;re building our Insights library with strategic research, sector analysis, and frameworks developed through our client work. Check back regularly for new perspectives on navigating organizational complexity.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
              >
                Get in touch to discuss these topics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
