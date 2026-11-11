/**
 * Administrative Gateway API Endpoint Registry
 * Maps directly to backend API Gateway Admin BFF routes (/api/v1/admin/*)
 */
export const AdminEndpoints = {
  // Authentication & Session
  AUTH_LOGIN: '/auth/login',
  AUTH_MFA_CHALLENGE: '/auth/mfa/challenge',
  AUTH_MFA_VERIFY: '/auth/mfa/verify',
  AUTH_STEP_UP_REQUEST: '/auth/step-up/request',
  AUTH_STEP_UP_VERIFY: '/auth/step-up/verify',
  AUTH_REFRESH: '/auth/session/refresh',
  AUTH_LOGOUT: '/auth/session/logout',
  AUTH_ME: '/auth/me',

  // Merchants & Outlets
  MERCHANTS: '/merchants',
  MERCHANT_BY_ID: (id: string) => `/merchants/${id}`,
  MERCHANT_SUSPEND: (id: string) => `/merchants/${id}/suspend`,
  MERCHANT_ACTIVATE: (id: string) => `/merchants/${id}/activate`,
  MERCHANT_KYC_DOCUMENTS: (id: string) => `/merchants/${id}/kyc`,
  MERCHANT_KYC_VERIFY: (id: string) => `/merchants/${id}/kyc/verify`,
  MERCHANT_KYC_REJECT: (id: string) => `/merchants/${id}/kyc/reject`,
  OUTLETS: '/outlets',
  OUTLET_BY_ID: (id: string) => `/outlets/${id}`,
  OUTLET_CAPACITY_OVERRIDE: (id: string) => `/outlets/${id}/capacity/override`,

  // Localities & Zones (Nagpur Pilot)
  LOCALITIES: '/localities',
  LOCALITY_BY_ID: (id: string) => `/localities/${id}`,
  LOCALITY_GEOFENCES: '/localities/geofences',

  // Catalog & Categories
  CATEGORIES: '/categories',
  CATALOG_ITEMS: '/catalog/items',
  CATALOG_MODERATION_QUEUE: '/catalog/moderation/pending',
  CATALOG_MODERATE_ITEM: (id: string) => `/catalog/items/${id}/moderate`,

  // Orders & Interventions
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  ORDER_TIMELINE: (id: string) => `/orders/${id}/timeline`,
  ORDER_FORCE_CANCEL: (id: string) => `/orders/${id}/force-cancel`,

  // Payments, Refunds & Settlements
  PAYMENTS: '/payments',
  PAYMENT_BY_ID: (id: string) => `/payments/${id}`,
  PAYMENT_WEBHOOKS_FAILED: '/payments/webhooks/failed',
  PAYMENT_WEBHOOK_REPLAY: (id: string) => `/payments/webhooks/${id}/replay`,
  REFUNDS: '/refunds',
  REFUND_APPROVE: (id: string) => `/refunds/${id}/approve`,
  REFUND_REJECT: (id: string) => `/refunds/${id}/reject`,

  // Subscriptions & SaaS Plans
  SUBSCRIPTIONS: '/subscriptions',
  PLANS: '/plans',

  // Support & Dispute Tickets
  SUPPORT_TICKETS: '/support/tickets',
  SUPPORT_TICKET_BY_ID: (id: string) => `/support/tickets/${id}`,
  REVIEWS: '/reviews',
  REVIEW_MODERATE: (id: string) => `/reviews/${id}/moderate`,

  // System Health, Flags & Audit
  AUDIT_LOGS: '/audit/logs',
  AUDIT_PII_UNMASK: '/audit/unmask-pii',
  FEATURE_FLAGS: '/platform/feature-flags',
  FEATURE_FLAG_TOGGLE: (key: string) => `/platform/feature-flags/${key}/toggle`,
  SYSTEM_HEALTH: '/platform/health',
  PLATFORM_USERS: '/platform/users',
  PLATFORM_ROLES: '/platform/roles',
} as const;
