---
name: security-checklist
description: Critical security checklist to inspect code for injection, secret leaks, CSRF/XSS, validation gaps, and dependency safety
---

# Security Inspection Checklist

Execute this checklist before merging any code changes to ensure safety boundaries are maintained:

### 1. Injection & Database Security

- [ ] No database query uses string concatenation or interpolation. All queries use parameterized queries.
- [ ] ORM helper APIs are used safely (e.g., no `queryRawUnsafe` without validated variables).
- [ ] Database operations are executed with the lowest database user privileges required.

### 2. Secret & Configuration Safety

- [ ] No API keys, database URLs, passwords, or JWT secrets are hardcoded.
- [ ] All configuration values are loaded from `process.env` (environment variables).
- [ ] The `.gitignore` file correctly lists `.env`, `.env.local`, and other environment state files.

### 3. Client & Cross-Origin Safety

- [ ] Authentication cookies are flagged with `HttpOnly`, `Secure`, and `SameSite=Strict`.
- [ ] CSRF protection tokens or headers are checked for all state-changing API operations (`POST`, `PUT`, `DELETE`).
- [ ] Dynamic user text rendered in the client is escaped or sanitized to prevent Cross-Site Scripting (XSS).
- [ ] CORS policies restrict access only to trusted domains, avoiding wildcards (`*`) in production.

### 4. Payload & System Hardening

- [ ] Request body parser limits are configured to block large payloads that trigger memory exhaustion.
- [ ] Application errors do not expose stack traces or server file structures to client responses.
- [ ] Public-facing endpoints have rate limiting active.
