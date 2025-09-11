export class CheckoutStepOnePage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
  }

  async fillUserInfo() {
    await this.firstNameInput.fill('Test');
    await this.lastNameInput.fill('User');
    await this.postalCodeInput.fill('12345');
    await this.continueButton.click();
  }
}
