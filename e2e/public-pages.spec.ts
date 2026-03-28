/* Final Phase: E2E tests for public pages */
import { test, expect } from "@playwright/test";

test.describe("Public Website", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle(/SPX/);
    const hero = page.locator("h1").first();
    await expect(hero).toContainText("Strategy-to-Implementation", { timeout: 10000 });
    await expect(hero).toContainText("Platform");
  });

  test("navigation across core pages", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Navigate to Who We Are
    await page.click('a[href="/who-we-are"]');
    await page.waitForURL("/who-we-are");
    await expect(page.locator("h1").first()).toContainText("Who We Are", { timeout: 10000 });

    // Navigate to What We Do
    await page.click('a[href="/what-we-do"]');
    await page.waitForURL("/what-we-do");
    await expect(page.locator("h1").first()).toContainText("What We Do", { timeout: 10000 });

    // Navigate to How We Work
    await page.click('a[href="/how-we-work"]');
    await page.waitForURL("/how-we-work");
    await expect(page.locator("h1").first()).toContainText("How We Work", { timeout: 10000 });

    // Navigate to Insights
    await page.click('a[href="/insights"]');
    await page.waitForURL("/insights");
    await expect(page.locator("h1").first()).toContainText("Insights", { timeout: 10000 });

    // Navigate to Contact
    await page.click('a[href="/contact"]');
    await page.waitForURL("/contact");
    await expect(page.locator("h1").first()).toContainText("Contact", { timeout: 10000 });
  });

  test("mobile navigation behavior", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "load" });

    await expect(page.locator('header button[aria-label="Open menu"]')).toBeVisible({ timeout: 20000 });
  });

  test("responsive design - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("responsive design - tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("responsive design - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("insights page displays published content", async ({ page }) => {
    await page.goto("/insights", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1").first()).toContainText("Insights", { timeout: 10000 });

    await page.waitForLoadState("domcontentloaded");
    // Listing uses cards and links to detail pages, not <article>
    const insightLinks = page.locator('a[href^="/insights/"]');
    const count = await insightLinks.count();
    if (count > 0) {
      await expect(insightLinks.first()).toBeVisible();
    }
  });

  test("404 page for non-existent routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.locator("h1").first()).toContainText("Page Not Found");
    await expect(page.getByText(/404 Error/i)).toBeVisible();
  });

  test("privacy policy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toContainText("Privacy Policy");
  });

  test("terms of service page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("h1")).toContainText("Terms of Service");
  });
});
