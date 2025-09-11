export class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.total = page.locator('[data-test="total-label"]');
  }
// эти 2 метода лишние в задании
// но и локаторы для кол-ва товаров и цены тогда тоже
  async getCartItemsCount() {
    return await this.cartItems.count();
  }

   async getTotal() {
    return await this.total.textContent();
  }
  
// нужный метод)

  async finishCheckout() {
    await this.finishButton.click();
  }
}
