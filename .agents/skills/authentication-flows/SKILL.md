---
name: authentication-flows
description: Guidelines for user authentication, signup, login, session management, JWT handling, cookie configuration, OAuth, and RBAC
---

# Instructions

- **Secure Password Storage:** Never store passwords in plain text. Always hash them using a cryptographically secure function (e.g., Argon2id or bcrypt with an adaptive cost factor) before database storage.
- **Token & Session Architecture:**
  - Store access tokens in memory or short-lived cookies.
  - Store refresh tokens in `HttpOnly`, `Secure`, and `SameSite=Strict` cookies to defend against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).
  - Set reasonable token expiration values (e.g., Access Token: 15 minutes, Refresh Token: 7 days).
- **Role-Based Access Control (RBAC):** Protect API endpoints with middleware that checks user roles or permissions. Deny access by default (Fail-Safe Defaults) and explicitly grant authorization.
- **Token Revocation:** Implement a backend blacklist or database session tracking to allow immediate revocation of refresh tokens upon user logout or account compromise.
- **Dynamic Authentication Configuration:** Load all credentials, private keys, and token secrets strictly from environment variables (`process.env`).

# Gotchas

- **LocalStorage Token Storage:** Placing JWTs in `localStorage` makes them accessible to any malicious script executing on the client page (XSS).
- **CSRF Vulnerabilities:** If cookies are used for authorization without `SameSite=Strict` or anti-CSRF tokens, endpoints are vulnerable to CSRF attacks.
- **Generic Authentication Failures:** Returning messages like "User not found" or "Incorrect password" leaks database state to attackers. Use generic "Invalid username or password" messages.

# Validation Loops

1.  **Unit Validation:** Test the hashing mechanism in a sandbox script to confirm correct salt generation and password verification.
2.  **Cookie Header Inspection:** Inspect the HTTP response headers in a simulated request to ensure the auth cookies contain `HttpOnly`, `Secure`, and `SameSite` configurations.
3.  **Middleware Integration Check:** Verify that accessing protected endpoints without tokens or with expired tokens returns a strict `401 Unauthorized` or `403 Forbidden` status.
