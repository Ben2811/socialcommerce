"use client";

import { useEffect, useState, type RefObject } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  enabled?: boolean;
}

export function useIntersectionObserver(
  targetRef: RefObject<Element | null>,
  options: UseIntersectionObserverOptions = {},
) {
  const { enabled = true, root = null, rootMargin = "0px", threshold = 0 } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, targetRef, root, rootMargin, threshold]);

  return isIntersecting;
}