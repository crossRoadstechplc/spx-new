import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Container } from "@/components/layout/container";
import { SiteLayout } from "@/components/layout";
import { InsightArticleView } from "@/components/insights/insight-article-view";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminInsightPreviewPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const insight = await db.insight.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      coverImage: true,
      tags: { include: { tag: true } },
    },
  });

  if (!insight) {
    notFound();
  }

  return (
    <SiteLayout>
      <Container className="py-10 md:py-14 max-w-4xl">
        <InsightArticleView
          isPreview
          insight={{
            title: insight.title,
            excerpt: insight.excerpt,
            publishedAt: insight.publishedAt,
            status: insight.status,
            contentJson: insight.contentJson,
            author: insight.author,
            category: insight.category,
            coverImage: insight.coverImage,
            tags: insight.tags,
          }}
        />
      </Container>
    </SiteLayout>
  );
}
