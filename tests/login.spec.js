import { test, expect } from '@playwright/test';

const baseURL = 'https://www.saucedemo.com';

test.describe('Login Page Tests', () => {

  test('Login with valid user (standard_user)', async ({ page }) => {
    await page.goto(baseURL);

    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Login with locked_out_user should show error', async ({ page }) => {
    await page.goto(baseURL);

    await page.fill('#user-name', 'locked_out_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toContainText('locked out');
  });

  test('Validation: empty username and password', async ({ page }) => {
    await page.goto(baseURL);
    await page.click('#login-button');

    const error = page.locator('[data-test="error"]');
    await expect(error).toContainText('Username is required');
  });

  test('Validation: empty password', async ({ page }) => {
    await page.goto(baseURL);
    await page.fill('#user-name', 'standard_user');
    await page.click('#login-button');

    const error = page.locator('[data-test="error"]');
    await expect(error).toContainText('Password is required');
  });
});
