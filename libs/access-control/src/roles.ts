import { AdminPermission, AdminPermissions } from './permissions';

export enum AdminRoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PLATFORM_OPS = 'PLATFORM_OPS',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  COMPLIANCE_LEAD = 'COMPLIANCE_LEAD',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  READONLY_AUDITOR = 'READONLY_AUDITOR',
}

export interface AdminRoleDefinition {
  type: AdminRoleType;
  title: string;
  description: string;
  requiresMfa: boolean;
  permissions: readonly AdminPermission[];
}

export const ADMIN_ROLE_MATRIX: Record<AdminRoleType, AdminRoleDefinition> = {
  [AdminRoleType.SUPER_ADMIN]: {
    type: AdminRoleType.SUPER_ADMIN,
    title: 'Super Administrator',
    description: 'Full unconstrained platform control, security configurations, and user delegation.',
    requiresMfa: true,
    permissions: Object.values(AdminPermissions),
  },

  [AdminRoleType.PLATFORM_OPS]: {
    type: AdminRoleType.PLATFORM_OPS,
    title: 'Platform Operations Engineer',
    description: 'Infrastructure health monitoring, feature toggles, locality geofencing, and service alerting.',
    requiresMfa: true,
    permissions: [
      AdminPermissions.MERCHANTS_READ,
      AdminPermissions.OUTLETS_READ,
      AdminPermissions.OUTLETS_MANAGE,
      AdminPermissions.OUTLETS_OVERRIDE_HOURS,
      AdminPermissions.OUTLETS_GEOFENCE_EDIT,
      AdminPermissions.LOCALITIES_READ,
      AdminPermissions.LOCALITIES_MANAGE,
      AdminPermissions.CATEGORIES_MANAGE,
      AdminPermissions.ORDERS_READ,
      AdminPermissions.ORDERS_INTERVENE,
      AdminPermissions.SYSTEM_HEALTH_READ,
      AdminPermissions.SYSTEM_MAINTENANCE_TOGGLE,
      AdminPermissions.FEATURE_FLAGS_READ,
      AdminPermissions.FEATURE_FLAGS_TOGGLE,
      AdminPermissions.AUDIT_LOGS_READ,
      AdminPermissions.NOTIFICATIONS_SEND_BROADCAST,
    ],
  },

  [AdminRoleType.FINANCE_ADMIN]: {
    type: AdminRoleType.FINANCE_ADMIN,
    title: 'Finance & Settlement Officer',
    description: 'Escrow settlement, PSP reconciliation, high-value refunds, subscription billing, and ledger audits.',
    requiresMfa: true,
    permissions: [
      AdminPermissions.MERCHANTS_READ,
      AdminPermissions.ORDERS_READ,
      AdminPermissions.PAYMENTS_READ,
      AdminPermissions.PAYMENTS_RECONCILE,
      AdminPermissions.PAYMENTS_WEBHOOK_RETRY,
      AdminPermissions.REFUNDS_READ,
      AdminPermissions.REFUNDS_APPROVE_LOW,
      AdminPermissions.REFUNDS_APPROVE_HIGH,
      AdminPermissions.DISPUTES_RESOLVE,
      AdminPermissions.SUBSCRIPTIONS_READ,
      AdminPermissions.SUBSCRIPTIONS_MANAGE,
      AdminPermissions.PRICING_MANAGE,
      AdminPermissions.ANALYTICS_READ,
      AdminPermissions.ANALYTICS_FINANCIAL_EXPORT,
      AdminPermissions.AUDIT_LOGS_READ,
    ],
  },

  [AdminRoleType.COMPLIANCE_LEAD]: {
    type: AdminRoleType.COMPLIANCE_LEAD,
    title: 'KYC & Merchant Compliance Lead',
    description: 'Merchant onboarding verification (FSSAI, GST, Bank penny-drop), catalog moderation, and merchant suspension.',
    requiresMfa: true,
    permissions: [
      AdminPermissions.MERCHANTS_READ,
      AdminPermissions.MERCHANTS_UPDATE,
      AdminPermissions.MERCHANTS_SUSPEND,
      AdminPermissions.KYC_READ,
      AdminPermissions.KYC_REVIEW,
      AdminPermissions.KYC_APPROVE,
      AdminPermissions.KYC_REJECT,
      AdminPermissions.KYC_RE_VERIFY,
      AdminPermissions.CATALOG_READ,
      AdminPermissions.CATALOG_MODERATE,
      AdminPermissions.CATALOG_TAKEDOWN,
      AdminPermissions.REVIEWS_READ,
      AdminPermissions.REVIEWS_MODERATE,
      AdminPermissions.AUDIT_LOGS_READ,
      AdminPermissions.AUDIT_PII_UNMASK,
    ],
  },

  [AdminRoleType.SUPPORT_AGENT]: {
    type: AdminRoleType.SUPPORT_AGENT,
    title: 'Customer & Merchant Support Specialist',
    description: 'Operational triage, ticket resolution, order lifecycle inspection, and low-tier refund issuance.',
    requiresMfa: false,
    permissions: [
      AdminPermissions.MERCHANTS_READ,
      AdminPermissions.OUTLETS_READ,
      AdminPermissions.ORDERS_READ,
      AdminPermissions.ORDERS_INTERVENE,
      AdminPermissions.REFUNDS_READ,
      AdminPermissions.REFUNDS_APPROVE_LOW,
      AdminPermissions.SUPPORT_READ,
      AdminPermissions.SUPPORT_ASSIGN,
      AdminPermissions.SUPPORT_RESPOND,
      AdminPermissions.SUPPORT_ESCALATE,
      AdminPermissions.SUPPORT_RESOLVE,
      AdminPermissions.REVIEWS_READ,
    ],
  },

  [AdminRoleType.READONLY_AUDITOR]: {
    type: AdminRoleType.READONLY_AUDITOR,
    title: 'Regulatory & Internal Auditor',
    description: 'Read-only access to audit logs, compliance records, transactions, and system activity logs.',
    requiresMfa: true,
    permissions: [
      AdminPermissions.MERCHANTS_READ,
      AdminPermissions.KYC_READ,
      AdminPermissions.OUTLETS_READ,
      AdminPermissions.ORDERS_READ,
      AdminPermissions.PAYMENTS_READ,
      AdminPermissions.REFUNDS_READ,
      AdminPermissions.SUBSCRIPTIONS_READ,
      AdminPermissions.SUPPORT_READ,
      AdminPermissions.AUDIT_LOGS_READ,
      AdminPermissions.ANALYTICS_READ,
      AdminPermissions.SYSTEM_HEALTH_READ,
    ],
  },
};
