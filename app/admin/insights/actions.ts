/* Phase 5: Insight CRUD server actions */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const insightSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  contentJson: z.any(), // Tiptap JSON
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

    // Validate
    const validated = insightSchema.parse(data);

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
        contentJson: validated.contentJson,
        contentHtml: validated.contentHtml,
        status: validated.status,
        authorId: validated.authorId,
        categoryId: validated.categoryId,
        coverImageId: validated.coverImageId,
        metaTitle: validated.metaTitle,
        metaDescription: validated.metaDescription,
        publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null,
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

    revalidatePath("/admin/insights");
    redirect(`/admin/insights/${insight.id}/edit`);
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

    // Validate
    const validated = insightSchema.parse(data);

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

    // Update insight
    await db.insight.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        contentJson: validated.contentJson,
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

    revalidatePath("/admin/insights");
    revalidatePath(`/admin/insights/${id}/edit`);

    return { success: true, insightId: id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
      };
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

    await db.insight.delete({ where: { id } });

    revalidatePath("/admin/insights");
    
    return { success: true };
  } catch (error) {
    console.error("Delete insight error:", error);
    return {
      success: false,
      error: "Failed to delete insight. Please try again.",
    };
  }
}

export async function generateSlugAction(title: string): Promise<string> {
  return generateSlug(title);
}
