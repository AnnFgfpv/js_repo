import { test, expect } from "@playwright/test";

test.describe("Item Details Page Tests", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await page.click(".inventory_item_name", { index: 0 });
  });

  test("Add item to cart from details page", async ({ page }) => {
    await page.click("[data-test='add-to-cart']");
    const badge = page.locator(".shopping_cart_badge");

    await expect(badge).toHaveText("1");
  });

  test("Back to inventory button works", async ({ page }) => {
    await page.click("[data-test='back-to-products']");
    await expect(page).toHaveURL(/inventory.html/);
  });

    test("Item details are displayed correctly", async ({ page }) => {
    const itemName = page.locator(".inventory_details_name");
    const itemDescription = page.locator(".inventory_details_desc");
    const itemPrice = page.locator(".inventory_details_price");
    const addToCartButton = page.locator("[data-test='add-to-cart']");
    const backToProductsButton = page.locator("[data-test='back-to-products']");
    await expect(itemName).toHaveText("Sauce Labs Backpack");
    await expect(itemDescription).toBeVisible();
    await expect(itemDescription).toContainText("carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.");
    await expect(itemPrice).toHaveText("$29.99");
    await expect(addToCartButton).toBeVisible();
    await expect(backToProductsButton).toBeVisible();
  });
});
