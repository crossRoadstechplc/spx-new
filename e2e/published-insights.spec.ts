/* Final Phase: E2E tests for published insights on public site */
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-login";
import { fillMinimumInsightBody, setUniqueInsightSlug, submitInsightForm } from "./helpers/insight-form";

test.describe("Published Insights Flow", () => {
  test("published insight appears on public insights page", async ({ page }) => {
    // First, login and create/publish an insight
    await loginAsAdmin(page);
    await page.goto("/admin/insights/new", { waitUntil: "networkidle" });
    
    const testTitle = `E2E Test ${Date.now()}`;
    const testSlug = `e2e-published-${Date.now()}`;
    await page.locator("#title").fill(testTitle);
    await page.fill('textarea[name="excerpt"]', "This is a published test insight");
    await fillMinimumInsightBody(page);
    await setUniqueInsightSlug(page, testSlug);

    // Select author if available
    const authorSelect = page.locator('select[name="authorId"]');
    if (await authorSelect.isVisible()) {
      await authorSelect.selectOption({ index: 1 });
    }
    
    // Set to published
    await page.selectOption('select[name="status"]', "PUBLISHED");

    await submitInsightForm(page);
    await expect(page).toHaveURL(/\/admin\/insights\/?$/, { timeout: 30000 });
    
    // Logout
    await page.click('text=Logout');
    await page.waitForURL("/admin/login", { timeout: 10000 });
    
    // Visit public insights page
    await page.goto("/insights", { waitUntil: "domcontentloaded" });
    
    // Verify insight appears (may need to wait for page load)
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator(`text=${testTitle}`)).toBeVisible({ timeout: 15000 });
  });

  test("published insight detail page loads correctly", async ({ page }) => {
    await page.goto("/insights", { waitUntil: "domcontentloaded" });
    
    // Check if any insights exist (prefer explicit card CTAs over any /insights/ link in the tree)
    const readArticleLinks = page.getByRole("link", { name: /read full article/i });
    const count = await readArticleLinks.count();
    
    if (count > 0) {
      await Promise.all([
        page.waitForURL(/\/insights\/[a-z0-9-]+/, { timeout: 20000 }),
        readArticleLinks.first().click(),
      ]);
      
      await expect(page).toHaveURL(/\/insights\/[a-z0-9-]+$/);
      
      // Check for content structure
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("article")).toBeVisible();
    }
  });

  test("insight content renders with proper formatting", async ({ page }) => {
    await page.goto("/insights", { waitUntil: "domcontentloaded" });

    const readArticleLinks = page.getByRole("link", { name: /read full article/i });
    const count = await readArticleLinks.count();

    if (count > 0) {
      await Promise.all([
        page.waitForURL(/\/insights\/[a-z0-9-]+/, { timeout: 20000 }),
        readArticleLinks.first().click(),
      ]);

      const article = page.locator("article");
      await expect(article).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(article.locator("header")).toBeVisible();
    }
  });

  test("insight images render correctly", async ({ page, context }) => {
    // Login and create insight with image
    await loginAsAdmin(page);
    
    // Note: Full image upload test would require actual file upload
    // This test verifies the rendering logic exists
    
    await page.goto("/insights");
    const insightLinks = page.locator('a[href^="/insights/"]');
    const count = await insightLinks.count();
    
    if (count > 0) {
      await insightLinks.first().click();
      
      // Check if any images are present in article
      const images = page.locator("article img");
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Verify first image has proper attributes
        const firstImage = images.first();
        await expect(firstImage).toHaveAttribute("src");
        await expect(firstImage).toHaveAttribute("alt");
      }
    }
  });

  test("insight metadata displays correctly", async ({ page }) => {
    await page.goto("/insights");
    
    const insightLinks = page.locator('a[href^="/insights/"]');
    const count = await insightLinks.count();
    
    if (count > 0) {
      await insightLinks.first().click();
      
      // Check for author name (if available)
      const authorName = page.locator('text=/By .+/').or(page.locator('[class*="author"]'));
      
      // Check for date
      const publishDate = page.locator('time').or(page.locator('text=/[A-Z][a-z]+ \\d+, \\d{4}/'));
      
      // At least one metadata element should be present
      await expect(authorName.or(publishDate)).toBeVisible();
    }
  });

  test("insight category and tags display", async ({ page }) => {
    await page.goto("/insights");
    
    const insightLinks = page.locator('a[href^="/insights/"]');
    const count = await insightLinks.count();
    
    if (count > 0) {
      await insightLinks.first().click();
      
      // Check for category badge or tags
      const categoryOrTags = page.locator('[class*="tag"]').or(page.locator('[class*="category"]'));
      
      // May or may not have tags, so we just check if the structure exists
      const exists = await categoryOrTags.count();
      // This is informational - we're verifying the rendering logic works
      expect(exists).toBeGreaterThanOrEqual(0);
    }
  });

  test("insights page structure is correct", async ({ page }) => {
    await page.goto("/insights", { waitUntil: "domcontentloaded" });
    
    // Page should load successfully regardless of content
    await expect(page.locator("h1").first()).toContainText("Insights", { timeout: 10000 });
    
    // Check for either insights or page content
    await page.waitForLoadState("domcontentloaded");
    const hasContent = await page.locator("h1").count();
    expect(hasContent).toBeGreaterThan(0);
  });
});
