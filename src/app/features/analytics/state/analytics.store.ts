import { Injectable, signal, computed, inject } from '@angular/core';
import { AnalyticsRepository } from '../data-access/analytics.repository';
import { PlatformAnalyticsViewModel, PlatformAnalyticsFilterCriteria } from '../models/analytics-view.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsStore {
  private readonly repository = inject(AnalyticsRepository);

  private readonly metricsState = signal<PlatformAnalyticsViewModel | null>(null);
  private readonly itemsState = signal<PlatformAnalyticsViewModel[]>([]);
  private readonly selectedItemState = signal<PlatformAnalyticsViewModel | null>(null);
  private readonly totalCountState = signal<number>(0);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly metrics = this.metricsState.asReadonly();
  readonly items = this.itemsState.asReadonly();
  readonly selectedItem = this.selectedItemState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadMetrics(filters?: PlatformAnalyticsFilterCriteria): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.fetchMetrics(filters).subscribe({
      next: (data) => {
        this.metricsState.set(data);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err?.message || 'Failed to load platform analytics');
        this.loadingState.set(false);
      }
    });
  }

  loadItems(filters?: PlatformAnalyticsFilterCriteria): void {
    this.loadMetrics(filters);
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
}
