/* Phase 5: Media upload dialog component */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMediaAction } from "@/app/admin/media/actions";
import { compressImage, needsCompression, formatFileSize } from "@/lib/image-compression";
import { Upload, Loader2, AlertCircle, Info } from "lucide-react";

export function MediaUploadDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Check if compression is needed
    if (needsCompression(file, 1)) {
      setIsCompressing(true);
      setCompressionInfo(`Original: ${formatFileSize(file.size)} - Compressing...`);
      
      try {
        const compressedFile = await compressImage(file, { maxSizeMB: 1 });
        setSelectedFile(compressedFile);
        const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(0);
        setCompressionInfo(
          `Compressed from ${formatFileSize(file.size)} to ${formatFileSize(compressedFile.size)} (${savings}% reduction)`
        );
      } catch (err) {
        console.error("Compression error:", err);
        setError("Failed to compress image. Please try a smaller file.");
        setSelectedFile(null);
      } finally {
        setIsCompressing(false);
      }
    } else {
      setSelectedFile(file);
      setCompressionInfo(`Size: ${formatFileSize(file.size)} (no compression needed)`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("file", selectedFile);

    const result = await uploadMediaAction(formData);

    if (result.success) {
      setIsOpen(false);
      setSelectedFile(null);
      (e.target as HTMLFormElement).reset();
      window.location.reload();
    } else {
      setError(result.error);
    }

    setIsUploading(false);
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Upload Media
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Upload Media</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              disabled={isUploading || isCompressing}
            />
            {isCompressing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Compressing image...
              </div>
            )}
            {compressionInfo && !isCompressing && (
              <div className="flex items-start gap-2 p-2 rounded bg-blue-50 border border-blue-200">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900">{compressionInfo}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              name="alt"
              placeholder="Describe the image"
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              name="caption"
              placeholder="Optional caption"
              disabled={isUploading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setError(null);
                setSelectedFile(null);
                setCompressionInfo(null);
              }}
              disabled={isUploading || isCompressing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || isCompressing || !selectedFile} className="flex-1">
              {(isUploading || isCompressing) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isCompressing ? "Compressing..." : "Upload"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
