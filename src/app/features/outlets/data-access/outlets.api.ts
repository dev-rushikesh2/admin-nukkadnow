import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { OutletViewModel, OutletFilterCriteria } from '../models/outlets-view.model';

@Injectable({
  providedIn: 'root'
})
export class OutletsApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/outlets';

  getItems(filters?: OutletFilterCriteria): Observable<ApiResponse<PaginatedResult<OutletViewModel>>> {
    return this.client.getPaginated<OutletViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<OutletViewModel>> {
    return this.client.get<OutletViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<OutletViewModel>> {
    return this.client.patch<OutletViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
