---
name: observability-logging
description: Guidelines for structured logging, metrics, tracing, health checks, alerting, and production diagnostics
---

# Instructions

- **Structured Logs:** Emit machine-parseable logs with stable fields such as `requestId`, `userId` where safe, route, operation, status, latency, and error code.
- **No Sensitive Data:** Never log secrets, passwords, tokens, session cookies, private keys, full payment details, or raw personal data.
- **Correlation IDs:** Propagate a request or trace identifier across controllers, services, jobs, and outbound calls.
- **Actionable Metrics:** Track latency, error rate, throughput, queue depth, cache hit rate, database query timing, and external dependency failures for critical paths.
- **Health & Readiness:** Provide lightweight health checks for uptime and deeper readiness checks for database, cache, queue, and required external dependencies.
- **Alert Quality:** Alerts must map to user impact or operational risk. Prefer actionable thresholds over noisy warning spam.

# Gotchas

- **Log-Only Debugging:** Logs without metrics or traces make distributed failures difficult to isolate.
- **High Cardinality Labels:** Metrics tagged with unbounded values such as user emails, raw URLs, or IDs can overwhelm monitoring systems.
- **Swallowed Errors:** Catching and logging an error without returning a failure, retrying, or surfacing context hides real outages.
- **PII Exposure:** Error objects can contain request bodies or headers. Sanitize before logging.

# Validation Loops

1.  **Failure Path Check:** Trigger a controlled error and confirm logs include context without sensitive data.
2.  **Correlation Check:** Verify the same request or trace ID appears across all layers touched by a request.
3.  **Metric Check:** Confirm critical counters, timers, and gauges are emitted for the new path.
4.  **Health Check:** Verify health/readiness endpoints fail clearly when required dependencies are unavailable.
