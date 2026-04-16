/**
 * Central SEO / site URL configuration.
 * Production: APP_URL=https://spxafrica.com
 * Staging (noindex): APP_URL=http://spxtest.ankuaru.com or NOINDEX_SITE=true
 */

const PRODUCTION_FALLBACK_URL = "https://spxafrica.com";

export function getSiteUrl(): string {
  const raw = process.env.APP_URL?.trim() || PRODUCTION_FALLBACK_URL;
  return raw.replace(/\/$/, "");
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

/** Spiralytix → SPX transition: both names for discoverability (≈155 chars for snippets). */
export const DEFAULT_SITE_DESCRIPTION =
  "SPX (formerly Spiralytix): consulting and strategy-to-implementation for Ethiopia, East Africa, and Africa—insights, advisory, programs, and systems from design to delivery.";

export const SEO_KEYWORDS = [
  "SPX",
  "Spiralytix",
  "strategy to implementation",
  "consulting Ethiopia",
  "East Africa consulting",
  "Africa development consulting",
  "market systems",
  "program implementation",
  "SPX insights",
  "Addis Ababa",
  "economic transformation",
  "agriculture energy digital",
] as const;
