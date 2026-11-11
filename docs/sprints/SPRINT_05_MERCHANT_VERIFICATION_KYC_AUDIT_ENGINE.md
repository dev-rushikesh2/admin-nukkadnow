# Sprint 05 — Merchant KYC Verification & Regulatory Compliance Engine

- **Sprint ID:** NNK-ADM-SPRINT-05
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/merchant-verification/*`, `src/app/shared/validators/*`
- **Dependencies:** Sprint 01, Sprint 02, Sprint 04

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Shared Compliance Validators:** Indian document regex validators (`fssaiValidator`, `gstinValidator`, `panValidator`, `ifscValidator`) reside in `src/app/shared/validators/indian-compliance.validators.ts`, eliminating duplicate validation rules across frontend forms.
- **KISS Verification Workbench:** Split-screen operator view: Left side displays uploaded document preview/PDF zoom; Right side displays extracted metadata and 1-click `Approve` / `Reject` buttons.
- **Predictable Status Updates:** State updates immediately reflect in the verification badge without requiring a manual full-page refresh.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `MerchantVerificationApi`: Communicates with `/api/v1/admin/merchants/:id/kyc` endpoints.
  - `MerchantVerificationStore`: Manages verification queue state and selected document review.
  - `IndianComplianceValidators`: Pure validation functions with zero side effects.
- **Open/Closed (OCP):**
  - New document types (e.g., Trade License, Shop & Establishment Certificate) can be audited by adding document type definitions without modifying verification queue components.
- **Dependency Inversion (DIP):**
  - Document review components depend on `MerchantVerificationRepository` abstraction.

---

## 2. Security Architecture & Threat Defense

1. **Indian Statutory Compliance Checks:**
   - **FSSAI License:** Validates 14-digit numeric license against Food Safety and Standards Authority of India format.
   - **GSTIN:** Validates 15-character Goods and Services Tax Identification Number structure.
   - **PAN:** Validates 10-character alphanumeric Permanent Account Number format.
2. **Automated Penny-Drop Bank Reconciliation:**
   - Visual indicator displays backend IMPS penny-drop verification status. Name registered on the bank account must match legal business entity name.
3. **Mandatory Reason Code on Rejection:**
   - Rejecting an onboarding application requires a specific rejection reason (`ILLEGIBLE_DOCUMENT`, `EXPIRED_FSSAI`, `NAME_MISMATCH`, `INVALID_GSTIN`) and corrective instructions delivered to merchant via SMS.
4. **Document Access Auditing:**
   - Pre-signed document URLs have short TTLs (15 minutes). Downloading or viewing KYC documents publishes an audit trail entry.

---

## 3. Core Deliverables & File Layout

```text
src/app/
├── shared/
│   └── validators/
│       └── indian-compliance.validators.ts     # FSSAI, GSTIN, PAN, IFSC, Phone validators
└── features/
    └── merchant-verification/
        ├── data-access/
        │   ├── merchant-verification.api.ts    # KYC fetch & review endpoints
        │   ├── merchant-verification.repository.ts
        │   └── merchant-verification.mapper.ts
        ├── state/
        │   ├── merchant-verification.store.ts  # Verification queue Signal store
        │   └── merchant-verification.selectors.ts
        ├── models/
        │   └── merchant-verification-view.model.ts
        ├── components/
        │   ├── merchant-verification-card.component.ts
        │   └── merchant-verification-status-chip.component.ts
        ├── pages/
        │   ├── merchant-verification-list.page.html  # Pending KYC queue table
        │   ├── merchant-verification-list.page.ts
        │   └── merchant-verification-details.page.ts# Document viewer & approval workbench
        ├── merchant-verification.routes.ts
        └── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Verification queue displays pending merchant KYC submissions with urgency SLA indicators.
- [ ] Document workbench allows zooming into FSSAI, GSTIN, and PAN certificates.
- [ ] Penny-drop bank verification match status displayed clearly.
- [ ] Approval immediately transitions merchant to `ACTIVE` status.
- [ ] Rejection enforces mandatory Reason Code and generates audit entry.
- [ ] Unit tests cover compliance validators and verification store transitions.
