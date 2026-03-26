/* Final Phase: E2E tests for public pages */
import { test, expect } from "@playwright/test";

test.describe("Public Website", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle(/SPX/);
    await expect(page.locator("h1")).toContainText("Systems Layer Company", { timeout: 10000 });
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
    await page.goto("/");

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible();

    // Desktop nav should be hidden
    const desktopNav = page.locator("nav .hidden.lg\\:flex");
    await expect(desktopNav).toBeHidden();
  });

  test("responsive design - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    
    // Check that content renders properly
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
  });

  test("responsive design - tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    
    // Check that content renders properly
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
  });

  test("responsive design - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    
    // Check that content renders properly
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
  });

  test("insights page displays published content", async ({ page }) => {
    await page.goto("/insights", { waitUntil: "networkidle" });
    await expect(page.locator("h1").first()).toContainText("Insights", { timeout: 10000 });
    
    // Check if any insights are visible or empty state
    await page.waitForLoadState("domcontentloaded");
    const hasInsights = await page.locator("article").count();
    if (hasInsights > 0) {
      await expect(page.locator("article").first()).toBeVisible();
    }
  });

  test("404 page for non-existent routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.locator("h1")).toContainText("404");
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
