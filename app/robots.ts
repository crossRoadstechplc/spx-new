import type { MetadataRoute } from "next";
import { getSitemapBaseUrl, shouldNoIndexSite } from "@/lib/seo-config";

const siteUrl = getSitemapBaseUrl();

export default function robots(): MetadataRoute.Robots {
  if (shouldNoIndexSite()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      // Allow major search engines
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Slurp", allow: "/" },        // Yahoo
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "Baiduspider", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },

      // Block everyone else
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}