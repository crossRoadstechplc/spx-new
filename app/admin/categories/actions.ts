/* Phase 5: Category CRUD actions */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { generateSlug } from "@/lib/slug";
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

    await db.category.create({ data });

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

    await db.category.update({ where: { id }, data });

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
