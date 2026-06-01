---
name: documentation-maintenance
description: Guidelines for maintaining README files, API docs, ADRs, environment documentation, changelogs, and developer handoff notes
---

# Instructions

- **Document Behavior, Not Trivia:** Capture setup, commands, architecture decisions, public contracts, environment variables, and operational gotchas that future maintainers need.
- **Keep Docs Close to Code:** Update docs in the same change when code changes commands, environment variables, routes, schemas, feature flags, or deployment behavior.
- **Use Decision Records:** For meaningful architectural decisions, create or update an ADR describing context, decision, tradeoffs, consequences, and alternatives considered.
- **API Contract Accuracy:** Keep request/response examples synchronized with schema validation, error formats, pagination, auth requirements, and status codes.
- **Change Visibility:** Update changelogs or release notes for user-visible behavior changes, migrations, breaking changes, and operational actions.

# Gotchas

- **Stale Setup Steps:** Installation and run instructions rot quickly when dependency managers, scripts, or environment variables change.
- **Undocumented Flags:** Feature flags, background workers, queues, and scheduled jobs are easy to miss but critical during incidents.
- **Copy-Paste Examples:** Example payloads that bypass validation or omit auth requirements mislead future implementers.

# Validation Loops

1.  **Command Check:** Execute or verify documented setup/build/test commands where practical.
2.  **Schema Check:** Compare API examples against the actual validation schema or generated types.
3.  **Link Check:** Verify internal doc links and file references still resolve.
4.  **Reader Check:** Ensure a new contributor can identify how to run, test, configure, and safely deploy the changed area.
