---
name: backend-services
description: Guidelines for backend services, API controllers, layers, database interaction, business logic encapsulation, and error handling
---

# Instructions

- **Layered Architecture:** Enforce strict separation of concerns. Routing and HTTP validation happen in the Controller. Core business rules reside in the Service layer. Data retrieval and mutations go through the Repository/ORM layer.
- **Asynchronous Patterns:** Always use `async/await`. Avoid floating promises. All asynchronous operations must return a Typed Promise.
- **Uniform Error Handling:** Define standard error models (e.g., `BadRequestError`, `NotFoundError`, `InternalServerError`). Capture exceptions cleanly and map them to standard HTTP status codes. Log errors with dynamic context (request IDs, session data).
- **Input Validation:** Validate all inputs at the entry controller using schemas (e.g., Zod, Joi). Strip unvalidated fields to prevent parameter injection.
- **Pure Functions for Business Logic:** Keep business calculations pure and testable. Pass databases and third-party APIs as dependencies or interface adapters.

# Gotchas

- **Unhandled Rejections:** A single unawaited or unhandled Promise rejection can crash Node.js process. Always wrap service calls in try-catch.
- **Memory Leaks:** Storing request context in global scopes or closure scopes that persist across requests causes memory leaks. Always use Local Asynchronous Storage (AsyncLocalStorage) or pass request-specific details explicitly.
- **Over-fetching Database Rows:** Avoid using generic `SELECT *` queries. Explicitly select only the fields needed by the service layer.

# Validation Loops

1.  **Mock Sandbox Execution:** Set up a mock script in `brain/scratch/` containing the core logic to simulate backend calculations.
2.  **Schema Check:** Verify that inputs and outputs conform strictly to the defined schema models.
3.  **Linter & Compiler Check:** Run the compiler to verify that service types are correctly resolved.
4.  **Unit Tests:** Run test suites representing standard inputs, missing inputs, and erroneous third-party responses.
