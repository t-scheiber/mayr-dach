"use client";

import { useState } from "react";
import TypewriterText from "./TypewriterText";

interface HeroSloganProps {
  text: string;
  delay?: number;
  charSpeed?: number;
}

export default function HeroSlogan({ text, delay = 3000, charSpeed = 120 }: HeroSloganProps) {
  const [visible, setVisible] = useState(false);

  return (
    <h1
      className={`inline-block font-script tracking-wide text-white/65 leading-[1.3] px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 rounded-xl sm:rounded-2xl bg-primary-dark/20 backdrop-blur-md border border-primary-dark/25 shadow-[0_8px_32px_rgba(100,11,14,0.3)] drop-shadow-2xl whitespace-nowrap transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ fontSize: "clamp(1.75rem, 5vw, 7rem)" }}
    >
      <TypewriterText text={text} delay={delay} charSpeed={charSpeed} onStart={() => setVisible(true)} />
    </h1>
  );
}
