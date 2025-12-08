import { Page, Locator } from '@playwright/test';
export class InventoryPage {
    readonly page: Page;
    readonly inventoryItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.locator('.inventory_item');
    }

    async getInventoryItemCount(): Promise<number> {
        return await this.inventoryItems.count();
    }

    async openItemDetailsByIndex(index: number): Promise<void> {
        const item = this.inventoryItems.nth(index);
        await item.locator('a.inventory_item_link').click();
    }
}