/* Phase 5: Insights list page */
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { InsightsListTable } from "@/components/admin/insights-list-table";

export const metadata = {
  title: "Insights | SPX Admin",
  description: "Manage insights content",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

export default async function AdminInsightsPage({ searchParams }: PageProps) {
  const { q, status } = await searchParams;

  // Build query filters
  const where: {
    OR?: Array<{ title?: { contains: string }; excerpt?: { contains: string } }>;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  } = {};

  if (q) {
    // SQLite (local dev) does not support Prisma's `mode: "insensitive"` on string filters.
    where.OR = [{ title: { contains: q } }, { excerpt: { contains: q } }];
  }
  
  if (status && (status === "DRAFT" || status === "PUBLISHED" || status === "ARCHIVED")) {
    where.status = status;
  }

  const insights = await db.insight.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
      _count: {
        select: { tags: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground mt-1">
            Manage your insights and articles
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/insights/new">
            <Plus className="h-4 w-4 mr-2" />
            New Insight
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search insights..."
              defaultValue={q}
              className="pl-9"
              name="q"
            />
          </div>
          <div className="flex gap-2">
            <Link href="/admin/insights">
              <Button variant={!status ? "default" : "outline"} size="sm">
                All
              </Button>
            </Link>
            <Link href="/admin/insights?status=DRAFT">
              <Button variant={status === "DRAFT" ? "default" : "outline"} size="sm">
                Drafts
              </Button>
            </Link>
            <Link href="/admin/insights?status=PUBLISHED">
              <Button variant={status === "PUBLISHED" ? "default" : "outline"} size="sm">
                Published
              </Button>
            </Link>
            <Link href="/admin/insights?status=ARCHIVED">
              <Button variant={status === "ARCHIVED" ? "default" : "outline"} size="sm">
                Archived
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Insights Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {insights.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">
                {q ? "No insights found" : "No insights yet"}
              </p>
              <p className="text-muted-foreground mb-6">
                {q
                  ? "Try adjusting your search or filters."
                  : "Get started by creating your first insight article."}
              </p>
              {!q && (
                <Button asChild>
                  <Link href="/admin/insights/new">Create First Insight</Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <InsightsListTable
            insights={insights.map((insight) => ({
              id: insight.id,
              title: insight.title,
              slug: insight.slug,
              status: insight.status,
              updatedAt: insight.updatedAt.toISOString(),
              authorName: insight.author?.name ?? null,
              categoryName: insight.category?.name ?? null,
              tagCount: insight._count.tags,
            }))}
          />
        )}
      </div>
    </div>
  );
}
