"use client";

import { useState, useEffect, useCallback, useReducer, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared                                                            */
/* ------------------------------------------------------------------ */

function ProjectName({ name, websiteUrl, className }: { name: string; websiteUrl?: string; className: string }) {
  if (websiteUrl) {
    return (
      <a
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} inline-flex items-center gap-1.5 hover:underline`}
        onClick={(e) => e.stopPropagation()}
      >
        {name}
        <ExternalLink size={14} className="shrink-0 opacity-60" />
      </a>
    );
  }
  return <span className={className}>{name}</span>;
}

/* ------------------------------------------------------------------ */
/*  ProjectLightbox                                                   */
/* ------------------------------------------------------------------ */

interface ProjectLightboxProps {
  images: string[];
  name: string;
  location?: string;
  attribution?: string;
  websiteUrl?: string;
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
}

const lightboxVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

function ProjectLightbox({
  images,
  name,
  location,
  attribution,
  websiteUrl,
  isOpen,
  initialIndex,
  onClose,
}: ProjectLightboxProps) {
  const [lightboxIndex, setLightboxIndex] = useState(initialIndex);
  const [lightboxDirection, setLightboxDirection] = useState(0);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Reset index whenever the lightbox opens with a new initialIndex
  useEffect(() => {
    if (isOpen) {
      setLightboxIndex(initialIndex);
      setLightboxDirection(0);
    }
  }, [isOpen, initialIndex]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
    setLightboxDirection(1);
  }, [images.length]);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    setLightboxDirection(-1);
  }, [images.length]);

  const lightboxGoToSlide = (i: number) => {
    setLightboxDirection(i > lightboxIndex ? 1 : -1);
    setLightboxIndex(i);
  };

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          lightboxPrev();
          break;
        case "ArrowRight":
          lightboxNext();
          break;
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, lightboxPrev, lightboxNext]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Lightbox content */}
          <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex flex-col items-center max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image container */}
            <div className="relative w-full aspect-auto overflow-hidden rounded-lg">
              <div className="relative w-full aspect-4/3">
                <AnimatePresence initial={false} custom={lightboxDirection}>
                  <m.div
                    key={lightboxIndex}
                    custom={lightboxDirection}
                    variants={lightboxVariants}
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
                      src={`/images/projects/${images[lightboxIndex]}`}
                      alt={`${name}${location ? ` - ${location}` : ""}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      priority
                    />
                  </m.div>
                </AnimatePresence>
              </div>

              {/* Lightbox navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => lightboxPrev()}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => lightboxNext()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm z-10 border border-white/20">
                  {lightboxIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Lightbox dots */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => lightboxGoToSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === lightboxIndex
                        ? "bg-white w-5"
                        : "bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Project info */}
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-bold">
                <ProjectName name={name} websiteUrl={websiteUrl} className="text-white" />
              </h3>
              {location && (
                <p className="text-white/70 text-sm mt-1 flex items-center justify-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-70"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {location}
                </p>
              )}
              {attribution && (
                <p className="text-white/50 text-xs italic mt-2">
                  {attribution}
                </p>
              )}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/*  ProjectCarousel                                                   */
/* ------------------------------------------------------------------ */

interface ProjectCarouselProps {
  name: string;
  location?: string;
  images: string[];
  attribution?: string;
  websiteUrl?: string;
}

interface CarouselState {
  currentIndex: number;
  direction: number;
  lightboxOpen: boolean;
  hovered: boolean;
}

type CarouselAction =
  | { type: "GO_TO"; index: number; direction: number }
  | { type: "OPEN_LIGHTBOX" }
  | { type: "CLOSE_LIGHTBOX" }
  | { type: "SET_HOVERED"; hovered: boolean };

function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case "GO_TO":
      return { ...state, currentIndex: action.index, direction: action.direction };
    case "OPEN_LIGHTBOX":
      return { ...state, lightboxOpen: true };
    case "CLOSE_LIGHTBOX":
      return { ...state, lightboxOpen: false };
    case "SET_HOVERED":
      return { ...state, hovered: action.hovered };
    default:
      return state;
  }
}

const carouselInitialState: CarouselState = {
  currentIndex: 0,
  direction: 0,
  lightboxOpen: false,
  hovered: false,
};

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function ProjectCarousel({
  name,
  location,
  images,
  attribution,
  websiteUrl,
}: ProjectCarouselProps) {
  const [state, dispatch] = useReducer(carouselReducer, carouselInitialState);
  const { currentIndex, direction, lightboxOpen, hovered } = state;

  // Auto-rotate card carousel every 4 seconds (pause on hover or lightbox)
  useEffect(() => {
    if (images.length <= 1 || hovered || lightboxOpen) return;
    const timer = setInterval(() => {
      dispatch({ type: "GO_TO", index: (currentIndex + 1) % images.length, direction: 1 });
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length, hovered, lightboxOpen, currentIndex]);

  // Card carousel navigation
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "GO_TO", index: (currentIndex + 1) % images.length, direction: 1 });
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "GO_TO", index: (currentIndex - 1 + images.length) % images.length, direction: -1 });
  };

  const goToSlide = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "GO_TO", index: i, direction: i > currentIndex ? 1 : -1 });
  };

  const openLightbox = () => dispatch({ type: "OPEN_LIGHTBOX" });

  const closeLightbox = useCallback(() => {
    dispatch({ type: "CLOSE_LIGHTBOX" });
  }, []);

  return (
    <>
      <div
        suppressHydrationWarning
        className="group flex flex-col h-full bg-white text-gray-900 border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]"
        onClick={openLightbox}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(); } }}
        role="button"
        tabIndex={0}
        onMouseEnter={() => dispatch({ type: "SET_HOVERED", hovered: true })}
        onMouseLeave={() => dispatch({ type: "SET_HOVERED", hovered: false })}
      >
        {/* Image area */}
        <div className="relative aspect-4/3 bg-gray-100 overflow-hidden shrink-0">
          <AnimatePresence initial={false} custom={direction}>
            <m.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
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
            </m.div>
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
                {images.map((img, i) => (
                  <button
                    key={img}
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
        <div className="p-6 flex flex-col grow bg-white">
          <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">
            <ProjectName name={name} websiteUrl={websiteUrl} className="text-gray-900" />
          </h3>
          {location && (
            <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
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

      {/* Lightbox */}
      <ProjectLightbox
        images={images}
        name={name}
        location={location}
        attribution={attribution}
        websiteUrl={websiteUrl}
        isOpen={lightboxOpen}
        initialIndex={currentIndex}
        onClose={closeLightbox}
      />
    </>
  );
}
