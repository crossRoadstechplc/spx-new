import { db } from "@/lib/db";

export const DEFAULT_INSIGHT_CATEGORIES = [
  { name: "Reports", slug: "reports", description: "Research reports and long-form analysis" },
  { name: "Articles", slug: "articles", description: "Editorial articles and perspectives" },
  { name: "Events", slug: "events", description: "Event summaries, announcements, and updates" },
] as const;

export async function ensureDefaultInsightCategories() {
  for (const category of DEFAULT_INSIGHT_CATEGORIES) {
    await db.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
  }

  await db.category.deleteMany({
    where: {
      slug: {
        notIn: DEFAULT_INSIGHT_CATEGORIES.map((category) => category.slug),
      },
    },
  });

  return db.category.findMany({
    where: {
      slug: {
        in: DEFAULT_INSIGHT_CATEGORIES.map((category) => category.slug),
      },
    },
    orderBy: { name: "asc" },
  });
}

