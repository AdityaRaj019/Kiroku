---
trigger: always_on
description: Dynamic guidelines to detect active project stack and align coding behavior accordingly
---

# Dynamic Project Stack Detection & Alignment Guidelines

This document provides a systematic workflow for detecting the active technologies, framework configurations, and packages within the current repository. You MUST execute these detection steps at the start of any new project or when working in a new workspace.

---

## 1. Stack Detection Procedure

Do not assume the stack. Follow this step-by-step checklist to detect the technologies active in this workspace:

### Step 1: Detect Language Environment

Look for package manager or build configuration files in the root directory:

- [ ] **Node.js/JavaScript/TypeScript:** Check for `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`.
- [ ] **Go:** Check for `go.mod`, `go.sum`.
- [ ] **Python:** Check for `requirements.txt`, `Pipfile`, `poetry.lock`, `pyproject.toml`.
- [ ] **Rust:** Check for `Cargo.toml`, `Cargo.lock`.

### Step 2: Identify Core Frameworks (JavaScript/Node Ecosystem)

If the project is a Node.js project, inspect the `dependencies` and `devDependencies` in `package.json` to identify:

- [ ] **Frontend:** `next` (Next.js), `react` (React), `vue` (Vue.js), `@remix-run/*` (Remix), `svelte` (Svelte).
- [ ] **Backend:** `express` (Express), `@nestjs/*` (NestJS), `fastify` (Fastify).
- [ ] **Database / ORM:** `prisma` (Prisma), `sequelize` (Sequelize), `typeorm` (TypeORM), `mongoose` (MongoDB), `pg` (Postgres client).

### Step 3: Detect Build Tooling & Type System

- [ ] **TypeScript:** Check for `tsconfig.json` or `typescript` in `devDependencies`.
- [ ] **Build Bundler:** Check for `vite.config.ts`, `webpack.config.js`, `next.config.js`.
- [ ] **Styling System:** Check for `tailwind.config.js` (Tailwind CSS), `postcss.config.js`, or CSS modules.
- [ ] **Linters & Formatters:** Check for `.eslintrc.*`, `eslint.config.js`, `.prettierrc`.

### Step 4: Detect Testing Setup

- [ ] **Unit/Integration Testing:** Check for `jest.config.js` (Jest), `vitest.config.ts` (Vitest), or Cypress / Playwright configurations.

---

## 2. Adaptation Guidelines

Once the stack is detected, adapt your behavior according to these guidelines:

### 2.1 Code Conventions Alignment

- **Next.js (App Router):** Use Server Components by default, import `'use client'` strictly where client-side interactivity is needed. Follow page/layout file routing.
- **Express.js:** Organize routes, controllers, middleware, and services into distinct layers. Return appropriate HTTP status codes.
- **Prisma ORM:** Run `prisma generate` after database schema updates. Use the generated Prisma Client types.
- **TypeScript vs. JavaScript:** If a `tsconfig.json` exists, write strictly typed TypeScript code. Do not bypass the compiler with type assertions.

### 2.2 Package Managers Alignment

Always use the lockfile-appropriate package command:

- `package-lock.json` $\rightarrow$ Use `npm install`
- `yarn.lock` $\rightarrow$ Use `yarn install`
- `pnpm-lock.yaml` $\rightarrow$ Use `pnpm install`
- `bun.lockb` $\rightarrow$ Use `bun install`
