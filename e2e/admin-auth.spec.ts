/* Final Phase: E2E tests for admin authentication */
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-login";

test.describe("Admin Authentication", () => {
  test("admin login page loads", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("h1")).toContainText("SPX Admin");
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("admin login with valid credentials", async ({ page }) => {
    await loginAsAdmin(page);
    expect(page.url()).toContain("/admin");
  });

  test("admin login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
    
    // Fill in wrong credentials
    await page.fill('input[name="email"]', "wrong@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('div[class*="destructive"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 5000 });
  });

  test("protected admin routes redirect to login", async ({ page }) => {
    await page.goto("/admin/insights");
    await expect(page).toHaveURL("/admin/login");
  });

  test("admin logout", async ({ page }) => {
    await loginAsAdmin(page);
    
    // Click logout
    await page.click('text=Logout');
    
    // Should redirect to login
    await page.waitForURL("/admin/login", { timeout: 10000 });
    
    // Verify session is cleared
    await page.goto("/admin");
    await page.waitForURL("/admin/login", { timeout: 10000 });
  });
});
