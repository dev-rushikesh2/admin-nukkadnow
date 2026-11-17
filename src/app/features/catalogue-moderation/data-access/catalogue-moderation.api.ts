import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import {
  CatalogItemViewModel,
  CatalogItemFilterCriteria,
  PriceCapRuleViewModel,
  CreatePriceCapPayload,
} from '../models/catalogue-moderation-view.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogueModerationApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/api/v1/admin';

  getItems(filters?: CatalogItemFilterCriteria): Observable<ApiResponse<PaginatedResult<CatalogItemViewModel>>> {
    return this.client.getPaginated<CatalogItemViewModel>(`${this.endpoint}/catalogue-moderation`, filters as any);
  }

  getById(id: string): Observable<ApiResponse<CatalogItemViewModel>> {
    return this.client.get<CatalogItemViewModel>(`${this.endpoint}/catalogue-moderation/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<CatalogItemViewModel>> {
    return this.client.patch<CatalogItemViewModel>(`${this.endpoint}/catalogue-moderation/${id}/status`, { status }, { reasonCode });
  }

  // --- Platform Price Caps & Governance ---

  getPriceCaps(): Observable<ApiResponse<PriceCapRuleViewModel[]>> {
    return this.client.get<PriceCapRuleViewModel[]>(`${this.endpoint}/price-caps`);
  }

  createPriceCap(payload: CreatePriceCapPayload): Observable<ApiResponse<PriceCapRuleViewModel>> {
    return this.client.post<PriceCapRuleViewModel>(`${this.endpoint}/price-caps`, payload);
  }

  deactivatePriceCap(id: string): Observable<ApiResponse<{ success: boolean }>> {
    return this.client.delete<{ success: boolean }>(`${this.endpoint}/price-caps/${id}`);
  }

  triggerTtlCleanup(): Observable<ApiResponse<{ success: boolean; expiredReleasedCount: number }>> {
    return this.client.post<{ success: boolean; expiredReleasedCount: number }>(`${this.endpoint}/inventory/cleanup-expired`, {});
  }
}
