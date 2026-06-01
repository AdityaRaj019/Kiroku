---
name: incident-response
description: Checklist for triaging, mitigating, communicating, and learning from production incidents
---

# Incident Response Checklist

### 1. Triage

- [ ] Identify the user impact, affected services, start time, severity, and current blast radius.
- [ ] Assign an incident owner and communication owner.
- [ ] Preserve useful evidence: logs, traces, dashboards, deploy IDs, error samples, and recent changes.

### 2. Mitigation

- [ ] Prefer the fastest safe mitigation: rollback, feature flag disable, traffic shift, queue pause, or dependency failover.
- [ ] Avoid speculative fixes in production without evidence and a rollback path.
- [ ] Record every action with timestamp, actor, and observed result.

### 3. Communication

- [ ] Share concise status updates on a predictable cadence.
- [ ] Separate confirmed facts from hypotheses.
- [ ] Communicate customer impact and workaround status when applicable.

### 4. Recovery & Follow-Up

- [ ] Confirm metrics return to normal and no delayed jobs or data inconsistencies remain.
- [ ] Write a blameless post-incident review with root cause, contributing factors, detection gaps, and prevention work.
- [ ] Create tracked follow-up tasks with owners and due dates.
