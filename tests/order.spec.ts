import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { OrderSubmittedPage } from '../pages/order-submitted-page';

test.describe('Order Submission Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let orderSubmittedPage: OrderSubmittedPage;
    const firstItemAddToCartButton = 'button[data-test="add-to-cart-sauce-labs-backpack"]';


    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        orderSubmittedPage = new OrderSubmittedPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Submit an order and verify confirmation", async ({ page }) => {
        await page.click(firstItemAddToCartButton);
        await page.click('.shopping_cart_link');
        await page.click('button[data-test="checkout"]');
        await page.fill('input[data-test="firstName"]', 'User');
        await page.fill('input[data-test="lastName"]', 'Userov');
        await page.fill('input[data-test="postalCode"]', '12345');
        await page.click('[data-test="continue"]');
        await page.click('button[data-test="finish"]');
        const confirmationMessage = await orderSubmittedPage.getThankYouMessage();
        expect(confirmationMessage).toBe('Thank you for your order!');
    });
});