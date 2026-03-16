"use client";

import { m, type Variant } from "framer-motion";
import { useReducedAnimations } from "./useReducedAnimations";
import { durations, easings } from "./variants";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 30 },
  right: { x: -30 },
  none: {},
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = durations.normal,
  distance,
  once = true,
  className,
  as = "div",
}: ScrollRevealProps) {
  const { shouldReduce } = useReducedAnimations();

  if (shouldReduce) {
    const Tag = as === "div" ? "div" : as === "section" ? "section" : as === "li" ? "li" : "article";
    return <Tag className={className}>{children}</Tag>;
  }

  const offset = { ...offsets[direction] };
  if (distance !== undefined) {
    if (offset.y !== undefined) offset.y = offset.y > 0 ? distance : -distance;
    if (offset.x !== undefined) offset.x = offset.x > 0 ? distance : -distance;
  }

  const hidden: Variant = { opacity: 0, ...offset };
  const visible: Variant = {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration, delay, ease: easings.smooth },
  };

  const Component = m[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      variants={{ hidden, visible }}
    >
      {children}
    </Component>
  );
}

/* Wrapper that staggers its children */
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerContainerProps) {
  const { shouldReduce } = useReducedAnimations();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}

/* Individual child for use inside StaggerContainer */
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
}

export function StaggerItem({ children, className, direction = "up" }: StaggerItemProps) {
  const offset = offsets[direction];

  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: durations.normal, ease: easings.smooth },
        },
      }}
    >
      {children}
    </m.div>
  );
}
