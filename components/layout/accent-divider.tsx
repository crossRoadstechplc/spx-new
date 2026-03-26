/* Phase 2: Subtle accent divider component for visual separation */
import * as React from "react";
import { cn } from "@/lib/utils";

interface AccentDividerProps {
  /** Variant style */
  variant?: "default" | "gradient" | "dotted";
  /** Additional className */
  className?: string;
}

/**
 * Accent divider component for subtle visual separation between sections.
 * Uses Deep Sky Blue accent for refined visual rhythm.
 */
export function AccentDivider({
  variant = "default",
  className,
}: AccentDividerProps) {
  if (variant === "gradient") {
    return (
      <div className={cn("w-full h-px", className)}>
        <div className="h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    );
  }

  if (variant === "dotted") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <div className="h-1 w-1 rounded-full bg-primary/40" />
        <div className="h-1 w-1 rounded-full bg-primary/60" />
        <div className="h-1 w-1 rounded-full bg-primary" />
        <div className="h-1 w-1 rounded-full bg-primary/60" />
        <div className="h-1 w-1 rounded-full bg-primary/40" />
      </div>
    );
  }

  return (
    <div className={cn("w-full h-px bg-border/40", className)} />
  );
}
