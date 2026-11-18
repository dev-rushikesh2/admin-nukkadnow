import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubscriptionsRepository } from '../data-access/subscriptions.repository';
import { MerchantSubscriptionViewModel, MerchantSubscriptionFilterCriteria } from '../models/subscriptions-view.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsStore {
  private readonly repository = inject(SubscriptionsRepository);

  private readonly itemsState = signal<MerchantSubscriptionViewModel[]>([]);
  private readonly selectedItemState = signal<MerchantSubscriptionViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadItems(filters?: MerchantSubscriptionFilterCriteria): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchItems(filters).subscribe({
      next: (res) => {
        this.itemsState.set(res.items);
        this.totalCountState.set(res.total);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load merchant subscriptions');
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
        this.errorState.set(err?.message || 'Failed to load subscription details');
        this.loadingState.set(false);
      }
    });
  }

  extendGracePeriod(id: string, days: number, reasonCode?: string): Observable<MerchantSubscriptionViewModel> {
    return this.repository.extendGracePeriod(id, days, reasonCode).pipe(
      tap((updated) => {
        this.itemsState.update((items) =>
          items.map((sub) => (sub.id === id ? { ...sub, ...updated } : sub))
        );
        if (this.selectedItemState()?.id === id) {
          this.selectedItemState.set(updated);
        }
      })
    );
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<MerchantSubscriptionViewModel> {
    return this.repository.changeStatus(id, status, reasonCode).pipe(
      tap((updated) => {
        this.itemsState.update((items) =>
          items.map((sub) => (sub.id === id ? { ...sub, ...updated } : sub))
        );
        if (this.selectedItemState()?.id === id) {
          this.selectedItemState.set(updated);
        }
      })
    );
  }
}
