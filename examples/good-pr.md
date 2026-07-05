# Good PR Example

This example shows a review-friendly Playwright TypeScript change.

## What is good

- Uses `getByRole()` and `expect()` for reliable assertions.
- Keeps test data in fixtures rather than embedding it in page objects.
- Avoids hardcoded secrets and unnecessary waits.
- Uses explicit, readable naming for actions and helpers.

## Example

```ts
import { test, expect } from '@playwright/test';

test('submits a form successfully', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Order placed')).toBeVisible();
});
```
