/* Phase 5: Media upload server actions */
"use server";

import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { envConfig } from "@/lib/env";
import {
  ensureUploadDir,
  generateUniqueFilename,
  isAllowedImageType,
  isAllowedFileSize,
  sanitizeFilename,
  deleteUploadedFile,
} from "@/lib/upload-utils";
import {
  getUploadFilePath,
  getUploadPublicUrl,
  sanitizeUploadScope,
} from "@/lib/upload-paths";

export type UploadResult =
  | { success: true; mediaId: string; url: string }
  | { success: false; error: string };

export async function uploadMediaAction(formData: FormData): Promise<UploadResult> {
  try {
    const user = await requireAuth();

    const fileEntry = formData.get("file");
    const insightId = formData.get("insightId") as string | null;
    const draftToken = formData.get("draftToken") as string | null;
    const alt = formData.get("alt") as string | null;
    const caption = formData.get("caption") as string | null;

    if (!(fileEntry instanceof Blob) || fileEntry.size === 0) {
      return { success: false, error: "No file provided" };
    }

    const mimeType = fileEntry.type || "application/octet-stream";
    const originalName =
      fileEntry instanceof File && fileEntry.name ? fileEntry.name : "upload.bin";

    if (!isAllowedImageType(mimeType)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types: ${envConfig.allowedImageTypes.join(", ")}`,
      };
    }

    if (!isAllowedFileSize(fileEntry.size)) {
      const maxSizeMB = Math.round(envConfig.maxUploadSizeBytes / 1024 / 1024);
      return {
        success: false,
        error: `File too large. Maximum size: ${maxSizeMB}MB`,
      };
    }

    const uploadScopeRaw = insightId || draftToken || "library";
    const uploadScope = sanitizeUploadScope(uploadScopeRaw);
    const baseFilename = sanitizeFilename(originalName);
    const filename = `${uploadScope}-${generateUniqueFilename(baseFilename)}`;
    const bytes = await fileEntry.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await ensureUploadDir(uploadScope);

    const filepath = getUploadFilePath(uploadScope, filename);
    await writeFile(filepath, buffer);
    const publicUrl = getUploadPublicUrl(uploadScope, filename);

    const width: number | null = null;
    const height: number | null = null;

    const media = await db.media.create({
      data: {
        filename,
        filepath: publicUrl,
        url: publicUrl,
        mimeType,
        sizeBytes: fileEntry.size,
        width,
        height,
        alt: alt || null,
        caption: caption || null,
        type: mimeType.startsWith("image/") ? "IMAGE" : "OTHER",
        insightId: insightId || null,
        uploadedBy: user.id,
      },
    });

    revalidatePath("/admin/media");

    return {
      success: true,
      mediaId: media.id,
      url: media.url,
    };
  } catch (error) {
    console.error("Upload media error:", error);
    return {
      success: false,
      error: "Failed to upload media. Please try again.",
    };
  }
}

export async function deleteMediaAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    const media = await db.media.findUnique({ where: { id } });

    if (!media) {
      return { success: false, error: "Media not found" };
    }

    await deleteUploadedFile(media.url);

    await db.media.delete({ where: { id } });

    revalidatePath("/admin/media");

    return { success: true };
  } catch (error) {
    console.error("Delete media error:", error);
    return {
      success: false,
      error: "Failed to delete media. Please try again.",
    };
  }
}
