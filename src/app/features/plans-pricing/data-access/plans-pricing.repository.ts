import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PlansPricingApi } from './plans-pricing.api';
import { PlansPricingMapper } from './plans-pricing.mapper';
import { PricingPlanViewModel, PricingPlanFilterCriteria } from '../models/plans-pricing-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';

@Injectable({
  providedIn: 'root'
})
export class PlansPricingRepository {
  private readonly api = inject(PlansPricingApi);

  fetchItems(filters?: PricingPlanFilterCriteria): Observable<PaginatedResult<PricingPlanViewModel>> {
    return this.api.getItems(filters).pipe(
      map(res => ({
        ...res.data,
        items: res.data.items.map(PlansPricingMapper.toViewModel)
      }))
    );
  }

  fetchById(id: string): Observable<PricingPlanViewModel> {
    return this.api.getById(id).pipe(map(res => PlansPricingMapper.toViewModel(res.data)));
  }

  changeStatus(id: string, status: string, reasonCode?: string): Observable<PricingPlanViewModel> {
    return this.api.updateStatus(id, status, reasonCode).pipe(map(res => PlansPricingMapper.toViewModel(res.data)));
  }
}
