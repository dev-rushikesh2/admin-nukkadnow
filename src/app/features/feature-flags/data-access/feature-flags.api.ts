import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { FeatureFlagViewModel, FeatureFlagFilterCriteria } from '../models/feature-flags-view.model';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/feature-flags';

  getItems(filters?: FeatureFlagFilterCriteria): Observable<ApiResponse<PaginatedResult<FeatureFlagViewModel>>> {
    return this.client.getPaginated<FeatureFlagViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<FeatureFlagViewModel>> {
    return this.client.get<FeatureFlagViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<FeatureFlagViewModel>> {
    return this.client.patch<FeatureFlagViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
