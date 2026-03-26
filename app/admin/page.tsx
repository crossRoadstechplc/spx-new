/* Phase 5: Admin dashboard page */
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard | SPX Admin",
  description: "SPX admin dashboard",
};

async function getStats() {
  const [
    totalInsights,
    draftInsights,
    publishedInsights,
    mediaCount,
  ] = await Promise.all([
    db.insight.count(),
    db.insight.count({ where: { status: "DRAFT" } }),
    db.insight.count({ where: { status: "PUBLISHED" } }),
    db.media.count(),
  ]);

  return {
    totalInsights,
    draftInsights,
    publishedInsights,
    media: mediaCount,
  };
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  const stats = await getStats();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Manage insights, media, and content for the SPX platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Insights"
          value={stats.totalInsights}
          icon={<FileText className="h-6 w-6" />}
          href="/admin/insights"
        />
        <StatCard
          title="Drafts"
          value={stats.draftInsights}
          icon={<FileText className="h-6 w-6" />}
          href="/admin/insights?status=DRAFT"
        />
        <StatCard
          title="Published"
          value={stats.publishedInsights}
          icon={<FileText className="h-6 w-6" />}
          href="/admin/insights?status=PUBLISHED"
        />
        <StatCard
          title="Media"
          value={stats.media}
          icon={<ImageIcon className="h-6 w-6" />}
          href="/admin/media"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/insights/new">
            <div className="p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors">
              <h3 className="font-semibold mb-1">Create Insight</h3>
              <p className="text-sm text-muted-foreground">
                Publish a new insight article
              </p>
            </div>
          </Link>
          <Link href="/admin/media">
            <div className="p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors">
              <h3 className="font-semibold mb-1">Upload Media</h3>
              <p className="text-sm text-muted-foreground">
                Add images and files
              </p>
            </div>
          </Link>
          <Link href="/admin/tags">
            <div className="p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors">
              <h3 className="font-semibold mb-1">Manage Tags</h3>
              <p className="text-sm text-muted-foreground">
                Organize content taxonomy
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Insights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Insights</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/insights">View All</Link>
          </Button>
        </div>
        <RecentInsightsList />
      </div>
    </div>
  );
}

async function RecentInsightsList() {
  const recentInsights = await db.insight.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      updatedAt: true,
    },
  });

  if (recentInsights.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No insights yet. Create your first one!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {recentInsights.map((insight) => (
        <Link
          key={insight.id}
          href={`/admin/insights/${insight.id}/edit`}
          className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{insight.title}</h3>
            <p className="text-sm text-muted-foreground">
              Updated {new Date(insight.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
              insight.status === "PUBLISHED"
                ? "bg-green-50 text-green-700"
                : insight.status === "DRAFT"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-gray-50 text-gray-700"
            }`}
          >
            {insight.status}
          </span>
        </Link>
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  href,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-colors h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
