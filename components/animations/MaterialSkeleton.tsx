"use client";

import { m } from "framer-motion";
import { useReducedAnimations } from "./useReducedAnimations";
import { brandColors } from "./variants";

interface MaterialSkeletonProps {
  variant: "tile" | "glass" | "metal";
  width?: string | number;
  height?: string | number;
  rows?: number; // For 'tile' variant only
}

export function MaterialSkeleton({
  variant,
  width = "100%",
  height = "100%",
  rows = 1,
}: MaterialSkeletonProps) {
  const { shouldReduce } = useReducedAnimations();

  // Basic pulse fallback for reduced motion / mobile
  if (shouldReduce) {
    return (
      <div
        className="bg-gray-200 animate-pulse rounded-md"
        style={{
          width,
          height,
          minHeight: typeof height === "number" ? height : 100,
        }}
      />
    );
  }

  // Shimmer animation settings
  const shimmerAnimation = {
    x: ["-100%", "200%"],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear" as const,
    },
  };

  if (variant === "tile") {
    // Row of rounded-bottom rectangles
    return (
      <div
        className="flex flex-col gap-1 overflow-hidden relative"
        style={{ width, height }}
      >
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-1 h-full w-full">
            {Array.from({ length: 6 }).map((_, c) => (
              <div
                key={c}
                className="flex-1 bg-gray-200 rounded-b-lg relative overflow-hidden"
              >
                <m.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent skew-x-12"
                  animate={shimmerAnimation}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "glass") {
    return (
      <div
        className="relative overflow-hidden rounded-lg backdrop-blur-sm border border-blue-100/20"
        style={{ width, height, backgroundColor: brandColors.glassBlue }}
      >
        <m.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-30 w-1/2"
          animate={{
            x: ["-200%", "300%"],
            transition: {
              repeat: Infinity,
              duration: 2,
              ease: "linear",
              delay: 0.5,
            },
          }}
        />
      </div>
    );
  }

  // Metal Variant
  return (
    <div
      className="relative overflow-hidden rounded-md"
      style={{ width, height, background: brandColors.metalSilver }}
    >
      <m.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"
        animate={shimmerAnimation}
      />
    </div>
  );
}
