import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

// Reading content stays static; these wrappers retain the existing layout.
export function ScrollReveal({ children, className, as: Tag = "div" }: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article";
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}) {
  return <Tag className={className}>{children}</Tag>;
}

export function StaggerContainer({ children, className }: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
}) {
  return <div className={className}>{children}</div>;
}
