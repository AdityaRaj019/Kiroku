---
name: agents-index
description: Entry point for the local agent operating system, skill map, and retrieval order
---

# Agent Framework Index

This folder defines the local operating model for AI agents working in this repository. Use it as the first stop before making code changes.

## Load Order

1. Read `AGENT.md` for persona, boundaries, and communication expectations.
2. Read `RULES.md` for non-negotiable coding standards.
3. Read `STACK.md` to detect the active project stack before choosing commands or patterns.
4. Read `WORKFLOW.md` for the standard implementation lifecycle.
5. Read `CONTEXT.md` at the start of the first conversation, and again when prior changes or project memory matter.
6. Load only the relevant files from `skills/`, `architecture/`, `workflows/`, `templates/`, and `checklists/` based on the user request.

## Skill Map

- `authentication-flows/SKILL.md`: login, signup, session, cookie, OAuth, JWT, RBAC, and token revocation work.
- `backend-services/SKILL.md`: API controllers, service layers, repositories, validation, and server-side error handling.
- `code-review/SKILL.md`: review mode, diff inspection, regression risks, type safety, and missing tests.
- `database-migrations/SKILL.md`: schema changes, migrations, indexes, backfills, rollback, and ORM sync.
- `frontend-design/SKILL.md`: UI components, responsive behavior, CSS variables, animation, and visual polish.
- `performance-optimization/SKILL.md`: query tuning, caching, stream processing, event loop safety, and memory use.
- `security-hardening/SKILL.md`: injection prevention, headers, rate limits, uploads, XSS, CSRF, and dependency risk.
- `unit-testing/SKILL.md`: test structure, mocking, boundary matrices, async test safety, and coverage.
- `accessibility/SKILL.md`: keyboard, semantic HTML, ARIA, contrast, focus, screen readers, and reduced motion.
- `dependency-governance/SKILL.md`: package selection, lockfiles, vulnerability handling, licenses, and supply chain safety.
- `documentation-maintenance/SKILL.md`: README updates, API docs, ADRs, environment docs, and changelog quality.
- `observability-logging/SKILL.md`: structured logs, metrics, traces, health checks, and incident diagnostics.

## Retrieval Rules

- Prefer the smallest relevant set of documents. Do not load every file by default.
- On the first conversation in this project, check Graphify output and Obsidian state files using `CONTEXT.md`.
- Re-read Graphify and Obsidian context when the task depends on previous sessions, recent changes, architecture history, or pending actions.
- When a request spans multiple domains, combine the applicable skill with the matching workflow and checklist.
- When existing project code conflicts with these documents, inspect the existing code first and adapt conservatively unless the user asks to change the architecture.
- When adding a new skill, create `skills/<skill-name>/SKILL.md` with YAML frontmatter containing `name` and `description`, then use the same `Instructions`, `Gotchas`, and `Validation Loops` structure as the existing skill files.
