import { HttpInterceptorFn } from '@angular/common/http';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject X-XSRF-TOKEN for state-modifying requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const csrfToken = getCookie('XSRF-TOKEN') || 'admin-csrf-session-token';
    const cloned = req.clone({
      headers: req.headers.set('X-XSRF-TOKEN', csrfToken),
    });
    return next(cloned);
  }

  return next(req);
};
