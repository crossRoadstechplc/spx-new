/* Phase 6: Public insight detail page */
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { renderTiptapContent, type TiptapContent } from "@/lib/tiptap-renderer";
import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = await db.insight.findUnique({
    where: { slug },
  });

  if (!insight) {
    return {
      title: "Insight Not Found",
    };
  }

  return {
    title: insight.metaTitle || insight.title,
    description: insight.metaDescription || insight.excerpt || undefined,
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const insight = await db.insight.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!insight || insight.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <>
      <PageHero
        title={insight.title}
        description={insight.excerpt || undefined}
      />

      <Container className="py-16">
        <article className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            {insight.author && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{insight.author.name}</span>
              </div>
            )}
            {insight.publishedAt && (
              <div>{formatDate(insight.publishedAt)}</div>
            )}
            {insight.category && (
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {insight.category.name}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-slate prose-lg max-w-none">
            {renderTiptapContent(insight.contentJson as unknown as TiptapContent)}
          </div>

          {/* Tags */}
          {insight.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {insight.tags.map((insightTag) => (
                  <span
                    key={insightTag.id}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                  >
                    {insightTag.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </Container>
    </>
  );
}
