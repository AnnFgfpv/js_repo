import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { CheckoutPage } from '../pages/checkout-page';
import { CheckoutOverviewPage } from '../pages/checkout-overview-page';

test.describe('Checkout Tests', () => {
    let loginPage: LoginPage;
    let checkoutPage: CheckoutPage;
    let checkoutOverviewPage: CheckoutOverviewPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        checkoutPage = new CheckoutPage(page);
        checkoutOverviewPage = new CheckoutOverviewPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Fill in checkout information and verify", async ({ page }) => {
        await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await page.click('button[data-test="checkout"]');
        await checkoutPage.enterCheckoutInformation('User', 'Userov', '12345');
        await checkoutPage.continueCheckout();
    });

    test("Attempt checkout with missing information", async ({ page }) => {
        await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await page.click('button[data-test="checkout"]');
        await checkoutPage.continueCheckout();
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Error: First Name is required');
    });

    test("Verify total amount on checkout overview", async ({ page }) => {
        await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await page.click('button[data-test="checkout"]');
        await checkoutPage.enterCheckoutInformation('User', 'Userov', '12345');
        await checkoutPage.continueCheckout();

        const quantity = await checkoutOverviewPage.getItemQuantity();
        expect(quantity.trim()).toBe('1');

        const itemTotal = await checkoutOverviewPage.getItemTotal();
        expect(itemTotal).toBe('$29.99');

        const totalAmount = await checkoutOverviewPage.getTotal();
        expect(totalAmount).toBe('$32.39');
        
        await checkoutOverviewPage.finishCheckout();
    });
});
