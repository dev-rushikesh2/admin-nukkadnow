import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { PlatformAnalyticsViewModel, PlatformAnalyticsFilterCriteria } from '../models/analytics-view.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/analytics';

  getItems(filters?: PlatformAnalyticsFilterCriteria): Observable<ApiResponse<PaginatedResult<PlatformAnalyticsViewModel>>> {
    return this.client.getPaginated<PlatformAnalyticsViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<PlatformAnalyticsViewModel>> {
    return this.client.get<PlatformAnalyticsViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<PlatformAnalyticsViewModel>> {
    return this.client.patch<PlatformAnalyticsViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
