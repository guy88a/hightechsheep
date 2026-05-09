"use client";

import { useEffect, useState, useRef, type MutableRefObject } from "react";
import { usePathname, useRouter } from "next/navigation";
import { pageRoutes } from "../../_config/pageRoutes";

type ScrollDirection = "next" | "previous" | null;
type ScrollEdge = "top" | "bottom" | null;

export type NavigationIntent = "nav-click" | null;

type PageViewportProps = Readonly<{
  children: React.ReactNode;
  navigationIntentRef: MutableRefObject<NavigationIntent>;
}>;

const edgeBufferRatio = 0.12;

export default function PageViewport({
  children,
  navigationIntentRef,
}: PageViewportProps) {
  const mainRef = useRef<HTMLElement | null>(null);
  const isChangingPageRef = useRef(false);
  const scrollDirectionRef = useRef<ScrollDirection>(null);
  const scrollEdgeRef = useRef<ScrollEdge>(null);
  const [visibleScrollEdge, setVisibleScrollEdge] = useState<ScrollEdge>(null);

  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = pageRoutes.findIndex((route) => route.href === pathname);

  function getScrollEdge(main: HTMLElement): ScrollEdge {
    const isAtTop = main.scrollTop <= 0;
    const isAtBottom =
      Math.ceil(main.scrollTop + main.clientHeight) >= main.scrollHeight;

    if (isAtTop) {
      return "top";
    }

    if (isAtBottom) {
      return "bottom";
    }

    return null;
  }

  function handleScroll(event: React.UIEvent<HTMLElement>) {
    const nextScrollEdge = getScrollEdge(event.currentTarget);

    if (nextScrollEdge === scrollEdgeRef.current) {
      return;
    }

    scrollEdgeRef.current = nextScrollEdge;
    setVisibleScrollEdge(nextScrollEdge);
  }

  function handleWheel(event: React.WheelEvent<HTMLElement>) {
    const main = mainRef.current;

    if (!main || isChangingPageRef.current || currentIndex === -1) {
      return;
    }

    const isScrollingDown = event.deltaY > 0;
    const isScrollingUp = event.deltaY < 0;

    const isAtTop = main.scrollTop <= 0;
    const isAtBottom =
      Math.ceil(main.scrollTop + main.clientHeight) >= main.scrollHeight;

    if (isScrollingDown && isAtBottom) {
      const nextRoute = pageRoutes[currentIndex + 1];

      if (!nextRoute) {
        return;
      }

      event.preventDefault();

      isChangingPageRef.current = true;
      scrollDirectionRef.current = "next";

      router.push(nextRoute.href);
      return;
    }

    if (isScrollingUp && isAtTop) {
      const previousRoute = pageRoutes[currentIndex - 1];

      if (!previousRoute) {
        return;
      }

      event.preventDefault();

      isChangingPageRef.current = true;
      scrollDirectionRef.current = "previous";

      router.push(previousRoute.href);
    }
  }

  useEffect(() => {
    const main = mainRef.current;

    if (!main) {
      return;
    }

    const scrollDirection = scrollDirectionRef.current;
    const isNavClickNavigation = navigationIntentRef.current === "nav-click";

    requestAnimationFrame(() => {
      const edgeBuffer =
        isNavClickNavigation && scrollDirection === null && currentIndex > 0
          ? main.clientHeight * edgeBufferRatio
          : 0;

      if (scrollDirection === "previous") {
        main.scrollTop = main.scrollHeight - main.clientHeight;
      } else {
        main.scrollTop = edgeBuffer;
      }

      scrollDirectionRef.current = null;
      navigationIntentRef.current = null;
      scrollEdgeRef.current = getScrollEdge(main);
      setVisibleScrollEdge(null);

      window.setTimeout(() => {
        isChangingPageRef.current = false;
      }, 100);
    });
  }, [pathname, currentIndex, navigationIntentRef]);

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