import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AdminSessionService } from '../auth/session.service';
import { SecurityIncidentService } from '../error-handling/security-incident.service';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(AdminSessionService);
  const router = inject(Router);
  const incidentService = inject(SecurityIncidentService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized: Session has expired or token revoked
      if (error.status === 401) {
        sessionService.clearSession();
        router.navigate(['/auth/login'], {
          queryParams: { error: 'SESSION_EXPIRED' },
        });
      }

      // 403 Forbidden: Potential privilege escalation or missing role
      if (error.status === 403) {
        incidentService.reportSecurityAnomaly({
          type: 'AUTHORIZATION_FAILURE',
          endpoint: req.url,
          method: req.method,
          status: 403,
          details: error.error,
        });
      }

      // 429 Too Many Requests: Rate limit exceeded
      if (error.status === 429) {
        incidentService.reportSecurityAnomaly({
          type: 'RATE_LIMIT_EXCEEDED',
          endpoint: req.url,
          method: req.method,
          status: 429,
        });
      }

      return throwError(() => error);
    })
  );
};
