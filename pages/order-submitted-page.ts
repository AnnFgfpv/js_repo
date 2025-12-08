import { Page, Locator } from '@playwright/test';
export class OrderSubmittedPage {
    readonly page: Page;
    readonly thankYouMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.thankYouMessage = page.locator('.complete-header');
    }
    async getThankYouMessage(): Promise<string> {
        return await this.thankYouMessage.textContent() || '';
    }
}