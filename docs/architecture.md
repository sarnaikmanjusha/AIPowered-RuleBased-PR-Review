# Architecture

This repository follows a modular architecture so it can be reused across many Playwright automation repositories.

## Components

- Rule engine: performs fast static checks for common Playwright, TypeScript, security, and maintainability issues.
- Review report builder: converts findings into a structured markdown report.
- GitHub Actions workflow: triggers review on pull requests and uploads artifacts.

## Flow

1. A pull request is opened or updated.
2. The review job checks out the repository and installs dependencies.
3. The rule engine analyzes changed files.
4. Findings are aggregated into a markdown report.
5. The workflow uploads the report and optionally comments on the PR.

## Extension Points

- Add more detectors to the rule engine.
- Swap the static engine for an AI-backed engine by integrating OpenAI.
- Extend severity overrides and configuration for enterprise policy governance.
