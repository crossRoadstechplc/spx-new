/* Phase 2: Section introduction component for content sections */
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { proseBodyClass } from "@/lib/typography";

interface SectionIntroProps {
  /** Optional eyebrow label */
  eyebrow?: string;
  /** Section heading */
  title: string;
  /** Optional description */
  description?: string;
  /** Text alignment */
  align?: "left" | "center";
  /** Additional className */
  className?: string;
}

/**
 * Section introduction component for content sections.
 * Provides consistent typography and spacing for section headers.
 */
export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionIntroProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "space-y-4",
        isCenter && "text-center mx-auto max-w-3xl",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "text-sm font-medium text-primary uppercase tracking-wider",
            isCenter && "mx-auto"
          )}
        >
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className={proseBodyClass}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
