import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { INSIGHTS_NAV_TAG } from "@/lib/insights-nav-cache";

/** True when at least one insight is published (newsletter + public Insights UX). */
export async function getHasPublishedInsights(): Promise<boolean> {
  return unstable_cache(
    async () => {
      const count = await db.insight.count({
        where: { status: "PUBLISHED" },
      });
      return count > 0;
    },
    ["has-published-insights"],
    { tags: [INSIGHTS_NAV_TAG] }
  )();
}
