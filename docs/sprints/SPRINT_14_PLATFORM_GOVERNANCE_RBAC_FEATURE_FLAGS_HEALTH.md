# Sprint 14 — Platform Governance, RBAC, Feature Flags & System Health

- **Sprint ID:** NNK-ADM-SPRINT-14
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/platform-users/*`, `src/app/features/roles-permissions/*`, `src/app/features/feature-flags/*`, `src/app/features/system-health/*`, `src/app/features/settings/*`
- **Dependencies:** Sprint 01, Sprint 02

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Shared Access Control Matrix:** All roles and permissions derive from `@nukkadnow/admin-access-control`. No hardcoded permission strings in UI templates.
- **KISS Circuit Breakers:** Emergency platform kill-switches (e.g., "Pause Ordering Systemwide" or "Disable Payment Provider B") feature a prominent toggle with a confirmation safety switch.
- **Unified Health Mesh Grid:** System health nodes display standardized status lights (`HEALTHY`, `DEGRADED`, `CRITICAL`) with latency meters.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `PlatformUsersApi`: Manages operator accounts, roles, and session terminations.
  - `FeatureFlagsApi`: Manages dynamic runtime toggles and canary rollout percentages.
  - `SystemHealthApi`: Telemetry polling for microservice health and broker queue lag.
- **Open/Closed (OCP):**
  - New microservices automatically surface in the health dashboard by adhering to standard `/health` contract responses.
- **Dependency Inversion (DIP):**
  - Feature components depend on `PlatformUsersRepository` and `FeatureFlagsRepository` abstractions.

---

## 2. Security Architecture & Threat Defense

1. **Step-Up Authentication for Circuit Breakers:**
   - Toggling critical feature flags (e.g., maintenance mode or gateway failover) strictly requires Step-Up MFA and mandatory reason logging.
2. **Instant Operator Session Revocation:**
   - Super-Admins can instantly terminate compromised operator sessions across all devices via the `Force Logout` command.
3. **Least Privilege Enforcement:**
   - Operators can only view and edit domains explicitly granted by their role in `ADMIN_ROLE_MATRIX`.
4. **Maintenance Mode Safeguards:**
   - Activating systemwide maintenance gracefully completes existing checkouts while presenting friendly maintenance banners to new customers.

---

## 3. Core Deliverables & File Layout

```text
src/app/features/
├── platform-users/
│   ├── data-access/
│   │   ├── platform-users.api.ts               # Operator accounts and session revocation
│   │   ├── platform-users.repository.ts
│   │   └── platform-users.mapper.ts
│   ├── state/
│   │   └── platform-users.store.ts
│   ├── pages/
│   │   ├── platform-users-list.page.html       # Operator directory & active sessions table
│   │   └── platform-users-list.page.ts
│   ├── platform-users.routes.ts
│   └── index.ts
├── roles-permissions/
│   ├── pages/
│   │   ├── roles-permissions-list.page.html    # 48-permission interactive RBAC matrix
│   │   └── roles-permissions-list.page.ts
│   ├── roles-permissions.routes.ts
│   └── index.ts
├── feature-flags/
│   ├── data-access/
│   │   ├── feature-flags.api.ts                # Runtime flag toggles
│   │   ├── feature-flags.repository.ts
│   │   └── feature-flags.mapper.ts
│   ├── state/
│   │   └── feature-flags.store.ts
│   ├── pages/
│   │   ├── feature-flags-list.page.html        # Kill-switches & canary rollout controls
│   │   └── feature-flags-list.page.ts
│   ├── feature-flags.routes.ts
│   └── index.ts
├── system-health/
│   ├── data-access/
│   │   ├── system-health.api.ts                # Microservices mesh telemetry
│   │   ├── system-health.repository.ts
│   │   └── system-health.mapper.ts
│   ├── pages/
│   │   ├── system-health-list.page.html        # Database pools, Redis, RabbitMQ telemetry
│   │   └── system-health-list.page.ts
│   ├── system-health.routes.ts
│   └── index.ts
└── settings/
    ├── pages/
    │   ├── settings-list.page.html             # Platform maintenance mode & security policies
    │   └── settings-list.page.ts
    ├── settings.routes.ts
    └── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Operator directory displays active staff accounts, roles, and MFA statuses.
- [ ] Force session revocation immediately terminates operator access.
- [ ] 48-permission RBAC matrix viewer functional.
- [ ] Emergency feature flag toggles require Step-Up MFA and generate audit records.
- [ ] System health dashboard displays microservices status, RabbitMQ lag, and Redis memory.
- [ ] Unit tests cover `PlatformUsersStore` and `FeatureFlagsStore`.
