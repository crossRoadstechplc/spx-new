"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type InsightItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  author: { name: string } | null;
  coverImage: { url: string; alt: string | null; filename: string } | null;
  category: { name: string } | null;
  tags: Array<{
    id: string;
    tag: { name: string };
  }>;
};

interface InsightsFeedProps {
  initialItems: InsightItem[];
  initialHasMore: boolean;
}

const PAGE_SIZE = 6;

export function InsightsFeed({ initialItems, initialHasMore }: InsightsFeedProps) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/insights?page=${page}&limit=${PAGE_SIZE}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load additional insights");
      }

      const data: { items: InsightItem[]; hasMore: boolean; nextPage: number | null } = await res.json();

      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      if (data.nextPage) {
        setPage(data.nextPage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          void loadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-4">
          No insights published yet. Check back soon for strategic research and analysis.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
        >
          Get in touch to discuss these topics
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((insight) => (
          <Card key={insight.id} className="overflow-hidden border-border/40 hover:border-primary/40 transition-colors">
            <div className="relative aspect-[16/9] bg-muted">
              {insight.coverImage ? (
                <Image
                  src={insight.coverImage.url}
                  alt={insight.coverImage.alt || insight.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-muted to-muted/60" />
              )}
            </div>

            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {insight.category ? (
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
                    {insight.category.name}
                  </span>
                ) : null}
                {insight.publishedAt ? <span>{formatDate(new Date(insight.publishedAt))}</span> : null}
                {insight.author ? <span>{insight.author.name}</span> : null}
              </div>
              <h2 className="text-xl font-semibold leading-tight">
                <Link href={`/insights/${insight.slug}`} className="hover:underline underline-offset-4">
                  {insight.title}
                </Link>
              </h2>
              {insight.excerpt ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.excerpt}</p>
              ) : null}
              {insight.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {insight.tags.slice(0, 4).map((insightTag) => (
                    <span
                      key={insightTag.id}
                      className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs"
                    >
                      {insightTag.tag.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </CardContent>

            <CardFooter>
              <Link
                href={`/insights/${insight.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
              >
                Read full article
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(hasMore || isLoading) && (
        <div ref={sentinelRef} className="py-8 flex justify-center">
          {isLoading ? <span className="text-sm text-muted-foreground">Loading more insights...</span> : null}
        </div>
      )}
    </div>
  );
}
