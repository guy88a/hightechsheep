"use client";

import { useRef, type MutableRefObject, type ReactNode } from "react";
import { usePageScrollMetrics } from "./usePageScrollMetrics";
import {
  usePageScrollNavigation,
  type NavigationIntent,
} from "./usePageScrollNavigation";

export type { NavigationIntent };

type PageViewportProps = Readonly<{
  children: ReactNode;
  navigationIntentRef: MutableRefObject<NavigationIntent>;
}>;

export default function PageViewport({
  children,
  navigationIntentRef,
}: PageViewportProps) {
  const mainRef = useRef<HTMLElement | null>(null);

  const { updateScrollMetrics } = usePageScrollMetrics({
    scrollElementRef: mainRef,
  });

  const { visibleScrollEdge, handleScroll, handleWheel } =
    usePageScrollNavigation({
      mainRef,
      navigationIntentRef,
      updateScrollMetrics,
    });

  return (
    <main
      ref={mainRef}
      className={`main ${
        visibleScrollEdge ? `main--scroll-edge-${visibleScrollEdge}` : ""
      }`}
      onScroll={handleScroll}
      onWheel={handleWheel}
    >
      {children}
    </main>
  );
}