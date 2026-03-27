"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function shouldTrackClientPath(pathname: string): boolean {
  if (!pathname) return false;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/uploads")
  ) {
    return false;
  }
  return true;
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || !shouldTrackClientPath(pathname)) return;
    if (lastTrackedPath.current === pathname) return;

    const payload = JSON.stringify({
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer : null,
    });

    try {
      const blob = new Blob([payload], { type: "application/json" });
      const canSendBeacon = typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function";
      if (canSendBeacon) {
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        void fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
      lastTrackedPath.current = pathname;
    } catch {
      // Best-effort analytics should never break navigation.
    }
  }, [pathname]);

  return null;
}
