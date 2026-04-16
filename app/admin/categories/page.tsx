/* Phase 5: Categories management page */
import { db } from "@/lib/db";
import { CategoryList } from "@/components/admin/category-list";
import { ensureDefaultInsightCategories } from "@/lib/insight-categories";

export const metadata = {
  title: "Categories",
  description: "Manage categories",
};

export default async function AdminCategoriesPage() {
  await ensureDefaultInsightCategories();
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { insights: true },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Insight categories are fixed to Reports, Articles, and Events.
          </p>
        </div>
      </div>

      <CategoryList categories={categories} />
    </div>
  );
}
