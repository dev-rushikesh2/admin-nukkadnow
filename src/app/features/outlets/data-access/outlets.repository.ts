import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OutletsApi } from './outlets.api';
import { OutletsMapper } from './outlets.mapper';
import { OutletViewModel, OutletFilterCriteria } from '../models/outlets-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root'
})
export class OutletsRepository {
  private readonly api = inject(OutletsApi);
  private readonly auditLogger = inject(AuditLoggerService);

  fetchItems(filters?: OutletFilterCriteria): Observable<PaginatedResult<OutletViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(OutletsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<OutletViewModel> {
    return this.api.getById(id).pipe(map(res => OutletsMapper.toViewModel(res.data)));
  }

  updateCapacity(id: string, hourlyCapacity: number, isThrottled: boolean, reasonCode?: string): Observable<OutletViewModel> {
    return this.api.updateCapacity(id, hourlyCapacity, isThrottled, reasonCode).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'OUTLET_CAPACITY_OVERRIDE',
          targetEntity: 'Outlet',
          targetId: id,
          reasonCode: reasonCode || 'CAPACITY_OVERRIDE',
          justification: `Hourly capacity adjusted to ${hourlyCapacity} orders/hr, throttled=${isThrottled}`,
        });
      }),
      map(res => OutletsMapper.toViewModel(res.data))
    );
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<OutletViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'OUTLET_STATUS_CHANGED',
          targetEntity: 'Outlet',
          targetId: id,
          reasonCode: reasonCode || 'OPERATIONAL_ADJUSTMENT',
          justification: `Changed outlet fulfillment state to ${status}`,
        });
      }),
      map(res => OutletsMapper.toViewModel(res.data))
    );
  }
}
