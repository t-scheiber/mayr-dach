// components/animations/variants.ts
export const brandColors = {
  primary: "#8b1e23", // Dachziegel rust/red
  accent: "#c8502d", // Accent color
  dark: "#2a2a2a", // Dark background
  gray: "#4b5563",
  glassBlue: "rgba(59, 130, 246, 0.15)", // Translucent blue for glass
  metalSilver: "linear-gradient(90deg, #d1d5db 0%, #f3f4f6 50%, #d1d5db 100%)", // Metallic sweep for Spenglerei
  facadeWarm: "linear-gradient(180deg, #e8d5b7 0%, #d4a574 50%, #e8d5b7 100%)", // Warm stone/plaster
  sealingDark: "linear-gradient(90deg, #374151 0%, #4b5563 50%, #374151 100%)", // Dark bitumen
  greenRoof: "linear-gradient(180deg, #86efac 0%, #4ade80 30%, #166534 100%)", // Green gradient
};

export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  splash: 2.5,
};

export const easings = {
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // Custom ease-in-out
  springDrop: { type: "spring" as const, bounce: 0.4, duration: 0.8 },
  linear: "linear",
};

export const defaultVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: durations.normal, ease: easings.smooth } },
  },
  fadeOut: {
    visible: { opacity: 1 },
    hidden: { opacity: 0, transition: { duration: durations.normal, ease: easings.smooth } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: durations.normal, ease: easings.smooth } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: durations.normal, ease: easings.smooth } },
  },
};
