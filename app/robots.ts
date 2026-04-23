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
      // Allow Google crawlers (core + specialized + product/AI bots).
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-Smartphone", allow: "/" },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "Googlebot-Video", allow: "/" },
      { userAgent: "Googlebot-News", allow: "/" },
      { userAgent: "AdsBot-Google", allow: "/" },
      { userAgent: "AdsBot-Google-Mobile", allow: "/" },
      { userAgent: "Mediapartners-Google", allow: "/" },
      { userAgent: "Storebot-Google", allow: "/" },
      { userAgent: "Google-InspectionTool", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Google-CloudVertexBot", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },

      // Allow other major search engines.
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Slurp", allow: "/" },
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