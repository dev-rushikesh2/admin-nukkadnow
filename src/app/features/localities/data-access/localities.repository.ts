import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LocalitiesApi } from './localities.api';
import { LocalitiesMapper } from './localities.mapper';
import { LocalityViewModel, LocalityFilterCriteria } from '../models/localities-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root'
})
export class LocalitiesRepository {
  private readonly api = inject(LocalitiesApi);
  private readonly auditLogger = inject(AuditLoggerService);

  fetchItems(filters?: LocalityFilterCriteria): Observable<PaginatedResult<LocalityViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(LocalitiesMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<LocalityViewModel> {
    return this.api.getById(id).pipe(map(res => LocalitiesMapper.toViewModel(res.data)));
  }

  createZone(payload: Partial<LocalityViewModel>): Observable<LocalityViewModel> {
    return this.api.createZone(payload).pipe(
      tap((res) => {
        const item = res.data;
        this.auditLogger.logAction({
          action: 'LOCALITY_CREATED',
          targetEntity: 'Locality',
          targetId: item?.id || '',
          reasonCode: 'GEO_EXPANSION',
          justification: `Provisioned micro-market zone ${payload.name} in ${payload.city}`,
        });
      }),
      map(res => LocalitiesMapper.toViewModel(res.data))
    );
  }

  changeStatus(id: string, status: string, reasonCode?: string, congestionMultiplier?: number): Observable<LocalityViewModel> {
    return this.api.updateStatus(id, status, reasonCode, congestionMultiplier).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'LOCALITY_STATUS_CHANGED',
          targetEntity: 'Locality',
          targetId: id,
          reasonCode: reasonCode || 'OPERATIONAL_ADJUSTMENT',
          justification: `Updated locality status to ${status} with congestion multiplier ${congestionMultiplier ?? 1.0}`,
        });
      }),
      map(res => LocalitiesMapper.toViewModel(res.data))
    );
  }
}
