"use client";

import { useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import PageViewport, { type NavigationIntent } from "./PageViewport";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigationIntentRef = useRef<NavigationIntent>(null);

  function markNavClick() {
    navigationIntentRef.current = "nav-click";
  }

  return (
    <>
      <Header onNavClick={markNavClick} />
      <PageViewport navigationIntentRef={navigationIntentRef}>
        {children}
      </PageViewport>
      <Footer />
    </>
  );
}