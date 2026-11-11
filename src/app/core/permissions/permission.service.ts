import { Injectable, inject, computed } from '@angular/core';
import { AdminSessionService } from '../auth/session.service';
import { AdminPermission, PolicyEngine, PolicyEvaluationResult } from '@nukkadnow/admin-access-control';

@Injectable({
  providedIn: 'root',
})
export class AdminPermissionService {
  private readonly sessionService = inject(AdminSessionService);

  readonly userPermissions = computed(() => this.sessionService.currentPermissions());

  hasPermission(permission: AdminPermission): boolean {
    return this.userPermissions().includes(permission);
  }

  hasAny(permissions: readonly AdminPermission[]): boolean {
    const active = this.userPermissions();
    return permissions.some((p) => active.includes(p));
  }

  hasAll(permissions: readonly AdminPermission[]): boolean {
    const active = this.userPermissions();
    return permissions.every((p) => active.includes(p));
  }

  evaluatePolicy(permission: AdminPermission): PolicyEvaluationResult {
    return PolicyEngine.evaluate(this.userPermissions(), permission);
  }
}
