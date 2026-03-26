/* Phase 5: Author list component */
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Author } from "@prisma/client";

interface AuthorListProps {
  authors: (Author & { _count: { insights: number } })[];
}

export function AuthorList({ authors }: AuthorListProps) {
  if (authors.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground mb-4">No authors yet.</p>
        <Button asChild>
          <Link href="/admin/authors/new">Create your first author</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="divide-y divide-border">
        {authors.map((author) => (
          <div
            key={author.id}
            className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <Link
                href={`/admin/authors/${author.id}/edit`}
                className="font-medium hover:text-primary"
              >
                {author.name}
              </Link>
              {author.bio && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {author.bio}
                </p>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {author._count.insights} {author._count.insights === 1 ? "insight" : "insights"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/authors/${author.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
