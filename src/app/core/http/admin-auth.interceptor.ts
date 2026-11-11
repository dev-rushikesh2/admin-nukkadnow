import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminSessionService } from '../auth/session.service';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(AdminSessionService);
  const token = sessionService.getToken();

  if (token && !req.headers.has('Authorization')) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(req);
};
