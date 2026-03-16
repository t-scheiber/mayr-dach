"use client";

import { m } from "framer-motion";
import { useReducedAnimations } from "./useReducedAnimations";
import { brandColors } from "./variants";

type Variant = "tile" | "glass" | "metal" | "facade" | "sealing" | "greenRoof";

interface MaterialSkeletonProps {
  variant: Variant;
  width?: string | number;
  height?: string | number;
  rows?: number;
}

export function MaterialSkeleton({
  variant,
  width = "100%",
  height = "100%",
  rows = 1,
}: MaterialSkeletonProps) {
  const { shouldReduce } = useReducedAnimations();

  if (shouldReduce) {
    return (
      <div
        className="bg-gray-200 animate-pulse rounded-md"
        style={{ width, height, minHeight: typeof height === "number" ? height : 100 }}
      />
    );
  }

  const shimmerAnimation = {
    x: ["-100%", "200%"],
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" as const },
  };

  if (variant === "tile") {
    return (
      <div className="flex flex-col gap-1 overflow-hidden relative" style={{ width, height }}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`row-${r}`} className="flex gap-1 h-full w-full">
            {Array.from({ length: 6 }).map((_, c) => (
              <div key={`tile-${r}-${c}`} className="flex-1 bg-gray-200 rounded-b-lg relative overflow-hidden">
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
          animate={{ x: ["-200%", "300%"], transition: { repeat: Infinity, duration: 2, ease: "linear", delay: 0.5 } }}
        />
        {/* Glass reflection lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-white/60" />
          <div className="absolute top-2/4 left-0 right-0 h-px bg-white/40" />
        </div>
      </div>
    );
  }

  if (variant === "facade") {
    return (
      <div
        className="relative overflow-hidden rounded-lg"
        style={{ width, height, background: brandColors.facadeWarm }}
      >
        {/* Brick/plaster pattern */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-px opacity-20">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={`brick-${i}`} className="bg-white/30 rounded-sm" />
          ))}
        </div>
        <m.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "200%"], transition: { repeat: Infinity, duration: 2.5, ease: "linear" } }}
        />
      </div>
    );
  }

  if (variant === "sealing") {
    return (
      <div
        className="relative overflow-hidden rounded-lg"
        style={{ width, height, background: brandColors.sealingDark }}
      >
        {/* Bitumen texture lines */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`seal-${i}`}
              className="absolute left-0 right-0 h-px bg-gray-500"
              style={{ top: `${20 + i * 15}%` }}
            />
          ))}
        </div>
        <m.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-gray-400/20 to-transparent"
          animate={shimmerAnimation}
        />
        {/* Water droplet shimmer */}
        <m.div
          className="absolute w-3 h-3 rounded-full bg-blue-400/30 blur-sm"
          animate={{ y: ["0%", "300%"], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeIn", delay: 0.8 }}
          style={{ left: "30%", top: "10%" }}
        />
      </div>
    );
  }

  if (variant === "greenRoof") {
    return (
      <div
        className="relative overflow-hidden rounded-lg"
        style={{ width, height, background: brandColors.greenRoof }}
      >
        {/* Grass/plant texture */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 opacity-30">
          {Array.from({ length: 8 }).map((_, i) => (
            <m.div
              key={`grass-${i}`}
              className="absolute bottom-0 w-1 bg-green-800 rounded-t-full origin-bottom"
              style={{ left: `${10 + i * 11}%`, height: `${40 + (i % 3) * 15}%` }}
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut" }}
            />
          ))}
        </div>
        <m.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "200%"], transition: { repeat: Infinity, duration: 3, ease: "linear" } }}
        />
      </div>
    );
  }

  // Metal variant (default)
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
