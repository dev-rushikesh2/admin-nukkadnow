import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PaymentsApi } from './payments.api';
import { PaymentsMapper } from './payments.mapper';
import { PaymentTransactionViewModel, PaymentTransactionFilterCriteria } from '../models/payments-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsRepository {
  private readonly api = inject(PaymentsApi);
  private readonly auditLogger = inject(AuditLoggerService);

  fetchItems(filters?: PaymentTransactionFilterCriteria): Observable<PaginatedResult<PaymentTransactionViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(PaymentsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<PaymentTransactionViewModel> {
    return this.api.getById(id).pipe(map(res => PaymentsMapper.toViewModel(res.data)));
  }

  replayWebhook(id: string): Observable<{ replayed: boolean; deliveryTimestamp: string }> {
    return this.api.replayWebhook(id).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'PAYMENT_WEBHOOK_REPLAYED',
          targetEntity: 'PaymentTransaction',
          targetId: id,
          reasonCode: 'WEBHOOK_FAILURE_RESYNC',
          justification: `Manually replayed gateway payment webhook for transaction ${id}`,
        });
      }),
      map(res => res.data)
    );
  }

  releaseEscrow(id: string, reasonCode?: string): Observable<PaymentTransactionViewModel> {
    return this.api.releaseEscrow(id, reasonCode).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'ESCROW_FUNDS_RELEASED',
          targetEntity: 'PaymentTransaction',
          targetId: id,
          reasonCode: reasonCode || 'MANUAL_ESCROW_RELEASE',
          justification: `Released escrow settlement for payment ${id}`,
        });
      }),
      map(res => PaymentsMapper.toViewModel(res.data))
    );
  }
}
