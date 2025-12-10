import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';

test.describe('Cart Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Add item to cart and verify", async ({ page }) => {
       await inventoryPage.addFirstItemToCart();
       await cartPage.goToCart();
       const cartItemCount = await cartPage.getCartItemCount();
       expect(cartItemCount).toBe(1);
    });

    test("Continue shopping from cart", async ({ page }) => {
        await inventoryPage.addFirstItemToCart();
        await cartPage.goToCart();
        await cartPage.continueShopping();
        const inventoryContainer = await inventoryPage.getInventoryContainer();
        await expect(inventoryContainer).toBeVisible();
    });

    test("Remove item from cart and verify", async ({ page }) => {
        await inventoryPage.addFirstItemToCart();
        await cartPage.goToCart();
        await cartPage.removeItemFromCart();
        const cartItemCount = await cartPage.getCartItemCount();
        expect(cartItemCount).toBe(0);
    });

     test("Proceed to checkout from cart", async () => {
        await inventoryPage.addItemToCartByIndex(0);
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        const checkoutInfoHeader = await checkoutPage.getCheckoutInfoHeader();
        await expect(checkoutInfoHeader).toBeVisible();
    });
});
