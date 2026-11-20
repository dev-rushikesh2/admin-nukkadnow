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

---

## 9. Comprehensive Changelog & Architectural Log

### [Release: 2026-11-18] — Dynamic Database RBAC Hierarchy, Geographic Scoping, Dual Theming & Role Simulator

#### 1. Dual-Theming Engine (Clean Light Mode & Dark Mode)
- **Token-Driven Theming:** Implemented CSS custom properties in `src/styles/tokens.scss` supporting both light (`#f8fafc` canvas, `#ffffff` surface, slate `#e2e8f0` borders, `#0f172a` primary text) and dark mode (`#0b0f19` canvas, `#111827` surface, `#1e293b` borders).
- **Zero-FOUC Synchronization:** Added inline theme detection script in `index.html` preventing theme flash during initial page load.
- **Theme Service:** Added `AdminThemeService` using Angular Signals (`signal<'light' | 'dark'>`) with persistent `localStorage` synchronization and OS `prefers-color-scheme` media query detection.
- **UI Toggles:** Added theme switcher button in `admin-topbar.component.ts` and on authentication/login pages.

#### 2. Four-Level Administrative Hierarchy Implementation
- **Level 1: Root Admin (`ROOT_ADMIN`):** Ultimate platform authority, platform founder/owner. Sovereign platform control. Protected account: cannot be created, modified, suspended, or deleted via the UI or API Gateway. Zero self-promotion permitted.
- **Level 2: Super Admin (`SUPER_ADMIN`):** Central platform operations across all cities. Supervise staff, configure feature flags, approve merchant payouts and refund escalations.
- **Level 3: City Operations Manager (`CITY_OPERATIONS_MANAGER`):** Geographic micro-market assignment (`state`, `district`, `cityId`, `cityName`, `localities`). Scoped to managing city staff, monitoring merchant verification, and city orders.
- **Level 4: Frontline Operational Staff:**
  - **Verification Staff (`VERIFICATION_STAFF`):** Statutory KYC queues (FSSAI, GSTIN, PAN, penny drop).
  - **Support Staff (`SUPPORT_STAFF`):** Customer/merchant support, order triage, and audited PII unmasking.
- **Level 5: Dynamic Custom Roles:** Custom operational roles dynamically provisioned and stored in database.

#### 3. Module Responsibilities & Scopes Matrix (Table 1 Spec)
Integrated authoritative governance matrix across all 11 core modules:
| Module | Root Admin | Super Admin | City Manager | Staff |
| :--- | :--- | :--- | :--- | :--- |
| Global dashboard | Full | Full | City only | Limited |
| Admin management | Full | Manage assigned staff | Manage city staff if authorized | No |
| Merchant management | Full | Full | Assigned city | Limited |
| Merchant verification | Full | Full | Monitor | Verify assigned applications |
| Customer management | Full | Full | City only | Support access |
| Order management | Full | Full | City only | Support access |
| Refunds | Full | Approve/manage by policy | Request/escalate | No direct approval |
| Geographic management | Full | Manage | View assigned city | No |
| Finance analytics | Full | Full | Limited city reports | No |
| Platform configuration | Full | Full | No | No |
| Audit logs | Full | Full | Own scope | Own actions |

#### 4. Screen 5: Dynamic Role & Permission Management (`/roles-permissions`)
- Replaced stub with full production interface fetching dynamic roles via `AdminApiClient.getPaginated(AdminEndpoints.PLATFORM_ROLES)`.
- Added interactive **"+ Create Dynamic Role" Modal** allowing creation of custom database-backed roles with code, display title, hierarchy level selection (Level 2-5; Level 1 Root protected), MFA toggle, and granular capability checklists grouped by module.
- Added role inspection modal to audit assigned granular permissions.
- Added custom role deletion action with strict protection for core system roles.

#### 5. Screen 3 & 4: Admin & Staff Management with Geographic Assignment (`/platform-users`)
- Replaced stub with full production operator roster fetching users via `AdminApiClient.getPaginated(AdminEndpoints.PLATFORM_USERS)`.
- Displays operator contact details, role badges, geographic assignment (city, state, localities), MFA status, and account state (`ACTIVE` / `SUSPENDED`).
- Added **"+ Provision Admin / Staff" Modal** with dynamic role selector (excluding `ROOT_ADMIN`) and geographic scope assignment block with multi-select locality chips.
- Added **Reassign Geographic Scope Modal** to update city and micro-market locality boundaries.
- Added account suspension/activation actions with Root Admin safeguards.

#### 6. Authentic Operator Authentication & Hierarchical Provisioning (Simulation Switching Removed)
- **Eliminated Simulation Switching:** Removed mock role dropdown from `admin-topbar.component.ts`. The UI strictly renders the authentic credentials and cryptographic permissions bound to the operator's individual session and bearer JWT.
- **Individual Credentials & Authentication:** Every admin user has their own unique username/work-email and password credentials:
  - `founder@nukkadnow.com` (`Root@Nukkad2026!`): Root Admin (Founder & Owner · Level 1 · Global Scope)
  - `admin@nukkadnow.com` (`Super@Nukkad2026!`): Super Admin (Central Platform · Level 2 · Global Scope)
  - `akola.ops@nukkadnow.com` (`Akola@Nukkad2026!`): Akola Operations Manager (Level 3 · Akola Territory)
  - `amravati.ops@nukkadnow.com` (`Amravati@Nukkad2026!`): Amravati Operations Manager (Level 3 · Amravati Territory)
  - `nagpur.ops@nukkadnow.com` (`Nagpur@Nukkad2026!`): Nagpur Operations Manager (Level 3 · Nagpur Territory)
  - `pune.ops@nukkadnow.com` (`Pune@Nukkad2026!`): Pune Operations Manager (Level 3 · Pune Territory)
  - `sunita.kyc@nukkadnow.com` (`Verify@Nukkad2026!`): Verification Staff (Level 4 · Nagpur KYC Queue)
  - `ananya.support@nukkadnow.com` (`Support@Nukkad2026!`): Support Staff (Level 4 · Customer & Merchant Support)
- **Unified Component Reuse with Municipal Isolation:**
  - Identical components (`Merchants`, `Orders`, `Refunds`, `Localities`, `KYC Queue`) are reused across all admin levels.
  - Akola shops and orders will never display in the Amravati or Pune dashboard, enforced via both the backend API Gateway (`resolveOperatorScope`) and the frontend HTTP interceptor (`adminAuthInterceptor`).
- **Hierarchical Operator Provisioning:**
  - Super Admin can provision City Operations Managers and Staff with custom passwords and geographic assignments; cannot provision Root Admin or Super Admin.
  - City Operations Managers can only provision Verification Staff and Support Staff locked to their designated municipal territory.
  - Staff users cannot provision subordinate administrators.
- **Dual Light (White) & Dark Mode Compliance:**
  - Production-ready, enterprise-grade high contrast design tokens in both White/Light Mode and Dark Modern Mode with seamless single-click header toggle.
- **Login Portal & MFA Challenge:**
  - `login.page.ts`: Connects to `POST /auth/login` with email and password, includes quick credential selector for testing all 8 standard roles, and routes to `/overview` or `/auth/mfa`.
  - `mfa-challenge.page.ts`: Connects to `POST /auth/mfa/verify` to validate 6-digit TOTP tokens and activate individual authenticated sessions.

#### 7. Build Verification
- `pnpm run build:prod` verified clean production bundle compilation with 0 errors across all 38 lazy feature chunks.

#### 8. Master Sprint Delivery Record (Sprints 1–10 Complete — 100% Master Scope)
- **Sprint 1 (Multi-City Core Operations):** Overview Command Center (`/overview`), Merchants Directory (`/merchants`, `/:id`), Live Orders Stream (`/orders`, `/:id`), Statutory KYC Queue (`/merchant-verification`, `/:id`), Dual-Sign Refunds (`/refunds-disputes`, `/:id`).
- **Sprint 2 (Geographic & Store Infrastructure):** Micro-Market Localities (`/localities`, `/:id`), Outlets & Capacity (`/outlets`, `/:id`), Categories Taxonomy & Commission Slabs (`/categories`, `/:id`).
- **Sprint 3 (Financials, SaaS & Catalog Governance):** Payments Ledger & Escrow (`/payments`, `/:id`), SaaS Subscriptions (`/subscriptions`, `/:id`), Pricing Plans (`/plans-pricing`, `/:id`), Catalogue Moderation & Price Ceilings (`/catalogue-moderation`, `/:id`).
- **Sprint 4 (Customer Helpdesk & Community Trust):** Support Helpdesk SLA Queue (`/support-tickets`, `/:id`), Reviews & UGC Moderation (`/reviews-moderation`, `/:id`), Omnichannel Broadcasts (`/notifications`, `/:id`).
- **Sprint 5 (Enterprise Governance & Telemetry):** Financial & Business Analytics (`/analytics`, `/:id`), Microservices Mesh & System Health (`/system-health`, `/:id`), Platform Governance Settings (`/settings`, `/:id`), Cryptographic Audit Trail Verification (`/audit-logs`, `/:id`).
- **Sprint 6 (Core Personas & Geo Expansion):** Universal Command Search (`Ctrl+K` omni-search palette), Administrator Profile (`/profile` with active session revocation and personal audit log), GeoJSON Multi-Polygon GIS Bulk Importer, Root Admin & City Ops Dedicated Dashboards.
- **Sprint 7 (Inventory Monitoring & Merchant Governance):** Centralized Inventory Monitoring Hub (`/inventory-monitoring` with Overview, Stock Health, Movement Audits, Cycle Discrepancies, Data Quality), Merchant Complaints Queue (#40), Merchant Disciplinary Suspension History (#41).
- **Sprint 8 (Customer Directory & Helpdesk Pro):** Customer Hub (`/customers` with `VIP`, `REPEAT`, `ACTIVE`, `NEW`, `INACTIVE` cohorts), Customer 360 Profile with Saved Delivery Addresses and Lifetime Spend, DPDP Act 2023 Compliant PII Unmasking Modal (5-min session timer & audit log), Account Suspension/Restoration Dialog.
- **Sprint 9 (Commerce Scheduling & Analytics Pro):** Storefront Counter QR Order Monitoring (#61), Festival Pre-orders & Scheduled Booking Calendar (#62), Outlet Hourly Capacity Throttle (#63), Order Disputes Queue (#59), 6-Stage Milestone Lifecycle Timeline (#60), COTPA & Prohibition Statutory Blocklists (#71, #72).
- **Sprint 10 (Fiduciary, Compliance & Governance):** Merchant Commission Invoices Archive (#87, #93), Statutory GSTR-1, GSTR-3B & Section 52 TCS Filings (#88, #92) with JSON/CSV export, Payment Gateway Failures Diagnostics (#89), Four-Eyes Dual-Sign Financial Audit Ledger (#90), SaaS Subscription Receipts (#95), Upcoming Plan Renewals & Dunning (#96), Promotional Onboarding Coupons (#97, #104) with "+ Create Coupon" dialog, SaaS Churn Analytics (#98), Live Gateway Latency Ping (#133), SIEM Security Intrusion Threat Feed (#142).

#### 9. Master 149-Screen Specification & Gap Analysis
- Documented in [ADMIN_149_PAGES_GAP_ANALYSIS_AND_BLUEPRINT.md](file:///c:/Nukkadnow/ADMIN_149_PAGES_GAP_ANALYSIS_AND_BLUEPRINT.md).
- Detailed audit covering all 149 administrative screens across 15 operational modules.
- Defined hierarchical tabbed architecture to ensure 100% operational coverage while avoiding sidebar bloat.
- Seeded test datasets in `nukkadnow-backend/prisma/seeders/` covering all 4 municipal territories and 28 entity domains.


