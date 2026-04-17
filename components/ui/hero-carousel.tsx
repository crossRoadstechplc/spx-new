/* Phase X: Hero carousel with image backdrop */
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsDown } from "lucide-react";

interface HeroCarouselProps {
  images: string[];
  interval?: number;
  children?: React.ReactNode;
  /** Renders a bouncing scroll control that smooth-scrolls to this element id */
  scrollToNextSectionId?: string;
}

function HeroScrollCue({ targetId }: { targetId: string }) {
  const scrollToTarget = useCallback(() => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [targetId]);

  return (
    <motion.button
      type="button"
      aria-label="Scroll to next section"
      onClick={scrollToTarget}
      className="flex flex-col items-center gap-0.5 rounded-full border border-white/35 bg-white/10 p-2 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      animate={{ y: [0, 8, 0] }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <ChevronsDown className="h-7 w-7 opacity-95" strokeWidth={2} />
    </motion.button>
  );
}

const FALLBACK_HERO_IMAGES = [
  "/assets/images/hero/image2.webp",
  "/assets/images/hero/image4.webp",
  "/assets/images/hero/image6.webp",
] as const;

export function HeroCarousel({
  images,
  interval = 5000,
  children,
  scrollToNextSectionId,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const slideTransition = {
    duration: 0.75,
    ease: [0.32, 0.72, 0, 1] as const,
  };

  return (
    <div className="relative min-h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentIndex}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={slideTransition}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={
                failedImages[images[currentIndex]!]
                  ? FALLBACK_HERO_IMAGES[
                      currentIndex % FALLBACK_HERO_IMAGES.length
                    ]!
                  : images[currentIndex]!
              }
              alt=""
              fill
              className="object-cover"
              priority={currentIndex === 0}
              quality={90}
              onError={() =>
                setFailedImages((prev) => ({
                  ...prev,
                  [images[currentIndex]]: true,
                }))
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex min-h-[85vh] flex-col">
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          {children}
        </div>
        {scrollToNextSectionId ? (
          <div className="flex shrink-0 justify-center pb-6 pt-2">
            <HeroScrollCue targetId={scrollToNextSectionId} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
