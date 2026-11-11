# Sprint 10 — Payments, Escrow Settlements & PSP Webhook Replay Tooling

- **Sprint ID:** NNK-ADM-SPRINT-10
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/payments/*`
- **Dependencies:** Sprint 01, Sprint 09

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Zero Floating-Point Arithmetic:** All financial transactions, gateway fees, and merchant payout amounts are tracked in integer minor units (`amount_paise`) and formatted via `InrCurrencyPipe`.
- **KISS Failed Webhook Replay:** 1-click `Replay Webhook` button immediately re-dispatches the signed payload from the payment gateway to the `payment-service` inbox.
- **Clear Transaction Status Badges:** Semantic badges (`SUCCESS`, `PENDING_PSP`, `SETTLED`, `RECONCILED`, `FAILED`) allow instant operational triage.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `PaymentsApi`: Dispatches payments search, settlement reports, and webhook replay commands.
  - `PaymentsStore`: Manages financial transaction signals and settlement batches.
  - `PaymentTransactionMapper`: Converts raw PSP payment intent DTOs to view models.
- **Open/Closed (OCP):**
  - Supports multiple Indian PSP gateways (Razorpay, Cashfree, PhonePe, PineLabs) without changing settlement grid components.
- **Dependency Inversion (DIP):**
  - Financial views consume `PaymentsRepository` abstraction.

---

## 2. Security Architecture & Threat Defense

1. **Immutable Financial Ledger:**
   - Transaction records are strictly append-only. Operators cannot edit or delete payment records under any circumstances.
2. **PCI-DSS Compliance (Zero Card Storage):**
   - No raw credit/debit card numbers, CVVs, or bank passwords ever enter the admin portal. Views display masked PSP transaction tokens only.
3. **Webhook Replay Idempotency:**
   - Webhook replay tool enforces idempotency keys to ensure re-dispatched events never double-credit merchant accounts or trigger duplicate customer orders.
4. **Step-Up Authentication for Payout Releases:**
   - Manual release of held settlement batches requires Step-Up MFA and dual-operator verification.

---

## 3. Core Deliverables & File Layout

```text
src/app/features/payments/
├── data-access/
│   ├── payments.api.ts                         # Payments search, failed webhooks, replay API
│   ├── payments.repository.ts
│   └── payments.mapper.ts
├── state/
│   ├── payments.store.ts                       # Payments Signal store
│   └── payments.selectors.ts
├── models/
│   └── payments-view.model.ts                  # PaymentTransactionViewModel
├── components/
│   ├── payments-card.component.ts
│   └── payments-status-chip.component.ts
├── pages/
│   ├── payments-list.page.html                 # Financial ledger & settlement status table
│   ├── payments-list.page.ts
│   └── payments-details.page.ts                # PSP gateway intent details & webhook payload
├── payments.routes.ts
└── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Payments ledger displays all gateway transactions with paise precision.
- [ ] Failed webhook tab lists unprocessed PSP events with HTTP error codes.
- [ ] Manual webhook replay tool dispatches idempotent retry successfully.
- [ ] Settlement batch export allows finance teams to reconcile T+1 bank payouts.
- [ ] Unit tests cover `PaymentsStore` and financial currency formatting.
