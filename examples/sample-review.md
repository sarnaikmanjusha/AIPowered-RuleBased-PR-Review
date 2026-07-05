# Sample Review

This markdown example shows how a review report might summarize a finding.

## Finding Summary

- File: tests/sample.spec.ts
- Line: 3
- Category: Playwright
- Severity: High
- Rule: no-wait-for-timeout
- Issue: The test uses a hard wait instead of waiting on a real condition.
- Why it matters: Hard waits slow down the suite and increase flakiness.
- Recommended fix: Replace the delay with a locator-based assertion or event-based wait.

## Suggested Improvement

```ts
await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
```
