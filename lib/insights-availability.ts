import { cache } from "react";
import { db } from "@/lib/db";

/** True when at least one insight is published (newsletter + public Insights UX). */
export const getHasPublishedInsights = cache(async (): Promise<boolean> => {
  const count = await db.insight.count({
    where: { status: "PUBLISHED" },
  });
  return count > 0;
});
