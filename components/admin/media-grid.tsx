/* Phase 5: Media grid component */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteMediaAction } from "@/app/admin/media/actions";
import { Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { Media } from "@prisma/client";

interface MediaGridProps {
  media: (Media & { insight: { title: string } | null })[];
}

export function MediaGrid({ media }: MediaGridProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

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
                asChild
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </a>
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
    </div>
  );
}
