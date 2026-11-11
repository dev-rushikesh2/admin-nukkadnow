# NukkadNow Super-Admin — Deployment & Hardening Guide

---

## 1. Hosting Architecture

The admin console is distributed as static pre-compiled SPA assets served via a hardened Nginx container:

```text
[Internet / Office VPN]
         │
    [WAF / Ingress] (Cloudflare / Reverse Proxy)
         │  - IP Allowlisting (Optional corporate VPN CIDR)
         │  - DDoS Protection & Rate Limiting
         │  - TLS 1.3 Termination
         ▼
[admin.nukkadnow.example:8080] (Hardened Nginx Alpine container)
         │  - Content Security Policy (CSP)
         │  - Anti-Clickjacking (X-Frame-Options: DENY)
         │  - Non-root unprivileged process (nginx:nginx)
         ▼
[Browser Client] ──HTTPS (Bearer JWT + Audit Headers)──> [API Gateway Admin BFF]
```

---

## 2. Container Build & Deployment

```bash
# 1. Build production static bundle
pnpm run build:prod

# 2. Build multi-stage hardened container
docker build -t nukkadnow-admin:latest .

# 3. Run container on unprivileged port 8080
docker run -d \
  --name nukkadnow-admin \
  --restart unless-stopped \
  -p 8080:8080 \
  --read-only \
  --tmpfs /var/cache/nginx:rw \
  --tmpfs /var/run:rw \
  nukkadnow-admin:latest
```

---

## 3. Pre-Flight Security Checklist

- [ ] All mandatory security headers verified (`pnpm run check:security`).
- [ ] Monorepo boundary violations verified (`pnpm run check:boundaries`).
- [ ] No hardcoded passwords, tokens, or private secrets in repository.
- [ ] Production `.env` contains strictly public endpoints.
- [ ] `public/robots.txt` disallows all crawlers (`Disallow: /`).
- [ ] Idle session timeout configured to 15 minutes.
