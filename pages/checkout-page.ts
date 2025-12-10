import { Page, Locator } from '@playwright/test';
export class CheckoutPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly errorMessage: Locator;
    readonly checkoutInfoHeader: Locator;


    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.checkoutInfoHeader = page.locator('.checkout_info_container');
    }

    async enterCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continueCheckout(): Promise<void> {
        await this.continueButton.click();
    }

    async getCheckoutInfoHeader(): Promise<Locator> {
        return this.checkoutInfoHeader;
    }

    async getErrorMessage(): Promise<Locator> {
        return this.errorMessage;
    }
}

   