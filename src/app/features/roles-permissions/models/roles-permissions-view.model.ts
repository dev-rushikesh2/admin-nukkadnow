export interface DynamicRoleViewModel {
  id: string;
  code: string;
  title: string;
  hierarchyLevel: number; // 1 = Root, 2 = Super Admin, 3 = City Manager, 4 = Staff, 5 = Custom
  description: string;
  isSystem: boolean;
  requiresMfa: boolean;
  permissions: string[];
  userCount: number;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AdminPermissionItem {
  code: string;
  module: string;
  title: string;
  description: string;
}

export interface CreateDynamicRoleDto {
  code: string;
  title: string;
  hierarchyLevel: number;
  description: string;
  requiresMfa: boolean;
  permissions: string[];
}

export interface UpdateDynamicRoleDto {
  title?: string;
  description?: string;
  requiresMfa?: boolean;
  permissions?: string[];
}

export interface ModuleResponsibilityRow {
  module: string;
  rootAdmin: string;
  superAdmin: string;
  cityManager: string;
  staff: string;
}

// Table 1: Complete 4-Level Responsibilities Matrix
export const MODULE_RESPONSIBILITIES_MATRIX: ModuleResponsibilityRow[] = [
  { module: 'Global dashboard', rootAdmin: 'Full', superAdmin: 'Full', cityManager: 'City only', staff: 'Limited' },
  { module: 'Admin management', rootAdmin: 'Full', superAdmin: 'Manage assigned staff', cityManager: 'Manage city staff if authorized', staff: 'No' },
  { module: 'Merchant management', rootAdmin: 'Full', superAdmin: 'Full', cityManager: 'Assigned city', staff: 'Limited' },
  { module: 'Merchant verification', rootAdmin: 'Full', superAdmin: 'Full', cityManager: 'Monitor', staff: 'Verify assigned applications' },
  { module: 'Customer management', rootAdmin: 'Full', superAdmin: 'Full', cityManager: 'City only', staff: 'Support access' },
  { module: 'Order management', rootAdmin: 'Full', superAdmin: 'Full', cityManager: 'City only', staff: 'Support access' },
  { module: 'Refunds', rootAdmin: 'Full', superAdmin: 'Approve/manage by policy', cityManager: 'Request/escalate', staff: 'No direct approval' },
  { module: 'Geographic management', rootAdmin: 'Full', superAdmin: 'Manage', cityManager: 'View assigned city', staff: 'No' },
  { module: 'Finance analytics', rootAdmin: 'Full', superAdmin: 'Full', cityManager: 'Limited city reports', staff: 'No' },
  { module: 'Platform configuration', rootAdmin: 'Full', superAdmin: 'Full', cityManager: 'No', staff: 'No' },
  { module: 'Audit logs', rootAdmin: 'Full', superAdmin: 'Full', cityManager: 'Own scope', staff: 'Own actions' },
];

export interface RolePermissionViewModel extends DynamicRoleViewModel {
  name?: string;
  status: string;
}

export interface RolePermissionFilterCriteria {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
