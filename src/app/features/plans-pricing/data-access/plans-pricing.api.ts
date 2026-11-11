import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { PricingPlanViewModel, PricingPlanFilterCriteria } from '../models/plans-pricing-view.model';

@Injectable({
  providedIn: 'root'
})
export class PlansPricingApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/plans-pricing';

  getItems(filters?: PricingPlanFilterCriteria): Observable<ApiResponse<PaginatedResult<PricingPlanViewModel>>> {
    return this.client.getPaginated<PricingPlanViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<PricingPlanViewModel>> {
    return this.client.get<PricingPlanViewModel>(`${this.endpoint}/${id}`);
  }

  updateStatus(id: string, status: string, reasonCode?: string): Observable<ApiResponse<PricingPlanViewModel>> {
    return this.client.patch<PricingPlanViewModel>(`${this.endpoint}/${id}/status`, { status }, { reasonCode });
  }
}
