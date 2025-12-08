import { Page, Locator } from '@playwright/test';
export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;
    readonly removeButton: Locator;
    

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    }

    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async removeItemFromCart(): Promise<void> {
        await this.removeButton.click();
    }
}