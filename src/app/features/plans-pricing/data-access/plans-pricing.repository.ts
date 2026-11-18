import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PlansPricingApi } from './plans-pricing.api';
import { PlansPricingMapper } from './plans-pricing.mapper';
import { PricingPlanViewModel, PricingPlanFilterCriteria } from '../models/plans-pricing-view.model';
import { PaginatedResult } from '@nukkadnow/admin-api-client';
import { AuditLoggerService } from '../../../core/audit-context/audit-logger.service';

@Injectable({
  providedIn: 'root'
})
export class PlansPricingRepository {
  private readonly api = inject(PlansPricingApi);
  private readonly auditLogger = inject(AuditLoggerService);

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

  createPlan(payload: Partial<PricingPlanViewModel>): Observable<PricingPlanViewModel> {
    return this.api.createPlan(payload).pipe(
      tap((res) => {
        this.auditLogger.logAction({
          action: 'PRICING_PLAN_CREATED',
          targetEntity: 'PricingPlan',
          targetId: res.data.id,
          reasonCode: 'PLAN_ARCH_CREATION',
          justification: `Created pricing plan tier ${payload.title} at ${payload.monthlyPriceFormatted}/mo`,
        });
      }),
      map(res => PlansPricingMapper.toViewModel(res.data))
    );
  }

  updatePlan(id: string, payload: Partial<PricingPlanViewModel>, reasonCode?: string): Observable<PricingPlanViewModel> {
    return this.api.updatePlan(id, payload, reasonCode).pipe(
      tap(() => {
        this.auditLogger.logAction({
          action: 'PRICING_PLAN_UPDATED',
          targetEntity: 'PricingPlan',
          targetId: id,
          reasonCode: reasonCode || 'PLAN_STRUCTURE_TUNING',
          justification: `Updated pricing parameters for plan ${id}`,
        });
      }),
      map(res => PlansPricingMapper.toViewModel(res.data))
    );
  }
}
