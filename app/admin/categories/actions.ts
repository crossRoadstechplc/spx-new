/* Phase 5: Category CRUD actions */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { generateSlug } from "@/lib/slug";
import { DEFAULT_INSIGHT_CATEGORIES } from "@/lib/insight-categories";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
});

export type CategoryFormResult =
  | { success: true; categoryId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createCategoryAction(formData: FormData): Promise<CategoryFormResult> {
  try {
    await requireAuth();

    const data = categorySchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || undefined,
    });

    const allowedCategory = DEFAULT_INSIGHT_CATEGORIES.find(
      (category) => category.slug === data.slug || category.name === data.name
    );
    if (!allowedCategory) {
      return {
        success: false,
        error: "Only Reports, Articles, and Events categories are allowed.",
      };
    }

    await db.category.upsert({
      where: { slug: allowedCategory.slug },
      update: {
        name: allowedCategory.name,
        description: allowedCategory.description,
      },
      create: {
        name: allowedCategory.name,
        slug: allowedCategory.slug,
        description: allowedCategory.description,
      },
    });

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Create category error:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategoryAction(
  id: string,
  formData: FormData
): Promise<CategoryFormResult> {
  try {
    await requireAuth();

    const data = categorySchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || undefined,
    });

    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Category not found" };
    }

    const allowedCategory = DEFAULT_INSIGHT_CATEGORIES.find(
      (category) => category.slug === existing.slug
    );
    if (!allowedCategory) {
      return {
        success: false,
        error: "Only Reports, Articles, and Events categories are allowed.",
      };
    }

    await db.category.update({
      where: { id },
      data: {
        name: allowedCategory.name,
        slug: allowedCategory.slug,
        description: data.description || allowedCategory.description,
      },
    });

    revalidatePath("/admin/categories");

    return { success: true, categoryId: id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error("Update category error:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategoryAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();
    const category = await db.category.findUnique({ where: { id } });
    if (!category) {
      return { success: false, error: "Category not found" };
    }

    if (DEFAULT_INSIGHT_CATEGORIES.some((item) => item.slug === category.slug)) {
      return {
        success: false,
        error: "Default insight categories cannot be deleted.",
      };
    }

    await db.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete category" };
  }
}

export async function generateCategorySlugAction(name: string): Promise<string> {
  return generateSlug(name);
}
