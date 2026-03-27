import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const siteUrl = process.env.APP_URL || "http://localhost:3000";

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
  const insights = await db.insight.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/insights" ? 0.9 : 0.8,
  }));

  const insightEntries: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: `${siteUrl}/insights/${insight.slug}`,
    lastModified: insight.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...insightEntries];
}

