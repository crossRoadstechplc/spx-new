/* Phase X: Hero carousel with image backdrop */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface HeroCarouselProps {
  images: string[];
  interval?: number;
  children?: React.ReactNode;
}

export function HeroCarousel({ images, interval = 5000, children }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const fallbackImages = [
    "/assets/images/hero/image2.webp",
    "/assets/images/hero/image4.webp",
    "/assets/images/hero/image6.webp",
  ];

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Image Background with Carousel */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={failedImages[images[currentIndex]] ? fallbackImages[currentIndex % fallbackImages.length] : images[currentIndex]}
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

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
