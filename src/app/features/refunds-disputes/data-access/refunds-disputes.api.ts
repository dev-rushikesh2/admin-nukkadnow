import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { RefundDisputeViewModel, RefundDisputeFilterCriteria } from '../models/refunds-disputes-view.model';

@Injectable({
  providedIn: 'root'
})
export class RefundsDisputesApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/refunds-disputes';

  getItems(filters?: RefundDisputeFilterCriteria): Observable<ApiResponse<PaginatedResult<RefundDisputeViewModel>>> {
    return this.client.getPaginated<RefundDisputeViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<RefundDisputeViewModel>> {
    return this.client.get<RefundDisputeViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<RefundDisputeViewModel>> {
    return this.client.patch<RefundDisputeViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
