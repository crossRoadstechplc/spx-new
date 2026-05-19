import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import geoip from "geoip-lite";

const COUNTRY_TRAFFIC_DIR = path.resolve(process.cwd(), "data");
const COUNTRY_TRAFFIC_FILE = path.join(COUNTRY_TRAFFIC_DIR, "traffic-countries.json");

export const COUNTRY_TRACKING_STARTED_AT = "May 8, 2026";

type CountryTrafficMap = Record<string, number>;

export type CountryTrafficRow = {
  country: string;
  visits: number;
};

const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

/** CDN / proxy headers that carry a 2-letter country code (checked in order). */
const COUNTRY_HEADER_NAMES = [
  "cf-ipcountry",
  "x-vercel-ip-country",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-appengine-country",
  "fastly-client-country",
] as const;

let writeQueue: Promise<void> = Promise.resolve();

function normalizeCountryCode(input?: string | null): string {
  if (!input || !input.trim()) return "unknown";
  const normalized = input.trim().toUpperCase();
  if (normalized === "XX" || normalized === "T1") return "unknown";
  return COUNTRY_CODE_REGEX.test(normalized) ? normalized : "unknown";
}

function normalizeClientIp(ipAddress?: string | null): string | null {
  if (!ipAddress) return null;

  const trimmed = ipAddress.trim();
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

function resolveCountryFromGeoIp(ipAddress?: string | null): string {
  const normalizedIp = normalizeClientIp(ipAddress);
  if (!normalizedIp || isPrivateIp(normalizedIp)) {
    const devOverride = process.env.ANALYTICS_DEV_COUNTRY?.trim();
    if (devOverride && process.env.NODE_ENV === "development") {
      return normalizeCountryCode(devOverride);
    }
    return "unknown";
  }

  const lookup = geoip.lookup(normalizedIp);
  if (lookup?.country) {
    return normalizeCountryCode(lookup.country);
  }

  return "unknown";
}

async function ensureStorage(): Promise<void> {
  await fs.mkdir(COUNTRY_TRAFFIC_DIR, { recursive: true });
  try {
    await fs.access(COUNTRY_TRAFFIC_FILE);
  } catch {
    await fs.writeFile(COUNTRY_TRAFFIC_FILE, "{}\n", "utf8");
  }
}

async function readCountryTrafficMap(): Promise<CountryTrafficMap> {
  await ensureStorage();
  const raw = await fs.readFile(COUNTRY_TRAFFIC_FILE, "utf8");
  if (!raw.trim()) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const out: CountryTrafficMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const country = normalizeCountryCode(key);
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) continue;
      out[country] = Math.floor(value);
    }
    return out;
  } catch {
    return {};
  }
}

async function writeCountryTrafficMap(map: CountryTrafficMap): Promise<void> {
  const sortedEntries = Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const payload = JSON.stringify(Object.fromEntries(sortedEntries), null, 2) + "\n";
  const tempFile = `${COUNTRY_TRAFFIC_FILE}.tmp`;
  await fs.writeFile(tempFile, payload, "utf8");
  await fs.rename(tempFile, COUNTRY_TRAFFIC_FILE);
}

export async function resolveCountryFromHeaders(headers: Headers, ipAddress?: string | null): Promise<string> {
  for (const name of COUNTRY_HEADER_NAMES) {
    const value = headers.get(name);
    if (value) {
      return normalizeCountryCode(value);
    }
  }

  return resolveCountryFromGeoIp(ipAddress);
}

export async function recordCountryVisit(countryInput?: string | null): Promise<void> {
  const country = normalizeCountryCode(countryInput);
  writeQueue = writeQueue.then(async () => {
    const current = await readCountryTrafficMap();
    current[country] = (current[country] ?? 0) + 1;
    await writeCountryTrafficMap(current);
  });

  return writeQueue;
}

export async function getCountryTraffic(limit = 10): Promise<CountryTrafficRow[]> {
  const map = await readCountryTrafficMap();
  return Object.entries(map)
    .map(([country, visits]) => ({ country, visits }))
    .sort((a, b) => b.visits - a.visits || a.country.localeCompare(b.country))
    .slice(0, Math.max(1, limit));
}
