import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminSessionService } from '../auth/session.service';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(AdminSessionService);
  const token = sessionService.getToken();
  const role = sessionService.currentRole();
  const geo = sessionService.geoAssignment();

  let headers = req.headers;

  if (token && !headers.has('Authorization')) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  if (role && !headers.has('x-operator-role')) {
    headers = headers.set('x-operator-role', role);
  }
  if (geo?.cityName && !headers.has('x-operator-city')) {
    headers = headers.set('x-operator-city', geo.cityName);
  }
  if (geo?.cityId && !headers.has('x-operator-city-id')) {
    headers = headers.set('x-operator-city-id', geo.cityId);
  }

  const cloned = req.clone({ headers });
  return next(cloned);
};
