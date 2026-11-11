import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { CatalogItemViewModel, CatalogItemFilterCriteria } from '../models/catalogue-moderation-view.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogueModerationApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/catalogue-moderation';

  getItems(filters?: CatalogItemFilterCriteria): Observable<ApiResponse<PaginatedResult<CatalogItemViewModel>>> {
    return this.client.getPaginated<CatalogItemViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<CatalogItemViewModel>> {
    return this.client.get<CatalogItemViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<CatalogItemViewModel>> {
    return this.client.patch<CatalogItemViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
