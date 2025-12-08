import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';

test.describe('Inventory Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Verify inventory item count", async ({ page }) => {
        const itemCount = await inventoryPage.getInventoryItemCount();
        expect(itemCount).toBe(6);
    });

    test("Open item details from inventory", async ({ page }) => {
        await inventoryPage.openItemDetailsByIndex(0);
        const itemTitle = page.locator('.inventory_details_name');
        await expect(itemTitle).toBeVisible();
        await expect(itemTitle).toHaveText('Sauce Labs Backpack');
    });
});

