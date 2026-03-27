/* Phase 5: Author CRUD actions */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const authorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  bio: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type AuthorFormResult =
  | { success: true; authorId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createAuthorAction(formData: FormData): Promise<AuthorFormResult> {
  try {
    await requireAuth();

    const data = authorSchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      bio: formData.get("bio") || undefined,
      email: formData.get("email") || undefined,
      avatarUrl: formData.get("avatarUrl") || undefined,
    });

    await db.author.create({ data });

    revalidatePath("/admin/authors");
    redirect("/admin/authors");
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

    console.error("Create author error:", error);
    return { success: false, error: "Failed to create author" };
  }
}

export async function updateAuthorAction(
  id: string,
  formData: FormData
): Promise<AuthorFormResult> {
  try {
    await requireAuth();

    const data = authorSchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      bio: formData.get("bio") || undefined,
      email: formData.get("email") || undefined,
      avatarUrl: formData.get("avatarUrl") || undefined,
    });

    await db.author.update({ where: { id }, data });

    revalidatePath("/admin/authors");
    revalidatePath(`/admin/authors/${id}/edit`);
    redirect("/admin/authors");
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

    console.error("Update author error:", error);
    return { success: false, error: "Failed to update author" };
  }
}

export async function deleteAuthorAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();
    await db.author.delete({ where: { id } });
    revalidatePath("/admin/authors");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete author" };
  }
}

export async function generateAuthorSlugAction(name: string): Promise<string> {
  return generateSlug(name);
}
