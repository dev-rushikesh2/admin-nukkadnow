# NukkadNow Super-Admin & Platform Operations Portal

> **Locality-First Indian Commerce Marketplace & Merchant SaaS** · Nagpur Pilot  
> **Repository:** `nukkadnow-admin` · Restricted Super-Admin Web Application  
> **Stack:** Angular 18+ Standalone Components · TypeScript 5.5 (Strict Mode) · Signal Reactivity · Clean Architecture (DDD) · pnpm Workspace · Turborepo

---

## 1. Executive Architecture Overview

`nukkadnow-admin` is the high-assurance, restricted administrative command center for the NukkadNow hyperlocal commerce ecosystem. Designed according to **Domain-Driven Design (DDD)** and **Zero-Trust Security** principles, it provides platform operators, compliance officers, and finance administrators with comprehensive operational governance over merchants, outlets, verification queues, orders, payments, subscriptions, and system health.

```text
nukkadnow-admin/
├── .github/                       # CI/CD Workflows (ci, deploy, security) & CODEOWNERS
├── public/                        # Static assets & robots.txt (Disallow: /)
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Root Angular bootstrap shell
│   │   ├── app.config.ts          # Application providers, routers, HTTP interceptors
│   │   ├── app.routes.ts          # Lazy-loaded feature routes & security guards
│   │   ├── core/                  # Singleton platform services & security infrastructure
│   │   │   ├── auth/              # In-memory session, MFA challenge, step-up privilege, idle locks
│   │   │   ├── permissions/       # Fine-grained RBAC/PBAC policy engine, guards & directives
│   │   │   ├── http/              # Bearer auth, audit headers, correlation IDs, CSRF, error mapping
│   │   │   ├── audit-context/     # Cryptographic audit logging, reason codes & prompts
│   │   │   ├── realtime/          # Secure administrative WebSocket stream & alert monitors
│   │   │   └── error-handling/    # Sanitized global error handler & security incident logger
│   │   ├── layout/                # Master administrative chrome
│   │   │   ├── admin-shell/       # Main container layout with idle warning & modal hosts
│   │   │   ├── sidebar/           # High-density categorized navigation with permission filters
│   │   │   ├── topbar/            # Global command search trigger, profile, step-up badge, lock
│   │   │   └── command-search/    # Ctrl+K / Cmd+K rapid search command palette
│   │   ├── shared/                # Enterprise UI components, directives, pipes & validators
│   │   │   ├── components/        # Audit reason modal, Step-up MFA modal, Confirmation dialogs
│   │   │   ├── directives/        # *adminHasPermission, adminSensitiveAction
│   │   │   ├── pipes/             # INR currency (₹/Paise), PII masking, relative time, safe HTML
│   │   │   └── validators/        # Indian compliance (PAN, GSTIN, FSSAI, IFSC, Phone)
│   │   └── features/              # 23 Modular DDD Clean Architecture Domain Features
│   │       ├── authentication/    # Operator login, MFA challenge & inactivity lock screen
│   │       ├── overview/          # Command center KPI dashboard & locality pressure map
│   │       ├── merchants/         # Merchant registry, business profiles & suspension lifecycle
│   │       ├── merchant-verification/ # KYC queue, FSSAI, GSTIN, and bank account approval
│   │       ├── outlets/           # Outlets directory, operating hours & geofence polygons
│   │       ├── localities/        # Nagpur micro-markets (Sadar, Dharampeth, Ramdaspeth, etc.)
│   │       ├── categories/        # Hyperlocal category taxonomy & commission slabs
│   │       ├── catalogue-moderation/ # Product audit, pricing sanity & prohibited goods
│   │       ├── orders/            # Live order stream, timeline inspection & force cancellations
│   │       ├── payments/          # Gateway transactions, settlement batches & failed webhooks
│   │       ├── refunds-disputes/  # Customer refunds, dual-approval ledger & chargebacks
│   │       ├── subscriptions/     # Merchant SaaS subscriptions & billing renewal
│   │       ├── plans-pricing/     # SaaS tiers, transaction fee rules & pilot locality offers
│   │       ├── support-tickets/   # Support helpdesk queue, SLA monitoring & assignment
│   │       ├── reviews-moderation/ # Ratings review queue, spam detection & merchant disputes
│   │       ├── notifications/     # System broadcasts & SMS/WhatsApp delivery logs
│   │       ├── analytics/         # Financial reports, merchant cohorts & locality heatmaps
│   │       ├── platform-users/    # Admin staff directory, role grants & force logout
│   │       ├── roles-permissions/ # Granular RBAC matrix editor & privilege elevation policies
│   │       ├── feature-flags/     # Runtime canary toggles & emergency circuit breaker switches
│   │       ├── system-health/     # Microservice mesh telemetry, Redis cache & queue lag
│   │       ├── audit-logs/        # Immutable trail, operator activity search & PII unmask logs
│   │       └── settings/          # Platform maintenance mode & security timeout policies
│   ├── assets/                    # Icons, regional maps, translation dictionaries
│   ├── environments/              # Type-checked environment configs (local, staging, prod)
│   ├── styles/                    # Design tokens, Inter typography, tables, forms, dark theme
│   ├── index.html                 # Hardened HTML shell with security meta tags
│   └── main.ts                    # Standalone Angular application bootstrap
├── libs/                          # Modular Shared Workspace Libraries
│   ├── access-control/            # RBAC/PBAC permission constants, roles & policy engine
│   ├── api-client/                # Typed Admin BFF HTTP client, endpoints & response models
│   ├── data-table/                # High-performance enterprise data table with sorting/pagination
│   ├── ui/                        # High-density badges, metric cards, page headers, modals
│   └── testing/                   # Test utilities, mock auth providers & fixture builders
├── tools/                         # Client generation, boundary validation, security checkers
├── docs/                          # Security architecture, permission matrix, SOPs, deployment
├── e2e/                           # Playwright end-to-end integration tests
├── Dockerfile                     # Multi-stage non-root hardened Nginx Alpine image
├── nginx.conf                     # Hardened reverse proxy configuration with CSP & HSTS
├── angular.json                   # Angular workspace configuration
├── turbo.json                     # Turborepo task pipeline cache
├── pnpm-workspace.yaml            # pnpm monorepo package definitions
├── tsconfig.base.json             # Root strict TypeScript configuration and path aliases
├── eslint.config.mjs              # Modern flat ESLint configuration with boundary enforcement
└── README.md                      # This documentation
```

---

## 2. High-Assurance Security Guardrails

| Security Control | Implementation Mechanism | Purpose |
|---|---|---|
| **Zero-Trust Network Isolation** | Dedicated `admin.nukkadnow.example` domain & restricted API gateway ingress | Physical separation of administrative traffic from customer/merchant traffic |
| **In-Memory Token Lifecycle** | Reactive Angular Signals via `AdminSessionService` | Raw access tokens are **never** stored in `localStorage` or `sessionStorage` (XSS immune) |
| **Mandatory MFA (TOTP / WebAuthn)** | Enforced for all privileged operator logins via `MfaChallengePageComponent` | Prevents unauthorized credential stuffing or password reuse attacks |
| **Step-Up Authentication** | Elevated challenge via `StepUpAuthService` (5-minute TTL ticket) | Required before executing high-risk mutations (merchant suspension, high-value refunds, flags) |
| **Mandatory Audit Reason Codes** | `AuditReasonDialogService` & `auditContextInterceptor` | Injects cryptographically signed reason codes (`X-Audit-Reason`) on mutating actions |
| **Automated Inactivity Screen Lock** | `IdleTimeoutService` (15-minute threshold) | Automatically locks console if operator workstation is unattended |
| **PII Data Masking by Default** | `PiiMaskComponent` & `PiiMaskPipe` | Indian mobile numbers, PAN, GSTIN, and Aadhaar numbers masked; unmasking is audited |
| **Hardened HTTP Headers** | Nginx container template | Enforces `CSP`, `X-Frame-Options: DENY`, `HSTS`, `Permissions-Policy`, `X-Content-Type-Options` |
| **Crawling & Indexing Shield** | `public/robots.txt` (`Disallow: /`) | Strictly blocks search engine crawlers and web indexers from discovering admin URLs |

---

## 3. Standard Angular Feature Layout (DDD Clean Architecture)

All 23 domain features follow the strict architectural pattern specified in **Section 3.1** of `NUKKADNOW_REPOSITORY_ARCHITECTURE.md`:

```text
features/{feature-name}/
├── {feature-name}.routes.ts        # Lazy-loaded route definitions
├── pages/                          # Route-level views
│   ├── {feature-name}-list.page.ts
│   ├── {feature-name}-list.page.html
│   ├── {feature-name}-list.page.scss
│   └── {feature-name}-details.page.ts
├── components/                     # Feature-local presentation components
│   ├── {feature-name}-card.component.ts
│   └── {feature-name}-status-chip.component.ts
├── data-access/                    # Data sources, mappers, and repositories
│   ├── {feature-name}.api.ts
│   ├── {feature-name}.repository.ts
│   └── {feature-name}.mapper.ts
├── state/                          # Signal stores & reactive selectors
│   ├── {feature-name}.store.ts
│   └── {feature-name}.selectors.ts
├── models/                         # Feature view models
│   └── {feature-name}-view.model.ts
├── utils/                          # Feature-specific helpers & formatters
│   └── {feature-name}.utils.ts
├── {feature-name}.spec.ts          # Feature unit tests
└── index.ts                        # Feature public barrel exports
```

### Architectural Principles:
1. **Unidirectional Dependency Flow:** `Presentation (pages/components) → Application State (store) → Data Access (repository/api) → HTTP Client`.
2. **Reactivity:** Angular Signals (`signal()`, `computed()`) manage state and view derivations. RxJS manages asynchronous network streams and WebSockets.
3. **Change Detection:** Enforced `ChangeDetectionStrategy.OnPush` across all components for maximum rendering efficiency and memory stability.
4. **Isolated Contracts:** The Admin application consumes dedicated `@nukkadnow/admin-api-client` endpoints; it never depends on backend entities or customer/merchant application source files.

---

## 4. Shared Libraries (`libs/`)

| Library Path | Package Name | Responsibility |
|---|---|---|
| `libs/access-control` | `@nukkadnow/admin-access-control` | Granular permission constants, role definitions (`SUPER_ADMIN`, `PLATFORM_OPS`, etc.), and policy evaluator. |
| `libs/api-client` | `@nukkadnow/admin-api-client` | Strongly-typed administrative gateway BFF HTTP client, endpoints, and response models. |
| `libs/data-table` | `@nukkadnow/admin-data-table` | High-performance enterprise data table with server pagination, sorting, search, and loading skeletons. |
| `libs/ui` | `@nukkadnow/admin-ui` | High-density administrative UI primitives: metric cards, badges, page headers, modals, and PII masks. |
| `libs/testing` | `@nukkadnow/admin-testing` | Test harnesses, mock authentication providers, and entity fixture generators. |

---

## 5. Development & Verification CLI

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Run local development server (Port 4202)
pnpm run dev

# 3. Verify architectural boundaries (Ensures DDD compliance)
pnpm run check:boundaries

# 4. Verify production security headers (Validates CSP and anti-clickjacking)
pnpm run check:security

# 5. Execute unit tests with code coverage
pnpm run test:unit

# 6. Run Playwright end-to-end integration tests
pnpm run e2e

# 7. Build optimized production bundle
pnpm run build:prod
```

---

## 6. Docker Containerization

The admin portal is containerized as an unprivileged, non-root Alpine Nginx container:

```bash
# Build production image
docker build -t nukkadnow-admin:latest .

# Run container on port 8080
docker run -d --name nukkadnow-admin -p 8080:8080 nukkadnow-admin:latest
```

---

## 7. Pilot Deployment Context (Nagpur, Maharashtra)

- **Default Regional Scope:** Nagpur Municipal Corporation boundaries and immediate suburban peri-urban hubs.
- **Initial Core Localities:** Dharampeth, Sadar, Ramdaspeth, Sitabuldi, Wardha Road / Somalwada, Mahal / Itwari.
- **Regulatory Compliance:** Pre-configured Indian compliance validators for 14-digit FSSAI licenses, 15-character GSTIN certificates, 10-character PAN, and penny-drop bank account verification.

---

## 8. Master Sprint Roadmap & Execution Documentation

The platform development is tracked across **16 modular, test-driven sprints** conforming strictly to DRY, KISS, and SOLID engineering standards:

- **Master Roadmap:** [`docs/NUKKADNOW_ADMIN_SPRINT_ROADMAP.md`](file:///c:/Nukkadnow/admin/docs/NUKKADNOW_ADMIN_SPRINT_ROADMAP.md)
- **Sprint 00:** [`docs/sprints/SPRINT_00_ADMIN_FOUNDATION_ZERO_TRUST_TOOLING.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_00_ADMIN_FOUNDATION_ZERO_TRUST_TOOLING.md) — Foundation, Boundaries & Tooling
- **Sprint 01:** [`docs/sprints/SPRINT_01_ADMIN_DESIGN_SYSTEM_DATA_TABLE_THEMING.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_01_ADMIN_DESIGN_SYSTEM_DATA_TABLE_THEMING.md) — Dark Design System & Data Table
- **Sprint 02:** [`docs/sprints/SPRINT_02_AUTH_MFA_STEP_UP_SESSION_LOCK.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_02_AUTH_MFA_STEP_UP_SESSION_LOCK.md) — Operator Auth, MFA & Inactivity Lock
- **Sprint 03:** [`docs/sprints/SPRINT_03_COMMAND_CENTER_OVERVIEW_REALTIME_TELEMETRY.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_03_COMMAND_CENTER_OVERVIEW_REALTIME_TELEMETRY.md) — Command Center & Real-Time Telemetry
- **Sprint 04:** [`docs/sprints/SPRINT_04_MERCHANT_DIRECTORY_LIFECYCLE_SUSPENSION.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_04_MERCHANT_DIRECTORY_LIFECYCLE_SUSPENSION.md) — Merchant Registry & Suspension
- **Sprint 05:** [`docs/sprints/SPRINT_05_MERCHANT_VERIFICATION_KYC_AUDIT_ENGINE.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_05_MERCHANT_VERIFICATION_KYC_AUDIT_ENGINE.md) — Merchant KYC & Penny-Drop Bank Reconciliation
- **Sprint 06:** [`docs/sprints/SPRINT_06_OUTLETS_GEOFENCING_CAPACITY_NAGPUR_LOCALITIES.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_06_OUTLETS_GEOFENCING_CAPACITY_NAGPUR_LOCALITIES.md) — Outlets, Capacity & Nagpur Geofencing
- **Sprint 07:** [`docs/sprints/SPRINT_07_CATEGORY_TAXONOMY_COMMISSION_SLABS.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_07_CATEGORY_TAXONOMY_COMMISSION_SLABS.md) — Category Taxonomy & Commission Slabs
- **Sprint 08:** [`docs/sprints/SPRINT_08_CATALOG_MODERATION_PRICE_SANITY_TAKEDOWN.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_08_CATALOG_MODERATION_PRICE_SANITY_TAKEDOWN.md) — Catalog Moderation & Takedown Engine
- **Sprint 09:** [`docs/sprints/SPRINT_09_GLOBAL_LIVE_ORDERS_STREAM_EMERGENCY_INTERVENTION.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_09_GLOBAL_LIVE_ORDERS_STREAM_EMERGENCY_INTERVENTION.md) — Live Orders Stream & Emergency Interventions
- **Sprint 10:** [`docs/sprints/SPRINT_10_PAYMENTS_ESCROW_SETTLEMENTS_WEBHOOK_REPLAY.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_10_PAYMENTS_ESCROW_SETTLEMENTS_WEBHOOK_REPLAY.md) — Payments Ledger, Escrow & Webhook Replay
- **Sprint 11:** [`docs/sprints/SPRINT_11_REFUNDS_DISPUTES_FOUR_EYES_DUAL_APPROVAL.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_11_REFUNDS_DISPUTES_FOUR_EYES_DUAL_APPROVAL.md) — Refunds & Four-Eyes Dual Approval
- **Sprint 12:** [`docs/sprints/SPRINT_12_MERCHANT_SAAS_SUBSCRIPTIONS_PLANS_PRICING.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_12_MERCHANT_SAAS_SUBSCRIPTIONS_PLANS_PRICING.md) — SaaS Subscriptions, Plans & Waivers
- **Sprint 13:** [`docs/sprints/SPRINT_13_HELPDESK_SUPPORT_TICKETS_REVIEWS_MODERATION.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_13_HELPDESK_SUPPORT_TICKETS_REVIEWS_MODERATION.md) — Support Helpdesk & Reviews Moderation
- **Sprint 14:** [`docs/sprints/SPRINT_14_PLATFORM_GOVERNANCE_RBAC_FEATURE_FLAGS_HEALTH.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_14_PLATFORM_GOVERNANCE_RBAC_FEATURE_FLAGS_HEALTH.md) — Platform Governance, RBAC & Feature Flags
- **Sprint 15:** [`docs/sprints/SPRINT_15_IMMUTABLE_AUDIT_TRAIL_PII_UNMASKING_LAUNCH.md`](file:///c:/Nukkadnow/admin/docs/sprints/SPRINT_15_IMMUTABLE_AUDIT_TRAIL_PII_UNMASKING_LAUNCH.md) — Audit Trail, PII Unmasking & Launch Hardening
