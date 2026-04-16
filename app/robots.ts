import type { MetadataRoute } from "next";
import { getSiteUrl, shouldNoIndexSite } from "@/lib/seo-config";

const siteUrl = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  if (shouldNoIndexSite()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

