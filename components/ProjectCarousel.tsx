"use client";

import { useState, useEffect, useCallback, useReducer, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";

function ProjectName({ name, websiteUrl, className }: { name: string; websiteUrl?: string; className: string }) {
  return websiteUrl ? (
    <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
      className={className + " inline-flex items-center gap-1.5 hover:underline"}
      onClick={event => event.stopPropagation()}>
      {name}<ExternalLink size={14} className="shrink-0 opacity-60" />
    </a>
  ) : <span className={className}>{name}</span>;
}

interface GalleryState {
  index: number;
  shown: number;
  visited: number[];
  loaded: number[];
  instant: boolean;
}
type GalleryAction =
  | { type: "reset"; index: number }
  | { type: "select"; index: number; instant: boolean }
  | { type: "step"; delta: number; count: number; instant: boolean }
  | { type: "loaded"; index: number };

function initialGallery(index: number): GalleryState {
  return { index, shown: index, visited: [index], loaded: [], instant: false };
}

function galleryReducer(state: GalleryState, action: GalleryAction): GalleryState {
  if (action.type === "reset") return initialGallery(action.index);
  if (action.type === "loaded") {
    return {
      ...state,
      loaded: state.loaded.includes(action.index) ? state.loaded : [...state.loaded, action.index],
      shown: state.index === action.index ? action.index : state.shown,
    };
  }
  const index = action.type === "step"
    ? (state.index + action.delta + action.count) % action.count
    : action.index;
  return {
    ...state, index, instant: action.instant,
    shown: state.loaded.includes(index) ? index : state.shown,
    visited: state.visited.includes(index) ? state.visited : [...state.visited, index],
  };
}

function GalleryImages({ images, name, location, state, dispatch, lightbox = false }: {
  images: string[];
  name: string;
  location?: string;
  state: GalleryState;
  dispatch: React.Dispatch<GalleryAction>;
  lightbox?: boolean;
}) {
  return state.visited.map(index => (
    <div key={index} className="gallery-image absolute inset-0 pointer-events-none"
      data-current={state.shown === index} data-instant={state.instant}
      aria-hidden={state.shown !== index}>
      <Image src={"/images/projects/" + images[index]}
        alt={name + (location ? " - " + location : "")}
        fill className={lightbox ? "object-contain" : "object-cover"}
        sizes={lightbox ? "(max-width: 1280px) 100vw, 1280px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        loading={lightbox || index !== 0 ? "eager" : "lazy"}
        onLoad={() => dispatch({ type: "loaded", index })}
      />
    </div>
  ));
}

const subscribeMounted = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

function ProjectLightbox({ images, name, location, attribution, websiteUrl, isOpen, state, dispatch, onClose }: {
  images: string[];
  name: string;
  location?: string;
  attribution?: string;
  websiteUrl?: string;
  isOpen: boolean;
  state: GalleryState;
  dispatch: React.Dispatch<GalleryAction>;
  onClose: () => void;
}) {
  const mounted = useSyncExternalStore(subscribeMounted, getMounted, getServerMounted);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        dispatch({ type: "step", delta: event.key === "ArrowLeft" ? -1 : 1, count: images.length, instant: true });
      }
      if (event.key === "Tab") {
        const controls = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? [])];
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      document.removeEventListener("keydown", keydown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen, images.length, dispatch, onClose]);

  if (!mounted) return null;
  return createPortal(
    <div ref={dialogRef} role="dialog" aria-modal={isOpen ? true : undefined} aria-label={name}
      aria-hidden={!isOpen} inert={!isOpen} data-open={isOpen}
      className="project-lightbox fixed inset-0 z-9999 flex items-center justify-center bg-black/90"
      onClick={onClose}>
      <button ref={closeRef} onClick={onClose}
        className="motion-press absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
        aria-label="Close lightbox"><X size={24} /></button>
      <div className="relative flex flex-col items-center max-w-5xl w-full mx-4"
        onClick={event => event.stopPropagation()}>
        <div className="relative w-full aspect-auto overflow-hidden rounded-lg">
          <div className="relative w-full aspect-4/3">
            <GalleryImages images={images} name={name} location={location} state={state} dispatch={dispatch} lightbox />
          </div>
          {images.length > 1 && <>
            <button onClick={event => dispatch({ type: "step", delta: -1, count: images.length, instant: event.detail === 0 })}
              className="motion-press absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md backdrop-blur-md z-10"
              aria-label="Previous image"><ChevronLeft size={24} /></button>
            <button onClick={event => dispatch({ type: "step", delta: 1, count: images.length, instant: event.detail === 0 })}
              className="motion-press absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md backdrop-blur-md z-10"
              aria-label="Next image"><ChevronRight size={24} /></button>
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm z-10 border border-white/20">
              {state.index + 1} / {images.length}
            </div>
          </>}
        </div>
        {images.length > 1 && <div className="flex gap-2 mt-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
          {images.map((image, index) => (
            <button key={image} onClick={event => dispatch({ type: "select", index, instant: event.detail === 0 })}
              className="motion-press w-5 h-2.5 flex items-center justify-center"
              aria-label={"Go to image " + (index + 1)}>
              <span className={"gallery-dot block w-2.5 h-2.5 rounded-full " + (index === state.index ? "bg-white" : "bg-white/40 hover:bg-white/70")}
                aria-current={index === state.index} />
            </button>
          ))}
        </div>}
        <div className="mt-4 text-center">
          <h3 className="text-white text-xl font-bold"><ProjectName name={name} websiteUrl={websiteUrl} className="text-white" /></h3>
          {location && <p className="text-white/70 text-sm mt-1 flex items-center justify-center gap-1.5">
            <LocationIcon />{location}
          </p>}
          {attribution && <p className="text-white/50 text-xs italic mt-2">{attribution}</p>}
        </div>
      </div>
    </div>, document.body
  );
}

function LocationIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>;
}

export default function ProjectCarousel({ name, location, images, attribution, websiteUrl }: {
  name: string;
  location?: string;
  images: string[];
  attribution?: string;
  websiteUrl?: string;
}) {
  const [state, dispatch] = useReducer(galleryReducer, 0, initialGallery);
  const [lightboxState, dispatchLightbox] = useReducer(galleryReducer, 0, initialGallery);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const openLightbox = () => {
    dispatchLightbox({ type: "reset", index: state.index });
    setHasOpened(true);
    setLightboxOpen(true);
  };

  return <>
    <div className="project-card motion-card group flex flex-col h-full bg-white text-gray-900 border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer"
      onClick={openLightbox} role="button" tabIndex={0}
      onKeyDown={event => {
        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault(); openLightbox();
        }
      }}>
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden shrink-0">
        <GalleryImages images={images} name={name} location={location} state={state} dispatch={dispatch} />
        {images.length > 1 && <>
          <button onClick={event => { event.stopPropagation(); dispatch({ type: "step", delta: -1, count: images.length, instant: event.detail === 0 }); }}
            className="gallery-arrow motion-press absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md backdrop-blur-md z-10"
            aria-label="Previous image"><ChevronLeft size={20} /></button>
          <button onClick={event => { event.stopPropagation(); dispatch({ type: "step", delta: 1, count: images.length, instant: event.detail === 0 }); }}
            className="gallery-arrow motion-press absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md backdrop-blur-md z-10"
            aria-label="Next image"><ChevronRight size={20} /></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
            {images.map((image, index) => (
              <button key={image} onClick={event => { event.stopPropagation(); dispatch({ type: "select", index, instant: event.detail === 0 }); }}
                className={"motion-press w-6 h-6 rounded-full flex items-center justify-center " + (index === state.index ? "bg-white/30" : "bg-transparent hover:bg-white/20")}
                aria-label={"Go to image " + (index + 1)}>
                <span className={"gallery-dot block w-2 h-2 rounded-full " + (index === state.index ? "bg-white" : "bg-white/50")} aria-current={index === state.index} />
              </button>
            ))}
          </div>
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 border border-white/20">
            {state.index + 1} / {images.length}
          </div>
        </>}
      </div>
      <div className="p-6 flex flex-col grow bg-white">
        <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight"><ProjectName name={name} websiteUrl={websiteUrl} className="text-gray-900" /></h3>
        {location && <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-1.5"><LocationIcon />{location}</p>}
        <div className="mt-auto pt-4 border-t border-gray-100"><p className="text-xs text-gray-500 italic min-h-[16px]">{attribution || ""}</p></div>
      </div>
    </div>
    {hasOpened && <ProjectLightbox images={images} name={name} location={location}
      attribution={attribution} websiteUrl={websiteUrl} isOpen={lightboxOpen} state={lightboxState} dispatch={dispatchLightbox} onClose={closeLightbox} />}
  </>;
}
