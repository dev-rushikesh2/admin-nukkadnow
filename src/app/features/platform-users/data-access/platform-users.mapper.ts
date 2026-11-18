import { PlatformUserViewModel } from '../models/platform-users-view.model';

export class PlatformUsersMapper {
  static toViewModel(dto: any): PlatformUserViewModel {
    return {
      id: dto.id || '',
      name: dto.name || 'Admin User',
      email: dto.email || '',
      phone: dto.phone || '',
      roleCode: dto.roleCode || 'SUPPORT_STAFF',
      roleTitle: dto.roleTitle || dto.roleCode || 'Staff Member',
      status: dto.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
      mfaEnabled: dto.mfaEnabled ?? true,
      isRootProtected: dto.isRootProtected ?? (dto.roleCode === 'ROOT_ADMIN'),
      geoAssignment: dto.geoAssignment,
      createdAt: dto.createdAt || new Date().toISOString(),
      lastLoginAt: dto.lastLoginAt,
      supervisedBy: dto.supervisedBy,
    };
  }
}
