import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminPermissionService } from './permission.service';
import { AdminPermission } from '@nukkadnow/admin-access-control';

export const adminPermissionGuard: CanActivateFn = (route, _state) => {
  const permService = inject(AdminPermissionService);
  const router = inject(Router);

  const requiredPermissions = route.data?.['requiredPermissions'] as AdminPermission[] | undefined;
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  const matchMode = (route.data?.['permissionMatchMode'] as 'all' | 'any') || 'all';
  const hasAccess = matchMode === 'any'
    ? permService.hasAny(requiredPermissions)
    : permService.hasAll(requiredPermissions);

  if (hasAccess) {
    return true;
  }

  // Denied - redirect to dedicated access-denied page with specific required permissions
  return router.createUrlTree(['/access-denied'], {
    queryParams: {
      error: 'ACCESS_DENIED',
      requiredPermission: requiredPermissions.join(', '),
    },
  });
};
