import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RefundDisputeViewModel, RefundFilterCriteria } from '../models/refunds-disputes-view.model';
import { AdminApiClient, AdminEndpoints, PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root',
})
export class RefundsDisputesRepository {
  private readonly api = inject(AdminApiClient);
  private readonly auditLogger = inject(AuditLoggerService);

  fetchItems(filters?: RefundFilterCriteria): Observable<PaginatedResult<RefundDisputeViewModel>> {
    return this.api.getPaginated<RefundDisputeViewModel>(AdminEndpoints.REFUNDS, {
      search: filters?.search,
      status: filters?.status,
      page: filters?.page,
      limit: filters?.limit,
    }).pipe(
      map((res) => res.data)
    );
  }

  fetchById(id: string): Observable<RefundDisputeViewModel> {
    return this.api.get<RefundDisputeViewModel>(`${AdminEndpoints.REFUNDS}/${id}`).pipe(
      map((res) => res.data)
    );
  }

  approveFirstSign(id: string, operatorId: string, operatorName: string, reasonCode: string, justification: string): Observable<RefundDisputeViewModel> {
    return this.api.patch<RefundDisputeViewModel>(
      AdminEndpoints.REFUND_APPROVE(id),
      { operatorId, operatorName, reasonCode, justification },
      { reasonCode, justification }
    ).pipe(
      tap((res) => {
        this.auditLogger.logAction({
          action: 'REFUND_FIRST_SIGN_APPROVED',
          targetEntity: 'RefundDispute',
          targetId: id,
          reasonCode,
          justification,
          metadata: { amountPaise: res.data?.amountPaise },
        });
      }),
      map((res) => res.data)
    );
  }

  approveSecondSign(id: string, operatorId: string, operatorName: string, stepUpTicket: string, justification: string): Observable<RefundDisputeViewModel> {
    const reasonCode = 'HIGH_VALUE_REFUND_APPROVED';
    return this.api.patch<RefundDisputeViewModel>(
      AdminEndpoints.REFUND_APPROVE(id),
      { operatorId, operatorName, stepUpTicket, justification },
      { reasonCode, justification, stepUpTicket }
    ).pipe(
      tap((res) => {
        this.auditLogger.logAction({
          action: 'REFUND_SECOND_SIGN_DUAL_APPROVED',
          targetEntity: 'RefundDispute',
          targetId: id,
          reasonCode,
          justification,
          metadata: {
            amountPaise: res.data?.amountPaise,
            stepUpTicket: stepUpTicket ? stepUpTicket.slice(0, 8) + '...' : 'none',
          },
        });
      }),
      map((res) => res.data)
    );
  }
}
