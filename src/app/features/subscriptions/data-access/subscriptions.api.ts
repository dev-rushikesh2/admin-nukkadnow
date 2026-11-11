import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { MerchantSubscriptionViewModel, MerchantSubscriptionFilterCriteria } from '../models/subscriptions-view.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/subscriptions';

  getItems(filters?: MerchantSubscriptionFilterCriteria): Observable<ApiResponse<PaginatedResult<MerchantSubscriptionViewModel>>> {
    return this.client.getPaginated<MerchantSubscriptionViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<MerchantSubscriptionViewModel>> {
    return this.client.get<MerchantSubscriptionViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<MerchantSubscriptionViewModel>> {
    return this.client.patch<MerchantSubscriptionViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
