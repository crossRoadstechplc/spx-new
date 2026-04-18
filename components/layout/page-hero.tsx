/* Phase 2: Hero section component for page headers */
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { proseBodyClass } from "@/lib/typography";
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
  /** Optional carousel background images (full-bleed behind content) */
  carouselImages?: string[];
  /** When set with a carousel, shows a scroll-down control targeting this section id */
  scrollToNextSectionId?: string;
}

function PageHeroCarouselBody({
  title,
  subtitle,
  description,
  children,
  size = "default",
  className,
}: Omit<PageHeroProps, "carouselImages">) {
  const isLarge = size === "large";
  const hasSubtitle = Boolean(subtitle);

  return (
    <section
      className={cn(
        "relative w-full py-10 md:py-14",
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
              "font-bold tracking-tight leading-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]",
              isLarge
                ? hasSubtitle
                  ? "text-3xl sm:text-4xl md:text-5xl lg:text-5xl"
                  : "text-4xl md:text-5xl lg:text-6xl"
                : "text-3xl md:text-4xl lg:text-5xl"
            )}
          >
            <span className="block">{title}</span>
            {subtitle ? <span className="block">{subtitle}</span> : null}
          </h1>
          {description ? (
            <p className="mt-6 text-lg leading-relaxed text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
              {description}
            </p>
          ) : null}
          {children ? (
            <div className="mt-8 flex flex-wrap gap-4">{children}</div>
          ) : null}
        </motion.div>
      </Container>
    </section>
  );
}

export function PageHero({
  title,
  subtitle,
  description,
  children,
  size = "default",
  className,
  carouselImages,
  scrollToNextSectionId,
}: PageHeroProps) {
  const isLarge = size === "large";
  const hasSubtitle = Boolean(subtitle);

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
              "font-bold tracking-tight leading-tight",
              isLarge
                ? hasSubtitle
                  ? "text-3xl sm:text-4xl md:text-5xl lg:text-5xl"
                  : "text-4xl md:text-5xl lg:text-6xl"
                : "text-3xl md:text-4xl lg:text-5xl"
            )}
          >
            <span className="block">{title}</span>
            {subtitle && <span className="block">{subtitle}</span>}
          </h1>
          {description && (
            <p className={cn(proseBodyClass, "mt-6")}>
              {description}
            </p>
          )}
          {children && (
            <div className="mt-8 flex flex-wrap gap-4">{children}</div>
          )}
        </motion.div>
      </Container>
    </section>
  );

  if (carouselImages && carouselImages.length > 0) {
    return (
      <HeroCarousel
        images={carouselImages}
        scrollToNextSectionId={scrollToNextSectionId}
      >
        <PageHeroCarouselBody
          title={title}
          subtitle={subtitle}
          description={description}
          children={children}
          size={size}
          className={className}
        />
      </HeroCarousel>
    );
  }

  return content;
}
