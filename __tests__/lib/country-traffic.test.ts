/**
 * @jest-environment node
 */

jest.mock("fs/promises", () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  access: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue("{}"),
  writeFile: jest.fn().mockResolvedValue(undefined),
  rename: jest.fn().mockResolvedValue(undefined),
}));

import { resolveCountryFromHeaders } from "@/lib/country-traffic";

describe("resolveCountryFromHeaders", () => {
  it("uses cf-ipcountry when present", async () => {
    const headers = new Headers({ "cf-ipcountry": "de" });
    await expect(resolveCountryFromHeaders(headers, "8.8.8.8")).resolves.toBe("DE");
  });

  it("uses x-vercel-ip-country when cf header is absent", async () => {
    const headers = new Headers({ "x-vercel-ip-country": "gb" });
    await expect(resolveCountryFromHeaders(headers, null)).resolves.toBe("GB");
  });

  it("maps Cloudflare unknown codes to unknown", async () => {
    const headers = new Headers({ "cf-ipcountry": "XX" });
    await expect(resolveCountryFromHeaders(headers, null)).resolves.toBe("unknown");
  });

  it("resolves public IP via geoip-lite when no country headers", async () => {
    const headers = new Headers();
    await expect(resolveCountryFromHeaders(headers, "8.8.8.8")).resolves.toBe("US");
  });

  it("returns unknown for private localhost IP without dev override", async () => {
    const headers = new Headers();
    const previous = process.env.ANALYTICS_DEV_COUNTRY;
    delete process.env.ANALYTICS_DEV_COUNTRY;
    await expect(resolveCountryFromHeaders(headers, "127.0.0.1")).resolves.toBe("unknown");
    if (previous) process.env.ANALYTICS_DEV_COUNTRY = previous;
  });

  it("uses ANALYTICS_DEV_COUNTRY in development for private IPs", async () => {
    const headers = new Headers();
    const previousEnv = process.env.NODE_ENV;
    const previousCountry = process.env.ANALYTICS_DEV_COUNTRY;
    Object.assign(process.env, {
      NODE_ENV: "development",
      ANALYTICS_DEV_COUNTRY: "ke",
    });
    await expect(resolveCountryFromHeaders(headers, "127.0.0.1")).resolves.toBe("KE");
    Object.assign(process.env, {
      NODE_ENV: previousEnv,
      ANALYTICS_DEV_COUNTRY: previousCountry,
    });
  });
});
