/* Phase 2.5: Editorial image placeholder component system for SPX brand */
"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

export type AspectRatio = "square" | "landscape" | "portrait" | "wide" | "ultrawide";

interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio variant */
  variant?: AspectRatio;
  /** Optional caption text */
  caption?: string;
  /** Optional badge label (e.g. "Coming Soon", "Editorial") */
  badge?: string;
  /** Show icon in center */
  showIcon?: boolean;
  /** Custom aspect ratio string (e.g. "16/9") - overrides variant */
  aspectRatio?: string;
  /** Optional image source */
  src?: string;
  /** Optional image alt text */
  alt?: string;
}

const aspectRatioMap: Record<AspectRatio, string> = {
  square: "1/1",
  landscape: "4/3",
  portrait: "3/4",
  wide: "16/9",
  ultrawide: "21/9",
};

export function ImagePlaceholder({
  variant = "landscape",
  caption,
  badge,
  showIcon = true,
  aspectRatio,
  src,
  alt,
  className,
  ...props
}: ImagePlaceholderProps) {
  const ratio = aspectRatio || aspectRatioMap[variant];
  const fallbackSources = [
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  ];
  const [resolvedSrc, setResolvedSrc] = React.useState(src);

  React.useEffect(() => {
    setResolvedSrc(src);
  }, [src]);

  return (
    <div className={cn("group relative", className)} {...props}>
      {/* Placeholder container with aspect ratio */}
      <div
        data-testid="image-placeholder"
        className={cn(
          "relative overflow-hidden rounded-lg border-2 border-border",
          !resolvedSrc && "bg-muted/30",
          "transition-all duration-300",
          "hover:border-primary/40 hover:bg-muted/50"
        )}
        style={{ aspectRatio: ratio }}
      >
        {/* Actual Image */}
        {resolvedSrc && (
          <Image
            src={resolvedSrc}
            alt={alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              const fallback = fallbackSources[Math.floor(Math.random() * fallbackSources.length)];
              if (resolvedSrc !== fallback) {
                setResolvedSrc(fallback);
              }
            }}
          />
        )}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

        {/* Center icon (only show if no src) */}
        {!resolvedSrc && showIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/30 transition-colors group-hover:text-primary/40" />
          </div>
        )}

        {/* Optional badge */}
        {badge && (
          <div className="absolute right-3 top-3 z-10">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {badge}
            </span>
          </div>
        )}

        {/* Decorative corner accent */}
        {!resolvedSrc && (
          <div className="absolute bottom-0 right-0 h-16 w-16 translate-x-8 translate-y-8 rounded-full bg-primary/5 blur-2xl" />
        )}
      </div>

      {/* Optional caption */}
      {caption && (
        <p className="mt-2 text-sm text-muted-foreground italic">{caption}</p>
      )}
    </div>
  );
}

/** Landscape editorial image (4:3) - for general content sections */
export function EditorialImagePlaceholder(props: Omit<ImagePlaceholderProps, "variant">) {
  return <ImagePlaceholder variant="landscape" {...props} />;
}

/** Portrait image (3:4) - for team members, case studies */
export function PortraitImagePlaceholder(props: Omit<ImagePlaceholderProps, "variant">) {
  return <ImagePlaceholder variant="portrait" {...props} />;
}

/** Wide banner (16:9) - for hero sections, full-width media */
export function WideBannerPlaceholder(props: Omit<ImagePlaceholderProps, "variant">) {
  return <ImagePlaceholder variant="wide" {...props} />;
}

/** Ultra-wide banner (21:9) - for cinematic hero sections */
export function UltraWidePlaceholder(props: Omit<ImagePlaceholderProps, "variant">) {
  return <ImagePlaceholder variant="ultrawide" {...props} />;
}

/** Square image (1:1) - for logos, icons, compact cards */
export function SquareImagePlaceholder(props: Omit<ImagePlaceholderProps, "variant">) {
  return <ImagePlaceholder variant="square" {...props} />;
}
