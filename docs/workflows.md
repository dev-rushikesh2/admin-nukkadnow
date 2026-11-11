# NukkadNow Super-Admin — Standard Operating Procedures (SOPs)

---

## SOP-01: Merchant Verification & Onboarding

1. **Intake Review:**
   - Operator accesses `/merchant-verification` queue.
   - Inspect business registration documents: PAN, GSTIN certificate (if turnover > ₹20L or voluntary), and FSSAI Food Safety license (mandatory for food/dairy stalls).
2. **Bank Account Verification:**
   - Verify automated penny-drop verification status. Name on bank account must match legal merchant name or registered partnership/proprietorship.
3. **Physical / GPS Locality Verification:**
   - Verify GPS coordinates lie within active pilot locality (e.g., Sadar, Dharampeth, Ramdaspeth, Wardha Road).
   - If home maker mode is selected, confirm residential address is flagged `RESTRICTED_PII`.
4. **Decision:**
   - **Approve:** Activates merchant account and notifies owner via SMS/WhatsApp.
   - **Reject:** Requires mandatory Reason Code and detailed corrective instructions sent to seller.

---

## SOP-02: High-Value Refund Dual Approval (> ₹5,000)

1. Level-1 support agent reviews order cancellation or dispute and flags ticket as `REFUND_PENDING_APPROVAL`.
2. Finance Admin navigates to `/refunds-disputes`.
3. System prompts **Step-Up Authentication (TOTP verification)**.
4. Operator enters mandatory Reason Code (e.g., `CUSTOMER_ESCALATION` or `STORE_CLOSURE`).
5. Upon confirmation, API Gateway triggers payment gateway reversal via idempotent refund API.

---

## SOP-03: Emergency Merchant Suspension

1. Compliance Lead identifies severe terms breach or food hygiene complaint.
2. Navigates to `/merchants/{id}`.
3. Selects `Suspend Merchant`.
4. System enforces Step-Up MFA challenge and mandatory Audit Reason prompt.
5. Immediate side effects:
   - All active outlet catalog items hidden from customer discovery.
   - In-flight orders frozen or directed to support queue.
   - Merchant receives instant critical SMS/email notification with appeal procedure.
