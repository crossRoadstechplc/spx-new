"use client";

import { motion } from "framer-motion";

interface PopupLoadingAnimationProps {
  label?: string;
}

export function PopupLoadingAnimation({ label = "Loading..." }: PopupLoadingAnimationProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-[260px] rounded-xl border border-border bg-card/95 p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-5">
          <motion.div
            className="flex items-center gap-1 text-3xl font-bold"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {["S", "P", "X"].map((letter) => (
              <motion.span
                key={letter}
                variants={{
                  hidden: { opacity: 0.2, y: 8 },
                  visible: {
                    opacity: [0.35, 1, 0.35],
                    y: [2, -2, 2],
                    transition: {
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  },
                }}
                className="text-foreground"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          <div className="flex gap-1.5">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.35, 1, 0.35],
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: dot * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <p className="text-xs uppercase tracking-wider text-muted-foreground">{}</p>
        </div>
      </motion.div>
    </div>
  );
}

