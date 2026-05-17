"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

export type PageScrollMetrics = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  maxScroll: number;
  scrollPercent: number;
};

type UsePageScrollMetricsOptions = Readonly<{
  scrollElementRef: RefObject<HTMLElement | null>;
  starsScrollSpeed?: number;
}>;

const defaultStarsScrollSpeed = 0.2;
const starsBackgroundStorageKey = "hightechsheep-stars-bg-y";

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function readStoredStarsBackgroundY() {
  if (typeof window === "undefined") {
    return 0;
  }

  const storedValue = window.sessionStorage.getItem(starsBackgroundStorageKey);
  const parsedValue = storedValue ? Number(storedValue) : 0;

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function getPageScrollMetrics(
  scrollElement: HTMLElement,
): PageScrollMetrics {
  const scrollTop = scrollElement.scrollTop;
  const scrollHeight = scrollElement.scrollHeight;
  const clientHeight = scrollElement.clientHeight;
  const maxScroll = Math.max(scrollHeight - clientHeight, 0);

  const scrollPercent =
    maxScroll > 0 ? clampPercent((scrollTop / maxScroll) * 100) : 0;

  return {
    scrollTop,
    scrollHeight,
    clientHeight,
    maxScroll,
    scrollPercent,
  };
}

export function usePageScrollMetrics({
  scrollElementRef,
  starsScrollSpeed = defaultStarsScrollSpeed,
}: UsePageScrollMetricsOptions) {
  const starsBackgroundYRef = useRef(0);

  const setStarsBackgroundY = useCallback((nextBackgroundY: number) => {
    starsBackgroundYRef.current = nextBackgroundY;

    document.documentElement.style.setProperty(
      "--stars-bg-y",
      `${nextBackgroundY}px`,
    );

    window.sessionStorage.setItem(
      starsBackgroundStorageKey,
      String(nextBackgroundY),
    );
  }, []);

  const updateScrollMetrics = useCallback(
    (scrollElement?: HTMLElement | null) => {
      const target = scrollElement ?? scrollElementRef.current;

      if (!target) {
        return null;
      }

      const metrics = getPageScrollMetrics(target);
      const rootStyle = document.documentElement.style;

      rootStyle.setProperty("--page-scroll-top", `${metrics.scrollTop}px`);
      rootStyle.setProperty("--page-scroll-percent", `${metrics.scrollPercent}`);

      return metrics;
    },
    [scrollElementRef],
  );

  const updateStarsBackgroundPosition = useCallback(
    (scrollDeltaY: number) => {
      if (scrollDeltaY === 0) {
        return;
      }

      const nextBackgroundY =
        starsBackgroundYRef.current - scrollDeltaY * starsScrollSpeed;

      setStarsBackgroundY(nextBackgroundY);
    },
    [setStarsBackgroundY, starsScrollSpeed],
  );

  useEffect(() => {
    const storedStarsBackgroundY = readStoredStarsBackgroundY();

    setStarsBackgroundY(storedStarsBackgroundY);
    updateScrollMetrics();
  }, [setStarsBackgroundY, updateScrollMetrics]);

  return {
    updateScrollMetrics,
    updateStarsBackgroundPosition,
  };
}