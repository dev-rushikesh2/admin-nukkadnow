# Sprint 01 — Admin Design System, Primitives & High-Performance Data Table

- **Sprint ID:** NNK-ADM-SPRINT-01
- **Duration:** 2 Weeks
- **Target Scope:** `@nukkadnow/admin-ui`, `@nukkadnow/admin-data-table`, `src/styles/*`
- **Dependencies:** Sprint 00

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Atomic UI Tokens:** All color hex codes, font weights, elevation shadows, and spacing units are defined as CSS Custom Properties in `tokens.scss`. No hardcoded hex values in component stylesheets.
- **Single Source of Truth for Data Grids:** `DataTableComponent` serves as the universal grid across all 23 admin features. Column definitions are purely declarative (`TableColumn<T>[]`), eliminating duplicate table templates.
- **KISS Responsive Data Presentation:** Desktop-first high-density table view with horizontal scrolling on constrained viewports. Avoids heavy, slow 3rd-party grid dependencies.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `DataTableComponent`: Handles table markup, column rendering, sorting events, and pagination dispatch.
  - `PiiMaskComponent`: Handles masked character obfuscation and click-to-unmask event propagation.
  - `MetricCardComponent`: Handles KPI delta calculation and trend arrow rendering.
- **Open/Closed (OCP):**
  - Columns support custom `TemplateRef` injection via `cellTemplate`, allowing complex custom badges or action buttons without altering core grid logic.
- **Interface Segregation (ISP):**
  - Clean, minimal interfaces: `TableColumn<T>`, `SortEvent`, and `PageChangeEvent`.

---

## 2. Security Architecture & Threat Defense

1. **Automated PII Obfuscation:**
   - `PiiMaskComponent` masks sensitive Indian identity numbers (Aadhaar, PAN, phone numbers, bank accounts) by default.
   - Revealing PII requires explicit user intent and triggers security audit events.
2. **XSS Prevention in Templates:**
   - Strict adherence to Angular's context-aware sanitization. Direct `innerHTML` binding is prohibited unless sanitized via `SafeHtmlPipe`.
3. **Tabular Numeric Figures:**
   - High-precision monetary columns enforce `font-variant-numeric: tabular-nums` to eliminate jitter and visual ambiguity during live ledger updates.

---

## 3. Libraries & Component Deliverables

```text
libs/
├── ui/
│   ├── src/
│   │   ├── badge/badge.component.ts            # Semantic status badges (success, warning, danger, security)
│   │   ├── metric-card/metric-card.component.ts# Executive KPI metric tile with deltas
│   │   ├── page-header/page-header.component.ts# Standard breadcrumb + action header
│   │   ├── pii-mask/pii-mask.component.ts      # Masked phone/PAN/Aadhaar with audited toggle
│   │   ├── modal/modal.component.ts            # Accessible modal dialog with backdrop
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── data-table/
    ├── src/
    │   ├── data-table.model.ts                 # TableColumn, SortEvent, PageChangeEvent
    │   ├── data-table.component.ts             # Generic table with skeleton loaders & pagination
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

---

## 4. Definition of Done (DoD)

- [ ] `@nukkadnow/admin-ui` and `@nukkadnow/admin-data-table` exported via public barrel index files.
- [ ] Responsive dark-theme tokens (`tokens.scss`, `typography.scss`, `tables.scss`, `forms.scss`) implemented.
- [ ] `DataTableComponent` supports sortable columns, loading skeleton bars, and empty states.
- [ ] `PiiMaskComponent` supports `phone`, `email`, `pan`, `aadhaar`, and `bank_account` types.
- [ ] Unit tests verify table sorting, pagination events, and PII masking behavior.
