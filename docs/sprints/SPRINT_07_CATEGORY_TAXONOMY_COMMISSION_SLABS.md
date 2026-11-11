# Sprint 07 — Category Taxonomy, Commission Slabs & Regulatory Restrictions

- **Sprint ID:** NNK-ADM-SPRINT-07
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/categories/*`
- **Dependencies:** Sprint 01, Sprint 04

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Hierarchical Category Tree:** Reusable tree node component displays multi-level categories (Fresh Dairy $\rightarrow$ Cow Milk / Paneer) without duplicating nested list markup.
- **KISS Commission Slabs:** Direct inline percentage editing for marketplace commission rates (e.g., Kirana: 5%, Bakery: 10%, Prepared Sweets: 12%).
- **Standardized Restriction Badges:** Perishable, Cold-Chain Required, and Age-Gated badges use shared `@nukkadnow/admin-ui` status indicators.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `CategoriesApi`: Communicates with `/api/v1/admin/categories`.
  - `CategoriesStore`: Manages flat and hierarchical category signals.
  - `CategoriesMapper`: Normalizes parent-child relationship graphs.
- **Open/Closed (OCP):**
  - Regulatory classification attributes (e.g., FSSAI license mandate toggle) can be added to categories without modifying tree traversal logic.
- **Dependency Inversion (DIP):**
  - Category views depend on `CategoriesRepository` abstraction.

---

## 2. Security Architecture & Threat Defense

1. **Commission Rate Bounds:**
   - Client and server enforce boundaries (0.0% to 30.0% max) to prevent erroneous or negative commission entry.
2. **Prohibited Category Locking:**
   - Certain categories (e.g., Tobacco, Alcoholic Beverages, Unpasteurized Raw Dairy) require compliance override permissions to activate.
3. **Audit Tracking on Slabs:**
   - Changing platform commission rates mutates merchant revenue split contracts; every update requires an audit reason code.

---

## 3. Core Deliverables & File Layout

```text
src/app/features/categories/
├── data-access/
│   ├── categories.api.ts                       # GET, POST, PUT, DELETE /categories
│   ├── categories.repository.ts
│   └── categories.mapper.ts
├── state/
│   ├── categories.store.ts                     # Categories Signal store
│   └── categories.selectors.ts
├── models/
│   └── categories-view.model.ts
├── pages/
│   ├── categories-list.page.html               # Category hierarchy table & commission slabs
│   ├── categories-list.page.scss
│   ├── categories-list.page.ts
│   └── categories-details.page.ts
├── categories.routes.ts
└── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Category taxonomy renders parent-child hierarchy cleanly.
- [ ] Commission percentage slabs editable per category with instant validation.
- [ ] Regulatory toggles (Perishable, Cold Storage Required, FSSAI Required) functional.
- [ ] Commission modifications generate cryptographically signed audit logs.
- [ ] Unit tests cover `CategoriesStore` and hierarchical mapping.
