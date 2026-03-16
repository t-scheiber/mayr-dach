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
      className={`inline-block font-script font-bold tracking-wide text-white leading-[1.1] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] whitespace-nowrap transition-all duration-1000 transform ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)", maxWidth: "90vw" }}
    >
      <TypewriterText text={text} delay={delay} charSpeed={charSpeed} onStart={() => setVisible(true)} />
    </h1>
  );
}
