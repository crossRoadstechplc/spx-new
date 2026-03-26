/* Phase 6: Insights listing page with database integration */
import { SiteLayout, PageHero, SectionIntro, Container } from "@/components/layout";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Insights | SPX",
  description: "Strategic research, editorial analysis, and systems thinking from SPX—exploring complexity across sectors and organizational challenges.",
};

export default async function InsightsPage() {
  const insights = await db.insight.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      author: {
        select: { name: true },
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
          {insights.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No insights published yet. Check back soon for strategic research and analysis.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
              >
                Get in touch to discuss these topics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {insights.map((insight: (typeof insights)[number], idx: number) => (
                <article
                  key={insight.id}
                  className={`
                    group relative p-8 rounded-lg border border-border/40 bg-card
                    transition-all duration-300
                    hover:border-primary/40 hover:shadow-lg
                    ${idx === 0 ? "md:p-12" : ""}
                  `}
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {insight.category && (
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 font-medium text-primary">
                          {insight.category.name}
                        </span>
                      )}
                      {insight.publishedAt && (
                        <span className="text-muted-foreground">
                          {formatDate(insight.publishedAt)}
                        </span>
                      )}
                      {insight.author && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">{insight.author.name}</span>
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h2 className={`font-bold tracking-tight group-hover:text-primary transition-colors ${idx === 0 ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`}>
                        <Link href={`/insights/${insight.slug}`} className="hover:underline">
                          {insight.title}
                        </Link>
                      </h2>
                      {insight.excerpt && (
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          {insight.excerpt}
                        </p>
                      )}
                    </div>

                    {insight.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {insight.tags.map((insightTag: (typeof insight.tags)[number]) => (
                          <span
                            key={insightTag.id}
                            className="px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full text-xs"
                          >
                            {insightTag.tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div>
                      <Link
                        href={`/insights/${insight.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                      >
                        Read full article
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Decorative accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full rounded-b-lg" />
                </article>
              ))}
            </div>
          )}
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
