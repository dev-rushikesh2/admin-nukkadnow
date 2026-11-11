# Sprint 08 — Catalog Moderation, Price Sanity & Takedown Engine

- **Sprint ID:** NNK-ADM-SPRINT-08
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/catalogue-moderation/*`
- **Dependencies:** Sprint 01, Sprint 07

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Standardized Currency Formatting:** All prices use `InrCurrencyPipe` for consistent Indian Rupee (`₹`) and paise calculations.
- **KISS Takedown Action:** Flagged products feature an immediate 1-click `Deactivate / Takedown` button that launches the mandatory `AuditReasonModalComponent`.
- **Reusable Anomaly Cards:** Price sanity alerts highlight deviation from category baseline (e.g., "98% below average market price") in a distinct warning pill.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `CatalogueModerationApi`: Communicates with `/api/v1/admin/catalog/moderation` endpoints.
  - `CatalogueModerationStore`: Manages flagged products and review queue state.
  - `CatalogueModerationCardComponent`: Pure presentational product preview with thumbnail.
- **Open/Closed (OCP):**
  - Anomaly detection rules (price anomaly, banned keywords, unapproved media) can be expanded without altering the moderator review queue UI.
- **Dependency Inversion (DIP):**
  - Moderation views consume `CatalogueModerationRepository` abstraction.

---

## 2. Security Architecture & Threat Defense

1. **Fat-Finger Price Anomaly Detection:**
   - Products priced drastically below category average (e.g., ₹10 for an item typically ₹1,000) are flagged to protect merchants from ruinous checkout blitzes.
2. **Prohibited Goods Takedown:**
   - Products flagged for restricted substances, misleading claims, or hygiene violations can be delisted immediately from customer search.
3. **Mandatory Audit Reason on Takedown:**
   - Operators cannot take down merchant products arbitrarily. Reason code (`PRICING_ERROR`, `PROHIBITED_GOODS`, `COPYRIGHT_VIOLATION`) and explanation are required.

---

## 3. Core Deliverables & File Layout

```text
src/app/features/catalogue-moderation/
├── data-access/
│   ├── catalogue-moderation.api.ts             # Moderation queue and item status APIs
│   ├── catalogue-moderation.repository.ts
│   └── catalogue-moderation.mapper.ts
├── state/
│   ├── catalogue-moderation.store.ts           # Moderation queue Signal store
│   └── catalogue-moderation.selectors.ts
├── models/
│   └── catalogue-moderation-view.model.ts      # FlaggedProductViewModel
├── components/
│   ├── catalogue-moderation-card.component.ts  # Product preview with image thumbnail
│   └── catalogue-moderation-status-chip.component.ts
├── pages/
│   ├── catalogue-moderation-list.page.html     # Flagged items moderation queue
│   ├── catalogue-moderation-list.page.ts
│   └── catalogue-moderation-details.page.ts    # Deep product inspection & takedown actions
├── catalogue-moderation.routes.ts
└── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Moderation queue lists flagged products with price anomaly indicators.
- [ ] Product details display full description, variants, images, and merchant details.
- [ ] Takedown action immediately hides product from customer discovery.
- [ ] Mandatory Audit Reason modal intercepts takedown and logs operator action.
- [ ] Unit tests cover `CatalogueModerationStore` and takedown workflows.
