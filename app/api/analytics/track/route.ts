import { NextResponse } from "next/server";
import { trackPageView, shouldTrackPath } from "@/lib/analytics";

type TrackPayload = {
  path?: string;
  referrer?: string | null;
};

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return null;
}

function normalizePath(path?: string): string | null {
  if (!path || typeof path !== "string") return null;
  const clean = path.trim();
  if (!clean.startsWith("/")) return null;
  if (!shouldTrackPath(clean)) return null;
  return clean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as TrackPayload | null;
    const path = normalizePath(body?.path);

    if (!path) {
      return NextResponse.json({ success: false, reason: "invalid_path" }, { status: 400 });
    }

    await trackPageView({
      path,
      referrer: body?.referrer ?? request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Analytics tracking failed", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
