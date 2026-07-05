# Configuration Guide

The review system uses environment variables for configuration.

## Environment Variables

- OPENAI_API_KEY: API key for optional AI review.
- OPENAI_MODEL: Model name for AI review.
- GITHUB_TOKEN: Token used by the workflow for PR comment integration.
- GITHUB_REPOSITORY: Repository identifier such as owner/name.
- MAX_FILES: Maximum number of files to review.
- MAX_COMMENTS: Maximum number of review comments to emit.
- CHUNK_SIZE: Maximum content size sent to the AI model.
