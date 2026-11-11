# Sprint 00 — Admin Foundation, Monorepo Workspace & Zero-Trust Tooling

- **Sprint ID:** NNK-ADM-SPRINT-00
- **Duration:** 1 Week
- **Target Scope:** Root configs, `libs/*`, Turborepo pipeline, automated boundary verification, base HTTP/WS adapters, Docker & Nginx security templates
- **Dependencies:** None (Greenfield foundation)

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Strict Repository Isolation:** The Admin portal resides in its own isolated Git repository (`nukkadnow-admin`). It shares no relative file paths with customer or merchant apps. Contracts are consumed via generated OpenAPI client libraries.
- **KISS Tooling:** Turborepo handles task orchestration (`build`, `test`, `lint`, `clean`) with local hashing and caching. Standard Angular CLI standalone project structure with zero custom bundler complexities.
- **Strict TypeScript Baseline:** `tsconfig.base.json` enforces enterprise-grade strictness: `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, and explicit path mappings (`@nukkadnow/admin-*`).

### SOLID Standards
- **Single Responsibility (SRP):**
  - `libs/access-control`: Exclusively defines permission constants and role evaluation logic.
  - `libs/api-client`: Exclusively manages HTTP contract dispatch and endpoint mapping.
  - `libs/data-table`: Exclusively manages generic table rendering, pagination, and sorting.
  - `libs/ui`: Exclusively manages atomic presentation primitives.
- **Open/Closed (OCP):**
  - HTTP interceptor pipeline is open for extension (adding telemetry or auth headers) without modifying base HTTP client requests.
- **Dependency Inversion (DIP):**
  - Features depend on abstract tokens (`AdminApiClient`, `AdminSessionService`) rather than concrete platform implementations.

---

## 2. Security Architecture & Threat Defense

1. **Monorepo Boundary Guard:**
   - `tools/check-boundaries.mjs` verifies that no admin code leaks into public repositories and that internal DDD layers are strictly preserved (`libs/` cannot import `src/app/`).
2. **Container Security Hardening:**
   - Multi-stage Dockerfile drops privileges to non-root user `nginx:nginx`.
   - Read-only root filesystem with explicit tmpfs mounts for `/var/cache/nginx` and `/var/run`.
3. **Mandatory Production Security Headers:**
   - Nginx configuration enforces:
     - `Content-Security-Policy (CSP)`
     - `X-Frame-Options: DENY` (anti-clickjacking)
     - `X-Content-Type-Options: nosniff`
     - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - Verified automatically via `tools/verify-security-headers.mjs`.
4. **Zero Indexation Shield:**
   - `public/robots.txt` disallows all user agents to prevent search engine indexing.

---

## 3. Libraries & Infrastructure Deliverables

| Package / Artifact | Path | Responsibility |
|---|---|---|
| Workspace Package | `package.json` | Root pnpm package definition, Angular 18+ and dev scripts |
| Build Pipeline | `turbo.json` | Turborepo build and test caching graph |
| Path Mappings | `tsconfig.base.json` | Centralized `@nukkadnow/admin-*` path aliases |
| Boundary Verifier | `tools/check-boundaries.mjs` | Automated architectural boundary validation script |
| Security Verifier | `tools/verify-security-headers.mjs` | Automated Nginx header compliance script |
| Container Image | `Dockerfile` | Hardened Alpine Nginx container |
| Web Server Config | `nginx.conf` | Hardened reverse proxy configuration |
| CI Pipeline | `.github/workflows/ci.yml` | Linting, boundary validation, test, and build pipeline |

---

## 4. Definition of Done (DoD)

- [x] pnpm workspace and Turborepo caching configured cleanly.
- [x] Strict TypeScript configuration compiling with 0 errors.
- [x] `node tools/check-boundaries.mjs` passes with 0 violations.
- [x] `node tools/verify-security-headers.mjs` validates all mandatory security headers.
- [x] Multi-stage non-root Dockerfile and hardened `nginx.conf` established.
- [x] CI/CD workflows and CODEOWNERS committed.
