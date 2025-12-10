import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test("Login test with valid credentials", async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        const itemCount = await inventoryPage.getInventoryItemCount();
        expect(itemCount).toBe(6);
    });

    test("Login test with invalid credentials", async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goTo();
        await loginPage.login('', '');
        const errorMessage = await loginPage.getErrorMessage();
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Epic sadface: Username is required');
    });

    test("Login test with empty credentials", async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goTo();
        await loginPage.login('', '');
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Epic sadface: Username is required');
    });

    test("Login with locked out user", async ({ page }) => {
        const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login('locked_out_user', 'secret_sauce');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });
});