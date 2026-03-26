/* Phase 5: Media management page */
import { db } from "@/lib/db";
import { Image as ImageIcon } from "lucide-react";
import { MediaGrid } from "@/components/admin/media-grid";
import { MediaUploadDialog } from "@/components/admin/media-upload-dialog";

export const metadata = {
  title: "Media | SPX Admin",
  description: "Manage media library",
};

export default async function AdminMediaPage() {
  const media = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      insight: {
        select: { title: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage uploaded images and files
          </p>
        </div>
        <MediaUploadDialog />
      </div>

      {media.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            No media files yet. Upload your first image or file.
          </p>
          <MediaUploadDialog />
        </div>
      ) : (
        <MediaGrid media={media} />
      )}
    </div>
  );
}

