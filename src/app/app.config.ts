import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { adminAuthInterceptor } from './core/http/admin-auth.interceptor';
import { auditContextInterceptor } from './core/http/audit-context.interceptor';
import { correlationIdInterceptor } from './core/http/correlation-id.interceptor';
import { csrfInterceptor } from './core/http/csrf.interceptor';
import { apiErrorInterceptor } from './core/http/api-error.interceptor';
import { GlobalErrorHandler } from './core/error-handling/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideHttpClient(
      withInterceptors([
        correlationIdInterceptor,
        adminAuthInterceptor,
        auditContextInterceptor,
        csrfInterceptor,
        apiErrorInterceptor,
      ])
    ),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
};
