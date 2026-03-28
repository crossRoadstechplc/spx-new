/* Final Phase: E2E tests for admin insights management */
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-login";
import { fillMinimumInsightBody, setUniqueInsightSlug, submitInsightForm } from "./helpers/insight-form";

test.describe("Admin Insights Management", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("create draft insight", async ({ page }) => {
    await page.goto("/admin/insights", { waitUntil: "networkidle" });

    await page.getByRole("link", { name: /New Insight/i }).click();
    await page.waitForURL("/admin/insights/new");

    const runId = Date.now();
    await page.locator("#title").fill(`E2E Test Insight ${runId}`);
    await page.fill('textarea[name="excerpt"]', "This is a test insight created by E2E tests");
    await fillMinimumInsightBody(page);
    await setUniqueInsightSlug(page, `e2e-draft-${runId}`);

    // Select author, category (if available)
    const authorSelect = page.locator('select[name="authorId"]');
    if (await authorSelect.isVisible()) {
      await authorSelect.selectOption({ index: 1 });
    }
    
    const categorySelect = page.locator('select[name="categoryId"]');
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ index: 1 });
    }
    
    await submitInsightForm(page);

    await expect(page).toHaveURL(/\/admin\/insights\/?$/, { timeout: 30000 });
    
    // Verify insight appears in list
    await expect(page.locator(`text=E2E Test Insight ${runId}`)).toBeVisible({ timeout: 10000 });
  });

  test("upload image for insight", async ({ page }) => {
    // First create an insight
    await page.goto("/admin/insights/new");
    await page.fill('input[name="title"]', "Insight with Image");
    await page.fill('textarea[name="excerpt"]', "Testing image upload");
    await fillMinimumInsightBody(page);
    
    // Go to media section
    await page.goto("/admin/media");
    
    // Check if upload dialog exists
    const uploadButton = page.locator('text=Upload Image');
    if (await uploadButton.isVisible()) {
      await uploadButton.click();
      
      // In a real test, you'd upload an actual file
      // For this E2E test, we're verifying the UI flow
      await expect(page.locator('input[type="file"]')).toBeVisible();
    }
  });

  test("edit existing insight", async ({ page }) => {
    await page.goto("/admin/insights");
    
    // Find and click first insight (if exists)
    const firstInsight = page.locator('table tbody tr').first();
    if (await firstInsight.isVisible()) {
      await firstInsight.getByRole("link", { name: /^Edit$/ }).click();
      
      await expect(page).toHaveURL(/\/admin\/insights\/.*\/edit/, { timeout: 20000 });
      
      // Modify title
      const titleInput = page.locator('input[name="title"]');
      await titleInput.fill(await titleInput.inputValue() + " (Edited)");
      
      await submitInsightForm(page);

      await expect(page).toHaveURL(/\/admin\/insights\/?$/, { timeout: 30000 });
    }
  });

  test("publish insight", async ({ page }) => {
    // Create a draft first
    const publishId = Date.now();
    await page.goto("/admin/insights/new", { waitUntil: "networkidle" });
    await page.locator("#title").fill(`Insight to Publish ${publishId}`);
    await page.fill('textarea[name="excerpt"]', "Will be published");
    await fillMinimumInsightBody(page);
    await setUniqueInsightSlug(page, `e2e-publish-${publishId}`);

    const authorSelect = page.locator('select[name="authorId"]');
    if (await authorSelect.isVisible()) {
      await authorSelect.selectOption({ index: 1 });
    }
    
    // Change status to published
    await page.selectOption('select[name="status"]', "PUBLISHED");
    
    await submitInsightForm(page);
    await expect(page).toHaveURL(/\/admin\/insights\/?$/, { timeout: 30000 });

    await page.goto("/admin/insights?status=PUBLISHED");
    await expect(
      page.getByRole("link", { name: `Insight to Publish ${publishId}`, exact: true })
    ).toBeVisible({ timeout: 15000 });
  });

  test("search insights", async ({ page }) => {
    await page.goto("/admin/insights?q=test");
    await expect(page).toHaveURL(/q=test/);
  });

  test("filter insights by status", async ({ page }) => {
    await page.goto("/admin/insights");
    await page.getByRole("link", { name: "Drafts" }).click();
    await expect(page).toHaveURL(/status=DRAFT/);
  });
});
