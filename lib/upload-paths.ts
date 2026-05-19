/**
 * Canonical upload locations — always under `public/uploads` (Windows & Linux).
 * Use these helpers everywhere files are written, read, or deleted so disk paths
 * match the public URL `/uploads/...` served by Next.js (or nginx `alias`).
 */
import path from "path";

/** URL prefix for uploaded media (same-origin static files). */
export const UPLOAD_PUBLIC_PREFIX = "/uploads";

/** Path segments from project root to the upload root on disk. */
export const UPLOAD_ROOT_SEGMENTS = ["public", "uploads"] as const;

/** Relative path from project root (for docs / nginx). */
export const UPLOAD_ROOT_RELATIVE = "public/uploads";

export function getProjectRoot(): string {
  return process.cwd();
}

/** Absolute filesystem path to `public/uploads`. */
export function getUploadRootDir(): string {
  return path.join(getProjectRoot(), ...UPLOAD_ROOT_SEGMENTS);
}

/** Absolute path to a scope folder, e.g. `public/uploads/library`. */
export function getUploadScopeDir(scope: string): string {
  return path.join(getUploadRootDir(), sanitizeUploadScope(scope));
}

/** Absolute path to a file inside a scope. */
export function getUploadFilePath(scope: string, filename: string): string {
  return path.join(getUploadScopeDir(scope), path.basename(filename));
}

/** Public URL for a scoped upload, e.g. `/uploads/library/foo.png`. */
export function getUploadPublicUrl(scope: string, filename: string): string {
  const safeScope = sanitizeUploadScope(scope);
  const safeName = path.basename(filename);
  return `${UPLOAD_PUBLIC_PREFIX}/${safeScope}/${safeName}`;
}

/**
 * Resolve a stored public URL or DB path to an absolute disk path under `public/uploads`.
 * Returns null if the URL is not under `/uploads`.
 */
export function resolveUploadDiskPathFromPublicUrl(publicUrl: string): string | null {
  const normalized = toUploadPublicPath(publicUrl);
  if (!normalized.startsWith(`${UPLOAD_PUBLIC_PREFIX}/`)) {
    return null;
  }
  const relative = normalized.slice(UPLOAD_PUBLIC_PREFIX.length + 1);
  if (!relative || relative.includes("..")) {
    return null;
  }
  return path.join(getUploadRootDir(), ...relative.split("/"));
}

/** Normalize any upload reference to `/uploads/scope/file.ext`. */
export function toUploadPublicPath(url: string): string {
  if (!url) return "";
  const trimmed = url.trim().replace(/\\/g, "/");
  if (trimmed.startsWith(UPLOAD_PUBLIC_PREFIX)) {
    return trimmed;
  }
  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed}`;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.startsWith(UPLOAD_PUBLIC_PREFIX)) {
      return parsed.pathname;
    }
  } catch {
    // not absolute
  }
  const publicIdx = trimmed.indexOf("public/uploads/");
  if (publicIdx >= 0) {
    const after = trimmed.slice(publicIdx + "public/uploads/".length);
    return `${UPLOAD_PUBLIC_PREFIX}/${after}`;
  }
  return trimmed;
}

/** Sanitize scope segment (insight id, draft token, or `library`). */
export function sanitizeUploadScope(scope: string): string {
  return scope
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "library";
}
