import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NotificationsRepository } from '../data-access/notifications.repository';
import { BroadcastNotificationViewModel, BroadcastNotificationFilterCriteria } from '../models/notifications-view.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStore {
  private readonly repository = inject(NotificationsRepository);

  private readonly itemsState = signal<BroadcastNotificationViewModel[]>([]);
  private readonly selectedItemState = signal<BroadcastNotificationViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadItems(filters?: BroadcastNotificationFilterCriteria): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchItems(filters).subscribe({
      next: (res) => {
        this.itemsState.set(res.items);
        this.totalCountState.set(res.total);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load records');
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
        this.errorState.set(err?.message || 'Failed to load record');
        this.loadingState.set(false);
      }
    });
  }

  createItem(payload: Partial<BroadcastNotificationViewModel>): Observable<BroadcastNotificationViewModel> {
    this.loadingState.set(true);
    return this.repository.createItem(payload).pipe(
      tap((newItem) => {
        this.itemsState.update(list => [newItem, ...list]);
        this.totalCountState.update(t => t + 1);
        this.loadingState.set(false);
      })
    );
  }
}
