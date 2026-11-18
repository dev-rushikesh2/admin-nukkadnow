import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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

  replayWebhook(id: string): Observable<ApiResponse<{ replayed: boolean; deliveryTimestamp: string }>> {
    return this.client.post<{ replayed: boolean; deliveryTimestamp: string }>(`${this.endpoint}/webhooks/${id}/replay`, {});
  }

  releaseEscrow(id: string, reasonCode?: string): Observable<ApiResponse<PaymentTransactionViewModel>> {
    return this.client.patch<PaymentTransactionViewModel>(
      `${this.endpoint}/${id}/escrow/release`,
      {},
      { reasonCode: reasonCode || 'MANUAL_ESCROW_RELEASE' }
    );
  }
}
