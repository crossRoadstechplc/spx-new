/* Phase 5: Tags management page */
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TagList } from "@/components/admin/tag-list";

export const metadata = {
  title: "Tags | SPX Admin",
  description: "Manage tags",
};

export default async function AdminTagsPage() {
  const tags = await db.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { insights: true },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground mt-1">
            Manage content tags and taxonomy
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tags/new">
            <Plus className="h-4 w-4 mr-2" />
            New Tag
          </Link>
        </Button>
      </div>

      <TagList tags={tags} />
    </div>
  );
}
