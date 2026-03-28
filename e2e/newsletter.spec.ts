/* E2E: Newsletter signup, API, unsubscribe UX, admin list */
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-login";

test.describe("Newsletter (public)", () => {
  test("homepage newsletter section subscribes successfully", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Get SPX Insights in Your Inbox" })).toBeVisible({
      timeout: 15000,
    });
    const email = `e2e-ui-${Date.now()}@example.com`;
    await page.getByRole("textbox", { name: "Email address" }).fill(email);
    await page.getByRole("button", { name: "Subscribe" }).click();
    await expect(
      page.getByText(/registered|already registered|notify you when new insights are published/i)
    ).toBeVisible({ timeout: 20000 });
  });

  test("public unsubscribe page shows message for unknown token", async ({ page }) => {
    await page.goto("/newsletter/unsubscribe/00000000-0000-0000-0000-000000000000");
    await expect(page.getByRole("heading", { name: "SPX Newsletter" })).toBeVisible();
    await expect(page.getByText(/invalid or has expired/i)).toBeVisible();
  });

  test("legacy API unsubscribe URL redirects to public unsubscribe page", async ({ page }) => {
    await page.goto("/api/newsletter/unsubscribe?token=legacy-redirect-e2e");
    await expect(page).toHaveURL(/\/newsletter\/unsubscribe\//);
  });
});

test.describe("Newsletter (API)", () => {
  test("subscribe returns success", async ({ request }) => {
    const email = `e2e-api-${Date.now()}@example.com`;
    const res = await request.post("/api/newsletter/subscribe", {
      data: { email },
    });
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { success: boolean; status: string };
    expect(body.success).toBe(true);
    expect(body.status).toBe("subscribed");
  });

  test("duplicate subscribe returns already_subscribed", async ({ request }) => {
    const email = `e2e-dup-${Date.now()}@example.com`;
    const first = await request.post("/api/newsletter/subscribe", { data: { email } });
    expect(first.ok()).toBeTruthy();
    const second = await request.post("/api/newsletter/subscribe", { data: { email } });
    expect(second.ok()).toBeTruthy();
    const body = (await second.json()) as { success: boolean; status: string };
    expect(body.success).toBe(true);
    expect(body.status).toBe("already_subscribed");
  });

  test("invalid email returns 400", async ({ request }) => {
    const res = await request.post("/api/newsletter/subscribe", {
      data: { email: "not-an-email" },
    });
    expect(res.status()).toBe(400);
  });
});

test.describe("Newsletter (admin)", () => {
  test("new subscriber appears in admin newsletter list", async ({ page, request }) => {
    const email = `e2e-admin-list-${Date.now()}@example.com`;
    const res = await request.post("/api/newsletter/subscribe", { data: { email } });
    expect(res.ok()).toBeTruthy();

    await loginAsAdmin(page);
    await page.goto("/admin/newsletter", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Newsletter", exact: true })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(email, { exact: true })).toBeVisible({ timeout: 10000 });
  });
});
