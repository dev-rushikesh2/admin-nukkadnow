import { AdminPermission, AdminPermissions } from './permissions';

/**
 * NukkadNow 4-Level Administrative Hierarchy Roles
 * Level 1: Root Admin (Company owner · Complete platform control)
 * Level 2: Super Admin (Central platform operations and management)
 * Level 3: City Operations Manager (Responsible for assigned city operations)
 * Level 4: Staff (Verification Staff & Support Staff)
 */
export enum AdminRole {
  ROOT_ADMIN = 'ROOT_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  CITY_OPERATIONS_MANAGER = 'CITY_OPERATIONS_MANAGER',
  VERIFICATION_STAFF = 'VERIFICATION_STAFF',
  SUPPORT_STAFF = 'SUPPORT_STAFF',
}

// Backward compatibility alias
export const AdminRoleType = AdminRole;
export type AdminRoleType = AdminRole;

export interface AdminGeoAssignment {
  state: string;
  district: string;
  cityId: string;
  cityName: string;
  localities: string[];
}

export interface AdminRoleDefinition {
  type: AdminRole;
  hierarchyLevel: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  description: string;
  requiresMfa: boolean;
  permissions: readonly AdminPermission[];
  moduleResponsibilities: {
    globalDashboard: string;
    adminManagement: string;
    merchantManagement: string;
    merchantVerification: string;
    customerManagement: string;
    orderManagement: string;
    refunds: string;
    geographicManagement: string;
    financeAnalytics: string;
    platformConfiguration: string;
    auditLogs: string;
  };
}

export const ADMIN_ROLE_MATRIX: Record<AdminRole, AdminRoleDefinition> = {
  [AdminRole.ROOT_ADMIN]: {
    type: AdminRole.ROOT_ADMIN,
    hierarchyLevel: 1,
    title: 'Root Admin',
    subtitle: 'Company Owner · Ultimate Platform Authority',
    description: 'Complete unconstrained platform control, security configurations, and user delegation. Protected account that cannot be modified or deleted by Super Admins.',
    requiresMfa: true,
    permissions: Object.values(AdminPermissions),
    moduleResponsibilities: {
      globalDashboard: 'Full',
      adminManagement: 'Full',
      merchantManagement: 'Full',
      merchantVerification: 'Full',
      customerManagement: 'Full',
      orderManagement: 'Full',
      refunds: 'Full',
      geographicManagement: 'Full',
      financeAnalytics: 'Full',
      platformConfiguration: 'Full',
      auditLogs: 'Full',
    },
  },

  [AdminRole.SUPER_ADMIN]: {
    type: AdminRole.SUPER_ADMIN,
    hierarchyLevel: 2,
    title: 'Super Admin',
    subtitle: 'Central Platform Operations & Management',
    description: 'Central operations management across all cities. Supervise staff, configure feature flags, manage merchants, and approve refunds. Cannot create or alter Root Admin accounts.',
    requiresMfa: true,
    permissions: [
      // Full administrative permissions across operational modules
      AdminPermissions.MERCHANTS_READ,
      AdminPermissions.MERCHANTS_CREATE,
      AdminPermissions.MERCHANTS_UPDATE,
      AdminPermissions.MERCHANTS_SUSPEND,
      AdminPermissions.MERCHANTS_EXPORT,
      AdminPermissions.KYC_READ,
      AdminPermissions.KYC_REVIEW,
      AdminPermissions.KYC_APPROVE,
      AdminPermissions.KYC_REJECT,
      AdminPermissions.KYC_RE_VERIFY,
      AdminPermissions.OUTLETS_READ,
      AdminPermissions.OUTLETS_MANAGE,
      AdminPermissions.OUTLETS_OVERRIDE_HOURS,
      AdminPermissions.OUTLETS_GEOFENCE_EDIT,
      AdminPermissions.LOCALITIES_READ,
      AdminPermissions.LOCALITIES_MANAGE,
      AdminPermissions.CATEGORIES_MANAGE,
      AdminPermissions.CATALOG_READ,
      AdminPermissions.CATALOG_MODERATE,
      AdminPermissions.CATALOG_TAKEDOWN,
      AdminPermissions.ORDERS_READ,
      AdminPermissions.ORDERS_INTERVENE,
      AdminPermissions.ORDERS_FORCE_CANCEL,
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
      AdminPermissions.SUPPORT_READ,
      AdminPermissions.SUPPORT_ASSIGN,
      AdminPermissions.SUPPORT_RESPOND,
      AdminPermissions.SUPPORT_ESCALATE,
      AdminPermissions.SUPPORT_RESOLVE,
      AdminPermissions.REVIEWS_READ,
      AdminPermissions.REVIEWS_MODERATE,
      AdminPermissions.NOTIFICATIONS_SEND_BROADCAST,
      AdminPermissions.NOTIFICATIONS_TEMPLATES_MANAGE,
      AdminPermissions.ANALYTICS_READ,
      AdminPermissions.ANALYTICS_FINANCIAL_EXPORT,
      AdminPermissions.PLATFORM_USERS_READ,
      AdminPermissions.PLATFORM_USERS_MANAGE,
      AdminPermissions.PLATFORM_ROLES_MANAGE,
      AdminPermissions.FEATURE_FLAGS_READ,
      AdminPermissions.FEATURE_FLAGS_TOGGLE,
      AdminPermissions.SYSTEM_HEALTH_READ,
      AdminPermissions.SYSTEM_MAINTENANCE_TOGGLE,
      AdminPermissions.AUDIT_LOGS_READ,
      AdminPermissions.AUDIT_PII_UNMASK,
      AdminPermissions.SETTINGS_MANAGE,
    ],
    moduleResponsibilities: {
      globalDashboard: 'Full',
      adminManagement: 'Manage assigned staff',
      merchantManagement: 'Full',
      merchantVerification: 'Full',
      customerManagement: 'Full',
      orderManagement: 'Full',
      refunds: 'Approve/manage by policy',
      geographicManagement: 'Manage',
      financeAnalytics: 'Full',
      platformConfiguration: 'Full',
      auditLogs: 'Full',
    },
  },

  [AdminRole.CITY_OPERATIONS_MANAGER]: {
    type: AdminRole.CITY_OPERATIONS_MANAGER,
    hierarchyLevel: 3,
    title: 'City Operations Manager',
    subtitle: 'City Operations Leadership & Oversight',
    description: 'Responsible for assigned city operations (e.g. Pune, Nagpur). Enforces territory coverage, monitors merchant verification, manages city orders, escalates refunds, and supervises city staff.',
    requiresMfa: true,
    permissions: [
      AdminPermissions.MERCHANTS_READ,
      AdminPermissions.MERCHANTS_UPDATE,
      AdminPermissions.MERCHANTS_SUSPEND,
      AdminPermissions.KYC_READ,
      AdminPermissions.KYC_REVIEW,
      AdminPermissions.OUTLETS_READ,
      AdminPermissions.OUTLETS_MANAGE,
      AdminPermissions.OUTLETS_OVERRIDE_HOURS,
      AdminPermissions.LOCALITIES_READ,
      AdminPermissions.CATEGORIES_MANAGE,
      AdminPermissions.CATALOG_READ,
      AdminPermissions.CATALOG_MODERATE,
      AdminPermissions.ORDERS_READ,
      AdminPermissions.ORDERS_INTERVENE,
      AdminPermissions.REFUNDS_READ,
      AdminPermissions.DISPUTES_RESOLVE,
      AdminPermissions.SUPPORT_READ,
      AdminPermissions.SUPPORT_ASSIGN,
      AdminPermissions.SUPPORT_RESPOND,
      AdminPermissions.SUPPORT_ESCALATE,
      AdminPermissions.REVIEWS_READ,
      AdminPermissions.ANALYTICS_READ,
      AdminPermissions.PLATFORM_USERS_READ,
      AdminPermissions.PLATFORM_USERS_MANAGE,
      AdminPermissions.AUDIT_LOGS_READ,
    ],
    moduleResponsibilities: {
      globalDashboard: 'City only',
      adminManagement: 'Manage city staff if authorized',
      merchantManagement: 'Assigned city',
      merchantVerification: 'Monitor',
      customerManagement: 'City only',
      orderManagement: 'City only',
      refunds: 'Request/escalate',
      geographicManagement: 'View assigned city',
      financeAnalytics: 'Limited city reports',
      platformConfiguration: 'No',
      auditLogs: 'Own scope',
    },
  },

  [AdminRole.VERIFICATION_STAFF]: {
    type: AdminRole.VERIFICATION_STAFF,
    hierarchyLevel: 4,
    title: 'Verification Staff',
    subtitle: 'Merchant Statutory Document Verification',
    description: 'Verifies merchant document credentials: FSSAI food licenses, GSTIN certificates, PAN cards, bank penny-drop confirmations, and storefront GPS photos.',
    requiresMfa: true,
    permissions: [
      AdminPermissions.MERCHANTS_READ,
      AdminPermissions.KYC_READ,
      AdminPermissions.KYC_REVIEW,
      AdminPermissions.KYC_APPROVE,
      AdminPermissions.KYC_REJECT,
      AdminPermissions.KYC_RE_VERIFY,
      AdminPermissions.CATALOG_READ,
      AdminPermissions.CATALOG_MODERATE,
      AdminPermissions.AUDIT_LOGS_READ,
    ],
    moduleResponsibilities: {
      globalDashboard: 'Limited (Verification Queue)',
      adminManagement: 'No',
      merchantManagement: 'Limited',
      merchantVerification: 'Verify assigned applications',
      customerManagement: 'No',
      orderManagement: 'No',
      refunds: 'No direct approval',
      geographicManagement: 'No',
      financeAnalytics: 'No',
      platformConfiguration: 'No',
      auditLogs: 'Own actions',
    },
  },

  [AdminRole.SUPPORT_STAFF]: {
    type: AdminRole.SUPPORT_STAFF,
    hierarchyLevel: 4,
    title: 'Support Staff',
    subtitle: 'Customer & Merchant Support Specialist',
    description: 'Handles customer order assistance, delivery slot inquiries, merchant communications, support ticket triage, and refund escalations.',
    requiresMfa: false,
    permissions: [
      AdminPermissions.MERCHANTS_READ,
      AdminPermissions.OUTLETS_READ,
      AdminPermissions.ORDERS_READ,
      AdminPermissions.ORDERS_INTERVENE,
      AdminPermissions.SUPPORT_READ,
      AdminPermissions.SUPPORT_ASSIGN,
      AdminPermissions.SUPPORT_RESPOND,
      AdminPermissions.SUPPORT_ESCALATE,
      AdminPermissions.SUPPORT_RESOLVE,
      AdminPermissions.REVIEWS_READ,
      AdminPermissions.AUDIT_PII_UNMASK,
      AdminPermissions.AUDIT_LOGS_READ,
    ],
    moduleResponsibilities: {
      globalDashboard: 'Limited (Support Triage)',
      adminManagement: 'No',
      merchantManagement: 'Limited',
      merchantVerification: 'No',
      customerManagement: 'Support access',
      orderManagement: 'Support access',
      refunds: 'No direct approval',
      geographicManagement: 'No',
      financeAnalytics: 'No',
      platformConfiguration: 'No',
      auditLogs: 'Own actions',
    },
  },
};
