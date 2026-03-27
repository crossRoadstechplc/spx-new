/* Phase 5: Edit insight page */
import { db } from "@/lib/db";
import { InsightForm } from "@/components/admin/insight-form";
import { notFound } from "next/navigation";
import { ensureDefaultInsightCategories } from "@/lib/insight-categories";

export const metadata = {
  title: "Edit Insight | SPX Admin",
  description: "Edit insight",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditInsightPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch insight with relations
  const insight = await db.insight.findUnique({
    where: { id },
    include: {
      coverImage: true,
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!insight) {
    notFound();
  }

  // Fetch options for dropdowns
  const [authors, categories, tags] = await Promise.all([
    db.author.findMany({ orderBy: { name: "asc" } }),
    ensureDefaultInsightCategories(),
    db.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Insight</h1>
        <p className="text-muted-foreground mt-1">
          Update insight details and content
        </p>
      </div>

      <InsightForm
        insight={insight}
        authors={authors}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
