/* Phase 5: Category list component */
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Category } from "@prisma/client";

interface CategoryListProps {
  categories: (Category & { _count: { insights: number } })[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground mb-4">No categories yet.</p>
        <Button asChild>
          <Link href="/admin/categories/new">Create your first category</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="divide-y divide-border">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="font-medium hover:text-primary"
              >
                {category.name}
              </Link>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {category.description}
                </p>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {category._count.insights} {category._count.insights === 1 ? "insight" : "insights"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/categories/${category.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
