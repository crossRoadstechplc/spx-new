/* E2E: Admin analytics dashboard */
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-login";

test.describe("Admin analytics", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("analytics dashboard loads with KPI content", async ({ page }) => {
    await page.goto("/admin/analytics", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Website Analytics" })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByRole("heading", { name: "Views" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Unique Visitors" })).toBeVisible();
  });
});
