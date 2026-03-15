"use client";

import { useState, useEffect, useRef } from "react";

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

export default function HeroVideoBackground() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Pick a random initial video on mount
    setCurrentVideoIndex(Math.floor(Math.random() * videos.length));
  }, []);

  const handleVideoEnded = () => {
    // When the video ends, pick another random video
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * videos.length);
    } while (nextIndex === currentVideoIndex && videos.length > 1); // Avoid playing the same video twice in a row if possible
    
    setCurrentVideoIndex(nextIndex);
  };

  if (currentVideoIndex === null) {
    // Prevent rendering until we have randomly selected on the client
    // This avoids hydration mismatch errors
    return (
       <div className="absolute inset-0 bg-neutral-900 w-full h-full"></div>
    );
  }

  return (
    <video
      ref={videoRef}
      key={videos[currentVideoIndex]} // Forces element to remount/reload on source change
      autoPlay
      muted
      playsInline
      onEnded={handleVideoEnded}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
    >
      <source src={videos[currentVideoIndex]} type="video/mp4" />
    </video>
  );
}
