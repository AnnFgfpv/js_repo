import { test, expect } from "@playwright/test";

test.describe("Cart Page Tests", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
  });

  test("Add items to cart", async ({ page }) => {
    await page.click("[data-test='add-to-cart-sauce-labs-backpack']");
    await page.click("[data-test='add-to-cart-sauce-labs-bike-light']");
    await page.click("[data-test='add-to-cart-sauce-labs-bolt-t-shirt']");
    await page.click("[data-test='add-to-cart-sauce-labs-fleece-jacket']");
    await page.click("[data-test='add-to-cart-sauce-labs-onesie']");
    await page.click("[data-test='add-to-cart-test.allthethings()-t-shirt-(red)']");

    const badge = page.locator(".shopping_cart_badge");
    await expect(badge).toHaveText("6");
  });

   test("Remove item from cart", async ({ page }) => {
    await page.click("[data-test='add-to-cart-sauce-labs-backpack']");
    await page.click("[data-test='remove-sauce-labs-backpack']");
    await page.click("[data-test='add-to-cart-sauce-labs-bike-light']");
    await page.click("[data-test='remove-sauce-labs-bike-light']");
    await page.click("[data-test='add-to-cart-sauce-labs-bolt-t-shirt']");

    const badge = page.locator(".shopping_cart_badge");
    await expect(badge).toHaveText("1");
  });

  test("Continue shopping button works", async ({ page }) => {
    await page.click(".shopping_cart_link");
    await page.click("[data-test='continue-shopping']");

    await expect(page).toHaveURL(/inventory.html/);
  });
});
