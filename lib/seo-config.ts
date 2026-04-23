/**
 * Central SEO / site URL configuration.
 * Production: set APP_URL to your canonical origin (including www if that is the primary host),
 * e.g. https://www.spxafrica.com — so metadataBase and absolute OG URLs match search engines.
 * Staging (noindex): APP_URL=http://spxtest.ankuaru.com or NOINDEX_SITE=true
 *
 * Sitemap.xml and robots.txt always use `PRODUCTION_FALLBACK_URL` (not `APP_URL`) so crawlers never
 * see localhost; use `getSiteUrl()` everywhere else (VPS, emails, metadata).
 */

const PRODUCTION_FALLBACK_URL = "https://www.spxafrica.com";

export function getSiteUrl(): string {
  const raw = process.env.APP_URL?.trim() || PRODUCTION_FALLBACK_URL;
  return raw.replace(/\/$/, "");
}

/** Canonical origin for sitemap.xml `<loc>` and robots.txt `Sitemap:` / `Host:` only. */
export function getSitemapBaseUrl(): string {
  return PRODUCTION_FALLBACK_URL;
}

/** Staging / preview hosts must not be indexed. */
export function shouldNoIndexSite(): boolean {
  if (process.env.NOINDEX_SITE === "1" || process.env.NOINDEX_SITE === "true") {
    return true;
  }
  const u = (process.env.APP_URL || "").toLowerCase();
  return u.includes("ankuaru.com");
}

export const LINKEDIN_ORG_URL = "https://www.linkedin.com/company/spxafrica/";

export const ORGANIZATION_MAP_URL = "https://maps.app.goo.gl/HJr1r1RDFpMRwUoe6";

export const ORGANIZATION_PHONE = "+251930199525";

/** Public contact email for legal pages and schema. */
export const CONTACT_EMAIL = "info@spxafrica.com";

export const SITE_DOMAIN_LABEL = "spxafrica.com";

/** Primary logo under `/public` (nav, footer, PageHero, JSON-LD organization logo). */
export const SITE_LOGO_PATH = "/assets/logos/spx-logo.png";

/** Served by `app/favicon.ico` (accent circle, same hue as `spx-logo.png` dot; do not duplicate under `public/`). */
export const FAVICON_ICO_PATH = "/favicon.ico";

/** PNG favicons for `<link rel="icon" type="image/png">`. */
export const FAVICON_PNG_PATHS = {
  "16": "/assets/logos/favicon-16x16.png",
  "32": "/assets/logos/favicon-32x32.png",
} as const;

export const APPLE_TOUCH_ICON_PATH = "/assets/logos/apple-touch-icon.png";

/** Web app manifest (PWA / install); icon `src` paths are absolute from site root. */
export const SITE_WEB_MANIFEST_PATH = "/assets/logos/site.webmanifest";

export function getSiteLogoUrl(): string {
  return `${getSiteUrl()}${SITE_LOGO_PATH}`;
}

/** Default meta description (≈155 chars for snippets). */
export const DEFAULT_SITE_DESCRIPTION =
  "SPX: consulting and strategy-to-implementation for Ethiopia, East Africa, and Africa—insights, advisory, programs, and systems from design to delivery.";

/** Branded, positioning, and service phrases (deduped; meta keywords are a minor ranking signal). */
export const SEO_KEYWORDS = [
  "SPX",
  "SPX Africa",
  "SPX Ethiopia",
  "SPX East Africa",
  "SPXAfrica",
  "spxafrica",
  "SPXAfrica Ethiopia",
  "SPXAfrica East Africa",
  "SPXAfrica Africa",
  "SPXAfrica Addis Ababa",
  "spxafrica.com",
  "strategy-to-implementation platform",
  "SPX strategy-to-implementation",
  "market system design and execution",
  "market-shaping systems",
  "origination structuring and execution",
  "advisory capital structuring and implementation",
  "business and development intersection",
  "SPX Insights",
  "Ethiopia market systems advisory",
  "East Africa market system programs",
  "Addis Ababa strategy-to-implementation",
  "commercial incentives development outcomes",
  "business development service",
  "business consultant",
  "business finance services",
  "business lead generation",
  "business marketing services",
  "business research services",
  "business sales services",
  "small business development",
  "startup development service",
  "business strategic services",
  "business investment",
  "business administrative services",
  "business technology services",
  "business management",
  "business communications services",
] as const;
