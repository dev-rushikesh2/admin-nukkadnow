# ==============================================================================
# NUKKADNOW SUPER-ADMIN — HARDENED MULTI-STAGE CONTAINER DOCKERFILE
# ==============================================================================

# Stage 1: Build & Static Asset Compilation
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Copy manifest files for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY libs/ libs/

# Install dependencies deterministically
RUN pnpm install --frozen-lockfile

# Copy source code and build configs
COPY . .

# Build production application
RUN pnpm run build:prod

# Stage 2: Hardened Runtime Container
FROM nginx:1.27-alpine-slim

# Remove default nginx static html
RUN rm -rf /usr/share/nginx/html/*

# Create unprivileged non-root nginx user runtime directories
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Copy compiled assets from builder
COPY --from=builder --chown=nginx:nginx /app/dist/nukkadnow-admin /usr/share/nginx/html

# Copy security-hardened nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Drop privileges to non-root user
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
