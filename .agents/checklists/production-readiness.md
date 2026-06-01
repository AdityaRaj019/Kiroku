---
name: production-readiness
description: Production-ready checklist covering compiler validation, styling conventions, testing coverage, environment configuration, and logging setup
---

# Production Readiness & Deployment Checklist

Execute this checklist before building the application for production deployment:

### 1. Build & Type Checking

- [ ] The build command (e.g., `npm run build` or `next build`) runs and finishes without compilation errors.
- [ ] TypeScript type validation (`tsc --noEmit`) passes with zero warnings or errors.
- [ ] Code linter (`eslint`) and code formatter (`prettier`) confirm there are no formatting violations.

### 2. Testing & Coverage

- [ ] The full suite of unit and integration tests executes and passes.
- [ ] Minimum test coverage metrics (statements, functions, branches) meet the repository's guidelines.
- [ ] There are no flaky or skipped tests in the active codebase.

### 3. Styling & Performance Assets

- [ ] Styling uses CSS custom properties or theme configuration variables. No hardcoded or ad-hoc style configurations are present.
- [ ] Large assets (images, fonts, scripts) are compressed, lazily loaded, or split appropriately.
- [ ] Database query operations do not contain N+1 query patterns.

### 4. Logging & Monitoring

- [ ] Application logs utilize a structured logger (e.g., Winston, Pino) with log levels (info, warn, error).
- [ ] Fatal crashes register with an external monitoring or alerting tool.
- [ ] System health checks and heartbeats are active.
