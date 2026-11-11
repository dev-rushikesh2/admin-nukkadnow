# Sprint 03 — Command Center, Real-Time Telemetry & Rapid Command Palette

- **Sprint ID:** NNK-ADM-SPRINT-03
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/overview/*`, `src/app/core/realtime/*`, `src/app/layout/command-search/*`
- **Dependencies:** Sprint 01, Sprint 02

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Atomic Metric Presentation:** All KPI tiles reuse `MetricCardComponent` with standardized positive/negative delta calculations and trend arrows.
- **Unified Command Search:** `CommandSearchComponent` (`Ctrl+K`) indexes all administrative routes, quick actions, merchants, and order lookups in a single modal without duplicating route navigation logic.
- **KISS Visual Hierarchy:** 2-column layout: Left column tracks locality order pressure; Right column tracks actionable priority alerts (KYC, refunds, pricing flags).

### SOLID Standards
- **Single Responsibility (SRP):**
  - `AdminRealtimeService`: Manages WebSocket transport, heartbeat pings, and exponential backoff reconnects.
  - `SystemAlertsService`: Transforms raw WebSocket telemetry into categorized system alerts (`CRITICAL`, `WARNING`, `INFO`).
  - `OverviewListPageComponent`: Pure presentational coordinator for KPI metrics and recent order tables.
- **Open/Closed (OCP):**
  - Topic subscriptions (`realtime.onTopic<T>('topic')`) allow adding new real-time domain event streams without modifying the WebSocket client core.
- **Dependency Inversion (DIP):**
  - Dashboard depends on `AdminRealtimeService` abstraction rather than directly establishing WebSocket connections in page components.

---

## 2. Security Architecture & Threat Defense

1. **Authenticated WebSocket Handshake:**
   - WebSocket connection (`wss://api.nukkadnow.example/api/v1/admin/realtime`) requires ephemeral in-memory Bearer token validation during the upgrade handshake.
2. **Sanitized Telemetry Feed:**
   - Real-time broadcast feeds contain only aggregated metrics and non-sensitive identifiers. Zero unmasked consumer or merchant PII is sent across public alert streams.
3. **Resilient Reconnection with Jitter:**
   - If network drops, `AdminRealtimeService` implements exponential backoff with randomized jitter (up to 30s max delay) to prevent thundering herd load on API Gateway.

---

## 3. Core Deliverables & File Layout

```text
src/app/
├── core/
│   └── realtime/
│       ├── admin-realtime.service.ts           # WebSocket connection with auto-reconnect
│       └── system-alerts.service.ts            # High-priority operational alert listener
├── layout/
│   └── command-search/
│       └── command-search.component.ts         # Ctrl+K global navigation palette
└── features/
    └── overview/
        ├── pages/
        │   ├── overview-list.page.html         # KPI cards, locality pressure & recent orders
        │   ├── overview-list.page.scss         # High-density dashboard styles
        │   └── overview-list.page.ts           # Signal-driven dashboard controller
        ├── overview.routes.ts                  # /overview route configuration
        └── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Command Center displays 6 live metric tiles: GMV, Active Merchants, In-flight Orders, Verification Queue, Pending Refunds, Mesh Latency.
- [ ] Nagpur locality fulfillment pressure breakdown (Dharampeth, Sadar, Ramdaspeth, Wardha Road) rendered accurately.
- [ ] Global command search (`Ctrl+K` / `Cmd+K`) navigates smoothly to features and records.
- [ ] WebSocket connection establishes securely with automated reconnection upon disconnect.
- [ ] Responsive across desktop (1920x1080) and tablet viewports with `OnPush` change detection.
