import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { SITE_LOGO_PATH } from "@/lib/seo-config";

function getLogoDataUrl(): string {
  const path = join(process.cwd(), "public", SITE_LOGO_PATH.replace(/^\//, ""));
  const buf = readFileSync(path);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default function OgImage() {
  const logoUrl = getLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          padding: 56,
          background: "linear-gradient(135deg, #0f172a 0%, #111827 65%, #1e293b 100%)",
          color: "#f8fafc",
        }}
      >
        <img
          src={logoUrl}
          alt="SPX"
          height={160}
          width={480}
          style={{ height: 160, width: "auto", maxWidth: 520, objectFit: "contain" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.5 }}>
            Strategy-to-Implementation
          </div>
          <div style={{ fontSize: 26, color: "#cbd5e1", maxWidth: 900 }}>
            Consulting and implementation across Africa.
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
