import fs from "node:fs/promises";
import path from "node:path";

const COUNTRY_TRAFFIC_DIR = path.resolve(process.cwd(), "data");
const COUNTRY_TRAFFIC_FILE = path.join(COUNTRY_TRAFFIC_DIR, "traffic-countries.json");

export const COUNTRY_TRACKING_STARTED_AT = "May 8, 2026";

type CountryTrafficMap = Record<string, number>;

export type CountryTrafficRow = {
  country: string;
  visits: number;
};

const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

let writeQueue: Promise<void> = Promise.resolve();

function normalizeCountryCode(input?: string | null): string {
  if (!input || !input.trim()) return "unknown";
  const normalized = input.trim().toUpperCase();
  return COUNTRY_CODE_REGEX.test(normalized) ? normalized : "unknown";
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

export function resolveCountryFromHeaders(headers: Headers): string {
  const cfCountry = headers.get("cf-ipcountry");
  if (cfCountry) return normalizeCountryCode(cfCountry);

  const vercelCountry = headers.get("x-vercel-ip-country");
  if (vercelCountry) return normalizeCountryCode(vercelCountry);

  return "unknown";
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
