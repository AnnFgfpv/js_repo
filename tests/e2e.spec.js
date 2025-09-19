import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { InventoryPage } from '../pages/inventory.page.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutStepOnePage } from '../pages/checkout.step1.page.js';
import { CheckoutStepTwoPage } from '../pages/checkout.step2.page.js';
import { CheckoutCompletePage } from '../pages/checkout.complete.page.js';

test('Успешный логин и проверка страницы товаров', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  const checkoutCompletePage = new CheckoutCompletePage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const pageTitle = await inventoryPage.getPageTitle();
  expect(pageTitle).toBe('Products');

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')

  const itemName = await inventoryPage.addMostExpensiveItemToCart();
  await inventoryPage.openCart();

  const cartItemName = await cartPage.getCartItemName();
  expect(cartItemName).toBe(itemName);
  await cartPage.goToCheckout();

  await checkoutStepOnePage.fillUserInfo('Test', 'User', '12345');
  await checkoutStepTwoPage.finishCheckout();

  const message = await checkoutCompletePage.getCompletionMessage();
  expect(message).toBe('Thank you for your order!');
});
