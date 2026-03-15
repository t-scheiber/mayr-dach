"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedAnimations } from "./useReducedAnimations";

export function BlueprintTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { shouldReduce } = useReducedAnimations();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 0, y: shouldReduce ? 0 : 10 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
          exit: { opacity: 0, y: shouldReduce ? 0 : -10, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
        }}
        className="relative w-full h-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
