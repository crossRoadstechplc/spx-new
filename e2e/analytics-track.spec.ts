/* E2E: Public analytics ingest endpoint */
import { test, expect } from "@playwright/test";

test.describe("Analytics track API", () => {
  test("accepts valid path and returns success", async ({ request }) => {
    const res = await request.post("/api/analytics/track", {
      data: { path: "/insights", referrer: null },
      headers: { "user-agent": "Playwright E2E" },
    });
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { success: boolean };
    expect(body.success).toBe(true);
  });

  test("rejects invalid path", async ({ request }) => {
    const res = await request.post("/api/analytics/track", {
      data: { path: "not-a-path" },
    });
    expect(res.status()).toBe(400);
  });
});
