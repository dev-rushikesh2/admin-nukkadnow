import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { SystemHealthNodeViewModel, SystemHealthNodeFilterCriteria } from '../models/system-health-view.model';

@Injectable({
  providedIn: 'root'
})
export class SystemHealthApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/system-health';

  getHealth(): Observable<ApiResponse<any>> {
    return this.client.get<any>(this.endpoint);
  }

  flushCache(partition?: string, reasonCode?: string, stepUpCode?: string): Observable<ApiResponse<any>> {
    return this.client.post<any>(
      `${this.endpoint}/cache/flush`,
      { partition, stepUpCode },
      { reasonCode: reasonCode || 'MANUAL_CACHE_FLUSH', stepUpTicket: stepUpCode }
    );
  }

  getItems(filters?: SystemHealthNodeFilterCriteria): Observable<ApiResponse<PaginatedResult<SystemHealthNodeViewModel>>> {
    return this.client.getPaginated<SystemHealthNodeViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<SystemHealthNodeViewModel>> {
    return this.client.get<SystemHealthNodeViewModel>(`${this.endpoint}/${id}`);
  }
}
