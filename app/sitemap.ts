import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getSiteUrl, shouldNoIndexSite } from "@/lib/seo-config";

const siteUrl = getSiteUrl();

const staticRoutes = [
  "",
  "/who-we-are",
  "/what-we-do",
  "/how-we-work",
  "/sectors",
  "/our-work",
  "/insights",
  "/partners",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (shouldNoIndexSite()) {
    return [];
  }

  const insights = await db.insight.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route || "/"}`,
    lastModified: new Date("2026-04-21"),
    changeFrequency:
  route === "" ? "daily" :
  route === "/insights" ? "daily" :
  "monthly",
    priority:
  route === "" ? 1.0 :
  route === "/insights" ? 0.9 :
  route === "/contact" ? 0.7 :
  0.8,
  }));

  const insightEntries: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: `${siteUrl}/insights/${insight.slug}`,
    lastModified: insight.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...insightEntries];
}

