"use client";

import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReducedAnimations } from "./useReducedAnimations";
import { brandColors, easings, defaultVariants } from "./variants";

interface RoofTileLoaderProps {
  onComplete?: () => void;
  size?: "sm" | "md" | "lg";
}

export function RoofTileLoader({ onComplete, size = "md" }: RoofTileLoaderProps) {
  const t = useTranslations("hero");
  const { shouldReduce } = useReducedAnimations();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = shouldReduce ? 800 : 2800;
    const fadeOut = shouldReduce ? 400 : 500;
    const hideTimer = setTimeout(() => setIsVisible(false), duration);
    const completeTimer = onComplete
      ? setTimeout(onComplete, duration + fadeOut)
      : undefined;
    return () => {
      clearTimeout(hideTimer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [shouldReduce, onComplete]);

  const rows = size === "sm" ? 3 : size === "md" ? 4 : 5;
  const tileRows = Array.from({ length: rows }).map((_, i) =>
    Array.from({ length: i + 2 })
  );

  // Calculate when the last tile finishes dropping
  const lastTileDelay = (rows - 1) * 0.15 + (rows) * 0.05;
  // Logo starts fading in as the last tiles are still settling
  const logoDelay = lastTileDelay * 0.6;
  // Slogan follows smoothly right after logo begins
  const sloganDelay = logoDelay + 0.25;

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: easings.smooth }}
        >
          {shouldReduce ? (
            <m.div
              variants={defaultVariants.fadeIn}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <Image src="/images/logo/logo.png" alt="Mayr Dach" width={120} height={120} />
              <p className="mt-4 font-handwriting text-3xl text-primary">{t("slogan")}</p>
            </m.div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              {/* Roof Tiles Assembly */}
              <div className="flex flex-col items-center gap-1 mb-8">
                {tileRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {row.map((_, colIndex) => (
                      <m.div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-8 h-12 sm:w-12 sm:h-16 rounded-b-xl shadow-sm"
                        style={{ backgroundColor: brandColors.primary }}
                        initial={{ opacity: 0, y: -50, rotate: -10 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{
                          ...easings.springDrop,
                          delay: (rowIndex * 0.15) + (colIndex * 0.05),
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Logo — overlaps with last tiles settling */}
              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: logoDelay,
                  duration: 0.7,
                  ease: easings.smooth,
                }}
                className="flex flex-col items-center"
              >
                <Image src="/images/logo/logo.png" alt="Mayr Dach" width={150} height={150} className="mb-4" />
              </m.div>

              {/* Slogan — flows in right after logo starts */}
              <m.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: sloganDelay,
                  duration: 0.6,
                  ease: easings.smooth,
                }}
                className="font-handwriting text-2xl sm:text-4xl text-gray-900 tracking-wide"
              >
                {t("slogan")}
              </m.p>
            </div>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
