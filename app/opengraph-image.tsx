import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: "linear-gradient(135deg, #0f172a 0%, #111827 65%, #1e293b 100%)",
          color: "#f8fafc",
        }}
      >
        <div style={{ display: "flex", fontSize: 46, fontWeight: 800, letterSpacing: -1 }}>SPX</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>
            Strategy-to-Implementation Platform
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#cbd5e1" }}>
            Strategic research, editorial, and systems thinking.
          </div>
        </div>
      </div>
    ),
    size
  );
}

