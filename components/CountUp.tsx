"use client";

import { useEffect, useReducer, useRef } from "react";

interface CountUpProps {
  value: string; // e.g. "49", "50+", "100+"
  duration?: number;
}

export default function CountUp({ value, duration = 2000 }: CountUpProps) {
  const num = parseInt(value, 10);
  const suffix = value.replace(/\d/g, ""); // e.g. "+"
  const [count, tick] = useReducer((c: number) => Math.min(c + 1, num), 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = num;
          const stepDuration = duration / steps;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            tick();
            if (step >= steps) clearInterval(timer);
          }, stepDuration);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [num, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
