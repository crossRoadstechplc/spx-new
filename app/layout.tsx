/* Phase 7: Root layout with improved metadata */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { ParticleBackground } from "@/components/ui/particle-background";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.APP_URL || "http://localhost:3000";
const defaultSeoImage = `${siteUrl}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  alternates: {
    canonical: "/",
  },
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
    images: [
      {
        url: defaultSeoImage,
        width: 1200,
        height: 630,
        alt: "SPX - Strategy-to-Implementation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPX — Systems Layer Company",
    description:
      "Strategic research, editorial, and systems thinking for organizations navigating complexity.",
    images: [defaultSeoImage],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SPX",
              url: siteUrl,
              logo: `${siteUrl}/opengraph-image`,
              email: "info@spxafrica.com",
              telephone: "+251930199157",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Addis Ababa",
                addressCountry: "Ethiopia",
              },
            }),
          }}
        />
        <LoadingProvider>
          <ParticleBackground />
          <div className="relative z-10">{children}</div>
        </LoadingProvider>
      </body>
    </html>
  );
}
