import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaymentsRepository } from '../data-access/payments.repository';
import { PaymentTransactionViewModel, PaymentTransactionFilterCriteria } from '../models/payments-view.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentsStore {
  private readonly repository = inject(PaymentsRepository);

  private readonly itemsState = signal<PaymentTransactionViewModel[]>([]);
  private readonly selectedItemState = signal<PaymentTransactionViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadItems(filters?: PaymentTransactionFilterCriteria): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchItems(filters).subscribe({
      next: (res) => {
        this.itemsState.set(res.items);
        this.totalCountState.set(res.total);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load payments ledger');
        this.loadingState.set(false);
      }
    });
  }

  loadById(id: string): void {
    this.loadingState.set(true);
    this.repository.fetchById(id).subscribe({
      next: (item) => {
        this.selectedItemState.set(item);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load transaction details');
        this.loadingState.set(false);
      }
    });
  }

  replayWebhook(id: string): Observable<{ replayed: boolean; deliveryTimestamp: string }> {
    return this.repository.replayWebhook(id).pipe(
      tap(() => {
        this.itemsState.update((items) =>
          items.map((txn) => (txn.id === id ? { ...txn, webhookDelivered: true } : txn))
        );
        if (this.selectedItemState()?.id === id) {
          this.selectedItemState.update((curr) => curr ? { ...curr, webhookDelivered: true } : null);
        }
      })
    );
  }

  releaseEscrow(id: string, reasonCode?: string): Observable<PaymentTransactionViewModel> {
    return this.repository.releaseEscrow(id, reasonCode).pipe(
      tap((updated) => {
        this.itemsState.update((items) =>
          items.map((txn) => (txn.id === id ? { ...txn, ...updated } : txn))
        );
        if (this.selectedItemState()?.id === id) {
          this.selectedItemState.set(updated);
        }
      })
    );
  }
}
