/* Phase 7: Root layout with improved metadata */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { ParticleBackground } from "@/components/ui/particle-background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: {
    default: "SPX — Systems Layer Company",
    template: "%s | SPX",
  },
  description:
    "Strategic research, editorial, and systems thinking for organizations navigating complexity across sectors.",
  keywords: [
    "systems thinking",
    "strategic research",
    "editorial services",
    "organizational strategy",
    "complexity management",
  ],
  authors: [{ name: "SPX" }],
  creator: "SPX",
  publisher: "SPX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SPX",
    title: "SPX — Systems Layer Company",
    description:
      "Strategic research, editorial, and systems thinking for organizations navigating complexity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPX — Systems Layer Company",
    description:
      "Strategic research, editorial, and systems thinking for organizations navigating complexity.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
          <ParticleBackground />
          <div className="relative z-10">{children}</div>
        </LoadingProvider>
      </body>
    </html>
  );
}
