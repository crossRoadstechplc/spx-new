/* Phase 2: Hero section component for page headers */
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { HeroCarousel } from "@/components/ui/hero-carousel";

interface PageHeroProps {
  /** Main heading */
  title: string;
  /** Optional subtitle (displayed as second line of title) */
  subtitle?: string;
  /** Optional description */
  description?: string;
  /** Optional children (e.g., CTA buttons) */
  children?: React.ReactNode;
  /** Size variant */
  size?: "default" | "large";
  /** Additional className */
  className?: string;
  /** Optional carousel images */
  carouselImages?: string[];
}

/**
 * Page hero component for impactful page introductions.
 * Includes subtle reveal animation on mount.
 */
export function PageHero({
  title,
  subtitle,
  description,
  children,
  size = "default",
  className,
  carouselImages,
}: PageHeroProps) {
  const isLarge = size === "large";

  const content = (
    <section
      className={cn(
        "relative py-16 md:py-24",
        isLarge && "md:py-32 lg:py-40",
        className
      )}
    >
      <Container size="default">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1
            className={cn(
              "font-bold tracking-tight",
              isLarge
                ? "text-4xl md:text-5xl lg:text-6xl"
                : "text-3xl md:text-4xl lg:text-5xl"
            )}
          >
            <span className="block">{title}</span>
            {subtitle && <span className="block">{subtitle}</span>}
          </h1>
          {description && (
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
          {children && (
            <div className="mt-8 flex flex-wrap gap-4">
              {children}
            </div>
          )}
        </motion.div>
      </Container>

      {/* Decorative accent */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-primary/20 via-primary/40 to-transparent" />
    </section>
  );

  // If carousel images provided, wrap content in HeroCarousel
  if (carouselImages && carouselImages.length > 0) {
    return <HeroCarousel images={carouselImages}>{content}</HeroCarousel>;
  }

  return content;
}
