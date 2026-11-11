# NukkadNow Super-Admin Console — Security Architecture

> **Architecture Document:** SEC-ARCH-ADMIN-01  
> **Classification:** High-Assurance / Zero-Trust Administrative Portal  
> **Pilot Locality:** Nagpur, Maharashtra  

---

## 1. Zero-Trust Architecture Principles

1. **Strict Repository & Network Boundary:**
   - The Admin application resides in its own isolated Git repository (`nukkadnow-admin`).
   - Admin assets are hosted on an independent restricted subdomain (`admin.nukkadnow.example`), protected by ingress firewalls and WAF rules.
   - Admin traffic communicates exclusively with dedicated `/api/v1/admin/*` administrative gateway endpoints. Direct connections to internal service databases are physically forbidden.

2. **Zero Client-Side Trust:**
   - Angular route guards (`adminAuthGuard`, `adminPermissionGuard`) and template directives (`*adminHasPermission`) exist solely for operator user experience.
   - Every API request is re-validated authoritatively at the API Gateway BFF layer against the actor's verified session claims and current role matrix.

3. **In-Memory Ephemeral Tokens:**
   - Long-lived raw JWT access tokens are **never** persisted to `localStorage` or `sessionStorage` where they could be harvested via cross-site scripting (XSS).
   - Session state is held in memory by `AdminSessionService` using reactive Angular Signals.
   - Session renewal utilizes secure, HttpOnly, `SameSite=Strict`, partitioned cookies.

4. **Multi-Factor Authentication (MFA) & Step-Up Privilege:**
   - MFA is strictly mandatory for all privileged administrative roles.
   - High-impact destructive or financial mutations (e.g., merchant suspension, payout reversals, high-value refunds, feature flag toggles) require **Step-Up Authentication**.
   - Step-up verification produces a temporary, cryptographically bounded ticket (`X-Step-Up-Ticket`) with a 300-second TTL.

5. **Console Inactivity Lock:**
   - The `IdleTimeoutService` continuously tracks user activity (keyboard, mouse, click, scroll).
   - Inactivity exceeding **15 minutes** immediately locks the console, requiring re-authentication to prevent unauthorized access to unattended operator workstations.

6. **Defense-in-Depth HTTP Security Headers:**
   - Production Nginx servers enforce:
     - `Content-Security-Policy (CSP)`
     - `X-Frame-Options: DENY` (anti-clickjacking)
     - `X-Content-Type-Options: nosniff`
     - `Strict-Transport-Security (HSTS)`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
     - `Cross-Origin-Opener-Policy: same-origin`
     - `Cross-Origin-Resource-Policy: same-origin`

7. **PII Masking & Privacy Controls:**
   - Customer and merchant Personally Identifiable Information (Indian mobile numbers, Aadhaar, PAN, residential addresses of home makers) are masked by default.
   - Clicking to unmask triggers an explicit audit check, requires elevated permissions, and publishes a permanent audit log entry.
