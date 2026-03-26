/* Phase 6: Insight form component with Tiptap editor */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { MediaSelectorDialog } from "@/components/admin/media-selector-dialog";
import { generateSlugAction, createInsightAction, updateInsightAction, deleteInsightAction } from "@/app/admin/insights/actions";
import type { Author, Category, Tag, Insight, InsightTag, Media } from "@prisma/client";
import type { Editor } from "@tiptap/react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

interface InsightFormProps {
  insight?: Insight & { tags: (InsightTag & { tag: Tag })[] };
  authors: Author[];
  categories: Category[];
  tags: Tag[];
}

export function InsightForm({ insight, authors, categories, tags }: InsightFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [title, setTitle] = useState(insight?.title || "");
  const [slug, setSlug] = useState(insight?.slug || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    insight?.tags.map((t) => t.tagId) || []
  );
  const [contentJson, setContentJson] = useState<unknown>(insight?.contentJson || {
    type: "doc",
    content: [{ type: "paragraph" }],
  });
  const [contentHtml, setContentHtml] = useState(insight?.contentHtml || "");
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!insight && title) {
      const timeoutId = setTimeout(async () => {
        const generated = await generateSlugAction(title);
        setSlug(generated);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [title, insight]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    
    // Add selected tag IDs
    selectedTagIds.forEach((tagId) => {
      formData.append("tagIds", tagId);
    });

    // Add editor content
    formData.set("contentJson", JSON.stringify(contentJson));
    formData.set("contentHtml", contentHtml);

    try {
      const result = insight
        ? await updateInsightAction(insight.id, formData)
        : await createInsightAction(formData);

      if (!result.success) {
        setError(result.error);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      } else {
        // Success - redirect handled by action
        if (insight) {
          router.refresh();
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!insight) return;
    
    if (!confirm("Are you sure you want to delete this insight? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteInsightAction(insight.id);
    
    if (result.success) {
      router.push("/admin/insights");
    } else {
      setError(result.error || "Failed to delete");
      setIsSubmitting(false);
    }
  };

  const handleMediaSelect = (media: Media) => {
    if (editorInstance) {
      editorInstance.chain().focus().setImage({ src: media.url, alt: media.alt || media.filename }).run();
    }
  };

  return (
    <>
      <MediaSelectorDialog
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={handleMediaSelect}
      />
    
      <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <strong className="font-medium">Error:</strong> {error}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter insight title"
          />
          {fieldErrors.title && (
            <p className="text-sm text-destructive">{fieldErrors.title[0]}</p>
          )}
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
          {fieldErrors.slug && (
            <p className="text-sm text-destructive">{fieldErrors.slug[0]}</p>
          )}
          <p className="text-sm text-muted-foreground">
            URL: /insights/{slug || "slug"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            defaultValue={insight?.excerpt || ""}
            rows={3}
            placeholder="Brief summary of the insight"
          />
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <Label>Content *</Label>
          <TiptapEditor
            content={contentJson}
            onChange={(json, html) => {
              setContentJson(json);
              setContentHtml(html);
            }}
            onInsertImage={() => setIsMediaSelectorOpen(true)}
            onEditorReady={(editor) => setEditorInstance(editor)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              name="status"
              defaultValue={insight?.status || "DRAFT"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorId">Author</Label>
            <select
              id="authorId"
              name="authorId"
              defaultValue={insight?.authorId || ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">No author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={insight?.categoryId || ""}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  setSelectedTagIds((prev) =>
                    prev.includes(tag.id)
                      ? prev.filter((id) => id !== tag.id)
                      : [...prev, tag.id]
                  );
                }}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
          {tags.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tags available. Create tags first.
            </p>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold">SEO & Metadata</h3>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            defaultValue={insight?.metaTitle || ""}
            placeholder="SEO title (leave empty to use title)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            defaultValue={insight?.metaDescription || ""}
            rows={3}
            placeholder="SEO description"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {insight && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/insights")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {insight ? "Update" : "Create"} Insight
          </Button>
        </div>
      </div>
    </form>
    </>
  );
}
