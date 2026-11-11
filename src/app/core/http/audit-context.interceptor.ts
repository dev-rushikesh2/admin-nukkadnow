import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminSessionService } from '../auth/session.service';
import { AuditContextStore } from '../audit-context/audit-context.store';

export const auditContextInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(AdminSessionService);
  const auditStore = inject(AuditContextStore);

  const operator = sessionService.currentOperator();
  let modifiedHeaders = req.headers;

  if (operator) {
    modifiedHeaders = modifiedHeaders.set('X-Admin-Operator-Id', operator.operatorId);
  }

  // Attach active audit reason & justification for mutating calls
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  if (isMutation) {
    const activeReason = auditStore.activeReason();
    if (activeReason && !modifiedHeaders.has('X-Audit-Reason')) {
      modifiedHeaders = modifiedHeaders.set('X-Audit-Reason', activeReason.reasonCode);
      if (activeReason.justification) {
        modifiedHeaders = modifiedHeaders.set(
          'X-Audit-Justification',
          encodeURIComponent(activeReason.justification)
        );
      }
    }
  }

  return next(req.clone({ headers: modifiedHeaders }));
};
