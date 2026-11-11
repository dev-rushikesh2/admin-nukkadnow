import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuditLogsApi } from './audit-logs.api';
import { AuditLogsMapper } from './audit-logs.mapper';
import { AuditLogRecordViewModel, AuditLogRecordFilterCriteria } from '../models/audit-logs-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class AuditLogsRepository {
  private readonly api = inject(AuditLogsApi);

  fetchItems(filters?: AuditLogRecordFilterCriteria): Observable<PaginatedResult<AuditLogRecordViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(AuditLogsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<AuditLogRecordViewModel> {
    return this.api.getById(id).pipe(map(res => AuditLogsMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<AuditLogRecordViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => AuditLogsMapper.toViewModel(res.data)));
  }
}
