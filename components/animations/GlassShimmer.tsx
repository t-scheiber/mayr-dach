"use client";

import { m } from "framer-motion";
import { useReducedAnimations } from "./useReducedAnimations";

interface GlassShimmerProps {
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "bold";
}

export function GlassShimmer({ children, intensity = "medium" }: GlassShimmerProps) {
  const { shouldReduce } = useReducedAnimations();

  const opacityMap = {
    subtle: "via-white/20",
    medium: "via-white/40",
    bold: "via-white/60",
  };

  if (shouldReduce) {
    return <div className="active:opacity-80 transition-opacity">{children}</div>;
  }

  return (
    <m.div className="relative overflow-hidden rounded-lg group inline-block w-full">
      {children}
      {/* Light sweep overlay triggered by group-hover */}
      <m.div
        className={`absolute inset-0 bg-linear-to-r from-transparent ${opacityMap[intensity]} to-transparent -skew-x-30 w-1/2 opacity-0 group-hover:opacity-100 pointer-events-none z-10`}
        initial={{ x: "-150%" }}
        whileHover={{
          x: "300%",
          transition: { duration: 0.8, ease: "easeInOut" },
        }}
      />
    </m.div>
  );
}
