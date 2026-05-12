"use client";

import { useCallback, useEffect, type RefObject } from "react";

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

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
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

      rootStyle.setProperty(
        "--stars-bg-y",
        `${metrics.scrollTop * starsScrollSpeed * -1}px`,
      );

      return metrics;
    },
    [scrollElementRef, starsScrollSpeed],
  );

  useEffect(() => {
    updateScrollMetrics();
  }, [updateScrollMetrics]);

  return {
    updateScrollMetrics,
  };
}