import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { LocalityViewModel, LocalityFilterCriteria } from '../models/localities-view.model';

@Injectable({
  providedIn: 'root'
})
export class LocalitiesApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/localities';

  getItems(filters?: LocalityFilterCriteria): Observable<ApiResponse<PaginatedResult<LocalityViewModel>>> {
    return this.client.getPaginated<LocalityViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<LocalityViewModel>> {
    return this.client.get<LocalityViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<LocalityViewModel>> {
    return this.client.patch<LocalityViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
