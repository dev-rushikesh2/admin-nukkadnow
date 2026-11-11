import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface SecurityAnomalyReport {
  type: 'AUTHORIZATION_FAILURE' | 'RATE_LIMIT_EXCEEDED' | 'INTEGRITY_VIOLATION' | 'UNHANDLED_EXCEPTION';
  endpoint?: string;
  method?: string;
  status?: number;
  details?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class SecurityIncidentService {
  private readonly http = inject(HttpClient);

  reportSecurityAnomaly(report: SecurityAnomalyReport): void {
    const payload = {
      ...report,
      reportedAt: new Date().toISOString(),
      url: window.location.href,
    };

    this.http.post(`${environment.apiBaseUrl}/security/incidents`, payload).subscribe({
      error: () => {
        // Fallback quiet logging
      },
    });
  }

  reportClientException(details: { message: string; sanitizedStack: string; timestamp: string }): void {
    this.reportSecurityAnomaly({
      type: 'UNHANDLED_EXCEPTION',
      details,
    });
  }
}
