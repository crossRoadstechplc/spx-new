/* Phase 1: File system utilities for upload management */
import fs from "fs/promises";
import path from "path";
import { env, envConfig } from "./env";

/**
 * Ensures the upload directory exists.
 * Creates it if missing (recursive).
 */
export async function ensureUploadDir(): Promise<void> {
  const uploadPath = path.resolve(process.cwd(), env.UPLOAD_DIR);
  await fs.mkdir(uploadPath, { recursive: true });
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
 * Gets the full filesystem path for an uploaded file.
 * @param relativePath - Path relative to UPLOAD_DIR
 */
export function getUploadPath(relativePath: string): string {
  const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
  return path.join(uploadDir, relativePath);
}

/**
 * Gets the public URL for an uploaded file.
 * Assumes uploads are served from /uploads route.
 * @param relativePath - Path relative to UPLOAD_DIR
 */
export function getUploadUrl(relativePath: string): string {
  // Remove 'public/' prefix if present (uploads are in public/uploads)
  const publicPath = relativePath.startsWith("public/")
    ? relativePath.substring(7)
    : relativePath;
  return `/uploads/${publicPath}`;
}

/**
 * Deletes an uploaded file from the filesystem.
 * @param relativePath - Path relative to UPLOAD_DIR
 */
export async function deleteUploadedFile(relativePath: string): Promise<void> {
  const fullPath = getUploadPath(relativePath);
  try {
    await fs.unlink(fullPath);
  } catch (error) {
    // File might not exist, ignore error
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
