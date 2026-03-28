/* Phase 5: Insight CRUD server actions */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { generateSlug } from "@/lib/slug";
import { extractMediaIdsFromStrictContent, strictInsightContentSchema } from "@/lib/insight-blocks";
import {
  clearInsightEmailDispatches,
  notifySubscribersForInsight,
} from "@/lib/newsletter";
import { z } from "zod";

const insightSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  contentJson: z.any(),
  contentHtml: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
  coverImageId: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  publishedAt: z.string().optional(),
  featuredAt: z.string().optional(),
});

export type InsightFormResult =
  | { success: true; insightId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createInsightAction(
  formData: FormData
): Promise<InsightFormResult> {
  try {
    const user = await requireAuth();

    // Parse form data
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt") || undefined,
      contentJson: JSON.parse(formData.get("contentJson") as string || "{}"),
      contentHtml: formData.get("contentHtml") || undefined,
      status: formData.get("status") || "DRAFT",
      authorId: formData.get("authorId") || undefined,
      categoryId: formData.get("categoryId") || undefined,
      coverImageId: formData.get("coverImageId") || undefined,
      metaTitle: formData.get("metaTitle") || undefined,
      metaDescription: formData.get("metaDescription") || undefined,
      publishedAt: formData.get("publishedAt") || undefined,
      featuredAt: formData.get("featuredAt") || undefined,
    };

    // Validate basic fields
    const validated = insightSchema.parse(data);
    const strictContent = strictInsightContentSchema.safeParse(validated.contentJson);
    if (!strictContent.success) {
      return {
        success: false,
        error: "Invalid content blocks. Please fix the editor blocks and try again.",
        fieldErrors: {
          contentJson: strictContent.error.issues.map((issue) => issue.message),
        },
      };
    }

    // Check for slug uniqueness
    const existing = await db.insight.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return {
        success: false,
        error: "Slug already exists",
        fieldErrors: { slug: ["This slug is already in use"] },
      };
    }

    // Create insight
    const insight = await db.insight.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        contentJson: strictContent.data,
        contentHtml: validated.contentHtml,
        status: validated.status,
        authorId: validated.authorId,
        categoryId: validated.categoryId,
        coverImageId: validated.coverImageId,
        metaTitle: validated.metaTitle,
        metaDescription: validated.metaDescription,
        publishedAt:
          validated.status === "PUBLISHED"
            ? validated.publishedAt
              ? new Date(validated.publishedAt)
              : new Date()
            : validated.publishedAt
              ? new Date(validated.publishedAt)
              : null,
        featuredAt: validated.featuredAt ? new Date(validated.featuredAt) : null,
        createdById: user.id,
      },
    });

    // Handle tags
    const tagIds = formData.getAll("tagIds") as string[];
    if (tagIds.length > 0) {
      await db.insightTag.createMany({
        data: tagIds.map((tagId) => ({
          insightId: insight.id,
          tagId,
        })),
      });
    }

    // Link uploaded media used in blocks (and cover image) to this insight
    const contentMediaIds = extractMediaIdsFromStrictContent(strictContent.data);
    const linkedMediaIds = Array.from(
      new Set([...(validated.coverImageId ? [validated.coverImageId] : []), ...contentMediaIds])
    );
    if (linkedMediaIds.length > 0) {
      await db.media.updateMany({
        where: {
          id: { in: linkedMediaIds },
        },
        data: {
          insightId: insight.id,
        },
      });
    }

    if (validated.status === "PUBLISHED") {
      await notifySubscribersForInsight(insight.id);
    }

    revalidatePath("/admin/insights");
    revalidatePath("/insights");
    redirect("/admin/insights");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    // Check if it's a redirect (Next.js throws on redirect)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Create insight error:", error);
    return {
      success: false,
      error: "Failed to create insight. Please try again.",
    };
  }
}

export async function updateInsightAction(
  id: string,
  formData: FormData
): Promise<InsightFormResult> {
  try {
    await requireAuth();

    // Parse form data
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt") || undefined,
      contentJson: JSON.parse(formData.get("contentJson") as string || "{}"),
      contentHtml: formData.get("contentHtml") || undefined,
      status: formData.get("status") || "DRAFT",
      authorId: formData.get("authorId") || undefined,
      categoryId: formData.get("categoryId") || undefined,
      coverImageId: formData.get("coverImageId") || undefined,
      metaTitle: formData.get("metaTitle") || undefined,
      metaDescription: formData.get("metaDescription") || undefined,
      publishedAt: formData.get("publishedAt") || undefined,
      featuredAt: formData.get("featuredAt") || undefined,
    };

    // Validate basic fields
    const validated = insightSchema.parse(data);
    const strictContent = strictInsightContentSchema.safeParse(validated.contentJson);
    if (!strictContent.success) {
      return {
        success: false,
        error: "Invalid content blocks. Please fix the editor blocks and try again.",
        fieldErrors: {
          contentJson: strictContent.error.issues.map((issue) => issue.message),
        },
      };
    }

    // Check for slug uniqueness (excluding current insight)
    const existing = await db.insight.findFirst({
      where: {
        slug: validated.slug,
        NOT: { id },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Slug already exists",
        fieldErrors: { slug: ["This slug is already in use"] },
      };
    }

    const previousInsight = await db.insight.findUnique({
      where: { id },
      select: { status: true, publishedAt: true },
    });

    if (!previousInsight) {
      return {
        success: false,
        error: "Insight not found.",
      };
    }

    // Update insight
    await db.insight.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        contentJson: strictContent.data,
        contentHtml: validated.contentHtml,
        status: validated.status,
        authorId: validated.authorId,
        categoryId: validated.categoryId,
        coverImageId: validated.coverImageId,
        metaTitle: validated.metaTitle,
        metaDescription: validated.metaDescription,
        publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null,
        featuredAt: validated.featuredAt ? new Date(validated.featuredAt) : null,
      },
    });

    // Update tags (delete old, create new)
    await db.insightTag.deleteMany({ where: { insightId: id } });
    
    const tagIds = formData.getAll("tagIds") as string[];
    if (tagIds.length > 0) {
      await db.insightTag.createMany({
        data: tagIds.map((tagId) => ({
          insightId: id,
          tagId,
        })),
      });
    }

    const contentMediaIds = extractMediaIdsFromStrictContent(strictContent.data);
    const linkedMediaIds = Array.from(
      new Set([...(validated.coverImageId ? [validated.coverImageId] : []), ...contentMediaIds])
    );

    // Unlink media currently tied to this insight but no longer referenced.
    await db.media.updateMany({
      where: {
        insightId: id,
        ...(linkedMediaIds.length > 0 ? { id: { notIn: linkedMediaIds } } : {}),
      },
      data: {
        insightId: null,
      },
    });

    if (linkedMediaIds.length > 0) {
      await db.media.updateMany({
        where: {
          id: { in: linkedMediaIds },
        },
        data: {
          insightId: id,
        },
      });
    }

    const transitionedToPublished =
      previousInsight.status !== "PUBLISHED" && validated.status === "PUBLISHED";
    if (transitionedToPublished) {
      await notifySubscribersForInsight(id);
    }

    revalidatePath("/admin/insights");
    revalidatePath(`/admin/insights/${id}/edit`);
    revalidatePath("/insights");
    revalidatePath(`/insights/${validated.slug}`);
    redirect("/admin/insights");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    // Next.js redirect() throws internally; rethrow so navigation can complete.
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Update insight error:", error);
    return {
      success: false,
      error: "Failed to update insight. Please try again.",
    };
  }
}

export async function deleteInsightAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    const row = await db.insight.findUnique({
      where: { id },
      select: { slug: true },
    });
    await db.insight.delete({ where: { id } });

    revalidatePath("/admin/insights");
    revalidatePath("/insights");
    if (row) {
      revalidatePath(`/insights/${row.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Delete insight error:", error);
    return {
      success: false,
      error: "Failed to delete insight. Please try again.",
    };
  }
}

const insightStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

function applyPublishedAtForStatus(
  previous: { status: string; publishedAt: Date | null },
  next: "DRAFT" | "PUBLISHED" | "ARCHIVED"
): Date | null {
  if (next === "DRAFT") {
    return null;
  }
  if (next === "ARCHIVED") {
    return previous.publishedAt;
  }
  // PUBLISHED
  return previous.publishedAt ?? new Date();
}

export async function setInsightStatusAction(
  id: string,
  status: z.infer<typeof insightStatusEnum>
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();
    const parsed = insightStatusEnum.safeParse(status);
    if (!parsed.success) {
      return { success: false, error: "Invalid status." };
    }

    const insight = await db.insight.findUnique({
      where: { id },
      select: { id: true, status: true, publishedAt: true, slug: true },
    });
    if (!insight) {
      return { success: false, error: "Insight not found." };
    }
    if (insight.status === parsed.data) {
      return { success: true };
    }

    const publishedAt = applyPublishedAtForStatus(insight, parsed.data);
    const transitionedToPublished =
      insight.status !== "PUBLISHED" && parsed.data === "PUBLISHED";

    await db.insight.update({
      where: { id },
      data: { status: parsed.data, publishedAt },
    });

    if (insight.status === "PUBLISHED" && parsed.data !== "PUBLISHED") {
      await clearInsightEmailDispatches(id);
    }

    if (transitionedToPublished) {
      await notifySubscribersForInsight(id);
    }

    revalidatePath("/admin/insights");
    revalidatePath("/insights");
    revalidatePath(`/insights/${insight.slug}`);

    return { success: true };
  } catch (error) {
    console.error("setInsightStatusAction error:", error);
    return { success: false, error: "Failed to update status." };
  }
}

const bulkIdsSchema = z.array(z.string().min(1)).min(1).max(200);

export async function bulkSetInsightsStatusAction(
  ids: string[],
  status: z.infer<typeof insightStatusEnum>
): Promise<{ success: boolean; error?: string; updated?: number }> {
  try {
    await requireAuth();
    const idList = bulkIdsSchema.safeParse(ids);
    const parsedStatus = insightStatusEnum.safeParse(status);
    if (!idList.success || !parsedStatus.success) {
      return { success: false, error: "Invalid request." };
    }

    const insights = await db.insight.findMany({
      where: { id: { in: idList.data } },
      select: { id: true, status: true, publishedAt: true, slug: true },
    });

    let updated = 0;
    for (const insight of insights) {
      if (insight.status === parsedStatus.data) {
        continue;
      }
      const publishedAt = applyPublishedAtForStatus(insight, parsedStatus.data);
      const transitionedToPublished =
        insight.status !== "PUBLISHED" && parsedStatus.data === "PUBLISHED";

      await db.insight.update({
        where: { id: insight.id },
        data: { status: parsedStatus.data, publishedAt },
      });
      updated += 1;

      if (insight.status === "PUBLISHED" && parsedStatus.data !== "PUBLISHED") {
        await clearInsightEmailDispatches(insight.id);
      }

      if (transitionedToPublished) {
        await notifySubscribersForInsight(insight.id);
      }
    }

    revalidatePath("/admin/insights");
    revalidatePath("/insights");
    for (const insight of insights) {
      revalidatePath(`/insights/${insight.slug}`);
    }

    return { success: true, updated };
  } catch (error) {
    console.error("bulkSetInsightsStatusAction error:", error);
    return { success: false, error: "Failed to update insights." };
  }
}

export async function bulkDeleteInsightsAction(
  ids: string[]
): Promise<{ success: boolean; error?: string; deleted?: number }> {
  try {
    await requireAuth();
    const idList = bulkIdsSchema.safeParse(ids);
    if (!idList.success) {
      return { success: false, error: "Invalid request." };
    }

    const rows = await db.insight.findMany({
      where: { id: { in: idList.data } },
      select: { slug: true },
    });

    const result = await db.insight.deleteMany({
      where: { id: { in: idList.data } },
    });

    revalidatePath("/admin/insights");
    revalidatePath("/insights");
    for (const row of rows) {
      revalidatePath(`/insights/${row.slug}`);
    }

    return { success: true, deleted: result.count };
  } catch (error) {
    console.error("bulkDeleteInsightsAction error:", error);
    return { success: false, error: "Failed to delete insights." };
  }
}

export async function generateSlugAction(title: string): Promise<string> {
  return generateSlug(title);
}
