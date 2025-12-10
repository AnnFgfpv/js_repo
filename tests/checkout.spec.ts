import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { CheckoutPage } from '../pages/checkout-page';
import { CheckoutOverviewPage } from '../pages/checkout-overview-page';
import { InventoryPage } from '../pages/inventory-page';
import { CartPage } from '../pages/cart-page';

test.describe('Checkout Tests', () => {
    let loginPage: LoginPage;
    let checkoutPage: CheckoutPage;
    let checkoutOverviewPage: CheckoutOverviewPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        checkoutOverviewPage = new CheckoutOverviewPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Fill in checkout information and verify", async ({ page }) => {
        await inventoryPage.addFirstItemToCart();
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.enterCheckoutInformation('User', 'Userov', '12345');
        await checkoutPage.continueCheckout();
    });

    test("Attempt checkout with missing information", async ({ page }) => {
        await inventoryPage.addFirstItemToCart();
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.continueCheckout();
        const errorMessage = await checkoutPage.getErrorMessage();
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Error: First Name is required');
    });

    test("Verify total amount on checkout overview", async ({ page }) => {
        await inventoryPage.addFirstItemToCart();
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.enterCheckoutInformation('User', 'Userov', '12345');
        await checkoutPage.continueCheckout();

        const quantity = await checkoutOverviewPage.getItemQuantity();
        expect(quantity.trim()).toBe('1');

        const itemTotal = await checkoutOverviewPage.getItemTotal();
        expect(itemTotal).toBe('Item total: $29.99');

        const totalAmount = await checkoutOverviewPage.getTotal();
        expect(totalAmount).toBe('Total: $32.39');
        
        await checkoutOverviewPage.finishCheckout();
    });
});
