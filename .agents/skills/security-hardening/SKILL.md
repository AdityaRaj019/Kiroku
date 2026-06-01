---
name: security-hardening
description: Guidelines for application security hardening, input sanitization, security headers, rate limiting, and vulnerability prevention
---

# Instructions

- **Injection Prevention:** Never use string interpolation or concatenation to build database queries. Always use parametrized parameters, Prisma's built-in query helpers, or ORM parameter binding.
- **Security Headers:** Configure secure HTTP headers using packages like `Helmet` (for Express) or configure security headers in `next.config.js`. Enforce:
  - `Content-Security-Policy` (CSP)
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security` (HSTS)
  - `Referrer-Policy: no-referrer`
- **Input Sanitization & Output Escaping:** Sanitize all user-provided HTML, Markdown, or text inputs. Escape dynamic data rendering to prevent Cross-Site Scripting (XSS).
- **Rate Limiting:** Protect all public-facing endpoints (especially authentication and resource-intensive endpoints) using rate limiters (e.g., `express-rate-limit`, Redis-backed rate limiters).
- **Secure File Uploads:** Validate file sizes, mime-types, and magic bytes. Store uploaded files outside the public web root and serve them with headers disabling script execution (`Content-Disposition: attachment`).

# Gotchas

- **Raw SQL Vulnerabilities:** Using `prisma.$queryRawUnsafe` with dynamic variables instead of `prisma.$queryRaw` introduces SQL injection.
- **Exposing System Context:** Returning full stack traces or system error descriptions in production HTTP responses exposes server details to attackers. Serve generic error messages and log details internally.
- **Missing API Constraints:** Not restricting request payload sizes (`limit` options in body parsers) opens the service to memory exhaustion and Denial of Service (DoS) attacks.

# Validation Loops

1.  **Vulnerability Audit:** Run `npm audit` or equivalent dependency scanners to check for known security flaws in dependencies.
2.  **Payload Boundary Test:** Send large payloads and script injection vectors (`<script>alert(1)</script>`) to verify inputs are rejected or sanitized correctly.
3.  **Header Verification:** Fetch endpoints using a shell script or test and verify the presence of HSTS, CSP, and security-relevant headers in the response.
