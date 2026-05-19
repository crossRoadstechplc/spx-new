/* E2E tests for admin media library upload and API */
import { test, expect } from "@playwright/test";
import path from "path";
import { loginAsAdmin } from "./helpers/admin-login";

const fixtureImage = path.join(__dirname, "fixtures", "test-upload.png");

test.describe("Admin Media", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("media library page loads", async ({ page }) => {
    await page.goto("/admin/media", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Media Library" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Upload Media", exact: true })).toBeVisible();
  });

  test("upload dialog opens with file input", async ({ page }) => {
    await page.goto("/admin/media", { waitUntil: "domcontentloaded" });
    await page.getByTestId("open-media-upload").click();
    await expect(page.getByTestId("media-upload-dialog")).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test("uploads image file to library", async ({ page }) => {
    await page.goto("/admin/media", { waitUntil: "domcontentloaded" });
    await page.getByTestId("open-media-upload").click();
    await expect(page.getByTestId("media-upload-dialog")).toBeVisible({ timeout: 10000 });

    const fileInput = page.getByTestId("media-upload-dialog").locator('input[type="file"]');
    await fileInput.setInputFiles(fixtureImage);

    await page.getByTestId("media-upload-dialog").getByRole("button", { name: "Upload", exact: true }).click();

    // Dialog closes and page reloads with new item (filename is scoped + uniquified)
    await expect(page.getByTestId("media-upload-dialog")).not.toBeVisible({
      timeout: 30000,
    });
    await expect(page.getByText(/library-test-upload/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("media API requires auth", async ({ request }) => {
    const response = await request.get("/admin/media/api");
    expect(response.status()).toBe(401);
  });

  test("media API returns images when authenticated", async ({ page, request }) => {
    // beforeEach already logs in; avoid double login navigation race.
    const cookies = await page.context().cookies();
    const response = await request.get("/admin/media/api", {
      headers: {
        cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; "),
      },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
