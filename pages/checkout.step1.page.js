export class CheckoutStepOnePage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
  }

  async fillUserInfo(firstNameInput, lastNameInput, postalCodeInput) {
    await this.firstNameInput.fill(firstNameInput);
    await this.lastNameInput.fill(lastNameInput);
    await this.postalCodeInput.fill(postalCodeInput);
    await this.continueButton.click();
  }
}
