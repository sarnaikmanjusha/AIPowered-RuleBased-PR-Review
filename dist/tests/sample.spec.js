"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)('demonstrates a flaky wait pattern', async ({ page }) => {
    await page.waitForTimeout(5000);
    await (0, test_1.expect)(page.getByRole('button', { name: 'Save' })).toBeVisible();
});
(0, test_1.test)('uses a legacy selector pattern', async ({ page }) => {
    const element = await page.$('#save');
    if (element) {
        await element.click();
    }
});
