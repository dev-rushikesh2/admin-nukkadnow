import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { CategoryViewModel, CategoryFilterCriteria } from '../models/categories-view.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/categories';

  getItems(filters?: CategoryFilterCriteria): Observable<ApiResponse<PaginatedResult<CategoryViewModel>>> {
    return this.client.getPaginated<CategoryViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<CategoryViewModel>> {
    return this.client.get<CategoryViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<CategoryViewModel>> {
    return this.client.patch<CategoryViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
