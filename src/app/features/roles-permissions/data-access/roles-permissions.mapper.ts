import { RolePermissionViewModel } from '../models/roles-permissions-view.model';

export class RolesPermissionsMapper {
  static toViewModel(dto: any): RolePermissionViewModel {
    return {
      id: dto.id || '',
      code: dto.code || dto.name || '',
      title: dto.title || dto.name || dto.code || '',
      hierarchyLevel: dto.hierarchyLevel || 4,
      description: dto.description || '',
      isSystem: dto.isSystem ?? true,
      requiresMfa: dto.requiresMfa ?? true,
      permissions: Array.isArray(dto.permissions) ? dto.permissions : [],
      userCount: dto.userCount || 0,
      name: dto.title || dto.name || dto.code,
      status: dto.status || 'ACTIVE',
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt,
      metadata: dto.metadata || {}
    };
  }
}
