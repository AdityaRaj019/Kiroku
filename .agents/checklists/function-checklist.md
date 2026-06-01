---
name: function-checklist
description: Strict checklist for creating and reviewing functions to guarantee asynchronous completeness, error robustness, and pure logic validation
---

# Function Quality & Execution Checklist

Execute this checklist for every function created or refactored:

### 1. Structure & Naming

- [ ] The function has a single, clearly defined responsibility.
- [ ] The name is active, starting with a verb (e.g., `fetchUserData`, `calculateTotalBalance`).
- [ ] No side-effects occur upon importing the file hosting this function.

### 2. Type Safety & Parameters

- [ ] Parameters are explicitly typed. The `any` keyword is completely avoided.
- [ ] Nullable, optional, and default parameters are accounted for with default values or early exits.
- [ ] Input validation is applied immediately at the function entry point using schema libraries or type-guards.

### 3. Asynchronous Execution

- [ ] If the function performs async tasks, it is marked `async` and returns a typed Promise (`Promise<T>`).
- [ ] All internal promises are awaited. There are no unhandled or floating promises.
- [ ] All `await` operations are wrapped in `try-catch` blocks, or the function signature explicitly documents that it bubbles errors.
- [ ] Legacy callbacks are converted into Promise objects at execution boundaries.

### 4. Correctness & Error Safety

- [ ] Unit tests covering happy-path, boundary-path, and error-path inputs are written and pass.
- [ ] Log output contains proper context (request IDs, parameter traces) on error paths.
- [ ] No debugging statements (`console.log`, debugger flags) are left in the file.
