/* Phase 5: Media grid component */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteMediaAction } from "@/app/admin/media/actions";
import { Trash2, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import type { Media } from "@prisma/client";

interface MediaGridProps {
  media: (Media & { insight: { title: string } | null })[];
}

export function MediaGrid({ media }: MediaGridProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<Media | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media file?")) {
      return;
    }

    setDeleting(id);
    const result = await deleteMediaAction(id);
    
    if (!result.success) {
      alert(result.error || "Failed to delete media");
    }
    
    setDeleting(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <div
          key={item.id}
          className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors"
        >
          {/* Image Preview */}
          <div className="aspect-video bg-muted relative">
            {item.type === "IMAGE" ? (
              <Image
                src={item.url}
                alt={item.alt || item.filename}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                File
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 space-y-2">
            <div className="text-sm font-medium truncate" title={item.filename}>
              {item.filename}
            </div>
            
            {item.insight && (
              <div className="text-xs text-muted-foreground truncate">
                Linked to: {item.insight.title}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              {(item.sizeBytes / 1024).toFixed(1)} KB
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="ghost"
                className="flex-1"
                onClick={() => setPreviewItem(item)}
              >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(item.id)}
                disabled={deleting === item.id}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-background border border-border rounded-lg overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{previewItem.filename}</p>
                <p className="text-xs text-muted-foreground truncate">{previewItem.url}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreviewItem(null)} aria-label="Close preview">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative w-full h-[70vh] bg-muted">
              {previewItem.type === "IMAGE" ? (
                <Image
                  src={previewItem.url}
                  alt={previewItem.alt || previewItem.filename}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Preview unavailable for this file type.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
