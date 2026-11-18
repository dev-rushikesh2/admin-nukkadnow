import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SubscriptionsApi } from './subscriptions.api';
import { SubscriptionsMapper } from './subscriptions.mapper';
import { MerchantSubscriptionViewModel, MerchantSubscriptionFilterCriteria } from '../models/subscriptions-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsRepository {
  private readonly api = inject(SubscriptionsApi);
  private readonly auditLogger = inject(AuditLoggerService);

  fetchItems(filters?: MerchantSubscriptionFilterCriteria): Observable<PaginatedResult<MerchantSubscriptionViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(SubscriptionsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<MerchantSubscriptionViewModel> {
    return this.api.getById(id).pipe(map(res => SubscriptionsMapper.toViewModel(res.data)));
  }

  extendGracePeriod(id: string, days: number, reasonCode?: string): Observable<MerchantSubscriptionViewModel> {
    return this.api.extendGracePeriod(id, days, reasonCode).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'SUBSCRIPTION_GRACE_EXTENDED',
          targetEntity: 'MerchantSubscription',
          targetId: id,
          reasonCode: reasonCode || 'MERCHANT_RETENTION_GRACE',
          justification: `Extended subscription invoice grace period by ${days} days for ${id}`,
        });
      }),
      map(res => SubscriptionsMapper.toViewModel(res.data))
    );
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<MerchantSubscriptionViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'SUBSCRIPTION_STATUS_CHANGED',
          targetEntity: 'MerchantSubscription',
          targetId: id,
          reasonCode: reasonCode || 'SUBSCRIPTION_STATE_CHANGE',
          justification: `Changed subscription state to ${status}`,
        });
      }),
      map(res => SubscriptionsMapper.toViewModel(res.data))
    );
  }
}
