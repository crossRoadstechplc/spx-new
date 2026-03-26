/* Phase 5: Authors management page */
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AuthorList } from "@/components/admin/author-list";

export const metadata = {
  title: "Authors | SPX Admin",
  description: "Manage authors",
};

export default async function AdminAuthorsPage() {
  const authors = await db.author.findMany({
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
          <h1 className="text-3xl font-bold tracking-tight">Authors</h1>
          <p className="text-muted-foreground mt-1">
            Manage content authors and contributors
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/authors/new">
            <Plus className="h-4 w-4 mr-2" />
            New Author
          </Link>
        </Button>
      </div>

      <AuthorList authors={authors} />
    </div>
  );
}
