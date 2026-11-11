import { ErrorHandler, Injectable, inject } from '@angular/core';
import { SecurityIncidentService } from './security-incident.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly incidentService = inject(SecurityIncidentService);

  handleError(error: unknown): void {
    const errorString = error instanceof Error ? error.stack || error.message : String(error);

    // Sanitize any potential PII or secrets before logging
    const sanitized = this.sanitizeError(errorString);

    console.error('[ADMIN-UNHANDLED-EXCEPTION]', sanitized);

    this.incidentService.reportClientException({
      message: error instanceof Error ? error.message : 'Unknown exception',
      sanitizedStack: sanitized,
      timestamp: new Date().toISOString(),
    });
  }

  private sanitizeError(raw: string): string {
    // Redact Bearer tokens, passwords, PAN/Aadhaar patterns
    return raw
      .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, 'Bearer [REDACTED]')
      .replace(/password['"]?\s*[:=]\s*['"][^'"]+['"]/gi, 'password="[REDACTED]"')
      .replace(/[A-Z]{5}[0-9]{4}[A-Z]/g, '[PAN_REDACTED]')
      .replace(/\b\d{12}\b/g, '[AADHAAR_REDACTED]');
  }
}
