/**
 * Resolve uploaded media URLs against the current site origin.
 * Stored paths are relative (/uploads/...); legacy rows may contain absolute URLs
 * from another host (APP_URL, production domain, wrong port).
 */

const UPLOAD_PATH_PREFIX = "/uploads";

/**
 * Strip any host and return a same-origin path under /uploads when possible.
 */
export function toUploadPath(url: string): string {
  if (!url) return url;

  const trimmed = url.trim();
  if (trimmed.startsWith(UPLOAD_PATH_PREFIX)) {
    return trimmed;
  }
  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.startsWith(UPLOAD_PATH_PREFIX)) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // Not an absolute URL — return as-is.
  }

  return trimmed;
}

export function isUploadPath(url: string): boolean {
  return toUploadPath(url).startsWith(UPLOAD_PATH_PREFIX);
}

/**
 * Build a full media URL for the given origin (e.g. window.location.origin).
 * Prefer this on the client so previews work on localhost, staging, and production.
 */
export function resolveMediaUrl(url: string, origin: string): string {
  const path = toUploadPath(url);
  if (!path.startsWith(UPLOAD_PATH_PREFIX)) {
    return url;
  }
  const base = origin.replace(/\/$/, "");
  return `${base}${path}`;
}

/**
 * Normalize for <Image src>: path-only on the server; absolute URL on the client
 * when `origin` is provided (browser).
 */
export function normalizeMediaSrc(url: string, origin?: string | null): string {
  const path = toUploadPath(url);
  if (!path.startsWith(UPLOAD_PATH_PREFIX)) {
    return url;
  }
  if (origin) {
    return resolveMediaUrl(path, origin);
  }
  return path;
}
