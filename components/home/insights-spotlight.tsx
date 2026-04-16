"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Container, SectionIntro } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

type HomeInsight = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  coverImage: { url: string; alt: string | null } | null;
  category: { name: string } | null;
};

interface InsightsSpotlightProps {
  items: HomeInsight[];
}

const FALLBACK_IMAGE = "/assets/images/xtras/image42.webp";

export function InsightsSpotlight({ items }: InsightsSpotlightProps) {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const safeItems = useMemo(() => items.slice(0, 3), [items]);

  useEffect(() => {
    if (safeItems.length <= 1) return;
    const timer = window.setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % safeItems.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [safeItems.length]);

  if (safeItems.length === 0) {
    return null;
  }

  const featured = safeItems[featuredIndex % safeItems.length];
  const smallCards = safeItems.filter((item) => item.id !== featured.id);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionIntro
          eyebrow="Insights"
          title="Latest News and Analysis"
          description="A rotating spotlight on the newest thinking from SPX. The featured card cycles through the latest three insights."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AnimatePresence mode="wait">
            <motion.article
              key={featured.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="lg:col-span-2"
            >
              <Card className="h-full overflow-hidden border-border/40">
                <div className="relative aspect-[16/9] bg-muted">
                  <Image
                    src={featured.coverImage?.url || FALLBACK_IMAGE}
                    alt={featured.coverImage?.alt || featured.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {featured.category ? (
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
                        {featured.category.name}
                      </span>
                    ) : null}
                    {featured.publishedAt ? <span>{formatDate(featured.publishedAt)}</span> : null}
                  </div>
                  <h3 className="text-2xl font-semibold leading-tight">
                    <Link href={`/insights/${featured.slug}`} className="hover:underline underline-offset-4">
                      {featured.title}
                    </Link>
                  </h3>
                  {featured.excerpt ? (
                    <p className="text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                  ) : null}
                  <Link
                    href={`/insights/${featured.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                  >
                    Read full article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.article>
          </AnimatePresence>

          <div className="space-y-4">
            {smallCards.map((item) => (
              <Card key={item.id} className="border-border/40">
                <CardContent className="space-y-3 pt-6">
                  <div className="text-xs text-muted-foreground">
                    {item.publishedAt ? formatDate(item.publishedAt) : "Recent"}
                  </div>
                  <h4 className="text-lg font-semibold leading-tight">
                    <Link href={`/insights/${item.slug}`} className="hover:underline underline-offset-4">
                      {item.title}
                    </Link>
                  </h4>
                  {item.excerpt ? (
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {safeItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show insight ${idx + 1}`}
                onClick={() => setFeaturedIndex(idx)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  idx === featuredIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <Link href="/insights" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            View all insights
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
