import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ItemDetailsPage } from '../pages/item-details-page';
import { InventoryPage } from '../pages/inventory-page';
import { CartPage } from '../pages/cart-page';

test.describe('Item Details Tests', () => {
    let loginPage: LoginPage;
    let itemDetailsPage: ItemDetailsPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        itemDetailsPage = new ItemDetailsPage(page);
        cartPage = new CartPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test("Verify item details page content", async ({ page }) => {
         await inventoryPage.openItemDetailsByIndex(0);
        const itemName = await itemDetailsPage.getItemName();
        const itemDescription = await itemDetailsPage.getItemDescription();
        const itemPrice = await itemDetailsPage.getItemPrice();
        expect(itemName).toBe('Sauce Labs Backpack');
        expect(itemDescription).toBe('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
        expect(itemPrice).toBe('$29.99');
    });

    test("Add item to cart from item details page", async ({ page }) => {
        await inventoryPage.openItemDetailsByIndex(0);
        await itemDetailsPage.addItemToCart();
        const cartBadgeCount = await cartPage.getCartBadgeCount();
        expect(cartBadgeCount).toBe(1);
    });
   
    test("Back to inventory from item details page", async ({ page }) => {
        await inventoryPage.openItemDetailsByIndex(0);
        await itemDetailsPage.backToInventory();
        const inventoryContainer = await inventoryPage.getInventoryContainer();
        await expect(inventoryContainer).toBeVisible();
    });
});