import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CategoriesRepository } from '../data-access/categories.repository';
import { CategoryViewModel, CategoryFilterCriteria } from '../models/categories-view.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesStore {
  private readonly repository = inject(CategoriesRepository);

  private readonly itemsState = signal<CategoryViewModel[]>([]);
  private readonly selectedItemState = signal<CategoryViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadItems(filters?: CategoryFilterCriteria): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchItems(filters).subscribe({
      next: (res) => {
        this.itemsState.set(res.items);
        this.totalCountState.set(res.total);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load categories');
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
        this.errorState.set(err?.message || 'Failed to load category details');
        this.loadingState.set(false);
      }
    });
  }

  createCategory(payload: Partial<CategoryViewModel>): Observable<CategoryViewModel> {
    return this.repository.createCategory(payload).pipe(
      tap((newCategory) => {
        this.itemsState.update((items) => [newCategory, ...items]);
        this.totalCountState.update((c) => c + 1);
      })
    );
  }

  updateCommission(id: string, commissionPct: number, gstSlabPct: number, reasonCode?: string): Observable<CategoryViewModel> {
    return this.repository.updateCommission(id, commissionPct, gstSlabPct, reasonCode).pipe(
      tap((updated) => {
        this.itemsState.update((items) =>
          items.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat))
        );
        if (this.selectedItemState()?.id === id) {
          this.selectedItemState.set(updated);
        }
      })
    );
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<CategoryViewModel> {
    return this.repository.changeStatus(id, status, reasonCode).pipe(
      tap((updated) => {
        this.itemsState.update((items) =>
          items.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat))
        );
        if (this.selectedItemState()?.id === id) {
          this.selectedItemState.set(updated);
        }
      })
    );
  }
}
