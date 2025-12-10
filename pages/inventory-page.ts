import { Page, Locator } from '@playwright/test';
export class InventoryPage {
    readonly page: Page;
    readonly inventoryItems: Locator;
    readonly inventoryContainer: Locator;
    readonly firstItemAddToCartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.locator('.inventory_item');
        this.inventoryContainer = page.locator('.inventory_list');
        this.firstItemAddToCartButton = page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]');
    }

    async getInventoryItemCount(): Promise<number> {
        return await this.inventoryItems.count();
    }

    async openItemDetailsByIndex(index: number): Promise<void> {
        const item = this.inventoryItems.nth(index);
        await item.locator('.inventory_item_name').click();
    }

    async addItemToCartByIndex(index: number): Promise<void> {
        const item = this.inventoryItems.nth(index);
        await item.locator('button[data-test^="add-to-cart-"]').first().click();
    }

    async getInventoryContainer(): Promise<Locator> {
        return this.inventoryContainer;
    }

    async addFirstItemToCart(): Promise<void> {
        await this.addItemToCartByIndex(0); 
    }
}