import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { InventoryPage } from '../pages/inventory.page.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutStepOnePage } from '../pages/checkout.step1.page.js';
import { CheckoutStepTwoPage } from '../pages/checkout.step2.page.js';
import { CheckoutCompletePage } from '../pages/checkout.complete.page.js';

test('Успешный логин и проверка страницы товаров', async ({ page }) => {

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const pageTitle = await inventoryPage.getPageTitle();
  expect(pageTitle).toBe('Products');

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')

  const itemName = await inventoryPage.addItemToCart();
  await inventoryPage.openCart();

  const cartPage = new CartPage(page);
  const cartItemName = await cartPage.getCartItemName();
  expect(cartItemName).toBe(itemName);
  await cartPage.goToCheckout();

  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  await checkoutStepOnePage.fillUserInfo();

  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  await checkoutStepTwoPage.finishCheckout();

  const checkoutCompletePage = new CheckoutCompletePage(page);
  const message = await checkoutCompletePage.getCompletionMessage();
  expect(message).toBe('Thank you for your order!');
});
