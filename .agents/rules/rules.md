---
trigger: always_on
description: Absolute global laws and coding standards including strict async rules and function design standards
---

# Absolute Global Laws & Coding Standards

This document establishes the absolute, non-negotiable coding standards and engineering rules for all development work in this codebase.

---

## 1. Strict Asynchronous Execution Laws

Asynchronous programming in JavaScript/TypeScript requires absolute rigor to prevent memory leaks, unhandled rejections, race conditions, and deadlocks.

- **Promise Completeness:** Every asynchronous function MUST return a Promise or use the `async` keyword. Never leave an async execution path dangling or unawaited.
- **Explicit Error Handling:** Every `await` statement must be wrapped in a `try/catch` block unless the error is explicitly expected to bubble up to a higher-level handler that is documented.
- **No Callback Hell:** Legacy callback-style APIs must be wrapped in a `new Promise()` constructor immediately upon import. Do not pass callback parameters to nested functions.
- **Avoid Floating Promises:** Do not invoke async functions without `await` or `.catch()` unless you are intentionally fire-and-forgetting AND have registered a global crash-handling block for it.
- **Parallel Execution Safety:** When using `Promise.all()`, ensure that rejection of one promise does not cause silent failures or unhandled rejections in the other concurrently running promises. Use `Promise.allSettled()` if you need to process all results regardless of failure.

---

## 2. Function Design Standards

Functions are the core building blocks of our system. They must be designed for testability, predictability, and safety.

- **Single Responsibility Principle (SRP):** A function must perform exactly one logical operation. If a function is doing multiple tasks (e.g., fetching data, validating schema, formatting text, and updating database), split it into separate, focused functions.
- **Pure Core, Impure Shell:** Keep business logic pure and deterministic. Side effects (API calls, DB queries, file system access) should be isolated at the system boundary (e.g., controller, middleware, database layer).
- **Boundary Input Validation:** Never trust inputs crossing a system boundary (e.g., API requests, file system reads, database results). Validate all inputs at the entry point of the function using a schema validator or type-guard.
- **No Side-Effect Imports:** Importing a module must never execute code with global side-effects (e.g., opening database connections, starting servers, mutating global prototype chains). All initialization must be explicit.

---

## 3. Boundary Safety & Data Integrity

- **Type Safety:** Avoid `any` at all costs. Use `unknown` if a type is truly dynamic, and use type guards or casting assertions only after validation.
- **Nullable Safety:** Always account for `null` and `undefined`. Leverage TypeScript's strict null checks (`?.`, `??`).
- **Immutability:** Avoid in-place mutation of objects and arrays. Use spread operators (`...`) or utility functions to perform updates.
- **Database Constraints:** Code-level validations are secondary to database constraints. Always use foreign keys, unique indices, and check constraints to guarantee database-level integrity.
