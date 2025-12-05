import { test, expect } from "@playwright/test";

test.describe("Checkout Process Tests", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await page.click("[data-test='add-to-cart-sauce-labs-backpack']");
    //const itemPriceOnInventory = await page.locator("[data-test='inventory-item-price']").nth(1).textContent();
    //const itemPriceOnInventoryNumber = parseFloat(itemPriceOnInventory.replace('Item total: $', ''));
    await page.click(".shopping_cart_link");
  });

  test("Checkout form validation with no data", async ({ page }) => {
    await page.click("[data-test='checkout']");
    await page.click("[data-test='continue']");

    const error = page.locator("[data-test='error']");
    await expect(error).toContainText("First Name is required");
  });

  test("Complete full checkout", async ({ page }) => {
    await page.click("[data-test='checkout']");

    await page.fill("[data-test='firstName']", "User");
    await page.fill("[data-test='lastName']", "Userov");
    await page.fill("[data-test='postalCode']", "12345");
    await page.click("[data-test='continue']");

    await expect(page).toHaveURL(/checkout-step-two/);
    
    await expect(page.locator("[data-test='payment-info-label']")).toContainText("Payment Information");
    await expect(page.locator("[data-test='shipping-info-label']")).toContainText("Shipping Information");
    await expect(page.locator("[data-test='total-info-label']")).toContainText("Price Total");
    await expect(page.locator("[data-test='subtotal-label']")).toContainText("Item total:");
    await expect(page.locator("[data-test='subtotal-label']")).toContainText("29.99");
    //const itemTotal = page.locator("[data-test='subtotal-label']").nth(0).textContent();
    //const itemTotalNumber = parseFloat(itemTotal.replace('Item total: $', ''));
    //await expect(itemTotalNumber).toBe(parseFloat(itemPriceOnInventoryNumber.toFixed(2)));
    await expect(page.locator('[data-test="complete-header"]')).toHaveText("Thank you for your order!");
  });
});
