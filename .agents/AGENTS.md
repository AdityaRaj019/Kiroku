# Kiroku Project-Scoped Agent Rules

This workspace-scoped rules document defines development boundaries, style conventions, and guidelines for the Kiroku project.

---

## 1. Next.js App Router Conventions

<!-- BEGIN:nextjs-agent-rules -->
### This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## 2. Frontend Component Isolation & Architecture

- **Page Component Decomposition:** Page-level files (`page.tsx`) must only act as coordinators/entry points. They should contain minimal layout shell structure and delegate the actual rendering to modular components located in `components/`.
- **Client Component Minimization:** Keep Server Component boundaries as high as possible. Isolate client-side state (`useState`, hooks, and event handlers) into dedicated, leaf-node client components marked with `'use client'` to keep pages fast and lightweight.
- **Single Responsibility Principle (SRP):** Individual components should perform a single visual or logical job. If a component exceeds 250 lines of code, it must be audited for further decomposition into smaller subcomponents.
