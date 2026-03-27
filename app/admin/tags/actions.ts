/* Phase 5: Tag CRUD actions */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
});

export type TagFormResult =
  | { success: true; tagId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createTagAction(formData: FormData): Promise<TagFormResult> {
  try {
    await requireAuth();

    const data = tagSchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || undefined,
    });

    await db.tag.create({ data });

    revalidatePath("/admin/tags");
    redirect("/admin/tags");
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

    console.error("Create tag error:", error);
    return { success: false, error: "Failed to create tag" };
  }
}

export async function updateTagAction(
  id: string,
  formData: FormData
): Promise<TagFormResult> {
  try {
    await requireAuth();

    const data = tagSchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || undefined,
    });

    await db.tag.update({ where: { id }, data });

    revalidatePath("/admin/tags");
    redirect("/admin/tags");
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

    console.error("Update tag error:", error);
    return { success: false, error: "Failed to update tag" };
  }
}

export async function deleteTagAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();
    await db.tag.delete({ where: { id } });
    revalidatePath("/admin/tags");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete tag" };
  }
}

export async function generateTagSlugAction(name: string): Promise<string> {
  return generateSlug(name);
}
