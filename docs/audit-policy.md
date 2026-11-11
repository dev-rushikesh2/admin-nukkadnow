# NukkadNow Administrative Audit & Compliance Policy

> **Policy Ref:** POL-SEC-AUDIT-001  
> **Status:** Active · Version 1.0  
> **Effective Date:** 2026-11-11  

---

## 1. Principles of Administrative Auditing

Every action performed within the Super-Admin Console that mutates platform state or accesses sensitive consumer/merchant data is subject to mandatory, tamper-evident recording in an append-only audit log.

1. **Completeness:** All state-modifying HTTP requests (`POST`, `PUT`, `PATCH`, `DELETE`) require operator identification headers (`X-Admin-Operator-Id`, `X-Correlation-Id`).
2. **Mandatory Justification:** High-risk actions cannot be dispatched without an explicit Reason Code and descriptive justification (`X-Audit-Reason`, `X-Audit-Justification`).
3. **Immutability:** Audit records are written directly to append-only storage; records can never be updated or deleted by any administrative user, including `SUPER_ADMIN`.
4. **PII Masking & Access Audits:** Any inspection of unmasked Aadhaar, PAN, phone number, or bank accounts generates a distinct `AUDIT_PII_UNMASK` security event.
5. **Retention:**
   - Financial audit entries (refunds, payouts, settlement adjustments): **7 years** (compliant with Indian financial and tax statutory requirements).
   - Operational audit entries (suspensions, KYC decisions, geofence updates): **3 years**.
   - Security incidents and access failures: **1 year**.

---

## 2. Standard Reason Codes

| Reason Code | Category | When to Use |
|---|---|---|
| `POLICY_VIOLATION` | Moderation / Suspension | Merchant breached platform guidelines, terms of service, or hygiene rules. |
| `SUSPECTED_FRAUD` | Financial / Security | Abnormal transaction spikes, card testing indicators, or double-claim attempts. |
| `CUSTOMER_ESCALATION` | Support / Dispute | Customer complaint escalated via Level-2 support queue with order dispute evidence. |
| `MERCHANT_REQUEST` | Operational | Merchant voluntarily requested temporary store pause or banking detail change. |
| `ROUTINE_AUDIT` | Compliance | Scheduled quarterly KYC document or FSSAI license validity review. |
| `OPERATIONAL_OVERRIDE`| Infrastructure | Emergency capacity throttling, rain storm geofence restriction, or traffic rerouting. |
| `FAT_FINGER_REPAIR` | Financial Correction | Data entry correction due to proven operator or cashier decimal mistake. |
