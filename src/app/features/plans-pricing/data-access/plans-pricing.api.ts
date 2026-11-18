import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiClient, ApiResponse, PaginatedResult } from '@nukkadnow/admin-api-client';
import { PricingPlanViewModel, PricingPlanFilterCriteria } from '../models/plans-pricing-view.model';

@Injectable({
  providedIn: 'root'
})
export class PlansPricingApi {
  private readonly client = inject(AdminApiClient);
  private readonly endpoint = '/plans';

  getItems(filters?: PricingPlanFilterCriteria): Observable<ApiResponse<PaginatedResult<PricingPlanViewModel>>> {
    return this.client.getPaginated<PricingPlanViewModel>(this.endpoint, filters as any);
  }

  getById(id: string): Observable<ApiResponse<PricingPlanViewModel>> {
    return this.client.get<PricingPlanViewModel>(`${this.endpoint}/${id}`);
  }

  createPlan(payload: Partial<PricingPlanViewModel>): Observable<ApiResponse<PricingPlanViewModel>> {
    return this.client.post<PricingPlanViewModel>(this.endpoint, payload);
  }

  updatePlan(id: string, payload: Partial<PricingPlanViewModel>, reasonCode?: string): Observable<ApiResponse<PricingPlanViewModel>> {
    return this.client.patch<PricingPlanViewModel>(
      `${this.endpoint}/${id}`,
      payload,
      { reasonCode: reasonCode || 'PLAN_STRUCTURE_TUNING' }
    );
  }
}
