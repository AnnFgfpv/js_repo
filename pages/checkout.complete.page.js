export class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.completionMessage = page.locator('[data-test="complete-header"]'); 
    this.backHomeButton = page.locator('[data-test="back-to-products"]'); 
  }

  async getCompletionMessage() {
    return this.completionMessage.textContent();
  }
// еще один не нужный для задания метод
// но нужный для кнопки back home
   async goBackHome() {
    await this.backHomeButton.click();
  }
}
