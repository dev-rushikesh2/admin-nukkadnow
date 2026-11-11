import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { MerchantVerificationViewModel, MerchantVerificationFilterCriteria } from '../models/merchant-verification-view.model';

@Injectable({
  providedIn: 'root'
})
export class MerchantVerificationApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/merchant-verification';

  getItems(filters?: MerchantVerificationFilterCriteria): Observable<ApiResponse<PaginatedResult<MerchantVerificationViewModel>>> {
    return this.client.getPaginated<MerchantVerificationViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<MerchantVerificationViewModel>> {
    return this.client.get<MerchantVerificationViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<MerchantVerificationViewModel>> {
    return this.client.patch<MerchantVerificationViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
