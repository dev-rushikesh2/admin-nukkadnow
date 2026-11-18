import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { PlatformAnalyticsViewModel, PlatformAnalyticsFilterCriteria } from '../models/analytics-view.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/analytics';

  getMetrics(filters?: PlatformAnalyticsFilterCriteria): Observable<ApiResponse<PlatformAnalyticsViewModel>> {
    return this.client.get<PlatformAnalyticsViewModel>(this.endpoint, filters as any);
  }

  getItems(filters?: PlatformAnalyticsFilterCriteria): Observable<ApiResponse<PaginatedResult<PlatformAnalyticsViewModel>>> {
    return this.client.getPaginated<PlatformAnalyticsViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<PlatformAnalyticsViewModel>> {
    return this.client.get<PlatformAnalyticsViewModel>(`${this.endpoint}/${id}`);
  }
}
