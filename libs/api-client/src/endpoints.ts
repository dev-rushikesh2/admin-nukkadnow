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

  // Overview & Analytics
  OVERVIEW: '/overview',

  // Merchants & Outlets
  MERCHANTS: '/merchants',
  MERCHANT_BY_ID: (id: string) => `/merchants/${id}`,
  MERCHANT_SUSPEND: (id: string) => `/merchants/${id}/suspend`,
  MERCHANT_ACTIVATE: (id: string) => `/merchants/${id}/activate`,
  MERCHANT_KYC_DOCUMENTS: (id: string) => `/merchants/${id}/kyc`,
  MERCHANT_KYC_VERIFY: (id: string) => `/merchants/${id}/kyc/verify`,
  MERCHANT_KYC_REJECT: (id: string) => `/merchants/${id}/kyc/reject`,
  MERCHANT_VERIFICATION: '/merchant-verification',
  MERCHANT_VERIFICATION_BY_ID: (id: string) => `/merchant-verification/${id}`,
  MERCHANT_VERIFICATION_APPROVE: (id: string) => `/merchant-verification/${id}/approve`,
  MERCHANT_VERIFICATION_REJECT: (id: string) => `/merchant-verification/${id}/reject`,
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
  PLATFORM_PERMISSIONS: '/platform/permissions',
  PLATFORM_CITIES: '/platform/cities',
  AUTH_SWITCH_ROLE: '/auth/switch-role',

  // Sprint 6: Global Omni-Search, Geo Hierarchy, Personas & Profile
  SEARCH: '/search',
  GEO_HIERARCHY: '/geo/hierarchy',
  GEO_COUNTRIES: '/geo/countries',
  GEO_STATES: '/geo/states',
  GEO_DISTRICTS: '/geo/districts',
  GEO_IMPORT_GEOJSON: '/geo/import-geojson',
  OVERVIEW_PERSONAS: '/overview/personas',
  PROFILE_ME: '/me',
  PROFILE_CHANGE_PASSWORD: '/me/change-password',
  PROFILE_SESSIONS: '/me/sessions',
  PROFILE_ACTIVITY: '/me/activity',

  // Sprint 7: Inventory Telemetry & Merchant Governance
  INVENTORY_OVERVIEW: '/inventory/overview',
  INVENTORY_STOCKS: '/inventory/stocks',
  INVENTORY_LOW_STOCK: '/inventory/low-stock',
  INVENTORY_MOVEMENTS: '/inventory/movements',
  INVENTORY_RECONCILIATIONS: '/inventory/reconciliations',
  INVENTORY_RECONCILIATION_RESOLVE: (id: string) => `/inventory/reconciliations/${id}/resolve`,
  INVENTORY_DATA_QUALITY: '/inventory/data-quality',
  MERCHANT_COMPLAINTS: '/merchants/complaints',
  MERCHANT_COMPLAINTS_BY_MERCHANT: (id: string) => `/merchants/${id}/complaints`,
  MERCHANT_COMPLAINT_RESOLVE: (merchantId: string, complaintId: string) => `/merchants/${merchantId}/complaints/${complaintId}/resolve`,
  MERCHANT_SUSPENSIONS: '/merchants/suspensions',
  MERCHANT_SUSPENSION_LOG: (id: string) => `/merchants/${id}/suspension-log`,

  // Sprint 8: Customer Directory & Helpdesk Pro
  CUSTOMERS_OVERVIEW: '/customers/overview',
  CUSTOMERS: '/customers',
  CUSTOMER_BY_ID: (id: string) => `/customers/${id}`,
  CUSTOMER_UNMASK_PII: (id: string) => `/customers/${id}/unmask-pii`,
  CUSTOMER_ORDERS: (id: string) => `/customers/${id}/orders`,
  CUSTOMER_UPDATE_STATUS: (id: string) => `/customers/${id}/status`,

  // Sprint 9: Commerce Scheduling, QR Counter POS & Disputes
  ORDERS_QR_MONITORING: '/orders/qr-monitoring',
  ORDERS_PRE_ORDERS: '/orders/pre-orders',
  ORDERS_CAPACITY_MONITORING: '/orders/capacity-monitoring',
  ORDERS_CAPACITY_THROTTLE: (outletId: string) => `/orders/capacity-throttle/${outletId}`,
  ORDERS_DISPUTES: '/orders/disputes',
  ORDER_LIFECYCLE_TIMELINE: (id: string) => `/orders/${id}/lifecycle`,
  CATALOG_RESTRICTED_POLICIES: '/catalog/restricted-policies',
  CATALOG_REPORTED_ITEMS: '/catalog/reported-items',

  // Sprint 10: Fiduciary, Compliance & Governance
  FINANCE_INVOICES: '/finance/invoices',
  FINANCE_GST_REPORTS: '/finance/gst-reports',
  FINANCE_GATEWAY_FAILURES: '/finance/gateway-failures',
  FINANCE_AUDIT_LOG: '/finance/audit-log',
  SUBSCRIPTIONS_PAYMENTS: '/subscriptions/payments',
  SUBSCRIPTIONS_RENEWALS: '/subscriptions/renewals',
  SUBSCRIPTIONS_COUPONS: '/subscriptions/coupons',
  SUBSCRIPTIONS_CHURN_ANALYTICS: '/subscriptions/churn-analytics',
  SYSTEM_GATEWAY_PING: '/system/gateway-ping',
  SYSTEM_SIEM_ALERTS: '/system/siem-alerts',
} as const;
