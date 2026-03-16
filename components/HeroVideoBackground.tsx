"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const videos = [
  "/hero-videos/ai_video_01.mp4",
  "/hero-videos/ai_video_02.mp4",
  "/hero-videos/ai_video_03.mp4",
  "/hero-videos/ai_video_04.mp4",
  "/hero-videos/ai_video_05.mp4",
  "/hero-videos/ai_video_06.mp4",
  "/hero-videos/ai_video_07.mp4",
  "/hero-videos/ai_video_08.mp4",
  "/hero-videos/ai_video_09.mp4",
  "/hero-videos/ai_video_10.mp4",
];

function pickRandom(exclude: number) {
  let next;
  do {
    next = Math.floor(Math.random() * videos.length);
  } while (next === exclude && videos.length > 1);
  return next;
}

export default function HeroVideoBackground() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentIndex(Math.floor(Math.random() * videos.length));
    setMounted(true);
  }, []);

  const handleEnded = useCallback(() => {
    setCurrentIndex((prev) => pickRandom(prev));
  }, []);

  // Ensure autoplay works after source change
  useEffect(() => {
    if (mounted && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex, mounted]);

  if (!mounted) {
    return <div className="absolute inset-0 bg-neutral-900 w-full h-full" />;
  }

  return (
    <video
      ref={videoRef}
      key={currentIndex}
      autoPlay
      muted
      playsInline
      onEnded={handleEnded}
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src={videos[currentIndex]} type="video/mp4" />
    </video>
  );
}
