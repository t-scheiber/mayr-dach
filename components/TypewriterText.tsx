"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  charSpeed?: number;
  onStart?: () => void;
}

export default function TypewriterText({
  text,
  delay = 800,
  charSpeed = 80,
  onStart,
}: TypewriterTextProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setStarted(true);
      onStart?.();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started || displayCount >= text.length) return;
    const timer = setTimeout(() => setDisplayCount((c) => c + 1), charSpeed);
    return () => clearTimeout(timer);
  }, [started, displayCount, text.length, charSpeed]);

  // SSR + before hydration: show full text (for crawlers & no-JS)
  if (!mounted) {
    return <>{text}</>;
  }

  // After hydration: typewriter animation
  return (
    <>
      {/* Screen-reader accessible full text */}
      <span className="sr-only">{text}</span>
      {/* Visible animated text */}
      <span aria-hidden="true">
        {text.slice(0, displayCount)}
        {started && displayCount < text.length && (
          <span className="animate-pulse">|</span>
        )}
      </span>
    </>
  );
}
