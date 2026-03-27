/* Phase 5: Simple Author/Category/Tag form component */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAuthorAction,
  deleteAuthorAction,
  generateAuthorSlugAction,
  updateAuthorAction,
} from "@/app/admin/authors/actions";
import {
  createCategoryAction,
  deleteCategoryAction,
  generateCategorySlugAction,
  updateCategoryAction,
} from "@/app/admin/categories/actions";
import {
  createTagAction,
  deleteTagAction,
  generateTagSlugAction,
  updateTagAction,
} from "@/app/admin/tags/actions";
import { AlertCircle, Loader2 } from "lucide-react";

interface SimpleFormItem {
  name: string;
  slug: string;
  bio?: string | null;
  email?: string | null;
  description?: string | null;
}

interface FormResult {
  success: boolean;
  error?: string;
}

interface SimpleFormProps {
  type: "author" | "category" | "tag";
  itemId?: string;
  item?: SimpleFormItem;
}

export function SimpleCRUDForm({ type, item, itemId }: SimpleFormProps) {
  const router = useRouter();
  const adminListPath =
    type === "author" ? "/admin/authors" : type === "category" ? "/admin/categories" : "/admin/tags";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(item?.name || "");
  const [slug, setSlug] = useState(item?.slug || "");

  useEffect(() => {
    if (!item && name) {
      const timeoutId = setTimeout(async () => {
        const generated =
          type === "author"
            ? await generateAuthorSlugAction(name)
            : type === "category"
              ? await generateCategorySlugAction(name)
              : await generateTagSlugAction(name);
        setSlug(generated);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [name, item, type]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result =
      type === "author"
        ? itemId
          ? await updateAuthorAction(itemId, formData)
          : await createAuthorAction(formData)
        : type === "category"
          ? itemId
            ? await updateCategoryAction(itemId, formData)
            : await createCategoryAction(formData)
          : itemId
            ? await updateTagAction(itemId, formData)
            : await createTagAction(formData);

    if (result && !result.success) {
      setError(result.error || "An error occurred");
      setIsSubmitting(false);
    } else if (!item) {
      // Creation successful, redirect handled by action
    } else {
      // Update successful
      router.refresh();
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemId || !item) return;

    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    setIsSubmitting(true);
    const result =
      type === "author"
        ? await deleteAuthorAction(itemId)
        : type === "category"
          ? await deleteCategoryAction(itemId)
          : await deleteTagAction(itemId);

    if (result.success) {
      router.push(adminListPath);
    } else {
      setError(result.error || "Failed to delete");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">{error}</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={`Enter ${type} name`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="url-friendly-slug"
          />
        </div>

        {type === "author" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={item?.email || ""}
                placeholder="author@spx.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={item?.bio || ""}
                rows={4}
                placeholder="Author biography"
              />
            </div>
          </>
        )}

        {type !== "author" && (
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={item?.description || ""}
              rows={3}
              placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} description`}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          {item && itemId && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(adminListPath)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {item ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </form>
  );
}
