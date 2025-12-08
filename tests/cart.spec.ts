import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { CartPage } from '../pages/cart-page';

test.describe('Cart Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    const firstItemAddToCartButton = 'button[data-test="add-to-cart-sauce-labs-backpack"]';

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Add item to cart and verify", async ({ page }) => {
        await page.click(firstItemAddToCartButton);
        await page.click('.shopping_cart_link');
        const cartItemCount = await cartPage.getCartItemCount();
        expect(cartItemCount).toBe(1);
    });
    test("Proceed to checkout from cart", async ({ page }) => {
        await page.click(firstItemAddToCartButton);
        await page.click('.shopping_cart_link');
        await cartPage.proceedToCheckout();
        const checkoutInfoHeader = page.locator('.checkout_info_container');
        await expect(checkoutInfoHeader).toBeVisible();
    });

    test("Continue shopping from cart", async ({ page }) => {
        await page.click(firstItemAddToCartButton);
        await page.click('.shopping_cart_link');
        await cartPage.continueShopping();
        const inventoryContainer = page.locator('.inventory_list');
        await expect(inventoryContainer).toBeVisible();
    });
});
