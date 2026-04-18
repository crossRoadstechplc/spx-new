import OgImage from "@/components/og/og-image";

/** Node runtime: load logo from disk so builds never fetch `APP_URL` / localhost. */
export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default OgImage;
