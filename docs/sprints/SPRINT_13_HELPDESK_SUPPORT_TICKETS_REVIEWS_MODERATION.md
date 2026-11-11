# Sprint 13 — Support Helpdesk, SLA Monitoring & Reviews Moderation

- **Sprint ID:** NNK-ADM-SPRINT-13
- **Duration:** 2 Weeks
- **Target Scope:** `src/app/features/support-tickets/*`, `src/app/features/reviews-moderation/*`, `src/app/features/notifications/*`
- **Dependencies:** Sprint 01, Sprint 09

---

## 1. Principles & Coding Standards

### DRY & KISS
- **Shared Priority Indicators:** Support tickets and review moderation items share semantic priority badges (`CRITICAL`, `HIGH`, `NORMAL`, `LOW`) from `@nukkadnow/admin-ui`.
- **KISS Ticket Triage:** 1-click ticket assignment to the active operator with an animated SLA countdown timer.
- **Unified Broadcast Form:** Single broadcast creation modal for sending platform announcements via push notifications and SMS.

### SOLID Standards
- **Single Responsibility (SRP):**
  - `SupportTicketsApi`: Manages ticket queues, replies, status transitions, and agent assignments.
  - `ReviewsModerationApi`: Manages review audits, visibility toggles, and merchant counter-claims.
  - `NotificationsApi`: Dispatches platform broadcast notifications.
- **Open/Closed (OCP):**
  - New support channels (WhatsApp Business API or In-App Chat) can be integrated without modifying ticket list views.
- **Dependency Inversion (DIP):**
  - Components depend on `SupportTicketsRepository` and `ReviewsModerationRepository` abstractions.

---

## 2. Security Architecture & Threat Defense

1. **Defamation & Spam Moderation:**
   - Customer reviews containing abusive language, hate speech, or competitor sabotage can be quarantined pending review.
2. **Customer PII Protection in Tickets:**
   - Support tickets display masked customer contact details. Operators communicate via platform messaging without exposing personal phone numbers.
3. **Broadcast Rate Limiting & Audit:**
   - Mass broadcasts to Nagpur consumers or merchants require `admin:notifications:send_broadcast` permission and produce permanent audit log entries.

---

## 3. Core Deliverables & File Layout

```text
src/app/features/
├── support-tickets/
│   ├── data-access/
│   │   ├── support-tickets.api.ts              # Ticket retrieval, replies, assignment APIs
│   │   ├── support-tickets.repository.ts
│   │   └── support-tickets.mapper.ts
│   ├── state/
│   │   ├── support-tickets.store.ts            # Support Tickets Signal store
│   │   └── support-tickets.selectors.ts
│   ├── pages/
│   │   ├── support-tickets-list.page.html      # Support tickets queue with SLA countdown
│   │   ├── support-tickets-list.page.ts
│   │   └── support-tickets-details.page.ts     # Ticket conversation & resolution workbench
│   ├── support-tickets.routes.ts
│   └── index.ts
├── reviews-moderation/
│   ├── data-access/
│   │   ├── reviews-moderation.api.ts           # Flagged reviews and moderation actions
│   │   ├── reviews-moderation.repository.ts
│   │   └── reviews-moderation.mapper.ts
│   ├── state/
│   │   └── reviews-moderation.store.ts         # Reviews Signal store
│   ├── pages/
│   │   ├── reviews-moderation-list.page.html   # Moderation queue table
│   │   └── reviews-moderation-list.page.ts
│   ├── reviews-moderation.routes.ts
│   └── index.ts
└── notifications/
    ├── data-access/
    │   └── notifications.api.ts                # Broadcast messaging endpoints
    ├── state/
    │   └── notifications.store.ts
    ├── pages/
    │   ├── notifications-list.page.html        # Sent broadcasts & delivery status logs
    │   └── notifications-list.page.ts
    ├── notifications.routes.ts
    └── index.ts
```

---

## 4. Definition of Done (DoD)

- [ ] Support tickets queue displays active cases with SLA countdown timers.
- [ ] Ticket resolution workbench supports internal agent notes and customer responses.
- [ ] Reviews moderation queue allows hiding abusive reviews and reviewing merchant rebuttals.
- [ ] Broadcast notification tool sends announcements with delivery logs.
- [ ] Unit tests cover `SupportTicketsStore` and `ReviewsModerationStore`.
