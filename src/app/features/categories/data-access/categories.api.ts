import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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

  createCategory(payload: Partial<CategoryViewModel>): Observable<ApiResponse<CategoryViewModel>> {
    return this.client.post<CategoryViewModel>(this.endpoint, payload);
  }

  updateCommission(id: string, commissionPct: number, gstSlabPct: number, reasonCode?: string): Observable<ApiResponse<CategoryViewModel>> {
    return this.client.patch<CategoryViewModel>(
      `${this.endpoint}/${id}/commission`,
      { commissionPct, gstSlabPct },
      { reasonCode: reasonCode || 'COMMISSION_SLAB_TUNING' }
    );
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<CategoryViewModel>> {
    return this.client.patch<CategoryViewModel>(
      `${this.endpoint}/${id}/status`,
      { status },
      { reasonCode: reasonCode || 'CATEGORY_STATE_CHANGE' }
    );
  }
}
