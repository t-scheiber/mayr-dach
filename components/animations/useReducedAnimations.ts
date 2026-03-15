"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export function useReducedAnimations() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [shouldReduce, setShouldReduce] = useState(true); // Default to true for SSR safety to avoid hydration flashes

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Reduce motion if user explicitly prefers it OR if on a mobile device (for performance)
      setShouldReduce(prefersReducedMotion === true || mobile);
    };

    // Initial check on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [prefersReducedMotion]);

  return { shouldReduce, isMobile, prefersReducedMotion: prefersReducedMotion === true };
}
