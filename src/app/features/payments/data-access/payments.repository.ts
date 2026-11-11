import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PaymentsApi } from './payments.api';
import { PaymentsMapper } from './payments.mapper';
import { PaymentTransactionViewModel, PaymentTransactionFilterCriteria } from '../models/payments-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class PaymentsRepository {
  private readonly api = inject(PaymentsApi);

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

  changeStatus(id: string, status: string, reasonCode?: string): Observable<PaymentTransactionViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => PaymentsMapper.toViewModel(res.data)));
  }
}
