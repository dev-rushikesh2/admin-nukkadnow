import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SubscriptionsApi } from './subscriptions.api';
import { SubscriptionsMapper } from './subscriptions.mapper';
import { MerchantSubscriptionViewModel, MerchantSubscriptionFilterCriteria } from '../models/subscriptions-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsRepository {
  private readonly api = inject(SubscriptionsApi);

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

  changeStatus(id: string, status: string, reasonCode?: string): Observable<MerchantSubscriptionViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => SubscriptionsMapper.toViewModel(res.data)));
  }
}
