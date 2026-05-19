"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getAdminInsightPreviewUrl } from "@/lib/insight-preview";
import { ExternalLink, X } from "lucide-react";

interface InsightPreviewDialogProps {
  insightId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InsightPreviewDialog({
  insightId,
  title,
  isOpen,
  onClose,
}: InsightPreviewDialogProps) {
  const previewSrc = useMemo(() => {
    if (!isOpen || typeof window === "undefined") return "";
    return getAdminInsightPreviewUrl(insightId, window.location.origin);
  }, [insightId, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="insight-preview-title"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 bg-background">
        <div className="min-w-0">
          <h2 id="insight-preview-title" className="text-lg font-semibold truncate">
            Preview: {title}
          </h2>
          <p className="text-xs text-muted-foreground truncate">{previewSrc}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button type="button" variant="outline" size="sm" asChild>
            <a href={previewSrc} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Open tab
            </a>
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close preview">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-muted/30 p-2 md:p-4">
        {previewSrc ? (
          <iframe
            title={`Insight preview: ${title}`}
            src={previewSrc}
            className="h-full w-full rounded-lg border border-border bg-background shadow-sm"
          />
        ) : null}
      </div>
    </div>
  );
}
