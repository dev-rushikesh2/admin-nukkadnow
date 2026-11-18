import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MerchantViewModel, MerchantFilterCriteria } from '../models/merchants-view.model';
import { AdminApiClient, AdminEndpoints, PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root',
})
export class MerchantsRepository {
  private readonly api = inject(AdminApiClient);
  private readonly auditLogger = inject(AuditLoggerService);

  fetchItems(filters?: MerchantFilterCriteria): Observable<PaginatedResult<MerchantViewModel>> {
    return this.api.getPaginated<MerchantViewModel>(AdminEndpoints.MERCHANTS, {
      search: filters?.search,
      status: filters?.status,
      mode: filters?.mode,
      locality: filters?.locality,
      page: filters?.page,
      limit: filters?.limit,
    }).pipe(
      map((res) => res.data)
    );
  }

  fetchById(id: string): Observable<MerchantViewModel> {
    return this.api.get<MerchantViewModel>(AdminEndpoints.MERCHANT_BY_ID(id)).pipe(
      map((res) => res.data)
    );
  }

  suspendMerchant(id: string, reasonCode: string, justification: string, stepUpTicket: string): Observable<MerchantViewModel> {
    return this.api.patch<MerchantViewModel>(
      AdminEndpoints.MERCHANT_SUSPEND(id),
      { reasonCode, justification },
      { reasonCode, justification, stepUpTicket }
    ).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'MERCHANT_SUSPENDED',
          targetEntity: 'Merchant',
          targetId: id,
          reasonCode,
          justification,
          metadata: { stepUpTicket: stepUpTicket ? stepUpTicket.slice(0, 10) + '...' : 'none' },
        });
      }),
      map((res) => res.data)
    );
  }

  activateMerchant(id: string): Observable<MerchantViewModel> {
    const reasonCode = 'ROUTINE_AUDIT';
    const justification = 'Compliance clearance completed by operator';

    return this.api.patch<MerchantViewModel>(
      AdminEndpoints.MERCHANT_ACTIVATE(id),
      {},
      { reasonCode, justification }
    ).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'MERCHANT_ACTIVATED',
          targetEntity: 'Merchant',
          targetId: id,
          reasonCode,
          justification,
        });
      }),
      map((res) => res.data)
    );
  }
}
