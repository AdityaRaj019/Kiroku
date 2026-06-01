---
name: bug-fixing
description: Step-by-step workflow procedures to reproduce, diagnose, isolate, fix, and verify software bugs
---

# Bug Fixing & Diagnosis Workflow

Follow this procedure when resolving an issue or bug in the codebase:

### 1. Reproduction & Tracing

- [ ] Read error stack traces, log outputs, or user bug reports.
- [ ] Locate the file, line, and execution scope responsible.
- [ ] Write a reproducing test or sandbox script that triggers the failure deterministically.

### 2. Diagnosis & Isolation

- [ ] Explain "Why" the failure happens (e.g., unexpected nulls, unhandled promise rejection, race condition).
- [ ] Identify potential edge cases that could also trigger this bug.

### 3. Implementing the Fix

- [ ] Write a targeted replacement fixing the root cause.
- [ ] Implement input boundary checks or fallback assertions to prevent recurrence.

### 4. Validation Loop

- [ ] Run the reproducing test or script and confirm that it now passes successfully.
- [ ] Run the full test suite to ensure no regressions were introduced.
- [ ] Run linter and type compile checks to verify syntax code quality.
