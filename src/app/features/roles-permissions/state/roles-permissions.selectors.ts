import { RolePermissionViewModel } from '../models/roles-permissions-view.model';

export class RolesPermissionsSelectors {
  static filterByStatus(items: RolePermissionViewModel[], status: string): RolePermissionViewModel[] {
    return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
}
