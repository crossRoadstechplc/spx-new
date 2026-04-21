/* Phase 7: Root layout with improved metadata */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { ParticleBackground } from "@/components/ui/particle-background";
import { AnalyticsTracker } from "@/components/providers/analytics-tracker";
import {
  APPLE_TOUCH_ICON_PATH,
  DEFAULT_SITE_DESCRIPTION,
  FAVICON_ICO_PATH,
  FAVICON_PNG_PATHS,
  getSiteLogoUrl,
  getSiteUrl,
  LINKEDIN_ORG_URL,
  ORGANIZATION_MAP_URL,
  ORGANIZATION_PHONE,
  SEO_KEYWORDS,
  SITE_WEB_MANIFEST_PATH,
  shouldNoIndexSite,
} from "@/lib/seo-config";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = getSiteUrl();
const organizationImageUrl = getSiteLogoUrl();
const noindex = shouldNoIndexSite();

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SPX: Consulting and Strategy-to-Implementation",
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
  manifest: SITE_WEB_MANIFEST_PATH,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: FAVICON_ICO_PATH, sizes: "any" },
      {
        url: FAVICON_PNG_PATHS["16"],
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: FAVICON_PNG_PATHS["32"],
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [{ url: APPLE_TOUCH_ICON_PATH, type: "image/png" }],
    shortcut: FAVICON_ICO_PATH,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SPX",
    title: "SPX: Consulting and Strategy-to-Implementation",
    description: DEFAULT_SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "SPX: Consulting and Strategy-to-Implementation",
    description: DEFAULT_SITE_DESCRIPTION,
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
  description: DEFAULT_SITE_DESCRIPTION,
  url: siteUrl,
  logo: organizationImageUrl,
  image: organizationImageUrl,
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
