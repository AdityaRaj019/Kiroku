---
trigger: always_on
description: Startup and recovery instructions for reading Graphify output and Obsidian vault state before project work
---

# Project Context Bootstrap

Use this document to recover project memory before making decisions. The goal is to understand recent changes, open work, and architectural context without re-discovering the project from scratch.

## When To Run

Run this context bootstrap:

1. At the start of the first conversation in this project.
2. When the user asks about previous work, recent changes, current state, or project direction.
3. Before making architecture, migration, refactor, deployment, or cross-cutting changes.
4. Whenever the active task depends on decisions or edits made in prior sessions.

## Graphify Context

If `graphify-out/` exists, read the lightweight summary files first:

1. `graphify-out/GRAPH_REPORT.md`
2. `graphify-out/.graphify_analysis.json`
3. `graphify-out/graph.json` only when a graph-level query or relationship lookup is needed.
4. `graphify-out/wiki/index.md` and relevant community pages if the wiki output exists.

Use Graphify to answer questions like:

- Which files, modules, or concepts are connected?
- What areas of the project are central or risky?
- What changed in the graph after an update?
- Which prior decisions or concepts should influence the current task?

Do not treat inferred or ambiguous Graphify edges as facts without checking the source files. Prefer `GRAPH_REPORT.md` for quick orientation and `graph.json` for targeted relationship lookup.

## Obsidian Vault Context

If an Obsidian vault exists in or near the project, read these files first when present:

1. `Action_Register.md`
2. `Context_state.md`
3. Any linked note from those files that is directly relevant to the current task.

If the vault location is not obvious, search the workspace for these filenames before proceeding:

```text
Action_Register.md
Context_state.md
```

Use the Obsidian notes to recover:

- Completed and pending actions.
- Current project state.
- Open decisions, risks, and blockers.
- Session-to-session continuity.
- User preferences or constraints that are specific to this project.

## Priority Order

When context sources disagree, resolve them in this order:

1. Current user instruction.
2. Current filesystem state.
3. Obsidian `Context_state.md` and `Action_Register.md`.
4. Graphify extracted facts from source-backed edges.
5. Graphify inferred or ambiguous relationships.

Mention uncertainty when context is stale, missing, inferred, or contradicted by the current codebase.

## Output Discipline

Do not dump the full content of Graphify or Obsidian files into the response. Summarize only the relevant facts and cite the file path when it informs a decision.
