"use client";

import { m } from "framer-motion";
import { useReducedAnimations } from "./useReducedAnimations";

interface TileFlipProps {
  children: React.ReactNode;
  backContent?: React.ReactNode;
}

export function TileFlip({ children, backContent }: TileFlipProps) {
  const { shouldReduce } = useReducedAnimations();

  if (shouldReduce) {
    return <div className="active:scale-[0.98] transition-transform">{children}</div>;
  }

  return (
    <m.div
      className="relative cursor-pointer [perspective:1000px]"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <m.div
        className="w-full h-full [transform-style:preserve-3d]"
        whileHover={{ rotateY: 15 }} // Subtle 3D flip on hover
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Front face */}
        <div className="w-full h-full [backface-visibility:hidden]">
          {children}
        </div>
        
        {/* Back face (optional, reveals subtly due to the 15deg rotation) */}
        {backContent && (
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gray-900 rounded-xl text-white flex items-center justify-center p-4">
            {backContent}
          </div>
        )}
      </m.div>
    </m.div>
  );
}
