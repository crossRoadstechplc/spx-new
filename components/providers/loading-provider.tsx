"use client";

/* Loading animation provider - shows on home page visits */
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LoadingAnimation } from "@/components/ui/loading-animation";

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showLoading, setShowLoading] = useState(false);
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

  return <>{children}</>;
}
