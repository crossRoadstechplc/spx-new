import OgImage from "@/components/og/og-image";

/**
 * Same image as `opengraph-image`. Route config must be declared here (not re-exported
 * from `opengraph-image`) so Next.js can apply it without warnings.
 */
export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default OgImage;
