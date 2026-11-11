import { AdminRoleType } from '@nukkadnow/admin-access-control';

export class MockAdminAuthService {
  private activeRole: AdminRoleType = AdminRoleType.SUPER_ADMIN;
  private authenticated = true;

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getRole(): AdminRoleType {
    return this.activeRole;
  }

  setRole(role: AdminRoleType): void {
    this.activeRole = role;
  }

  setAuthenticated(state: boolean): void {
    this.authenticated = state;
  }

  hasPermission(_perm: string): boolean {
    return true;
  }
}
