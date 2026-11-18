import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AdminOrderViewModel, OrderFilterCriteria } from '../models/orders-view.model';
import { AdminApiClient, AdminEndpoints, PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersRepository {
  private readonly api = inject(AdminApiClient);
  private readonly auditLogger = inject(AuditLoggerService);

  fetchItems(filters?: OrderFilterCriteria): Observable<PaginatedResult<AdminOrderViewModel>> {
    return this.api.getPaginated<AdminOrderViewModel>(AdminEndpoints.ORDERS, {
      search: filters?.search,
      status: filters?.status,
      locality: filters?.locality,
      page: filters?.page,
      limit: filters?.limit,
    }).pipe(
      map((res) => res.data)
    );
  }

  fetchById(id: string): Observable<AdminOrderViewModel> {
    return this.api.get<AdminOrderViewModel>(AdminEndpoints.ORDER_BY_ID(id)).pipe(
      map((res) => res.data)
    );
  }

  forceCancelOrder(id: string, reasonCode: string, justification: string): Observable<AdminOrderViewModel> {
    return this.api.post<AdminOrderViewModel>(
      AdminEndpoints.ORDER_FORCE_CANCEL(id),
      { reasonCode, justification },
      { reasonCode, justification }
    ).pipe(
      tap((res) => {
        this.auditLogger.logAction({
          action: 'ORDER_FORCE_CANCELLED',
          targetEntity: 'Order',
          targetId: id,
          reasonCode,
          justification,
          metadata: { refundTriggeredPaise: res.data?.totalPaise },
        });
      }),
      map((res) => res.data)
    );
  }
}
