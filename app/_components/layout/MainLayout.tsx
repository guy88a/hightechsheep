"use client";

import { useRef, useState } from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import PageViewport, { type NavigationIntent } from "./viewport/PageViewport";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigationIntentRef = useRef<NavigationIntent>(null);
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(true);

  function markNavClick() {
    navigationIntentRef.current = "nav-click";
  }

  return (
    <>
      <Header
        onNavClick={markNavClick}
        autoPilotEnabled={autoPilotEnabled}
        setAutoPilotEnabled={setAutoPilotEnabled}
      />
      <PageViewport
        navigationIntentRef={navigationIntentRef}
        autoPilotEnabled={autoPilotEnabled}
      >
        {children}
      </PageViewport>
      <Footer />
    </>
  );
}