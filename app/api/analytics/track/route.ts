import { NextResponse } from "next/server";
import net from "node:net";
import { trackPageView, shouldTrackPath } from "@/lib/analytics";
import { recordCountryVisit, resolveCountryFromHeaders } from "@/lib/country-traffic";

export const runtime = "nodejs";

type TrackPayload = {
  path?: string;
  referrer?: string | null;
};

function normalizeIpCandidate(ip: string): string | null {
  const trimmed = ip.trim();
  if (!trimmed) return null;
  const normalized = trimmed.startsWith("::ffff:") ? trimmed.slice(7) : trimmed;
  return net.isIP(normalized) ? normalized : null;
}

function isPrivateIp(ipAddress: string): boolean {
  if (ipAddress === "::1" || ipAddress.startsWith("fc") || ipAddress.startsWith("fd") || ipAddress.startsWith("fe80:")) {
    return true;
  }

  if (net.isIP(ipAddress) !== 4) return false;

  const [a, b] = ipAddress.split(".").map((part) => Number(part));
  if (a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((item) => normalizeIpCandidate(item)).filter((ip): ip is string => Boolean(ip));
    const firstPublic = ips.find((ip) => !isPrivateIp(ip));
    if (firstPublic) return firstPublic;
    if (ips[0]) return ips[0];
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    const normalizedRealIp = normalizeIpCandidate(realIp);
    if (normalizedRealIp) return normalizedRealIp;
  }

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

    const clientIp = getClientIp(request);
    const country = await resolveCountryFromHeaders(request.headers, clientIp);

    await trackPageView({
      path,
      referrer: body?.referrer ?? request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
      ipAddress: clientIp,
    });
    await recordCountryVisit(country).catch((error) => {
      console.error("Country traffic tracking failed", error);
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Analytics tracking failed", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
