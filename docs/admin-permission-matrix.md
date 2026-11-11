# NukkadNow Super-Admin — Granular RBAC / PBAC Permission Matrix

> **Security Classification:** Restricted / Internal Platform Governance  
> **Target Environment:** Nagpur Pilot & Hyperlocal Multi-Tenant Scale  
> **Enforcement:** Client-side Route & Component Guards + Server-side Gateway BFF Authorizers

---

## 1. Administrative Roles

| Role Code | Title | MFA Mandatory | Step-Up Eligible | Scope |
|---|---|---|---|---|
| `SUPER_ADMIN` | Super Administrator | Yes (Hardware/TOTP) | Yes | Full platform administrative sovereignty across all microservices |
| `PLATFORM_OPS` | Platform Operations Engineer | Yes (TOTP) | Yes | Locality geofences, capacity throttles, circuit breakers, system health |
| `FINANCE_ADMIN` | Finance & Settlement Officer | Yes (TOTP) | Yes | Escrow payout release, high-tier refunds, dispute resolution, invoices |
| `COMPLIANCE_LEAD` | KYC & Compliance Lead | Yes (TOTP) | Yes | Merchant onboarding (FSSAI/GST/Bank), catalog moderation, suspensions |
| `SUPPORT_AGENT` | Customer & Merchant Support | Optional | No | Ticket resolution, order inspection, low-tier refund triage |
| `READONLY_AUDITOR`| Regulatory & Internal Auditor | Yes (TOTP) | No | Read-only inspection of immutable audit ledger & financial aggregates |

---

## 2. Exhaustive Permission Matrix

| Permission Identifier | Domain | Requires Step-Up MFA | Mandatory Reason Code | SUPER ADMIN | PLATFORM OPS | FINANCE ADMIN | COMPLIANCE LEAD | SUPPORT AGENT | AUDITOR |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `admin:merchants:read` | Merchants | No | No | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `admin:merchants:create` | Merchants | No | No | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admin:merchants:update` | Merchants | No | No | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:merchants:suspend` | Merchants | **YES** | **YES** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:merchants:terminate` | Merchants | **YES** | **YES** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admin:kyc:read` | Verification | No | No | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `admin:kyc:review` | Verification | No | No | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:kyc:approve` | Verification | No | No | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:kyc:reject` | Verification | **YES** | **YES** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:outlets:read` | Outlets | No | No | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `admin:outlets:manage` | Outlets | No | No | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:outlets:override_hours` | Outlets | No | No | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:outlets:geofence_edit` | Outlets | No | No | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:localities:read` | Localities | No | No | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:localities:manage` | Localities | No | No | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:categories:manage` | Categories | No | No | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:catalog:read` | Catalog | No | No | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:catalog:moderate` | Catalog | No | No | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:catalog:takedown` | Catalog | No | **YES** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:orders:read` | Orders | No | No | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `admin:orders:intervene` | Orders | No | No | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `admin:orders:force_cancel` | Orders | No | **YES** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admin:payments:read` | Payments | No | No | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| `admin:payments:reconcile` | Payments | No | No | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `admin:payments:webhook_retry` | Payments | No | No | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `admin:refunds:read` | Refunds | No | No | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| `admin:refunds:approve_low` | Refunds (≤ ₹5k) | No | **YES** | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| `admin:refunds:approve_high`| Refunds (> ₹5k) | **YES** | **YES** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `admin:disputes:resolve` | Disputes | **YES** | **YES** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `admin:subscriptions:read` | Subscriptions | No | No | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| `admin:subscriptions:manage` | Subscriptions | No | No | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `admin:pricing:manage` | Pricing Slabs | No | No | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `admin:support:read` | Support | No | No | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `admin:support:assign` | Support | No | No | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `admin:support:resolve` | Support | No | No | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `admin:reviews:read` | Reviews | No | No | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| `admin:reviews:moderate` | Reviews | No | No | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:notifications:send` | Notifications | No | No | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:analytics:read` | Analytics | No | No | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| `admin:analytics:financial_export` | Financial CSV | **YES** | **YES** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `admin:platform:users_manage` | Operator Mgmt | **YES** | **YES** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admin:platform:roles_manage` | Role Policy | **YES** | **YES** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admin:feature_flags:read` | Flags | No | No | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:feature_flags:toggle` | Flag Switch | **YES** | **YES** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:system_health:read` | Health Mesh | No | No | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `admin:system:maintenance_toggle` | Maintenance | **YES** | **YES** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `admin:audit_logs:read` | Audit Ledger | No | No | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `admin:audit:unmask_pii` | PII Unmask | **YES** | **YES** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `admin:settings:manage` | Platform Policy | No | No | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
