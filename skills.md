# Enterprise AI PR Review Standards

> Version 1.0 - High-signal review guidance for Playwright + TypeScript automation projects.

## Purpose

This document is the single source of truth for reviewing Playwright automation code with both rule-based and AI-assisted methods. The rules below focus on real mistakes seen in enterprise automation codebases: flaky waits, brittle selectors, poor POM design, weak test isolation, unsafe TypeScript patterns, and security risks.

## Review Principles

- Prefer actionable, high-impact rules over generic style advice.
- Flag issues that are likely to cause flakiness, maintenance pain, or security exposure.
- Emphasize reliability, readability, maintainability, and scalability.
- Recommend fixes that are practical for real teams and CI pipelines.

## Framework Architecture

- Keep the framework layered into pages, components, fixtures, helpers, API clients, and config.
- Separate test data from page objects so UI abstractions stay reusable.
- Avoid business logic duplication across tests and page objects.
- Keep dependencies flowing in one direction and avoid circular imports.
- Prefer configuration-driven design over hardcoded environment-specific values.
- Use fixtures and shared utilities to centralize repetitive setup.
- Keep the architecture easy to extend as the automation suite grows.

## Playwright Best Practices

- Avoid `page.waitForTimeout()` and other fixed sleeps in committed code.
- Prefer the Locator API over `page.$()` and `page.$$()`.
- Use Playwright `expect()` assertions instead of manual condition checks.
- Avoid `force: true` unless it is truly necessary and justified.
- Prefer role-based, text-based, or test-id selectors over brittle XPath or styling-based selectors.
- Use event-based waits for downloads, dialogs, popups, and navigation.
- Reuse locators within a test rather than recreating them repeatedly.
- Avoid `ElementHandle` when locators can express the intent more clearly.
- Ensure browser contexts and pages are closed after use.
- Use `expect.poll()` for state changes that evolve over time.

## Wait Strategies

- Do not use arbitrary sleeps when a real UI or network condition can be awaited.
- Avoid `waitForLoadState('networkidle')` after every interaction.
- Do not mix explicit waits with auto-waiting for the same condition.
- Wait for backend responses when the UI depends on API work finishing.
- Use URL waits only when navigation is actually expected.
- Replace spinner or loader delays with state-based waits.
- Prefer built-in Playwright actions over JavaScript-driven clicks.
- Avoid retry loops that hide synchronization problems.
- Use explicit waits only when the event or state is well-defined.
- Favor deterministic synchronization over timing guesses.

## Locator Standards

- Avoid XPath when a role-based or test-id selector is available.
- Do not use `.nth()` or index-based selectors for dynamic content.
- Avoid overly deep locator chains that are hard to read and maintain.
- Reuse the same locator instead of recreating it multiple times.
- Keep locators in page objects or components rather than scattering them across tests.
- Prefer business identifiers and accessible names over DOM hierarchy.
- Avoid CSS selectors tied to styling classes when semantic selectors are better.
- Prefer stable test ids for repeated complex controls.
- Avoid locating by visible text when localization may change it.
- Use accessible roles and names whenever possible.

## Page Object Model

- Keep page objects focused on one screen or major user journey.
- Do not place assertions inside page objects.
- Do not bake test data into page objects.
- Expose business actions such as `login`, `submitOrder`, or `openSettings`.
- Extract reusable widgets into component objects instead of duplicating them.
- Do not return raw `Page` instances from page objects.
- Avoid creating locators inside every method when they can be shared.
- Keep page objects stateless where possible.
- Avoid mixing UI actions with API calls in the same object.
- Make page objects easy to reuse across multiple test suites.

## Test Design

- Keep each test focused on one business scenario.
- Ensure tests are independent and order-insensitive.
- Avoid shared mutable state between tests unless it is intentionally managed.
- Follow Arrange-Act-Assert structure for clarity.
- Use fixtures for login, setup, and common initialization.
- Avoid conditionals inside tests that hide multiple scenarios.
- Keep assertions close to the action being verified.
- Avoid duplicate setup across test files when a shared fixture would work.
- Give tests descriptive names that reflect the user outcome.
- Keep tests deterministic and avoid hidden dependencies on timing.

## Assertions

- Use Playwright assertions for UI state instead of manual `if` logic.
- Assert on user-visible behavior rather than internal DOM details.
- Prefer semantic matchers such as `toBeVisible`, `toContainText`, and `toHaveURL`.
- Avoid redundant assertions that confirm the same thing twice.
- Keep assertions specific and meaningful rather than broad existence checks.
- Use bounded timeouts only when the condition truly needs a limit.
- Avoid assertions that depend on animation timing or layout jitter.
- Assert the business outcome of the action, not just the page object being created.
- Keep assertion messages clear when failures need to be diagnosed quickly.
- Avoid over-asserting multiple unrelated behaviors in a single test.

## Fixtures and Hooks

- Use fixtures to encapsulate common setup and teardown.
- Keep fixture scopes as narrow as possible.
- Avoid shared mutable state in fixtures without reset logic.
- Keep hooks focused on lifecycle concerns rather than unrelated work.
- Always clean up browser contexts, pages, and temp files.
- Make fixtures deterministic and independent of arbitrary delays.
- Prefer explicit fixture names over vague helper names.
- Use fixtures to share browser or data state safely.
- Avoid coupling fixtures to one specific test implementation.
- Keep setup and teardown easy to understand and review.

## TypeScript

- Do not use `any` in production automation code.
- Avoid `as any` and other unsafe casts unless they are clearly justified.
- Add explicit return types to exported functions and public methods.
- Avoid floating promises and unhandled async errors.
- Use `readonly` and `const` where values should not change.
- Avoid non-null assertions `!` unless the contract is guaranteed.
- Prefer discriminated unions over string flags for stateful logic.
- Remove unused imports, variables, and dead code.
- Avoid deeply nested optional chaining and overly complex null checks.
- Replace magic strings with enums or named constants.

## Performance

- Avoid repeated API calls when one shared request can support the scenario.
- Avoid launching a browser for every small test when a shared fixture would work.
- Do not perform unnecessary page reloads or repeated setup steps.
- Avoid heavy loops that trigger many UI interactions unnecessarily.
- Minimize screenshots, traces, and artifacts in normal runs.
- Avoid creating new locators inside hot loops when a single locator can be reused.
- Prefer targeted waits over broad `networkidle` waits.
- Cache or share expensive setup when it is safe and explicit.
- Remove unused helpers and dead branches that add runtime and maintenance cost.
- Keep tests fast enough to run in CI without causing bottlenecks.

## Security

- Never commit secrets, tokens, or passwords.
- Avoid logging sensitive data, credentials, or PII.
- Do not capture screenshots or reports that include confidential information.
- Use environment variables or secure secret stores for credentials and config.
- Avoid exposing tokens in workflow output or CI logs.
- Keep storage state and auth artifacts protected and scoped.
- Sanitize test data and reports before sharing them externally.
- Avoid hardcoded credentials in fixtures and sample data.
- Remove secrets from Git history and CI caches immediately if they are discovered.
- Follow least-privilege principles in automation and CI access.

## Code Quality

- Remove duplicate logic and consolidate it into shared helpers.
- Keep functions focused and avoid monolithic methods.
- Reduce branching and nested conditionals where possible.
- Delete commented-out code and stale branches.
- Replace magic strings and literals with names that explain intent.
- Keep parameter lists short and use options objects where appropriate.
- Favor clear composition over unnecessary abstraction.
- Split large classes into smaller units with a single purpose.
- Make error handling explicit and informative.
- Keep code simple enough to review quickly and trust in CI.

## Naming Conventions

- Use descriptive names for tests, helpers, variables, and methods.
- Use camelCase for variables and methods and PascalCase for classes and interfaces.
- Use UPPER_CASE for constants and shared configuration values.
- Avoid heavy abbreviations unless the meaning is widely understood.
- Name locators by their role or purpose rather than by temporary placeholders.
- Name page objects after the screen or view they represent.
- Name component objects after the reusable widget or panel they wrap.
- Prefer verbs for methods and nouns for objects.
- Avoid vague names such as `data`, `value`, `item`, or `obj` when a specific term exists.
- Keep naming consistent across tests, helpers, and page objects.

## Maintainability

- Keep modules focused on one responsibility.
- Keep files small enough to be reviewed and understood quickly.
- Prefer comments that explain intent rather than obvious implementation details.
- Remove stale TODOs and abandoned code paths.
- Keep setup and teardown symmetrical and easy to follow.
- Avoid hidden side effects in helpers and utilities.
- Organize tests by feature or user journey rather than by arbitrary structure.
- Favor straightforward code over clever but fragile one-liners.
- Make the framework easy for new contributors to understand and extend.
- Design reusable building blocks so the suite can evolve without frequent rewrites.

## GitHub Actions / CI

- Run reviews, tests, and lint checks automatically for every pull request.
- Validate required secrets before running AI-assisted or credentialed jobs.
- Upload review reports and logs as artifacts for traceability.
- Keep workflow permissions narrow and explicit.
- Retry transient failures with bounded backoff where appropriate.
- Fail fast on invalid configuration before expensive steps begin.
- Keep CI output concise, actionable, and easy to scan.
- Use pinned actions and deterministic tool versions where possible.
- Avoid exposing credentials or secrets in workflow logs.
- Keep workflows readable and maintainable so they are easy to evolve.
