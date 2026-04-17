"use client";

/* SPX letter reveal (original), then yellow dot flows right-to-left to logo-accent rest */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingAnimationProps {
  onComplete?: () => void;
  minDuration?: number;
}

/** Yellow dot rest on lower-right leg of bold “X” (percent of the letter box). */
const X_DOT_START = { left: "108%", top: "44%" };
const X_DOT_REST = { left: "71%", top: "84%" };

export function LoadingAnimation({
  onComplete,
  minDuration = 5000,
}: LoadingAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showYellowDot, setShowYellowDot] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 800);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.3,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 1.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      y: -30,
      transition: {
        duration: 0.8,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.15,
        staggerDirection: 1,
      },
    },
  };

  const glowVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              className="relative flex items-center gap-2 text-6xl font-bold md:text-8xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ perspective: 1000 }}
            >
              {["S", "P", "X"].map((letter, index) => (
                <motion.span
                  key={letter}
                  variants={letterVariants}
                  className="relative inline-block overflow-visible"
                  style={{
                    color: "hsl(var(--foreground))",
                    textShadow: "0 0 30px hsl(var(--foreground) / 0.3)",
                  }}
                  onAnimationComplete={() => {
                    if (index === 2) setShowYellowDot(true);
                  }}
                >
                  {letter}
                  {letter === "X" && showYellowDot && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute z-10 h-3 w-3 translate-x-[calc(-50%+50px)] -translate-y-1/2 rounded-full bg-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.75)] md:h-3.5 md:w-3.5"
                      initial={X_DOT_START}
                      animate={X_DOT_REST}
                      transition={{
                        duration: 1.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  )}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-24 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-foreground"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
