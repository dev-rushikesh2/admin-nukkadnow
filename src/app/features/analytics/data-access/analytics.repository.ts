import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AnalyticsApi } from './analytics.api';
import { AnalyticsMapper } from './analytics.mapper';
import { PlatformAnalyticsViewModel, PlatformAnalyticsFilterCriteria } from '../models/analytics-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsRepository {
  private readonly api = inject(AnalyticsApi);

  fetchItems(filters?: PlatformAnalyticsFilterCriteria): Observable<PaginatedResult<PlatformAnalyticsViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(AnalyticsMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<PlatformAnalyticsViewModel> {
    return this.api.getById(id).pipe(map(res => AnalyticsMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<PlatformAnalyticsViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => AnalyticsMapper.toViewModel(res.data)));
  }
}
