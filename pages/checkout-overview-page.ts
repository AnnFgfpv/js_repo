import { Page, Locator } from '@playwright/test';
export class CheckoutOverviewPage {
    readonly page: Page;
    readonly finishButton: Locator;
    readonly itemTotalLabel: Locator;
    readonly totalLabel: Locator;
    readonly quantityLabel: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.finishButton = page.locator('[data-test="finish"]');
        this.itemTotalLabel = page.locator('.summary_subtotal_label');
        this.totalLabel = page.locator('.summary_total_label');
        this.quantityLabel = page.locator('.cart_quantity');
    }
    
    async getItemQuantity(): Promise<string> {
        return await this.quantityLabel.textContent() || '';
    }

    async getItemTotal(): Promise<string> {
        return await this.itemTotalLabel.textContent() || '';
    }

    async getTotal(): Promise<string> {
        return await this.totalLabel.textContent() || '';
    }

    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }
}