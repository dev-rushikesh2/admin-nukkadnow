# Sprint 09 — Live Orders Stream, Real-Time Tracking & Emergency Intervention

- **Sprint ID:** NNK-ADM-SPRINT-09
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/orders/*`
- **Dependencies:** Sprint 01, Sprint 03

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Reusable Timeline Component:** Order fulfillment lifecycle stages (`CREATED` $\rightarrow$ `CONFIRMED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `HANDED_OVER`) use a shared vertical step indicator.
- **KISS Emergency Intervention:** Operator emergency cancellation override requires 2 taps: Click "Force Cancel" $\rightarrow$ Enter reason $\rightarrow$ triggers atomic inventory un-reserve and refund initiation.
- **Unified Order Currency Display:** All item prices, taxes, and platform fees are formatted via `InrCurrencyPipe`.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `OrdersApi`: Dispatches order search, detail retrieval, and force-cancellation commands.
  - `OrdersStore`: Manages real-time order stream signals and selected order inspection.
  - `OrdersTimelineComponent`: Exclusively renders fulfillment milestone timestamps.
- **Open/Closed (OCP):**
  - Order state machine allows adding fulfillment modes (e.g., Merchant Self-Delivery or Locker Pickup) without altering core order inspection grids.
- **Interface Segregation (ISP):**
  - `AdminOrderViewModel` exposes operational fulfillment details without exposing raw internal database foreign keys.

---

## 2. Security Architecture & Threat Defense

1. **Customer & Merchant Contact Privacy:**
   - Customer phone numbers are masked by default (`+91 ******1234`).
   - Unmasking customer contact details to resolve an emergency delivery issue generates a logged security incident.
2. **Force-Cancellation Safeguards:**
   - Operators cannot cancel completed or already-handed-over orders.
   - Force-cancelling an in-flight order triggers automated stock release in `catalog-service` and initiates a refund intent in `payment-service`.
3. **Audit Trail Enforced:**
   - `X-Audit-Reason` is strictly required for order force-cancellation.

---

## 3. Core Deliverables & File Layout

```text
src/app/features/orders/
├── data-access/
│   ├── orders.api.ts                           # GET /orders, POST /orders/:id/force-cancel
│   ├── orders.repository.ts
│   └── orders.mapper.ts
├── state/
│   ├── orders.store.ts                         # Orders Signal store
│   └── orders.selectors.ts
├── models/
│   └── orders-view.model.ts                    # AdminOrderViewModel
├── components/
│   ├── orders-card.component.ts                # Order summary card
│   └── orders-status-chip.component.ts         # Status badge (Ready, Preparing, Confirmed)
├── pages/
│   ├── orders-list.page.html                   # Live orders stream table with status filters
│   ├── orders-list.page.scss
│   ├── orders-list.page.ts
│   └── orders-details.page.ts                  # Order timeline, item list & cancellation override
├── orders.routes.ts
└── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Global orders stream renders real-time order feed with active status badges.
- [ ] Order detail page displays itemized invoice, customer pickup token, and fulfillment timeline.
- [ ] Emergency force-cancellation action functional with mandatory reason code prompt.
- [ ] Customer phone numbers masked by default with audited unmask capability.
- [ ] Unit tests cover `OrdersStore` state transitions and cancellation handlers.
