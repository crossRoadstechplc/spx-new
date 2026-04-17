/* Phase 2.5: Media + content layout blocks for visual rhythm */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { proseBodyClass } from "@/lib/typography";
import { ImagePlaceholder, type AspectRatio } from "./image-placeholder";

interface MediaContentBlockProps {
  /** Layout direction */
  layout?: "image-left" | "image-right";
  /** Image placeholder variant */
  imageVariant?: AspectRatio;
  /** Optional image caption */
  imageCaption?: string;
  /** Optional image badge */
  imageBadge?: string;
  /** Optional image source */
  imageSrc?: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Content/text to display alongside image */
  children: React.ReactNode;
  /** Additional className for container */
  className?: string;
  /** Gap size between image and content */
  gap?: "sm" | "md" | "lg";
}

const gapMap = {
  sm: "gap-6",
  md: "gap-8",
  lg: "gap-12",
};

/**
 * Media + Content Block component for creating visual rhythm.
 * Alternates image placeholders with text content in responsive layouts.
 * 
 * Usage:
 * <MediaContentBlock layout="image-left" imageVariant="landscape">
 *   <h2>Section Title</h2>
 *   <p>Content text here...</p>
 * </MediaContentBlock>
 */
export function MediaContentBlock({
  layout = "image-right",
  imageVariant = "landscape",
  imageCaption,
  imageBadge,
  imageSrc,
  imageAlt,
  children,
  className,
  gap = "md",
}: MediaContentBlockProps) {
  const isImageLeft = layout === "image-left";

  return (
    <div
      className={cn(
        "grid items-center",
        "grid-cols-1 md:grid-cols-2",
        gapMap[gap],
        className
      )}
    >
      {/* Image placeholder */}
      <div className={cn("w-full", isImageLeft ? "md:order-1" : "md:order-2")}>
        <ImagePlaceholder
          variant={imageVariant}
          caption={imageCaption}
          badge={imageBadge}
          src={imageSrc}
          alt={imageAlt}
        />
      </div>

      {/* Content */}
      <div className={cn("w-full", isImageLeft ? "md:order-2" : "md:order-1")}>
        {children}
      </div>
    </div>
  );
}

interface FullWidthMediaBlockProps {
  /** Image variant */
  variant?: AspectRatio;
  /** Optional caption */
  caption?: string;
  /** Optional badge */
  badge?: string;
  /** Additional className */
  className?: string;
}

/**
 * Full-width media block for section breaks and visual impact.
 * Creates breathing room between dense content sections.
 */
export function FullWidthMediaBlock({
  variant = "ultrawide",
  caption,
  badge,
  className,
}: FullWidthMediaBlockProps) {
  return (
    <div className={cn("w-full", className)}>
      <ImagePlaceholder variant={variant} caption={caption} badge={badge} />
    </div>
  );
}

interface MediaCardGridProps {
  /** Grid columns (responsive) */
  columns?: 2 | 3 | 4;
  /** Cards data */
  cards: Array<{
    title: string;
    description: string;
    imageVariant?: AspectRatio;
    imageBadge?: string;
    imageSrc?: string;
    imageAlt?: string;
  }>;
  /** Additional className */
  className?: string;
}

/**
 * Grid of cards with image placeholders on top.
 * Useful for Sectors, Our Work, Insights overview, etc.
 */
export function MediaCardGrid({ columns = 3, cards, className }: MediaCardGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid grid-cols-1 gap-6", gridCols[columns], className)}>
      {cards.map((card, idx) => (
        <div key={idx} className="group space-y-4">
          <ImagePlaceholder
            variant={card.imageVariant || "landscape"}
            badge={card.imageBadge}
            src={card.imageSrc}
            alt={card.imageAlt || card.title}
          />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight">{card.title}</h3>
            <p className={proseBodyClass}>{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
