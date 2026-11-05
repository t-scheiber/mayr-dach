"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Start progress bar on internal link click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement).closest(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.download) return;
      if (anchor.href.startsWith("tel:") || anchor.href.startsWith("mailto:"))
        return;

      try {
        const url = new URL(anchor.href, location.origin);
        if (
          url.origin === location.origin &&
          url.pathname !== location.pathname
        ) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setVisible(true);
          setWidth(15);
          intervalRef.current = setInterval(() => {
            setWidth((w) => (w >= 85 ? w : w + (85 - w) * 0.06));
          }, 250);
        }
      } catch {
        /* ignore malformed URLs */
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Complete progress bar when pathname changes. State updates happen in
  // timer callbacks rather than synchronously in the effect body to comply
  // with react-hooks/set-state-in-effect.
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (visible) {
        const complete = setTimeout(() => setWidth(100), 0);
        const timer = setTimeout(() => {
          setVisible(false);
          setWidth(0);
        }, 400);
        return () => {
          clearTimeout(complete);
          clearTimeout(timer);
        };
      }
    }
  }, [pathname, visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-200 h-[3px] pointer-events-none">
      <div
        className="navigation-progress h-full bg-primary rounded-r-full"
        style={{
          transform: `scaleX(${width / 100})`,
          opacity: width === 100 ? 0 : 1,
          transitionDelay: width === 100 ? "0s, var(--dur-base)" : "0s",
          boxShadow: "0 0 8px var(--primary)",
        }}
      />
    </div>
  );
}
