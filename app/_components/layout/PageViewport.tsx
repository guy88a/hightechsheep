"use client";

import { useEffect, useState, useRef, type MutableRefObject } from "react";
import { usePathname, useRouter } from "next/navigation";
import { pageRoutes } from "../../_config/pageRoutes";

type ScrollDirection = "next" | "previous" | null;
type NavigationZone = "top" | "bottom" | null;

export type NavigationIntent = "nav-click" | null;

type PageViewportProps = Readonly<{
  children: React.ReactNode;
  navigationIntentRef: MutableRefObject<NavigationIntent>;
}>;

const edgeBufferRatio = 0.2;
const navigationCooldownMs = 500;

export default function PageViewport({
  children,
  navigationIntentRef,
}: PageViewportProps) {
  const mainRef = useRef<HTMLElement | null>(null);
  const isChangingPageRef = useRef(false);
  const scrollDirectionRef = useRef<ScrollDirection>(null);
  const wheelDirectionRef = useRef<ScrollDirection>(null);
  const navigationZoneRef = useRef<NavigationZone>(null);
  const navigationReadyRef = useRef(false);
  const navigationCooldownRef = useRef<number | null>(null);
  const [visibleScrollEdge, setVisibleScrollEdge] =
    useState<NavigationZone>(null);

  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = pageRoutes.findIndex((route) => route.href === pathname);
  const lastPageIndex = pageRoutes.length - 1;

  // Temporary until the header toggle is wired in.
  const autoPilotEnabled = true;

  function getNavigationZoneSize(main: HTMLElement) {
    return main.clientHeight * edgeBufferRatio;
  }

  function getNavigationZone(main: HTMLElement): NavigationZone {
    const navigationZoneSize = getNavigationZoneSize(main);
    const scrollableHeight = main.scrollHeight - main.clientHeight;

    if (scrollableHeight <= 0) {
      return null;
    }

    const distanceFromTop = main.scrollTop;
    const distanceFromBottom = scrollableHeight - main.scrollTop;

    if (distanceFromTop <= navigationZoneSize) {
      return "top";
    }

    if (distanceFromBottom <= navigationZoneSize) {
      return "bottom";
    }

    return null;
  }

  function getRequestedDirection(
    navigationZone: NavigationZone,
  ): Exclude<ScrollDirection, null> | null {
    if (wheelDirectionRef.current === "next" && navigationZone === "bottom") {
      return "next";
    }

    if (wheelDirectionRef.current === "previous" && navigationZone === "top") {
      return "previous";
    }

    return null;
  }

  function clearNavigationCooldown() {
    if (!navigationCooldownRef.current) {
      return;
    }

    window.clearTimeout(navigationCooldownRef.current);
    navigationCooldownRef.current = null;
  }

  function isWebsiteBoundary(navigationZone: NavigationZone) {
    return (
      (currentIndex === 0 && navigationZone === "top") ||
      (currentIndex === lastPageIndex && navigationZone === "bottom")
    );
  }

  function resetNavigationZone(navigationZone: NavigationZone) {
    clearNavigationCooldown();

    navigationZoneRef.current = navigationZone;
    navigationReadyRef.current = false;

    if (!navigationZone || isWebsiteBoundary(navigationZone)) {
      setVisibleScrollEdge(null);
      return;
    }

    setVisibleScrollEdge(navigationZone);

    navigationCooldownRef.current = window.setTimeout(() => {
      navigationCooldownRef.current = null;

      if (
        navigationZoneRef.current !== navigationZone ||
        isChangingPageRef.current
      ) {
        return;
      }

      navigationReadyRef.current = true;
    }, navigationCooldownMs);
  }

  function syncNavigationZone(main: HTMLElement) {
    const nextNavigationZone = getNavigationZone(main);

    if (!nextNavigationZone) {
      if (navigationZoneRef.current !== null) {
        resetNavigationZone(null);
      }

      return;
    }

    const requestedDirection = getRequestedDirection(nextNavigationZone);

    if (!requestedDirection || isWebsiteBoundary(nextNavigationZone)) {
      if (navigationZoneRef.current !== null) {
        resetNavigationZone(null);
      }

      return;
    }

    if (nextNavigationZone === navigationZoneRef.current) {
      return;
    }

    resetNavigationZone(nextNavigationZone);
  }

  function navigateToRoute(direction: Exclude<ScrollDirection, null>) {
    const routeOffset = direction === "next" ? 1 : -1;
    const nextRoute = pageRoutes[currentIndex + routeOffset];

    if (!nextRoute) {
      return;
    }

    isChangingPageRef.current = true;
    scrollDirectionRef.current = direction;

    router.push(nextRoute.href);
  }

  function handleScroll(event: React.UIEvent<HTMLElement>) {
    if (isChangingPageRef.current) {
      return;
    }

    syncNavigationZone(event.currentTarget);
  }

  function handleWheel(event: React.WheelEvent<HTMLElement>) {
    const main = mainRef.current;

    if (!main || isChangingPageRef.current || currentIndex === -1) {
      return;
    }

    wheelDirectionRef.current =
      event.deltaY > 0 ? "next" : event.deltaY < 0 ? "previous" : null;

    const navigationZone = getNavigationZone(main);

    if (!navigationZone) {
      resetNavigationZone(null);
      return;
    }

    const requestedDirection = getRequestedDirection(navigationZone);

    if (!requestedDirection || isWebsiteBoundary(navigationZone)) {
      resetNavigationZone(null);
      return;
    }

    if (
      navigationZone !== navigationZoneRef.current ||
      (!navigationCooldownRef.current && !navigationReadyRef.current)
    ) {
      resetNavigationZone(navigationZone);
    }

    if (!autoPilotEnabled || !navigationReadyRef.current) {
      return;
    }

    event.preventDefault();
    navigateToRoute(requestedDirection);
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
          ? getNavigationZoneSize(main) + 1
          : 0;

      if (scrollDirection === "previous") {
        main.scrollTop = main.scrollHeight - main.clientHeight;
      } else {
        main.scrollTop = edgeBuffer;
      }

      scrollDirectionRef.current = null;
      wheelDirectionRef.current = null;
      navigationIntentRef.current = null;
      navigationZoneRef.current = getNavigationZone(main);
      navigationReadyRef.current = false;
      clearNavigationCooldown();
      setVisibleScrollEdge(null);

      window.setTimeout(() => {
        isChangingPageRef.current = false;
      }, 100);
    });
  }, [pathname, currentIndex, navigationIntentRef]);

  useEffect(() => {
    return () => {
      clearNavigationCooldown();
    };
  }, []);

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