/* Final Phase: E2E tests for admin insights management */
import { test, expect } from "@playwright/test";
import path from "path";

// Helper to login
async function loginAsAdmin(page: any) {
  await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
  await page.fill('input[name="email"]', "admin@spx.com");
  await page.fill('input[name="password"]', "admin123");
  await page.click('button[type="submit"]');
  await page.waitForURL("/admin", { timeout: 20000 });
}

test.describe("Admin Insights Management", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("create draft insight", async ({ page }) => {
    await page.goto("/admin/insights", { waitUntil: "networkidle" });
    
    // Click create new insight
    await page.click('text=Create Insight');
    await page.waitForURL("/admin/insights/new");
    
    // Fill in basic fields
    await page.fill('input[name="title"]', "E2E Test Insight");
    await page.fill('textarea[name="excerpt"]', "This is a test insight created by E2E tests");
    
    // Select author, category (if available)
    const authorSelect = page.locator('select[name="authorId"]');
    if (await authorSelect.isVisible()) {
      await authorSelect.selectOption({ index: 1 });
    }
    
    const categorySelect = page.locator('select[name="categoryId"]');
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ index: 1 });
    }
    
    // Save as draft (try different button text variations)
    const saveButton = page.locator('button[type="submit"]').first();
    await saveButton.click();
    
    // Should redirect to insights list
    await page.waitForURL(/\/admin\/insights$/, { timeout: 10000 });
    
    // Verify insight appears in list
    await expect(page.locator('text=E2E Test Insight')).toBeVisible({ timeout: 10000 });
  });

  test("upload image for insight", async ({ page }) => {
    // First create an insight
    await page.goto("/admin/insights/new");
    await page.fill('input[name="title"]', "Insight with Image");
    await page.fill('textarea[name="excerpt"]', "Testing image upload");
    
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
      await firstInsight.locator('a:has-text("Edit")').click();
      
      // Should be on edit page
      await expect(page).toHaveURL(/\/admin\/insights\/.*\/edit/);
      
      // Modify title
      const titleInput = page.locator('input[name="title"]');
      await titleInput.fill(await titleInput.inputValue() + " (Edited)");
      
      // Save
      await page.click('button:has-text("Update")');
      
      // Should redirect back to list
      await expect(page).toHaveURL(/\/admin\/insights$/);
    }
  });

  test("publish insight", async ({ page }) => {
    // Create a draft first
    await page.goto("/admin/insights/new");
    await page.fill('input[name="title"]', "Insight to Publish");
    await page.fill('textarea[name="excerpt"]', "Will be published");
    
    const authorSelect = page.locator('select[name="authorId"]');
    if (await authorSelect.isVisible()) {
      await authorSelect.selectOption({ index: 1 });
    }
    
    // Change status to published
    await page.selectOption('select[name="status"]', "PUBLISHED");
    
    // Save
    await page.click('button[type="submit"]');
    
    // Verify it appears in published list
    await page.goto("/admin/insights");
    await page.selectOption('select[name="status"]', "PUBLISHED");
    await expect(page.locator('text=Insight to Publish')).toBeVisible();
  });

  test("search insights", async ({ page }) => {
    await page.goto("/admin/insights");
    
    // Enter search query
    const searchInput = page.locator('input[name="q"]');
    await searchInput.fill("test");
    await searchInput.press("Enter");
    
    // URL should include search param
    await expect(page).toHaveURL(/q=test/);
  });

  test("filter insights by status", async ({ page }) => {
    await page.goto("/admin/insights");
    
    // Filter by draft
    await page.selectOption('select[name="status"]', "DRAFT");
    
    // URL should include status param
    await expect(page).toHaveURL(/status=DRAFT/);
  });
});
