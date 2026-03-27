"use client";

/* Loading animation provider - shows on home page visits */
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { PopupLoadingAnimation } from "@/components/ui/popup-loading-animation";

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showLoading, setShowLoading] = useState(false);
  const [showPopupLoading, setShowPopupLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Show loading animation only on home page
    if (pathname === "/") {
      setShowLoading(true);
      setIsReady(false);
    } else {
      setShowLoading(false);
      setIsReady(true);
    }
  }, [pathname]);

  // Close popup loading once route transition completes.
  useEffect(() => {
    setShowPopupLoading(false);
  }, [pathname]);

  // Show popup loading for internal CTA/navigation link clicks.
  useEffect(() => {
    const handleShowLoading = () => setShowPopupLoading(true);

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const isInternalRoute = href.startsWith("/");
      const isNonNavigatingHref = href.startsWith("#");
      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      const opensNewContext = anchor.target === "_blank" || anchor.hasAttribute("download");

      if (isInternalRoute && !isNonNavigatingHref && !isModifiedClick && !opensNewContext) {
        // Defer until other click handlers run (e.g. unsaved-changes guards).
        setTimeout(() => {
          if (!event.defaultPrevented) {
            setShowPopupLoading(true);
          }
        }, 0);
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("spx:show-loading", handleShowLoading);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("spx:show-loading", handleShowLoading);
    };
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  };

  if (!isReady && showLoading && pathname === "/") {
    return <LoadingAnimation onComplete={handleLoadingComplete} minDuration={5000} />;
  }

  if (!isReady && pathname === "/") {
    return null;
  }

  return (
    <>
      {children}
      {showPopupLoading && <PopupLoadingAnimation label="Loading" />}
    </>
  );
}
