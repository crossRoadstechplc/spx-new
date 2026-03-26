"use client";

/* SPX Loading Animation with creative letter reveals */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingAnimationProps {
  onComplete?: () => void;
  minDuration?: number; // Minimum duration in milliseconds
}

export function LoadingAnimation({
  onComplete,
  minDuration = 5000,
}: LoadingAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ensure minimum display duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 800); // Wait for exit animation
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
          {/* Background glow effect */}
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-primary/20 blur-3xl"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />

          {/* SPX Letters */}
          <motion.div
            className="relative flex items-center gap-2 text-6xl md:text-8xl font-bold"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ perspective: 1000 }}
          >
            {["S", "P", "X"].map((letter) => (
              <motion.span
                key={letter}
                variants={letterVariants}
                className="relative inline-block"
                style={{
                  color: "hsl(var(--foreground))",
                  textShadow: "0 0 30px hsl(var(--foreground) / 0.3)",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          {/* Loading dots */}
          <motion.div
            className="absolute bottom-24 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-foreground"
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
