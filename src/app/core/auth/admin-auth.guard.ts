import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminSessionService } from './session.service';

export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const sessionService = inject(AdminSessionService);
  const router = inject(Router);

  if (sessionService.isAuthenticated()) {
    return true;
  }

  if (sessionService.isLocked()) {
    return router.createUrlTree(['/auth/lock-screen'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};
