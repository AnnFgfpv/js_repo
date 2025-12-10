import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { OrderSubmittedPage } from '../pages/order-submitted-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import { CheckoutOverviewPage } from '../pages/checkout-overview-page';

test.describe('Order Submission Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let orderSubmittedPage: OrderSubmittedPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let checkoutOverviewPage: CheckoutOverviewPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        orderSubmittedPage = new OrderSubmittedPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        checkoutOverviewPage = new CheckoutOverviewPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Submit an order and verify confirmation", async ({ page }) => {
        await inventoryPage.addFirstItemToCart();
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.enterCheckoutInformation('User', 'Userov', '12345');
        await checkoutPage.continueCheckout();
        await checkoutOverviewPage.finishCheckout();
        const confirmationMessage = await orderSubmittedPage.getThankYouMessage();
        expect(confirmationMessage).toBe('Thank you for your order!');
    });
});