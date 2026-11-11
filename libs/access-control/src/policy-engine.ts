import { AdminPermission, AdminPermissions } from './permissions';
import { AdminRoleType, ADMIN_ROLE_MATRIX } from './roles';

/**
 * High-Risk Actions that strictly require Step-Up MFA authentication before dispatch
 */
export const STEP_UP_REQUIRED_PERMISSIONS: readonly AdminPermission[] = [
  AdminPermissions.MERCHANTS_SUSPEND,
  AdminPermissions.MERCHANTS_TERMINATE,
  AdminPermissions.KYC_REJECT,
  AdminPermissions.REFUNDS_APPROVE_HIGH,
  AdminPermissions.DISPUTES_RESOLVE,
  AdminPermissions.FEATURE_FLAGS_TOGGLE,
  AdminPermissions.SYSTEM_MAINTENANCE_TOGGLE,
  AdminPermissions.PLATFORM_USERS_MANAGE,
  AdminPermissions.PLATFORM_ROLES_MANAGE,
  AdminPermissions.AUDIT_PII_UNMASK,
  AdminPermissions.ANALYTICS_FINANCIAL_EXPORT,
];

/**
 * Operations requiring an explicit mandatory Audit Reason Code before submission
 */
export const AUDIT_REASON_MANDATORY_PERMISSIONS: readonly AdminPermission[] = [
  AdminPermissions.MERCHANTS_SUSPEND,
  AdminPermissions.MERCHANTS_TERMINATE,
  AdminPermissions.KYC_REJECT,
  AdminPermissions.ORDERS_FORCE_CANCEL,
  AdminPermissions.REFUNDS_APPROVE_LOW,
  AdminPermissions.REFUNDS_APPROVE_HIGH,
  AdminPermissions.CATALOG_TAKEDOWN,
  AdminPermissions.AUDIT_PII_UNMASK,
  AdminPermissions.FEATURE_FLAGS_TOGGLE,
];

export interface PolicyEvaluationResult {
  authorized: boolean;
  requiresStepUp: boolean;
  requiresAuditReason: boolean;
  reason?: string;
}

export class PolicyEngine {
  /**
   * Determine if the operator with active permissions has authority to perform the required action.
   */
  static evaluate(
    userPermissions: readonly AdminPermission[],
    requiredPermission: AdminPermission
  ): PolicyEvaluationResult {
    const hasPerm = userPermissions.includes(requiredPermission);

    if (!hasPerm) {
      return {
        authorized: false,
        requiresStepUp: false,
        requiresAuditReason: false,
        reason: `Missing required permission: ${requiredPermission}`,
      };
    }

    const requiresStepUp = STEP_UP_REQUIRED_PERMISSIONS.includes(requiredPermission);
    const requiresAuditReason = AUDIT_REASON_MANDATORY_PERMISSIONS.includes(requiredPermission);

    return {
      authorized: true,
      requiresStepUp,
      requiresAuditReason,
    };
  }

  /**
   * Resolve complete permission list from a role.
   */
  static getPermissionsForRole(role: AdminRoleType): readonly AdminPermission[] {
    const definition = ADMIN_ROLE_MATRIX[role];
    return definition ? definition.permissions : [];
  }
}
