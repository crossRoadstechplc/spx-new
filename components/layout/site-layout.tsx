/* Phase 2: Public site layout wrapper */
import * as React from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

interface SiteLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout wrapper for public-facing pages.
 * Includes sticky header and footer.
 */
export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
