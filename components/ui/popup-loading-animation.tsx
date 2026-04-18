"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { LazyImage } from "@/components/ui/lazy-image";
import { motion } from "framer-motion";
import { SITE_LOGO_PATH } from "@/lib/seo-config";

/** Match yellow accent in spx-logo.png (same as loading-animation). */
const DOT_LEFT_PCT = 68;
const DOT_TOP_PCT = 34;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface PopupLoadingAnimationProps {
  label?: string;
}

export function PopupLoadingAnimation({ label = "Loading" }: PopupLoadingAnimationProps) {
  const [mounted, setMounted] = React.useState(false);

  useIsoLayoutEffect(() => {
    setMounted(true);
  }, []);

  const overlay = (
    <div
      className="fixed inset-0 z-[200] flex min-h-dvh items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-[260px] rounded-xl border border-border bg-card/95 p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-11 w-[140px]">
            <LazyImage
              src={SITE_LOGO_PATH}
              alt=""
              width={140}
              height={44}
              className="h-11 w-auto object-contain object-left"
              priority
            />
            <motion.span
              className="pointer-events-none absolute h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.65)]"
              style={{
                left: `${DOT_LEFT_PCT}%`,
                top: `${DOT_TOP_PCT}%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <p className="text-center text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        </div>
      </motion.div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(overlay, document.body);
}
