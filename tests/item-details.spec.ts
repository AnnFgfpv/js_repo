import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ItemDetailsPage } from '../pages/item-detailes-page';

test.describe('Item Details Tests', () => {
    let loginPage: LoginPage;
    let itemDetailsPage: ItemDetailsPage;
    let firstItemLink = '#item_4_title_link';

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        itemDetailsPage = new ItemDetailsPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Verify item details page content", async ({ page }) => {
        await page.click(firstItemLink);
        const itemName = await itemDetailsPage.getItemName();
        const itemDescription = await itemDetailsPage.getItemDescription();
        const itemPrice = await itemDetailsPage.getItemPrice();
        expect(itemName).toBe('Sauce Labs Backpack');
        expect(itemDescription).toBe('Carry all the things with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
        expect(itemPrice).toBe('$29.99');
    });

    test("Add item to cart from item details page", async ({ page }) => {
        await page.click(firstItemLink);
        await itemDetailsPage.addItemToCart();
        const cartBadge = page.locator('.shopping_cart_badge');
        await expect(cartBadge).toBeVisible();
        await expect(cartBadge).toHaveText('1');
    });
   
    test("Back to inventory from item details page", async ({ page }) => {
        await page.click(firstItemLink);
        await itemDetailsPage.backToInventory();
        const inventoryContainer = page.locator('.inventory_list');
        await expect(inventoryContainer).toBeVisible();
    });
});