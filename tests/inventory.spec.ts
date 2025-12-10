import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { ItemDetailsPage } from '../pages/item-details-page';

test.describe('Inventory Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let itemDetailsPage: ItemDetailsPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        itemDetailsPage = new ItemDetailsPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Verify inventory item count", async ({ page }) => {
        const itemCount = await inventoryPage.getInventoryItemCount();
        expect(itemCount).toBe(6);
    });

    test("Open item details from inventory", async ({ page }) => {
        await inventoryPage.openItemDetailsByIndex(0);
        const itemTitle = await itemDetailsPage.getItemTitle();
        await expect(itemTitle).toBeVisible();
        await expect(itemTitle).toHaveText('Sauce Labs Backpack');
    });
});

