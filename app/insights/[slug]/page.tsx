/* Phase 6: Public insight detail page */
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { SiteLayout, ClosingCTASection } from "@/components/layout";
import { renderTiptapContent, type TiptapContent } from "@/lib/tiptap-renderer";
import { renderStrictInsightContent } from "@/lib/insight-block-renderer";
import { isStrictInsightContent } from "@/lib/insight-blocks";
import type { Metadata } from "next";
import { getSiteLogoUrl, getSiteUrl } from "@/lib/seo-config";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { LazyImage } from "@/components/ui/lazy-image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const defaultOgImage = getSiteLogoUrl();
  const insight = await db.insight.findUnique({
    where: { slug },
    include: {
      coverImage: {
        select: { url: true, alt: true },
      },
      author: {
        select: { name: true },
      },
    },
  });

  if (!insight) {
    return {
      title: "Insight Not Found",
    };
  }

  return {
    title: insight.metaTitle || insight.title,
    description: insight.metaDescription || insight.excerpt || undefined,
    alternates: {
      canonical: `/insights/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `/insights/${slug}`,
      title: insight.metaTitle || insight.title,
      description: insight.metaDescription || insight.excerpt || undefined,
      publishedTime: insight.publishedAt?.toISOString(),
      authors: insight.author?.name ? [insight.author.name] : undefined,
      images: [
        {
          url: insight.coverImage?.url ? `${siteUrl}${insight.coverImage.url}` : defaultOgImage,
          alt: insight.coverImage?.alt || insight.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: insight.metaTitle || insight.title,
      description: insight.metaDescription || insight.excerpt || undefined,
      images: [
        insight.coverImage?.url ? `${siteUrl}${insight.coverImage.url}` : defaultOgImage,
      ],
    },
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [insight, recentInsights, trendingInsights] = await Promise.all([
    db.insight.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        coverImage: true,
        tags: {
          include: { tag: true },
        },
      },
    }),
    db.insight.findMany({
      where: {
        status: "PUBLISHED",
        NOT: { slug },
      },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        coverImage: {
          select: { url: true, alt: true, filename: true },
        },
      },
    }),
    db.insight.findMany({
      where: {
        status: "PUBLISHED",
        NOT: { slug },
      },
      orderBy: [{ featuredAt: "desc" }, { publishedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        coverImage: {
          select: { url: true, alt: true, filename: true },
        },
      },
    }),
  ]);

  if (!insight || insight.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <SiteLayout>
      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-10 lg:h-[calc(100vh-7.5rem)]">
          <article className="min-w-0 lg:overflow-y-auto lg:pr-6 lg:border-r lg:border-border/70 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <header className="mb-12 pb-8 border-b border-border/80">
              <div className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                SPX Insights Desk
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-foreground">
                {insight.title}
              </h1>
              {insight.excerpt ? (
                <p className="text-lg leading-relaxed text-foreground/85 mb-6 max-w-3xl font-light">
                  {insight.excerpt}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {insight.author ? (
                  <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-semibold text-primary">
                    By {insight.author.name}
                  </span>
                ) : null}
                {insight.publishedAt ? <span>{formatDate(insight.publishedAt)}</span> : null}
                {insight.category ? (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                    {insight.category.name}
                  </span>
                ) : null}
              </div>
            </header>

            <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-h2:mt-14 prose-h3:mt-10 prose-p:leading-8 prose-p:text-foreground/90 prose-p:my-6 prose-a:text-primary prose-a:font-medium prose-blockquote:border-primary prose-blockquote:text-foreground/80 prose-blockquote:bg-muted/30 prose-blockquote:px-5 prose-blockquote:py-3 prose-img:rounded-none prose-img:border prose-img:border-border/60 prose-img:shadow-sm first-letter:text-5xl first-letter:font-semibold first-letter:mr-1 first-letter:float-left first-letter:leading-none">
              {isStrictInsightContent(insight.contentJson)
                ? renderStrictInsightContent(insight.contentJson)
                : renderTiptapContent(insight.contentJson as unknown as TiptapContent)}
            </div>

            {insight.tags.length > 0 && (
              <div className="mt-14 pt-8 border-t border-border">
                <div className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                  Tagged As
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {insight.tags.map((insightTag: (typeof insight.tags)[number]) => (
                    <span
                      key={insightTag.id}
                      className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/25 rounded-full text-xs font-semibold uppercase tracking-wide"
                    >
                      {insightTag.tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="lg:overflow-y-auto lg:pl-2 space-y-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="rounded-xl border border-border/70 bg-card/50 p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Recent Insights</h2>
              <div className="space-y-5">
                {recentInsights.map((item) => (
                  <Link
                    key={item.id}
                    href={`/insights/${item.slug}`}
                    className="group block overflow-hidden rounded-lg border border-border/70 bg-background hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[16/9] bg-muted">
                      {item.coverImage ? (
                        <LazyImage
                          src={item.coverImage.url}
                          alt={item.coverImage.alt || item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-muted to-muted/60" />
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="font-medium leading-tight group-hover:text-primary transition-colors">{item.title}</p>
                      {item.excerpt ? <p className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p> : null}
                      {item.publishedAt ? <p className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</p> : null}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/50 p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Trending</h2>
              <div className="space-y-5">
                {trendingInsights.map((item) => (
                  <Link
                    key={item.id}
                    href={`/insights/${item.slug}`}
                    className="group block overflow-hidden rounded-lg border border-border/70 bg-background hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[16/9] bg-muted">
                      {item.coverImage ? (
                        <LazyImage
                          src={item.coverImage.url}
                          alt={item.coverImage.alt || item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-muted to-muted/60" />
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="font-medium leading-tight group-hover:text-primary transition-colors">{item.title}</p>
                      {item.excerpt ? <p className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p> : null}
                      {item.publishedAt ? <p className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</p> : null}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>

      <ClosingCTASection />
    </SiteLayout>
  );
}
