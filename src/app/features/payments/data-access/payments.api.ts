import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { PaymentTransactionViewModel, PaymentTransactionFilterCriteria } from '../models/payments-view.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/payments';

  getItems(filters?: PaymentTransactionFilterCriteria): Observable<ApiResponse<PaginatedResult<PaymentTransactionViewModel>>> {
    return this.client.getPaginated<PaymentTransactionViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<PaymentTransactionViewModel>> {
    return this.client.get<PaymentTransactionViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<PaymentTransactionViewModel>> {
    return this.client.patch<PaymentTransactionViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
