/* Phase 5: Tag list component */
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Tag } from "@prisma/client";

interface TagListProps {
  tags: (Tag & { _count: { insights: number } })[];
}

export function TagList({ tags }: TagListProps) {
  if (tags.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground mb-4">No tags yet.</p>
        <Button asChild>
          <Link href="/admin/tags/new">Create your first tag</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="divide-y divide-border">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <Link
                href={`/admin/tags/${tag.id}/edit`}
                className="font-medium hover:text-primary"
              >
                {tag.name}
              </Link>
              {tag.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {tag.description}
                </p>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {tag._count.insights} {tag._count.insights === 1 ? "insight" : "insights"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/tags/${tag.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
