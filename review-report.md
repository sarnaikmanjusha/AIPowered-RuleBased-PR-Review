# PR Review Report

Reviewed 2 file(s) and found 5 issue(s).

## AI Review
- Status: fallback
- Caveman review: Use of waitForTimeout is discouraged in Playwright tests. at tests/sample.spec.ts:4. Fix it with replace it with auto-waiting locators or explicit expect polling. (OpenAI fallback: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.)

## Rule-based Findings
- [tests/sample.spec.ts:4] Use of waitForTimeout is discouraged in Playwright tests. (High)
- [tests/sample.spec.ts:9] Legacy page.$ usage detected. (Medium)
- [tests/sample.ts:2] Potential hardcoded secret detected. (Critical)
- [tests/sample.ts:3] Potential hardcoded secret detected. (Critical)
- [tests/sample.ts:7] The use of `any` weakens type safety. (High)