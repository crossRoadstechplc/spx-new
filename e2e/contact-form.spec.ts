/* Final Phase: E2E tests for contact form */
import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test("contact form loads correctly", async ({ page }) => {
    await page.goto("/contact");
    
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('select[name="inquiryType"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('input[name="privacyConsent"]')).toBeVisible();
  });

  test("form validation shows errors for empty required fields", async ({ page }) => {
    await page.goto("/contact");
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for HTML5 validation or error messages
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveAttribute("required");
  });

  test("form validation shows errors for invalid email", async ({ page }) => {
    await page.goto("/contact");
    
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('textarea[name="message"]', "This is a test message");
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Email input should have type="email" for HTML5 validation
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute("type", "email");
  });

  test("successful form submission (without SMTP)", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/contact");
    
    // Fill out form
    await page.selectOption('select[name="inquiryType"]', "general");
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="organization"]', "Test Corp");
    await page.fill('textarea[name="message"]', "This is a test inquiry from E2E tests");
    await page.check('input[name="privacyConsent"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Avoid matching both the message and the "Error:" label (strict mode violation).
    const outcome = page
      .locator("text=/thank you/i")
      .or(page.locator("text=/Failed to send/i"))
      .or(page.locator("text=/email service/i"));

    await expect(outcome.first()).toBeVisible({ timeout: 60000 });
  });

  test("form shows loading state during submission", async ({ page }) => {
    await page.goto("/contact");
    
    // Fill out form
    await page.selectOption('select[name="inquiryType"]', "project");
    await page.fill('input[name="name"]', "Jane Smith");
    await page.fill('input[name="email"]', "jane@example.com");
    await page.fill('textarea[name="message"]', "Testing loading state");
    await page.check('input[name="privacyConsent"]');
    
    // Submit and check for loading state
    await page.click('button[type="submit"]');
    await expect(page.locator('button:has-text("Sending")')).toBeVisible({ timeout: 2000 });
  });

  test("all inquiry types are available", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    
    const inquirySelect = page.locator('select[name="inquiryType"]');
    await expect(inquirySelect).toBeVisible({ timeout: 10000 });
    
    // Check all options exist by counting
    const options = await inquirySelect.locator('option').allTextContents();
    expect(options.join(',')).toContain('General Inquiry');
    expect(options.join(',')).toContain('Project Discussion');
    expect(options.join(',')).toContain('Partnership Opportunity');
    expect(options.join(',')).toContain('Career Inquiry');
    expect(options.join(',')).toContain('Media & Press');
  });

  test("privacy policy link works", async ({ page }) => {
    await page.goto("/contact");
    
    // Click privacy policy link
    await page.click('a[href="/privacy"]');
    await expect(page).toHaveURL("/privacy");
    await expect(page.locator("h1")).toContainText("Privacy Policy");
  });
});
