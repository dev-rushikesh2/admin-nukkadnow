import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { SystemHealthNodeViewModel, SystemHealthNodeFilterCriteria } from '../models/system-health-view.model';

@Injectable({
  providedIn: 'root'
})
export class SystemHealthApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/system-health';

  getItems(filters?: SystemHealthNodeFilterCriteria): Observable<ApiResponse<PaginatedResult<SystemHealthNodeViewModel>>> {
    return this.client.getPaginated<SystemHealthNodeViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<SystemHealthNodeViewModel>> {
    return this.client.get<SystemHealthNodeViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<SystemHealthNodeViewModel>> {
    return this.client.patch<SystemHealthNodeViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
