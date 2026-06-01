---
name: pull-request-checklist
description: Checklist for preparing a clean pull request with focused diffs, tests, docs, risk notes, and rollback awareness
---

# Pull Request Readiness Checklist

### 1. Scope & Diff Hygiene

- [ ] The PR solves one coherent problem and avoids unrelated refactors.
- [ ] The diff contains no generated junk, debug logs, local environment files, or unrelated formatting churn.
- [ ] Public interfaces, schemas, routes, and exported types are intentionally changed and documented.

### 2. Verification

- [ ] Targeted tests cover happy path, boundary path, and failure path behavior.
- [ ] Relevant lint, type, test, and build commands have run successfully.
- [ ] UI changes were checked at mobile, tablet, and desktop sizes when applicable.

### 3. Security & Operations

- [ ] No secrets, tokens, private data, or sensitive logs were introduced.
- [ ] Auth, authorization, validation, rate limits, and audit logs were considered for affected endpoints.
- [ ] Migrations, feature flags, environment variables, and rollout order are documented.

### 4. Handoff

- [ ] The PR description explains what changed, why it changed, how it was verified, and known residual risk.
- [ ] Documentation, changelog, or release notes were updated when user-facing or operational behavior changed.
- [ ] Rollback steps are clear for risky production changes.
