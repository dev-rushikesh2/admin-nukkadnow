# Sprint 12 — Merchant SaaS Subscriptions, Plans & Billing Governance

- **Sprint ID:** NNK-ADM-SPRINT-12
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/subscriptions/*`, `src/app/features/plans-pricing/*`
- **Dependencies:** Sprint 01, Sprint 10

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Reusable Plan Feature Matrix:** Shared comparison grid displays SaaS tier entitlements (Max products, staff accounts, SMS quotas, reporting depth).
- **KISS Exemption Waiver:** Waiving a merchant's subscription fee for the pilot period requires 1 click: Click "Grant Pilot Waiver" $\rightarrow$ select duration (30/60/90 days).
- **Consistent Tax Formatting:** GST breakdowns (CGST + SGST or IGST) are calculated and displayed cleanly using standard currency helpers.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `SubscriptionsApi`: Manages merchant subscription status and renewal grace periods.
  - `PlansPricingApi`: Manages platform plan tiers and transaction fee rules.
  - `SubscriptionsStore`: Manages merchant billing signals and active plan quotas.
- **Open/Closed (OCP):**
  - New tier add-ons (e.g., WhatsApp marketing credits or priority search placement) can be configured without modifying base subscription views.
- **Dependency Inversion (DIP):**
  - Subscription components consume `SubscriptionsRepository` abstraction.

---

## 2. Security Architecture & Threat Defense

1. **Server-Side Entitlement Authority:**
   - The admin client displays entitlement quotas, but all feature gating is strictly enforced server-side. The client cannot grant unauthorized features.
2. **Exemption Waiver Auditing:**
   - Manual waivers (granting free platform access) directly impact platform revenue; every waiver requires a mandatory Audit Reason Code.
3. **GST Tax Compliance:**
   - Generated merchant tax invoices include verified legal business names, GSTIN, and HSN/SAC codes.

---

## 3. Core Deliverables & File Layout

```text
src/app/features/
├── subscriptions/
│   ├── data-access/
│   │   ├── subscriptions.api.ts                # Subscriptions & renewal management
│   │   ├── subscriptions.repository.ts
│   │   └── subscriptions.mapper.ts
│   ├── state/
│   │   ├── subscriptions.store.ts              # Subscriptions Signal store
│   │   └── subscriptions.selectors.ts
│   ├── pages/
│   │   ├── subscriptions-list.page.html        # Active merchant subscriptions table
│   │   ├── subscriptions-list.page.ts
│   │   └── subscriptions-details.page.ts       # Plan limits, billing history & waiver actions
│   ├── subscriptions.routes.ts
│   └── index.ts
└── plans-pricing/
    ├── data-access/
    │   ├── plans-pricing.api.ts                # Plan definitions and pricing slabs
    │   ├── plans-pricing.repository.ts
    │   └── plans-pricing.mapper.ts
    ├── state/
    │   └── plans-pricing.store.ts              # SaaS Plans Signal store
    ├── pages/
    │   ├── plans-pricing-list.page.html        # SaaS tier matrix (Starter, Growth, Pro)
    │   └── plans-pricing-list.page.ts
    ├── plans-pricing.routes.ts
    └── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Subscriptions directory lists merchant plan tiers, renewal dates, and payment statuses.
- [ ] SaaS plans matrix (Starter Kirana, Growth Merchant, Multi-Outlet) editable by Finance Admins.
- [ ] Nagpur pilot promotional fee waiver workflow operational with audit logging.
- [ ] GST invoice PDF viewer functional.
- [ ] Unit tests cover `SubscriptionsStore` and `PlansPricingStore`.
