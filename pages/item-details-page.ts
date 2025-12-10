import { Page, Locator } from '@playwright/test';
export class ItemDetailsPage {
    readonly page: Page;
    readonly addToCartButton: Locator;
    readonly backToInventoryButton: Locator;
    readonly itemName: Locator;
    readonly itemPrice: Locator;
    readonly itemDescription: Locator;
    readonly itemTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addToCartButton = page.locator('[data-test="add-to-cart"]');
        this.backToInventoryButton = page.locator('[data-test="back-to-products"]');
        this.itemName = page.locator('[data-test="inventory-item-name"]');
        this.itemPrice = page.locator('[data-test="inventory-item-price"]');
        this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
        this.itemTitle = page.locator('.inventory_details_name');
    }

    async addItemToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    async backToInventory(): Promise<void> {
        await this.backToInventoryButton.click();
    }

    async getItemName(): Promise<string> {
        return await this.itemName.textContent() || '';
    }

    async getItemPrice(): Promise<string> {
        return await this.itemPrice.textContent() || '';
    }

    async getItemDescription(): Promise<string> {
        return await this.itemDescription.textContent() || '';
    }

    async getItemTitle(): Promise<Locator> {
        return this.itemTitle;
    }
}

