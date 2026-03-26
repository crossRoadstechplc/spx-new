/* Phase 5: Media upload server actions */
"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { envConfig } from "@/lib/env";
import { generateUniqueFilename, isAllowedImageType, isAllowedFileSize } from "@/lib/upload-utils";

export type UploadResult =
  | { success: true; mediaId: string; url: string }
  | { success: false; error: string };

export async function uploadMediaAction(formData: FormData): Promise<UploadResult> {
  try {
    const user = await requireAuth();

    const file = formData.get("file") as File;
    const insightId = formData.get("insightId") as string | null;
    const alt = formData.get("alt") as string | null;
    const caption = formData.get("caption") as string | null;

    if (!file || file.size === 0) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!isAllowedImageType(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types: ${envConfig.allowedImageTypes.join(", ")}`,
      };
    }

    // Validate file size
    if (!isAllowedFileSize(file.size)) {
      const maxSizeMB = Math.round(envConfig.maxUploadSizeBytes / 1024 / 1024);
      return {
        success: false,
        error: `File too large. Maximum size: ${maxSizeMB}MB`,
      };
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Get image dimensions (basic implementation - to be enhanced in future)
    const width: number | null = null;
    const height: number | null = null;

    // Create database record
    const media = await db.media.create({
      data: {
        filename,
        filepath: `/uploads/${filename}`,
        url: `/uploads/${filename}`,
        mimeType: file.type,
        sizeBytes: file.size,
        width,
        height,
        alt: alt || null,
        caption: caption || null,
        type: file.type.startsWith("image/") ? "IMAGE" : "OTHER",
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

    // Get media record
    const media = await db.media.findUnique({ where: { id } });

    if (!media) {
      return { success: false, error: "Media not found" };
    }

    // Delete from database
    await db.media.delete({ where: { id } });

    // TODO: Delete file from disk (optional, can be done later)
    // const filepath = join(process.cwd(), "public", media.filepath);
    // await unlink(filepath).catch(() => {});

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
