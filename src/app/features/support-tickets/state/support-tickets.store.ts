import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SupportTicketsRepository } from '../data-access/support-tickets.repository';
import { SupportTicketViewModel, SupportTicketFilterCriteria } from '../models/support-tickets-view.model';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketsStore {
  private readonly repository = inject(SupportTicketsRepository);

  private readonly itemsState = signal<SupportTicketViewModel[]>([]);
  private readonly selectedItemState = signal<SupportTicketViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadItems(filters?: SupportTicketFilterCriteria): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchItems(filters).subscribe({
      next: (res) => {
        this.itemsState.set(res.items);
        this.totalCountState.set(res.total);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load support tickets');
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
        this.errorState.set(err?.message || 'Failed to load ticket details');
        this.loadingState.set(false);
      }
    });
  }

  addMessage(id: string, text: string, isInternal: boolean): Observable<SupportTicketViewModel> {
    return this.repository.addMessage(id, text, isInternal).pipe(
      tap((updated) => {
        this.itemsState.update((items) =>
          items.map((t) => (t.id === id ? { ...t, ...updated } : t))
        );
        if (this.selectedItemState()?.id === id) {
          this.selectedItemState.set(updated);
        }
      })
    );
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<SupportTicketViewModel> {
    return this.repository.changeStatus(id, status, reasonCode).pipe(
      tap((updated) => {
        this.itemsState.update((items) =>
          items.map((t) => (t.id === id ? { ...t, ...updated, status: status as any } : t))
        );
        if (this.selectedItemState()?.id === id) {
          this.selectedItemState.update((curr) => curr ? { ...curr, ...updated, status: status as any } : null);
        }
      })
    );
  }
}
