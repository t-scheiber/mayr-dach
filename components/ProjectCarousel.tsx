"use client";

import { useState } from "react";
import Image from "next/image";

interface ProjectCarouselProps {
  name: string;
  location?: string;
  images: string[];
  attribution?: string;
}

export default function ProjectCarousel({
  name,
  location,
  images,
  attribution,
}: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {/* Image area */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <Image
          src={`/images/projects/${images[currentIndex]}`}
          alt={`${name}${location ? ` - ${location}` : ""}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Navigation arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm md:text-base">{name}</h3>
        {location && (
          <p className="text-xs text-gray-500 mt-0.5">{location}</p>
        )}
        {attribution && (
          <p className="text-xs text-gray-400 mt-1 italic">{attribution}</p>
        )}
      </div>
    </div>
  );
}
