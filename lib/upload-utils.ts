/* Phase 1: File system utilities for upload management */
import fs from "fs/promises";
import path from "path";
import {
  getUploadRootDir,
  resolveUploadDiskPathFromPublicUrl,
  toUploadPublicPath,
  UPLOAD_PUBLIC_PREFIX,
} from "@/lib/upload-paths";
import { envConfig } from "./env";

/**
 * Ensures the upload directory exists (`public/uploads`).
 */
export async function ensureUploadDir(scope?: string): Promise<void> {
  const dir = scope
    ? path.join(getUploadRootDir(), scope)
    : getUploadRootDir();
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Generates a safe filename from user input.
 * Removes special characters, spaces, and converts to lowercase.
 * Preserves file extension (also lowercased).
 */
export function sanitizeFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, path.extname(filename));
  const sanitized = basename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${sanitized}${ext}`;
}

/**
 * Generates a unique filename by appending timestamp + random string.
 * Format: {basename}-{timestamp}-{random}.{ext}
 */
export function generateUniqueFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename).toLowerCase();
  const basename = path.basename(originalFilename, path.extname(originalFilename));
  const sanitized = basename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${sanitized}-${timestamp}-${random}${ext}`;
}

/**
 * Checks if a file's MIME type is allowed for upload.
 */
export function isAllowedImageType(mimeType: string): boolean {
  return envConfig.allowedImageTypes.includes(mimeType);
}

/**
 * Checks if a file size is within the allowed limit.
 */
export function isAllowedFileSize(sizeBytes: number): boolean {
  return sizeBytes <= envConfig.maxUploadSizeBytes;
}

/**
 * Gets the full filesystem path for a file under `public/uploads`.
 * @param relativePath - Path under upload root, e.g. `library/foo.png`
 */
export function getUploadPath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const withoutPrefix = normalized
    .replace(/^public\/uploads\//, "")
    .replace(/^uploads\//, "");
  return path.join(getUploadRootDir(), withoutPrefix);
}

/**
 * Gets the public URL for an uploaded file under `/uploads/...`.
 * @param relativePath - Path under upload root, e.g. `library/foo.png`, or `/uploads/library/foo.png`
 */
export function getUploadUrl(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").trim();
  if (normalized.startsWith("/uploads") || normalized.startsWith("uploads/")) {
    return toUploadPublicPath(normalized);
  }
  const stripped = normalized
    .replace(/^public\/uploads\//, "")
    .replace(/^uploads\//, "");
  return `${UPLOAD_PUBLIC_PREFIX}/${stripped}`.replace(/\/+/g, "/");
}

/**
 * Deletes an uploaded file from the filesystem using its public URL or relative path.
 */
export async function deleteUploadedFile(publicUrlOrRelativePath: string): Promise<void> {
  if (!publicUrlOrRelativePath?.trim()) {
    return;
  }
  const diskPath =
    resolveUploadDiskPathFromPublicUrl(publicUrlOrRelativePath) ??
    getUploadPath(publicUrlOrRelativePath);
  try {
    await fs.unlink(diskPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

/**
 * Validates upload metadata before persisting.
 */
export interface UploadValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUpload(
  mimeType: string,
  sizeBytes: number
): UploadValidationResult {
  if (!isAllowedImageType(mimeType)) {
    return {
      valid: false,
      error: `File type ${mimeType} not allowed. Allowed: ${envConfig.allowedImageTypes.join(", ")}`,
    };
  }

  if (!isAllowedFileSize(sizeBytes)) {
    return {
      valid: false,
      error: `File size ${sizeBytes} bytes exceeds maximum of ${envConfig.maxUploadSizeBytes} bytes`,
    };
  }

  return { valid: true };
}
