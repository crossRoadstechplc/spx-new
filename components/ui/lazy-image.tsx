"use client";

import * as React from "react";
import NextImage, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const DEFAULT_DELAY_MS = 200;

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(value);
      else (ref as React.MutableRefObject<T | null>).current = value;
    }
  };
}

export type LazyImageProps = ImageProps & {
  /** Shown in the image area after `loadingDelayMs` while the image is still loading */
  loadingText?: string;
  /** Delay before showing loading text (avoids flash on fast loads) */
  loadingDelayMs?: number;
  /** Forwarded to the underlying `<img>` (not listed on Next `ImageProps` typings). */
  ref?: React.Ref<HTMLImageElement | null>;
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
  ref: externalRef,
  ...rest
}: LazyImageProps) {
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const loadedRef = React.useRef(false);
  const [loaded, setLoaded] = React.useState(false);
  const [showDelayedMessage, setShowDelayedMessage] = React.useState(false);

  const markLoaded = React.useCallback(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoaded(true);
    setShowDelayedMessage(false);
  }, []);

  React.useEffect(() => {
    loadedRef.current = false;
    setLoaded(false);
    setShowDelayedMessage(false);
    const id = window.setTimeout(() => {
      if (!loadedRef.current) setShowDelayedMessage(true);
    }, loadingDelayMs);
    return () => window.clearTimeout(id);
  }, [src, loadingDelayMs]);

  React.useLayoutEffect(() => {
    const el = imgRef.current;
    if (el?.complete && el.naturalHeight > 0) {
      markLoaded();
    }
  }, [src, markLoaded]);

  const handleLoad: NonNullable<ImageProps["onLoad"]> = (e) => {
    markLoaded();
    onLoad?.(e);
  };

  const handleLoadingComplete: NonNullable<ImageProps["onLoadingComplete"]> = (img) => {
    markLoaded();
    onLoadingComplete?.(img);
  };

  const setImgRef = mergeRefs(imgRef, externalRef);

  const resolvedLoading = loading ?? (priority ? "eager" : "lazy");
  const showOverlay = showDelayedMessage && !loaded;

  const image = (
    <NextImage
      {...rest}
      ref={setImgRef}
      src={src}
      fill={fill}
      priority={priority}
      loading={resolvedLoading}
      onLoad={handleLoad}
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
