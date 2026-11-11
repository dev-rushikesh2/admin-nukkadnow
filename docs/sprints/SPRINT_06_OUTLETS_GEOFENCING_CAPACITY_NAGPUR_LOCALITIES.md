# Sprint 06 — Outlets, Capacity Overrides & Nagpur Locality Geofencing

- **Sprint ID:** NNK-ADM-SPRINT-06
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/outlets/*`, `src/app/features/localities/*`
- **Dependencies:** Sprint 01, Sprint 04

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Shared Locality Models:** Geographic boundary coordinates and postal code maps are shared across Outlets and Localities features.
- **KISS Capacity Override:** Emergency capacity throttle requires just 1 slider adjustment (e.g., reducing max pickups from 20 to 5 per interval during rush hours or heavy rain).
- **Declarative Hours Matrix:** Operating hours table displays weekly schedule (Mon-Sun) with 1-click `Force Close Today` toggle for emergency store disruptions.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `OutletsApi`: Manages outlet operational status and capacity limits.
  - `LocalitiesApi`: Manages Nagpur micro-market boundaries, zones, and geofence coordinates.
  - `OutletsStore`: Manages multi-outlet state and schedule overrides.
- **Open/Closed (OCP):**
  - New delivery polygon algorithms or postal code expansions can be configured without changing outlet management components.
- **Interface Segregation (ISP):**
  - Outlets expose `OutletCapacityViewModel` specifically for capacity throttling without bundling full merchant registration records.

---

## 2. Security Architecture & Threat Defense

1. **Locality Geofence Integrity:**
   - Geofence polygon coordinates are validated on both client and server to prevent inverted or invalid boundary definitions.
2. **Emergency Store Closure Override:**
   - Operators can temporarily pause store operations if a physical hazard or locality shutdown occurs. Action requires an audit justification code.
3. **Capacity Abuse Prevention:**
   - Outlets cannot set negative capacity limits or unbounded infinite queues that could overwhelm local neighborhood store counters.

---

## 3. Core Deliverables & File Layout

```text
src/app/features/
├── outlets/
│   ├── data-access/
│   │   ├── outlets.api.ts                      # GET /outlets, PUT /outlets/:id/capacity
│   │   ├── outlets.repository.ts
│   │   └── outlets.mapper.ts
│   ├── state/
│   │   ├── outlets.store.ts                    # Outlets Signal store
│   │   └── outlets.selectors.ts
│   ├── pages/
│   │   ├── outlets-list.page.html              # Outlets directory & capacity status
│   │   ├── outlets-list.page.ts
│   │   └── outlets-details.page.ts             # Capacity slider & operating hours matrix
│   ├── outlets.routes.ts
│   └── index.ts
└── localities/
    ├── data-access/
    │   ├── localities.api.ts                   # Nagpur micro-market endpoints
    │   ├── localities.repository.ts
    │   └── localities.mapper.ts
    ├── state/
    │   └── localities.store.ts                 # Locality boundaries Signal store
    ├── pages/
    │   ├── localities-list.page.html           # Nagpur zones table (Sadar, Dharampeth, etc.)
    │   └── localities-list.page.ts
    ├── localities.routes.ts
    └── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Outlets directory displays active outlets, current queue pressure, and operating schedules.
- [ ] Capacity override allows setting interval limits per 15-minute slot.
- [ ] Nagpur micro-markets (Dharampeth, Sadar, Ramdaspeth, Sitabuldi, Wardha Road) listed with delivery radiuses.
- [ ] Emergency outlet pause workflow generates cryptographic audit log.
- [ ] Unit tests cover `OutletsStore` and `LocalitiesStore`.
