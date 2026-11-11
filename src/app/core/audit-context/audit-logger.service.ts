import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface AuditLogEntry {
  action: string;
  targetEntity: string;
  targetId: string;
  reasonCode?: string;
  justification?: string;
  metadata?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class AuditLoggerService {
  private readonly http = inject(HttpClient);

  logAction(entry: AuditLogEntry): void {
    const payload = {
      ...entry,
      clientTimestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    // Non-blocking fire-and-forget audit dispatch to backend immutable log
    this.http.post(`${environment.apiBaseUrl}/audit/logs`, payload).subscribe({
      error: (err) => console.error('[AUDIT-LOG-FAIL] Failed to persist audit entry:', err),
    });
  }
}
