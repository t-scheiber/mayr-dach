"use client";

import { motion } from "framer-motion";
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
    <motion.div className="relative overflow-hidden rounded-lg group inline-block w-full">
      {children}
      {/* Light sweep overlay triggered by group-hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r from-transparent ${opacityMap[intensity]} to-transparent -skew-x-[30deg] w-1/2 opacity-0 group-hover:opacity-100 pointer-events-none z-10`}
        initial={{ x: "-150%" }}
        whileHover={{
          x: "300%",
          transition: { duration: 0.8, ease: "easeInOut" },
        }}
      />
    </motion.div>
  );
}
