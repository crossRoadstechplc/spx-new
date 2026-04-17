/* Phase 2: Public site layout wrapper */
import * as React from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { getHasPublishedInsights } from "@/lib/insights-availability";

interface SiteLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout wrapper for public-facing pages.
 * Includes sticky header and footer.
 */
export async function SiteLayout({ children }: SiteLayoutProps) {
  const showInsights = await getHasPublishedInsights();
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader showInsightsNav={showInsights} />
      <main className="flex-1">{children}</main>
      <SiteFooter showInsightsLink={showInsights} />
    </div>
  );
}
