---
name: code-review
description: Guidelines for conducting PR reviews, checking for syntax/type violations, testing integrity, and architectural regressions
---

# Instructions

- **Type Safety Audits:** Scan changes for usage of `any` types, typescript bypass directives (like `// @ts-ignore`), or forced type assertions (`as Type`) without validation. Enforce clean, descriptive, and strictly checked types.
- **Logical Boundary Inspections:** Analyze condition paths, loops, and index accesses. Verify that edge states (null, undefined, empty array, index -1) are explicitly accounted for and handled without crashes.
- **Error Handling Verification:** Inspect all asynchronous calls. Verify that errors are caught, wrapped in meaningful models, logged with request IDs, and handled without leaking server details.
- **Security Assessment:** Look for injection vulnerabilities, secret leaks, missing CSRF prevention, missing authorization guards, and lack of input validation schemas.
- **Test and Coverage Audit:** Verify that newly created functions or components are accompanied by robust unit tests. Ensure the test suites run and cover normal, boundary, and error branches.

# Gotchas

- **Console Log Pollution:** Approving code containing debug statements (`console.log`, temporary prints) pollutes production logs and can leak data.
- **Forbidden Placeholders:** Approving code containing `TODO` or `fixme` flags allows technical debt to accumulate.
- **Implicit Side-Effects:** Approving code imports that execute logic on load can cause startup bottlenecks and runtime bugs.

# Validation Loops

1.  **Static Analysis Check:** Run lint and compiler checks on the changes to verify that styling and type checks pass.
2.  **Diff Review:** Run a git diff comparison and verify that no secrets or unwanted files (e.g., `.env`, temporary assets) are included in the change list.
3.  **Logical Integrity Check:** Simulate edge case payload inputs against the new logic using a test file to confirm the system fails safely.
