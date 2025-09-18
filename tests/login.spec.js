const { test, expect } = require('@playwright/test');

test.describe('Авторизация на Sauce Demo @ui', () => {

  // Первый тест
  test('Пользователь должен успешно войти в систему', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');

    await page.locator('[placeholder="Password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();
    
    expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  // Второй тест
  test('Пользователь не должен войти в систему', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('locked_out_user');

    await page.locator('[placeholder="Password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

});
