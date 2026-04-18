/* Phase 7: Strict block-based insight form */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaSelectorDialog } from "@/components/admin/media-selector-dialog";
import { generateSlugAction, createInsightAction, updateInsightAction, deleteInsightAction } from "@/app/admin/insights/actions";
import { uploadMediaAction } from "@/app/admin/media/actions";
import { compressImage, needsCompression } from "@/lib/image-compression";
import { isStrictInsightContent, type InsightBlock, type StrictInsightContent } from "@/lib/insight-blocks";
import type { Author, Category, Tag, Insight, InsightTag, Media } from "@prisma/client";
import { LazyImage } from "@/components/ui/lazy-image";
import { AlertCircle, Loader2, Trash2, MoveUp, MoveDown, Link2, Quote, Minus, ImagePlus, Video, Type } from "lucide-react";

interface InsightFormProps {
  insight?: Insight & { tags: (InsightTag & { tag: Tag })[]; coverImage?: Media | null };
  authors: Author[];
  categories: Category[];
  tags: Tag[];
}

export function InsightForm({ insight, authors, categories, tags }: InsightFormProps) {
  const router = useRouter();
  const draftToken = insight?.id || `draft-${crypto.randomUUID()}`;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [title, setTitle] = useState(insight?.title || "");
  const [slug, setSlug] = useState(insight?.slug || "");
  const [excerpt, setExcerpt] = useState(insight?.excerpt || "");
  const [metaTitle, setMetaTitle] = useState(insight?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(insight?.metaDescription || "");
  const [metaTitleTouched, setMetaTitleTouched] = useState(Boolean(insight?.metaTitle));
  const [metaDescriptionTouched, setMetaDescriptionTouched] = useState(Boolean(insight?.metaDescription));
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    insight?.tags.map((t) => t.tagId) || []
  );
  const [blocks, setBlocks] = useState<InsightBlock[]>(
    isStrictInsightContent(insight?.contentJson)
      ? insight!.contentJson.blocks
      : [{ id: crypto.randomUUID(), type: "text", content: "" }]
  );
  const [featuredImage, setFeaturedImage] = useState<Media | null>(insight?.coverImage || null);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<{ type: "featured" } | { type: "block"; blockId: string } | null>(null);
  const [uploadingByBlockId, setUploadingByBlockId] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);

  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        title: insight?.title || "",
        slug: insight?.slug || "",
        tags: insight?.tags.map((t) => t.tagId) || [],
        blocks: isStrictInsightContent(insight?.contentJson)
          ? insight!.contentJson.blocks
          : [{ id: "initial", type: "text", content: "" }],
        featuredImageId: insight?.coverImage?.id || null,
      }),
    [insight]
  );

  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        title,
        slug,
        tags: selectedTagIds,
        blocks,
        featuredImageId: featuredImage?.id || null,
      }),
    [title, slug, selectedTagIds, blocks, featuredImage]
  );

  useEffect(() => {
    setIsDirty(currentSnapshot !== initialSnapshot);
  }, [currentSnapshot, initialSnapshot]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSubmitting) return;
      event.preventDefault();
      event.returnValue = "";
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDirty || isSubmitting) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/admin")) return;

      const shouldLeave = confirm(
        "You have unsaved changes. Please save as draft before switching tabs. Continue without saving?"
      );
      if (!shouldLeave) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isDirty, isSubmitting]);

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

  // Auto-default SEO fields from title/excerpt unless user has manually edited them.
  useEffect(() => {
    if (!metaTitleTouched) {
      setMetaTitle(title);
    }
  }, [title, metaTitleTouched]);

  useEffect(() => {
    if (!metaDescriptionTouched) {
      setMetaDescription(excerpt);
    }
  }, [excerpt, metaDescriptionTouched]);

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

    const contentJson: StrictInsightContent = {
      version: 2,
      blocks,
    };
    formData.set("contentJson", JSON.stringify(contentJson));
    formData.set("contentHtml", "");
    formData.set("coverImageId", featuredImage?.id || "");

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

  const moveBlock = (index: number, direction: "up" | "down") => {
    setBlocks((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addBlock = (type: InsightBlock["type"]) => {
    const id = crypto.randomUUID();
    const block =
      type === "text"
        ? { id, type: "text" as const, content: "" }
        : type === "image"
          ? { id, type: "image" as const, url: "", alt: "", caption: "" }
          : type === "quote"
            ? { id, type: "quote" as const, quote: "", attribution: "" }
            : type === "divider"
              ? { id, type: "divider" as const }
              : type === "link"
                ? { id, type: "link" as const, url: "", label: "", openInNewTab: true }
                : { id, type: "video" as const, url: "", caption: "" };
    setBlocks((prev) => [...prev, block]);
  };

  const updateBlock = (blockId: string, updater: (block: InsightBlock) => InsightBlock) => {
    setBlocks((prev) => prev.map((block) => (block.id === blockId ? updater(block) : block)));
  };

  const removeBlock = (blockId: string) => {
    setBlocks((prev) => (prev.length > 1 ? prev.filter((block) => block.id !== blockId) : prev));
  };

  const handleMediaSelect = (media: Media) => {
    if (!mediaTarget) return;

    if (mediaTarget.type === "featured") {
      setFeaturedImage(media);
    } else {
      updateBlock(mediaTarget.blockId, (block) => {
        if (block.type !== "image") return block;
        return {
          ...block,
          mediaId: media.id,
          url: media.url,
          alt: media.alt || media.filename,
          caption: media.caption || "",
        };
      });
    }

    setMediaTarget(null);
  };

  const handleUploadImageForBlock = async (blockId: string, file: File) => {
    setUploadingByBlockId((prev) => ({ ...prev, [blockId]: true }));
    setError(null);
    try {
      const uploadFile = needsCompression(file, 1) ? await compressImage(file, { maxSizeMB: 1 }) : file;
      const formData = new FormData();
      formData.set("file", uploadFile);
      formData.set("draftToken", draftToken);
      if (insight?.id) {
        formData.set("insightId", insight.id);
      }

      const result = await uploadMediaAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }

      updateBlock(blockId, (block) => {
        if (block.type !== "image") return block;
        return {
          ...block,
          mediaId: result.mediaId,
          url: result.url,
        };
      });
    } finally {
      setUploadingByBlockId((prev) => ({ ...prev, [blockId]: false }));
    }
  };

  return (
    <>
      <MediaSelectorDialog
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={handleMediaSelect}
      />
    
      <form
        method="post"
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(e);
        }}
      >
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
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Brief summary of the insight"
          />
        </div>
      </div>

      {/* Featured image */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Featured Image</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setMediaTarget({ type: "featured" });
              setIsMediaSelectorOpen(true);
            }}
          >
            Select from media
          </Button>
        </div>
        {featuredImage ? (
          <div className="border rounded-lg p-3 flex items-center gap-3">
            <div className="relative h-16 w-24 overflow-hidden rounded">
              <LazyImage src={featuredImage.url} alt={featuredImage.alt || featuredImage.filename} fill className="object-cover" />
            </div>
            <div className="text-sm">
              <p className="font-medium">{featuredImage.filename}</p>
              <p className="text-muted-foreground">{featuredImage.url}</p>
            </div>
            <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={() => setFeaturedImage(null)}>
              Remove
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No featured image selected.</p>
        )}
      </div>

      {/* Content blocks */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <Label>Content *</Label>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => addBlock("text")}><Type className="h-4 w-4 mr-1" />Text</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addBlock("image")}><ImagePlus className="h-4 w-4 mr-1" />Image</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addBlock("quote")}><Quote className="h-4 w-4 mr-1" />Quote</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addBlock("divider")}><Minus className="h-4 w-4 mr-1" />Divider</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addBlock("link")}><Link2 className="h-4 w-4 mr-1" />Link</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addBlock("video")}><Video className="h-4 w-4 mr-1" />Video</Button>
          </div>
          <div className="space-y-4 pt-2">
            {blocks.map((block, index) => (
              <div key={block.id} className="border rounded-lg p-4 space-y-3 bg-background">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{block.type} block</span>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => moveBlock(index, "up")} disabled={index === 0}><MoveUp className="h-4 w-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => moveBlock(index, "down")} disabled={index === blocks.length - 1}><MoveDown className="h-4 w-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeBlock(block.id)} disabled={blocks.length === 1}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>

                {block.type === "text" && (
                  <Textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, () => ({ ...block, content: e.target.value }))}
                    rows={6}
                    placeholder="Write text content..."
                  />
                )}

                {block.type === "quote" && (
                  <div className="space-y-2">
                    <Textarea
                      value={block.quote}
                      onChange={(e) => updateBlock(block.id, () => ({ ...block, quote: e.target.value }))}
                      rows={3}
                      placeholder="Quote text"
                    />
                    <Input
                      value={block.attribution || ""}
                      onChange={(e) => updateBlock(block.id, () => ({ ...block, attribution: e.target.value }))}
                      placeholder="Attribution (optional)"
                    />
                  </div>
                )}

                {block.type === "divider" && (
                  <p className="text-sm text-muted-foreground">A divider line will be rendered between sections.</p>
                )}

                {block.type === "link" && (
                  <div className="space-y-2">
                    <Input
                      value={block.label}
                      onChange={(e) => updateBlock(block.id, () => ({ ...block, label: e.target.value }))}
                      placeholder="Link label"
                    />
                    <Input
                      value={block.url}
                      onChange={(e) => updateBlock(block.id, () => ({ ...block, url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {block.type === "video" && (
                  <div className="space-y-2">
                    <Input
                      value={block.url}
                      onChange={(e) => updateBlock(block.id, () => ({ ...block, url: e.target.value }))}
                      placeholder="Video URL (YouTube/Vimeo/embed)"
                    />
                    <Input
                      value={block.caption || ""}
                      onChange={(e) => updateBlock(block.id, () => ({ ...block, caption: e.target.value }))}
                      placeholder="Caption (optional)"
                    />
                  </div>
                )}

                {block.type === "image" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMediaTarget({ type: "block", blockId: block.id });
                          setIsMediaSelectorOpen(true);
                        }}
                      >
                        Select from media
                      </Button>
                      <label className="inline-flex items-center">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              void handleUploadImageForBlock(block.id, file);
                            }
                          }}
                        />
                        <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                          {uploadingByBlockId[block.id] ? "Uploading..." : "Upload image"}
                        </span>
                      </label>
                    </div>

                    {block.url && (
                      <div className="border rounded p-2">
                        <div className="relative aspect-video w-full overflow-hidden rounded">
                          <LazyImage src={block.url} alt={block.alt || ""} fill className="object-cover" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 break-all">{block.url}</p>
                      </div>
                    )}

                    <Input
                      value={block.alt || ""}
                      onChange={(e) => updateBlock(block.id, () => ({ ...block, alt: e.target.value }))}
                      placeholder="Alt text"
                    />
                    <Input
                      value={block.caption || ""}
                      onChange={(e) => updateBlock(block.id, () => ({ ...block, caption: e.target.value }))}
                      placeholder="Caption (optional)"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {fieldErrors.contentJson && (
          <p className="text-sm text-destructive">{fieldErrors.contentJson[0]}</p>
        )}
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
          <p className="text-xs text-muted-foreground">
            Click tags to select or remove them.
          </p>
          <div className="rounded-md border border-border/70 p-3 bg-muted/20">
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
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all border cursor-pointer ${
                    selectedTagIds.includes(tag.id)
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                  }`}
                  aria-pressed={selectedTagIds.includes(tag.id)}
                  title={selectedTagIds.includes(tag.id) ? "Click to remove tag" : "Click to add tag"}
                >
                  {selectedTagIds.includes(tag.id) ? "✓" : "+"} {tag.name}
                </button>
              ))}
            </div>
          </div>
          {selectedTagIds.length > 0 && (
            <p className="text-xs text-primary font-medium">
              {selectedTagIds.length} tag{selectedTagIds.length === 1 ? "" : "s"} selected
            </p>
          )}
          {tags.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tags available. Create tags first.
            </p>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold">SEO and Metadata</h3>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            value={metaTitle}
            onChange={(e) => {
              setMetaTitleTouched(true);
              setMetaTitle(e.target.value);
            }}
            placeholder="SEO title (leave empty to use title)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            value={metaDescription}
            onChange={(e) => {
              setMetaDescriptionTouched(true);
              setMetaDescription(e.target.value);
            }}
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
            onClick={() => {
              if (isDirty && !isSubmitting) {
                const shouldLeave = confirm(
                  "You have unsaved changes. Please save as draft before leaving. Continue without saving?"
                );
                if (!shouldLeave) return;
              }
              router.push("/admin/insights");
            }}
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
