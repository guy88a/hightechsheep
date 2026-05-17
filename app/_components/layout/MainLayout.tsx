"use client";

import { useRef } from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import PageViewport, { type NavigationIntent } from "./viewport/PageViewport";

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