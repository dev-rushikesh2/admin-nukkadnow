import { HttpInterceptorFn } from '@angular/common/http';

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  const correlationId = generateUuid();
  const traceParent = `00-${generateUuid().replace(/-/g, '')}-${generateUuid().replace(/-/g, '').slice(0, 16)}-01`;

  const cloned = req.clone({
    headers: req.headers
      .set('X-Correlation-Id', correlationId)
      .set('traceparent', traceParent),
  });

  return next(cloned);
};
