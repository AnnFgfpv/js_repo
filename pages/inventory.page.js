export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.itemCards = page.locator('.inventory_item');
    this.priceHighToLow = page.locator('[data-test="product-sort-container"]');
    this.addToCartButton = page.locator('.inventory_item button.btn_inventory');
  }

  async getPageTitle() {
    return this.title.textContent();
  }

  async addMostExpensiveItemToCart() {
    await this.priceHighToLow.waitFor({ state: 'visible' });
    await this.priceHighToLow.selectOption('hilo'); // сортировка от дорогого к дешевому
    const firstItem = this.itemCards.first();
    const itemName = await firstItem.locator('.inventory_item_name').textContent();
    await firstItem.locator('button').click();
    return itemName;
  }

  async openCart() {
    await this.cartIcon.click();
  }
}
