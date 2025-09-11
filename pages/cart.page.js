export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getCartItemName() {
    return this.cartItems.first().locator('.inventory_item_name').textContent();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
  await this.continueShoppingButton.click();
}
}
