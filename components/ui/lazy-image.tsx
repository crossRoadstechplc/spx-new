"use client";

import * as React from "react";
import NextImage, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const DEFAULT_DELAY_MS = 200;

export type LazyImageProps = ImageProps & {
  /** Shown in the image area after `loadingDelayMs` while the image is still loading */
  loadingText?: string;
  /** Delay before showing loading text (avoids flash on fast loads) */
  loadingDelayMs?: number;
};

export function LazyImage({
  loadingText = "Loading...",
  loadingDelayMs = DEFAULT_DELAY_MS,
  onLoad,
  onLoadingComplete,
  className,
  priority,
  loading,
  fill,
  src,
  ...rest
}: LazyImageProps) {
  const loadedRef = React.useRef(false);
  const [loaded, setLoaded] = React.useState(false);
  const [showDelayedMessage, setShowDelayedMessage] = React.useState(false);

  React.useEffect(() => {
    loadedRef.current = false;
    setLoaded(false);
    setShowDelayedMessage(false);
    const id = window.setTimeout(() => {
      if (!loadedRef.current) setShowDelayedMessage(true);
    }, loadingDelayMs);
    return () => window.clearTimeout(id);
  }, [src, loadingDelayMs]);

  const handleLoadingComplete: NonNullable<ImageProps["onLoadingComplete"]> = (img) => {
    loadedRef.current = true;
    setLoaded(true);
    setShowDelayedMessage(false);
    onLoadingComplete?.(img);
  };

  const resolvedLoading = loading ?? (priority ? "eager" : "lazy");
  const showOverlay = showDelayedMessage && !loaded;

  const image = (
    <NextImage
      {...rest}
      src={src}
      fill={fill}
      priority={priority}
      loading={resolvedLoading}
      onLoad={onLoad}
      onLoadingComplete={handleLoadingComplete}
      className={cn(
        "transition-opacity duration-300",
        loaded ? "opacity-100" : "opacity-0",
        fill && "z-0",
        className
      )}
    />
  );

  if (fill) {
    return (
      <>
        {showOverlay ? (
          <div
            className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-muted/40"
            aria-hidden
          >
            <span className="text-sm font-medium text-muted-foreground">{loadingText}</span>
          </div>
        ) : null}
        {image}
      </>
    );
  }

  return (
    <span className="relative inline-block max-w-full">
      {showOverlay ? (
        <div
          className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-muted/40"
          aria-hidden
        >
          <span className="text-sm font-medium text-muted-foreground">{loadingText}</span>
        </div>
      ) : null}
      {image}
    </span>
  );
}
