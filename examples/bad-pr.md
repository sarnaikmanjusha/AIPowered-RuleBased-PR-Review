# Bad PR Example

This example highlights common anti-patterns that the review engine should flag.

## What is problematic

- Uses `waitForTimeout()` to hide synchronization issues.
- Contains hardcoded tokens and credentials.
- Uses `page.$()` instead of the Locator API.
- Mixes test data and UI logic into the same workflow.

## Example

```ts
import { test } from '@playwright/test';

test('submits a form', async ({ page }) => {
  await page.waitForTimeout(5000);
  const element = await page.$('#save');
  await element?.click();
});
```
