"use client";

import { useReducer, useEffect, useSyncExternalStore } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  charSpeed?: number;
  onStart?: () => void;
}

interface State {
  started: boolean;
  displayCount: number;
}

type Action = { type: "START" } | { type: "TICK" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { ...state, started: true };
    case "TICK":
      return { ...state, displayCount: state.displayCount + 1 };
    default:
      return state;
  }
}

export default function TypewriterText({
  text,
  delay = 800,
  charSpeed = 80,
  onStart,
}: TypewriterTextProps) {
  const [state, dispatch] = useReducer(reducer, { started: false, displayCount: 0 });
  const { started, displayCount } = state;

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "START" });
      onStart?.();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, onStart]);

  useEffect(() => {
    if (!started || displayCount >= text.length) return;
    const timer = setTimeout(() => dispatch({ type: "TICK" }), charSpeed);
    return () => clearTimeout(timer);
  }, [started, displayCount, text.length, charSpeed]);

  // SSR + before hydration: show full text (for crawlers & no-JS)
  if (!mounted) {
    return <>{text}</>;
  }

  // After hydration: typewriter animation
  return (
    <>
      {/* Screen-reader accessible full text */}
      <span className="sr-only">{text}</span>
      {/* Visible animated text */}
      <span aria-hidden="true">
        {text.slice(0, displayCount)}
        {started && displayCount < text.length && (
          <span className="animate-pulse">|</span>
        )}
      </span>
    </>
  );
}
