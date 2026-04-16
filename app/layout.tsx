/* Phase 7: Root layout with improved metadata */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { ParticleBackground } from "@/components/ui/particle-background";
import { AnalyticsTracker } from "@/components/providers/analytics-tracker";
import {
  DEFAULT_SITE_DESCRIPTION,
  getSiteUrl,
  LINKEDIN_ORG_URL,
  ORGANIZATION_MAP_URL,
  ORGANIZATION_PHONE,
  SEO_KEYWORDS,
  shouldNoIndexSite,
} from "@/lib/seo-config";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = getSiteUrl();
const defaultSeoImage = `${siteUrl}/opengraph-image`;
const noindex = shouldNoIndexSite();

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SPX — Consulting & Strategy-to-Implementation",
    template: "%s | SPX",
  },
  description: DEFAULT_SITE_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: "SPX", url: siteUrl }],
  creator: "SPX",
  publisher: "SPX",
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
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
    title: "SPX — Consulting & Strategy-to-Implementation",
    description: DEFAULT_SITE_DESCRIPTION,
    images: [
      {
        url: defaultSeoImage,
        width: 1200,
        height: 630,
        alt: "SPX — strategy-to-implementation across Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPX — Consulting & Strategy-to-Implementation",
    description: DEFAULT_SITE_DESCRIPTION,
    images: [defaultSeoImage],
  },
  robots: noindex
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : {
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SPX",
  alternateName: "Spiralytix",
  description: DEFAULT_SITE_DESCRIPTION,
  url: siteUrl,
  logo: `${siteUrl}/assets/logos/SPX.png`,
  image: defaultSeoImage,
  email: "info@spxafrica.com",
  telephone: ORGANIZATION_PHONE,
  sameAs: [LINKEDIN_ORG_URL],
  hasMap: ORGANIZATION_MAP_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Addis Ababa",
    addressCountry: "ET",
  },
  areaServed: [
    { "@type": "Country", name: "Ethiopia" },
    { "@type": "AdministrativeArea", name: "East Africa" },
    { "@type": "Place", name: "Africa" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <LoadingProvider>
          <AnalyticsTracker />
          <ParticleBackground />
          <div className="relative z-10">{children}</div>
        </LoadingProvider>
      </body>
    </html>
  );
}
