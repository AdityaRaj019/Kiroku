---
name: feature-development
description: Step-by-step workflow procedures for plan, isolation, code implementation, validation, and integration of new features
---

# Feature Development Workflow

Follow this procedure when implementing a new feature in the codebase:

### 1. Requirements & Spec Analysis

- [ ] Read user specifications and inspect related source files.
- [ ] Draft an architectural impact summary outlining schema migrations, backend additions, and frontend changes.

### 2. Sandbox Verification (The Isolation Stage)

- [ ] Create a standalone file in `brain/scratch/` or `test/`.
- [ ] Code and run a prototype in isolation to verify API calls, third-party libraries, or database statements.

### 3. Schema & Database Execution

- [ ] Write and execute the database migration up scripts.
- [ ] Run type-generation commands (e.g., `prisma generate`) and verify that types compile successfully.

### 4. Logic Implementation

- [ ] Code the business service layer logic.
- [ ] Code the controller layer and request validation schemas.
- [ ] Code the UI components and hook up local states.

### 5. Verification & Validation Loop

- [ ] Write unit tests for new service classes and React components.
- [ ] Run linting, formatting, and full typescript checks.
- [ ] Manually execute the application in development mode to verify visual behavior.
