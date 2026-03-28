import type { Page } from "@playwright/test";

/** Requires seeded admin: admin@spx.com / admin123 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
  await page.fill('input[name="email"]', "admin@spx.com");
  await page.fill('input[name="password"]', "admin123");
  await page.click('button[type="submit"]');
  await page.waitForURL("/admin", { timeout: 20000 });
}
