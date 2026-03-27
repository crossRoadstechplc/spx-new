/* Phase 5: Create new insight page */
import { db } from "@/lib/db";
import { InsightForm } from "@/components/admin/insight-form";
import { ensureDefaultInsightCategories } from "@/lib/insight-categories";

export const metadata = {
  title: "New Insight | SPX Admin",
  description: "Create a new insight",
};

export default async function NewInsightPage() {
  // Fetch options for dropdowns
  const [authors, categories, tags] = await Promise.all([
    db.author.findMany({ orderBy: { name: "asc" } }),
    ensureDefaultInsightCategories(),
    db.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Insight</h1>
        <p className="text-muted-foreground mt-1">
          Create a new insight article
        </p>
      </div>

      <InsightForm
        authors={authors}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
