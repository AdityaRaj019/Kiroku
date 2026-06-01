---
name: hotfix-rollback
description: Emergency workflow for safely mitigating production regressions with rollback-first decision making
---

# Hotfix & Rollback Workflow

Follow this workflow when production behavior is degraded and time-to-mitigation matters more than normal feature velocity.

### 1. Stabilize

- [ ] Confirm the incident scope, latest deploy or config change, and affected user journeys.
- [ ] Choose the lowest-risk mitigation: rollback, feature flag disable, config revert, traffic drain, or data repair pause.
- [ ] Avoid broad refactors or speculative fixes during active mitigation.

### 2. Verify the Mitigation

- [ ] Run the smallest relevant smoke test against the affected path.
- [ ] Watch logs, metrics, traces, and error rates for recovery.
- [ ] Confirm no queued jobs, migrations, or background tasks continue the bad behavior.

### 3. Patch Safely

- [ ] Reproduce the bug in a test or sandbox before changing code.
- [ ] Implement the narrowest fix that addresses the verified root cause.
- [ ] Add a regression test and run targeted validation before release.

### 4. Close the Loop

- [ ] Document the timeline, impact, root cause, mitigation, and prevention work.
- [ ] Update runbooks, alerts, or health checks if detection was delayed.
- [ ] Schedule cleanup work if the hotfix intentionally left temporary compatibility code.
