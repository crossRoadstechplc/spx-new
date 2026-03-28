import type { Page } from "@playwright/test";

/** Strict insight content requires at least one text block with non-empty content */
export async function fillMinimumInsightBody(page: Page): Promise<void> {
  await page.locator('textarea[placeholder="Write text content..."]').first().fill("E2E minimum body content for validation.");
}

/** Clicks the primary save button (avoids other submit controls and native GET fallback). */
export async function submitInsightForm(page: Page): Promise<void> {
  await page.getByRole("button", { name: /Create Insight|Update Insight/ }).click();
}

/**
 * InsightForm auto-generates slug from title after ~500ms; fill a guaranteed-unique slug last
 * (after this wait) so it is not overwritten.
 */
export async function setUniqueInsightSlug(page: Page, slug: string): Promise<void> {
  await page.waitForTimeout(900);
  await page.fill('input[name="slug"]', slug);
}
