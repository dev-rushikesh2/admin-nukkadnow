import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { OverviewMetricViewModel, OverviewMetricFilterCriteria } from '../models/overview-view.model';

@Injectable({
  providedIn: 'root'
})
export class OverviewApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/overview';

  getItems(filters?: OverviewMetricFilterCriteria): Observable<ApiResponse<PaginatedResult<OverviewMetricViewModel>>> {
    return this.client.getPaginated<OverviewMetricViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<OverviewMetricViewModel>> {
    return this.client.get<OverviewMetricViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<OverviewMetricViewModel>> {
    return this.client.patch<OverviewMetricViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
