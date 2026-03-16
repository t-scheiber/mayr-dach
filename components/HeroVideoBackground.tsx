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

export default function HeroVideoBackground({ randomize = false }: { randomize?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    randomize ? Math.floor(Math.random() * videos.length) : 0
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = useCallback(() => {
    const nextIndex = pickRandom(currentIndex);
    setCurrentIndex(nextIndex);

    if (videoRef.current) {
      videoRef.current.src = videos[nextIndex];
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  // Keep the handler fresh on the video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [handleEnded]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
      src={videos[currentIndex]}
    />
  );
}
