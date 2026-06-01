---
name: deployment-flow
description: Step-by-step workflow procedures for building, staging, executing environment verification, and releasing updates
---

# Deployment & Release Workflow

Follow this procedure when preparing a feature or bug fix for production release:

### 1. Pre-Release Validation

- [ ] Verify the build command (`npm run build`) runs and succeeds locally.
- [ ] Ensure all tests pass (`npm run test`).
- [ ] Verify there are no open lint errors or unresolved TypeScript warnings.

### 2. Environment Verification

- [ ] Check that all environment variables required by the new release are documented and added to the production hosting environment.
- [ ] Ensure any pending database migrations have been dry-run and are ready to execute.

### 3. Execution & Release

- [ ] Apply database migrations to the target database env.
- [ ] Deploy the compiled build assets to the hosting provider (Vercel, AWS, Docker container, etc.).

### 4. Post-Deployment Smoke Test

- [ ] Perform health check checks (`GET /api/health`) to confirm server availability.
- [ ] Audit production application logs for initial startup warnings or fatal crashes.
