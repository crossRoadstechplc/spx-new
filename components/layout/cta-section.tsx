/* Phase 2: Call-to-action section component */
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { proseBodyClass } from "@/lib/typography";
import { Button } from "@/components/ui/button";
import { Container } from "./container";

interface CTASectionProps {
  /** Main heading */
  title: string;
  /** Optional description */
  description?: string;
  /** Primary CTA button */
  primaryCTA?: {
    label: string;
    href: string;
  };
  /** Optional secondary CTA button */
  secondaryCTA?: {
    label: string;
    href: string;
  };
  /** Variant style */
  variant?: "default" | "primary";
  /** Additional className */
  className?: string;
}

/**
 * Call-to-action section component.
 * Used for prominent conversion sections throughout the site.
 */
export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = "default",
  className,
}: CTASectionProps) {
  const isPrimary = variant === "primary";

  return (
    <section
      className={cn(
        "relative py-16 md:py-24",
        isPrimary && "bg-primary/5 border-y border-primary/10",
        className
      )}
    >
      <Container size="default">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h2>
          {description && (
            <p className={cn(proseBodyClass, "mt-4")}>
              {description}
            </p>
          )}
          {(primaryCTA || secondaryCTA) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {primaryCTA && (
                <Button asChild size="lg" className="font-medium">
                  <Link href={primaryCTA.href}>{primaryCTA.label}</Link>
                </Button>
              )}
              {secondaryCTA && (
                <Button asChild size="lg" variant="outline" className="font-medium">
                  <Link href={secondaryCTA.href}>{secondaryCTA.label}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Decorative accents */}
      {isPrimary && (
        <>
          <div className="absolute top-0 left-0 h-px w-1/3 bg-gradient-to-r from-primary/40 to-transparent" />
          <div className="absolute bottom-0 right-0 h-px w-1/3 bg-gradient-to-l from-primary/40 to-transparent" />
        </>
      )}
    </section>
  );
}

/** Standard site-wide closing band: single “Get in Touch” to Contact. */
export function ClosingCTASection({ className }: { className?: string }) {
  return (
    <CTASection
      variant="primary"
      className={className}
      title="Reach Out"
      description="Partner with us to explore opportunities in market systems design and execution."
      primaryCTA={{ label: "Get in Touch", href: "/contact" }}
    />
  );
}
