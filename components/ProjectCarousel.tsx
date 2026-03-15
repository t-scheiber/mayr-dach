"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [direction, setDirection] = useState(0);

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(i > currentIndex ? 1 : -1);
    setCurrentIndex(i);
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 100 : -100,
        opacity: 0,
        scale: 0.95,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 100 : -100,
        opacity: 0,
        scale: 0.95,
      };
    },
  };

  return (
    <div className="group flex flex-col h-full bg-white text-gray-900 border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image area */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={`/images/projects/${images[currentIndex]}`}
              alt={`${name}${location ? ` - ${location}` : ""}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md backdrop-blur-md z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md backdrop-blur-md z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => goToSlide(i, e)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 border border-white/20">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">{name}</h3>
        {location && (
          <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {location}
          </p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 italic min-h-[16px]">
            {attribution ? attribution : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
