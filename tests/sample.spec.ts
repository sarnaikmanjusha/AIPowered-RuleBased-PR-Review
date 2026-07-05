import { test, expect } from '@playwright/test';

test('demonstrates a flaky wait pattern', async ({ page }) => {
  await page.waitForTimeout(5000);
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
});

test('uses a legacy selector pattern', async ({ page }) => {
  const element = await page.$('#save');
  if (element) {
    await element.click();
  }
});
