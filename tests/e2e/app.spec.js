import { test, expect } from "@playwright/test";

test.describe("AI-Free Zones app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for Calcite shell to be defined
    await page.waitForFunction(() =>
      customElements.get("calcite-shell") !== undefined
    );
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test("page title is correct", async ({ page }) => {
    await expect(page).toHaveTitle(/AI-Free Zones/);
  });

  test("navigation header renders the app name", async ({ page }) => {
    const logo = page.locator("calcite-navigation-logo");
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("heading", "AI-Free Zones");
  });

  test("map container element exists in the DOM", async ({ page }) => {
    const mapEl = page.locator("#map-container");
    await expect(mapEl).toBeAttached();
  });

  test("shell panel is present", async ({ page }) => {
    await expect(page.locator("calcite-shell-panel")).toBeVisible();
  });

  // ── Map renders ─────────────────────────────────────────────────────────────

  test("ArcGIS MapView canvas renders within the map container", async ({ page }) => {
    // The SDK injects a <canvas> element once the view is ready.
    const canvas = page.locator("#map-container canvas").first();
    await expect(canvas).toBeVisible({ timeout: 20000 });
  });

  test("no uncaught JS errors on load", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.waitForTimeout(3000);
    expect(errors).toHaveLength(0);
  });

  // ── Ranked list ─────────────────────────────────────────────────────────────

  test("ranked list is populated with at least 10 items", async ({ page }) => {
    const list = page.locator("#ranked-list calcite-list-item");
    await expect(list.first()).toBeVisible({ timeout: 10000 });
    const count = await list.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test("ranked list items have a data-iso attribute", async ({ page }) => {
    const firstItem = page.locator("#ranked-list calcite-list-item").first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });
    const iso = await firstItem.getAttribute("data-iso");
    expect(iso).toMatch(/^[A-Z]{3}$/);
  });

  // ── Country selection ────────────────────────────────────────────────────────

  test("clicking a ranked list item reveals the detail block", async ({ page }) => {
    const firstItem = page.locator("#ranked-list calcite-list-item").first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    // Dispatch the calciteListItemSelect event the Calcite component fires
    await firstItem.dispatchEvent("calciteListItemSelect");

    await expect(page.locator("#detail-block")).toBeVisible({ timeout: 5000 });
  });

  test("detail block shows a score after selecting a country", async ({ page }) => {
    const firstItem = page.locator("#ranked-list calcite-list-item").first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    await firstItem.dispatchEvent("calciteListItemSelect");

    const detail = page.locator("#detail-content .detail-score-value");
    await expect(detail).toBeVisible({ timeout: 5000 });
    const text = await detail.textContent();
    // Score should be a number
    expect(Number(text?.trim())).not.toBeNaN();
  });

  // ── Legend ──────────────────────────────────────────────────────────────────

  test("legend is visible with 5 colour swatches", async ({ page }) => {
    const swatches = page.locator(".legend-swatch:not(.no-data)");
    await expect(swatches.first()).toBeVisible({ timeout: 10000 });
    const count = await swatches.count();
    expect(count).toBe(5);
  });
});
