# Sprint 15 — Immutable Audit Trail, PII Unmasking & Pilot Launch Hardening

- **Sprint ID:** NNK-ADM-SPRINT-15
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/audit-logs/*`, `src/app/features/analytics/*`, `e2e/*`, Production Container Verification
- **Dependencies:** Sprints 00 through 14

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Universal Audit Log Viewer:** `AuditLogsListPageComponent` uses `DataTableComponent` to display all security events across all 23 domains without domain-specific table duplication.
- **KISS Click-to-Unmask PII:** Operators with `admin:audit:unmask_pii` privileges can reveal masked data via 1 click on the eye icon, automatically generating a logged access entry.
- **Standardized Export Pipeline:** CSV and Excel financial exports require Step-Up verification and log the generated file checksum.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `AuditLogsApi`: Communicates with `/api/v1/admin/audit/logs` endpoints.
  - `AnalyticsApi`: Manages aggregate GMV and cohort retention projections.
  - `AuditLogsStore`: Manages immutable audit query signals and date filters.
- **Open/Closed (OCP):**
  - New audit categories (e.g., AI moderation overrides or tax authority requests) can be added without modifying the audit log viewer.
- **Dependency Inversion (DIP):**
  - Compliance views depend on `AuditLogsRepository` abstraction.

---

## 2. Security Architecture & Threat Defense

1. **Append-Only Tamper-Evident Logs:**
   - Audit records are strictly immutable. No administrative role, including `SUPER_ADMIN`, can edit or delete an audit entry.
2. **PII Access Logging (Section 8.2 Compliance):**
   - Every single time an operator unmasks a customer's phone number, PAN, Aadhaar, or home-maker address, an immutable `AUDIT_PII_UNMASK` record is published.
3. **Financial Export Auditing:**
   - Exporting financial ledger CSV files requires Step-Up MFA authentication and records the operator ID, timestamp, and query parameters.
4. **Zero Secrets in Production Bundle:**
   - Pre-flight automated scan ensures no private keys, passwords, or backend credentials exist in the client distribution artifacts.

---

## 3. Core Deliverables & File Layout

```text
src/app/features/
├── audit-logs/
│   ├── data-access/
│   │   ├── audit-logs.api.ts                   # Search immutable audit trail
│   │   ├── audit-logs.repository.ts
│   │   └── audit-logs.mapper.ts
│   ├── state/
│   │   └── audit-logs.store.ts                 # Audit Logs Signal store
│   ├── pages/
│   │   ├── audit-logs-list.page.html           # Immutable audit trail table with operator filters
│   │   └── audit-logs-list.page.ts
│   ├── audit-logs.routes.ts
│   └── index.ts
└── analytics/
    ├── data-access/
    │   ├── analytics.api.ts                    # Executive GMV and retention reports
    │   ├── analytics.repository.ts
    │   └── analytics.mapper.ts
    ├── state/
    │   └── analytics.store.ts
    ├── pages/
    │   ├── analytics-list.page.html            # GMV trends, locality heatmaps, CSV exports
    │   └── analytics-list.page.ts
    ├── analytics.routes.ts
    └── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Immutable audit log viewer displays all administrative mutations with operator ID, reason code, and timestamp.
- [ ] PII unmasking logs access records automatically.
- [ ] Analytics dashboard displays GMV charts, cohort retention, and secure CSV exports.
- [ ] Automated boundary validation (`node tools/check-boundaries.mjs`) passes with 0 violations.
- [ ] Security header check (`node tools/verify-security-headers.mjs`) passes with 0 violations.
- [ ] Playwright E2E integration test suite passing.
- [ ] Multi-stage production container builds successfully and passes health probes on port 8080.
- [ ] Super-Admin portal fully certified for the Nagpur Locality Pilot launch.
