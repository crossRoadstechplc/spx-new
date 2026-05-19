/* Final Phase: E2E tests for admin insights management */
import path from "path";
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

  test("upload image block on new insight", async ({ page }) => {
    const runId = Date.now();
    await page.goto("/admin/insights/new", { waitUntil: "networkidle" });
    await page.locator("#title").fill(`Insight with Image ${runId}`);
    await page.fill('textarea[name="excerpt"]', "Testing inline image upload");
    await fillMinimumInsightBody(page);
    await setUniqueInsightSlug(page, `e2e-image-${runId}`);

    await page.getByRole("button", { name: /Image$/ }).click();
    const fileInput = page.locator('input[type="file"][accept="image/*"]').last();
    await fileInput.setInputFiles(path.join(__dirname, "fixtures", "test-upload.png"));
    await expect(page.getByText("Uploading...")).not.toBeVisible({ timeout: 30000 });
    await expect(page.locator("img").first()).toBeVisible({ timeout: 15000 });

    await submitInsightForm(page);
    await expect(page).toHaveURL(/\/admin\/insights\/?$/, { timeout: 30000 });
    await expect(page.getByRole("link", { name: `Insight with Image ${runId}`, exact: true })).toBeVisible({
      timeout: 15000,
    });
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
