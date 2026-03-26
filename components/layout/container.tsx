/* Phase 2: Reusable container component for consistent max-width and padding */
import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Container size variant */
  size?: "default" | "narrow" | "wide" | "full";
}

const sizeMap = {
  default: "max-w-7xl",
  narrow: "max-w-4xl",
  wide: "max-w-[90rem]",
  full: "max-w-full",
};

/**
 * Container component for consistent horizontal spacing and max-width.
 * Used throughout the site for layout consistency.
 */
export function Container({
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 lg:px-8",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
