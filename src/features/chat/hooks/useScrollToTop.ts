"use client";

import { useEffect, useState, type RefObject } from "react";

interface UseScrollToTopOptions {
  threshold?: number; // pixels from top to consider "at top"
  enabled?: boolean;
}

/**
 * Hook to detect when user scrolls to the top of a scrollable element.
 * Useful for infinite scroll to load older messages.
 *
 * @param ref - Reference to the scrollable element
 * @param options - Configuration options
 * @returns true if scrolled to top within threshold
 *
 * @example
 * const scrollRef = useRef<HTMLDivElement>(null)
 * const isAtTop = useScrollToTop(scrollRef, { threshold: 100 })
 *
 * useEffect(() => {
 *   if (isAtTop && hasNextPage) {
 *     fetchNextPage()
 *   }
 * }, [isAtTop, hasNextPage])
 */
export function useScrollToTop(
  ref: RefObject<HTMLDivElement | null>,
  { threshold = 100, enabled = true }: UseScrollToTopOptions = {}
): boolean {
  const [isAtTop, setIsAtTop] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const handleScroll = () => {
      setIsAtTop(element.scrollTop <= threshold);
    };

    // Add scroll listener with passive flag for performance
    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [ref, threshold, enabled]);

  return isAtTop;
}