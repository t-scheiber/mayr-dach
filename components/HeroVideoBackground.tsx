"use client";

import { useEffect, useRef } from "react";

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let started = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = () => { clearTimeout(timer); video.pause(); };
    const limit = () => { timer ??= setTimeout(stop, 4000); };
    const updatePreference = () => {
      if (preference.matches) {
        stop();
        video.removeAttribute("src");
        video.load();
      } else if (!started && !document.hidden) {
        started = true;
        video.src = "/hero-videos/ai_video_10.mp4";
        video.play().catch(() => {});
      }
    };
    const onVisibility = () => { if (document.hidden) stop(); };
    video.addEventListener("playing", limit);
    video.addEventListener("ended", stop);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", onVisibility);
    updatePreference();
    return () => {
      stop();
      video.removeEventListener("playing", limit);
      video.removeEventListener("ended", stop);
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <video ref={videoRef} muted playsInline preload="none"
      poster="/images/hero/video-poster.jpg"
      className="absolute inset-0 w-full h-full object-cover"
      aria-hidden="true"
    />
  );
}
