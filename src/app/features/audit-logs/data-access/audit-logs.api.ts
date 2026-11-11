import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLogRecordViewModel, AuditLogRecordFilterCriteria } from '../models/audit-logs-view.model';

@Injectable({
  providedIn: 'root'
})
export class AuditLogsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/audit-logs';

  getItems(filters?: AuditLogRecordFilterCriteria): Observable<ApiResponse<PaginatedResult<AuditLogRecordViewModel>>> {
    return this.client.getPaginated<AuditLogRecordViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<AuditLogRecordViewModel>> {
    return this.client.get<AuditLogRecordViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<AuditLogRecordViewModel>> {
    return this.client.patch<AuditLogRecordViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
