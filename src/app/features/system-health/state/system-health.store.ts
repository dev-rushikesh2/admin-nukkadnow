import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SystemHealthRepository } from '../data-access/system-health.repository';
import { SystemHealthNodeViewModel, SystemHealthSummary, SystemHealthNodeFilterCriteria } from '../models/system-health-view.model';

@Injectable({
  providedIn: 'root'
})
export class SystemHealthStore {
  private readonly repository = inject(SystemHealthRepository);

  private readonly summaryState = signal<SystemHealthSummary | null>(null);
  private readonly itemsState = signal<SystemHealthNodeViewModel[]>([]);
  private readonly selectedItemState = signal<SystemHealthNodeViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly summary = this.summaryState.asReadonly();
  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadHealthSummary(): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchHealthSummary().subscribe({
      next: (summary) => {
        this.summaryState.set(summary);
        this.itemsState.set(summary.nodes);
        this.totalCountState.set(summary.nodes.length);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load telemetry');
        this.loadingState.set(false);
      }
    });
  }

  loadItems(filters?: SystemHealthNodeFilterCriteria): void {
    this.loadHealthSummary();
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

  flushCache(partition?: string, reasonCode?: string, stepUpCode?: string): Observable<any> {
    this.loadingState.set(true);
    return this.repository.flushCache(partition, reasonCode, stepUpCode).pipe(
      tap(() => {
        this.loadHealthSummary();
      })
    );
  }
}
