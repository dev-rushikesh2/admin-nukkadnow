import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { MerchantViewModel, MerchantFilterCriteria } from '../models/merchants-view.model';

@Injectable({
  providedIn: 'root'
})
export class MerchantsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/merchants';

  getItems(filters?: MerchantFilterCriteria): Observable<ApiResponse<PaginatedResult<MerchantViewModel>>> {
    return this.client.getPaginated<MerchantViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<MerchantViewModel>> {
    return this.client.get<MerchantViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<MerchantViewModel>> {
    return this.client.patch<MerchantViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
