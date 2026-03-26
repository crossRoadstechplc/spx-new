/* Phase 6: Media selector dialog for Tiptap image insertion */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import type { Media } from "@prisma/client";

interface MediaSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
}

export function MediaSelectorDialog({ isOpen, onClose, onSelect }: MediaSelectorDialogProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/media/api");
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = media.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Select Image</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b border-border">
          <Input
            type="search"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading media...
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No media found. Upload images first.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors bg-background"
                >
                  <div className="aspect-video bg-muted relative">
                    {item.type === "IMAGE" && (
                      <Image
                        src={item.url}
                        alt={item.alt || item.filename}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-2 text-xs truncate" title={item.filename}>
                    {item.filename}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
