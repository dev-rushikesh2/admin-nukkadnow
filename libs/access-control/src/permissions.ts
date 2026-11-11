/**
 * NukkadNow Administrative Granular Permission Constants (RBAC / PBAC)
 * Strictly enforced on both client-side route guards and administrative gateway BFF.
 */
export const AdminPermissions = {
  // Merchant Operations & Lifecycle
  MERCHANTS_READ: 'admin:merchants:read',
  MERCHANTS_CREATE: 'admin:merchants:create',
  MERCHANTS_UPDATE: 'admin:merchants:update',
  MERCHANTS_SUSPEND: 'admin:merchants:suspend',
  MERCHANTS_TERMINATE: 'admin:merchants:terminate',
  MERCHANTS_EXPORT: 'admin:merchants:export',

  // Merchant Verification & KYC
  KYC_READ: 'admin:kyc:read',
  KYC_REVIEW: 'admin:kyc:review',
  KYC_APPROVE: 'admin:kyc:approve',
  KYC_REJECT: 'admin:kyc:reject',
  KYC_RE_VERIFY: 'admin:kyc:re_verify',

  // Outlets & Geofences
  OUTLETS_READ: 'admin:outlets:read',
  OUTLETS_MANAGE: 'admin:outlets:manage',
  OUTLETS_OVERRIDE_HOURS: 'admin:outlets:override_hours',
  OUTLETS_GEOFENCE_EDIT: 'admin:outlets:geofence_edit',

  // Localities & Zones (Nagpur Micro-Markets)
  LOCALITIES_READ: 'admin:localities:read',
  LOCALITIES_MANAGE: 'admin:localities:manage',

  // Categories & Catalog Moderation
  CATEGORIES_MANAGE: 'admin:categories:manage',
  CATALOG_READ: 'admin:catalog:read',
  CATALOG_MODERATE: 'admin:catalog:moderate',
  CATALOG_TAKEDOWN: 'admin:catalog:takedown',

  // Orders Management & Emergency Intervention
  ORDERS_READ: 'admin:orders:read',
  ORDERS_INTERVENE: 'admin:orders:intervene',
  ORDERS_FORCE_CANCEL: 'admin:orders:force_cancel',

  // Financials, Payments, Refunds & Settlements
  PAYMENTS_READ: 'admin:payments:read',
  PAYMENTS_RECONCILE: 'admin:payments:reconcile',
  PAYMENTS_WEBHOOK_RETRY: 'admin:payments:webhook_retry',
  REFUNDS_READ: 'admin:refunds:read',
  REFUNDS_APPROVE_LOW: 'admin:refunds:approve_low', // <= INR 5,000
  REFUNDS_APPROVE_HIGH: 'admin:refunds:approve_high', // > INR 5,000 (Requires step-up & dual-approval)
  DISPUTES_RESOLVE: 'admin:disputes:resolve',

  // Subscriptions & SaaS Pricing
  SUBSCRIPTIONS_READ: 'admin:subscriptions:read',
  SUBSCRIPTIONS_MANAGE: 'admin:subscriptions:manage',
  PRICING_MANAGE: 'admin:pricing:manage',

  // Customer & Merchant Support
  SUPPORT_READ: 'admin:support:read',
  SUPPORT_ASSIGN: 'admin:support:assign',
  SUPPORT_RESPOND: 'admin:support:respond',
  SUPPORT_ESCALATE: 'admin:support:escalate',
  SUPPORT_RESOLVE: 'admin:support:resolve',

  // Reviews & Reputation Moderation
  REVIEWS_READ: 'admin:reviews:read',
  REVIEWS_MODERATE: 'admin:reviews:moderate',

  // Broadcast Notifications & Communication
  NOTIFICATIONS_SEND_BROADCAST: 'admin:notifications:send_broadcast',
  NOTIFICATIONS_TEMPLATES_MANAGE: 'admin:notifications:templates_manage',

  // Business Analytics & Reporting
  ANALYTICS_READ: 'admin:analytics:read',
  ANALYTICS_FINANCIAL_EXPORT: 'admin:analytics:financial_export',

  // Platform Operators & Identity Governance
  PLATFORM_USERS_READ: 'admin:platform:users_read',
  PLATFORM_USERS_MANAGE: 'admin:platform:users_manage',
  PLATFORM_ROLES_MANAGE: 'admin:platform:roles_manage',

  // Feature Flags & Circuit Breakers
  FEATURE_FLAGS_READ: 'admin:feature_flags:read',
  FEATURE_FLAGS_TOGGLE: 'admin:feature_flags:toggle', // Requires step-up auth

  // System Infrastructure Health & Telemetry
  SYSTEM_HEALTH_READ: 'admin:system_health:read',
  SYSTEM_MAINTENANCE_TOGGLE: 'admin:system:maintenance_toggle',

  // Immutable Audit Logs & PII Access
  AUDIT_LOGS_READ: 'admin:audit_logs:read',
  AUDIT_PII_UNMASK: 'admin:audit:unmask_pii', // Step-up + Mandatory reason logging

  // General Settings
  SETTINGS_MANAGE: 'admin:settings:manage',
} as const;

export type AdminPermission = typeof AdminPermissions[keyof typeof AdminPermissions];
