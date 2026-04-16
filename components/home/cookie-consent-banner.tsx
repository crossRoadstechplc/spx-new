"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CONSENT_COOKIE = "cookie_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

function hasConsentCookie(): boolean {
  if (typeof document === "undefined") return true;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${CONSENT_COOKIE}=`));
}

function setConsentCookie(value: "accepted" | "rejected") {
  document.cookie = `${CONSENT_COOKIE}=${value}; max-age=${CONSENT_MAX_AGE}; path=/; SameSite=Lax`;
}

export function CookieConsentBanner() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(!hasConsentCookie());
  }, []);

  const accept = React.useCallback(() => {
    setConsentCookie("accepted");
    setShow(false);
  }, []);

  const reject = React.useCallback(() => {
    setConsentCookie("rejected");
    setShow(false);
  }, []);

  if (!show) return null;

  return (
    <div
      id="cookie-banner"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100]",
        "border-t-2 border-primary/25 bg-card/98 text-card-foreground shadow-2xl ring-1 ring-black/5 dark:ring-white/10",
        "backdrop-blur-md supports-[backdrop-filter]:bg-card/95"
      )}
    >
      <div className="container flex flex-col gap-6 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-7 md:py-8 lg:px-8">
        <div className="space-y-2 sm:max-w-2xl md:space-y-3">
          <p id="cookie-banner-title" className="text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
            Cookies on this site
          </p>
          <p id="cookie-banner-desc" className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            We use cookies to improve your experience.{" "}
            <Link href="/cookie-notice" className="text-primary font-semibold underline-offset-4 hover:underline">
              Cookie notice
            </Link>
            {" · "}
            <Link href="/cookie-settings" className="text-primary font-semibold underline-offset-4 hover:underline">
              Cookie settings
            </Link>
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center gap-3 sm:justify-end md:gap-4">
          <Button type="button" variant="outline" size="lg" className="min-w-[7rem] font-semibold" onClick={reject}>
            Reject
          </Button>
          <Button type="button" size="lg" className="min-w-[7rem] font-semibold" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
