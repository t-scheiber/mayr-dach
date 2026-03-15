"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedAnimations } from "./useReducedAnimations";
import { brandColors, easings, defaultVariants } from "./variants";

interface RoofTileLoaderProps {
  onComplete?: () => void;
  size?: "sm" | "md" | "lg";
}

export function RoofTileLoader({ onComplete, size = "md" }: RoofTileLoaderProps) {
  const { shouldReduce } = useReducedAnimations();
  const [isVisible, setIsVisible] = useState(true);
  const [showText, setShowText] = useState(false);

  // Simplified version for mobile / reduced motion
  useEffect(() => {
    if (shouldReduce) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) setTimeout(onComplete, 400); // Wait for fade out
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [shouldReduce, onComplete]);

  // Full animation sequence trigger
  useEffect(() => {
    if (!shouldReduce) {
      const textTimer = setTimeout(() => setShowText(true), 1200); // Show logo/text after tiles drop
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) setTimeout(onComplete, 500); // Wait for full assembly to scale out
      }, 2500);
      return () => {
        clearTimeout(textTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [shouldReduce, onComplete]);

  // Generate a triangular grid of tiles (fewer at top, more at bottom)
  const rows = size === "sm" ? 3 : size === "md" ? 4 : 5;
  const tileRows = Array.from({ length: rows }).map((_, i) =>
    Array.from({ length: i + 2 }) // 2 tiles in top row, 3 in next, etc.
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: easings.smooth }}
        >
          {shouldReduce ? (
            // REDUCED MOTION: Simple fade-in of logo
            <motion.div
              variants={defaultVariants.fadeIn}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <Image src="/images/logo/logo.png" alt="Mayr Dach" width={120} height={120} />
              <p className="mt-4 font-script text-3xl text-primary">Endlich ein richtiges Dach!</p>
            </motion.div>
          ) : (
            // FULL ANIMATION: Triangular roof build
            <div className="flex flex-col items-center gap-1">
              {/* Roof Tiles Assembly */}
              <div className="flex flex-col items-center gap-1 mb-8">
                {tileRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {row.map((_, colIndex) => (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-12 h-16 rounded-b-xl shadow-sm"
                        style={{ backgroundColor: brandColors.primary }}
                        initial={{ opacity: 0, y: -50, rotate: -10 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{
                          ...easings.springDrop,
                          delay: (rowIndex * 0.15) + (colIndex * 0.05), // Stagger by row, then by column
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Logo and Slogan Reveal */}
              <AnimatePresence>
                {showText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: easings.smooth }}
                    className="flex flex-col items-center"
                  >
                    <Image src="/images/logo/logo.png" alt="Mayr Dach" width={150} height={150} className="mb-4" />
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="font-script text-4xl text-gray-900 tracking-wide"
                    >
                      Endlich ein richtiges Dach!
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
